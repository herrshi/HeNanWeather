<template>
  <mdb-modal
    :show="showModal"
    danger
    size="sm"
    class="text-center"
    @close="showModal = false"
  >
    <mdb-modal-header :close="false" center>
      <p class="heading">删除确认</p>
    </mdb-modal-header>
    <mdb-modal-body>
      <p>
        是否删除 <strong>{{ deleteContent }}</strong> ?
      </p>
    </mdb-modal-body>
    <mdb-modal-footer center>
      <mdb-btn outline="danger" rounded @click="$_confirmDelete_confirmYes">
        <mdb-icon icon="check" class="mr-1" />是
      </mdb-btn>
      <mdb-btn color="danger" rounded @click="$_confirmDelete_confirmNo">
        <mdb-icon icon="times" class="mr-1" />否
      </mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
import {
  mdbBtn,
  mdbIcon,
  mdbModal,
  mdbModalBody,
  mdbModalFooter,
  mdbModalHeader
} from 'mdbvue'
export default {
  name: 'ConfirmDeleteModal',

  components: {
    mdbBtn,
    mdbIcon,
    mdbModal,
    mdbModalBody,
    mdbModalFooter,
    mdbModalHeader
  },

  props: {
    showModal: {
      type: Boolean,
      default: false
    },

    deleteContent: {
      type: String,
      default: ''
    }
  },

  methods: {
    $_confirmDelete_confirmYes() {
      this.$emit('confirmYes')
    },

    $_confirmDelete_confirmNo() {
      this.$emit('confirmNo')
    }
  }
}
</script>

<style scoped />
