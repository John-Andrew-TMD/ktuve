<template>
  <el-dialog
    :title="'保证金追加申请（第'+applyNumber+'笔）'"
    class="dialog-deposit-remargin"
    :visible.sync="dialogVisible"
    width="980px"
    :modal-append-to-body="false"
    @closed="handleDialogClosed"
  >
    <deposit-remargin ref="depositReturnDom" :row-data="rowData" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClosed">取消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">发起审批</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DepositRemargin from './components/CompDepositRemargin.vue'
import { startAdditionalFlow } from 'api/investment-mng/api-deposit-mng.js'

export default {
  components: {
    DepositRemargin
  },
  props: {
    rowData: {
      type: Object,
      default: () => ({})
    }
  },
  inject: ['refreshTable'],
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
      const formDom = this.$refs.depositReturnDom
      const valid = await formDom.validForm()
      if (!valid) return
      const formData = formDom.formApi.formData()
      const params = {
        id: formData.id,
        conBundleId: this.rowData.conBundleId,
        applyMatters: formData.applyMatters,
        approvalAmount: formData.approvalAmount,
        planDate: formData.planDate,
        remarks: formData.remarks,
        riskfeeType: formData.riskfeeType,
        list: formDom.fileList
      }
      startAdditionalFlow(params, { showLoading: true })
        .then(res => {
          this.$showToast('保证金追加申请发起成功！', 'success')
          this.$emit('update:dialogStatus', false)
          this.refreshTable()
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  },
  computed: {
    applyNumber() {
      const number = this.rowData.additionalNum || 0
      return number + 1
    }
  }
}
</script>

<style lang='scss' scoped>
.dialog-deposit-remargin {
  /deep/ .el-dialog__body {
    position: static;
  }
}
</style>
