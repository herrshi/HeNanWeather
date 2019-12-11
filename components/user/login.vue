<template>
  <mdb-card>
    <mdb-card-body class="z-depth-2 white-text">
      <h3 class="text-center">
        <mdb-icon icon="sign-in-alt" class="mr-2" />登录
      </h3>
      <hr class="hr-light" />
      <mdb-input
        v-model="userId"
        label="用户名"
        icon="user"
        label-color="white"
      />
      <mdb-input
        v-model="password"
        label="密码"
        icon="lock"
        label-color="white"
        type="password"
      />
      <p class="font-small grey-text d-flex justify-content-end">
        <a href="#" class="white-text font-wight-bold">忘记密码?</a>
      </p>
      <mdb-row class="d-flex align-items-center mb-4 mt-5">
        <mdb-col md="5" class="d-flex align-items-start">
          <div class="text-center">
            <mdb-btn
              @click="$_login_userLogin"
              color="cyan"
              type="button"
              class="z-depth-1a"
              rounded
            >
              <mdb-icon icon="sign-in-alt" class="mr-1" />登录
            </mdb-btn>
          </div>
        </mdb-col>
        <mdb-col md="7" class="d-flex justify-content-end">
          <p class="font-small grey-text mt-3">
            没有账户?
            <a href="#" class="white-text ml-1 font-weight-bold">注册</a>
          </p>
        </mdb-col>
      </mdb-row>
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import {
  mdbBtn,
  mdbCard,
  mdbCardBody,
  mdbIcon,
  mdbInput,
  mdbCol,
  mdbRow
} from 'mdbvue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Login',
  components: {
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbIcon,
    mdbInput,
    mdbCol,
    mdbRow
  },

  data() {
    return {
      userId: 'admin',
      password: 'test'
    }
  },

  computed: {
    ...mapState('user', ['loginStatus'])
  },

  methods: {
    ...mapActions('user', ['login']),

    async $_login_userLogin() {
      await this.login({
        userId: this.userId,
        password: this.password
      })
      this.$emit('login-result', this.loginStatus)
    }
  }
}
</script>

<style scoped>
.card {
  background-color: rgba(126, 123, 215, 0.2);
}
</style>
