<template>
  <div style="height: 100vh">
    <Map theme="light" />
  </div>
</template>

<script>
import { loadModules } from 'esri-loader'
import { mapState } from 'vuex'
import Map from '~/components/map/map'

export default {
  components: { Map },

  async fetch({ store }) {
    await store.dispatch('app-info/getAppConfig')
  },

  data() {
    return {
      layerConfig: []
    }
  },

  computed: {
    ...mapState('app-info', ['appConfig'])
  },

  mounted() {
    const { layers } = this.$route.query
    const allLayerConfigs = this.appConfig.pageComponents.layerList

    if (layers) {
      const layerList = layers.toLowerCase().split(',')
      if (layerList.includes('air')) {
        // 空气监测站点
        this.layerConfig.push(
          ...allLayerConfigs.filter(
            (config) =>
              config.dataType === 'AirQualitySurveillanceStationGK' ||
              config.dataType === 'AirQualitySurveillanceStationSK'
          )
        )
      } else if (layerList.includes('water')) {
        // 地表水监测站点
        this.layerConfig.push(
          ...allLayerConfigs.filter(
            (config) =>
              config.dataType === 'SurfaceWaterSurveillanceStationGK' ||
              config.dataType === 'SurfaceWaterSurveillanceStationSK'
          )
        )
      } else if (layerList.includes('pollutantsource')) {
        // 污染源
        this.layerConfig.push(
          ...allLayerConfigs.filter(
            (config) => config.dataType === 'PollutantSourceEnterprise'
          )
        )
      } else if (layerList.includes('soil')) {
        // 污染地块
        this.layerConfig.push(
          ...allLayerConfigs.filter(
            (config) => config.dataType === 'SoilPollutantArea'
          )
        )
      } else if (layerList.includes('medical')) {
        // 医疗固废监测站
        this.layerConfig.push(
          ...allLayerConfigs.filter(
            (config) => config.dataType === 'MedicalWasteSurveillanceStation'
          )
        )
      } else if (layerList.includes('radiation')) {
        // 辐射源监测站
        this.layerConfig.push(
          ...allLayerConfigs.filter(
            (config) => config.dataType === 'RadiationSourceSurveillanceStation'
          )
        )
      } else if (layerList.includes('radioactive')) {
        // 放射源监测站
        this.layerConfig.push(
          ...allLayerConfigs.filter(
            (config) =>
              config.dataType === 'RadioactiveSourceSurveillanceStation'
          )
        )
      } else if (layerList.includes('noise')) {
        // 噪声监测站
        this.layerConfig.push(
          ...allLayerConfigs.filter(
            (config) => config.dataType === 'NoiseSurveillanceStation'
          )
        )
      } else if (layerList.includes('reserve')) {
        // 保护区
        this.layerConfig.push(
          ...allLayerConfigs.filter((config) => config.dataType === 'Reserve')
        )
      }
    }
  },

  methods: {
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
    }
  }
}
</script>

<style scoped></style>
