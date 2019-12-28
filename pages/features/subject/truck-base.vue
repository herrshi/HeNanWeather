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
        max-height="70vh"
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

    <ConfirmDelete
      :show-modal="showDeleteModal"
      :delete-content="deleteModalContent"
      @confirmYes="$_deleteModal_ConfirmYes"
      @confirmNo="showDeleteModal = false"
    />

    <edit-truck-modal
      :show-modal="showEditModal"
      :new-or-edit="newOrEdit"
      :driver-name.sync="driverNameToEdit"
      :plate-num.sync="plateNumToEdit"
      :company.sync="companyToEdit"
      :charge-person.sync="chargePersonToEdit"
      :phone.sync="phoneToEdit"
      :gps-phone.sync="gpsPhoneToEdit"
      @confirmYes="$_editModal_confirmYes"
      @confirmNo="showEditModal = false"
    />
  </mdb-card>
</template>

<script>
import { mdbCard, mdbCardBody, mdbBtn, mdbIcon, mdbDatatable } from 'mdbvue'
import { mapState, mapGetters, mapActions } from 'vuex'
import $ from 'jquery'
import EditTruckModal from '~/components/modals/edit-truck-modal'
import ConfirmDelete from '~/components/modals/confirm-delete-modal'

export default {
  name: 'TruckBase',

  components: {
    mdbCard,
    mdbCardBody,
    mdbBtn,
    mdbIcon,
    mdbDatatable,
    EditTruckModal,
    ConfirmDelete
  },

  async fetch({ store }) {
    await store.dispatch('truck/getAllTrucks')
  },

  data() {
    return {
      pageName: '固废运送车辆',
      refreshTable: true,
      showEditModal: false,
      showDeleteModal: false,
      deleteModalContent: '',
      newOrEdit: '',
      selected: {},
      driverNameToEdit: '',
      plateNumToEdit: '',
      companyToEdit: '',
      chargePersonToEdit: '',
      phoneToEdit: '',
      gpsPhoneToEdit: ''
    }
  },

  computed: {
    ...mapState('truck', ['truckList']),
    ...mapGetters('truck', ['getTruckById']),

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
  },

  mounted() {
    this.$_attachTableButtonEvent()
  },

  methods: {
    ...mapActions('truck', ['addTruck', 'updateTruck', 'deleteTruck']),

    async $_showMessage(result, refreshTable = true) {
      if (result.code === 1) {
        this.$notify.success({
          message: result.msg,
          position: 'top right'
        })
        if (refreshTable) {
          // 使用v-if刷新表格
          this.refreshTable = false
          await this.$nextTick()
          this.refreshTable = true
          // 重新绑定button click
          await this.$nextTick()
          this.$_attachTableButtonEvent()
        }
      } else {
        this.$notify.error({
          message: result.msg,
          position: 'top right'
        })
      }
    },

    $_showNewModal() {
      this.newOrEdit = 'new'
      this.driverNameToEdit = ''
      this.plateNumToEdit = ''
      this.companyToEdit = ''
      this.chargePersonToEdit = ''
      this.phoneToEdit = ''
      this.gpsPhoneToEdit = ''
      this.showEditModal = true
    },

    $_showEditModal() {
      this.newOrEdit = 'edit'
      this.driverNameToEdit = this.selected.driverName
      this.plateNumToEdit = this.selected.plateNum
      this.companyToEdit = this.selected.company
      this.chargePersonToEdit = this.selected.chargePerson
      this.phoneToEdit = this.selected.phone
      this.gpsPhoneToEdit = this.selected.gpsPhone
      this.showEditModal = true
    },

    async $_editModal_confirmYes() {
      this.showEditModal = false
      const result =
        this.newOrEdit === 'new'
          ? await this.addTruck({
              driverName: this.driverNameToEdit,
              gpsPhone: this.gpsPhoneToEdit,
              plateNum: this.plateNumToEdit,
              company: this.companyToEdit,
              chargePerson: this.chargePersonToEdit,
              phone: this.phoneToEdit
            })
          : await this.updateTruck({
              id: this.selected.id,
              driverName: this.driverNameToEdit,
              gpsPhone: this.gpsPhoneToEdit,
              plateNum: this.plateNumToEdit,
              company: this.companyToEdit,
              chargePerson: this.chargePersonToEdit,
              phone: this.phoneToEdit
            })
      this.$_showMessage(result)
    },

    $_showDeleteModal() {
      this.deleteModalContent = this.selected.plateNum
      this.showDeleteModal = true
    },

    async $_deleteModal_ConfirmYes() {
      this.showDeleteModal = false
      const result = await this.deleteTruck({ id: this.selected.id })
      this.$_showMessage(result)
    },

    $_attachTableButtonEvent() {
      $('tbody').on('click', 'td button', (event) => {
        const operation = $(event.currentTarget).data('opt')
        const truckId = String($(event.currentTarget).data('id'))
        this.selected = this.getTruckById(truckId)

        if (operation === 'delete') {
          this.$_showDeleteModal()
        } else if (operation === 'edit') {
          this.$_showEditModal()
        }
      })
    }
  }
}
</script>

<style scoped></style>
