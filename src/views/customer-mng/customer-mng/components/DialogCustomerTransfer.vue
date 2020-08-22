<template>
  <el-dialog
    width="600px"
    :modal-append-to-body="false"
    title="客户移交"
    :visible.sync="dialogVisible"
    @closed="handleDialogClosed"
  >
    <customer-transfer-action ref="actionDom" :selected-rows="selectedRows" />
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible=false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">发起审批</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { createFlowInstance } from 'utils'
import { customerTransfer } from 'api/customer-module/api-customer-mng.js'
import CustomerTransferAction from './common-components/CustomerTransferAction.vue'
export default {
  components: {
    CustomerTransferAction
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
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
    async handleDialogConfirm() {
      const params = await this.$refs.actionDom.validateForm()
      if(!params) return
      customerTransfer(params, { showLoading: true })
        .then(res => {
          this.$showToast('移交成功！', 'success')
          this.dialogVisible = false
          this.$emit('dialog-confirm')
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>