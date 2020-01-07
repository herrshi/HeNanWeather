<template>
  <div class="h-100" style="width: 400px">
    <mdb-input
      basic
      placeholder="搜索"
      aria-described-by="button-addon4"
      append-slot-id="button-addon4"
      @input="showSearchResult = true"
    >
      <mdb-btn slot="append" color="info" size="md" icon="search" group />
      <mdb-btn
        slot="append"
        color="info"
        size="md"
        icon="times"
        group
        @click="showSearchResult = false"
      />
    </mdb-input>

    <mdb-list-group v-if="showSearchResult" class="animated fadeInDown mt-2">
      <mdb-list-group-item :action="true" href="#" tag="a">
        :active="true">Cras justo odio</mdb-list-group-item
      >
      <mdb-list-group-item :action="true" href="#" tag="a"
        >Dapibus ac facilisis in</mdb-list-group-item
      >
      <mdb-list-group-item :action="true" href="#" tag="a"
        >Morbi leo risus</mdb-list-group-item
      >
      <mdb-list-group-item :action="true" href="#" tag="a"
        >Porta ac consectetur ac</mdb-list-group-item
      >
      <mdb-list-group-item :action="true" href="#" tag="a"
        >Vestibulum at eros</mdb-list-group-item
      >
      <mdb-list-group-item :action="true" href="#" tag="a">
        :active="true">Cras justo odio</mdb-list-group-item
      >
      <mdb-list-group-item :action="true" href="#" tag="a"
        >Dapibus ac facilisis in</mdb-list-group-item
      >
    </mdb-list-group>
  </div>
</template>

<script>
import { mdbBtn, mdbListGroup, mdbListGroupItem, mdbInput } from 'mdbvue'

export default {
  name: 'MultiSearch',

  components: {
    mdbBtn,
    mdbListGroup,
    mdbListGroupItem,
    mdbInput
  },

  data() {
    return {
      showSearchResult: false
    }
  }
}
</script>

<style scoped></style>
