<template>
  <div :style="flexibleContentStyle" class="flexible-content">
    <!-- Navbar -->
    <mdb-navbar
      v-if="!mapOnly"
      :toggler="false"
      position="top"
      expand="large"
      dark
      style="z-index: 1045; height: 84px; background-color: #1e90ff"
    >
      <mdb-navbar-brand :to="{ name: 'features', query: { roleId } }">
        <div class="d-flex">
          <img
            src="~/assets/images/logo1.png"
            alt="logo"
            height="51px"
            class="mr-3"
          />
          <img src="~/assets/images/logo2.png" alt="logo" height="51px" />
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
          <mdb-nav-item icon="home" href="http://10.41.109.69:8080/hb/" />
          <mdb-dropdown tag="li" class="nav-item">
            <mdb-dropdown-toggle
              slot="toggle"
              tag="a"
              nav-link
              waves-fixed
              style="background-color: #1e90ff"
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
              <mdb-dropdown-item href="http://10.41.109.69:8080/hb/">
                <mdb-icon icon="sign-out-alt" class="black-text mr-1" />登出
              </mdb-dropdown-item>
            </mdb-dropdown-menu>
          </mdb-dropdown>
        </mdb-navbar-nav>
      </mdb-navbar-toggler>
    </mdb-navbar>
    <!--/.Navbar-->

    <!-- SideNavbar -->
    <div v-if="!mapOnly" class="light-blue-skin">
      <mdb-side-nav
        :is-collapsed="collapse"
        :break-width="0"
        slim
        side-nav-class="sn-bg-1"
        mask="strong"
        side-nav-style="top: 84px"
      >
        <mdb-side-nav-nav>
          <side-navbar-item
            v-for="(navbarItem, index) in sideNavbarItems"
            :key="index"
            v-bind="navbarItem"
            :user-id="userId"
            :role-id="roleId"
          />
          <mdb-side-nav-item
            :is-collapsed="collapse"
            icon="angle-double-left"
            open-icon="angle-double-right"
            fixed
            toggler
            @toggle="collapse = !collapse"
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
          <mdb-container fluid class="px-0 h-100 pb-0">
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
  mdbNavItem,
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
    mdbNavItem,
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

  async fetch({ store, query }) {
    const { userId, roleId } = query
    if (userId) {
      store.dispatch('user/getUserInfo', userId)
    }

    if (roleId) {
      await store.dispatch('user/getMenuByRole', { roleId })
    }
    await store.dispatch('app-info/getAppConfig')
    await store.dispatch('user/getAllRoles')
    await store.dispatch('base-data/getAllPollutantSourceTypes')
    await store.dispatch('base-data/getAllControlLevels')
    await store.dispatch('base-data/getAllCities')
    await store.dispatch('base-data/getAllReservesTypes')
    // await store.dispatch('business-data/getAllPollutantSourceEnterprise', {
    //   isPage: 'NO'
    // })
    // await store.dispatch(
    //   'business-data/getAllSurfaceWaterSurveillanceStation',
    //   { isPage: 'NO' }
    // )
    // await store.dispatch('business-data/getAllAirQualitySurveillanceStation', {
    //   isPage: 'NO'
    // })
    // await store.dispatch(
    //   'business-data/getAllMedicalWasteSurveillanceStation',
    //   {
    //     isPage: 'NO'
    //   }
    // )
    // await store.dispatch(
    //   'business-data/getAllRadiationSourceSurveillanceStation',
    //   {
    //     isPage: 'NO'
    //   }
    // )
    // await store.dispatch('business-data/getAllNoiseSurveillanceStation', {
    //   isPage: 'NO'
    // })
    // await store.dispatch('business-data/getAllSoilPollutantArea')
    await store.dispatch('business-data/getWaterMonitorFactorInfos')
  },

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
    ...mapState('user', ['userName', 'userId', 'roleId', 'sideNavbarItems']),
    ...mapState(['naviBreadcrumb', 'mapOnly']),
    ...mapGetters(['showLoading']),

    contentStyle() {
      return `height: 100vh;
      padding-top: ${this.mapOnly ? 0 : 84}px;
      margin-left: ${this.mapOnly ? 0 : this.collapse ? 60 : 240}px`
    },

    navbarStyle() {
      return `margin-left: ${this.collapse ? 60 : 240}px`
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
