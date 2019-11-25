<template>
  <mdb-modal :show="showModal" @close="$emit('closeDetail')" size="lg">
    <mdb-modal-header>
      <mdb-modal-title>{{ title }}</mdb-modal-title>
    </mdb-modal-header>
    <mdb-modal-body>...</mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn @click="$emit('closeDetail')" color="info" rounded>
        <mdb-icon icon="times" class="mr-1" />关闭
      </mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
import {
  mdbBtn,
  mdbIcon,
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter
} from 'mdbvue'
import AirStationApi from '~/api/AirStation'
export default {
  name: 'StationDetail',

  components: {
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
      title: ''
    }
  },

  watch: {
    async stationId() {
      const result = await AirStationApi.getRTData(this.stationId)
      const data = result[0]
      const { STATION_NAME: stationName, TIME_NAME: dataTime } = data
      this.title = `${stationName}  更新时间: ${dataTime}`
    }
  },

  methods: {
    $_close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped></style>
