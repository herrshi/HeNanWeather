<template>
  <mdb-card class="h-100">
    <mdb-card-body>
      <mdb-row>
        <mdb-col class="pr-0">
          <mdb-input
            id="checkbox1"
            v-model="airQualityChecked"
            @change="$_filterDatatable"
            type="checkbox"
            label="空气监测站"
          />
        </mdb-col>
        <mdb-col class="pr-0">
          <mdb-input
            id="checkbox2"
            v-model="surfaceWaterChecked"
            @change="$_filterDatatable"
            type="checkbox"
            label="地表水监测站"
          />
        </mdb-col>
      </mdb-row>

      <mdb-row>
        <mdb-col class="pr-0">
          <mdb-input
            id="checkbox3"
            v-model="pollutantSourceEnterpriseChecked"
            @change="$_filterDatatable"
            type="checkbox"
            label="重点污染源"
          />
        </mdb-col>
        <mdb-col class="pr-0">
          <mdb-input
            id="checkbox4"
            v-model="medicalWasteChecked"
            @change="$_filterDatatable"
            type="checkbox"
            label="医疗固废监测站"
          />
        </mdb-col>
      </mdb-row>

      <mdb-row>
        <mdb-col class="pr-0">
          <mdb-input
            id="checkbox5"
            v-model="radiationSourceChecked"
            @change="$_filterDatatable"
            type="checkbox"
            label="辐射监测站"
          />
        </mdb-col>
      </mdb-row>
      <mdb-datatable
        v-if="refreshTable"
        @selectRow="$_datatable_rowSelected"
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
      />
      <mdb-btn-fixed
        :bottom="5"
        :right="5"
        @click.native.prevent="$_close"
        icon="ban"
        size="sm"
        color="blue"
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

  // watch: {
  //   airQualityChecked() {
  //     this.$_filterDatatable()
  //   },
  //   medicalWasteChecked() {
  //     this.$_filterDatatable()
  //   },
  //   pollutantSourceEnterpriseChecked() {
  //     this.$_filterDatatable()
  //   },
  //   radiationSourceChecked() {
  //     this.$_filterDatatable()
  //   },
  //   surfaceWaterChecked() {
  //     this.$_filterDatatable()
  //   }
  // },

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
    async nearbySearch({ sourceGraphic, types }) {
      this.tableData.rows = []
      this.graphicsLayer.removeAll()

      const [Graphic, geometryEngine] = await loadModules(
        ['esri/Graphic', 'esri/geometry/geometryEngine'],
        {
          url: `${this.appConfig.map.arcgis_api}/init.js`
        }
      )

      const centerGraphic = new Graphic({
        geometry: sourceGraphic.geometry,
        symbol: {
          type: 'simple-marker',
          style: 'circle',
          size: 10,
          color: [0, 255, 255, 0.5]
        }
      })

      const buffer = geometryEngine.geodesicBuffer(
        sourceGraphic.geometry,
        20000,
        'meters'
      )
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
      this.$_bufferSearch(buffer, types, sourceGraphic)
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
        if (
          sourceGraphic.layer.label === '地表水监测站点' &&
          layer.label === '重点污染源企业'
        ) {
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
            console.log(where)

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
      this.$_removeHighlightHandlers()
      this.hideNearbySearch()
      this.tableData.rows = []
    }
  }
}
</script>

<style scoped></style>
