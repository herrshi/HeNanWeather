<template>
  <div id="MapDiv" class="v-100 h-100">
    <div id="divWidgets">
      <div id="divOverlay">
        <Overlay ref="widgetOverlay" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { loadCss, loadModules } from 'esri-loader'
import { appConfig } from '~/static/js/appConfig'
import Overlay from '~/components/map/Overlay'

export default {
  name: 'Map',
  components: { Overlay },

  props: {
    theme: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      view: null,
      map: null
    }
  },

  provide() {
    return {
      getMap: this.$_map_getMap,
      getView: this.$_map_getView
    }
  },

  computed: {
    ...mapState('map', ['initialCamera']),

    themeCss() {
      if (this.theme === '') {
        return `${appConfig.map.arcgis_api}/esri/main.css`
      } else {
        return `${appConfig.map.arcgis_api}/esri/themes/${this.theme}/main.css`
      }
    }
  },

  mounted() {
    this.getInitialCamera()
    this.$_map_loadMap()
  },

  methods: {
    ...mapMutations('map', ['setUpdating', 'startUpdating', 'add_overlays']),
    ...mapActions('map', ['getInitialCamera']),

    async $_map_loadMap() {
      this.startUpdating()

      loadCss(this.themeCss)
      const [BaseMap, TileLayer, Map, SceneView, Home] = await loadModules(
        [
          'esri/Basemap',
          'esri/layers/TileLayer',
          'esri/Map',
          'esri/views/SceneView',
          'esri/widgets/Home'
        ],
        {
          url: `${appConfig.map.arcgis_api}/init.js`
        }
      )
      const baseLayers = appConfig.map.basemaps.map((layerConfig) => {
        delete layerConfig.type
        return new TileLayer(layerConfig)
      })
      const basemap = new BaseMap({
        baseLayers
      })
      this.map = new Map({
        basemap
      })
      this.view = new SceneView({
        container: 'MapDiv',
        map: this.map,
        camera: this.initialCamera,
        qualityProfile: 'high',
        environment: {
          lighting: {
            directShadowsEnabled: true,
            ambientOcclusionEnabled: true
          },
          starsEnabled: false,
          atmosphere: {
            quality: 'high'
          }
        }
      })

      const { ui } = this.view
      ui.remove('attribution')

      const homeWidget = new Home({
        view: this.view
      })
      ui.add(homeWidget, 'top-left')

      this.view.watch('updating', () => {
        this.setUpdating({ updating: this.view.updating })
      })

      // popup上action button点击事件
      this.view.popup.on('trigger-action', (event) =>
        this.$emit('mapPopupTriggerAction', {
          actionId: event.action.id,
          selectedGraphic: this.view.popup.selectedFeature
        })
      )

      await this.view.when()

      setTimeout(() => {
        this.$emit('mapInitialized')
      }, 2000)
      // this.$emit('mapInitialized')
    },

    $_map_getMap() {
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

    $_map_getView() {
      return new Promise((resolve) => {
        if (this.view.spatialReference) {
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

    addOverlays(params) {
      this.$refs.widgetOverlay.addOverlays(params)
    },

    findOverlay(params) {
      this.$refs.widgetOverlay.findOverlay(params)
    }
  }
}
</script>

<style scoped></style>
