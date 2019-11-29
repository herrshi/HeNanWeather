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
  name: 'RadiationSource',

  components: {
    mdbCard,
    mdbCardBody,
    mdbDatatable
  },

  asyncData({ store }) {
    const columns = [
      {
        label: '站点名称',
        field: 'name'
      },
      {
        label: '所在城市',
        field: 'cityName'
      },
      {
        label: '站点类型',
        field: 'stationTypeName'
      }
    ]
    const rows = store.getters['business-data/getBusinessData'](
      'RadiationSourceSurveillanceStation'
    )

    return {
      tableData: { columns, rows }
    }
  }
}
</script>

<style scoped></style>
