<template>
  <mdb-card color="white">
    <mdb-card-body>
      <mdb-tbl>
        <mdb-tbl-head>
          <tr>
            <th>编号</th>
            <th>名称</th>
          </tr>
        </mdb-tbl-head>

        <mdb-tbl-body>
          <tr v-for="(row, id) in tableData" :key="id">
            <td>{{ row.id }}</td>
            <td>{{ row.name }}</td>
          </tr>
        </mdb-tbl-body>
      </mdb-tbl>
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { loadModules } from 'esri-loader'
import { mapState } from 'vuex'
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
    ...mapState('app-info', ['appConfig'])
  },

  async created() {
    this.map = await this.getMap()
    this.view = await this.getView()
    this.$_createFeatureLayer()
  },

  methods: {
    async $_createFeatureLayer() {
      const [FeatureLayer, Editor, Expand] = await loadModules(
        [
          'esri/layers/FeatureLayer',
          'esri/widgets/Editor',
          'esri/widgets/Expand'
        ],
        {
          url: `${this.appConfig.map.arcgis_api}/init.js`
        }
      )
      this.featureLayer = new FeatureLayer({
        objectIdField: 'FID',
        source: [],
        geometryType: 'polygon',
        outFields: ['*'],
        title: '土壤污染区域',
        fields: [
          {
            name: 'FID',
            alias: 'FID',
            type: 'oid'
          },
          {
            name: 'name',
            alias: '名称',
            type: 'string'
          },
          {
            name: 'id',
            alias: '编号',
            type: 'string'
          }
        ]
      })
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
      features.forEach((feature) => {
        const { objectId } = feature
        const graphic = featureSet.features.find(
          (graphic) =>
            graphic.getAttribute(this.featureLayer.objectIdField) === objectId
        )
        if (graphic) {
          const { id, name } = graphic.attributes
          this.tableData.push({ id, name, objectId })
        }
      })
    },

    async $_featureUpdated(features) {
      const featureSet = await this.featureLayer.queryFeatures()
      features.forEach((feature) => {
        const { objectId } = feature
        const graphic = featureSet.features.find(
          (graphic) =>
            graphic.getAttribute(this.featureLayer.objectIdField) === objectId
        )
        if (graphic) {
          const { id, name } = graphic.attributes

          const row = this.tableData.find((row) => row.objectId === objectId)
          if (row) {
            row.id = id
            row.name = name
          }
        }
      })
    },

    $_featureDeleted(features) {
      features.forEach((feature) => {
        const { objectId } = feature
        const index = this.tableData.findIndex(
          (row) => row.objectId === objectId
        )
        if (index > -1) {
          this.tableData.splice(index, 1)
        }
      })
    }
  }
}
</script>

<style scoped>
.card {
  width: 300px;
  height: 300px;
}
</style>
