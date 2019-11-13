<template>
  <div class="d-none"></div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { loadModules } from 'esri-loader'
export default {
  name: 'Overlay',

  inject: ['getMap', 'getView'],

  data() {
    return {
      overlayLayer: null,
      isWebMercator: true
    }
  },

  computed: {
    ...mapState('map', ['overlays'])
  },

  async mounted() {
    const map = await this.getMap()
    // const view = await this.getView()
    const [GraphicsLayer] = await loadModules(['esri/layers/GraphicsLayer'])
    this.overlayLayer = new GraphicsLayer()
    map.add(this.overlayLayer)
  },

  methods: {
    ...mapMutations('map', ['startUpdating', 'stopUpdating']),

    async addOverlays(params) {
      this.startUpdating()

      this.overlayLayer.removeAll()

      const [Graphic, webMercatorUtils] = await loadModules([
        'esri/Graphic',
        'esri/geometry/support/webMercatorUtils'
      ])
      const { overlays, defaultSymbol } = params
      console.log('isWebMercator: ' + this.isWebMercator)
      const graphics = overlays.map((overlay) => {
        const { id, type, symbol, attributes } = overlay
        let { geometry } = overlay
        if (this.isWebMercator)
          geometry = webMercatorUtils.geographicToWebMercator(geometry)
        const graphic = new Graphic({
          geometry,
          symbol: symbol || defaultSymbol,
          attributes
        })
        graphic.id = id
        graphic.type = type
        console.log(graphic.toJSON())
        return graphic
      })
      this.overlayLayer.addMany(graphics)
      this.stopUpdating()
    }
  }
}
</script>

<style scoped></style>
