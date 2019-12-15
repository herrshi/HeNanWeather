<template>
  <mdb-card class="h-100">
    <mdb-card-body>
      <mdb-row>
        <mdb-col class="pr-0">
          <mdb-input
            id="checkbox1"
            v-model="airQualityChecked"
            type="checkbox"
            label="空气监测站"
            @change="$_filterDatatable"
          />
        </mdb-col>
        <mdb-col class="pr-0">
          <mdb-input
            id="checkbox2"
            v-model="surfaceWaterChecked"
            type="checkbox"
            label="地表水监测站"
            @change="$_filterDatatable"
          />
        </mdb-col>
      </mdb-row>

      <mdb-row>
        <mdb-col class="pr-0">
          <mdb-input
            id="checkbox3"
            v-model="pollutantSourceEnterpriseChecked"
            type="checkbox"
            label="重点污染源"
            @change="$_filterDatatable"
          />
        </mdb-col>
        <mdb-col class="pr-0">
          <mdb-input
            id="checkbox4"
            v-model="medicalWasteChecked"
            type="checkbox"
            label="医疗固废监测站"
            @change="$_filterDatatable"
          />
        </mdb-col>
      </mdb-row>

      <mdb-row>
        <mdb-col class="pr-0">
          <mdb-input
            id="checkbox5"
            v-model="radiationSourceChecked"
            type="checkbox"
            label="辐射监测站"
            @change="$_filterDatatable"
          />
        </mdb-col>
      </mdb-row>
      <mdb-datatable
        v-if="refreshTable"
        :data="tableData"
        :tfoot="false"
        max-height="50vh"
        showing-text="显示"
        entries-title=""
        no-found-message="无符合记录"
        search-placeholder="搜索"
        reponsive
        arrows
        striped
        scroll-y
        bordered
        hover
        focus
        fixed
        class="m-2"
        @selectRow="$_datatable_rowSelected"
      />
      <mdb-btn-fixed
        :bottom="5"
        :right="5"
        icon="ban"
        size="sm"
        color="blue"
        @click.native.prevent="$_close"
      />
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { loadModules } from 'esri-loader'
import { mapGetters, mapState } from 'vuex'
import {
  mdbBtnFixed,
  mdbDatatable,
  mdbInput,
  mdbCard,
  mdbCardBody,
  mdbRow,
  mdbCol
} from 'mdbvue'
import WaterStationApi from '~/api/WaterStation'

export default {
  name: 'NearbySearch',

  components: {
    mdbBtnFixed,
    mdbDatatable,
    mdbInput,
    mdbCard,
    mdbCardBody,
    mdbRow,
    mdbCol
  },

  inject: ['getMap', 'getView', 'hideNearbySearch'],

  data() {
    return {
      map: null,
      view: null,
      graphicsLayer: null,
      sketchLayer: null,
      geometryEngine: null,

      centerGraphic: null,
      edgeGraphic: null,
      lineGraphic: null,
      bufferGraphic: null,
      labelGraphic: null,
      sketchViewModel: null,

      searchTypes: null,

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
      },

      queryResults: [],

      airQualityChecked: true,
      medicalWasteChecked: true,
      pollutantSourceEnterpriseChecked: true,
      radiationSourceChecked: true,
      surfaceWaterChecked: true
    }
  },

  computed: {
    ...mapState('app-info', ['appConfig']),
    ...mapGetters('map', [
      'businessLayer',
      'visibleBusinessLayer',
      'allBusinessLayer'
    ])
  },

  async created() {
    this.map = await this.getMap()
    this.view = await this.getView()

    const [GraphicsLayer, SketchViewModel, geometryEngine] = await loadModules(
      [
        'esri/layers/GraphicsLayer',
        'esri/widgets/Sketch/SketchViewModel',
        'esri/geometry/geometryEngine'
      ],
      {
        url: `${this.appConfig.map.arcgis_api}/init.js`
      }
    )
    this.geometryEngine = geometryEngine
    this.graphicsLayer = new GraphicsLayer()
    this.sketchLayer = new GraphicsLayer()
    this.map.addMany([this.graphicsLayer, this.sketchLayer])

    this.sketchViewModel = new SketchViewModel({
      view: this.view,
      layer: this.sketchLayer
    })
    this.sketchViewModel.on('update', this.$_onSketchMove)
  },

  methods: {
    $_onSketchMove(event) {
      const vertices = [
        [this.centerGraphic.geometry.x, this.centerGraphic.geometry.y],
        [this.edgeGraphic.geometry.x, this.edgeGraphic.geometry.y]
      ]
      this.$_calculateBuffer(vertices, event.toolEventInfo.type)

      if (event.state === 'cancel' || event.state === 'complete') {
        this.sketchViewModel.update([this.edgeGraphic], { tool: 'move' })
      }
    },

    $_calculateBuffer(vertices, state) {
      this.lineGraphic.geometry = {
        type: 'polyline',
        paths: vertices,
        spatialReference: this.view.spatialReference
      }
      const length = this.geometryEngine.geodesicLength(
        this.lineGraphic.geometry,
        'kilometers'
      )
      const buffer = this.geometryEngine.geodesicBuffer(
        this.centerGraphic.geometry,
        length,
        'kilometers'
      )
      this.bufferGraphic.geometry = buffer

      this.labelGraphic.geometry = this.edgeGraphic.geometry
      this.labelGraphic.symbol = {
        type: 'text',
        color: '#0d47a1',
        text: length.toFixed(2) + '公里',
        xoffset: 50,
        yoffset: 10,
        font: {
          family: 'yahei',
          size: 14
        }
      }

      if (state === 'move-stop') {
        this.$_bufferSearch(buffer, this.searchTypes, this.centerGraphic)
      }
    },

    async nearbySearch({ sourceGraphic, types }) {
      this.searchTypes = types
      this.tableData.rows = []
      this.graphicsLayer.removeAll()
      this.sketchLayer.removeAll()

      const [Graphic] = await loadModules(['esri/Graphic'], {
        url: `${this.appConfig.map.arcgis_api}/init.js`
      })

      this.centerGraphic = new Graphic({
        geometry: sourceGraphic.geometry,
        symbol: {
          type: 'simple-marker',
          style: 'circle',
          size: 10,
          color: '#4caf50'
        },
        attributes: sourceGraphic.attributes
      })

      const buffer = this.geometryEngine.geodesicBuffer(
        sourceGraphic.geometry,
        20,
        'kilometers'
      )
      this.bufferGraphic = new Graphic({
        geometry: buffer,
        symbol: {
          type: 'simple-fill',
          color: [150, 150, 150, 0.2],
          outline: {
            color: '#0d47a1',
            width: 2
          }
        }
      })

      this.edgeGraphic = new Graphic({
        geometry: {
          type: 'point',
          x: buffer.rings[0][0][0],
          y: buffer.rings[0][0][1],
          spatialReference: buffer.spatialReference
        },
        symbol: {
          type: 'simple-marker',
          style: 'square',
          size: 20,
          color: '#4caf50'
        }
      })

      this.lineGraphic = new Graphic({
        geometry: {
          type: 'polyline',
          paths: [
            [sourceGraphic.geometry.x, sourceGraphic.geometry.y],
            [buffer.rings[0][0][0], buffer.rings[0][0][1]]
          ],
          spatialReference: buffer.spatialReference
        },
        symbol: {
          type: 'simple-line',
          color: '#0d47a1',
          width: 2.5
        }
      })

      const length = this.geometryEngine.geodesicLength(
        this.lineGraphic.geometry,
        'kilometers'
      )
      this.labelGraphic = new Graphic({
        geometry: this.edgeGraphic.geometry,
        symbol: {
          type: 'text',
          color: '#0d47a1',
          text: length.toFixed(2) + '公里',
          xoffset: 20,
          yoffset: 10,
          font: {
            family: 'yahei',
            size: 14
          }
        }
      })
      this.graphicsLayer.addMany([
        this.centerGraphic,
        this.bufferGraphic,
        this.lineGraphic,
        this.labelGraphic
      ])
      this.sketchLayer.add(this.edgeGraphic)
      setTimeout(() => {
        this.sketchViewModel.update([this.edgeGraphic], { tool: 'move' })
      }, 1000)
      await this.view.goTo(buffer)
      this.$_bufferSearch(buffer, this.searchTypes, this.centerGraphic)
    },

    async $_bufferSearch(buffer, types, sourceGraphic) {
      let searchLayers = []
      if (!types || types.length === 0) {
        searchLayers = this.allBusinessLayer
      } else {
        types.forEach((type) => {
          const layer = this.businessLayer(type)
          if (layer) searchLayers.push(layer)
        })
      }
      searchLayers.forEach((layer) => (layer.visible = true))

      this.$_removeHighlightHandlers()
      let features = []
      for (let i = 0; i < searchLayers.length; i++) {
        const layer = searchLayers[i]
        if (layer === null) continue

        const layerView = await this.view.whenLayerView(layer)
        const query = layerView.createQuery()
        query.geometry = buffer
        // query.unit = 'meters'
        const response = await layerView.queryFeatures(query)
        const { features: queryFeatures } = response
        if (types && types.includes('PollutantSourceEnterprise')) {
          const result = await this.$_filterPollutantSource(
            sourceGraphic.getAttribute('id'),
            queryFeatures
          )
          if (result.data) {
            let where = ''
            if (result.data.length === 0) {
              where = '1 <> 1'
            } else {
              result.data.forEach((data) => {
                const { psCode } = data
                where += `id==${psCode} or`
              })
              where = where.substr(0, where.length - 3)
            }

            layerView.effect = {
              filter: {
                where
              },
              excludedEffect: 'grayscale(100%) opacity(30%)'
            }
            this.highlightHandlers.push(layerView)
          }
        } else {
          features = features.concat(queryFeatures)

          // filter the layer
          layerView.effect = {
            filter: {
              geometry: buffer,
              spatialRelationship: 'contains'
            },
            excludedEffect: 'grayscale(100%) opacity(30%)'
          }
          this.highlightHandlers.push(layerView)
        }
      }
      this.queryResults = features.map((feature) => ({
        id: feature.getAttribute('id'),
        dataType: feature.getAttribute('type'),
        name: feature.getAttribute('name')
      }))
      await this.$_filterDatatable()
    },

    /** 当搜索地表水周边的重点污染源时，需要对重点污染源进一步过滤 **/
    $_filterPollutantSource(waterStationId, queryFeatures) {
      let ids = ''
      queryFeatures.forEach((graphic) => {
        ids += graphic.getAttribute('id') + ','
      })
      return WaterStationApi.getRelatedPollutantSource(waterStationId, ids)
    },

    $_datatable_rowSelected(index) {},

    $_removeHighlightHandlers() {
      this.highlightHandlers.forEach((layerView) => {
        layerView.effect = {
          filter: {
            geometry: null
          }
        }
      })
      this.highlightHandlers = []
    },

    /** 根据图层类型checkbox筛选结果 **/
    async $_filterDatatable() {
      this.tableData.rows = this.queryResults.filter((rowData) => {
        switch (rowData.dataType) {
          case '重点污染源企业':
            return this.pollutantSourceEnterpriseChecked
          case '地表水监测站':
            return this.surfaceWaterChecked
          case '空气监测站':
            return this.airQualityChecked
          case '医疗固废监测站':
            return this.medicalWasteChecked
          case '辐射源监测站':
            return this.radiationSourceChecked
          default:
            return true
        }
      })

      // 刷新datatable
      this.refreshTable = false
      await this.$nextTick()
      this.refreshTable = true
    },

    $_close() {
      this.graphicsLayer.removeAll()
      this.sketchLayer.removeAll()
      this.$_removeHighlightHandlers()
      this.hideNearbySearch()
      this.tableData.rows = []
    }
  }
}
</script>

<style scoped />
