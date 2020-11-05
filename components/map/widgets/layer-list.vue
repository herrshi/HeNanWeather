<template>
  <mdb-btn-group>
    <mdb-btn
      v-for="(layerConfig, index) in layerListConfig"
      :key="index"
      rounded
      size="sm"
      color="primary"
      :active="layerConfig.active"
      @click="$_toggleButton(layerConfig)"
    >
      {{ layerConfig.buttonName }}
    </mdb-btn>

    <mdb-btn
      v-if="true"
      rounded
      size="sm"
      color="primary"
      :active="showNonRoadMachinery"
      @click="$_toggleNonRoadMachinery"
    >
      非道路
    </mdb-btn>

    <mdb-btn
      :color="isCluster ? 'success' : 'blue-grey'"
      rounded
      size="sm"
      @click="$_toggleCluster"
    >
      聚合
    </mdb-btn>
  </mdb-btn-group>

  <!-- <div>
    <mdb-btn-group>
      <mdb-btn
        v-for="(layerConfig, index) in layerListConfig1"
        :key="index"
        rounded
        size="sm"
        color="primary"
        :active="layerConfig.active"
        @click="$_toggleButton(layerConfig)"
      >
        {{ layerConfig.buttonName }}
      </mdb-btn>
    </mdb-btn-group>

    <mdb-btn-group>
      <mdb-btn
        v-for="(layerConfig, index) in layerListConfig2"
        :key="index"
        rounded
        size="sm"
        color="primary"
        :active="layerConfig.active"
        @click="$_toggleButton(layerConfig)"
      >
        {{ layerConfig.buttonName }}
      </mdb-btn>

      <mdb-btn
        rounded
        size="sm"
        color="primary"
        :active="showNonRoadMachinery"
        @click="$_toggleNonRoadMachinery"
      >
        非道路
      </mdb-btn>

      <mdb-btn
        :color="isCluster ? 'success' : 'blue-grey'"
        rounded
        size="sm"
        @click="$_toggleCluster"
      >
        聚合
      </mdb-btn>
    </mdb-btn-group>
  </div> -->
</template>

<script>
import { mdbBtn, mdbBtnGroup } from 'mdbvue'
import { mapGetters, mapMutations, mapState } from 'vuex'
import { loadModules } from 'esri-loader'

export default {
  name: 'LayerList',

  inject: ['getMap', 'getView'],

  components: {
    mdbBtn,
    mdbBtnGroup
  },

  data() {
    return {
      view: null,
      isCluster: true,
      legend: null,
      showNonRoadMachinery: false
    }
  },

  computed: {
    ...mapState(['mapOnly']),
    ...mapState('app-info', ['appConfig']),
    ...mapState('map', ['layerListWidgetVisible', 'showLayer', 'showLegend']),
    ...mapGetters('business-data', ['getBusinessData']),
    ...mapGetters('map', [
      'businessLayer',
      'businessClusterLayer',
      'visibleBusinessLayer'
    ]),

    layerListConfig() {
      // 只需要显示前三个图层，其他隐藏
      // return this.appConfig.pageComponents.layerList.slice(0, 6)
      const layerConfig = this.appConfig.pageComponents.layerList.filter(
        (layer) => layer.include
      )
      return layerConfig
    },

    layerListConfig1() {
      return this.appConfig.pageComponents.layerList.slice(0, 7)
    },

    layerListConfig2() {
      return this.appConfig.pageComponents.layerList.slice(7)
    }
  },

  async mounted() {
    this.startUpdating()

    this.view = await this.getView()
    const map = await this.getMap()

    const [Legend, Expand] = await loadModules(
      ['esri/widgets/Legend', 'esri/widgets/Expand'],
      {
        url: `${this.appConfig.map.arcgis_api}/init.js`
      }
    )
    this.legend = new Legend({
      view: this.view,
      layerInfos: this.visibleBusinessLayer.map((visibleLayer) => ({
        title: visibleLayer.title,
        layer: visibleLayer
      }))
    })
    const legendExpand = new Expand({
      view: this.view,
      name: 'Legend',
      content: this.legend,
      expandIconClass: 'esri-icon-public',
      // 不显示导航栏的页面要显示图例
      expanded: this.showLegend
    })
    this.view.ui.add(legendExpand, 'bottom-left')

    // foreach中不能使用async/await
    for (let i = 0; i < this.layerListConfig.length; i++) {
      const layerConfig = this.layerListConfig[i]

      const featureLayer = await this.$_createFeatureLayer(layerConfig)
      if (featureLayer) {
        this.addBusinessLayer({
          type: layerConfig.dataType,
          layer: featureLayer
        })
        map.add(featureLayer)
      }

      const clusterLayer = await this.$_createClusterLayer(layerConfig)
      if (clusterLayer) {
        this.addBusinessClusterLayer({
          type: layerConfig.dataType,
          layer: clusterLayer
        })
        map.add(clusterLayer)
      }
    }

    this.isCluster = !this.mapOnly && this.layerListWidgetVisible

    if (this.showLayer.length > 0) {
      this.layerListConfig.forEach((layerConfig) => {
        const { dataType } = layerConfig
        this.setLayerActive({
          type: dataType,
          active: this.showLayer.includes(dataType)
        })
      })
      if (this.showLayer.includes('SurfaceWaterSurveillanceStation')) {
        this.setLayerActive({
          type: 'SurfaceWaterSurveillanceStationGK',
          active: true
        })
        this.setLayerActive({
          type: 'SurfaceWaterSurveillanceStationSK',
          active: true
        })
      }
      if (this.showLayer.includes('AirQualitySurveillanceStation')) {
        this.setLayerActive({
          type: 'AirQualitySurveillanceStationGK',
          active: true
        })
        this.setLayerActive({
          type: 'AirQualitySurveillanceStationSK',
          active: true
        })
      }
    }

    this.resetLayers()
    this.stopUpdating()
  },

  methods: {
    ...mapMutations('app-info', ['setLayerActive']),
    ...mapMutations('map', [
      'addBusinessLayer',
      'addBusinessClusterLayer',
      'startUpdating',
      'stopUpdating'
    ]),

    async $_createClusterLayer(layerConfig) {
      const { dataType, renderer, popupTemplate } = layerConfig
      let features = this.getBusinessData(dataType)
      if (!features || features.length === 0) {
        await this.$store.dispatch(`business-data/getAll${dataType}`, {
          isPage: 'NO'
        })
        features = this.getBusinessData(dataType)
        if (!features || features.length === 0) {
          return null
        }
      }
      // 只对点图层做聚合
      if (features[0].geometry.type !== 'point') {
        return null
      }
      const data = features.map((feature) => ({
        ...feature,
        x: feature.geometry.x,
        y: feature.geometry.y
      }))

      const [ClassBreaksRenderer, FlareClusterLayer] = await loadModules(
        [
          'esri/renderers/ClassBreaksRenderer',
          'esri/extra/fcl/FlareClusterLayer_v4'
        ],
        {
          url: `${this.appConfig.map.arcgis_api}/init.js`
        }
      )
      const defaultSymbol = renderer.defaultSymbol || renderer.symbol
      const clusterRenderer = new ClassBreaksRenderer({
        defaultSymbol,
        field: 'clusterCount',
        classBreakInfos: [
          {
            minValue: 0,
            maxValue: 20,
            symbol: {
              type: 'picture-marker',
              url: '/images/m0.png',
              width: '35px',
              height: '35px'
            }
          },
          {
            minValue: 21,
            maxValue: 50,
            symbol: {
              type: 'picture-marker',
              url: '/images/m2.png',
              width: '40px',
              height: '40px'
            }
          },
          {
            minValue: 51,
            maxValue: 100,
            symbol: {
              type: 'picture-marker',
              url: '/images/m2.png',
              width: '50px',
              height: '50px'
            }
          },
          {
            minValue: 101,
            symbol: {
              type: 'picture-marker',
              url: '/images/m4.png',
              width: '60px',
              height: '60px'
            }
          }
        ]
      })

      const defaultAreaSymbol = {
        type: 'simple-fill',
        color: [0, 0, 0, 0.2],
        outline: {
          type: 'simple-line',
          color: [0, 0, 0, 0.3]
        }
      }
      const areaRenderer = new ClassBreaksRenderer({
        defaultSymbol: defaultAreaSymbol,
        field: 'clusterCount',
        classBreakInfos: [
          {
            minValue: 0,
            maxValue: 20,
            symbol: {
              type: 'simple-fill',
              color: [255, 204, 102, 0.4],
              outline: {
                type: 'simple-line',
                style: 'dash',
                color: [221, 159, 34, 0.8]
              }
            }
          },
          {
            minValue: 21,
            maxValue: 150,
            symbol: {
              type: 'simple-fill',
              color: [102, 204, 255, 0.4],
              outline: {
                type: 'simple-line',
                style: 'dash',
                color: [82, 163, 204, 0.8]
              }
            }
          },
          {
            minValue: 151,
            maxValue: 1000,
            symbol: {
              type: 'simple-fill',
              color: [51, 204, 51, 0.4],
              outline: {
                type: 'simple-line',
                style: 'dash',
                color: [41, 163, 41, 0.8]
              }
            }
          },
          {
            minValue: 1001,
            symbol: {
              type: 'simple-fill',
              color: [250, 65, 74, 0.4],
              outline: {
                type: 'simple-line',
                style: 'dash',
                color: [200, 52, 59, 0.8]
              }
            }
          }
        ]
      })

      const flareRenderer = new ClassBreaksRenderer({
        defaultSymbol,
        field: 'clusterCount',
        classBreakInfos: [
          {
            minValue: 0,
            maxValue: 20,
            symbol: {
              type: 'simple-marker',
              size: 14,
              color: [255, 204, 102, 0.8],
              outline: {
                type: 'simple-line',
                color: [221, 159, 34, 0.8]
              }
            }
          },
          {
            minValue: 21,
            maxValue: 150,
            symbol: {
              type: 'simple-marker',
              size: 14,
              color: [102, 204, 255, 0.8],
              outline: {
                type: 'simple-line',
                color: [82, 163, 204, 0.8]
              }
            }
          },
          {
            minValue: 151,
            maxValue: 1000,
            symbol: {
              type: 'simple-marker',
              size: 14,
              color: [51, 204, 51, 0.8],
              outline: {
                type: 'simple-line',
                color: [41, 163, 41, 0.8]
              }
            }
          },
          {
            minValue: 1001,
            symbol: {
              type: 'simple-marker',
              size: 14,
              color: [250, 65, 74, 0.8],
              outline: {
                type: 'simple-line',
                color: [200, 52, 59, 0.8]
              }
            }
          }
        ]
      })

      return new FlareClusterLayer.FlareClusterLayer({
        id: `cluster${dataType}`,
        singlePopupTemplate: popupTemplate,
        clusterRenderer,
        areaRenderer,
        flareRenderer,
        spatialReference: { wkid: 4326 },
        maxSingleFlareCount: 8,
        clusterRatio: 75,
        clusterToScale: 10000,
        clusterAreaDisplay: 'activated',
        visible: false,
        data
      })
    },

    async $_createFeatureLayer(layerConfig) {
      const [FeatureLayer, Graphic] = await loadModules(
        ['esri/layers/FeatureLayer', 'esri/Graphic'],
        {
          url: `${this.appConfig.map.arcgis_api}/init.js`
        }
      )
      const {
        name,
        dataType,
        renderer,
        popupTemplate,
        fields,
        // active = false,
        geometryType
      } = layerConfig

      let features = this.getBusinessData(dataType)
      if (!features || features.length === 0) {
        await this.$store.dispatch(`business-data/getAll${dataType}`, {
          isPage: 'NO'
        })
        features = this.getBusinessData(dataType)
        if (!features || features.length === 0) {
          return null
        }
      }
      const graphics = []
      for (let i = 0; i < features.length; i++) {
        const feature = features[i]
        const { geometry } = feature
        feature.FID = i
        if (geometry) {
          graphics.push(new Graphic({ geometry, attributes: feature }))
        }
      }

      // const clusterLayer = new FlareClusterLayer.FlareClusterLayer()
      // console.log(clusterLayer)

      return new FeatureLayer({
        objectIdField: 'FID',
        title: name,
        source: graphics,
        geometryType,
        outFields: ['*'],
        visible: false,
        fields,
        renderer,
        popupTemplate
      })
    },

    $_toggleCluster() {
      this.isCluster = !this.isCluster
      this.resetLayers()
    },

    $_toggleNonRoadMachinery() {
      this.showNonRoadMachinery = !this.showNonRoadMachinery
      if (this.showNonRoadMachinery) {
        this.$parent.$parent.$parent.addWidget({
          name: 'NonRoadMachinery'
        })
      } else {
        this.$parent.$parent.$parent.removeWidget({
          name: 'NonRoadMachinery'
        })
      }
    },

    $_toggleButton(layerConfig) {
      const { dataType } = layerConfig
      const active = !layerConfig.active
      this.setLayerActive({ type: dataType, active })
      // 关闭已打开的弹窗
      if (!active) {
        this.$parent.$parent.$parent.closePopup()
      }

      if (!this.isCluster) {
        const layer = this.businessLayer(dataType)
        if (layer) {
          layer.visible = active
        }
      } else {
        const layer = this.businessClusterLayer(dataType)
        if (layer) {
          layer.visible = active
        }
      }

      // this.legend.layerInfos = this.visibleBusinessLayer.map(
      //   (visibleLayer) => ({
      //     title: visibleLayer.label,
      //     layer: visibleLayer
      //   })
      // )
    },

    resetLayers() {
      this.layerListConfig.forEach((layerConfig) => {
        const { dataType, active } = layerConfig
        const featureLayer = this.businessLayer(dataType)
        const clusterLayer = this.businessClusterLayer(dataType)
        if (this.isCluster) {
          if (clusterLayer) clusterLayer.visible = active
          if (featureLayer) featureLayer.visible = false
        } else {
          if (clusterLayer) clusterLayer.visible = false
          if (featureLayer) featureLayer.visible = active
        }
      })

      // this.legend.layerInfos = this.visibleBusinessLayer.map(
      //   (visibleLayer) => ({
      //     title: visibleLayer.title,
      //     layer: visibleLayer
      //   })
      // )
    }
  }
}
</script>

<style scoped>
.btn-group {
  width: 900px;
}
</style>
