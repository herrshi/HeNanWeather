<template>
  <mdb-card color="white" style="color: black !important;" class="h-100 w-100">
    <mdb-card-body class="p-0">
      <Map
        :widgets="['Noise']"
        :widget-config="{ Noise: { type: 'rt' } }"
        theme="light"
      />
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { mdbCard, mdbCardBody } from 'mdbvue'
import Map from '~/components/map/map'
export default {
  name: 'NoiseRt',

  components: {
    mdbCard,
    mdbCardBody,
    Map
  }
}
</script>

<style scoped />
