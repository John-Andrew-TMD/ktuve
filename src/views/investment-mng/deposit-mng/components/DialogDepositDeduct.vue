<template>
  <el-dialog
    :title="'保证金抵扣申请（第'+applyNumber+'笔）'"
    class="dialog-deposit-deduct"
    :visible.sync="dialogShow"
    width="1080px"
    :modal-append-to-body="false"
    @closed="handleDialogClosed"
  >
    <deposit-deduct ref="depositDeductDom" :row-data="rowData" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClosed">取消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">发起审批</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DepositDeduct from './components/CompDepositDeduct'
import { startDeductFlow } from 'api/investment-mng/api-deposit-mng.js'

export default {
  components: {
    DepositDeduct
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
      dialogShow: false
    }
  },
  mounted() {
    this.dialogShow = true
  },
  methods: {
    // 发起审批
    async handleDialogConfirm() {
      const formDom = this.$refs.depositDeductDom
      const valid = await formDom.validateForm()
      if (!valid) return
      const formData = formDom.formApi.formData()
      startDeductFlow(
        {
          id: this.rowData.id,
          applyMatters: formData.applyMatters,
          remarks: formData.remarks,
          riskfeeType: formData.riskfeeType,
          list: formDom.fileList,
          detailList: [] // illa-todo
        },
        { showLoading: true }
      ).then(res => {
        this.$showToast('保证金抵扣申请发起成功！', 'success')
        this.$emit('update:dialogStatus', false)
        this.refreshTable()
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  },
  computed: {
    applyNumber() {
      const number = this.rowData.deductNum || 0
      return number + 1
    }
  }
}
</script>

<style lang='scss' scoped>
.dialog-deposit-deduct {
  /deep/ .el-dialog__body {
    position: static;
  }
}
</style>
