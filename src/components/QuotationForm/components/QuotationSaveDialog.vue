<template>
  <el-dialog
    v-transfer-dom
    title="报价方案保存"
    :modal-append-to-body="false"
    :visible.sync="showDialog"
    width="450px"
    @closed="handleDialogClosed"
  >
    <div class="dialog-body">
      <el-form
        ref="formDom"
        :model="formValues"
        :rules="formRules"
        label-width="80px"
        size="medium"
      >
        <el-form-item label="方案名称" prop="quotationName">
          <el-input v-model="formValues.quotationName" maxlength="256" />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClose">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['autoIncrementNum', 'dialogConfirm'],
  data() {
    return {
      formValues: {
        quotationName: ''
      },
      showDialog: false,
      formRules: {
        quotationName: this.formValidate({ required: true })
      }
    }
  },
  mounted() {
    this.showDialog = true
  },
  methods: {
    handleDialogClose() {
      this.showDialog = false
    },
    handleDialogClosed() {
      this.$emit('update:showSaveDialog', false)
    },
    handleDialogConfirm() {
      this.$refs.formDom.validate(async valid => {
        if (valid) {
          this.formValues.quotationNo = this.formValues.quotationName
          this.dialogConfirm && this.dialogConfirm(this.formValues)
          this.handleDialogClose()
        }
      })
    }
  }
}
</script>

<style lang='scss'>
</style>
