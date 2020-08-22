<template>
  <div class="flow-container">
    <el-tabs v-model="componentName">
      <el-tab-pane label="待我审批" name="FlowAwait" />
      <el-tab-pane label="我参与的" name="FlowInvolved" />
      <el-tab-pane label="我创建的" name="FlowCreated" />
    </el-tabs>
    <span class="read-more" @click="handleViewMore">查看更多></span>
    <div class="flow-content">
      <component :is="componentName" />
    </div>
  </div>
</template>
<script>
import FlowAwait from './FlowAwait.vue'
import FlowInvolved from './FlowInvolved.vue'
import FlowCreated from './FlowCreated.vue'
// import { mapGetters } from 'vuex'
export default {
  components: {
    FlowAwait,
    FlowInvolved,
    FlowCreated
  },
  data() {
    return {
      componentName: 'FlowAwait'
    }
  },
  // computed: {
  //   ...mapGetters(['refreshPageData'])
  // },
  // watch: {
  //   refreshPageData() {
  //     this.componentName = 'FlowAwait'
  //   }
  // },
  methods: {
    handleViewMore() {
    }
  }
}
</script>
<style lang="scss">
.home-page {
  .flow-container {
    position: relative;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    height: 100%;
    padding: 0 15px;

    .el-tabs {
      height: 50px;
      .el-tabs__header {
        margin: 0;
      }
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
    .el-tabs__content {
      display: none;
    }
    .flow-content {
      flex: 1;
    }

    .read-more {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 12px;
      cursor: pointer;
      color: #1890FF;
    }
  }
}

</style>

