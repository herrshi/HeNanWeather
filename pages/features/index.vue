<template>
  <mdb-card color="white" style="color: black !important;" class="h-100 w-100">
    <mdb-card-body class="p-0">
      <Map
        ref="main_map"
        :widgets="['LayerList', 'NearbySearch']"
        @mapPopupTriggerAction="$_map_popupTriggerAction"
        theme="light"
      />

      <station-detail
        :show-modal="showDetailModal"
        :station-id="detailStationId"
        @closeDetail="showDetailModal = false"
      />
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { mdbCard, mdbCardBody } from 'mdbvue'
import { mapState, mapMutations } from 'vuex'
import Map from '~/components/map/map'
import StationDetail from '~/components/map/station-detail'

export default {
  components: {
    StationDetail,
    Map,
    mdbCard,
    mdbCardBody
  },

  data() {
    return {
      showDetailModal: false,
      detailStationId: ''
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
      if (event.actionId === 'Detail') {
        this.detailStationId = event.selectedGraphic.getAttribute('id')
        this.showDetailModal = true
      }
    }
  }
}
</script>

<style scoped></style>
