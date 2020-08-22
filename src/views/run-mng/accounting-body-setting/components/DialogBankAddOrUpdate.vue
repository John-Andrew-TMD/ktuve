<template>
  <el-dialog :title="prefix + '银行信息'" :visible.sync="dialogShow" width="750px" :modal-append-to-body="false" @closed="handleDialogClosed">
    <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    <span slot="footer">
      <el-button @click="dialogShow = false">取 消</el-button>
      <el-button type="primary" @click="handleSaveClick">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { bankAdd, bankUpdate } from 'api/run-module/accounting-body-setting.js'
import { isEmptyObj } from 'utils'
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    accounttingBodyId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formApi: null,
      formRules: [{
        type: 'input',
        field: 'bankAccountName',
        title: '银行户名',
        props: {
          maxlength: 10
        },
        validate: this.formValidate({ required: true })
      },
      {
        type: 'input',
        field: 'bankAccount',
        title: '银行账号',
        props: {
          maxlength: 30
        },
        validate: this.formValidate({ required: true })
      },
      {
        type: 'input',
        field: 'openingBank',
        title: '开户行',
        props: {
          maxlength: 50
        },
        validate: this.formValidate({ required: true })
      },
      {
        type: 'input',
        field: 'bankCode',
        title: '银行行号',
        props: {
          maxlength: 50
        },
        validate: this.formValidate({ required: true })
      },
      {
        type: 'input',
        field: 'bankOrgCode',
        title: '银行机构代码',
        props: {
          maxlength: 50
        },
        validate: this.formValidate({ required: true })
      },
      {
        type: 'input',
        field: 'bankSubjectCode',
        title: '科目代码',
        props: {
          maxlength: 30
        },
        validate: this.formValidate({ required: true })
      },
      {
        type: 'input',
        field: 'remarks',
        title: '备注',
        props: {
          maxlength: 500,
          type: 'textarea'
        }
      }
      ],
      formOptions: {
        form: {
          labelWidth: '110px'
        },
        submitBtn: {
          show: false
        }
      },
      dialogShow: false,
      prefix: '新增'
    }
  },
  mounted() {
    this.dialogShow = true
    this.initUI()
  },
  methods: {
    initUI() {
      if (isEmptyObj(this.formData)) return
      this.prefix = '修改'
      const params = Object.assign({}, this.formData)
      this.$nextTick(() => {
        this.formApi.setValue(params)
      })
    },
    // 保存
    handleSaveClick() {
      this.formApi.validate(valid => {
        if (valid) {
          if (this.accounttingBodyId === '') return this.$showToast('核算主体id不允许为空！')
          const params = this.formApi.formData()
          params.accountingSubjectId = this.accounttingBodyId
          if (isEmptyObj(this.formData)) {
            bankAdd(params, { showLoading: true }).then(res => {
              this.$showToast('新增成功！', 'success')
              this.$emit('dialog-confirm', 'bank')
              this.dialogShow = false
            }).catch(err => {
              console.log(err)
            })
          } else {
            bankUpdate({
              ...params,
              id: this.formData.id
            }, { showLoading: true }).then(res => {
              this.$showToast('修改成功！', 'success')
              this.dialogShow = false
              this.$emit('dialog-confirm', 'bank')
            }).catch(err => {
              console.log(err)
            })
          }
        }
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialog-status', false)
    }
  }
}

</script>
