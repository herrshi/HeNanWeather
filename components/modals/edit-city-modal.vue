<template>
  <mdb-modal :show="showModal" info>
    <mdb-modal-header :close="false" center>
      <p class="heading">
        {{ header }}
      </p>
    </mdb-modal-header>
    <mdb-row class="m-2">
      <mdb-col col="6">
        <mdb-input
          :value="cityName"
          @input="$emit('update:cityName', $event)"
          label="城市名称"
          icon="city"
        />
      </mdb-col>
      <mdb-col col="6">
        <mdb-input
          :value="cityCode"
          @input="$emit('update:cityCode', $event)"
          label="城市代码"
          icon="edit"
        />
      </mdb-col>
    </mdb-row>
    <mdb-modal-body> </mdb-modal-body>
    <mdb-modal-footer center>
      <mdb-btn @click="$_editCityModal_confirmYes" outline="info" rounded>
        <mdb-icon icon="check" class="mr-1" />确认
      </mdb-btn>
      <mdb-btn @click="$_editCityModal_confirmNo" color="info" rounded>
        <mdb-icon icon="times" class="mr-1" />取消
      </mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
import {
  mdbBtn,
  mdbCol,
  mdbIcon,
  mdbInput,
  mdbModal,
  mdbModalBody,
  mdbModalHeader,
  mdbModalFooter,
  mdbRow
} from 'mdbvue'
export default {
  name: 'EditCityModal',

  components: {
    mdbBtn,
    mdbCol,
    mdbIcon,
    mdbInput,
    mdbModal,
    mdbModalBody,
    mdbModalHeader,
    mdbModalFooter,
    mdbRow
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

    cityName: {
      type: String,
      default: ''
    },

    cityCode: {
      type: String,
      default: ''
    }
  },

  computed: {
    header() {
      return (this.newOrEdit === 'new' ? '新增' : '编辑') + '城市'
    }
  },

  methods: {
    $_editCityModal_confirmYes() {
      this.$emit('confirmYes')
    },

    $_editCityModal_confirmNo() {
      this.$emit('confirmNo')
    }
  }
}
</script>

<style scoped></style>
