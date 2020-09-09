<template>
  <mdb-card style="color: black !important;" class="h-100 w-100">
    <mdb-card-body class="p-0">
      <Map
        :widgets="['WaterQuality']"
        :widget-config="{ WaterQuality: { type: subjectType } }"
        theme="light"
        @mapPopupTriggerAction="$_map_popupTriggerAction"
      />
    </mdb-card-body>

    <county-water-quality-hist-modal
      :show-modal="showCountyWaterQualityHist"
      :city-code="cityCode"
      :start-time="startTime"
      :end-time="endTime"
      :subject-type="subjectType"
      @closeDetail="showCountyWaterQualityHist = false"
    />
  </mdb-card>
</template>

<script>
import $ from 'jquery'
import { mdbCard, mdbCardBody } from 'mdbvue'
import Map from '~/components/map/map'
import CountyWaterQualityHistModal from '~/components/modals/county-water-quality-hist-modal'

export default {
  name: 'WaterHourly',

  components: {
    CountyWaterQualityHistModal,
    Map,
    mdbCard,
    mdbCardBody
  },

  mounted() {
    const activeMenu = $(
      '.nuxt-link-exact-active.nuxt-link-active.sidenav-link.ripple-parent'
    )
    activeMenu.addClass('active')
  },

  data() {
    return {
      showCountyWaterQualityHist: false,
      cityCode: '',
      startTime: '',
      endTime: '',
      // 专题类型--小时/日/月
      subjectType: 'daily'
    }
  },

  methods: {
    $_map_popupTriggerAction(event) {
      if (event.actionId === 'showCountryWaterQualityModal') {
        this.cityCode = event.selectedGraphic.getAttribute('Code')
        this.startTime = event.start
        this.endTime = event.end
        this.showCountyWaterQualityHist = true
      }
    }
  }
}
</script>

<style scoped />
