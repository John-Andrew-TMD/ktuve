<template>
  <el-form ref="formDom" :model="formItems" class="login-form" size="medium" @submit.native.prevent>
    <slot />
    <el-form-item>
      <i class="iconfont icon-username prefix-icon" />
      <el-input
        ref="username"
        v-model.trim="formItems.name"
        type="text"
        auto-complete="off"
        placeholder="请输入用户名或用户代码"
        tabindex="1"
      />
    </el-form-item>
    <el-tooltip v-model="capsTooltip" content="大写锁定已打开" placement="right" manual>
      <el-form-item>
        <i class="iconfont icon-pwd prefix-icon" />
        <el-input
          ref="password"
          v-model.trim="formItems.password"
          class="pwd-style"
          :type="passwordType"
          auto-complete="off"
          placeholder="请输入密码"
          tabindex="2"
          @keyup.native="checkCapslock"
          @blur="capsTooltip = false"
          @keyup.enter.native="handleLogin"
        />
        <i
          class="iconfont suffix-icon"
          :class="passwordType ? 'icon-eye-open' : 'icon-eye-close'"
          @click="showPwd"
        />
      </el-form-item>
    </el-tooltip>
    <div class="login-tools">
      <el-checkbox v-model="rememberMe">记住我</el-checkbox>
      <!-- <div class="forget-pwd">
        <span @click="handleForgetPwdClick">忘记密码?</span>
      </div> -->
    </div>
    <el-form-item>
      <el-button
        :loading="showLoading"
        native-type="submit"
        type="primary"
        class="login-btn"
        @click.native="handleLogin"
      >{{ showLoading ? '登录中...' : '登录' }}</el-button>
    </el-form-item>
    <span class="error-tip" :title="errorText">{{ errorText }}</span>
  </el-form>
</template>
<script>
import { setStore, getStore } from 'utils'
import { login } from 'api/common.js'
import md5 from 'js-md5'
export default {
  props: {
    loginSucess: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      formItems: {
        name: '',
        password: ''
      },
      rememberMe: false,
      errorText: '',
      showLoading: false,
      passwordType: 'password',
      capsTooltip: false
    }
  },
  mounted() {
    if (this.formItems.username === '') {
      this.$refs.username.focus()
    } else if (this.formItems.password === '') {
      this.$refs.password.focus()
    }
    if (getStore('rememberMe') === '1') {
      this.formItems.name = getStore('username')
      this.rememberMe = true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      if (!this._formValidate()) return
      this.showLoading = true
      this.errorText = ''
      const params = { ...this.formItems }
      params.password = md5(params.password)
      login(params, {
        captureError: true
      }).then(res => {
        if (res.status !== 0) {
          this.errorText = res.msg
          this.showLoading = false
          return
        }
        // 是否记住用户名
        this._rememberUserName()
        this.$store.commit('user/SET_USER_INFO', res.data)
        this.$store.dispatch('permission/generateRoutes', res.data).then(async res => {
          this.$store.dispatch('common/getAllUserList', true)
          const ret = await this.$store.dispatch('user/getAllDictData', true)
          if (!ret) {
            this.errorText = '字典项获取失败，请登录重试！'
            this.showLoading = false
            return
          }
          this.loginSucess()
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.showLoading = false
      })
    },
    _rememberUserName() {
      this.rememberMe ? setStore('rememberMe', 1) : setStore('rememberMe', 0)
    },
    _formValidate() {
      if (!this.formItems.name || !this.formItems.password) {
        this.errorText = '用户名或密码不允许为空！'
        return false
      }
      return true
    },
    handleForgetPwdClick() {
      this.$msgbox.alert('请联系管理员修改', '提示').catch(() => {})
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && (key >= 'a' && key <= 'z')) ||
          (!shiftKey && (key >= 'A' && key <= 'Z'))
        ) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    }
  }
}
</script>
<style lang="scss">
.login-form {
  position: relative;
  .el-form-item {
    position: relative;

    .el-input__inner {
      height: 40px;
      padding: 0 30px 0 40px;
      font-family: inherit;
      font-size: 16px;
      line-height: 40px;
      background: transparent;

      &::-webkit-input-placeholder {
        font-size: 14px;
        color: #DDDDDD;
      }
    }

    .prefix-icon, .suffix-icon {
      position: absolute;
      z-index: 100;
      top: 0;
      left: 10px;
      height: 40px;
      font-size: 22px;
      line-height: 40px;
      color: #777777;
    }

    .suffix-icon {
      left: auto;
      cursor: pointer;
    }

    .pwd-style {
      font-size: 20px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  .login-tools {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    line-height: 24px;

    .el-checkbox, .forget-pwd {
      cursor: pointer;
      color: #777777;
    }

    .forget-pwd {
      transition-duration: .1s;
      text-align: right;
      color: #999999;
    }
  }

  .login-btn {
    display: block;
    width: 100%;
    margin: 0 auto;
    padding: 12px 20px;
    font-size: 15px;
    letter-spacing: 1px;
  }
  .error-tip {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    height: 24px;
    margin: 0 30px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #E30909;
  }
}

</style>
