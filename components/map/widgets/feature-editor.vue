<template>
  <mdb-card color="white">
    <mdb-card-body> </mdb-card-body>
  </mdb-card>
</template>

<script>
import { loadModules } from 'esri-loader'
import { mapState } from 'vuex'
import { mdbCard, mdbCardBody } from 'mdbvue'

export default {
  name: 'FeatureEditor',

  components: {
    mdbCard,
    mdbCardBody
  },

  inject: ['getMap', 'getView'],

  data() {
    return {
      map: null,
      view: null,
      featureLayer: null
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

  watch: {
    featureLayer() {
      console.log(this.featureLayer.source.length)
    }
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
      this.view.ui.add(expandEditor, 'top-right')
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
