<template>
  <div id="MapDiv" class="v-100 h-100"></div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { loadCss, loadModules } from 'esri-loader'
import { appConfig } from '~/static/js/appConfig'

export default {
  name: 'Map',
  data() {
    return {
      view: null,
      map: null
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
    ...mapMutations('map', ['setUpdating']),
    ...mapActions('map', ['getInitialCamera']),

    async $_map_loadMap() {
      this.setUpdating({ updating: true })

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
    }
  }
}
</script>

<style scoped></style>
