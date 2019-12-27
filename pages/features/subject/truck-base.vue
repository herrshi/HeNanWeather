<template>
  <mdb-card color="white" style="color: black !important;" class="h-100 w-100">
    <mdb-card-body>
      <div class="d-flex justify-content-start">
        <mdb-btn color="cyan" size="sm" rounded @click="$_showNewModal">
          <mdb-icon icon="plus" class="mr-1" />新增{{ pageName }}
        </mdb-btn>
      </div>

      <mdb-datatable
        v-if="refreshTable"
        :data="tableData"
        :tfoot="false"
        max-height="50vh"
        showing-text="显示"
        entries-title="每页显示"
        no-found-message="无符合记录"
        search-placeholder="搜索"
        arrows
        scroll-y
        fixed
        striped
        bordered
        hover
      />
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import { mdbCard, mdbCardBody, mdbBtn, mdbIcon, mdbDatatable } from 'mdbvue'
import { mapState } from 'vuex'

export default {
  name: 'TruckBase',

  components: {
    mdbCard,
    mdbCardBody,
    mdbBtn,
    mdbIcon,
    mdbDatatable
  },

  async fetch({ store }) {
    await store.dispatch('truck/getAllTrucks')
  },

  data() {
    return {
      pageName: '固废运送车辆',
      refreshTable: true
    }
  },

  computed: {
    ...mapState('truck', ['truckList']),

    tableData() {
      const columns = [
        {
          label: '司机姓名',
          field: 'driverName'
        },
        {
          label: '车牌号码',
          field: 'plateNum'
        },
        {
          label: '公司名称',
          field: 'company'
        },
        {
          label: '管理人员',
          field: 'chargePerson'
        },
        {
          label: '联系电话',
          field: 'phone'
        },
        {
          label: '操作',
          field: 'operation'
        }
      ]
      const rows = this.truckList.map((truck) => {
        const { id } = truck
        const operation = `
            <div class="d-flex">
              <button class="btn btn-indigo btn-sm btn-rounded" data-opt="edit" data-id="${id}">
                <i class="fas fa-edit mr-1"></i>编辑
              </button>
              <button class="btn btn-pink btn-sm btn-rounded" data-opt="delete" data-id="${id}">
                <i class="far fa-trash-alt mr-1"></i>删除
              </button>
            </div>
          `
        return { ...truck, operation }
      })

      return { columns, rows }
    }
  }
}
</script>

<style scoped></style>
