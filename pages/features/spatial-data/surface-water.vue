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
import $ from 'jquery'
import { mdbCard, mdbCardBody, mdbDatatable } from 'mdbvue'
export default {
  name: 'SurfaceWater',

  components: {
    mdbCard,
    mdbCardBody,
    mdbDatatable
  },

  async asyncData({ store }) {
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
      },
      {
        label: '管控级别',
        field: 'controlLevelName'
      },
      {
        label: '监管边界',
        field: 'boundary'
      },
      {
        label: '水系',
        field: 'riverSystem'
      },
      {
        label: '河流',
        field: 'river'
      }
    ]
    let rows = store.getters['business-data/getBusinessData'](
      'SurfaceWaterSurveillanceStation'
    )
    if (!rows) {
      await store.dispatch(
        'business-data/getAllSurfaceWaterSurveillanceStation',
        { isPage: 'NO' }
      )
      rows = store.getters['business-data/getBusinessData'](
        'SurfaceWaterSurveillanceStation'
      )
    }
    return {
      tableData: { columns, rows }
    }
  },

  mounted() {
    const activeMenu = $(
      '.nuxt-link-exact-active.nuxt-link-active.sidenav-link.ripple-parent'
    )
    activeMenu.addClass('active')
  }
}
</script>

<style scoped />
