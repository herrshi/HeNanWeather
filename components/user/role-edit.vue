<template>
  <mdb-modal :show="showModal" info>
    <mdb-modal-header center :close="false">
      <p class="heading">
        {{ newOrEdit === 'new' ? '新增角色' : '编辑角色' }}
      </p>
    </mdb-modal-header>
    <mdb-modal-body>
      <mdb-input
        :value="roleName"
        label="角色名"
        icon="user"
        @input="$emit('update:roleName', $event)"
      />
    </mdb-modal-body>
    <mdb-modal-footer center>
      <mdb-btn outline="info" rounded @click="$_roleEdit_confirmYes">
        <mdb-icon icon="check" class="mr-1" />确认
      </mdb-btn>
      <mdb-btn color="info" rounded @click="$_roleEdit_confirmNo">
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
  mdbIcon
} from 'mdbvue'
export default {
  name: 'RoleEdit',

  components: {
    mdbBtn,
    mdbInput,
    mdbModal,
    mdbModalBody,
    mdbModalFooter,
    mdbModalHeader,
    mdbIcon
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
    }
  },

  methods: {
    $_roleEdit_confirmYes() {
      this.$emit('confirmYes')
    },

    $_roleEdit_confirmNo() {
      this.$emit('confirmNo')
    }
  }
}
</script>

<style scoped></style>
