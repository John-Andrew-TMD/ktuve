<template>
  <div>
    <el-dialog :title="prefix + '核算主体信息'" :visible.sync="dialogShow" width="750px" :modal-append-to-body="false" @closed="handleDialogClosed">
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      <span slot="footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="handleSaveClick">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { accountingBodyAdd, accountingBodyUpdate } from 'api/run-module/accounting-body-setting.js'
import { isEmptyObj } from 'utils'
export default {
  inheritAttrs: false,
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formApi: null,
      formRules: [{
        type: 'input',
        field: 'accountingSubjectName',
        title: '核算主体名称',
        props: {
          maxlength: 50
        },
        validate: this.formValidate({ required: true })
      },
      {
        type: 'input',
        field: 'accountingSubjectAbbreviation',
        title: '核算主体简称',
        props: {
          maxlength: 30
        },
        validate: this.formValidate({ required: true })
      },
      {
        type: 'input',
        field: 'legalRepresentative',
        title: '法定代表人',
        props: {
          maxlength: 10
        },
        validate: this.formValidate({ required: true })
      },
      {
        type: 'input',
        field: 'unifiedSocialCreditCode',
        title: '统一社会信用代码',
        validate: this.formValidate({ required: true, type: 'creditCode' })
      },
      {
        type: 'el-col',
        native: true,
        col: { span: 24 },
        children: [{
          type: 'china-region-cascade',
          field: 'address',
          title: '住所',
          props: { separator: '-' },
          col: { span: 14 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          field: 'addressDetail',
          col: { span: 10 },
          props: {
            maxlength: 100
          },
          validate: this.formValidate({ required: true })
        }
        ]
      },
      {
        type: 'el-col',
        native: true,
        col: { span: 24 },
        children: [{
          type: 'china-region-cascade',
          field: 'businessPlace',
          title: '通讯地址',
          props: { separator: '-' },
          col: { span: 14 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          field: 'businessPlaceDetail',
          col: { span: 10 },
          props: {
            maxlength: 100
          },
          validate: this.formValidate({ required: true })
        }
        ]
      },
      {
        type: 'input',
        field: 'contactPerson',
        title: '联系人',
        props: {
          maxlength: 10
        },
        validate: this.formValidate({ required: true })
      },
      {
        type: 'input',
        field: 'contactNumber',
        title: '电话',
        validate: this.formValidate({ required: true, type: 'telOrMobile' })
      },
      {
        type: 'input',
        field: 'fax',
        title: '传真',
        validate: this.formValidate({ required: true, type: 'fax' })
      },
      {
        type: 'input',
        field: 'unitName',
        title: '单位名称',
        props: {
          maxlength: 50
        },
        validate: this.formValidate({ required: true })
      },
      {
        type: 'input',
        field: 'taxpayerIdentificationNumber',
        title: '纳税人识别号',
        validate: this.formValidate({ required: true })
      },
      {
        type: 'input',
        field: 'telephone',
        title: '电话',
        validate: this.formValidate({ required: true, type: 'telOrMobile' })
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
        field: 'bankAccount',
        title: '银行账号',
        validate: this.formValidate({ required: true })
      },
      {
        type: 'el-col',
        native: true,
        col: { span: 24 },
        children: [{
          type: 'china-region-cascade',
          field: 'registeredAddress',
          title: '住所',
          props: { separator: '-' },
          col: { span: 14 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          field: 'registeredAddressDetail',
          col: { span: 10 },
          props: {
            maxlength: 100
          },
          validate: this.formValidate({ required: true })
        }
        ]
      }
      ],
      formOptions: {
        form: {
          labelWidth: '150px'
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
      let tempArr = []
      if (params.address) {
        tempArr = params.address.split(',')
        params.addressDetail = tempArr.pop()
        params.address = tempArr
      }
      if (params.businessPlace) {
        tempArr = params.businessPlace.split(',')
        params.businessPlaceDetail = tempArr.pop()
        params.businessPlace = tempArr
      }
      if (params.registeredAddress) {
        tempArr = params.registeredAddress.split(',')
        params.registeredAddressDetail = tempArr.pop()
        params.registeredAddress = tempArr
      }
      this.$nextTick(() => {
        this.formApi.setValue(params)
      })
    },
    // 保存
    handleSaveClick() {
      this.formApi.validate(valid => {
        if (valid) {
          const params = this.formApi.formData()
          params.address = params.address.join(',') + ',' + params.addressDetail
          params.businessPlace = params.businessPlace.join(',') + ',' + params.businessPlaceDetail
          params.registeredAddress = params.registeredAddress.join(',') + ',' + params.registeredAddressDetail

          delete params.addressDetail
          delete params.businessPlaceDetail
          delete params.registeredAddressDetail

          if (isEmptyObj(this.formData)) {
            accountingBodyAdd(params, { showLoading: true }).then(res => {
              this.$showToast('新增成功！', 'success')
              this.$emit('dialog-confirm', 'accounting')
              this.dialogShow = false
            }).catch(err => {
              console.log(err)
            })
          } else {
            accountingBodyUpdate({
              ...params,
              id: this.formData.id
            }, { showLoading: true }).then(res => {
              this.$showToast('修改成功！', 'success')
              this.$emit('dialog-confirm', 'accounting')
              this.dialogShow = false
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
<style lang='scss' scoped>
div /deep/ .el-dialog {
  .el-cascader {
    width: 100%;
  }

  .el-row >  {
    .el-col:nth-child(1), .el-col:nth-child(5), .el-col:nth-child(10) {
      &:before {
        display: block;
        margin-bottom: 10px;
        padding-left: 15px;
        font-size: 15px;
        font-weight: 600;
        content: '基本信息';
      }
    }

    .el-col:nth-child(5) {
      &:before {
        content: '联系方式';
      }
    }

    .el-col:nth-child(10) {
      &:before {
        content: '开票信息';
      }
    }
  }
}

</style>
