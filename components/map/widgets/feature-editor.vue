<template>
  <mdb-card>
    <mdb-card-body>
      <!-- <mdb-scrollbar v-if="false" height="300px">
        <mdb-tbl>
          <mdb-tbl-head>
            <tr>
              <th v-for="(field, index) in tableHeader" :key="index">
                {{ field.alias }}
              </th>
            </tr>
          </mdb-tbl-head>

          <mdb-tbl-body>
            <tr v-for="row in tableData" :key="row.id">
              <td v-for="(field, index) in tableHeader" :key="index">
                {{ $_getDomainValue(field, row[field.name]) }}
              </td>
            </tr>
          </mdb-tbl-body>
        </mdb-tbl>
      </mdb-scrollbar> -->

      <mdb-datatable
        v-if="refreshTable"
        :data="dataTableData"
        :tfoot="false"
        max-height="400px"
        showing-text="显示"
        entries-title=""
        no-found-message="无符合记录"
        search-placeholder="搜索"
        arrows
        striped
        bordered
        scroll-y
        hover
        class="m-2"
        @selectRow="$_datatable_rowSelected"
      />
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { loadModules } from 'esri-loader'
import { mapState, mapGetters, mapActions } from 'vuex'
import { mdbCard, mdbCardBody, mdbDatatable } from 'mdbvue'

export default {
  name: 'FeatureEditor',

  components: {
    mdbCard,
    mdbCardBody,
    mdbDatatable
  },

  inject: ['getMap', 'getView'],

  props: {
    widgetConfig: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      map: null,
      view: null,
      featureLayer: null,
      tableData: [],
      refreshTable: true,
      dataTableData: {
        columns: [
          {
            label: '地块名称',
            field: 'name'
          },
          {
            label: '编码',
            field: 'siteCode'
          },
          {
            label: '管控',
            field: 'levelName'
          },
          {
            label: '城市',
            field: 'cityName'
          }
        ],
        rows: []
      }
    }
  },

  computed: {
    ...mapState('app-info', ['appConfig']),
    ...mapGetters('map', ['businessLayer']),
    ...mapGetters('base-data', ['getCityByCode']),

    dataType() {
      return this.widgetConfig.FeatureEditor.dataType
    },

    tableHeader() {
      const header = []
      if (this.featureLayer) {
        this.featureLayer.fields.forEach((field) => {
          const { editable, alias, name, domain } = field
          if (editable && name !== this.featureLayer.objectIdField) {
            header.push({ name, alias, domain })
          }
        })
      }

      return header
    }
  },

  async created() {
    this.map = await this.getMap()
    this.view = await this.getView()
    this.$_createFeatureLayer()
  },

  methods: {
    ...mapActions('map', ['createFeatureLayer']),

    $_getDomainValue(field, rowValue) {
      if (!field.domain) {
        return rowValue
      } else {
        const codedValue = field.domain.codedValues.find(
          (codedValue) => codedValue.code === rowValue
        )
        if (codedValue) {
          return codedValue.name
        } else {
          return rowValue
        }
      }
    },

    async $_createFeatureLayer() {
      const [Editor, Expand] = await loadModules(
        ['esri/widgets/Editor', 'esri/widgets/Expand'],
        {
          url: `${this.appConfig.map.arcgis_api}/init.js`
        }
      )
      this.featureLayer = this.businessLayer(this.dataType)
      if (!this.featureLayer) {
        this.featureLayer = await this.createFeatureLayer({
          dataType: this.dataType
        })
      }
      this.featureLayer.visible = true

      const featureSet = await this.featureLayer.queryFeatures()
      // this.tableData = featureSet.features.map((graphic) => graphic.attributes)
      this.dataTableData.rows = featureSet.features.map((graphic) => ({
        name: graphic.attributes.name,
        siteCode: graphic.attributes.siteCode,
        levelName: graphic.attributes.levelName,
        cityName: this.getCityByCode(graphic.attributes.cityCode).cityName
      }))
      this.refreshTable = false
      await this.$nextTick()
      this.refreshTable = true

      this.featureLayer.on('edits', (event) => {
        const { addedFeatures, deletedFeatures, updatedFeatures } = event
        if (addedFeatures.length > 0) this.$_featureAdded(addedFeatures)
        if (updatedFeatures.length > 0) this.$_featureUpdated(updatedFeatures)
        if (deletedFeatures.length > 0) this.$_featureDeleted(deletedFeatures)
      })
      this.map.add(this.featureLayer)

      const editor = new Editor({
        container: document.createElement('div'),
        view: this.view
      })
      const expandEditor = new Expand({
        expandIconClass: 'esri-icon-edit',
        view: this.view,
        content: editor.domNode,
        expanded: true
      })
      this.view.ui.add(expandEditor, 'bottom-left')
    },

    async $_featureAdded(features) {
      const featureSet = await this.featureLayer.queryFeatures()
      const feature = features[0]
      const { objectId } = feature
      const graphic = featureSet.features.find(
        (graphic) =>
          graphic.getAttribute(this.featureLayer.objectIdField) === objectId
      )
      if (graphic) {
        // this.tableData.push(graphic.attributes)
        this.dataTableData.rows.push({
          name: graphic.attributes.name,
          siteCode: graphic.attributes.siteCode,
          levelName: graphic.attributes.levelName,
          cityName: this.getCityByCode(graphic.attributes.cityCode).cityName
        })
        this.refreshTable = false
        await this.$nextTick()
        this.refreshTable = true

        const result = await this.$store.dispatch(
          `business-data/add${this.dataType}`,
          { graphic }
        )
        if (result.code === 1) {
          this.$notify.success({
            message: '新增成功',
            position: 'top right',
            timeOut: 5000
          })
        } else {
          this.$notify.error({
            message: '新增失败: ' + result.msg,
            position: 'top right',
            timeOut: 5000
          })
        }
      }
    },

    async $_featureUpdated(features) {
      const featureSet = await this.featureLayer.queryFeatures()
      const feature = features[0]

      const { objectId } = feature
      const graphic = featureSet.features.find(
        (graphic) =>
          graphic.getAttribute(this.featureLayer.objectIdField) === objectId
      )
      if (graphic) {
        // this.tableData = featureSet.features.map(
        //   (graphic) => graphic.attributes
        // )

        this.dataTableData.rows = featureSet.features.map((graphic) => ({
          name: graphic.attributes.name,
          siteCode: graphic.attributes.siteCode,
          levelName: graphic.attributes.levelName,
          cityName: this.getCityByCode(graphic.attributes.cityCode).cityName
        }))
        this.refreshTable = false
        await this.$nextTick()
        this.refreshTable = true

        const result = await this.$store.dispatch(
          `business-data/update${this.dataType}`,
          { graphic }
        )
        if (result.code === 1) {
          this.$notify.success({
            message: '编辑成功',
            position: 'top right',
            timeOut: 5000
          })
        } else {
          this.$notify.error({
            message: '编辑失败: ' + result.msg,
            position: 'top right',
            timeOut: 5000
          })
        }
      }
    },

    async $_featureDeleted(features) {
      const featureSet = await this.featureLayer.queryFeatures()
      const feature = features[0]

      const { objectId } = feature
      const row = this.tableData.find(
        (row) => row[this.featureLayer.objectIdField] === objectId
      )
      if (row) {
        // this.tableData = featureSet.features.map(
        //   (graphic) => graphic.attributes
        // )
        this.dataTableData.rows = featureSet.features.map((graphic) => ({
          name: graphic.attributes.name,
          siteCode: graphic.attributes.siteCode,
          levelName: graphic.attributes.levelName,
          cityName: this.getCityByCode(graphic.attributes.cityCode).cityName
        }))
        this.refreshTable = false
        await this.$nextTick()
        this.refreshTable = true

        const result = await this.$store.dispatch(
          `business-data/delete${this.dataType}`,
          { id: row.id }
        )
        if (result.code === 1) {
          this.$notify.success({
            message: '删除成功',
            position: 'top right',
            timeOut: 5000
          })
        } else {
          this.$notify.error({
            message: '删除失败: ' + result.msg,
            position: 'top right',
            timeOut: 5000
          })
        }
      }
    },

    $_datatable_rowSelected(index) {
      const { siteCode } = this.dataTableData.rows[index]
      const graphic = this.featureLayer.source.find(
        (graphic) => graphic.getAttribute('siteCode') === siteCode
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
</script>

<style scoped>
.card {
  width: 500px;
  height: 700px;
  top: -200px;
}
</style>
