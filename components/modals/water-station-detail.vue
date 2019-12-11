<template>
  <mdb-modal
    :show="showModal"
    @show="$_modal_beforeShow"
    @close="$emit('closeDetail')"
    size="fluid"
    scrollable
  >
    <mdb-modal-header>
      <div class="d-flex align-items-end">
        <mdb-modal-title>
          {{
            stationRTData.EXAMINECITYCODENAME +
              stationRTData.INSPECTCITYCODENAME +
              stationRTData.SITENAME
          }}
        </mdb-modal-title>
        <mdb-modal-title class="h6 ml-3">
          更新时间: {{ stationRTData.RECORDTIME }}
        </mdb-modal-title>
      </div>
    </mdb-modal-header>

    <mdb-modal-body>
      <mdb-row>
        <mdb-col>
          <mdb-tbl>
            <mdb-tbl-head>
              <tr>
                <th>监测因子</th>
                <th>监测值</th>
              </tr>
            </mdb-tbl-head>

            <mdb-tbl-body>
              <tr v-for="factor in factorList1" :key="factor">
                <td>
                  {{ waterMonitoringFactorMap.get(factor).name }}
                </td>
                <td :class="$_getMonitoringFactorColor(factor)">
                  {{ $_getMonitoringFactorDisplayValue(factor) }}
                </td>
              </tr>
            </mdb-tbl-body>
          </mdb-tbl>
        </mdb-col>

        <mdb-col>
          <mdb-tbl>
            <mdb-tbl-head>
              <tr>
                <th>监测因子</th>
                <th>监测值</th>
              </tr>
            </mdb-tbl-head>

            <mdb-tbl-body>
              <tr v-for="factor in factorList2" :key="factor">
                <td>
                  {{
                    waterMonitoringFactorMap.get(factor)
                      ? waterMonitoringFactorMap.get(factor).name
                      : ''
                  }}
                </td>
                <td :class="$_getMonitoringFactorColor(factor)">
                  {{ $_getMonitoringFactorDisplayValue(factor) || '' }}
                </td>
              </tr>
            </mdb-tbl-body>
          </mdb-tbl>
        </mdb-col>

        <mdb-col>
          <mdb-tbl>
            <mdb-tbl-head>
              <tr>
                <th>监测因子</th>
                <th>监测值</th>
              </tr>
            </mdb-tbl-head>

            <mdb-tbl-body>
              <tr v-for="factor in factorList3" :key="factor">
                <td>
                  {{ waterMonitoringFactorMap.get(factor).name }}
                </td>
                <td :class="$_getMonitoringFactorColor(factor)">
                  {{ $_getMonitoringFactorDisplayValue(factor) }}
                </td>
              </tr>
            </mdb-tbl-body>
          </mdb-tbl>
        </mdb-col>

        <mdb-col>
          <mdb-tbl>
            <mdb-tbl-head>
              <tr>
                <th>监测因子</th>
                <th>监测值</th>
              </tr>
            </mdb-tbl-head>

            <mdb-tbl-body>
              <tr v-for="factor in factorList4" :key="factor">
                <td>
                  {{ waterMonitoringFactorMap.get(factor).name }}
                </td>
                <td :class="$_getMonitoringFactorColor(factor)">
                  {{ $_getMonitoringFactorDisplayValue(factor) }}
                </td>
              </tr>
            </mdb-tbl-body>
          </mdb-tbl>
        </mdb-col>
      </mdb-row>
    </mdb-modal-body>

    <mdb-modal-footer>
      <mdb-btn @click="$emit('closeDetail')" color="info" rounded>
        <mdb-icon icon="times" class="mr-1" />关闭
      </mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import {
  mdbBtn,
  mdbIcon,
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter,
  mdbTbl,
  mdbTblHead,
  mdbTblBody,
  mdbRow,
  mdbCol
} from 'mdbvue'
import WaterStationApi from '~/api/WaterStation'

export default {
  name: 'WaterStationDetail',

  components: {
    mdbBtn,
    mdbIcon,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbTbl,
    mdbTblHead,
    mdbTblBody,
    mdbRow,
    mdbCol
  },

  props: {
    stationId: {
      type: String,
      required: true
    },
    showModal: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      stationRTData: {},
      factorList1: [
        'F01',
        'F02',
        'F03',
        'F04',
        'F05',
        'F06',
        'F07',
        'F08',
        'F09',
        'F10',
        'F11',
        'F12',
        'F13',
        'F14',
        'F15',
        'F16'
      ],
      factorList2: [
        'F17',
        'F18',
        'F19',
        'F20',
        'F21',
        'F22',
        'F23',
        'F24',
        'F25',
        'F26',
        'F27',
        'F28',
        'F29',
        'F30',
        'F31',
        'F32'
      ],
      factorList3: [
        'F33',
        'F34',
        'F35',
        'F36',
        'F37',
        'F38',
        'F39',
        'F40',
        'F41',
        'F42',
        'F43',
        'F44',
        'F45',
        'F46',
        'F47',
        'F48'
      ],
      factorList4: [
        'F49',
        'F50',
        'F51',
        'F52',
        'F53',
        'F54',
        'F55',
        'F56',
        'F57',
        'F58',
        'F59',
        'F60',
        'F61',
        'F62',
        'F63'
      ]
    }
  },

  computed: {
    ...mapState('business-data', ['waterMonitoringFactorMap'])
  },

  // watch: {
  //   async stationId() {
  //     const result = await WaterStationApi.getRTData(this.stationId)
  //     if (result) {
  //       this.stationRTData = result[0]
  //     }
  //   }
  // },

  methods: {
    ...mapMutations('business-data', ['startFetchData', 'stopFetchData']),

    $_getMonitoringFactorDisplayValue(factor) {
      const value = this.stationRTData[factor]
      return value + this.waterMonitoringFactorMap.get(factor).unit
    },

    $_getMonitoringFactorTooltip(factor) {
      const factorInfo = this.waterMonitoringFactorMap.get(factor)
      const { low, high, unit } = factorInfo
      return low + unit + ' - ' + high + unit
    },

    $_getMonitoringFactorColor(factor) {
      const value = this.stationRTData[factor]
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
    },

    async $_modal_beforeShow() {
      this.startFetchData()
      const result = await WaterStationApi.getRTData(this.stationId)
      this.stopFetchData()
      if (result) {
        this.stationRTData = result[0]
      }
    }
  }
}
</script>

<style scoped></style>
