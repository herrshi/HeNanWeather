<template>
  <mdb-card style="color: black !important;" class="h-100 w-100">
    <mdb-card-body class="p-0">
      <Map
        :widgets="['AirQuality']"
        :widget-config="{ AirQuality: { type: 'rt' } }"
        theme="light"
      />
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { mdbCard, mdbCardBody } from 'mdbvue'
import Map from '~/components/map/map'
export default {
  name: 'AirRT',

  components: {
    Map,
    mdbCard,
    mdbCardBody
  }
}
</script>

<style scoped />
