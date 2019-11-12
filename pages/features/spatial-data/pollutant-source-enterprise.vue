<template>
  <mdb-card
    color="rgba-white-strong"
    style="color: black !important;"
    class="h-100 v-100"
  >
    <mdb-card-body class="p-0">
      <mdb-row class="h-100 v-100">
        <mdb-col class="pr-0">
          <Map />
        </mdb-col>

        <mdb-col class="px-0">
          <div class="h-100 v-100"></div>
        </mdb-col>
      </mdb-row>
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { mdbCard, mdbCardBody, mdbCol, mdbRow } from 'mdbvue'
import { mapMutations, mapState } from 'vuex'
import Map from '~/components/map'
export default {
  name: 'PollutantSourceEnterprise',

  components: {
    Map,
    mdbCard,
    mdbCardBody,
    mdbCol,
    mdbRow
  },

  data() {
    return {
      pageName: '重点污染源企业'
    }
  },

  computed: {
    ...mapState('app-info', ['title', 'subTitle'])
  },

  mounted() {
    this.setNaviBreadcrumb({
      naviBreadcrumb: [this.subTitle, '空间数据管理', this.pageName]
    })
  },

  methods: {
    ...mapMutations(['setNaviBreadcrumb'])
  }
}
</script>

<style scoped></style>
