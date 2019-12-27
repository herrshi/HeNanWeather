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

    <!-- 删除确认 -->
    <ConfirmDelete
      :show-modal="showDeleteModal"
      :delete-content="deleteModalContent"
      @confirmYes="$_deleteModal_ConfirmYes"
      @confirmNo="showDeleteModal = false"
    />
    <!-- /.删除确认 -->

    <!-- 新增/编辑 --->
    <edit-basedata-modal
      :show-modal="showEditModal"
      :data-type="pageName"
      :input-value.sync="nameToEdit"
      :new-or-edit="newOrEdit"
      @confirmYes="$_editModal_confirmYes"
      @confirmNo="showEditModal = false"
    />
    <!-- /.新增/编辑 --->
  </mdb-card>
</template>

<script>
import { mdbBtn, mdbCard, mdbCardBody, mdbDatatable, mdbIcon } from 'mdbvue'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import $ from 'jquery'
import ConfirmDelete from '~/components/modals/confirm-delete-modal'
import EditBasedataModal from '~/components/modals/edit-basedata-modal'

export default {
  name: 'PollutantSourceType',

  components: {
    EditBasedataModal,
    ConfirmDelete,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbDatatable,
    mdbIcon
  },

  data() {
    return {
      pageName: '污染源类型',
      showDeleteModal: false,
      deleteModalContent: '',
      showEditModal: false,
      newOrEdit: '',
      nameToEdit: '',
      selected: {},
      refreshTable: true
    }
  },

  computed: {
    ...mapGetters('base-data', ['getPollutantSourceTypeByCode']),
    ...mapState('app-info', ['title', 'subTitle']),
    ...mapState('base-data', ['pollutantSourceTypes']),

    tableData() {
      const columns = [
        {
          label: '类型名称',
          field: 'name'
        },
        {
          label: '创建时间',
          field: 'createTime'
        },
        {
          label: '操作',
          field: 'operation'
        }
      ]
      const rows = []
      this.pollutantSourceTypes.forEach((type) => {
        const { createTime, isDelete, typeCode, typeName } = type
        if (isDelete === 1) {
          const operation = `
            <div class="d-flex">
              <button class="btn btn-indigo btn-sm btn-rounded" data-opt="edit" data-id="${typeCode}">
                <i class="fas fa-edit mr-1"></i>编辑
              </button>
              <button class="btn btn-pink btn-sm btn-rounded" data-opt="delete" data-id="${typeCode}">
                <i class="far fa-trash-alt mr-1"></i>删除
              </button>
            </div>
          `
          rows.push({
            id: typeCode,
            name: typeName,
            createTime,
            operation
          })
        }
      })
      return { columns, rows }
    }
  },

  mounted() {
    this.setNaviBreadcrumb({
      naviBreadcrumb: [this.subTitle, '系统设置', this.pageName]
    })

    // 使用jQuery来响应DataTable内的button click
    this.$_attachTableButtonEvent()
  },

  methods: {
    ...mapMutations(['setNaviBreadcrumb']),
    ...mapActions('base-data', [
      'addPollutantSourceType',
      'editPollutantSourceType',
      'deletePollutantSourceType'
    ]),

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
      this.nameToEdit = this.selected.typeName
      this.showEditModal = true
    },

    $_showDeleteModal() {
      this.deleteModalContent = this.selected.typeName
      this.showDeleteModal = true
    },

    async $_editModal_confirmYes() {
      this.showEditModal = false
      const result =
        this.newOrEdit === 'new'
          ? await this.addPollutantSourceType(this.nameToEdit)
          : await this.editPollutantSourceType({
              typeCode: this.selected.typeCode,
              typeName: this.nameToEdit
            })
      this.$_showMessage(result)
    },

    async $_deleteModal_ConfirmYes() {
      this.showDeleteModal = false
      const result = await this.deletePollutantSourceType(
        this.selected.typeCode
      )
      this.$_showMessage(result)
    },

    $_attachTableButtonEvent() {
      $('tbody').on('click', 'td button', (event) => {
        const operation = $(event.currentTarget).data('opt')
        const typeCode = $(event.currentTarget).data('id')
        this.selected = this.getPollutantSourceTypeByCode(typeCode)

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

<style scoped />
