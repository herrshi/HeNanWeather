<template>
  <mdb-row class="w-100 h-100 mx-0">
    <mdb-col
      :col="showNearbySearch ? '8' : '12'"
      :class="showNearbySearch ? 'pl-0 pr-1' : 'pl-0 pr-0'"
    >
      <div id="divWidgets">
        <div id="divOverlay" v-if="false">
          <Overlay ref="widgetOverlay" />
        </div>

        <div id="divLayerList" v-if="widgets && widgets.includes('LayerList')">
          <layer-list ref="widgetLayerList" />
        </div>

        <div
          id="divFeatureEditor"
          v-if="widgets && widgets.includes('FeatureEditor')"
        >
          <feature-editor :widget-config="widgetConfig" />
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

export default {
  name: 'Map',

  components: {
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
          expanded: true
        })
        ui.add(expandFeatureEditor, 'bottom-right')
      }

      await this.view.when()

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
    }
  }
}
</script>

<style scoped></style>
