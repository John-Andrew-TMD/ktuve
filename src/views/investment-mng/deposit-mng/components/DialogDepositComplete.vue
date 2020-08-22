<template>
  <el-dialog
    :title="'保证金补足申请（第'+applyNumber+'笔）'"
    class="dialog-deposit-complete"
    :visible.sync="dialogVisible"
    width="980px"
    :modal-append-to-body="false"
    @closed="handleDialogClosed"
  >
    <deposit-complete ref="depositReturnDom" :row-data="rowData" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClosed">取消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">发起审批</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DepositComplete from './components/CompDepositComplete.vue'
import { startCompleteFlow } from 'api/investment-mng/api-deposit-mng.js'

export default {
  components: {
    DepositComplete
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
        applyMatters: formData.applyMatters,
        approvalAmount: formData.approvalAmount,
        planDate: formData.planDate,
        remarks: formData.remarks,
        riskfeeType: formData.riskfeeType,
        list: formDom.fileList
      }
      startCompleteFlow(params, { showLoading: true })
        .then(res => {
          this.$showToast('保证金退还申请发起成功！', 'success')
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
      const number = this.rowData.makeupNum || 0
      return number + 1
    }
  }
}
</script>

<style lang='scss' scoped>
.dialog-deposit-complete {
  /deep/ .el-dialog__body {
    position: static;
  }
}
</style>
