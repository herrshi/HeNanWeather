<template>
  <div class="flexible-content" :style="flexibleContentStyle">
    <mdb-navbar
      dark
      color="indigo"
      position="top"
      expand="large"
      :toggler="false"
      :style="navbarStyle"
    >
      <mdb-navbar-brand :to="{ name: 'features' }">
        <mdb-breadcrumb>
          <mdb-breadcrumb-item
            v-for="(item, index) in naviBreadcrumb"
            :key="index"
            >{{ item }}</mdb-breadcrumb-item
          >
        </mdb-breadcrumb>
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
    <div class="indigo-skin">
      <mdb-side-nav
        slim
        :is-collapsed="collapse"
        :break-width="0"
        side-nav-class="sn-bg-1"
        mask="strong"
      >
        <mdb-side-nav-nav>
          <side-navbar-item
            v-for="(navbarItem, index) in sideNavbarItems"
            :key="index"
            v-bind="navbarItem"
          />
          <mdb-side-nav-item
            icon="angle-double-left"
            open-icon="angle-double-right"
            fixed
            toggler
            :is-collapsed="collapse"
            @toggle="collapse = !collapse"
            >隐藏
          </mdb-side-nav-item>
        </mdb-side-nav-nav>
      </mdb-side-nav>
    </div>
    <div :style="contentStyle" class="page-content">
      <view-wrapper>
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
      </view-wrapper>
      <Loader v-if="showLoading" class="float-right" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  mdbBreadcrumb,
  mdbBreadcrumbItem,
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
  ViewWrapper,
  waves
} from 'mdbvue'
import PageComponents from '~/api/page-components'
import SideNavbarItem from '~/components/side-navbar-item'
import Loader from '~/components/loader'

export default {
  name: 'Features',

  components: {
    Loader,
    SideNavbarItem,
    mdbBreadcrumb,
    mdbBreadcrumbItem,
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
    ViewWrapper
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
    ...mapState('app-info', ['title', 'subTitle']),
    ...mapState('user', ['userName']),
    ...mapState(['naviBreadcrumb']),
    ...mapGetters(['showLoading']),

    contentStyle() {
      return `height: 100vh; margin-left: ${this.collapse ? 60 : 240}px`
    },

    navbarStyle() {
      return `margin-left: ${this.collapse ? 60 : 240}px`
    }
  },

  async asyncData({ store }) {
    await store.dispatch('user/getAllRoles')
    await store.dispatch('base-data/getAllPollutantSourceTypes')
    await store.dispatch('base-data/getAllControlLevels')
    await store.dispatch('base-data/getAllCities')
    await store.dispatch('base-data/getAllReservesTypes')
    await store.dispatch('business-data/getAllPollutantSourceEnterprises', {
      // isPage: 'NO'
      page: 1,
      limit: 100
    })
    return {
      sideNavbarItems: PageComponents.getSideNavbarItems()
    }
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
