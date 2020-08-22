<template>
  <el-dialog
    width="750px"
    :modal-append-to-body="false"
    title="新增集团"
    :visible.sync="dialogVisible"
    @closed="handleDialogClosed"
  >
    <group-customer-action ref="actionDom" />
    <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">发起审批</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { groupCustomerAdd } from 'api/customer-module/api-customer-mng.js'
import GroupCustomerAction from './common-components/GroupCustomerAddAction.vue'
export default {
  inheritAttrs: false,
  components: {
    GroupCustomerAction
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  mounted() {
    this.dialogVisible = true
  },
  methods: {
    // 确定
    async handleDialogConfirm() {
      const custId = await this.$refs.actionDom.validateForm()
      if(custId == null) return
      groupCustomerAdd({
        custId
      }, { showLoading: true }).then(res => {
        this.$showToast('发起成功！', 'success')
        this.dialogVisible = false
        this.$emit('dialog-confirm')
      }).catch(err => {
        console.log(err)
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>
