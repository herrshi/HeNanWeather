<template>
  <mdb-row>
    <mdb-col v-for="(factorList, index) in factorCols" :key="index">
      <mdb-tbl>
        <mdb-tbl-head>
          <tr>
            <th>监测因子</th>
            <th>监测值</th>
            <th>标准值</th>
          </tr>
        </mdb-tbl-head>

        <mdb-tbl-body>
          <tr v-for="factor in factorList" :key="factor">
            <td>
              {{ waterMonitoringFactorMap.get(factor).name }}
            </td>
            <td :class="$_getMonitoringFactorColor(factor)">
              {{ $_getMonitoringFactorDisplayValue(factor) }}
            </td>
            <td>
              {{ $_getMonitoringFactorTooltip(factor) }}
            </td>
          </tr>
        </mdb-tbl-body>
      </mdb-tbl>
    </mdb-col>
  </mdb-row>
</template>

<script>
import { mdbRow, mdbCol, mdbTbl, mdbTblBody, mdbTblHead } from 'mdbvue'
import { mapState } from 'vuex'
export default {
  name: 'WaterQualityTable',

  components: {
    mdbRow,
    mdbCol,
    mdbTbl,
    mdbTblHead,
    mdbTblBody
  },

  props: {
    stationData: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      factorList1: ['F10', 'F11', 'F12', 'F13', 'F14'],
      factorList2: ['F15', 'F16', 'F20', 'F30', 'F18']
    }
  },

  computed: {
    ...mapState('business-data', ['waterMonitoringFactorMap']),
    factorCols() {
      return [this.factorList1, this.factorList2]
    }
  },

  methods: {
    $_getMonitoringFactorDisplayValue(factor) {
      const value = this.stationData[factor]
      return value + this.waterMonitoringFactorMap.get(factor).unit
    },

    $_getMonitoringFactorTooltip(factor) {
      const factorInfo = this.waterMonitoringFactorMap.get(factor)
      const { low, high, unit } = factorInfo
      return low + unit + ' ~ ' + high + unit
    },

    $_getMonitoringFactorColor(factor) {
      const value = this.stationData[factor]
      const factorInfo = this.waterMonitoringFactorMap.get(factor)
      const { low, high } = factorInfo
      if (
        (isNaN(high) && value >= low) ||
        (isNaN(low) && value <= high) ||
        (value >= low && value <= high)
      ) {
        return 'green-text'
      } else if (!isNaN(value)) {
        return 'red-text'
      } else {
        return 'grey-text'
      }
    }
  }
}
</script>

<style scoped />
