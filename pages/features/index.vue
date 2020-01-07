<template>
  <mdb-card color="white" style="color: black !important;" class="h-100 w-100">
    <mdb-card-body class="p-0">
      <Map
        ref="main_map"
        :widgets="['LayerList', 'NearbySearch', 'Legend', 'MultiSearch']"
        :center="centerGeometry"
        theme="light"
        @mapPopupTriggerAction="$_map_popupTriggerAction"
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

      <pollutant-source-detail
        :show-modal="showPollutantSourceDetailModal"
        :station-id="detailPollutantSourceId"
        @closeDetail="showPollutantSourceDetailModal = false"
      />
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { mdbCard, mdbCardBody } from 'mdbvue'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { loadModules } from 'esri-loader'
import Map from '~/components/map/map'
import AirStationDetail from '~/components/modals/air-station-detail'
import WaterStationDetail from '~/components/modals/water-station-detail'
import PollutantSourceDetail from '~/components/modals/pollutant-source-detail'

export default {
  components: {
    AirStationDetail,
    WaterStationDetail,
    PollutantSourceDetail,
    Map,
    mdbCard,
    mdbCardBody
  },

  data() {
    return {
      showAirStationDetailModal: false,
      showWaterStationDetailModal: false,
      showPollutantSourceDetailModal: false,
      detailAirStationId: '',
      detailWaterStationId: '',
      detailPollutantSourceId: '',
      cities: [],
      centerGeometry: null
    }
  },

  computed: {
    ...mapState('app-info', ['appConfig']),
    ...mapGetters('business-data', ['getBusinessData'])
  },

  async mounted() {
    const [Graphic] = await loadModules(['esri/Graphic'], {
      url: `${this.appConfig.map.arcgis_api}/init.js`
    })
    // 地级市
    let response = await fetch(
      `${process.env.baseUrl}/layer/HeNan_Prefecture_Level_City_Simplify.json`
    )
    let data = await response.json()
    const prefectureCities = data.features.map((feature) =>
      Graphic.fromJSON(feature)
    )

    // 县级市
    response = await fetch(
      `${process.env.baseUrl}/layer/HeNan_County_Level_City_Simplify.json`
    )
    data = await response.json()
    const countyCities = data.features.map((feature) =>
      Graphic.fromJSON(feature)
    )
    this.cities = prefectureCities.concat(countyCities)

    let cityCode = this.$route.query.cityCode
    if (cityCode) {
      this.hideLayerListWidget()

      if (cityCode.length === 6) {
        cityCode = cityCode + '000'
      }
      const city = this.cities.find(
        (city) => city.getAttribute('Code') === cityCode
      )
      if (city) {
        this.centerGeometry = city.geometry
        this.setCityCode({ cityCode })
      }
    }

    const layerList = this.$route.query.layerList
    if (layerList) {
      const showLayer = layerList.split(',')
      this.setShowLayer({ showLayer })
    }
  },

  methods: {
    ...mapMutations(['setCityCode']),
    ...mapMutations('map', ['hideLayerListWidget', 'setShowLayer']),

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

        case 'DetailPollutantSource':
          this.detailPollutantSourceId = event.selectedGraphic.getAttribute(
            'id'
          )
          this.showPollutantSourceDetailModal = true
          break
      }
    }
  }
}
</script>

<style scoped />
