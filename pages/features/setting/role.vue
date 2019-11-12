<template>
  <mdb-card
    color="rgba-white-strong"
    style="color: black !important;"
    class="h-100 v-100"
  >
    <mdb-card-body>
      <div class="d-flex justify-content-start">
        <mdb-btn color="cyan" rounded @click="$_settingRole_showNewRoleModal">
          <mdb-icon icon="plus" class="mr-1" />新增角色
        </mdb-btn>
      </div>
      <mdb-datatable
        v-if="refreshTable"
        max-height="50vh"
        :data="roleTableData"
        :tfoot="false"
        :sorting="false"
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
      :show-modal="showConfirmDelete"
      :delete-content="deleteContent"
      @confirmYes="$_settingRole_deleteRoleConfirmYes"
      @confirmNo="showConfirmDelete = false"
    />
    <!-- /.删除确认 -->

    <!-- 新增/编辑 --->
    <RoleEdit
      :show-modal="showEditRole"
      :new-or-edit="newOrEditRole"
      :role-name.sync="roleNameToEdit"
      @confirmYes="$_settingRole_editRoleConfirmYes"
      @confirmNo="showEditRole = false"
    />
    <!-- ./新增/编辑 --->
  </mdb-card>
</template>

<script>
import { mdbBtn, mdbCard, mdbCardBody, mdbDatatable, mdbIcon } from 'mdbvue'
import $ from 'jquery'
import { mapActions, mapMutations, mapGetters, mapState } from 'vuex'

import ConfirmDelete from '~/components/confirm-delete'
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
      showConfirmDelete: false,
      deleteContent: '',
      showEditRole: false,
      newOrEditRole: '',
      roleNameToEdit: '',
      selectedRole: {},
      refreshTable: true
    }
  },

  computed: {
    ...mapGetters('user', ['getRoleById', 'getRoleByName']),
    ...mapState('app-info', ['title', 'subTitle']),
    ...mapState('user', ['allRoles']),

    // 将角色列表this.allRoles转为{ columns, rows }
    roleTableData() {
      const columns = [
        {
          label: '用户名',
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
              <button class="btn btn-indigo btn-sm btn-rounded" data-opt="edit" data-role-id="${roleId}">
                <i class="fas fa-edit mr-1"></i>编辑
              </button>
              <button class="btn btn-pink btn-sm btn-rounded" data-opt="delete" data-role-id="${roleId}">
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

  async asyncData({ store }) {
    await store.dispatch('user/getAllRoles')
  },

  mounted() {
    this.setNaviBreadcrumb({
      naviBreadcrumb: [this.subTitle, '系统设置', this.pageName]
    })

    // 使用jQuery来响应DataTable内的button click
    this.$_settingRole_attachTableButtonEvent()
  },

  methods: {
    ...mapMutations(['setNaviBreadcrumb']),
    ...mapActions('user', ['addRole', 'deleteRole', 'editRole']),

    async $_settingRole_showMessage(result, refreshTable = true) {
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
          this.$_settingRole_attachTableButtonEvent()
        }
      } else {
        this.$notify.error({
          message: result.msg,
          position: 'top right'
        })
      }
    },

    async $_settingRole_deleteRoleConfirmYes() {
      this.showConfirmDelete = false
      const { roleId } = this.selectedRole
      const result = await this.deleteRole(roleId)
      this.$_settingRole_showMessage(result)
    },

    async $_settingRole_editRoleConfirmYes() {
      this.showEditRole = false
      const { roleId } = this.selectedRole
      const result =
        this.newOrEditRole === 'new'
          ? await this.addRole(this.roleNameToEdit)
          : await this.editRole({ roleId, roleName: this.roleNameToEdit })
      this.$_settingRole_showMessage(result)
    },

    $_settingRole_showNewRoleModal() {
      this.newOrEditRole = 'new'
      this.roleNameToEdit = ''
      this.showEditRole = true
    },

    $_settingRole_showEditRoleModal() {
      const { roleName } = this.selectedRole
      this.newOrEditRole = 'edit'
      this.roleNameToEdit = roleName
      this.showEditRole = true
    },

    $_settingRole_showDeleteRoleConfirmModal() {
      const { roleName } = this.selectedRole
      this.deleteContent = roleName
      this.showConfirmDelete = true
    },

    $_settingRole_attachTableButtonEvent() {
      $('tbody').on('click', 'td button', (event) => {
        const operation = $(event.currentTarget).data('opt')
        const roleId = $(event.currentTarget).data('roleId')
        this.selectedRole = this.getRoleById(roleId)

        if (operation === 'delete') {
          this.$_settingRole_showDeleteRoleConfirmModal()
        } else if (operation === 'edit') {
          this.$_settingRole_showEditRoleModal()
        }
      })
    }
  }
}
</script>

<style scoped></style>
