<template>
  <mdb-btn-group>
    <mdb-btn
      rounded
      size="sm"
      color="primary"
      :active="activeAir"
      @click.native="activeAir = !activeAir"
    >
      空气
    </mdb-btn>

    <mdb-btn
      rounded
      size="sm"
      color="primary"
      :active="activeWater"
      @click.native="activeWater = !activeWater"
    >
      地表水
    </mdb-btn>

    <mdb-btn
      rounded
      size="sm"
      color="primary"
      :active="activeEnterprise"
      @click.native="$_toggleEnterprise"
    >
      重点污染源企业
    </mdb-btn>

    <mdb-btn
      rounded
      size="sm"
      color="primary"
      :active="activeMedical"
      @click.native="activeMedical = !activeMedical"
    >
      医疗固废
    </mdb-btn>

    <mdb-btn
      rounded
      size="sm"
      color="primary"
      :active="activeFallout"
      @click.native="activeFallout = !activeFallout"
    >
      辐射源
    </mdb-btn>

    <mdb-btn
      rounded
      size="sm"
      color="primary"
      :active="activeRadiation"
      @click.native="activeRadiation = !activeRadiation"
    >
      放射源
    </mdb-btn>

    <mdb-btn
      rounded
      size="sm"
      color="primary"
      :active="activeNoise"
      @click.native="activeNoise = !activeNoise"
    >
      噪声
    </mdb-btn>

    <mdb-btn
      rounded
      size="sm"
      color="primary"
      :active="activeSoil"
      @click.native="activeSoil = !activeSoil"
    >
      土壤地块
    </mdb-btn>

    <mdb-btn
      rounded
      size="sm"
      color="primary"
      :active="activeGas"
      @click.native="activeGas = !activeGas"
    >
      机动车尾气
    </mdb-btn>
  </mdb-btn-group>
</template>

<script>
import { mdbBtn, mdbBtnGroup } from 'mdbvue'
import { mapState } from 'vuex'
export default {
  name: 'LayerList',

  components: {
    mdbBtn,
    mdbBtnGroup
  },

  data() {
    return {
      activeAir: false,
      activeWater: false,
      activeEnterprise: false,
      activeMedical: false,
      activeRadiation: false,
      activeFallout: false,
      activeNoise: false,
      activeSoil: false,
      activeGas: false
    }
  },

  computed: {
    ...mapState('business-data', ['pollutantSourceEnterprises'])
  },

  methods: {
    $_toggleEnterprise() {
      this.activeEnterprise = !this.activeEnterprise
      if (this.activeEnterprise) {
        this.$_addEnterprisesToMap()
      } else {
        this.$refs.main_map.deleteOverlays({
          type: 'PollutantSourceEnterprise'
        })
      }
    },

    $_addEnterprisesToMap() {
      const overlays = this.pollutantSourceEnterprises.map((enterprise) => ({
        id: enterprise.id,
        type: 'PollutantSourceEnterprise',
        geometry: { type: 'point', x: enterprise.x, y: enterprise.y },
        attributes: enterprise
      }))
      const defaultSymbol = {
        type: 'picture-marker',
        url: `/images/GangDianSp-red.png`,
        width: '24px',
        height: '35px'
      }
      const defaultPopupTemplate = {
        title: '{name}',
        content: [
          {
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'cityName',
                label: '所在城市'
              },
              {
                fieldName: 'controlLevelName',
                label: '管控级别'
              },
              {
                fieldName: 'pollutantSourceTypeName',
                label: '污染源类型'
              }
            ]
          }
        ]
      }
      this.$parent.addOverlays({
        overlays,
        defaultSymbol,
        defaultPopupTemplate
      })
    }
  }
}
</script>

<style scoped>
.btn-group {
  width: 900px;
}
</style>
