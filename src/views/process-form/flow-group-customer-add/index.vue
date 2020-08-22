<template>
  <div class="flow-group-customer-add-form">
    <div>
      <group-customer-action ref="actionDom" :disabled="isDisable" :form-data="formData" />
      <p v-if="!isDisable"><el-button type="primary" size="mini" style="margin-left: 140px" @click="handleSaveClick">保存</el-button></p>
    </div>
  </div>
</template>

<script>
import ClassFlow from 'utils/class-flow.js'
import GroupCustomerAction from 'views/customer-mng/customer-mng/components/common-components/GroupCustomerAddAction.vue'
import { groupCustomerUpdate } from 'api/customer-module/api-customer-mng.js'
export default {
  components: {
    GroupCustomerAction
  },
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
      isDisable: false
    }
  },
  created() {
    this.initForm()
    this.generateInstance()
  },
  methods: {
    initForm() {
      // startFlag 第一个节点为true
      this.isDisable = !this.flowInfo.startFlag
    },
    async handleSaveClick() {
      const custId = await this.$refs.actionDom.validateForm()
      if (custId == null) return
      groupCustomerUpdate({
        id: this.formData.id,
        custId
      }, { showLoading: true }).then(res => {
        this.$showToast('保存成功！', 'success')
        this.dialogVisible = false
        this.$emit('dialog-confirm')
      }).catch(err => {
        console.log(err)
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
.flow-group-customer-add-form {
  overflow-y: auto;
  height: 100%;
  & > div {
    max-width: 750px;;
    padding: 10px;
  }
}

</style>
