<template>
  <mdb-card color="white">
    <mdb-card-body>
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
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { loadModules } from 'esri-loader'
import { mapState, mapGetters } from 'vuex'
import { mdbCard, mdbCardBody, mdbTbl, mdbTblHead, mdbTblBody } from 'mdbvue'

export default {
  name: 'FeatureEditor',

  components: {
    mdbCard,
    mdbCardBody,
    mdbTbl,
    mdbTblHead,
    mdbTblBody
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
      tableData: []
    }
  },

  computed: {
    ...mapState('app-info', ['appConfig']),
    ...mapGetters('map', ['businessLayer']),

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
        return
      }
      this.featureLayer.visible = true

      const featureSet = await this.featureLayer.queryFeatures()
      this.tableData = featureSet.features.map((graphic) => graphic.attributes)

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
        this.tableData.push(graphic.attributes)
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
        this.tableData = featureSet.features.map(
          (graphic) => graphic.attributes
        )
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
        this.tableData = featureSet.features.map(
          (graphic) => graphic.attributes
        )
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
    }
  }
}
</script>

<style scoped>
.card {
  width: 600px;
  height: 300px;
}
</style>
