<template>
  <mdb-side-nav-cat :name="name" :icon="icon">
    <mdb-side-nav-item
      v-for="(subItem, index) in subItems"
      :key="index"
      :to="{ name: subItem.to, query: { roleId } }"
      >{{ subItem.name }}
    </mdb-side-nav-item>
  </mdb-side-nav-cat>
</template>

<script>
import { mdbSideNavCat, mdbSideNavItem } from 'mdbvue'

export default {
  name: 'SideNavbarItem',

  components: {
    mdbSideNavCat,
    mdbSideNavItem
  },

  props: {
    name: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'chevron-right'
    },
    userId: {
      type: String,
      default: ''
    },
    roleId: {
      type: String,
      default: ''
    },
    subItems: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style>
.nuxt-link-exact-active.nuxt-link-active.sidenav-link.ripple-parent {
  color: #0d47a1;
}
</style>
