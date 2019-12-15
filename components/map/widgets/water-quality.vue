<template>
  <mdb-card color="white">
    <mdb-card-body>
      <mdb-select
        v-model="monitoringFactor"
        label="监测因子: "
        @getValue="$_setRenderer"
      />
      <mdb-form-inline v-if="widgetConfig.WaterQuality.type !== 'rt'">
        <mdb-date-picker label="请选择开始日期" class="black-text" />
        <mdb-time-picker label="请选择开始时间" />
      </mdb-form-inline>
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import {
  mdbCard,
  mdbCardBody,
  mdbSelect,
  mdbFormInline,
  mdbDatePicker,
  mdbTimePicker
} from 'mdbvue'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import { loadModules } from 'esri-loader'

export default {
  name: 'WaterQuality',

  components: {
    mdbCard,
    mdbCardBody,
    mdbSelect,
    mdbFormInline,
    mdbDatePicker,
    mdbTimePicker
  },

  inject: ['getMap', 'getView'],

  props: {
    widgetConfig: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      FeatureLayer: null,
      Field: null,
      Graphic: null,
      map: null,
      view: null,
      legend: null,

      waterStationLayer: null,
      countyLayer: null,

      stationGraphics: [],
      monitoringFactor: []
    }
  },

  computed: {
    ...mapState('app-info', ['appConfig']),
    ...mapState('business-data', ['waterMonitoringFactorMap']),
    ...mapGetters('map', ['businessLayer']),
    ...mapGetters('business-data', ['getBusinessData']),

    selectedFactor() {
      return this.monitoringFactor.find((factor) => factor.selected === true)
    }
  },

  async mounted() {
    this.startFetchData()

    for (const [key, value] of this.waterMonitoringFactorMap) {
      this.monitoringFactor.push({
        text: value.name,
        value: key
      })
    }
    this.monitoringFactor[0].selected = true

    const [Graphic, FeatureLayer, Field, Legend, Expand] = await loadModules(
      [
        'esri/Graphic',
        'esri/layers/FeatureLayer',
        'esri/layers/support/Field',
        'esri/widgets/Legend',
        'esri/widgets/Expand'
      ],
      {
        url: `${this.appConfig.map.arcgis_api}/init.js`
      }
    )
    this.Graphic = Graphic
    this.FeatureLayer = FeatureLayer
    this.Field = Field

    this.view = await this.getView()
    this.map = await this.getMap()

    // 图例
    this.legend = new Legend({
      view: this.view,
      layerInfos: [
        {
          layer: this.waterStationLayer,
          title: '地表水'
        }
      ]
    })
    const expandLegend = new Expand({
      view: this.view,
      content: this.legend,
      name: 'Legend',
      expandIconClass: 'esri-icon-collection',
      expandTooltip: '图例',
      expanded: false
    })
    this.view.ui.add(expandLegend, 'bottom-left')

    this.view.on('click', async (event) => {
      const response = await this.view.hitTest(event)
      if (response.results.length) {
        const countryResult = response.results.find(
          (result) => result.graphic.layer === this.countyLayer
        )
        if (countryResult) {
          const graphic = countryResult.graphic
          if (graphic) {
            this.$emit('mapPopupTriggerAction', {
              actionId: 'showCountryWaterQualityModal',
              selectedGraphic: graphic
            })
          }
        }
      }
    })

    await this.$_addCountyLayer()
    this.$_dateChanged()

    this.stopFetchData()
  },

  methods: {
    ...mapMutations('business-data', ['startFetchData', 'stopFetchData']),
    ...mapActions('map', ['createFeatureLayer']),
    ...mapActions('business-data', [
      'getWaterStationRTData',
      'getAllSurfaceWaterSurveillanceStation'
    ]),

    async $_addCountyLayer() {
      // 加入县级市图层
      const response = await fetch(
        `${process.env.baseUrl}/layer/HeNan_Prefecture_Level_City.json`
      )
      const countyLayerData = await response.json()
      this.countyLayer = new this.FeatureLayer({
        objectIdField: 'FID',
        source: countyLayerData.features.map((feature) =>
          this.Graphic.fromJSON(feature)
        ),
        fields: countyLayerData.fields.map((field) =>
          this.Field.fromJSON(field)
        ),
        outFields: ['*'],
        labelingInfo: [
          {
            labelExpressionInfo: {
              expression: '$feature.name'
            },
            symbol: {
              type: 'text',
              font: {
                family: 'yahei',
                size: 10
              },
              haloSize: 1,
              haloColor: 'white'
            }
          }
        ],
        renderer: {
          type: 'simple',
          symbol: {
            type: 'simple-fill',
            color: [3, 169, 244, 0.3],
            outline: {
              color: '#3f51b5',
              width: 1
            }
          }
        }
      })
      this.map.add(this.countyLayer)

      const dataType = 'SurfaceWaterSurveillanceStation'
      let features = this.getBusinessData(dataType)
      if (!features) {
        await this.getAllSurfaceWaterSurveillanceStation({ isPage: 'NO' })
        features = this.getBusinessData(dataType)
        if (!features || features.length === 0) {
          return null
        }
      }
      for (let i = 0; i < features.length; i++) {
        const feature = features[i]
        const { geometry } = feature
        feature.FID = i
        if (geometry) {
          this.stationGraphics.push(
            new this.Graphic({ geometry, attributes: feature })
          )
        }
      }
    },

    async $_dateChanged() {
      switch (this.widgetConfig.WaterQuality.type) {
        case 'rt':
          await this.$_setRTData()
          break
        default:
          await this.$_setDailyData()
          break
      }
    },

    async $_setRTData() {
      // 加入监测站图层
      const dataType = 'SurfaceWaterSurveillanceStation'
      const layerConfig = this.appConfig.pageComponents.layerList.find(
        (layer) => layer.dataType === dataType
      )
      const { name, fields: layerFields, geometryType } = layerConfig

      await this.getWaterStationRTData()
      const results = this.getBusinessData('WaterStationRTData')

      this.stationGraphics.forEach((graphic) => {
        const data = results.find(
          (result) => result.SITEINFOID === graphic.getAttribute('id')
        )
        if (data) {
          graphic.attributes = { ...graphic.attributes, ...data }
        }
      })

      const dataFields = this.monitoringFactor
        .map((factor) => ({
          name: factor.value,
          alias: factor.text,
          type: 'string'
        }))
        .concat({
          name: 'color',
          type: 'string'
        })
      const allFields = layerFields.concat(dataFields)

      this.waterStationLayer = new this.FeatureLayer({
        objectIdField: 'FID',
        source: this.stationGraphics,
        label: name,
        geometryType,
        fields: allFields.map((field) => this.Field.fromJSON(field)),
        outFields: ['*'],
        popupTemplate: {
          title: '{Name}',
          content: [
            {
              type: 'fields',
              fieldInfos: this.monitoringFactor.map((factor) => ({
                fieldName: factor.value,
                label: factor.text
              }))
            }
          ]
        }
      })
      this.map.add(this.waterStationLayer)
      this.$_setRenderer()
    },

    $_setRenderer() {
      if (this.waterStationLayer) {
        const factor = this.selectedFactor.value
        const factorInfo = this.waterMonitoringFactorMap.get(factor)
        const { low, high } = factorInfo
        if (low === high) {
          this.waterStationLayer.renderer = {
            type: 'simple',
            symbol: {
              type: 'simple-marker',
              style: 'circle',
              size: '12px',
              color: [0, 188, 212, 0.7],
              outline: {
                color: '#1a237e'
              }
            }
          }
        } else {
          this.waterStationLayer.renderer = {
            type: 'class-breaks',
            field: factor,
            defaultSymbol: {
              type: 'simple-marker',
              style: 'circle',
              size: '12px',
              color: [62, 69, 81, 0.7],
              outline: {
                color: '#424242'
              }
            },
            defaultLabel: '无数据',
            classBreakInfos: [
              {
                maxValue: low,
                label: '<' + low,
                symbol: {
                  type: 'simple-marker',
                  style: 'circle',
                  size: '12px',
                  color: [244, 67, 54, 0.7],
                  outline: {
                    color: '#b71c1c'
                  }
                }
              },
              {
                minValue: low,
                maxValue: high,
                label: low + '--' + high,
                symbol: {
                  type: 'simple-marker',
                  style: 'circle',
                  size: '12px',
                  color: [76, 175, 80, 0.7],
                  outline: {
                    color: '#1b5e20'
                  }
                }
              },
              {
                minValue: high,
                label: '>' + high,
                symbol: {
                  type: 'simple-marker',
                  style: 'circle',
                  size: '12px',
                  color: [244, 67, 54, 0.7],
                  outline: {
                    color: '#b71c1c'
                  }
                }
              }
            ]
          }
        }
      }

      if (this.legend) this.legend.layerInfos[0].layer = this.waterStationLayer
    },

    $_setDailyData() {
      const dataType = 'SurfaceWaterSurveillanceStation'
      const layerConfig = this.appConfig.pageComponents.layerList.find(
        (layer) => layer.dataType === dataType
      )
      const { name, fields, geometryType } = layerConfig
      this.waterStationLayer = new this.FeatureLayer({
        objectIdField: 'FID',
        source: this.stationGraphics,
        label: name,
        geometryType,
        fields: fields.map((field) => this.Field.fromJSON(field)),
        outFields: ['*'],
        renderer: {
          type: 'simple',
          symbol: {
            type: 'simple-marker',
            style: 'circle',
            size: '12px',
            color: [0, 188, 212, 0.7],
            outline: {
              color: '#1a237e'
            }
          }
        }
      })
      this.map.add(this.waterStationLayer)
    }
  }
}
</script>

<style scoped>
.card {
  width: 300px;
}
</style>
