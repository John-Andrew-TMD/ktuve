<template>
  <div v-transfer-dom class="inline-dialog">
    <el-dialog
      title="财务报表导出"
      :visible.sync="dialogShow"
      :modal="false"
      width="500px"
      @closed="handleDialogClosed"
    >
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow=false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formSubmit } from 'utils'
import { exportFinanceReport } from 'api/customer-module/api-customer-detail.js'
export default {
  props: {
    checkedData: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      dialogShow: false,
      formApi: null,
      formRules: [
        {
          type: 'select',
          title: '导出内容选择',
          field: 'exportType',
          value: '2',
          options: [
            { value: '2', label: '全部' },
            { value: '0', label: '财务报表数据' },
            { value: '1', label: '财务报告附件' }
          ]
        }
      ],
      formOptions: {
        form: {
          labelWidth: 'auto'
        },
        submitBtn: {
          show: false
        }
      }
    }
  },
  mounted() {
    this.dialogShow = true
  },
  methods: {
    async handleDialogConfirm() {
      const { exportType } = this.formApi.formData()
      const ids = this.checkedData.map(item => item.id)
      formSubmit(
        exportFinanceReport,
        {
          exportType,
          finConditionIds: ids
        },
        'get'
      )
      this.dialogShow = false
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang='scss'>
</style>
