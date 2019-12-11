<template>
  <mdb-modal :show="showModal" info>
    <mdb-modal-header center :close="false">
      <p class="heading">
        {{ header }}
      </p>
    </mdb-modal-header>
    <mdb-modal-body>
      <mdb-input
        :label="dataType"
        icon="edit"
        :value="inputValue"
        @input="$emit('update:inputValue', $event)"
      />
    </mdb-modal-body>
    <mdb-modal-footer center>
      <mdb-btn outline="info" rounded @click="$_editBasedataModal_confirmYes">
        <mdb-icon icon="check" class="mr-1" />确认
      </mdb-btn>
      <mdb-btn color="info" rounded @click="$_editBaseDataModal_confirmNo">
        <mdb-icon icon="times" class="mr-1" />取消
      </mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
import {
  mdbBtn,
  mdbIcon,
  mdbInput,
  mdbModal,
  mdbModalBody,
  mdbModalFooter,
  mdbModalHeader
} from 'mdbvue'
export default {
  name: 'EditBasedataModal',

  components: {
    mdbBtn,
    mdbIcon,
    mdbInput,
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

    newOrEdit: {
      type: String,
      default: 'new'
    },

    dataType: {
      type: String,
      default: ''
    },

    inputValue: {
      type: String,
      default: ''
    }
  },

  computed: {
    header() {
      return (this.newOrEdit === 'new' ? '新增' : '编辑') + this.dataType
    }
  },

  methods: {
    $_editBasedataModal_confirmYes() {
      this.$emit('confirmYes')
    },

    $_editBaseDataModal_confirmNo() {
      this.$emit('confirmNo')
    }
  }
}
</script>

<style scoped></style>
