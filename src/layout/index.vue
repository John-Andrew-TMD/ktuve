<template>
  <div :class="classObj" class="app-wrapper">
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
    <navbar />
    <div class="app-container">
      <sidebar class="sidebar-container" />
      <div :class="{hasTagsView:needTagsView}" class="main-container">
        <div class="tags-view" :class="{'fixed-header':fixedHeader}">
          <tags-view v-if="needTagsView" />
        </div>
        <app-main />
        <right-panel v-if="showSettings">
          <settings />
        </right-panel>
      </div>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
// import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  // mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        // withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    // handleClickOutside() {
    //   this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    // }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/assets/css/mixin.scss';
  @import '~@/assets/css/variables.scss';

  .app-wrapper {
    display: flex;
    flex-direction: column;
    // position: relative;
    width: 100%;
    height: 100%;

    @include clearfix;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }

    .app-container {
      display: flex;
      flex: 1;
      height: 100%;
    }
  }

  .drawer-bg {
    position: absolute;
    z-index: 999;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .3;
    background: #000000;
  }

  .fixed-header {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    width: calc(100% - #{$sideBarWidth});
    transition: width .28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px);
  }

  .mobile .fixed-header {
    width: 100%;
  }

</style>
