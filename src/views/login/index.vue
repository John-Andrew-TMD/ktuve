<template>
  <div class="login-page">
    <transition name="scale-fade">
      <action-login v-show="showLogin" :login-sucess="handleLoginSuccess">
        <h3 class="title"><svg-icon icon-class="logo" />融资租赁管理系统V1.0</h3>
        <span class="corner-common corner-top-left" />
        <span class="corner-common corner-top-right" />
        <span class="corner-common corner-bottom-left" />
        <span class="corner-common corner-bottom-right" />
      </action-login>
    </transition>
    <p class="copy-right">Copyright © {{ new Date().getFullYear() }} 金证前海</p>
  </div>
</template>

<script>
import ActionLogin from 'components/LoginPanel/ActionLogin'
export default {
  name: 'Login',
  components: {
    ActionLogin
  },
  data() {
    return {
      showLogin: false
    }
  },
  created() {
    this.$store.dispatch('user/setLoginDialogStatus', false)
    this.$store.dispatch('tagsView/delAllViews')
  },
  mounted() {
    this.showLogin = true
    this.$store.dispatch('user/setUserLoginStatus', null)
  },
  methods: {
    handleLoginSuccess() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
  .login-page {
    position: relative;
    height: 100%;
    background: url('../../assets/images/login_bg.jpg') #04090F center 100px no-repeat;
    // background-size: cover;

    .title {
      margin: 0px auto 30px auto;
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      text-align: center;
      letter-spacing: 1px;
      color: #FFFFFF;

      .svg-icon {
        margin-right: 6px;
        font-size: 32px;
        vertical-align: bottom;
      }
    }

    .login-form {
      position: absolute;
      z-index: 100;
      // overflow: hidden;
      top: 20%;
      right: 0;
      left: 0;
      width: 450px;
      margin: 0 auto;
      padding: 30px;
      background: rgba(255, 255, 255, .18);

      .corner-common {
        position: absolute;
        width: 30px;
        height: 30px;
        border: 3px solid #619FF9;
      }

      .corner-top-left {
        top: 0;
        left: 0;
        border-right: none;
        border-bottom: none;
      }

      .corner-top-right {
        top: 0;
        right: 0;
        border-bottom: none;
        border-left: none;
      }

      .corner-bottom-left {
        bottom: 0;
        left: 0;
        border-top: none;
        border-right: none;
      }

      .corner-bottom-right {
        right: 0;
        bottom: 0;
        border-top: none;
        border-left: none;
      }
    }

    .login-tools {
      .el-checkbox, .forget-pwd {
        color: #FFFFFF;
      }

      .el-checkbox__input {
        transform: translateY(-1px);
      }

      .forget-pwd span {
        cursor: pointer;
        color: #999999;

        &:hover {
          color: #666666;
        }
      }
    }

    .el-form-item {
      .el-input__inner {
        color: rgba(255, 255, 255, .9);
        border: none;
        border-radius: 0;
        background: rgba(255, 255, 255, .1);

        &::-webkit-input-placeholder {
          color: rgba(255, 255, 255, .5);
        }

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px rgba(73, 78, 88, 1) inset;

          -webkit-text-fill-color: #DDDDDD;
        }
      }

      .prefix-icon, .suffix-icon {
        color: rgba(255, 255, 255, .9);
      }

      .suffix-icon {
        right: 10px;
      }
    }

    .copy-right {
      position: absolute;
      bottom: 40px;
      left: 0;
      width: 100%;
      font-size: 12px;
      text-align: center;
      color: rgba(255, 255, 255, .4);
    }

    .error-tip {
      bottom: 10px;
    }
  }

</style>
