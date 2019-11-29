<template>
  <mdb-card
    color="rgba-white-strong"
    style="color: black !important;"
    class="h-100 v-100"
  >
    <mdb-card-body>
      <div class="d-flex justify-content-start">
        <mdb-btn color="cyan" @click="$_showNewModal" size="sm" rounded>
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
import EditBasedataModal from '~/components/edit-basedata-modal'
import ConfirmDelete from '~/components/confirm-delete-modal'

export default {
  name: 'ControlLevel',

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
      pageName: '管控级别',
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
    ...mapState('app-info', ['title', 'subTitle']),
    ...mapState('base-data', ['controlLevels']),
    ...mapGetters('base-data', ['getControlLevelByCode']),

    tableData() {
      const columns = [
        {
          label: '级别名称',
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
      this.controlLevels.forEach((level) => {
        const { createTime, isDelete, levelCode, levelName } = level
        if (isDelete === 1) {
          const operation = `
            <div class="d-flex">
              <button class="btn btn-indigo btn-sm btn-rounded" data-opt="edit" data-id="${levelCode}">
                <i class="fas fa-edit mr-1"></i>编辑
              </button>
              <button class="btn btn-pink btn-sm btn-rounded" data-opt="delete" data-id="${levelCode}">
                <i class="far fa-trash-alt mr-1"></i>删除
              </button>
            </div>
          `
          rows.push({
            id: levelCode,
            name: levelName,
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
    this.$_attachTableButtonEvent()
  },

  methods: {
    ...mapMutations(['setNaviBreadcrumb']),
    ...mapActions('base-data', [
      'addControlLevel',
      'editControlLevel',
      'deleteControlLevel'
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
      this.nameToEdit = this.selected.levelName
      this.showEditModal = true
    },

    $_showDeleteModal() {
      this.deleteModalContent = this.selected.levelName
      this.showDeleteModal = true
    },

    async $_editModal_confirmYes() {
      this.showEditModal = false
      const result =
        this.newOrEdit === 'new'
          ? await this.addControlLevel(this.nameToEdit)
          : await this.editControlLevel({
              levelName: this.nameToEdit,
              levelCode: this.selected.levelCode
            })
      this.$_showMessage(result)
    },

    async $_deleteModal_ConfirmYes() {
      this.showDeleteModal = false
      const result = await this.deleteControlLevel(this.selected.levelCode)
      this.$_showMessage(result)
    },

    $_attachTableButtonEvent() {
      $('tbody').on('click', 'td button', (event) => {
        const operation = $(event.currentTarget).data('opt')
        const levelCode = $(event.currentTarget).data('id')
        this.selected = this.getControlLevelByCode(levelCode)

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
