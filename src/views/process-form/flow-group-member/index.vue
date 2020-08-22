<template>
  <div class="content flow-group-member-form">
    <div style="max-width: 1100px;">
      <group-customer-member-action ref="actionDom" :selected-row="formData" :action="action" :flow-info="flowInfo" from="flow" />
    </div>
  </div>
</template>

<script>
import ClassFlow from 'utils/class-flow.js'
import GroupCustomerMemberAction from 'views/customer-mng/customer-mng/components/common-components/GroupCustomerMemberAction.vue'
import { groupMemberFirstNodeDataSave } from 'api/customer-module/api-customer-mng.js'
export default {
  components: {
    GroupCustomerMemberAction
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
      action: ''
    }
  },
  created() {
    this.initForm()
    this.generateInstance()
  },
  methods: {
    initForm() {
      // startFlag 第一个节点为true
      this.action = this.flowInfo.startFlag ? 'A' : 'V'
    },
    beforeNext() {
      return new Promise(async(resolve, reject) => {
        // 不是第一个节点不用提交表单信息
        if (!this.flowInfo.startFlag) return resolve(true)
        const ret = await this.$refs.actionDom.validateForm()
        if (!ret) return resolve(false)
        const { commentMessage = '', fileAddedIdList = [], fileDeletedList = [] } = ret
        groupMemberFirstNodeDataSave({
          processInstanceId: this.flowInfo.processInstanceId,
          addIds: fileAddedIdList,
          delIds: fileDeletedList,
          commentMessage
        }, { showLoading: true }).then(res => {
          resolve(true)
        }).catch(err => {
          console.log(err)
          resolve(false)
        })
      })
    },
    generateInstance() {
      const flowInstance = new ClassFlow(
        this.flowInfo,
        this
      )
      this.$emit('input', flowInstance)
    }
  }
}
</script>

<style lang='scss' scoped>
.flow-group-member-form {
  overflow-y: auto;
  height: 100%;
  padding: 10px;
}

</style>
