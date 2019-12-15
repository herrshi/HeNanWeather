<template>
  <mdb-card
    color="rgba-blue-slight"
    class="text-center hoverable animated fadeIn"
  >
    <mdb-card-body>
      <h3 class="font-weight-bold">
        <strong>{{ name }}</strong>
      </h3>
      <hr
        class="indigo darken-4 accent-2 mb-4 mt-0 d-inline-block mx-auto"
        style="width: 100px"
      />
      <p v-for="(subItem, index) in subItems" :key="index">
        <nuxt-link :to="{ name: subItem.to }" class="white-text">
          {{ subItem.name }}
        </nuxt-link>
      </p>
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { mdbCard, mdbCardBody } from 'mdbvue'
export default {
  name: 'FeatureCardItem',

  components: {
    mdbCard,
    mdbCardBody
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
