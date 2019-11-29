<template>
  <div :style="flexibleContentStyle" class="flexible-content">
    <!-- Navbar -->
    <mdb-navbar
      :toggler="false"
      color="indigo"
      position="top"
      expand="large"
      dark
      style="z-index: 1045"
    >
      <mdb-navbar-brand :to="{ name: 'features' }">
        <div class="d-flex">
          <img
            src="~/assets/images/logo1.png"
            alt="logo"
            height="30"
            class="mr-3"
          />
          <img src="~/assets/images/logo2.png" alt="logo" height="30" />
        </div>

        <!--        <mdb-breadcrumb>-->
        <!--          <mdb-breadcrumb-item-->
        <!--            v-for="(item, index) in naviBreadcrumb"-->
        <!--            :key="index"-->
        <!--            >{{ item }}</mdb-breadcrumb-item-->
        <!--          >-->
        <!--        </mdb-breadcrumb>-->
      </mdb-navbar-brand>
      <mdb-navbar-toggler>
        <mdb-navbar-nav right>
          <mdb-dropdown tag="li" class="nav-item">
            <mdb-dropdown-toggle
              slot="toggle"
              tag="a"
              nav-link
              color="indigo"
              waves-fixed
            >
              <mdb-icon icon="user" class="mr-1" />{{ userName }}
            </mdb-dropdown-toggle>
            <mdb-dropdown-menu right>
              <mdb-dropdown-item>
                省监测中心综合科
              </mdb-dropdown-item>
              <mdb-dropdown-item>
                <mdb-icon icon="list-alt" class="black-text mr-1" />我的服务
              </mdb-dropdown-item>
              <mdb-dropdown-item :to="{ name: 'index' }">
                <mdb-icon icon="sign-out-alt" class="black-text mr-1" />登出
              </mdb-dropdown-item>
            </mdb-dropdown-menu>
          </mdb-dropdown>
        </mdb-navbar-nav>
      </mdb-navbar-toggler>
    </mdb-navbar>
    <!--/.Navbar-->

    <!-- SideNavbar -->
    <div class="light-blue-skin">
      <mdb-side-nav
        :is-collapsed="collapse"
        :break-width="0"
        slim
        side-nav-class="sn-bg-1"
        mask="strong"
        side-nav-style="top: 50px"
      >
        <mdb-side-nav-nav>
          <side-navbar-item
            v-for="(navbarItem, index) in sideNavbarItems"
            :key="index"
            v-bind="navbarItem"
          />
          <mdb-side-nav-item
            :is-collapsed="collapse"
            @toggle="collapse = !collapse"
            icon="angle-double-left"
            open-icon="angle-double-right"
            fixed
            toggler
            >隐藏
          </mdb-side-nav-item>
        </mdb-side-nav-nav>
      </mdb-side-nav>
    </div>
    <!-- /.SideNavbar -->

    <div :style="contentStyle" class="page-content">
      <mdb-view>
        <mdb-mask
          overlay="indigo-strong"
          class="d-flex justify-content-center align-items-center"
        >
          <mdb-container
            fluid
            class="px-0"
            style="height: 100vh; padding-top: 55px; padding-bottom: 0"
          >
            <nuxt-child />
          </mdb-container>
        </mdb-mask>
      </mdb-view>
      <Loader v-if="showLoading" class="float-right" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import {
  // mdbBreadcrumb,
  // mdbBreadcrumbItem,
  mdbContainer,
  mdbDropdown,
  mdbDropdownItem,
  mdbDropdownMenu,
  mdbDropdownToggle,
  mdbIcon,
  mdbMask,
  mdbNavbar,
  mdbNavbarBrand,
  mdbNavbarNav,
  mdbNavbarToggler,
  mdbSideNav,
  mdbSideNavNav,
  mdbSideNavItem,
  mdbView,
  waves
} from 'mdbvue'
import SideNavbarItem from '~/components/side-navbar-item'
import Loader from '~/components/loader'

export default {
  name: 'Features',

  components: {
    Loader,
    SideNavbarItem,
    // mdbBreadcrumb,
    // mdbBreadcrumbItem,
    mdbContainer,
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbIcon,
    mdbMask,
    mdbNavbar,
    mdbNavbarBrand,
    mdbNavbarNav,
    mdbNavbarToggler,
    mdbSideNav,
    mdbSideNavNav,
    mdbSideNavItem,
    mdbView
  },

  mixins: [waves],

  data() {
    return {
      toggle: false,
      wide: true,
      collapse: false,
      flexibleContentStyle: false
    }
  },

  computed: {
    ...mapState('app-info', ['appConfig']),
    ...mapState('user', ['userName']),
    ...mapState(['naviBreadcrumb']),
    ...mapGetters(['showLoading']),

    sideNavbarItems() {
      return this.appConfig.pageComponents.sideNavbarItems
    },

    contentStyle() {
      return `height: 100vh; margin-left: ${this.collapse ? 60 : 240}px`
    },

    navbarStyle() {
      return `margin-left: ${this.collapse ? 60 : 240}px`
    }
  },

  async asyncData({ store }) {
    await store.dispatch('app-info/getAppConfig')
    await store.dispatch('user/getAllRoles')
    await store.dispatch('base-data/getAllPollutantSourceTypes')
    await store.dispatch('base-data/getAllControlLevels')
    await store.dispatch('base-data/getAllCities')
    await store.dispatch('base-data/getAllReservesTypes')
    await store.dispatch('business-data/getAllPollutantSourceEnterprises', {
      isPage: 'NO'
      // page: 1,
      // limit: 400
    })
    await store.dispatch(
      'business-data/getAllSurfaceWaterSurveillanceStations',
      { isPage: 'NO' }
    )
    await store.dispatch('business-data/getAllAirQualitySurveillanceStations', {
      isPage: 'NO'
    })
    await store.dispatch(
      'business-data/getAllMedicalWasteSurveillanceStation',
      {
        isPage: 'NO'
      }
    )
    await store.dispatch(
      'business-data/getAllRadiationSourceSurveillanceStations',
      {
        isPage: 'NO'
      }
    )
    await store.dispatch('business-data/getAllNoiseSurveillanceStations', {
      isPage: 'NO'
    })
    await store.dispatch('business-data/getWaterMonitorFactorInfos')
  },

  mounted() {
    this.setNaviBreadcrumb({
      naviBreadcrumb: [this.appConfig.app.subTitle]
    })
    const userId = this.$route.query.userId
    if (userId) {
      this.getUserInfo(userId)
    }
  },

  methods: {
    ...mapMutations(['setNaviBreadcrumb']),
    ...mapActions('user', ['getUserInfo'])
  }
}
</script>

<style scoped>
.view {
  background: url('~assets/images/89.jpg') no-repeat center center;
  background-size: cover;
  height: 100%;
}
.navbar i {
  cursor: pointer;
  color: white;
}
.flexible-content,
.flexible-content .navbar {
  transition: margin-left 0.5s;
}

.page-content {
  transition: all 0.2s linear;
}
</style>
