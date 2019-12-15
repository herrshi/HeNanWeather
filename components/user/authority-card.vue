<template>
  <mdb-card>
    <mdb-card-header tag="h4" color="success-color">
      <!--      {{ name }}-->
      <mdb-input :id="icon" :label="name" type="checkbox" class="h6" />
    </mdb-card-header>
    <mdb-card-body>
      <ul class="list-group">
        <li
          v-for="subItem in subItems"
          :key="subItem.id"
          class="list-group-item"
        >
          <mdb-input
            :id="subItem.id"
            v-model="subItem.checked"
            :label="subItem.name"
            type="checkbox"
          />
        </li>
      </ul>
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { mdbCard, mdbCardHeader, mdbCardBody, mdbInput } from 'mdbvue'
export default {
  name: 'AuthorityCard',

  components: {
    mdbCard,
    mdbCardHeader,
    mdbCardBody,
    mdbInput
  },

  props: {
    name: {
      type: String,
      default: ''
    },
    icon: {
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
