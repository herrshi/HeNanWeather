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
        rounded
        size="sm"
        color="primary"
        :active="layerConfig.active"
        @click="$_toggleButton(layerConfig)"
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

  data() {
    return {}
  },

  computed: {
    ...mapState('business-data', ['pollutantSourceEnterprises']),
    ...mapState('app-info', ['appConfig']),
    ...mapGetters('business-data', ['getBusinessData']),
    ...mapGetters('map', ['businessLayer']),

    layerListConfig() {
      return this.appConfig.pageComponents.layerList
    }
  },

  async mounted() {
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
  },

  methods: {
    ...mapMutations('app-info', ['setLayerActive']),
    ...mapMutations('map', ['addBusinessLayer']),

    async $_createLayer(layerConfig) {
      const [FeatureLayer, Graphic] = await loadModules(
        ['esri/layers/FeatureLayer', 'esri/Graphic'],
        {
          url: `${this.appConfig.map.arcgis_api}/init.js`
        }
      )
      const {
        dataType,
        renderer,
        popupTemplate,
        fields,
        active = false
      } = layerConfig

      const features = this.getBusinessData(dataType)
      if (!features) {
        return null
      }
      const graphics = features.map((feature, index) => {
        const { geometry } = feature
        feature.FID = index
        return new Graphic({ geometry, attributes: feature })
      })
      return new FeatureLayer({
        objectIdField: 'FID',
        source: graphics,
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
    }
  }
}
</script>

<style scoped>
.btn-group {
  width: 900px;
}
</style>
