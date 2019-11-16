<template>
  <mdb-card color="white" style="color: black !important;" class="h-100 w-100">
    <mdb-card-body class="p-0">
      <Map ref="main_map" theme="light" :widgets="['LayerList']" />
    </mdb-card-body>
    <!--    <mdb-sliding-card :show="show">-->
    <!--      <mdb-card-body class="p-0" style="height: 100vh">-->
    <!--        <Map theme="light" />-->
    <!--      </mdb-card-body>-->
    <!--    </mdb-sliding-card>-->
    <!--    <mdb-card-body>-->
    <!--      <mdb-card-group deck class="m-5">-->
    <!--        <feature-card-item-->
    <!--          v-for="(navbarItem, index) in sideNavbarItems"-->
    <!--          :key="index"-->
    <!--          v-bind="navbarItem"-->
    <!--        />-->
    <!--      </mdb-card-group>-->
    <!--      <mdb-btn-fixed-->
    <!--        color="light-blue"-->
    <!--        :icon="show ? 'angle-double-down' : 'angle-double-up'"-->
    <!--        :bottom="10"-->
    <!--        :right="10"-->
    <!--        @click.native.prevent="show = !show"-->
    <!--      />-->
    <!--    </mdb-card-body>-->
  </mdb-card>
</template>

<script>
import {
  // mdbBtnFixed,
  mdbCard,
  mdbCardBody
  // mdbCardGroup,
  // mdbSlidingCard
} from 'mdbvue'
import { mapState, mapMutations } from 'vuex'
// import PageComponents from '~/api/page-components'
// import FeatureCardItem from '~/components/feature-card-item'
import Map from '~/components/map/map'

export default {
  components: {
    Map,
    // FeatureCardItem,
    // mdbBtnFixed,
    mdbCard,
    mdbCardBody
    // mdbCardGroup,
    // mdbSlidingCard
  },

  data() {
    return {
      show: true
    }
  },

  computed: {
    ...mapState('app-info', ['title', 'subTitle'])
  },

  // asyncData({ params }) {
  //   return {
  //     sideNavbarItems: PageComponents.getSideNavbarItems()
  //   }
  // },

  mounted() {
    this.setNaviBreadcrumb({ naviBreadcrumb: [this.subTitle] })
  },

  methods: {
    ...mapMutations(['setNaviBreadcrumb'])
  }
}
</script>

<style scoped></style>
