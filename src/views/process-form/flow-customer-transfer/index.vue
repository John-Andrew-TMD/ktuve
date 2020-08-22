<template>
  <div class="content flow-customer-transfer-form">
    <customer-transfer-action ref="actionDom" :disabled="isDisable" :form-data="formData" />
    <p v-if="!isDisable"><el-button type="primary" size="mini" style="margin-left: 140px" @click="handleSaveClick">保存</el-button></p>
  </div>
</template>

<script>
import ClassFlow from 'utils/class-flow.js'
import CustomerTransferAction from 'views/customer-mng/customer-mng/components/common-components/CustomerTransferAction.vue'
import { customerTransferUpdate } from 'api/customer-module/api-customer-mng.js'
export default {
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
  components: {
    CustomerTransferAction
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
      const params = await this.$refs.actionDom.validateForm()
      if(params == null) return
      customerTransferUpdate({
        id: this.formData.id,
        ...params
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
.flow-customer-transfer-form {
  padding-top: 10px;
  width: 650px
}
</style>
