<template>
  <mdb-card color="white" style="color: black !important;" class="h-100 w-100">
    <mdb-card-body class="p-0">
      <Map
        :widgets="['FeatureEditor']"
        :widget-config="{ FeatureEditor: { dataType: 'SoilPollutantArea' } }"
        theme="light"
      />
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import $ from 'jquery'
import { mdbCard, mdbCardBody } from 'mdbvue'
import Map from '~/components/map/map'

export default {
  name: 'SoilPollutantArea',

  components: {
    Map,
    mdbCard,
    mdbCardBody
  },

  data() {
    return {}
  },

  mounted() {
    const activeMenu = $(
      '.nuxt-link-exact-active.nuxt-link-active.sidenav-link.ripple-parent'
    )
    activeMenu.addClass('active')
  }
}
</script>

<style scoped />
