<template>
  <mdb-modal
    :show="showModal"
    size="xl"
    scrollable
    @show="$_modal_beforeShow"
    @close="$emit('closeDetail')"
  >
    <mdb-modal-header>
      <div class="d-flex align-items-end">
        <mdb-modal-title>
          {{
            stationRTData
              ? stationRTData.EXAMINECITYCODENAME +
                stationRTData.INSPECTCITYCODENAME +
                stationRTData.SITENAME
              : ''
          }}
        </mdb-modal-title>
        <mdb-modal-title class="h6 ml-3">
          更新时间: {{ stationRTData ? stationRTData.RECORDTIME : '' }}
        </mdb-modal-title>
      </div>
    </mdb-modal-header>

    <mdb-modal-body>
      <div v-if="loadingStatus !== '数据载入完成'" class="text-center">
        <p>
          <strong>{{ loadingStatus }}</strong>
        </p>
      </div>
      <water-quality-table
        v-if="loadingStatus === '数据载入完成'"
        :station-data="stationRTData"
      />
    </mdb-modal-body>

    <mdb-modal-footer>
      <mdb-btn color="info" rounded @click="$emit('closeDetail')">
        <mdb-icon icon="times" class="mr-1" />关闭
      </mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
import { mapMutations } from 'vuex'
import {
  mdbBtn,
  mdbIcon,
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter
} from 'mdbvue'
import WaterStationApi from '~/api/WaterStation'
import WaterQualityTable from '~/components/modals/water-quality-table'

export default {
  name: 'WaterStationDetail',

  components: {
    WaterQualityTable,
    mdbBtn,
    mdbIcon,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter
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
      stationRTData: undefined
    }
  },

  computed: {
    loadingStatus() {
      if (!this.stationRTData) {
        return '数据载入中'
      } else if (Object.keys(this.stationRTData).length === 0) {
        return '无数据'
      } else {
        return '数据载入完成'
      }
    }
  },

  methods: {
    ...mapMutations('business-data', ['startFetchData', 'stopFetchData']),

    async $_modal_beforeShow() {
      this.stationRTData = undefined

      this.startFetchData()
      const result = await WaterStationApi.getRTData(this.stationId)
      this.stopFetchData()
      this.stationRTData = result && result.length > 0 ? result[0] : {}
    }
  }
}
</script>

<style scoped></style>
