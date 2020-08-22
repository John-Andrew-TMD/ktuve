<template>
  <transition name="fade">
    <div v-show="showMenu" :class="{'is_expand': isExpand}">
      <div class="left-area">
        <el-scrollbar @mouseenter.native="handleMouseEnter" @mouseleave.native="handleMouseLeave">
          <div class="root-menu">
            <div :class="{'is-active': currentIndex === 'search'}" @click="handleMenuSearch">
              <div class="menu-title">
                <i class="el-icon-search" />
                <span>搜索</span>
              </div>
            </div>
            <root-menu-list
              v-for="(route, index) in menuRoutes"
              :key="route.id"
              :item="route"
              :base-path="route.path"
              :class="{'is-active': index === currentIndex || currentIndex === '' && route.path === $route.matched[0].path }"
              @click.native="handleMenuClick(route, index)"
            />
          </div>
        </el-scrollbar>
        <div class="siderbar-tools">
          <hamburger
            :is-active="sidebar.opened"
            @toggleClick="toggleSideBar"
          />
        </div>
      </div>
      <div class="right-area" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <transition name="fade" duration="200">
          <el-scrollbar v-if="!!subMenuRoutes" ref="scrollbarDom">
            <div class="right-area-content">
              <sidebar-item
                v-for="route in subMenuRoutes.children"
                :key="route.id"
                :item="route"
                :base-path="subMenuRoutes.path + '/' + route.path"
                @collapse-change="handleCollapseChange"
              />
            </div>
          </el-scrollbar>
          <menu-search v-if="showSearchArea" :routes="permissionRoutes" />
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import RootMenuList from './RootMenuList'
import SidebarItem from './SidebarItem'
import MenuSearch from './MenuSearch'
import Hamburger from 'components/Hamburger'
import variables from '@/assets/css/variables.scss'
const DEFAULT_SELECT_INDEX = 7

export default {
  components: { RootMenuList, SidebarItem, Hamburger, MenuSearch },
  data() {
    return {
      showMenu: true,
      menuRoutes: [],
      subMenuRoutes: null,
      selectedIndex: DEFAULT_SELECT_INDEX,
      currentIndex: DEFAULT_SELECT_INDEX,
      isExpand: false,
      showSearchArea: false
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
  mounted() {
    this.showDefaultRoutes()
  },
  watch: {
    permissionRoutes: {
      handler(newVal) {
        // this.showMenu = false
        // setTimeout(() => {
        this.menuRoutes = newVal
        // this.showMenu = true
        // }, 300)
      },
      immediate: true
    },
    $route: {
      handler(to) {
        this.showSearchArea = false
        // if (to.path === '/home') {
        //   if (!this.subMenuRoutes) {
        //     this.subMenuRoutes = this.menuRoutes[DEFAULT_SELECT_INDEX] || []
        //   }
        // this.currentIndex = this.selectedIndex
        // } else {
        //   debugger
        //   const matchedPath = this.$route.matched[0].path
        //   const matchedRoute = this.menuRoutes.filter(route => matchedPath === route.path)
        //   this.subMenuRoutes = matchedRoute[0] || []
        //   this.currentIndex = ''
        // }
        const matchedPath = this.$route.matched[0].path
        const matchedRoute = this.menuRoutes.filter(route => matchedPath === route.path)
        if(matchedRoute.length && !matchedRoute[0].hidden) {
          this.subMenuRoutes = matchedRoute[0] || []
          this.currentIndex = ''
        }
      },
      immediate: true
    }
  },
  methods: {
    showDefaultRoutes() {
      if (!this.subMenuRoutes) {
        this.subMenuRoutes = this.menuRoutes[DEFAULT_SELECT_INDEX] || []
      }
      this.currentIndex = this.selectedIndex
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    handleMenuClick(route, idx) {
      if(this.currentIndex === idx) return
      this.showSearchArea = false
      this.subMenuRoutes = null
      this.selectedIndex = idx
      this.currentIndex = idx
      setTimeout(() => {
        this.subMenuRoutes = route
      }, 200)
    },
    handleMouseEnter() {
      if (this.sidebar.opened) return
      this.isExpand = true
    },
    handleMouseLeave() {
      if (this.sidebar.opened) return
      this.isExpand = false
    },
    handleCollapseChange() {
      this.collapseTimer && clearTimeout(this.collapseTimer)
      this.collapseTimer = setTimeout(() => {
        this.$refs.scrollbarDom.update()
      }, 300)
    },
    handleMenuSearch() {
      this.currentIndex = 'search'
      this.subMenuRoutes = null
      this.showSearchArea = true
    }
  }
}
</script>

