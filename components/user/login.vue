<template>
  <mdb-card id="classid-card">
    <mdb-card-body class="z-depth-2 white-text">
      <h3 class="text-center"><mdb-icon icon="user" /> 登录</h3>
      <hr class="hr-light" />
      <mdb-input label="用户名" icon="user" labelColor="white" />
      <mdb-input label="密码" icon="lock" labelColor="white" type="password" />
      <p class="font-small grey-text d-flex justify-content-end">
        忘记
        <a href="#" class="white-text ml-1 font-wight-bold">密码?</a>
      </p>
      <mdb-row class="d-flex align-items-center mb-4 mt-5">
        <mdb-col md="5" class="d-flex align-items-start">
          <div class="text-center">
            <mdb-btn color="cyan" type="button" class="z-depth-1a" rounded>
              登 录
            </mdb-btn>
          </div>
        </mdb-col>
        <mdb-col md="7" class="d-flex align-items-end">
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
  }
}
</script>

<style scoped></style>
