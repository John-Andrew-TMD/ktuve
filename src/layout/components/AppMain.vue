<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style lang="scss">
#app .app-main {
  /* 50= navbar  50  */
  // min-height: calc(100vh - 50px);
  // width: 100%;
  // position: relative;
  // overflow: hidden;
  position: absolute;
  z-index: 900;
  top: 41px;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  // overflow-y: auto;
  background: #F1F4F5;
  .v-modal {
    position: absolute;
  }
}

// .fixed-header+.app-main {
//   padding-top: 50px;
// }

// .hasTagsView {
//   .app-main {
//     /* 84 = navbar + tags-view = 50 + 34 */
//     min-height: calc(100vh - 84px);
//   }

//   .fixed-header+.app-main {
//     padding-top: 90px;
//   }
// }

</style>

<!--<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}

</style>-->
