<template>
  <el-dialog
    :title="dialogTitle"
    width="830px"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    @closed="handleDialogClosed"
  >
    <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    <h3 v-if="action=='Q'">评估报告</h3>
    <appraisal-report v-if="action=='Q'" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button v-if="action!='Q'" type="primary" @click="handleDialogSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { queryDictItems } from 'utils'
import { agencyAdd, agencyUpdate } from 'api/customer-module/api-appraisal-agency-mng.js'
import AppraisalReport from './AppraisalReport'

export default {
  components: {
    AppraisalReport
  },
  inject: ['refreshTable'],
  props: ['action', 'dialogTitle', 'rowData'],
  data() {
    return {
      dialogVisible: false,
      formApi: null,
      formRules: [
        { type: 'hidden', title: '评估机构ID', field: 'id' },
        {
          type: 'input',
          title: '评估机构名称',
          field: 'agencyName',
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
          type: 'number-input',
          title: '注册资本',
          field: 'registeredCapital',
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['万元']
            }
          ],
          props: {
            needFormat: true
          },
          style: { width: '255px' },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '评估资质',
          field: 'assessQualification',
          style: { width: '255px' },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'select',
          title: '合作类型',
          field: 'cooperationType',
          style: { width: '255px' },
          col: { span: 12 },
          options: queryDictItems('10019'),
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
          type: 'input',
          title: '联系人',
          field: 'contactPerson',
          style: { width: '255px' },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '联系电话',
          field: 'phoneNumber',
          style: { width: '255px' },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        { type: 'hidden', title: '律所ID', field: 'organizationId' },
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
    },
    // 确定
    handleDialogSubmit() {
      this.formApi.validate(valid => {
        if (valid) {
          const data = this.formApi.formData()
          delete data.custName
          if (!data.registeredAddress) {
            data.registeredAddress = new Array(3).fill('')
          }
          const registeredAddressD = data.registeredAddressDetail || ''
          data.registeredAddress = data.registeredAddress.join(',') + ',' + registeredAddressD
          delete data.registeredAddressDetail
          if (!data.officeAddress) {
            data.officeAddress = new Array(3).fill('')
          }
          const officeAddressDetail = data.officeAddressDetail || ''
          data.officeAddress = data.officeAddress.join(',') + ',' + officeAddressDetail
          delete data.officeAddressDetail
          if (this.action == 'U') {
            agencyUpdate(data, { showLoading: true }).then(res => {
              this.$showToast('修改成功！', 'success')
              this.dialogVisible = false
              this.refreshTable()
            }).catch(err => {
              console.log(err)
            })
          } else {
            agencyAdd(data, { showLoading: true }).then(res => {
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
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang='scss' scoped>
  /deep/.el-form-item {
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
