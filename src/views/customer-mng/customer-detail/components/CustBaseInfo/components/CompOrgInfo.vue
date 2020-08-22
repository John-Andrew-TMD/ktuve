<template>
  <form-create v-model="formApi" :rule="rules" :option="options" />
</template>
<script>
import { queryDictItems } from 'utils'
import EnterpriseTypeCascade from 'components/EnterpriseTypeCascade'
import ElCheckbox from 'components/ElCheckbox'
import enterpriseScaleConfig from './enterpriseScaleConfig.js'
// import { getDepartmentUser } from 'api/customer-module/api-customer-mng.js'
import { custNatureList } from 'api/run-module/customer-type-setting.js'
Vue.component('enterprise-type-cascade', EnterpriseTypeCascade)
Vue.component('el-custom-checkbox', ElCheckbox)
export default {
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
          props: { disabled: true }
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
          type: 'el-custom-checkbox',
          title: '客户性质',
          field: 'custAttribute',
          value: [],
          props: {
            params: {
              url: custNatureList,
              data: {
                dto: {
                  custCategory: '1',
                  display: '1,2'
                },
                pageCurrent: 1,
                pageSize: 10000
              },
              labelKey: 'custNature',
              valueKey: 'id'
            }
          },
          col: { span: 24 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'select',
          title: '客户层级',
          field: 'custLevel',
          col: { span: 12 },
          options: queryDictItems('10055'),
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '业务协办经理',
          field: 'businessCooperation',
          col: { span: 12 },
          props: {
            // params: {
            //   url: getDepartmentUser,
            //   data: {},
            //   labelKey: 'employeeName',
            //   valueKey: 'userId'
            // },
            disabled: true
            // clearable: 'true'
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          field: 'idCode',
          title: '统一社会信用代码',
          col: { span: 12 },
          props: {
            disabled: true
          }
        },
        {
          type: 'radio',
          title: '是否为上市公司',
          field: 'relatedCompany',
          col: { span: 12 },
          validate: this.formValidate({ required: true }),
          options: queryDictItems('10004')
        },
        {
          type: 'el-col',
          col: { span: 24 },
          native: true,
          children: [
            {
              type: 'radio',
              title: '是否集团客户',
              field: 'isGroupCustomer',
              col: { span: 12 },
              options: queryDictItems('10004'),
              props: {
                disabled: true
              },
              control: [
                {
                  value: '1',
                  rule: [
                    {
                      type: 'input',
                      field: 'groupCustomeName',
                      title: '集团名称',
                      props: {
                        disabled: true
                      },
                      col: { span: 12 },
                      validate: this.formValidate({ required: true })
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'radio',
          title: '是否上市及其公司关联方',
          field: 'partyCompany',
          col: { span: 12 },
          options: queryDictItems('10004'),
          validate: this.formValidate({ required: true })
        },
        {
          type: 'radio',
          title: '是否我公司股东及其关联方',
          field: 'shareholderCompany',
          col: { span: 12 },
          options: queryDictItems('10004'),
          validate: this.formValidate({ required: true })
        },
        {
          type: 'number-input',
          title: '营业收入',
          field: 'businessIncome',
          tipContent: '',
          col: { span: 12 },
          props: {
            'max-decimal': 4
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['万元']
            }
          ],
          on: {
            change: this.calclateEnterpriseScale
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'number-input',
          title: '资产总额',
          field: 'totalAssets',
          tipContent: '',
          props: {
            'max-decimal': 4
          },
          col: { span: 12 },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['万元']
            }
          ],
          on: {
            change: this.calclateEnterpriseScale
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'number-input',
          title: '从业人员',
          field: 'employeesNumber',
          col: { span: 12 },
          props: {
            'max-decimal': 0
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['人']
            }
          ],
          on: {
            change: this.calclateEnterpriseScale
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          field: 'enterpriseScale',
          title: '企业规模',
          props: { disabled: true },
          // validate: this.formValidate({ required: true }),
          col: { span: 12 }
        },
        {
          type: 'industry-cascade',
          field: 'industry',
          title: '行业类别',
          validate: this.formValidate({ required: true }),
          col: { span: 24 },
          on: {
            change: this.calclateEnterpriseScale
          }
        },
        // {
        //   type: 'industry-cascade',
        //   field: 'industry_first1', // TODO
        //   title: '贷款行业投向',
        //   validate: this.formValidate({ required: true }),
        //   col: { span: 24 }
        // },
        {
          type: 'enterprise-type-cascade',
          field: 'enterpriseType',
          title: '企业类型',
          validate: this.formValidate({ required: true }),
          col: { span: 12 }
        },
        {
          type: 'select',
          field: 'enterpriseNature',
          title: '企业性质',
          options: queryDictItems('10006'),
          validate: this.formValidate({ required: true }),
          col: { span: 12 }
        },
        {
          type: 'el-date-picker',
          field: 'fundingTime',
          title: '成立时间',
          validate: this.formValidate({ required: true }),
          col: { span: 12 },
          props: { valueFormat: 'timestamp' }
        },
        {
          type: 'number-input',
          field: 'registeredCapital',
          title: '注册资本',
          validate: this.formValidate({ required: true }),
          props: {
            'max-decimal': 4
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['万元']
            }
          ],
          col: { span: 12 }
        },
        {
          type: 'input',
          field: 'legalPerson',
          title: '法人代表',
          validate: this.formValidate({ required: true }),
          col: { span: 12 }
        },
        {
          type: 'number-input',
          field: 'capitalPaid',
          title: '实收资本',
          validate: this.formValidate({ required: true }),
          props: {
            'max-decimal': 4
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['万元']
            }
          ],
          col: { span: 12 }
        },
        {
          type: 'input',
          field: 'businessTerm',
          title: '营业期限',
          validate: this.formValidate({ required: true }),
          col: { span: 12 }
        },
        {
          type: 'input',
          field: 'actualController',
          title: '实际控制人',
          validate: this.formValidate({ required: true }),
          col: { span: 12 }
        },
        {
          type: 'input',
          field: 'contactPeople',
          title: '联系人',
          validate: this.formValidate({ required: true }),
          col: { span: 12 }
        },
        {
          type: 'input',
          field: 'website',
          title: '网址',
          col: { span: 12 }
        },
        {
          type: 'input',
          field: 'contactNumber',
          validate: this.formValidate({ required: true }),
          title: '联系电话',
          col: { span: 12 }
        },
        {
          type: 'input',
          field: 'email',
          title: '邮箱',
          col: { span: 12 }
        },
        {
          type: 'input',
          field: 'zipCode',
          title: '邮编',
          col: { span: 12 }
        },
        {
          type: 'input',
          field: 'fax',
          title: '传真',
          col: { span: 12 }
        },
        {
          type: 'el-col',
          native: true,
          col: { span: 24 },
          children: [
            {
              type: 'radio',
              title: '是否绿色贷款',
              field: 'greenLoan',
              col: { span: 12 },
              options: queryDictItems('10004'),
              control: [
                {
                  value: '1',
                  rule: [
                    {
                      type: 'green-loans-cascade',
                      title: '绿色贷款用途',
                      field: 'greenPurpose',
                      col: { span: 12 },
                      validate: this.formValidate({ required: true })
                    }
                  ]
                }
              ],
              validate: this.formValidate({ required: true })
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
              field: 'registerAddress',
              title: '注册地址',
              validate: this.formValidate({ required: true }),
              props: { separator: '-' },
              col: { span: 12 }
            },
            {
              type: 'input',
              field: 'registerAddressDetail',
              validate: this.formValidate({ required: true }),
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
              field: 'officeAddress',
              title: '办公地址',
              props: { separator: '-' },
              col: { span: 12 }
            },
            {
              type: 'input',
              field: 'officeAddressDetail',
              col: { span: 12 }
            }
          ]
        },
        {
          type: 'input',
          field: 'businessScope',
          title: '经营范围',
          props: { type: 'textarea', maxlength: 500 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          field: 'majorBusiness',
          title: '主营业务',
          props: { type: 'textarea', maxlength: 500 },
          validate: this.formValidate({ required: true })
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
          field: 'issueBonds',
          title: '发行债券',
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
  },
  methods: {
    calclateEnterpriseScale() {
      const { industry = [], employeesNumber = 0, totalAssets = 0, businessIncome = 0 } = this.formApi.formData()
      if (!industry || !industry.length) return
      let myIndustry = []
      myIndustry = enterpriseScaleConfig.filter(item => { // 根据行业类型筛选
        let isDetele = false
        isDetele = !!this.isIncloud(industry, item.industry)
        return isDetele
      })
      myIndustry = myIndustry.length === 1 ? myIndustry : [enterpriseScaleConfig[enterpriseScaleConfig.length - 1]]// 未匹配到归为其他未列明行业
      const element = myIndustry[0]
      const businessSize = this.getKey(element, employeesNumber, totalAssets, businessIncome)
      this.formApi.setValue('enterpriseScale', {
        large: '大型',
        medium: '中型',
        small: '小型'
      }[businessSize] || '微型')
    },
    getKey(element, employeesNumber, totalAssets, businessIncome) { // 获取key
      const arr = Object.keys(element.size); let key
      for (let index = 0; index < arr.length; index++) {
        if (this.commonRule(element.size[arr[index]], { staff: employeesNumber, assets: totalAssets, revenue: businessIncome })) {
          key = arr[index]
          break
        }
      }
      return key
    },
    commonRule(item, data) { // 匹配规则
      const isTrue = []; const keys = Object.keys(data)
      for (const key of keys) {
        if (item[key]) {
          isTrue.push(data[key] >= item[key][0])
        }
      }
      return isTrue.every(item => item)
    },
    isIncloud(arrA, arrB) {
      return arrA.some(item => arrB.includes(item))
    }
  }
}
</script>
<style lang='scss' scoped>
  .form-create /deep/  {
    .el-input, .el-cascader {
      vertical-align: top;
    }
    // .changed {
    //   .el-textarea__inner, .el-input__inner, .is-checked .el-radio__label, .is-checked .el-checkbox__label {
    //     color: #f00
    //   }
    // }
    // .deleted {
    //   .el-textarea__inner, .el-input__inner, .is-checked .el-radio__label, .is-checked .el-checkbox__label {
    //     color: #f00;
    //     text-decoration: line-through;
    //   }
    // }
  }

</style>
