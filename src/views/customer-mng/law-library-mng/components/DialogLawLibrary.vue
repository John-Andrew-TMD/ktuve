<template>
  <el-dialog
    :title="dialogTitle"
    width="830px"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    @closed="handleDialogClosed"
  >
    <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    <h3 v-if="action=='Q'">关联项目</h3>
    <associated-projects v-if="action=='Q'" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button v-if="action!='Q'" type="primary" @click="handleDialogSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { queryDictItems } from 'utils'
import { lawLibraryAdd, lawLibraryUpdate } from 'api/customer-module/api-law-library-mng.js'
import { getcustomerList } from 'api/customer-module/api-customer-mng.js'
import AssociatedProjects from './AssociatedProjects'

export default {
  components: {
    AssociatedProjects
  },
  inject: ['refreshTable'],
  props: ['action', 'dialogTitle', 'rowData'],
  data() {
    return {
      dialogVisible: false,
      formApi: null,
      custList: [],
      formRules: [
        { type: 'hidden', title: '律师ID', field: 'id' },
        {
          type: 'input',
          title: '律师名称',
          field: 'lawyerName',
          style: { width: '255px' },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '律师执业证号',
          field: 'professionNo',
          style: { width: '255px' },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '电话',
          field: 'phoneNumber',
          style: { width: '255px' },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'select',
          title: '律所名称',
          field: 'organizationName',
          style: { width: '255px' },
          col: { span: 12 },
          options: [],
          props: {
            filterable: true,
            clearable: true,
            placeholder: '请选择律所'
          },
          on: {
            change: res => {
              this.handleSelectCust(res)
            },
            clear: res => {
              this.handleSelectCust(false)
            }
          },
          validate: this.formValidate({ required: true })
        },
        { type: 'hidden', title: '律所ID', field: 'organizationId' },
        {
          type: 'input',
          title: '律所执照',
          field: 'organizationLicence',
          style: { width: '255px' },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '律所执业证号',
          field: 'organizationProfessionNo',
          style: { width: '255px' },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '统一社会信用代码',
          field: 'creditCode',
          style: { width: '255px' },
          col: { span: 12 },
          validate: this.formValidate({ required: true, type: 'creditCode' })
        },
        {
          type: 'input',
          title: '法人代表',
          field: 'legalPerson',
          style: { width: '255px' },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '开户行',
          field: 'bankName',
          style: { width: '255px' },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '账户',
          field: 'bankAccount',
          style: { width: '255px' },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'el-col',
          native: true,
          col: { span: 24 },
          children: [
            {
              type: 'china-region-cascade',
              field: 'registeredAddress',
              title: '注册地址',
              props: { separator: '-' },
              style: { width: '255px' },
              col: { span: 12 },
              validate: this.formValidate({ required: true })
            },
            {
              type: 'input',
              field: 'registeredAddressDetail',
              col: { span: 12 },
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
              field: 'officeAddress',
              title: '办公地址',
              props: {
                separator: '-'
              },
              style: { width: '255px' },
              col: { span: 12 },
              validate: this.formValidate({ required: true })
            },
            {
              type: 'input',
              field: 'officeAddressDetail',
              col: { span: 12 },
              validate: this.formValidate({ required: true })
            }
          ]
        }
      ],
      formOptions: {
        form: { labelWidth: '140px' },
        submitBtn: { show: false }
      }
    }
  },
  created() {
    this.displayPage()
  },
  mounted() {
    this.dialogVisible = true
  },
  methods: {
    displayPage() {
      this.$nextTick(() => {
        this.formApi.updateOptions({
          form: { disabled: this.action == 'Q' }
        })
        if (this.action != 'A') {
          const newData = { ...this.rowData } || {}
          if (newData.registeredAddress) {
            const regArray = newData.registeredAddress.split(',')
            newData.registeredAddress = regArray.slice(0, 3)
            newData.registeredAddressDetail = regArray.pop()
          }
          if (newData.officeAddress) {
            const regArray = newData.officeAddress.split(',')
            newData.officeAddress = regArray.slice(0, 3)
            newData.officeAddressDetail = regArray.pop()
          }
          this.formApi.setValue(newData)
        }
      })
      this.queryCustList()
    },
    queryCustList() {
      let data = {
        queryFlag: '1',
        custCateGory: "1",
        custAttribute: '1263633177564839938'
      }
      getcustomerList(data, { showLoading: true }).then(res => {
        let temp = res.data.records
        temp.forEach(item => {
          this.custList.push({
            value: item.custName,
            label: item.custName,
            data: item
          })
        })
        this.formApi.updateRule('organizationName', {
          options: this.custList
        },true)
      }).catch(err => {
        console.log(err)
      })
    },
    // 确定
    handleDialogSubmit() {
      this.formApi.validate(valid => {
        if (valid) {
          const data = this.formApi.formData()
          if (!data.registeredAddress) {
            data.registeredAddress = new Array(3).fill('')
          }
          const registeredAddressDetail = data.registeredAddressDetail || ''
          data.registeredAddress = data.registeredAddress.join(',') + ',' + registeredAddressDetail
          delete data.registeredAddressDetail
          if (!data.officeAddress) {
            data.officeAddress = new Array(3).fill('')
          }
          const officeAddressDetail = data.officeAddressDetail || ''
          data.officeAddress = data.officeAddress.join(',') + ',' + officeAddressDetail
          delete data.officeAddressDetail
          if (this.action == 'U') {
            lawLibraryUpdate(data, { showLoading: true }).then(res => {
              this.$showToast('修改成功！', 'success')
              this.dialogVisible = false
              this.refreshTable()
            }).catch(err => {
              console.log(err)
            })
          } else {
            data.id = ''
            lawLibraryAdd(data, { showLoading: true }).then(res => {
              this.$showToast('新增成功！', 'success')
              this.dialogVisible = false
              this.refreshTable()
            }).catch(err => {
              console.log(err)
            })
          }
        }
      })
    },
    handleSelectCust(val) {
      if (val != '') {
        let selectItem = this.custList.find(item => item.value == val)
        const data = Object.assign({},selectItem.data)
        data.creditCode = data.idCode
        data.organizationId = data.id
        data.bankName = data.depositBank
        if (data.registerAddress) {
          const regArray = data.registerAddress.split(',')
          data.registeredAddress = regArray.slice(0, 3)
          data.registeredAddressDetail = regArray.pop()
        }
        if (data.officeAddress) {
          const regArray = data.officeAddress.split(',')
          data.officeAddress = regArray.slice(0, 3)
          data.officeAddressDetail = regArray.pop()
        }
        delete data.id
        this.formApi.setValue(data)
      } else {
        this.formApi.setValue('organizationId', '')
        this.formApi.setValue('creditCode', '')
        this.formApi.setValue('registeredAddress', '')
        this.formApi.setValue('registeredAddressDetail', '')
        this.formApi.setValue('officeAddress', '')
        this.formApi.setValue('organizationId', '')
        this.formApi.setValue('officeAddressDetail', '')
        this.formApi.setValue('bankName', '')
        this.formApi.setValue('bankAccount', '')
      }
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang='scss' scoped>
  .el-form-item {
    height: 29px;
  }
  h3{
    position: relative;
    margin-bottom: 10px;
    padding-left: 10px;
    font-size: 14px;
    font-weight: bold;
    line-height: 40px;
    text-align: left;
    color: #5C6478;
    border-bottom: 1px solid #F6F6F6;
    &::before {
      position: absolute;
      top: 11px;
      left: 0;
      display: inline-block;
      width: 3px;
      height: 18px;
      content: '';
      background: #85ADFF;
    }
  }
</style>
