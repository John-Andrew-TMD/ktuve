<!-- 合同审批 -->
<template>
  <div class="flow-project-approval-form" style="height: 100%;">
    <contract-common-detail :route-params="routeParams" :can-edit="canEdit" />
  </div>
</template>

<script>
import ClassFlow from 'utils/class-flow.js'
import ContractCommonDetail from 'views/contract-mng/contract-detail/components/ContractCommonDetail.vue'
export default {
  components: {
    ContractCommonDetail
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
    }
  },
  data() {
    return {
      canEdit: false,
      routeParams: null
    }
  },
  created() {
    this.initForm()
    this.generateInstance()
  },
  methods: {
    initForm() {
      // startFlag 第一个节点为true
      this.canEdit = this.flowInfo.startFlag
      const { id = '', approvalId = '' } = this.flowInfo.customizeParam && this.flowInfo.customizeParam.param || {}
      this.routeParams = {
        id,
        approvalId
      }
    },
    generateInstance() {
      const flowInstance = new ClassFlow(this.flowInfo, this)
      this.$emit('input', flowInstance)
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
