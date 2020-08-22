<template>
  <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
</template>
<script>
import { queryDictItems, isEmptyObj } from 'utils'
import { getGroupCustList } from 'api/customer-module/api-customer-mng.js'
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formApi: null,
      formRules: [
        {
          type: 'el-custom-select',
          title: '集团名称',
          field: 'blocName',
          col: { span: 12 },
          props: {
            params: {
              url: getGroupCustList,
              data: {},
              searchKey: 'custName',
              labelKey: 'custName',
              valueKey: 'custName',
              repeat: false
            },
            clearable: 'true',
            filterable: 'true'
          },
          on: {
            change: this.handleBlocNameChange
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '客户编号',
          field: 'custNo',
          props: {
            disabled: true
          },
          col: { span: 12 }
        },
        {
          type: 'input',
          title: '统一社会信用代码',
          field: 'idCode',
          props: {
            disabled: true
          },
          col: { span: 12 }
        },
        {
          type: 'select',
          title: '客户状态',
          field: 'blacklistState',
          options: queryDictItems('10005'),
          props: {
            disabled: true
          },
          col: { span: 12 }
        },
        {
          type: 'industry-cascade',
          field: 'industry',
          title: '行业类别',
          props: {
            disabled: 'true'
          },
          col: { span: 24 }
        },
        {
          type: 'input',
          field: 'majorBusiness',
          title: '主营业务',
          props: {
            type: 'textarea',
            disabled: true
          }
        },
        {
          type: 'input',
          title: '授信总额',
          field: 'creditPosition',
          props: {
            disabled: true
          },
          col: { span: 12 }
        },
        {
          type: 'input',
          title: '授信余额',
          field: 'creditBalance',
          props: {
            disabled: true
          },
          col: { span: 12 }
        },
        {
          type: 'input',
          title: '业务经理',
          field: 'businessManage',
          props: {
            disabled: true
          },
          col: { span: 12 }
        },
        {
          type: 'input',
          title: '联系电话',
          field: 'contactNumber',
          props: {
            disabled: true
          },
          col: { span: 12 }
        }
      ],
      formOptions: {
        form: { labelWidth: '140px' },
        submitBtn: { show: false }
      }
    }
  },
  created() {
    this.initUI()
  },
  methods: {
    initUI() {
      if (!isEmptyObj(this.formData)) {
        this.formRules[0].props.params.data.custId = this.formData.custId
      }
      this.$nextTick(() => {
        this.setFormData()
      })
    },
    setFormData() {
      this.formApi.updateOptions({
        form: { disabled: this.disabled }
      })
      this.formApi.setValue('blocName', this.formData.blocName)
      this.handleBlocNameChange({
        data: this.formData
      })
    },
    handleBlocNameChange(obj) {
      if (isEmptyObj(obj.data)) {
        return this.formApi.resetFields()
      }
      let { id, custNo, idCode, blacklistState, industry, majorBusiness, creditPosition, creditBalance, businessManage, contactNumber } = obj.data
      if (blacklistState === '0' && !this.disabled) {
        this.$showToast('该客户为黑名单客户，不可创建集团！', 'warning')
        this.$nextTick(() => {
          this.formApi.resetFields()
        })
        return
      }
      this.custId = id
      if (industry) {
        industry = industry.split(',')
      }
      this.formApi.setValue({
        custNo,
        idCode,
        blacklistState,
        industry,
        majorBusiness,
        creditPosition,
        creditBalance,
        businessManage,
        contactNumber
      })
    },
    validateForm() {
      return new Promise((resolve, reject) => {
        this.formApi.validate(valid => {
          if (valid) {
            resolve(this.custId)
          } else {
            resolve(null)
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.form-create /deep/  {
  .el-cascader, .el-autocomplete, .el-select {
    width: 100%;
  }
}

</style>
