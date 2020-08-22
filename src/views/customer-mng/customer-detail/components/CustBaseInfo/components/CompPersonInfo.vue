<template>
  <form-create v-model="formApi" :rule="rules" :option="options" />
</template>

<script>
import { queryDictItems } from 'utils'
import { custNatureList } from 'api/run-module/customer-type-setting.js'
export default {
  props: {},
  data() {
    return {
      formApi: null,
      rules: [
        {
          type: 'input',
          title: '客户名称',
          field: 'custName',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '客户编号',
          field: 'custNo',
          col: { span: 12 },
          props: { disabled: true },
          validate: [{ required: true, trigger: 'blur' }]
        },
        {
          type: 'select',
          title: '客户类别',
          field: 'custCategory',
          col: { span: 12 },
          props: { disabled: true },
          options: queryDictItems('10008')
        },
        {
          type: 'el-custom-select',
          title: '客户性质',
          field: 'custAttribute',
          value: [],
          props: {
            params: {
              url: custNatureList,
              data: {
                dto: { custCategory: '2' },
                pageCurrent: 1,
                pageSize: 10000
              },
              labelKey: 'custNature',
              valueKey: 'id'
            },
            multiple: 'true',
            clearable: 'true'
          },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'industry-cascade',
          field: 'industry',
          title: '行业类别',
          col: { span: 24 }
        },
        {
          type: 'radio',
          field: 'gender',
          title: '性别',
          options: queryDictItems('10010'),
          validate: this.formValidate({ required: true }),
          col: { span: 12 }
        },
        {
          type: 'select',
          field: 'maritalStatus',
          title: '婚姻状况',
          options: queryDictItems('10011'),
          col: { span: 12 }
        },
        {
          type: 'el-col',
          native: true,
          col: { span: 24 },
          children: [
            {
              type: 'select',
              title: '证件名称及号码',
              field: 'idType',
              options: queryDictItems('10009'),
              validate: this.formValidate({ required: true }),
              props: {
                disabled: true
              },
              col: { span: 12 }
            },
            {
              type: 'input',
              field: 'idCode',
              props: {
                disabled: true
              },
              col: { span: 12 }
            }
          ]
        },
        {
          type: 'el-date-picker',
          field: 'birthday',
          title: '生日',
          col: { span: 12 },
          props: { valueFormat: 'timestamp' }
        },
        {
          type: 'input',
          field: 'contactNumber',
          title: '联系电话',
          // validate: this.formValidate({ type: 'mobile' }),
          col: { span: 12 }
        },
        {
          type: 'input',
          field: 'email',
          title: '邮箱',
          col: { span: 12 },
          validate: this.formValidate({ type: 'email' })
        },
        {
          type: 'input',
          field: 'zipCode',
          title: '邮编',
          col: { span: 12 }
        },
        {
          type: 'number-input',
          field: 'personalAnnualIncome',
          title: '个人年收入',
          col: { span: 12 },
          props: {
            maxDecimal: 4,
            minDecimal: 4
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['万元']
            }
          ]
        },
        {
          type: 'number-input',
          field: 'annualHouseholdIncome',
          title: '家庭年收入',
          col: { span: 12 },
          props: {
            maxDecimal: 4,
            minDecimal: 4
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['万元']
            }
          ]
        },
        {
          type: 'input',
          field: 'employer',
          title: '工作单位',
          col: { span: 12 }
        },
        {
          type: 'input',
          field: 'position',
          title: '职务',
          col: { span: 12 }
        },
        {
          type: 'input',
          field: 'officeTel',
          title: '单位电话',
          col: { span: 12 }
        },
        {
          type: 'input',
          field: 'graduateCollege',
          title: '毕业院校',
          col: { span: 12 }
        },
        {
          type: 'input',
          field: 'graduateYear',
          title: '毕业年份',
          col: { span: 12 }
        },
        {
          type: 'input',
          field: 'hobbies',
          title: '兴趣爱好',
          col: { span: 12 }
        },
        {
          type: 'el-col',
          native: true,
          col: { span: 24 },
          children: [
            {
              type: 'china-region-cascade',
              field: 'registerAddress',
              title: '身份证地址',
              props: { separator: '-' },
              col: { span: 12 }
            },
            {
              type: 'input',
              field: 'registerAddressDetail',
              col: { span: 12 }
            }
          ]
        },
        {
          type: 'el-col',
          native: true,
          col: { span: 24 },
          children: [
            {
              type: 'china-region-cascade',
              field: 'homeAddress',
              title: '联系住址',
              props: { separator: '-' },
              col: { span: 12 }
            },
            {
              type: 'input',
              field: 'homeAddressDetail',
              col: { span: 12 }
            }
          ]
        },
        {
          type: 'input',
          field: 'businessScope',
          title: '经营范围',
          props: { type: 'textarea', maxlength: 500 }
        },
        {
          type: 'input',
          field: 'majorBusiness',
          title: '主营业务',
          props: { type: 'textarea', maxlength: 500 }
        },
        {
          type: 'input',
          field: 'creditInformation',
          title: '资信情况',
          props: { type: 'textarea', maxlength: 500 }
        },
        {
          type: 'input',
          field: 'litigation',
          title: '诉讼情况',
          props: { type: 'textarea', maxlength: 500 }
        },
        {
          type: 'input',
          field: 'remarks',
          title: '备注',
          props: { type: 'textarea', maxlength: 500 }
        }
      ],
      options: {
        form: { labelWidth: '200px', disabled: true },
        submitBtn: { show: false }
      }
    }
  },
  mounted() {
    this.$emit('on-ready')
  }
}
</script>

<style lang='scss'>
</style>
