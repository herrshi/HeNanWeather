<template>
  <mdb-modal :show="showModal" info>
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
      <mdb-row v-if="false">
        <mdb-card-group>
          <mdb-card>
            <mdb-card-body>
              <mdb-card-title>
                <mdb-input
                  id="checkSystemSetting1"
                  type="checkbox"
                  label="系统设置"
                  class="h6"
                />
              </mdb-card-title>
            </mdb-card-body>
          </mdb-card>

          <mdb-card>
            <mdb-card-body>
              <mdb-card-title>
                <mdb-input
                  id="checkSystemSetting2"
                  type="checkbox"
                  label="系统设置"
                  class="h6"
                />
              </mdb-card-title>
            </mdb-card-body>
          </mdb-card>

          <mdb-card>
            <mdb-card-body>
              <mdb-card-title>
                <mdb-input
                  id="checkSystemSetting3"
                  type="checkbox"
                  label="系统设置"
                  class="h6"
                />
              </mdb-card-title>
            </mdb-card-body>
          </mdb-card>
        </mdb-card-group>
      </mdb-row>
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
  mdbRow,
  mdbCard,
  mdbCardBody,
  mdbCardTitle,
  mdbCardGroup
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
    mdbIcon,
    mdbRow,
    mdbCard,
    mdbCardBody,
    mdbCardTitle,
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
