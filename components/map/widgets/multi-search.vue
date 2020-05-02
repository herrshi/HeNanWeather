<template>
  <div class="h-100" style="width: 400px">
    <mdb-input
      v-model="searchText"
      basic
      placeholder="搜索"
      aria-described-by="button-addon4"
      append-slot-id="button-addon4"
      @keyup.native.enter="$_doSearch"
    >
      <mdb-btn
        slot="append"
        color="info"
        size="md"
        icon="search"
        group
        @click="$_doSearch"
      />
      <mdb-btn
        slot="append"
        color="info"
        size="md"
        icon="times"
        group
        @click="$_clearSearch"
      />
    </mdb-input>

    <mdb-card v-if="showSearchResult" class="h-100 mt-2">
      <mdb-card-body class="p-1">
        <mdb-datatable
          v-if="refreshTable"
          :data="tableData"
          :tfoot="false"
          :searching="false"
          :pagination="false"
          max-height="300px"
          no-found-message="无符合记录"
          striped
          bordered
          focus
          small
          fixed
          scroll-y
          @selectRow="$_datatable_rowSelected"
        />
      </mdb-card-body>
    </mdb-card>
  </div>
</template>

<script>
import { mdbBtn, mdbDatatable, mdbInput, mdbCard, mdbCardBody } from 'mdbvue'
import { mapGetters } from 'vuex'

export default {
  name: 'MultiSearch',

  components: {
    mdbBtn,
    mdbDatatable,
    mdbInput,
    mdbCard,
    mdbCardBody
  },

  inject: ['getView'],

  data() {
    return {
      view: null,
      showSearchResult: false,
      searchText: '',
      highlights: [],
      refreshTable: true,
      tableData: {
        columns: [
          {
            label: '类别',
            field: 'type'
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
    ...mapGetters('app-info', ['activeLayerConfig']),
    ...mapGetters('business-data', ['getBusinessData']),
    ...mapGetters('map', ['businessLayer'])
  },

  async created() {
    this.view = await this.getView()
  },

  methods: {
    async $_doSearch() {
      this.tableData.rows = []
      this.highlights.forEach((highlight) => highlight.remove())

      // 用featureLayer的graphic查询, 便于highlight
      for (let i = 0; i < this.activeLayerConfig.length; i++) {
        const layerConfig = this.activeLayerConfig[i]
        const { buttonName, dataType } = layerConfig
        const featureLayer = this.businessLayer(dataType)
        const layerView = await this.view.whenLayerView(featureLayer)

        const results = await featureLayer.queryFeatures()
        const { features: graphics } = results
        const highlightGraphics = []
        graphics.forEach((graphic) => {
          const { attributes } = graphic
          for (const key in attributes) {
            const value = String(attributes[key])
            if (value && value.includes(this.searchText)) {
              highlightGraphics.push(graphic)
              this.tableData.rows.push({
                id: attributes.id,
                name: attributes.name,
                type: buttonName,
                dataType
              })
            }
          }
        })

        this.highlights.push(layerView.highlight(highlightGraphics))
      }

      // this.activeLayerConfig.forEach((layerConfig) => {
      //   const layerData = this.getBusinessData(layerConfig.dataType)
      //   if (layerData) {
      //     layerData.forEach((data) => {
      //       for (const key in data) {
      //         const value = String(data[key])
      //         if (value && value.includes(this.searchText)) {
      //           this.tableData.rows.push({
      //             id: data.id,
      //             type: layerConfig.buttonName,
      //             dataType: layerConfig.dataType,
      //             name: data.name
      //           })
      //         }
      //       }
      //     })
      //   }
      // })

      // 刷新datatable
      this.refreshTable = false
      await this.$nextTick()
      this.refreshTable = true
      this.showSearchResult = true
    },

    $_clearSearch() {
      this.searchText = ''
      this.tableData.rows = []
      this.highlights.forEach((highlight) => highlight.remove())
      this.showSearchResult = false
    },

    $_datatable_rowSelected(index) {
      if (index >= 0) {
        const { id, dataType } = this.tableData.rows[index]
        const layer = this.businessLayer(dataType)
        if (layer) {
          const graphic = layer.source.find(
            (graphic) => graphic.getAttribute('id') === id
          )
          if (graphic) {
            this.view.goTo(graphic)
            this.view.popup.close()
            this.view.popup.open({
              features: [graphic],
              location: graphic.geometry
            })
          }
        }
      }
    }
  }
}
</script>

<style scoped></style>
