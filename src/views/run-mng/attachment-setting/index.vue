<template>
  <div id="dialogHook" class="app-content attachment-setting-page">
    <div class="app-content-wrapper">
      <el-tabs v-model="componentName" class="tabs-top">
        <el-tab-pane name="attachmentMaintain" label="附件维护" />
        <el-tab-pane name="attachmentList" label="资料附件" />
      </el-tabs>
      <div class="component-container">
        <component :is="componentName" />
      </div>
    </div>
  </div>
</template>

<script>
import AttachmentMaintain from './components/AttachmentMaintain.vue'
import AttachmentList from './components/AttachmentList.vue'
export default {
  components: {
    AttachmentMaintain,
    AttachmentList
  },
  data() {
    return {
      componentName: 'attachmentMaintain'
    }
  }
}
</script>

<style lang="scss">
.attachment-setting-page {
  .app-content-wrapper {
    padding-top: 0;
  }
  .tabs-top {
    height: 40px;
    .el-tabs__header {
      margin-bottom: 0px;
    }
    .el-tabs__content {
      display: none;
    }
  }
}

</style>
