<template>
  <el-dialog
    :title="dialogTitle"
    :modal-append-to-body="false"
    :visible.sync="dialogVisible"
    width="450px"
    @closed="handleDialogClosed"
  >
    <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible=false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { isEmptyObj } from 'utils'
import { childDictAdd, childDictUpdate } from 'api/system-setup.js'
export default {
  props: {
    rowData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '子字典项新增',
      formApi: null,
      formRules: [
        {
          type: 'hidden',
          field: 'dictCode'
        },
        {
          type: 'input',
          title: '字典项',
          field: 'dictItem',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '字典项名称',
          field: 'dictItemName',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'number-input',
          title: '排序',
          field: 'dictOrd',
          value: '0',
          props: {
            maxDecimal: 0
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '父id',
          field: 'remark'
        }
      ],
      formOptions: {
        form: { labelWidth: '100px' },
        submitBtn: { show: false }
      }
    }
  },
  mounted() {
    this.dialogVisible = true
    this.setFormData()
  },
  methods: {
    setFormData() {
      if (isEmptyObj(this.rowData)) throw new Error('父dictCode不允许为空！')
      if (Object.keys(this.rowData).length > 1) {
        this.dialogTitle = '子字典项修改'
        this.$nextTick(() => {
          this.formApi.disabled(true, 'dictItem')
        })
      }
      this.$nextTick(() => {
        this.formApi.setValue(this.rowData)
      })
    },
    handleDialogConfirm() {
      this.formApi.validate(async valid => {
        if (valid) {
          let url = childDictAdd
          if (Object.keys(this.rowData).length > 1) {
            url = childDictUpdate
          }
          const params = this.formApi.formData()
          this.$promiseRequest(url, params, {
            needDto: false,
            showLoading: true
          })
            .then(res => {
              this.$showToast(res.msg, 'success')
              this.dialogVisible = false
              this.$emit('dialog-confirm', 'child')
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang='scss'>
</style>
