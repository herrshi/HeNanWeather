<template>
  <mdb-modal :show="showModal" info>
    <mdb-modal-header :close="false" center>
      <p class="heading">
        {{ header }}
      </p>
    </mdb-modal-header>

    <mdb-modal-body>
      <mdb-row>
        <mdb-col class="mr-1">
          <mdb-input
            label="司机姓名"
            :value="driverName"
            @input="$emit('update:driverName', $event)"
          />
        </mdb-col>
        <mdb-col class="mr-1">
          <mdb-input
            label="车牌号码"
            :value="plateNum"
            @input="$emit('update:plateNum', $event)"
          />
        </mdb-col>
        <mdb-col>
          <mdb-input
            label="GPS号"
            :value="gpsPhone"
            @input="$emit('update:gpsPhone', $event)"
          />
        </mdb-col>
      </mdb-row>

      <mdb-row>
        <mdb-col>
          <mdb-input
            label="公司名称"
            :value="company"
            @input="$emit('update:company', $event)"
          />
        </mdb-col>
      </mdb-row>

      <mdb-row>
        <mdb-col class="mr-1">
          <mdb-input
            label="管理人员"
            :value="chargePerson"
            @input="$emit('update:chargePerson', $event)"
          />
        </mdb-col>
        <mdb-col>
          <mdb-input
            label="联系电话"
            :value="phone"
            @input="$emit('update:phone', $event)"
          />
        </mdb-col>
      </mdb-row>
    </mdb-modal-body>

    <mdb-modal-footer center>
      <mdb-btn outline="info" rounded @click="$_confirmYes">
        <mdb-icon icon="check" class="mr-1" />确认
      </mdb-btn>
      <mdb-btn color="info" rounded @click="$_confirmNo">
        <mdb-icon icon="times" class="mr-1" />取消
      </mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</template>

<script>
import {
  mdbModal,
  mdbModalHeader,
  mdbModalBody,
  mdbModalFooter,
  mdbBtn,
  mdbIcon,
  mdbInput,
  mdbRow,
  mdbCol
} from 'mdbvue'
export default {
  components: {
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    mdbModalFooter,
    mdbBtn,
    mdbIcon,
    mdbInput,
    mdbRow,
    mdbCol
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
    driverName: {
      type: String,
      default: ''
    },
    plateNum: {
      type: String,
      default: ''
    },
    company: {
      type: String,
      default: ''
    },
    chargePerson: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    gpsPhone: {
      type: String,
      default: ''
    }
  },

  computed: {
    header() {
      return (this.newOrEdit === 'new' ? '新增' : '编辑') + '废固运送车辆'
    }
  },

  methods: {
    $_confirmYes() {
      this.$emit('confirmYes')
    },

    $_confirmNo() {
      this.$emit('confirmNo')
    }
  }
}
</script>

<style scoped></style>
