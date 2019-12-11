<template>
  <mdb-modal
    :show="showModal"
    @show="$_modal_beforeShow"
    info
    size="fluid"
    scrollable
  >
    <mdb-modal-header :close="false" center>
      <p class="heading">
        {{ newOrEdit === 'new' ? '新增角色' : '编辑角色' }}
      </p>
    </mdb-modal-header>
    <mdb-modal-body>
      <mdb-input
        :value="roleName"
        @input="$emit('update:roleName', $event)"
        label="角色名"
        icon="user"
      />
      <mdb-card-group
        v-for="(row, index1) in menuRows"
        :key="index1"
        class="mb-2"
        deck
      >
        <authority-card
          v-for="navbarItem in row"
          :key="navbarItem.id"
          v-bind="navbarItem"
        />
      </mdb-card-group>
    </mdb-modal-body>
    <mdb-modal-footer center>
      <mdb-btn @click="$_roleEdit_confirmYes" outline="info" rounded>
        <mdb-icon icon="check" class="mr-1" />确认
      </mdb-btn>
      <mdb-btn @click="$_roleEdit_confirmNo" color="info" rounded>
        <mdb-icon icon="times" class="mr-1" />取消
      </mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
import {
  mdbBtn,
  mdbInput,
  mdbModal,
  mdbModalBody,
  mdbModalFooter,
  mdbModalHeader,
  mdbIcon,
  mdbCardGroup
} from 'mdbvue'
import { mapState, mapActions } from 'vuex'
import AuthorityCard from '~/components/user/authority-card'
import { axiosGet } from '~/api/axios'

export default {
  name: 'RoleEdit',

  components: {
    AuthorityCard,
    mdbBtn,
    mdbInput,
    mdbModal,
    mdbModalBody,
    mdbModalFooter,
    mdbModalHeader,
    mdbIcon,
    mdbCardGroup
  },

  props: {
    showModal: {
      type: Boolean,
      default: false
    },

    newOrEdit: {
      type: String,
      default: 'new'
    },

    roleName: {
      type: String,
      default: ''
    },

    roleId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      menuRows: [],
      originMenus: ''
    }
  },

  computed: {
    ...mapState('base-data', ['menuItems'])
  },

  methods: {
    ...mapActions('base-data', ['getAllMenuItems']),

    async $_roleEdit_confirmYes() {
      let checkedItems = ''
      this.menuRows.forEach((row) => {
        row.forEach((item) => {
          let checkedSubItems = ''
          item.subItems.forEach((subItem) => {
            if (subItem.checked) {
              checkedSubItems += subItem.id + ','
            }
          })
          if (checkedSubItems !== '') {
            checkedItems += item.id + ',' + checkedSubItems
          }
        })
      })
      if (checkedItems !== this.originMenus) {
        const result = await axiosGet('/role/add_role_menu_check', {
          roleId: this.roleId,
          ids: checkedItems
        })
        console.log(result)
      }
      this.$emit('confirmYes')
    },

    $_roleEdit_confirmNo() {
      this.$emit('confirmNo')
    },

    async $_modal_beforeShow() {
      // 获取所有菜单项
      await this.getAllMenuItems()
      const sideNavbarItems = this.menuItems.map((menuItem) => ({
        id: menuItem.menu_id,
        name: menuItem.name,
        icon: menuItem.icon,
        subItems: menuItem.children.map((child) => ({
          id: child.menu_id,
          name: child.title,
          to: child.to,
          checked: false
        }))
      }))

      // 获取当前用户菜单项
      this.originMenus = ''
      if (this.newOrEdit === 'edit') {
        const results = await axiosGet('/menu/get_menu_by_role', {
          roleId: this.roleId
        })
        sideNavbarItems.forEach((item) => {
          const parentId = item.id
          const parent = results.find((result) => result.menu_id === parentId)
          if (parent) {
            const { children } = parent
            item.subItems.forEach((item) => {
              const found = children.findIndex(
                (child) => child.menu_id === item.id
              )
              if (found > -1) {
                item.checked = true
                this.originMenus += item.id + ','
              }
            })
          }
        })
      }

      this.menuRows = []
      const colNumber = 3
      const rowNumber = Math.ceil(sideNavbarItems.length / colNumber)
      for (let i = 0; i < rowNumber; i++) {
        const row = []
        for (let j = 0; j < colNumber; j++) {
          row.push(sideNavbarItems[j + i * colNumber])
        }
        this.menuRows.push(row)
      }
    }
  }
}
</script>

<style scoped />
