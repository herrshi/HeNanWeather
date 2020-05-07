<template>
  <mdb-card color="white" style="color: black !important;" class="h-100 w-100">
    <mdb-card-body class="p-2">
      <mdb-datatable
        :data="tableData"
        :tfoot="false"
        max-height="50vh"
        showing-text="显示"
        entries-title=""
        no-found-message="无符合记录"
        search-placeholder="搜索"
        arrows
        striped
        scroll-y
        bordered
        hover
        fixed
        class="m-2"
      />
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { mdbCard, mdbCardBody, mdbDatatable } from 'mdbvue'
export default {
  name: 'TelemetryPoint',

  components: {
    mdbCard,
    mdbCardBody,
    mdbDatatable
  },

  async asyncData({ store }) {
    const columns = [
      {
        label: '点位名称',
        field: 'name'
      },
      {
        label: '地址',
        field: 'address'
      }
    ]
    let rows = store.getters['business-data/getBusinessData']('TelemetryPoint')
    if (!rows) {
      await store.dispatch('business-data/getAllTelemetryPoint', {
        isPage: 'NO'
      })
      rows = store.getters['business-data/getBusinessData']('TelemetryPoint')
    }

    return {
      tableData: { columns, rows }
    }
  }
}
</script>

<style scoped />
