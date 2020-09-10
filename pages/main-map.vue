<template>
  <div style="height: 100vh">
    <Map
      ref="main_map"
      theme="light"
      :widgets="['NearbySearch']"
      @mapInitialized="$_mapInitialized"
      @mapPopupTriggerAction="$_map_popupTriggerAction"
    />

    <air-station-detail
      :show-modal="showAirStationDetailModal"
      :station-id="detailAirStationId"
      @closeDetail="showAirStationDetailModal = false"
    />

    <water-station-detail
      :show-modal="showWaterStationDetailModal"
      :station-id="detailWaterStationId"
      @closeDetail="showWaterStationDetailModal = false"
    />

    <pollutant-source-detail
      :show-modal="showPollutantSourceDetailModal"
      :station-id="detailPollutantSourceId"
      @closeDetail="showPollutantSourceDetailModal = false"
    />

    <Loader v-if="showLoading" class="float-right" />
  </div>
</template>

<script>
import { loadModules } from 'esri-loader'
import { mapState, mapGetters, mapMutations } from 'vuex'
import Map from '~/components/map/map'
import Loader from '~/components/loader'
import AirStationDetail from '~/components/modals/air-station-detail'
import WaterStationDetail from '~/components/modals/water-station-detail'
import PollutantSourceDetail from '~/components/modals/pollutant-source-detail'

export default {
  name: 'MainMap',

  components: {
    Map,
    Loader,
    AirStationDetail,
    WaterStationDetail,
    PollutantSourceDetail
  },

  async fetch({ store }) {
    await store.dispatch('app-info/getAppConfig')
    await store.dispatch('business-data/getWaterMonitorFactorInfos')
  },

  data() {
    return {
      map: null,
      view: null,
      layerConfigs: [],
      showAirStationDetailModal: false,
      showWaterStationDetailModal: false,
      showPollutantSourceDetailModal: false,
      detailAirStationId: '',
      detailWaterStationId: '',
      detailPollutantSourceId: ''
    }
  },

  computed: {
    ...mapState('app-info', ['appConfig']),
    ...mapGetters('business-data', ['getBusinessData']),
    ...mapGetters('map', ['visibleBusinessLayer']),
    ...mapGetters(['showLoading'])
  },

  mounted() {
    const { layers } = this.$route.query
    // 深拷贝
    const oriLayerConfigs = JSON.parse(
      JSON.stringify(this.appConfig.pageComponents.layerList)
    )
    const allLayerConfigs = oriLayerConfigs.reverse()

    if (layers) {
      const layerList = layers.toLowerCase().split(',')
      if (layerList.includes('air')) {
        // 空气监测站点
        this.layerConfigs.push(
          ...allLayerConfigs.filter(
            (config) =>
              config.dataType === 'AirQualitySurveillanceStationGK' ||
              config.dataType === 'AirQualitySurveillanceStationSK'
          )
        )
      }
      if (layerList.includes('water')) {
        // 地表水监测站点
        this.layerConfigs.push(
          ...allLayerConfigs.filter(
            (config) =>
              config.dataType === 'SurfaceWaterSurveillanceStationGK' ||
              config.dataType === 'SurfaceWaterSurveillanceStationSK'
          )
        )
      }
      if (layerList.includes('pollutantsource')) {
        // 污染源
        this.layerConfigs.push(
          ...allLayerConfigs.filter(
            (config) => config.dataType === 'PollutantSourceEnterprise'
          )
        )
      }
      if (layerList.includes('soil')) {
        // 污染地块
        this.layerConfig.push(
          ...allLayerConfigs.filter(
            (config) => config.dataType === 'SoilPollutantArea'
          )
        )
      }
      if (layerList.includes('medical')) {
        // 医疗固废监测站
        this.layerConfigs.push(
          ...allLayerConfigs.filter(
            (config) => config.dataType === 'MedicalWasteSurveillanceStation'
          )
        )
      }
      if (layerList.includes('radiation')) {
        // 辐射源监测站
        this.layerConfig.push(
          ...allLayerConfigs.filter(
            (config) => config.dataType === 'RadiationSourceSurveillanceStation'
          )
        )
      }
      if (layerList.includes('radioactive')) {
        // 放射源监测站
        this.layerConfigs.push(
          ...allLayerConfigs.filter(
            (config) =>
              config.dataType === 'RadioactiveSourceSurveillanceStation'
          )
        )
      }
      if (layerList.includes('noise')) {
        // 噪声监测站
        this.layerConfigs.push(
          ...allLayerConfigs.filter(
            (config) => config.dataType === 'NoiseSurveillanceStation'
          )
        )
      }
      if (layerList.includes('reserve')) {
        // 保护区
        this.layerConfigs.push(
          ...allLayerConfigs.filter((config) => config.dataType === 'Reserve')
        )
      }
    }
  },

  methods: {
    ...mapMutations('map', ['addBusinessLayer']),

    async $_mapInitialized() {
      await this.$_showLayers()
      await this.$_showLegend()
    },

    async $_showLegend() {
      const view = this.$refs.main_map.view
      // 专题图的页面较大，地图需要放大一级
      await view.goTo({ zoom: ++view.zoom })

      const [Legend, Expand] = await loadModules(
        ['esri/widgets/Legend', 'esri/widgets/Expand'],
        {
          url: `${this.appConfig.map.arcgis_api}/init.js`
        }
      )
      const legend = new Legend({
        view,
        layerInfos: this.visibleBusinessLayer.map((visibleLayer) => ({
          title: visibleLayer.title,
          layer: visibleLayer
        }))
      })
      const legendExpand = new Expand({
        view,
        name: 'Legend',
        content: legend,
        expandIconClass: 'esri-icon-public'
        // 不显示导航栏的页面要显示图例
        // expanded: this.showLegend
      })
      view.ui.add(legendExpand, 'bottom-left')
    },

    async $_showLayers() {
      const map = this.$refs.main_map.map
      for (let i = 0; i < this.layerConfigs.length; i++) {
        const layerConfig = this.layerConfigs[i]
        const featureLayer = await this.$_createFeatureLayer(layerConfig)
        if (featureLayer) {
          this.addBusinessLayer({
            type: layerConfig.dataType,
            layer: featureLayer
          })
          map.add(featureLayer)
        }
      }
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

      return new FeatureLayer({
        objectIdField: 'FID',
        title: name,
        source: graphics,
        geometryType,
        outFields: ['*'],
        visible: true,
        fields,
        renderer,
        popupTemplate
      })
    },

    $_map_popupTriggerAction(event) {
      switch (event.actionId) {
        case 'DetailAir':
          this.detailAirStationId = event.selectedGraphic.getAttribute('id')
          this.showAirStationDetailModal = true
          break

        case 'DetailWater':
          this.detailWaterStationId = event.selectedGraphic.getAttribute('id')
          this.showWaterStationDetailModal = true
          break

        case 'DetailPollutantSource':
          this.detailPollutantSourceId = event.selectedGraphic.getAttribute(
            'id'
          )
          this.showPollutantSourceDetailModal = true
          break
      }
    }
  }
}
</script>

<style scoped></style>
