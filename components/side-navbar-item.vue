<template>
  <mdb-side-nav-cat :name="name" :icon="icon">
    <mdb-side-nav-item
      v-for="(subItem, index) in subItems"
      :key="index"
      :to="{ name: subItem.to, query: { userId } }"
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
    subItems: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped />
