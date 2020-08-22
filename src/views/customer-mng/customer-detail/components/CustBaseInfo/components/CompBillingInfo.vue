<template>
  <div class="content">
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">开票信息</span>
        <div class="panel-tools">
          <el-button v-show="!canEdit" :disabled="globalCanEdit" type="primary" @click="handleBillEdit">修改</el-button>
          <el-button v-show="canEdit" @click="handleBillCancel">取消</el-button>
          <el-button v-show="canEdit" type="primary" @click="handleBillSave">保存</el-button>
        </div>
      </div>
    </div>
    <div class="content-body">
      <form-create v-model="formApi" :rule="rules" :option="options" />
    </div>
  </div>
</template>

<script>
import { queryDictItems } from 'utils'
import { getBillInfoById, billInfoUpdate, getBillBankList } from 'api/customer-module/api-customer-detail.js'
export default {
  components: {},
  props: {
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formApi: null,
      rules: [
        {
          type: 'hidden',
          title: '客户ID',
          field: 'custId',
          value: this.routeParams.id
        },
        { type: 'hidden', title: '开票信息ID', field: 'id' },
        {
          type: 'el-col',
          col: { span: 24 },
          native: true,
          children: [
            {
              type: 'input',
              field: 'custName',
              id: 'ticket_cust_name',
              title: this.routeParams.custCategory == 1 ? '单位名称' : '客户名称',
              col: { span: 12 },
              validate: this.formValidate({ required: true })
            },
            {
              type: 'radio',
              field: 'isTaxPeople',
              title: '是否一般纳税人',
              options: queryDictItems('10004'),
              col: { span: 12 },
              validate: this.formValidate({ required: true })
            }
          ]
        },
        {
          type: 'input',
          field: 'taxNo',
          title: '纳税人识别号',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          field: 'phoneNumber',
          title: '联系电话',
          col: { span: 12 },
          validate: this.formValidate({ required: this.routeParams.custCategory == 1 })
        },
        {
          type: 'el-custom-autocomplete',
          field: 'depositBank',
          title: '开户行',
          props: {
            params: {
              url: getBillBankList,
              data: {
                custId: this.routeParams.id
              },
              searchKey: 'depositBank',
              labelKey: 'depositBank',
              valueKey: 'depositBank'
            }
          },
          col: { span: 12 },
          style: { width: '100%' },
          validate: this.formValidate({ required: this.routeParams.custCategory == 1 }),
          on: {
            select: ({ data = {}}) => {
              this.formApi.setValue('bankAccount', data.bankAccount || '')
            }
          }
        },
        {
          type: 'el-custom-autocomplete',
          field: 'bankAccount',
          title: '银行账号',
          props: {
            params: {
              url: getBillBankList,
              data: {
                custId: this.routeParams.id
              },
              searchKey: 'bankAccount',
              labelKey: 'bankAccount',
              valueKey: 'bankAccount',
              repeat: true
            }
            // fetchSuggestions: this.queryBankAccount
          },
          col: { span: 12 },
          style: { width: '100%' },
          validate: this.formValidate({ required: this.routeParams.custCategory == 1 })
        },
        {
          type: 'el-col',
          native: true,
          col: { span: 24 },
          children: [
            {
              type: 'china-region-cascade',
              field: 'registerAddress',
              title: this.routeParams.custCategory == 1 ? '住所（注册地址）' : '身份证住址',
              props: { separator: '-' },
              col: { span: 12 },
              validate: this.formValidate({ required: this.routeParams.custCategory == 1 })
            },
            {
              type: 'input',
              field: 'registerAddressDetail',
              col: { span: 12 },
              validate: this.formValidate({ required: this.routeParams.custCategory == 1 })
            }
          ]
        }
      ],
      options: {
        form: { labelWidth: '200px', disabled: true },
        submitBtn: { show: false }
      },
      canEdit: false,
      bankData: [],
      originFormData: {}
    }
  },
  computed: {
    globalCanEdit() {
      return !this.routeParams.globalCanEdit
    }
  },
  created() {
    this.iniData()
  },
  mounted() {
    if (this.routeParams.action === 'add') {
      this.canEdit = true
      this.formApi.updateOptions({
        form: { disabled: false }
      })
    }
    // if (this.routeParams.custCategory === '1') {
    //   this.formApi.removeField('isTaxPeople')
    // }
  },
  methods: {
    async iniData() {
      // 获取开票信息
      getBillInfoById({ custId: this.routeParams.id })
        .then(res => {
          if (res && res.data.newCrm) {
            const data = res.data.newCrm
            // 注册/身份证地址
            if (data.registerAddress) {
              const regArray = data.registerAddress.split(',')
              data.registerAddress = regArray.slice(0, 3)
              data.registerAddressDetail = regArray.pop()
            }
            data.isTaxPeople = data.isTaxPeople + ''
            this.originFormData = data
            this.$nextTick(() => {
              this.formApi.setValue(data)
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // queryBankAccount(keyword, cb) {
    //   getBillBank({
    //     dto: {
    //       custId: this.routeParams.id
    //     },
    //     pageSize: 1000,
    //     pageCurrent: 1
    //   })
    //     .then(ret => {
    //       const records = ret.data.records
    //       if (records.length) {
    //         const data = this.removeRepeatData(records, 'bankAccount')
    //         const filterData = data.filter(item => !!keyword ? item.value.includes(keyword) : true)
    //         cb(filterData)
    //       } else {
    //         cb([])
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // },
    // queryDepositBank(keyword, cb) {
    //   getBillBank({
    //     dto: {
    //       custId: this.routeParams.id
    //     },
    //     pageSize: 1000,
    //     pageCurrent: 1
    //   }).then(ret => {
    //     const records = ret.data.records
    //     if (records.length) {
    //       const data = this.removeRepeatData(records, 'depositBank')
    //       const filterData = data.filter(item => !!keyword ? item.value.includes(keyword) : true)
    //       cb(filterData)
    //     } else {
    //       cb([])
    //     }
    //   })
    // },
    // 数据去重
    // removeRepeatData(data, field) {
    //   const obj = {}
    //   return data.reduce((cur, next) => {
    //     obj[next[field]]
    //       ? ''
    //       : (obj[next[field]] =
    //           true &&
    //           cur.push({
    //             label: next[field],
    //             value: next[field],
    //             bankAccount: next.bankAccount
    //           }))
    //     return cur
    //   }, [])
    // },
    handleBillEdit() {
      this.canEdit = true
      this.formApi.updateOptions({
        form: { disabled: false }
      })
    },
    handleBillSave() {
      this.formApi.validate(async valid => {
        if (!valid) return
        const data = this.formApi.formData()
        // 注册/身份证地址
        if (!data.registerAddress) {
          data.registerAddress = new Array(3).fill('')
        }
        const detail = data.registerAddressDetail || ''
        data.registerAddress = data.registerAddress.join(',') + ',' + detail
        delete data.registerAddressDetail
        billInfoUpdate(data, { showLoading: true })
          .then(() => {
            this.$showToast('保存成功', 'success')
            this.canEdit = false
            this.formApi.updateOptions({
              form: { disabled: true }
            })
            this.originFormData = this.formApi.formData()
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    handleBillCancel() {
      this.canEdit = false
      this.formApi.updateOptions({
        form: { disabled: true }
      })
      this.formApi.resetFields()
      this.formApi.setValue(this.originFormData)
    }
  }
}
</script>

<style lang='scss'>
</style>
