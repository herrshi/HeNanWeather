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
    ...mapState('map', ['initialCamera'])
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

      loadCss(`${appConfig.map.arcgis_api}/esri/themes/light-blue/main.css`)
      const [BaseMap, TileLayer, Map, SceneView] = await loadModules(
        [
          'esri/Basemap',
          'esri/layers/TileLayer',
          'esri/Map',
          'esri/views/SceneView'
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
      this.view.ui.remove('attribution')
      this.view.watch('updating', () => {
        this.setUpdating({ updating: this.view.updating })
      })

      await this.view.when()
      if (this.initialCamera) {
        this.view.camera = this.initialCamera
      }

      // setTimeout(() => {
      //   this.$emit('mapInitialized')
      // }, 3000)
      this.$emit('mapInitialized')
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
        if (this.view) {
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
    }
  }
}
</script>

<style scoped></style>
