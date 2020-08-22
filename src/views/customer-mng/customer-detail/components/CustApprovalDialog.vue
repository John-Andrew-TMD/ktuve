<template>
  <div>
    <el-dialog
      width="600px"
      :modal-append-to-body="false"
      title="发起审批"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <p class="title">请选择需要发起审批的客户信息</p>
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="1" disabled>机构信息</el-checkbox>
        <el-checkbox label="2">银行信息</el-checkbox>
        <el-checkbox label="3">开票信息</el-checkbox>
        <el-checkbox label="4">股东信息</el-checkbox>
        <el-checkbox label="5">关联信息</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">发起审批</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      checkList: ['1']
    }
  },
  mounted() {
    this.dialogVisible = true
  },
  methods: {
    async handleDialogConfirm() {
      this.$emit('dialog-confirm', this.checkList)
      this.dialogVisible = false
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>
<style lang="scss" scoped>
  div /deep/ .el-dialog {
    .title {
      font-size: 18px;
      margin-bottom: 15px;
    }
    .el-checkbox {
      display: block;
      margin-bottom: 5px;
    }
  }
</style>