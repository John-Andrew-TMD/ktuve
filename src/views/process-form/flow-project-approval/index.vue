<!-- 项目审批 -->
<template>
  <div class="flow-project-approval-form">
    <project-detail v-if="urlParams" :flow-info="flowInfo" :route-params="urlParams" />
  </div>
</template>

<script>
import ClassFlow from 'utils/class-flow.js'
import ProjectDetail from 'views/project-mng/project-detail/components/project-detail.vue'
export default {
  components: {
    ProjectDetail
  },
  inheritAttrs: false,
  props: {
    flowInfo: {
      type: Object,
      default: () => ({})
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    routeParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      urlParams: null
    }
  },
  created() {
    this.initForm()
    this.generateInstance()
  },
  methods: {
    initForm() {
      this.urlParams = Object.assign({}, this.formData, {
        canEdit: this.flowInfo.startFlag
      })
    },
    generateInstance() {
      const flowInstance = new ClassFlow(this.flowInfo, this)
      this.$emit('input', flowInstance)
    }
  }
}
</script>

<style lang='scss' scoped>
.flow-project-approval-form {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  margin: -5px -5px 0;
  padding: 0;
  /deep/ .app-content-wrapper {
    padding: 0;
  }
}

</style>
