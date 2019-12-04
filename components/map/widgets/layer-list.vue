<template>
  <mdb-btn-group>
    <mdb-tooltip
      v-for="(layerConfig, index) in layerListConfig"
      :key="index"
      material
    >
      <span slot="tip">{{ layerConfig.name }}</span>
      <mdb-btn
        slot="reference"
        :active="layerConfig.active"
        @click="$_toggleButton(layerConfig)"
        rounded
        size="sm"
        color="primary"
      >
        {{ layerConfig.buttonName }}
      </mdb-btn>
    </mdb-tooltip>
  </mdb-btn-group>
</template>

<script>
import { mdbBtn, mdbBtnGroup, mdbTooltip } from 'mdbvue'
import { mapGetters, mapMutations, mapState } from 'vuex'
import { loadModules } from 'esri-loader'

export default {
  name: 'LayerList',

  inject: ['getMap'],

  components: {
    mdbBtn,
    mdbBtnGroup,
    mdbTooltip
  },

  computed: {
    ...mapState('app-info', ['appConfig']),
    ...mapGetters('business-data', ['getBusinessData']),
    ...mapGetters('map', ['businessLayer']),

    layerListConfig() {
      return this.appConfig.pageComponents.layerList
    }
  },

  async mounted() {
    this.startUpdating()

    const map = await this.getMap()
    // foreach中不能使用async/await
    for (let i = 0; i < this.layerListConfig.length; i++) {
      const layerConfig = this.layerListConfig[i]
      const layer = await this.$_createLayer(layerConfig)
      if (layer) {
        this.addBusinessLayer({ type: layerConfig.dataType, layer })
        map.add(layer)
      }
    }

    this.stopUpdating()
  },

  methods: {
    ...mapMutations('app-info', ['setLayerActive']),
    ...mapMutations('map', [
      'addBusinessLayer',
      'startUpdating',
      'stopUpdating'
    ]),

    async $_createLayer(layerConfig) {
      const [FeatureLayer, Graphic] = await loadModules(
        ['esri/layers/FeatureLayer', 'esri/Graphic'],
        {
          url: `${this.appConfig.map.arcgis_api}/init.js`
        }
      )
      const {
        name,
        dataType,
        renderer,
        popupTemplate,
        fields,
        active = false,
        geometryType
      } = layerConfig

      let features = this.getBusinessData(dataType)
      if (!features || features.length === 0) {
        await this.$store.dispatch(`business-data/getAll${dataType}`, {
          isPage: 'NO'
        })
        features = this.getBusinessData(dataType)
        if (!features) {
          return null
        } else if (features.length === 0) {
          const layer = new FeatureLayer()
          layer.geometryType = geometryType
          layer.source = []
          layer.objectIdField = 'FID'
          layer.label = name
          layer.outFields = ['*']
          layer.visible = active
          layer.fields = fields
          layer.renderer = renderer
          layer.popupTemplate = popupTemplate
          return layer
        }
      }

      const graphics = []
      for (let i = 0; i < features.length; i++) {
        const feature = features[i]
        const { geometry } = feature
        feature.FID = i
        if (geometry) {
          graphics.push(new Graphic({ geometry, attributes: feature }))
        }
      }
      return new FeatureLayer({
        objectIdField: 'FID',
        label: name,
        source: graphics,
        geometryType,
        outFields: ['*'],
        visible: active,
        fields,
        renderer,
        popupTemplate
      })
    },

    $_toggleButton(layerConfig) {
      const { dataType } = layerConfig
      const active = !layerConfig.active
      this.setLayerActive({ type: dataType, active })

      const layer = this.businessLayer(dataType)
      if (layer) {
        layer.visible = active
      }
    },

    resetLayers() {
      this.layerListConfig.forEach((layerConfig) => {
        const { dataType, active } = layerConfig
        const layer = this.businessLayer(dataType)
        if (layer) {
          layer.visible = active
        }
      })
    }
  }
}
</script>

<style scoped>
.btn-group {
  width: 800px;
}
</style>
