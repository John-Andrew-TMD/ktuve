<template>
  <el-dialog
    :modal-append-to-body="false"
    title="新增黑名单"
    width="800px"
    :visible.sync="dialogVisible"
    @closed="handleDialogClosed"
  >
    <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { queryDictItems } from 'utils'
import { blacklistAdd } from 'api/customer-module/api-customer-blacklist-mng.js'
import { customerList } from 'api/customer-module/api-customer-mng.js'

export default {
  inject: ['refreshTable'],
  data() {
    return {
      dialogVisible: false,
      formApi: null,
      formRules: [
        {
          type: 'el-custom-autocomplete',
          title: '客户名称',
          field: 'custName',
          props: {
            params: {
              url: customerList,
              data: {},
              searchKey: 'custName',
              labelKey: 'custName',
              valueKey: 'custName',
              repeat: false
            }
          },
          style: { width: '245px' },
          col: {
            span: 12
          },
          on: {
            select: this.handleCustSelectChange,
            clear: this.handleCustClear,
            input: this.handleCustInput
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'select',
          title: '客户类别',
          field: 'custCategory',
          style: { width: '245px' },
          col: {
            span: 12
          },
          value: '1',
          options: queryDictItems('10008'),
          validate: this.formValidate({ required: true, trigger: 'change' }),
          control: [
            {
              value: '1',
              rule: [
                {
                  type: 'input',
                  title: '统一社会信用代码',
                  field: 'idCode',
                  style: { width: '245px' },
                  validate: this.formValidate({ required: true, type: 'creditCode' })
                }
              ]
            },
            {
              value: '2',
              rule: [
                {
                  type: 'select',
                  title: '证件类型',
                  field: 'idType',
                  style: { width: '245px' },
                  options: queryDictItems('10009'),
                  col: {
                    span: 12
                  },
                  on: {
                    change: this.handleIdTypeChange
                  },
                  validate: this.formValidate({ required: true })
                },
                {
                  type: 'input',
                  title: '证件号码',
                  field: 'idCode',
                  style: { width: '245px' },
                  col: {
                    span: 12
                  },
                  validate: this.formValidate({ required: true })
                }
              ]
            }
          ]
        },
        {
          type: 'input',
          title: '客户编号',
          field: 'custNo',
          style: { width: '245px' },
          props: {
            disabled: true
          },
          col: {
            span: 12
          }
        },
        {
          type: 'select',
          title: '名单类型',
          field: 'listType',
          style: { width: '245px' },
          col: {
            span: 12
          },
          options: queryDictItems('10015'),
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '发布机构',
          field: 'issuedBy',
          style: { width: '245px' },
          col: {
            span: 12
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'industry-cascade',
          title: '行业类别',
          field: 'industry',
          col: {
            span: 12
          },
          style: { width: '245px' }
        },
        {
          type: 'input',
          title: '备注',
          field: 'remarks',
          col: {
            span: 24
          },
          props: {
            type: 'textarea'
          }
        }
      ],
      formOptions: {
        form: { labelWidth: '135px' },
        submitBtn: { show: false }
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.formApi.setValue('custNo', '--')
    })
  },
  mounted() {
    this.dialogVisible = true
  },
  methods: {
    handleDialogConfirm() {
      this.formApi.validate(async valid => {
        if (valid) {
          const params = this.formApi.formData()
          if (params.industry) {
            params.industry = params.industry.join(',')
          }
          if (params.custCategory == '1'){
            params.idType = '4'
          }
          blacklistAdd(params, { showLoading: true }).then(res => {
            this.$showToast('新增成功！', 'success')
            this.dialogVisible = false
            this.refreshTable()
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    handleCustSelectChange(val) {
      const data = val.data
      if (data) {
        this.formApi.setValue({
          custCategory: data.custCategory
        })
        this.formApi.disabled(true, ['custCategory', 'idCode', 'idType', 'industry'])
        if (data.industry) {
          data.industry = data.industry.split(',')
        }
        setTimeout(() => {
          this.formApi.setValue({
            idCode: data.idCode,
            idType: data.idType,
            custNo: data.custNo || '-',
            industry: data.industry
          })
          this.handleIdTypeChange(data.idType)
        }, 100)
      }
    },
    handleCustClear() {
      this.formApi.setValue({
        custCategory: '1',
        idCode: '',
        idType: '',
        custNo: '--',
        industry: ''
      })
      this.formApi.disabled(false, ['custCategory', 'idCode', 'idType', 'industry'])
      this.$nextTick(() => {
        this.formApi.clearValidateState()
      })
    },
    handleCustInput(){
      this.formApi.setValue({
        idCode: '',
        idType: '',
        custNo: '--',
        industry: ''
      })
      this.formApi.disabled(false, ['custCategory', 'idCode', 'idType', 'industry'])
      this.$nextTick(() => {
        this.formApi.clearValidateState()
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    },
    handleIdTypeChange(val) {
      const validateType = ['idCard', 'taiWanIdCard', 'gangAoIdCard'][val] || ''
      this.formApi.updateRule('idCode', {
        validate: this.formValidate({ required: true, type: validateType })
      }, true)
    }
  }
}
</script>
