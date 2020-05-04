<template>
  <mdb-card color="white">
    <mdb-card-body>
      <mdb-select
        v-model="citySelector"
        label="城市"
        color="primary"
        @getValue="$_cityChanged"
      />
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { mdbCard, mdbCardBody, mdbSelect } from 'mdbvue'
import { mapState } from 'vuex'

export default {
  name: 'NonRoadMachinery',

  components: {
    mdbCard,
    mdbCardBody,
    mdbSelect
  },

  computed: {
    ...mapState('base-data', ['cities']),

    citySelector() {
      return this.cities
        .filter(
          (city) =>
            city.cityCode === '419001000' ||
            (city.cityCode.includes('00000') && city.cityCode !== '419000000')
        )
        .sort((a, b) => a.cityCode - b.cityCode)
        .map((city) => ({
          text: city.cityName,
          value: city.cityCode
        }))
    }
  },

  methods: {
    $_cityChanged() {}
  }
}
</script>

<style scoped>
.card {
  width: 300px;
  height: 500px;
}
</style>
