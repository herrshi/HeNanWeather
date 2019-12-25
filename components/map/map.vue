<template>
  <mdb-row class="w-100 h-100 mx-0">
    <mdb-col
      :col="showNearbySearch ? '8' : '12'"
      :class="showNearbySearch ? 'pl-0 pr-1' : 'pl-0 pr-0'"
    >
      <div id="divWidgets">
        <div v-if="false" id="divOverlay">
          <Overlay ref="widgetOverlay" />
        </div>

        <div v-if="widgets && widgets.includes('LayerList')" id="divLayerList">
          <layer-list ref="widgetLayerList" />
        </div>

        <div
          v-if="widgets && widgets.includes('FeatureEditor')"
          id="divFeatureEditor"
        >
          <feature-editor :widget-config="widgetConfig" />
        </div>

        <div
          v-if="widgets && widgets.includes('AirQuality')"
          id="divAirQuality"
        >
          <air-quality :widget-config="widgetConfig" />
        </div>

        <div
          v-if="widgets && widgets.includes('WaterQuality')"
          id="divWaterQuality"
        >
          <water-quality
            :widget-config="widgetConfig"
            @mapPopupTriggerAction="$_triggerPopupActionManual"
          />
        </div>
        <div v-if="widgets && widgets.includes('Noise')" id="divNoise">
          <Noise :widget-config="widgetConfig" />
        </div>
      </div>
      <div id="MapDiv" class="w-100 h-100"></div>
    </mdb-col>

    <mdb-col v-show="showNearbySearch" class="pr-0">
      <NearbySearch ref="widgetNearbySearch" />
    </mdb-col>
  </mdb-row>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { loadCss, loadModules } from 'esri-loader'
import { mdbCol, mdbRow } from 'mdbvue'
import Overlay from '~/components/map/widgets/overlay'
import LayerList from '~/components/map/widgets/layer-list'
import NearbySearch from '~/components/map/widgets/nearby-search'
import FeatureEditor from '~/components/map/widgets/feature-editor'
import AirQuality from '~/components/map/widgets/air-quality'
import WaterQuality from '~/components/map/widgets/water-quality'
import Noise from '~/components/map/widgets/noise'

export default {
  name: 'Map',

  components: {
    Noise,
    WaterQuality,
    AirQuality,
    FeatureEditor,
    mdbCol,
    mdbRow,
    Overlay,
    NearbySearch,
    LayerList
  },

  props: {
    theme: {
      type: String,
      default: ''
    },

    widgets: {
      type: Array,
      default: () => {
        return []
      }
    },

    widgetConfig: {
      type: Object,
      default: () => ({})
    },

    center: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      view: null,
      map: null,
      showNearbySearch: false
    }
  },

  provide() {
    return {
      getMap: this.$_getMap,
      getView: this.$_getView,
      addOverlays: this.addOverlays,
      deleteOverlays: this.deleteOverlays,
      showOverlays: this.showOverlays,
      hideOverlays: this.hideOverlays,
      // todo 使用state
      hideNearbySearch: this.$_hideNearbySearch
    }
  },

  computed: {
    ...mapState('map', ['initialCamera']),
    ...mapState('app-info', ['appConfig']),

    themeCss() {
      if (this.theme === '') {
        return `${this.appConfig.map.arcgis_api}/esri/main.css`
      } else {
        return `${this.appConfig.map.arcgis_api}/esri/themes/${this.theme}/main.css`
      }
    }
  },

  mounted() {
    this.$_loadMap()
  },

  methods: {
    ...mapMutations('map', ['setUpdating', 'startUpdating', 'add_overlays']),
    // ...mapActions('map', ['getInitialCamera']),

    async $_loadMap() {
      this.startUpdating()
      loadCss(this.themeCss)
      const [
        BaseMap,
        TileLayer,
        Map,
        MapView,
        Expand,
        Home,
        esriConfig
      ] = await loadModules(
        [
          'esri/Basemap',
          'esri/layers/TileLayer',
          'esri/Map',
          'esri/views/MapView',
          'esri/widgets/Expand',
          'esri/widgets/Home',
          'esri/config'
        ],
        {
          url: `${this.appConfig.map.arcgis_api}/init.js`
        }
      )
      if (this.appConfig.map.proxy) {
        esriConfig.request.proxyUrl = this.appConfig.map.proxy
      }
      esriConfig.fontsUrl = `${this.appConfig.map.arcgis_api}/fonts`
      const baseLayers = this.appConfig.map.basemaps.map((layerConfig) => {
        delete layerConfig.type
        return new TileLayer(layerConfig)
      })
      const basemap = new BaseMap({
        baseLayers
      })
      this.map = new Map({
        basemap
      })
      this.view = new MapView({
        container: 'MapDiv',
        map: this.map,
        ...this.appConfig.map.properties
      })

      const { ui, popup } = this.view

      ui.remove('attribution')

      const homeWidget = new Home({
        view: this.view
      })
      ui.add(homeWidget, 'top-left')

      this.view.watch('updating', () => {
        this.setUpdating({ updating: this.view.updating })
      })

      // popup上action button点击事件
      popup.on('trigger-action', (event) => {
        const { selectedFeature } = popup
        switch (event.action.id) {
          case 'NearbySearch':
            this.$_nearbySearch({
              sourceGraphic: selectedFeature
            })
            break
          case 'NearbySearch_Pollutant':
            this.$_nearbySearch({
              sourceGraphic: selectedFeature,
              types: ['PollutantSourceEnterprise']
            })
        }

        this.$emit('mapPopupTriggerAction', {
          actionId: event.action.id,
          selectedGraphic: selectedFeature
        })
      })

      if (this.widgets.includes('LayerList')) {
        const expandLayerList = new Expand({
          view: this.view,
          name: 'LayerList',
          content: document.getElementById('divLayerList'),
          expandIconClass: 'esri-icon-layer-list',
          expandTooltip: '图层列表',
          expanded: true
        })
        ui.add(expandLayerList, 'bottom-right')
      }

      if (this.widgets.includes('FeatureEditor')) {
        const expandFeatureEditor = new Expand({
          view: this.view,
          name: 'FeatureEditor',
          content: document.getElementById('divFeatureEditor'),
          expandIconClass: 'esri-icon-table',
          expanded: false
        })
        ui.add(expandFeatureEditor, 'bottom-right')
      }

      if (this.widgets.includes('AirQuality')) {
        const expandAirQuality = new Expand({
          view: this.view,
          name: 'AirQuality',
          content: document.getElementById('divAirQuality'),
          expandIconClass: 'esri-icon-public',
          expanded: true
        })
        ui.add(expandAirQuality, 'top-right')
      }

      if (this.widgets.includes('WaterQuality')) {
        const expandWaterQuality = new Expand({
          view: this.view,
          name: 'AirQuality',
          content: document.getElementById('divWaterQuality'),
          expandIconClass: 'esri-icon-public',
          expanded: true
        })
        ui.add(expandWaterQuality, 'top-right')
      }

      if (this.widgets.includes('Noise')) {
        const expandNoise = new Expand({
          view: this.view,
          name: 'Noise',
          content: document.getElementById('divNoise'),
          expandIconClass: 'esri-icon-announcement',
          expanded: true
        })
        ui.add(expandNoise, 'top-right')
      }

      await this.view.when()

      if (this.center) {
        this.view.goTo(this.center)
      }

      setTimeout(() => {
        this.$emit('mapInitialized')
      }, 2000)
      // this.$emit('mapInitialized')
    },

    $_nearbySearch({ sourceGraphic, types = null } = {}) {
      this.showNearbySearch = true
      this.view.popup.close()
      this.$refs.widgetNearbySearch.nearbySearch({ sourceGraphic, types })
    },

    $_triggerPopupActionManual(event) {
      this.$emit('mapPopupTriggerAction', event)
    },

    $_getMap() {
      return new Promise((resolve) => {
        if (this.map) {
          resolve(this.map)
        } else {
          const interval = setInterval(() => {
            if (this.map) {
              clearInterval(interval)
              resolve(this.map)
            }
          }, 50)
        }
      })
    },

    $_getView() {
      return new Promise((resolve) => {
        if (this.view && this.view.spatialReference !== null) {
          resolve(this.view)
        } else {
          const interval = setInterval(() => {
            if (this.view) {
              clearInterval(interval)
              resolve(this.view)
            }
          }, 50)
        }
      })
    },

    // todo 改为state
    $_hideNearbySearch() {
      this.showNearbySearch = false
      this.$refs.widgetLayerList.resetLayers()
    },

    closePopup() {
      this.view.popup.close()
    },

    addOverlays(params) {
      this.$refs.widgetOverlay.addOverlays(params)
    },

    deleteOverlays(params) {
      this.$refs.widgetOverlay.deleteOverlays(params)
    },

    showOverlays(params) {
      this.$refs.widgetOverlay.showOverlays(params)
    },

    hideOverlays(params) {
      this.$refs.widgetOverlay.hideOverlays(params)
    },

    findOverlay(params) {
      this.$refs.widgetOverlay.findOverlay(params)
    },

    goTo(params) {
      this.view.goTo(params)
    }
  }
}
</script>

<style scoped />
