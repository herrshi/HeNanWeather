<template>
  <mdb-card color="white" style="color: black !important;" class="h-100 w-100">
    <mdb-card-body class="p-0">
      <Map
        :widgets="['WaterQuality']"
        :widget-config="{ WaterQuality: { type: 'hourly' } }"
        theme="light"
        @mapPopupTriggerAction="$_map_popupTriggerAction"
      />
    </mdb-card-body>

    <county-water-quality-rt-modal
      :show-modal="showCountyWaterQualityRT"
      :city-code="cityCode"
      @closeDetail="showCountyWaterQualityRT = false"
    />
  </mdb-card>
</template>

<script>
import { mdbCard, mdbCardBody } from 'mdbvue'
import Map from '~/components/map/map'
import CountyWaterQualityRtModal from '~/components/modals/county-water-quality-rt-modal'

export default {
  name: 'WaterHourly',

  components: {
    CountyWaterQualityRtModal,
    Map,
    mdbCard,
    mdbCardBody
  },

  data() {
    return {
      showCountyWaterQualityRT: false,
      cityCode: ''
    }
  },

  methods: {
    $_map_popupTriggerAction(event) {
      if (event.actionId === 'showCountryWaterQualityModal') {
        this.cityCode = event.selectedGraphic.getAttribute('Code')
        this.showCountyWaterQualityRT = true
      }
    }
  }
}
</script>

<style scoped />
