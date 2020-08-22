<template>
  <div class="navbar">
    <div>
      <logo />

      <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    </div>

    <div class="right-area">
      <template v-if="device!=='mobile'">
        <!-- <search class="right-menu-item" /> -->

        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->

        <screenfull class="right-menu-item hover-effect" />

        <!-- <div class="right-menu-item hover-effect" title="我的收藏">
          <svg-icon icon-class="collection" className="icon-collection" />
        </div>-->

        <!-- <notice class="right-menu-item hover-effect" /> -->
        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <el-dropdown
        size="medium"
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
        style="overflow: visible"
        @command="handleItemClick"
      >
        <div class="avatar-wrapper">
          <i class="iconfont icon-user-avatar" />
          <span class="user-name">{{ userName }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="navbar-dropdown-menu">
          <el-dropdown-item command="modify">
            <i class="iconfont icon-password-modify" />
            <span>密码修改</span>
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <i class="iconfont icon-logout" />
            <span>退出系统</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <password-modify v-if="showPasswordModifyDialog" :dialog-status.sync="showPasswordModifyDialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Sidebar1/Logo'
// import Breadcrumb from 'components/Breadcrumb'
import ErrorLog from 'components/ErrorLog'
import Screenfull from 'components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'
// import Notice from 'components/HeaderNotice'
// import PasswordModify from './PasswordModify'
// import { getStore } from 'utils'

export default {
  components: {
    // Breadcrumb,
    ErrorLog,
    Screenfull,
    SizeSelect,
    // Search,
    // Notice,
    Logo,
    PasswordModify: () => import('./PasswordModify')
  },
  data() {
    return {
      // currentMenuType: 3333,
      showPasswordModifyDialog: false
    }
  },
  computed: {
    ...mapGetters(['userName', 'device'])
  },
  methods: {
    handleItemClick(command) {
      switch(command) {
        case 'modify':
          this.handlePasswordModify()
          break;
        case 'logout':
          this.handleLogout()
          break;
      }
    },
    handleLogout() {
      this.$msgbox.confirm('确定退出系统吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('user/logout').then(() => {
          location.href = '/login'
          // this.$router.push('/login')
        }).catch(() => {})
      }).catch(() => {})
    },
    handlePasswordModify() {
      this.showPasswordModifyDialog = true
    }
  }
}
</script>
<style lang="scss">
  .navbar-dropdown-menu {
    .el-dropdown-menu__item i {
      margin-right: 2px;
    }
    .menu-change {
      i {
        margin: 0;
        font-style: normal;
      }
      .active {
        color: #409EFF;
      }
    }
  }

</style>
<style lang="scss" scoped>
.navbar {
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  height: 50px;
  border-bottom: 1px solid #EFEFEF;

  // .hamburger-container {
  //   display: inline-block;
  //   height: 100%;
  //   line-height: 46px;
  //   cursor: pointer;
  //   transition: background .3s;
  //   vertical-align: top;

  //   -webkit-tap-highlight-color: transparent;

  //   &:hover {
  //     background: rgba(0, 0, 0, .025);
  //   }
  // }

  // .breadcrumb-container {
  //   display: inline-block;
  // }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-area {
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      padding: 0 8px;
      font-size: 18px;
      vertical-align: text-bottom;
      color: #5A5E66;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025);
        }
      }
    }

    .icon-collection {
      font-size: 24px;
      vertical-align: -6px;
    }

    .avatar-container {
      padding-right: 20px;

      .avatar-wrapper {
        position: relative;
        height: 50px;
        .icon-user-avatar {
          display: inline-block;
          font-size: 24px;
          color: #777777;
        }

        .user-name {
          margin-left: 5px;
          font-size: 14px;
          vertical-align: top;
        }

        .el-icon-caret-bottom {
          position: absolute;
          top: 19px;
          right: -15px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
}

</style>
