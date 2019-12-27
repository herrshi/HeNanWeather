<template>
  <mdb-card color="white" style="color: black !important;" class="h-100 w-100">
    <mdb-card-body>
      <div class="d-flex justify-content-start">
        <mdb-btn color="cyan" size="sm" rounded @click="$_showNewModal">
          <mdb-icon icon="plus" class="mr-1" />新增角色
        </mdb-btn>
      </div>
      <mdb-datatable
        v-if="refreshTable"
        :data="roleTableData"
        :tfoot="false"
        max-height="50vh"
        arrows
        scroll-y
        fixed
        showing-text="显示"
        entries-title="每页显示"
        no-found-message="无符合记录"
        search-placeholder="搜索"
        striped
        bordered
        hover
      />
    </mdb-card-body>

    <!-- 删除确认 -->
    <ConfirmDelete
      :show-modal="showDeleteModal"
      :delete-content="deleteModalContent"
      @confirmYes="$_deleteConfirmYes"
      @confirmNo="showDeleteModal = false"
    />
    <!-- /.删除确认 -->

    <!-- 新增/编辑 --->
    <RoleEdit
      :show-modal="showEditModal"
      :new-or-edit="newOrEdit"
      :role-name.sync="nameToEdit"
      :role-id="idToEdit"
      @confirmYes="$_editConfirmYes"
      @confirmNo="showEditModal = false"
    />
    <!-- ./新增/编辑 --->
  </mdb-card>
</template>

<script>
import { mdbBtn, mdbCard, mdbCardBody, mdbDatatable, mdbIcon } from 'mdbvue'
import $ from 'jquery'
import { mapActions, mapMutations, mapGetters, mapState } from 'vuex'

import ConfirmDelete from '~/components/modals/confirm-delete-modal'
import RoleEdit from '~/components/user/role-edit'

export default {
  name: 'SettingRole',

  components: {
    RoleEdit,
    ConfirmDelete,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbDatatable,
    mdbIcon
  },

  data() {
    return {
      pageName: '角色设置',
      showDeleteModal: false,
      deleteModalContent: '',
      showEditModal: false,
      newOrEdit: '',
      nameToEdit: '',
      idToEdit: '',
      selected: {},
      refreshTable: true
    }
  },

  computed: {
    ...mapGetters('user', ['getRoleById']),
    ...mapState('app-info', ['title', 'subTitle']),
    ...mapState('user', ['allRoles']),

    // 将角色列表this.allRoles转为{ columns, rows }
    roleTableData() {
      const columns = [
        {
          label: '角色名称',
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
      this.allRoles.forEach((role) => {
        const { createTime, isDelete, roleId, roleName } = role
        if (isDelete === 1) {
          const operation = `
            <div class="d-flex">
              <button class="btn btn-indigo btn-sm btn-rounded" data-opt="edit" data-id="${roleId}">
                <i class="fas fa-edit mr-1"></i>编辑
              </button>
              <button class="btn btn-pink btn-sm btn-rounded" data-opt="delete" data-id="${roleId}">
                <i class="far fa-trash-alt mr-1"></i>删除
              </button>
            </div>
          `
          rows.push({
            id: roleId,
            name: roleName,
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
    ...mapActions('user', ['addRole', 'deleteRole', 'editRole']),

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

    async $_deleteConfirmYes() {
      this.showDeleteModal = false
      const { roleId } = this.selected
      const result = await this.deleteRole(roleId)
      this.$_showMessage(result)
    },

    async $_editConfirmYes() {
      this.showEditModal = false
      const { roleId } = this.selected
      const result =
        this.newOrEdit === 'new'
          ? await this.addRole(this.nameToEdit)
          : await this.editRole({ roleId, roleName: this.nameToEdit })
      this.$_showMessage(result)
    },

    $_showNewModal() {
      this.newOrEdit = 'new'
      this.nameToEdit = ''
      this.showEditModal = true
    },

    $_showEditModal() {
      const { roleName, roleId } = this.selected
      this.newOrEdit = 'edit'
      this.nameToEdit = roleName
      this.idToEdit = roleId
      this.showEditModal = true
    },

    $_showDeleteConfirmModal() {
      const { roleName } = this.selected
      this.deleteModalContent = roleName
      this.showDeleteModal = true
    },

    $_attachTableButtonEvent() {
      $('tbody').on('click', 'td button', (event) => {
        const operation = $(event.currentTarget).data('opt')
        const roleId = $(event.currentTarget).data('id')
        this.selected = this.getRoleById(roleId)

        if (operation === 'delete') {
          this.$_showDeleteConfirmModal()
        } else if (operation === 'edit') {
          this.$_showEditModal()
        }
      })
    }
  }
}
</script>

<style scoped />
