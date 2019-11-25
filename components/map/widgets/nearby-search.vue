<template>
  <div>
    <mdb-datatable
      v-if="refreshTable"
      max-height="50vh"
      showing-text="显示"
      entries-title=""
      no-found-message="无符合记录"
      search-placeholder="搜索"
      :data="tableData"
      :tfoot="false"
      :sorting="false"
      arrows
      striped
      scroll-y
      bordered
      hover
      focus
      class="m-2"
      @selectRow="$_datatable_rowSelected"
    />
    <mdb-btn-fixed
      icon="ban"
      color="blue"
      :bottom="15"
      :right="15"
      @click.native.prevent="$_close"
    />
  </div>
</template>

<script>
import { loadModules } from 'esri-loader'
import { mapGetters, mapState } from 'vuex'
import { mdbBtnFixed, mdbDatatable } from 'mdbvue'
export default {
  name: 'NearbySearch',

  components: {
    mdbBtnFixed,
    mdbDatatable
  },

  inject: ['getMap', 'getView', 'hideNearbySearch'],

  data() {
    return {
      map: null,
      view: null,
      graphicsLayer: null,

      highlightHandlers: [],

      refreshTable: true,
      tableData: {
        columns: [
          {
            label: '类别',
            field: 'dataType'
          },
          {
            label: '名称',
            field: 'name'
          }
        ],
        rows: []
      }
    }
  },

  computed: {
    ...mapState('app-info', ['appConfig']),
    ...mapGetters('map', ['businessLayer', 'visibleBusinessLayer'])
  },

  async created() {
    this.map = await this.getMap()
    this.view = await this.getView()

    const [GraphicsLayer] = await loadModules(['esri/layers/GraphicsLayer'], {
      url: `${this.appConfig.map.arcgis_api}/init.js`
    })
    this.graphicsLayer = new GraphicsLayer()
    this.map.add(this.graphicsLayer)
  },

  methods: {
    $_handlePaneOpened(num) {
      if (this.openPaneNum === num) {
        return (this.openPaneNum = null)
      }
      this.openPaneNum = num
    },

    async nearbySearch({ center, types }) {
      this.tableData.rows = []
      this.graphicsLayer.removeAll()

      const [Graphic, geometryEngine] = await loadModules(
        ['esri/Graphic', 'esri/geometry/geometryEngine'],
        {
          url: `${this.appConfig.map.arcgis_api}/init.js`
        }
      )

      const centerGraphic = new Graphic({
        geometry: center,
        symbol: {
          type: 'simple-marker',
          style: 'circle',
          size: 10,
          color: [0, 255, 255, 0.5]
        }
      })

      const buffer = geometryEngine.geodesicBuffer(center, 10000, 'meters')
      // if (this.view.spatialReference.isWebMercator) {
      //   buffer = webMercatorUtils.webMercatorToGeographic(buffer)
      // }
      const bufferGraphic = new Graphic({
        geometry: buffer,
        symbol: {
          type: 'simple-fill',
          color: [150, 150, 150, 0.2],
          outline: {
            color: '#FFEB00',
            width: 2
          }
        }
      })
      this.graphicsLayer.addMany([centerGraphic, bufferGraphic])
      await this.view.goTo(buffer)
      this.$_bufferSearch(buffer, types)
    },

    async $_bufferSearch(buffer, types) {
      let searchLayers = []
      if (!types || types.length === 0) {
        searchLayers = this.visibleBusinessLayer
      } else {
        types.forEach((type) => {
          const layer = this.businessLayer(type)
          if (layer) searchLayers.push(layer)
        })
      }

      this.$_removeHighlightHandlers()
      for (let i = 0; i < searchLayers.length; i++) {
        const layer = searchLayers[i]
        const layerView = await this.view.whenLayerView(layer)
        const query = layerView.createQuery()
        query.geometry = buffer
        // query.unit = 'meters'
        const response = await layerView.queryFeatures(query)
        this.tableData.rows = response.features.map((feature) => ({
          dataType: feature.getAttribute('type'),
          name: feature.getAttribute('name')
        }))

        this.highlightHandlers.push(layerView.highlight(response.features))
      }

      // 刷新datatable
      this.refreshTable = false
      await this.$nextTick()
      this.refreshTable = true
    },

    $_datatable_rowSelected(index) {},

    $_removeHighlightHandlers() {
      this.highlightHandlers.forEach((handler) => handler.remove())
      this.highlightHandlers = []
    },

    $_close() {
      this.graphicsLayer.removeAll()
      this.$_removeHighlightHandlers()
      this.hideNearbySearch()
      this.tableData.rows = []
    }
  }
}
</script>

<style scoped></style>
