<template>
  <div>
    <el-dialog
      width="600px"
      :modal-append-to-body="false"
      title="新增客户"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryDictItems } from 'utils'
import { customerAdd  } from 'api/customer-module/api-customer-mng.js'
export default {
  inheritAttrs: false,
  data() {
    return {
      dialogVisible: false,
      formApi: null,
      formRules: [
       
      ],
      formOptions: {
        form: { labelWidth: '140px' },
        submitBtn: { show: false }
      }
    }
  },
  mounted() {
    this.dialogVisible = true
  },
  methods: {
    // 确定
    handleDialogConfirm() {
      this.formApi.validate(async valid => {
        if (valid) {
         
        }
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  .el-autocomplete, .el-select {
    width: 100%;
  }
}

</style>
