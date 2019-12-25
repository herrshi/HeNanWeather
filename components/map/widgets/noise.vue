<template>
  <mdb-card color="white">
    <mdb-card-body>
      <mdb-select
        v-model="monitoringFactor"
        label="监测因子"
        @getValue="$_dataChanged"
      />
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { mdbCard, mdbCardBody, mdbSelect } from 'mdbvue'
import { mapGetters, mapActions, mapState } from 'vuex'
import { loadModules } from 'esri-loader'
import NoiseStationApi from '~/api/NoiseStation'

export default {
  name: 'Noise',

  components: {
    mdbCard,
    mdbCardBody,
    mdbSelect
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
      Graphic: null,
      map: null,
      view: null,
      noiseStations: null,
      stationLayer: null,
      monitoringFactor: [
        {
          text: 'Leq',
          value: 'Leq',
          selected: true
        },
        {
          text: 'L10',
          value: 'L10'
        },
        {
          text: 'L50',
          value: 'L50'
        },
        {
          text: 'SD',
          value: 'SD'
        }
      ]
    }
  },

  computed: {
    ...mapState('app-info', ['appConfig']),
    ...mapGetters('business-data', ['getBusinessData']),

    selectedFactorName() {
      return this.monitoringFactor.find((factor) => factor.selected === true)
        .value
    }
  },

  async mounted() {
    const [FeatureLayer, Graphic] = await loadModules(
      ['esri/layers/FeatureLayer', 'esri/Graphic'],
      {
        url: `${this.appConfig.map.arcgis_api}/init.js`
      }
    )
    this.FeatureLayer = FeatureLayer
    this.Graphic = Graphic

    this.map = await this.getMap()
    this.view = await this.getView()
    this.noiseStations = this.getBusinessData('NoiseSurveillanceStation')
    if (!this.noiseStations) {
      await this.getAllNoiseSurveillanceStation({ isPage: 'NO' })
      this.noiseStations = this.getBusinessData('NoiseSurveillanceStation')
    }

    this.$_dataChanged()
  },

  methods: {
    ...mapActions('business-data', ['getAllNoiseSurveillanceStation']),

    $_createLayer(graphics) {
      const layerConfig = this.appConfig.pageComponents.layerList.find(
        (layerConfig) => layerConfig.dataType === 'NoiseSurveillanceStation'
      )
      const { name, renderer, fields, geometryType } = layerConfig
      const allFields = fields.concat(
        this.monitoringFactor.map((factor) => ({
          name: factor.value,
          alias: factor.text,
          type: 'single'
        }))
      )

      if (this.stationLayer) {
        this.map.remove(this.stationLayer)
      }
      this.stationLayer = new this.FeatureLayer({
        objectIdField: 'FID',
        title: name,
        source: graphics,
        geometryType,
        outFields: ['*'],
        fields: allFields,
        renderer
      })
    },

    async $_setRTData() {
      if (this.stationLayer) {
        this.map.remove(this.stationLayer)
      }

      const graphics = []
      let maxValue = Number.MIN_VALUE
      const rtData = await NoiseStationApi.getRTData()
      for (let i = 0; i < this.noiseStations.length; i++) {
        let station = this.noiseStations[i]
        const { id: stationId, geometry } = station
        const data = rtData.find((data) => data.siteId === stationId)
        if (data) {
          station = { ...station, ...data }
          maxValue = Math.max(maxValue, data[this.selectedFactorName])
        }
        station.FID = i
        if (geometry) {
          graphics.push(new this.Graphic({ geometry, attributes: station }))
        }
      }
      this.$_createLayer(graphics)
      this.stationLayer.renderer = {
        type: 'heatmap',
        field: this.selectedFactorName,
        maxPixelIntensity: maxValue,
        colorStops: [
          { ratio: 0, color: 'rgba(255, 255, 255, 0)' },
          { ratio: 0.2, color: '#4caf50' },
          { ratio: 0.5, color: '#ffeb3b' },
          { ratio: 0.8, color: '#ff9800' },
          { ratio: 1, color: '#f44336' }
        ]
      }
      this.map.add(this.stationLayer)
    },

    $_dataChanged() {
      if (this.widgetConfig.Noise.type === 'rt') {
        this.$_setRTData()
      }
    }
  }
}
</script>

<style scoped>
.card {
  width: 300px;
}
</style>
