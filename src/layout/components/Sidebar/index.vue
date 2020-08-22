<template>
  <div :class="{'has-logo':showLogo}">
    <transition name="fade">
      <el-scrollbar v-show="showMenu" wrap-class="scrollbar-wrapper">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :unique-opened="true"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          mode="vertical"
        >
          <sidebar-item
            v-for="route in menuRoutes"
            :key="route.id"
            :item="route"
            :base-path="route.path"
          />
        </el-menu>
        <hamburger
          :is-active="sidebar.opened"
          class="hamburger-container"
          @toggleClick="toggleSideBar"
        />
      </el-scrollbar>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Hamburger from 'components/Hamburger'
import variables from '@/assets/css/variables.scss'

export default {
  components: { SidebarItem, Hamburger },
  data() {
    return {
      showMenu: true,
      menuRoutes: []
    }
  },
  computed: {
    ...mapGetters(['permissionRoutes', 'sidebar']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    // showLogo() {
    //   return this.$store.state.settings.sidebarLogo
    // },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    permissionRoutes: {
      handler(newVal) {
        this.showMenu = false
        setTimeout(() => {
          this.menuRoutes = newVal
          this.showMenu = true
        }, 300)
      },
      immediate: true
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

