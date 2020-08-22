<template>
  <el-dialog
    :title="'保证金退还申请（第'+applyNumber+'笔）'"
    class="dialog-deposit-return"
    :visible.sync="dialogVisible"
    width="980px"
    :modal-append-to-body="false"
    :append-to-body="false"
    @closed="handleDialogClosed"
  >
    <deposit-return ref="depositReturnDom" :row-data="rowData" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClosed">取消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">发起审批</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DepositReturn from './components/CompDepositReturn.vue'
import { startReurnFlow } from 'api/investment-mng/api-deposit-mng.js'

export default {
  components: {
    DepositReturn
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
      startReurnFlow(params, { showLoading: true })
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
      const number = this.rowData.refundNum || 0
      return number + 1
    }
  }
}
</script>

<style lang='scss' scoped>
.dialog-deposit-return {
  /deep/ .el-dialog__body {
    position: static;
  }
}
</style>
