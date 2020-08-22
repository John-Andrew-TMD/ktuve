<template>
  <div class="sidebar-logo-container">
    <!-- <transition name="sidebarLogoFade"> -->
    <router-link class="sidebar-logo-link" to="/">
      <svg-icon icon-class="logo" class-name="sidebar-logo" />
      <h1 class="sidebar-title">{{ title }} </h1>
    </router-link>
    <!-- <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <svg-icon icon-class="logo" className="sidebar-logo" />
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link> -->
    <!-- </transition> -->
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '金证前海融资租赁'
    }
  }
}
</script>

<style lang="scss" scoped>
// .sidebarLogoFade-enter-active {
//   transition: opacity 1.5s;
// }

// .sidebarLogoFade-enter, .sidebarLogoFade-leave-to {
//   opacity: 0;
// }

.sidebar-logo-container {
  display: inline-block;
  overflow: hidden;
  width: 200px;
  height: 50px;
  line-height: 50px;
  text-align: center;

  & .sidebar-logo-link {
    width: 100%;
    height: 100%;

    & .sidebar-logo {
      margin-right: 12px;
      font-size: 30px;
      vertical-align: middle;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      font-size: 15px;
      font-weight: normal;
      line-height: 50px;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px !important;
    }
  }
}

</style>
