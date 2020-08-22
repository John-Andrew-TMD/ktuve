<template>
  <form-create v-model="formApi" :rule="rules" :option="options" />
</template>
<script>
import { getDepartmentUser, getAllDepartmentUser } from 'api/customer-module/api-customer-mng.js'
import { queryDictItems, isEmptyObj } from 'utils'
import { requestPost } from 'utils/fetch.js'
export default {
  data() {
    return {
      formApi: null,
      rules: [{
          type: 'input',
          title: '已选择0个客户',
          field: 'custIds',
          props: {
            type: 'textarea',
            disabled: true
          }
        },
        {
          type: 'select',
          title: '移交类型',
          field: 'handOverType',
          style: { width: '100%' },
          options: queryDictItems('10012'),
          validate: this.formValidate({ required: true }),
          on: {
            change: this.handleHandoverTypeChange
          }
        },
        {
          type: 'select',
          field: 'hostRecipient',
          style: { width: '100%' },
          title: '请选择主办接受人',
          options: []
        },
        {
          type: 'select',
          field: 'coRecipient',
          style: { width: '100%' },
          title: '请选择协办接受人',
          options: []
        },
        {
          type: 'input',
          title: '移交原因',
          field: 'handOverReason',
          style: { width: '100%' },
          props: {
            type: 'textarea'
          },
          validate: this.formValidate({ required: true })
        }
      ],
      options: {
        form: { labelWidth: '140px' },
        submitBtn: { show: false }
      },
      userList: []
    }
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    custName() {
      if (this.userList.length) {
        const nameArr = this.userList.map(item => item.custName)
        return nameArr.join('，')
      }
      return ''
    },
    custNum() {
      return this.userList.length
    }
  },
  mounted() {
    this.initUI()
  },
  methods: {
    initUI() {
      if (this.selectedRows.length) {
        this.userList = this.selectedRows
      }
      if (!isEmptyObj(this.formData)) {
        this.userList = this.formData.custList
        this.handleHandoverTypeChange(this.formData.handOverType)
        this.formApi.setValue(this.formData)
        this.formApi.disabled(true, 'handOverType')
      }
      this.$nextTick(() => {
        this.formApi.setValue('custIds', this.custName)
        this.formApi.updateRule('custIds', {
          title: `已选择${this.custNum}个客户`
        })
        this.formApi.clearValidateState()
      })
      this.formApi.updateOptions({
        form: { disabled: this.disabled }
      })
    },
    handleHandoverTypeChange(val) {
      // 0 部门内 1 部门外
      this.formApi.setValue('hostRecipient', '')
      this.formApi.setValue('coRecipient', '')
      if (+val === 0) {
        this.getAccepters()
      } else {
        this.getAllAccepters()
      }
    },
    // 部门外人员列表
    getAllAccepters(sponsorIds, coSponsorsIds) {
      getAllDepartmentUser().then(res => {
        this.setUserOptions(res, ['hostRecipient', 'coRecipient'])
      })
    },
    // 部门内人员列表
    getAccepters(sponsorIds, coSponsorsIds) {
      requestPost(getDepartmentUser, {
        userIds: [this.formData.sysCreatorId || '']
      }).then(res => {
        this.setUserOptions(res, ['hostRecipient', 'coRecipient'])
      })
    },
    // 设置主/协办接收人下拉框选项
    setUserOptions(resData, fields) {
      if (resData.data && Array.isArray(resData.data.records)) {
        const options = resData.data.records.map(item => {
          return {
            value: item.userId,
            label: item.employeeName
          }
        })
        this.formApi.updateRule(fields[0], { options }, true)
        this.formApi.updateRule(fields[1], { options }, true)
      }
    },
    validateForm() {
      return new Promise((resolve, reject) => {
        if (this.custNum === 0) {
          this.$showToast('待移交的用户不能为空！')
          return resolve(null)
        }
        this.formApi.validate(valid => {
          if (valid) {
            const params = this.formApi.formData()
            params.custIds = this.userList.map(item => item.id)
            if (!params.hostRecipient && !params.coRecipient) {
              this.$showToast('主办接受人和协办接受人必须选择一个！')
              return resolve(null)
            }
            resolve(params)
          } else {
            resolve(null)
          }
        })
      })
    }
  }
}

</script>
