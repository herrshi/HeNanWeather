<template>
  <mdb-modal
    :show="showModal"
    size="lg"
    scrollable
    @show="$_modal_beforeShow"
    @close="$emit('closeDetail')"
  >
    <mdb-modal-header>
      <mdb-modal-title> {{ cityName }} </mdb-modal-title>
    </mdb-modal-header>

    <mdb-modal-body>
      <mdb-select
        v-model="stationSelect"
        label="站点选择: "
        @getValue="$_stationChanged"
      />
      <water-quality-table :station-data="stationRTData" />
    </mdb-modal-body>

    <mdb-modal-footer>
      <mdb-btn color="info" rounded @click="$emit('closeDetail')">
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
  mdbModalFooter,
  mdbSelect
} from 'mdbvue'
import { mapMutations, mapGetters, mapActions } from 'vuex'
import WaterStationApi from '~/api/WaterStation'
import WaterQualityTable from '~/components/modals/water-quality-table'

export default {
  name: 'CountyWaterQualityModal',

  components: {
    WaterQualityTable,
    mdbBtn,
    mdbIcon,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbSelect
  },

  props: {
    cityCode: {
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
      stationSelect: []
    }
  },

  computed: {
    ...mapGetters('base-data', ['getCityByCode']),
    ...mapGetters('business-data', ['getBusinessData']),

    cityName() {
      const city = this.getCityByCode(this.cityCode)
      return city ? city.cityName : ''
    }
  },

  methods: {
    ...mapMutations('business-data', ['startFetchData', 'stopFetchData']),
    ...mapActions('business-data', ['getAllSurfaceWaterSurveillanceStation']),

    async $_modal_beforeShow() {
      this.startFetchData()

      this.stationRTData = {}
      this.stationSelect = []

      let stations = await this.getBusinessData(
        'SurfaceWaterSurveillanceStation'
      )
      if (stations) {
        await this.getAllSurfaceWaterSurveillanceStation({ isPage: 'NO' })
        stations = this.getBusinessData('SurfaceWaterSurveillanceStation')
      }
      if (!stations) {
        return
      }
      const filteredStations = stations.filter(
        (station) => station.cityCode === this.cityCode
      )
      this.stationSelect = filteredStations.map((station) => ({
        text: station.name,
        value: station.id
      }))
      if (this.stationSelect.length > 0) {
        this.stationSelect[0].selected = true
      }

      this.$_stationChanged()

      this.stopFetchData()
    },

    async $_stationChanged() {
      const selectedStation = this.stationSelect.find(
        (station) => station.selected === true
      )
      if (selectedStation) {
        const result = await WaterStationApi.getRTData(selectedStation.value)
        if (result) {
          this.stationRTData = result[0]
        }
      }
    }
  }
}
</script>

<style scoped />
