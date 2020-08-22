<template>
  <el-dialog
    class="login-action-page"
    :title="dialogTitle"
    :visible.sync="dialogShow"
    width="460px"
    top="0"
    :before-close="hideDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
  >
    <div class="dialog-body">
      <action-login :login-sucess="handleLoginSuccess" />
    </div>
  </el-dialog>
</template>
<script>
import ActionLogin from './ActionLogin'
import { getStore } from 'utils'
import { resetRouter } from '@/router'
export default {
  components: {
    ActionLogin
  },
  data() {
    return {
      dialogShow: true,
      dialogTitle: '登录'
    }
  },
  methods: {
    handleLoginSuccess() {
      this.hideDialog()
      this.$nextTick(() => {
        this.$store.dispatch('tagsView/refreshCurrentTag', this)
      })
    },
    hideDialog(hide) {
      if (hide) {
        this.$store.dispatch('user/navigateToLoginPage')
      } else {
        this.$store.dispatch('user/setLoginDialogStatus', false)
      }
    }
  }
}
</script>
<style lang="scss">
  .login-action-page {
    .login-form {
      padding-bottom: 20px;
      .el-form-item {
        .suffix-icon {
          right: 10px;
        }
      }
    }
  }

</style>
