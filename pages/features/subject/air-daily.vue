<template>
  <mdb-card style="color: black !important;" class="h-100 w-100">
    <mdb-card-body class="p-0">
      <Map
        :widgets="['AirQuality']"
        :widget-config="{ AirQuality: { type: 'daily' } }"
        theme="light"
        @mapPopupTriggerAction="$_map_popupTriggerAction"
      />
    </mdb-card-body>

    <air-quality-detail
      :show-modal="showAirQualityDetail"
      :city-code="cityCode"
      data-type="AirQualityDailyData"
      @closeDetail="showAirQualityDetail = false"
    />
  </mdb-card>
</template>

<script>
import $ from 'jquery'
import { mdbCard, mdbCardBody } from 'mdbvue'
import Map from '~/components/map/map'
import AirQualityDetail from '~/components/modals/air-quality-detail'

export default {
  name: 'AirDaily',

  components: {
    AirQualityDetail,
    Map,
    mdbCard,
    mdbCardBody
  },

  data() {
    return {
      cityCode: '',
      showAirQualityDetail: false
    }
  },

  mounted() {
    const activeMenu = $(
      '.nuxt-link-exact-active.nuxt-link-active.sidenav-link.ripple-parent'
    )
    activeMenu.addClass('active')
  },

  methods: {
    $_map_popupTriggerAction(event) {
      if (event.actionId === 'airQualityChart') {
        this.cityCode = event.selectedGraphic.getAttribute('Code')
        this.showAirQualityDetail = true
      }
    }
  }
}
</script>

<style scoped></style>
