<template>
  <mdb-card color="white" style="color: black !important;" class="h-100 w-100">
    <mdb-card-body class="p-0">
      <Map
        ref="main_map"
        :widgets="['LayerList', 'NearbySearch']"
        @mapPopupTriggerAction="$_map_popupTriggerAction"
        theme="light"
      />

      <air-station-detail
        :show-modal="showAirStationDetailModal"
        :station-id="detailAirStationId"
        @closeDetail="showAirStationDetailModal = false"
      />

      <water-station-detail
        :show-modal="showWaterStationDetailModal"
        :station-id="detailWaterStationId"
        @closeDetail="showWaterStationDetailModal = false"
      />
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { mdbCard, mdbCardBody } from 'mdbvue'
import { mapState, mapMutations } from 'vuex'
import Map from '~/components/map/map'
import AirStationDetail from '~/components/modals/air-station-detail'
import WaterStationDetail from '~/components/modals/water-station-detail'

export default {
  components: {
    AirStationDetail,
    WaterStationDetail,
    Map,
    mdbCard,
    mdbCardBody
  },

  data() {
    return {
      showAirStationDetailModal: false,
      showWaterStationDetailModal: false,
      detailAirStationId: '',
      detailWaterStationId: ''
    }
  },

  computed: {
    ...mapState('app-info', ['appConfig'])
  },

  mounted() {
    this.setNaviBreadcrumb({ naviBreadcrumb: [this.appConfig.subTitle] })
  },

  methods: {
    ...mapMutations(['setNaviBreadcrumb']),

    $_map_popupTriggerAction(event) {
      switch (event.actionId) {
        case 'DetailAir':
          this.detailAirStationId = event.selectedGraphic.getAttribute('id')
          this.showAirStationDetailModal = true
          break

        case 'DetailWater':
          this.detailWaterStationId = event.selectedGraphic.getAttribute('id')
          this.showWaterStationDetailModal = true
          break
      }
    }
  }
}
</script>

<style scoped></style>
