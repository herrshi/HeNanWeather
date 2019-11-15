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
      isWebMercator: null,
      map: null,
      view: null
    }
  },

  computed: {
    ...mapState('map', ['overlays'])
  },

  async created() {
    this.map = await this.getMap()
    this.view = await this.getView()

    const [GraphicsLayer] = await loadModules(['esri/layers/GraphicsLayer'])
    this.overlayLayer = new GraphicsLayer()
    this.map.add(this.overlayLayer)
  },

  methods: {
    ...mapMutations('map', ['startUpdating', 'stopUpdating']),

    async addOverlays(params) {
      this.startUpdating()

      if (this.isWebMercator === null) {
        const { spatialReference } = this.view
        this.isWebMercator = spatialReference.isWebMercator
      }

      this.overlayLayer.removeAll()

      const [Graphic, webMercatorUtils] = await loadModules([
        'esri/Graphic',
        'esri/geometry/support/webMercatorUtils'
      ])
      const { overlays, defaultSymbol, defaultPopupTemplate } = params
      const graphics = overlays.map((overlay) => {
        const { id, type, symbol, attributes, popupTemplate } = overlay
        let { geometry } = overlay
        if (this.isWebMercator) {
          geometry = webMercatorUtils.geographicToWebMercator(geometry)
        }
        const graphic = new Graphic({
          geometry,
          attributes,
          symbol: symbol || defaultSymbol,
          popupTemplate: popupTemplate || defaultPopupTemplate
        })
        graphic.id = id
        graphic.type = type
        return graphic
      })
      this.overlayLayer.addMany(graphics)
      this.stopUpdating()

      return {
        code: 1,
        message: `成功添加${overlays.length}个覆盖物`
      }
    },

    async findOverlay({
      type,
      id,
      centerResult = true,
      showPopup = true,
      zoom
    }) {
      if (!type) {
        return {
          code: -1,
          message: '未提供type参数'
        }
      }

      if (!id) {
        return {
          code: -1,
          message: '未提供id参数'
        }
      }

      const { graphics } = this.overlayLayer
      const graphic = graphics.find((graphic) => {
        return graphic.id === id && graphic.type === type
      })
      if (graphic) {
        const { geometry, attributes } = graphic
        // 获取geometry中心点
        const centerPoint =
          geometry.type === 'point' ? geometry : geometry.extent.center
        // 居中
        if (centerResult) {
          await this.view.goTo({ center: centerPoint, zoom })
        }
        // 显示popup
        if (showPopup) {
          this.view.popup.close()
          this.view.popup.open({ features: [graphic], location: centerPoint })
        }
        return {
          type,
          id,
          overlay: {
            geometry,
            fields: attributes
          }
        }
      } else {
        return {
          code: -2,
          message: '未找到覆盖物'
        }
      }
    }
  }
}
</script>

<style scoped></style>
