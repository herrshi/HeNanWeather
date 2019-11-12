<template>
  <div class="classic-form-page">
    <mdb-navbar
      color="primary"
      position="top"
      dark
      href="#"
      transparent
      scrolling
    >
      <mdb-container>
        <mdbNavbarBrand href="#"><strong>地图开放平台</strong></mdbNavbarBrand>
        <mdb-navbar-toggler style="max-width: 1140px"> </mdb-navbar-toggler>
      </mdb-container>
    </mdb-navbar>

    <view-wrapper>
      <mdb-mask
        overlay="indigo-strong"
        class="d-flex justify-content-center align-items-center"
      >
        <mdb-container>
          <mdb-row>
            <div
              class="white-text text-center text-md-left col-md-6 mt-xl-5 mb-5"
            >
              <h1 class="h1-responsive font-weight-bold animated fadeInLeft">
                Sign up right now!
              </h1>
              <hr class="hr-light animated fadeInLeft" />
              <h6 class="mb-4 animated fadeInLeft">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem
                repellendus quasi fuga nesciunt dolorum nulla magnam veniam
                sapiente, fugiat! Commodi sequi non animi ea dolor molestiae,
                quisquam iste, maiores. Nulla.
              </h6>
              <mdb-btn outline="white animated fadeInLeft" color="white"
                >Learn More</mdb-btn
              >
            </div>
            <mdb-col md="6" xl="5" class="mb-4 animated fadeInRight">
              <mdb-card id="classic-card">
                <mdb-card-body class="z-depth-2 white-text">
                  <h3 class="text-center"><mdb-icon icon="user" /> 登录</h3>
                  <hr class="hr-light" />
                  <mdb-input label="用户名" labelColor="white" icon="user" />
                  <mdb-input
                    label="密码"
                    labelColor="white"
                    icon="lock"
                    type="password"
                  />
                  <p class="font-small grey-text d-flex justify-content-end">
                    忘记
                    <a href="#" class="white-text ml-1 font-weight-bold">
                      密码?</a
                    >
                  </p>
                  <mdb-row class="d-flex align-items-center mb-4 mt-5">
                    <mdb-col md="5" class="d-flex align-items-start">
                      <div class="text-center">
                        <mdb-btn
                          color="cyan"
                          rounded
                          type="button"
                          class="z-depth-1a"
                          >登 录</mdb-btn
                        >
                      </div>
                    </mdb-col>
                    <mdb-col md="7" class="d-flex justify-content-end">
                      <p class="font-small grey-text mt-3">
                        没有账户?
                        <a href="#" class="white-text ml-1 font-weight-bold">
                          注册</a
                        >
                      </p>
                    </mdb-col>
                  </mdb-row>
                </mdb-card-body>
              </mdb-card>
            </mdb-col>
          </mdb-row>
        </mdb-container>
      </mdb-mask>
    </view-wrapper>
  </div>
</template>

<script>
import {
  mdbContainer,
  mdbRow,
  mdbCol,
  mdbNavbar,
  mdbNavItem,
  mdbNavbarNav,
  mdbNavbarToggler,
  ViewWrapper,
  mdbMask,
  mdbBtn,
  mdbCard,
  mdbCardBody,
  mdbInput,
  mdbIcon,
  mdbNavbarBrand
} from "mdbvue";
export default {
  name: "Home",
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbNavbar,
    mdbNavItem,
    mdbNavbarNav,
    mdbNavbarToggler,
    ViewWrapper,
    mdbMask,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbInput,
    mdbIcon,
    mdbNavbarBrand
  }
};
</script>

<style scoped>
.classic-form-page .view {
  background-image: url("http://mdbootstrap.com/img/Photos/Others/images/89.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  height: 100vh;
}

.classic-form-page .gradient {
  background: -webkit-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.7),
    rgba(72, 15, 144, 0.4) 100%
  );
  background: linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.7),
    rgba(72, 15, 144, 0.4) 100%
  );
}

.classic-form-page .card {
  background-color: rgba(126, 123, 215, 0.2);
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
