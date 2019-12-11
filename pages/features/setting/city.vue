<template>
  <mdb-card
    color="rgba-white-strong"
    style="color: black !important;"
    class="h-100 v-100"
  >
    <mdb-card-body>
      <div class="d-flex justify-content-start">
        <mdb-btn @click="$_showNewModal" color="cyan" size="sm" rounded>
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

    <!-- 删除确认 -->
    <ConfirmDelete
      :show-modal="showDeleteModal"
      :delete-content="deleteModalContent"
      @confirmYes="$_deleteModal_ConfirmYes"
      @confirmNo="showDeleteModal = false"
    />
    <!-- /.删除确认 -->

    <edit-city-modal
      :show-modal="showEditModal"
      :new-or-edit="newOrEdit"
      :city-name.sync="nameToEdit"
      :city-code.sync="codeToEdit"
      @confirmYes="$_editModal_confirmYes"
      @confirmNo="showEditModal = false"
    />
  </mdb-card>
</template>

<script>
import { mdbBtn, mdbCard, mdbCardBody, mdbDatatable, mdbIcon } from 'mdbvue'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import $ from 'jquery'
import ConfirmDelete from '~/components/modals/confirm-delete-modal'
import EditCityModal from '~/components/modals/edit-city-modal'
export default {
  name: 'City',

  components: {
    ConfirmDelete,
    EditCityModal,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbDatatable,
    mdbIcon
  },

  data() {
    return {
      pageName: '城市',
      showDeleteModal: false,
      deleteModalContent: '',
      showEditModal: false,
      newOrEdit: '',
      nameToEdit: '',
      codeToEdit: '',
      selected: {},
      refreshTable: true
    }
  },

  computed: {
    ...mapState('app-info', ['appConfig']),
    ...mapState('base-data', ['cities']),
    ...mapGetters('base-data', ['getCityById']),

    tableData() {
      const columns = [
        {
          label: '城市名称',
          field: 'name'
        },
        {
          label: '城市编码',
          field: 'code'
        },
        {
          label: '操作',
          field: 'operation'
        }
      ]
      const rows = []
      this.cities.forEach((city) => {
        const { cityCode, cityName, cityId, isDelete } = city
        if (isDelete === 1) {
          const operation = `
            <div class="d-flex">
              <button class="btn btn-indigo btn-sm btn-rounded" data-opt="edit" data-id="${cityId}">
                <i class="fas fa-edit mr-1"></i>编辑
              </button>
              <button class="btn btn-pink btn-sm btn-rounded" data-opt="delete" data-id="${cityId}">
                <i class="far fa-trash-alt mr-1"></i>删除
              </button>
            </div>
          `
          rows.push({
            name: cityName,
            code: cityCode,
            operation
          })
        }
      })

      return { columns, rows }
    }
  },

  mounted() {
    this.setNaviBreadcrumb({
      naviBreadcrumb: [this.appConfig.subTitle, '系统设置', this.pageName]
    })
    this.$_attachTableButtonEvent()
  },

  methods: {
    ...mapMutations(['setNaviBreadcrumb']),
    ...mapActions('base-data', ['addCity', 'editCity', 'deleteCity']),

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
      this.nameToEdit = ''
      this.showEditModal = true
    },

    $_showEditModal() {
      this.newOrEdit = 'edit'
      this.nameToEdit = this.selected.cityName
      this.codeToEdit = this.selected.cityCode
      this.showEditModal = true
    },

    $_showDeleteModal() {
      this.deleteModalContent = this.selected.cityName
      this.showDeleteModal = true
    },

    async $_editModal_confirmYes() {
      this.showEditModal = false
      const result =
        this.newOrEdit === 'new'
          ? await this.addCity({
              cityName: this.nameToEdit,
              cityCode: this.codeToEdit
            })
          : await this.editCity({
              cityId: this.selected.cityId,
              cityName: this.nameToEdit,
              cityCode: this.codeToEdit
            })
      this.$_showMessage(result)
    },

    async $_deleteModal_ConfirmYes() {
      this.showDeleteModal = false
      const result = await this.deleteCity(this.selected.cityId)
      this.$_showMessage(result)
    },

    $_attachTableButtonEvent() {
      $('tbody').on('click', 'td button', (event) => {
        const operation = $(event.currentTarget).data('opt')
        const cityId = $(event.currentTarget).data('id')
        this.selected = this.getCityById(cityId)

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
