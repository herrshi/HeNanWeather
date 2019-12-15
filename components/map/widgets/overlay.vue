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
    ...mapState('map', ['overlays']),
    ...mapState('app-info', ['appConfig'])
  },

  async created() {
    const [GraphicsLayer] = await loadModules(['esri/layers/GraphicsLayer'], {
      url: `${this.appConfig.map.arcgis_api}/init.js`
    })
    this.overlayLayer = new GraphicsLayer()
    const map = await this.getMap()
    map.add(this.overlayLayer)
  },

  methods: {
    ...mapMutations('map', [
      'startUpdating',
      'stopUpdating',
      'addOverlayGraphics'
    ]),

    $_changeOverlayVisible(params = null, visible) {
      if (params === null) {
        this.overlayLayer.visible = visible
      } else {
        const { type, ids } = params
        this.overlayLayer.graphics.forEach((graphic) => {
          if (
            (!ids && graphic.type === type) ||
            (!type && ids.includes(graphic.id)) ||
            (graphic.type === type && ids.includes(graphic.id))
          ) {
            graphic.visible = visible
          }
        })
      }
    },

    async addOverlays({
      overlays,
      defaultSymbol,
      defaultPopupTemplate,
      defaultVisible = true
    } = {}) {
      this.startUpdating()

      const view = await this.getView()

      if (this.isWebMercator === null) {
        const { spatialReference } = view
        this.isWebMercator = spatialReference.isWebMercator
      }

      const [Graphic, webMercatorUtils] = await loadModules([
        'esri/Graphic',
        'esri/geometry/support/webMercatorUtils'
      ])
      const graphics = overlays.map((overlay) => {
        const { id, type, symbol, attributes, popupTemplate, visible } = overlay
        let { geometry } = overlay
        if (this.isWebMercator) {
          geometry = webMercatorUtils.geographicToWebMercator(geometry)
        }
        const graphic = new Graphic({
          geometry,
          attributes,
          symbol: symbol || defaultSymbol,
          popupTemplate: popupTemplate || defaultPopupTemplate,
          visible: visible === undefined ? defaultVisible : visible
        })
        graphic.id = id
        graphic.type = type
        return graphic
      })
      this.overlayLayer.addMany(graphics)

      this.addOverlayGraphics({ graphics })
      this.stopUpdating()

      return {
        code: 1,
        message: `成功添加${overlays.length}个覆盖物`
      }
    },

    deleteOverlays(params = null) {
      if (params === null) {
        this.overlayLayer.removeAll()
      } else {
        const { type, ids } = params
        const removeGraphics = this.overlayLayer.graphics.filter((graphic) => {
          if (!ids) {
            return graphic.type === type
          } else if (!type) {
            return ids.includes(graphic.id)
          } else {
            return graphic.type === type && ids.includes(graphic.id)
          }
        })
        this.overlayLayer.removeMany(removeGraphics)
      }
    },

    showOverlays(params = null) {
      this.$_changeOverlayVisible(params, true)
    },

    hideOverlays(params = null) {
      this.$_changeOverlayVisible(params, false)
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
          await this.view.goTo(
            { center: centerPoint, zoom },
            { speedFactor: 3 }
          )
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

<style scoped />
