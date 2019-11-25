<template>
  <mdb-view>
    <mdb-mask
      overlay="indigo-strong"
      class="d-flex justify-content-center align-items-center"
    >
      <mdb-container>
        <mdb-row>
          <div
            class="white-text text-center text-md-left col-md-6 mt-xl-5 mb-5 animated fadeInLeft"
          >
            <h1 class="h1-responsive font-weight-bold">
              {{ title }}
            </h1>
            <hr class="hr-light animated fadeInLeft" />
            <h1 class="h1-responsive font-weight-bold">
              {{ subTitle }}
            </h1>
          </div>
          <mdb-col md="6" xl="5" class="mb-4 animated fadeInRight">
            <Login @login-result="$_home_login_result" />
          </mdb-col>
        </mdb-row>
      </mdb-container>
    </mdb-mask>
  </mdb-view>
</template>

<script>
import {
  mdbContainer,
  mdbRow,
  mdbCol,
  // mdbNavbar,
  // mdbNavbarToggler,
  mdbView,
  mdbMask
  // mdbNavbarBrand
} from 'mdbvue'
import Login from '~/components/user/login'
export default {
  name: 'Home',

  components: {
    Login,
    mdbContainer,
    mdbRow,
    mdbCol,
    // mdbNavbar,
    // mdbNavbarToggler,
    mdbView,
    mdbMask
    // mdbNavbarBrand
  },

  props: {
    title: {
      type: String,
      required: true
    },
    subTitle: {
      type: String,
      default: ''
    }
  },

  methods: {
    $_home_login_result(event) {
      if (event === 'success') {
        this.$notify.success({
          message: '登录成功',
          position: 'top right',
          timeOut: 5000
        })
        this.$router.push({ name: 'features' })
      } else {
        this.$notify.error({
          message: '登录失败',
          position: 'top right',
          timeOut: 5000
        })
      }
    }
  }
}
</script>

<style scoped>
.view {
  background-image: url('~assets/images/89.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  height: 100vh;
}

.gradient {
  background: -moz-linear-gradient(
    45deg,
    rgba(42, 27, 161, 0.7),
    rgba(29, 210, 177, 0.7) 100%
  );
  background: -webkit-linear-gradient(
    45deg,
    rgba(42, 27, 161, 0.7),
    rgba(29, 210, 177, 0.7) 100%
  );
  background: -o-linear-gradient(
    45deg,
    rgba(42, 27, 161, 0.7),
    rgba(29, 210, 177, 0.7) 100%
  );
  background: linear-gradient(
    45deg,
    rgba(42, 27, 161, 0.7),
    rgba(29, 210, 177, 0.7) 100%
  );
}

.classic-form-page h6 {
  line-height: 1.7;
}

.classic-form-page .navbar {
  transition: background 0.5s ease-in-out, padding 0.5s ease-in-out;
}

.classic-form-page .navbar .md-form {
  margin: 0;
}

.top-nav-collapse {
  background: #424f95 !important;
}

@media (max-width: 768px) {
  .classic-form-page .navbar:not(.top-nav-collapse) {
    background: #424f95 !important;
  }
}

.classic-form-page label {
  color: #fff !important;
}
</style>
