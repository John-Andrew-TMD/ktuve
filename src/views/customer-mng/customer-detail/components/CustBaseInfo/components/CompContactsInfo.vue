<template>
  <div>
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">常用联系人</span>
        <div class="panel-tools">
          <el-button type="primary" :disabled="globalCanEdit" @click="handleBtnClick('添加联系人','A')">新增</el-button>
          <el-button
            type="primary"
            :disabled="globalCanEdit || !selectData || checkData.length"
            @click="handleBtnClick('修改联系人','U', selectData)"
          >修改</el-button>
          <el-button
            type="primary"
            :disabled="globalCanEdit || !selectData || checkData.length"
            @click="handleBtnClick('联系人详情','Q', selectData)"
          >详情</el-button>
          <el-button type="danger" :disabled="!checkData.length" @click="handleDel">删除</el-button>
        </div>
      </div>
    </div>
    <div class="content-body">
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
      />
    </div>
    <div v-if="showDialog" v-transfer-dom>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        :modal-append-to-body="false"
        width="830px"
        @closed="handleDialogClosed"
      >
        <form-create v-model="form" :rule="rule" :option="option" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button v-if="!isDisabled" type="primary" @click="handleDialogSubmit()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import TableCreate from 'components/TableCreate/index'
import { queryDictItems } from 'utils'
import {
  customerContactList,
  customerContactAdd,
  customerContactUpdate,
  customerContactDelete
} from 'api/customer-module/api-customer-detail.js'

export default {
  components: {
    TableCreate
  },
  props: {
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      showDialog: false,
      dialogTitle: '',
      action: 'A',
      form: {},
      rule: [
        { type: 'hidden', title: '客户ID', field: 'custId', value: this.routeParams.id },
        {
          type: 'input',
          title: '姓名',
          field: 'contactName',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '手机号码',
          field: 'phoneNumber',
          col: { span: 12 },
          validate: this.formValidate({ type: 'mobile' })
        },
        {
          type: 'input',
          title: '固定电话',
          field: 'fixedPhoneNumber',
          col: { span: 12 },
          validate: this.formValidate({ type: 'tel' })
        },
        { type: 'input', title: '工作单位', field: 'workUnit', col: { span: 12 }},
        {
          type: 'radio',
          title: '是否为重要联系人',
          field: 'isPrimaryContact',
          col: { span: 12 },
          options: queryDictItems('10004')
        },
        { type: 'input', title: '微信号', field: 'wechat', col: { span: 12 }},
        {
          type: 'input',
          title: '单位电话',
          field: 'companyPhoneNumber',
          col: { span: 12 },
          validate: this.formValidate({ type: 'tel' })
        },
        { type: 'input', title: '职务', field: 'position', col: { span: 12 }},
        { type: 'input', title: 'QQ', field: 'qq', col: { span: 12 }},
        { type: 'input', title: '传真', field: 'fax', col: { span: 12 }, validate: this.formValidate({ type: 'fax' }) },
        {
          type: 'input',
          title: '邮箱',
          field: 'email',
          col: { span: 12 },
          validate: this.formValidate({ type: 'email' })
        },
        {
          type: 'el-date-picker',
          title: '生日',
          field: 'contactBirthday',
          col: { span: 12 },
          props: { valueFormat: 'yyyyMMdd' },
          style: { width: '100%' }
        },
        {
          type: 'input',
          title: '身份证号码',
          field: 'idCard',
          col: { span: 12 },
          validate: this.formValidate({ type: 'idCard' })
        },
        { type: 'input', field: 'remarks', title: '备注', props: { type: 'textarea', maxlength: 500 }}
      ],
      option: {
        form: { labelWidth: '150px' },
        submitBtn: { show: false }
      },
      isDisabled: false,
      tableOptions: {
        requestParams: {
          url: customerContactList,
          data: { custId: this.routeParams.id }
        },
        showPagination: false,
        showCheckbox: true,
        showSerialNumber: true,
        showLoading: false,
        columns: this.getContactColumns()
      },
      selectData: null,
      checkData: []
    }
  },
  computed: {
    // 是否是机构客户
    isOrg() {
      return this.routeParams.custCategory == 1
    },
    globalCanEdit() {
      return !this.routeParams.globalCanEdit
    }
  },
  created() {
    if (this.isOrg) {
      for (let i = 0; i < this.rule.length; i++) {
        const item = this.rule[i]
        if (item.field === 'workUnit') {
          this.rule.splice(i, 0, {
            type: 'radio',
            title: '是否为法人',
            field: 'isLegalPerson',
            col: { span: 12 },
            options: queryDictItems('10004'),
            className: this.isOrg ? '' : 'hidden'
          })
          break
        }
      }
    }
  },
  methods: {
    handleCurrentChange(rowData) {
      this.selectData = rowData
    },
    handleSelectionChange(data) {
      this.checkData = data
    },
    handleBtnClick(title, action, data = {}) {
      const newData = Object.assign({}, data)
      this.dialogTitle = title
      this.showDialog = true
      this.isDisabled = action === 'Q'
      this.dialogVisible = true
      this.action = action
      this.$nextTick(() => {
        if (action !== 'A') {
          newData.isLegalPerson = newData.isLegalPerson + ''
          newData.isPrimaryContact = newData.isPrimaryContact + ''
        }
        this.form.setValue(newData)
        this.form.updateOptions({
          form: { disabled: this.isDisabled }
        })
      })
    },
    handleDel() {
      const ids = this.checkData.map(item => item.id)
      this.$confirm(`确定删除此信息？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          customerContactDelete({ ids }, { showLoading: true })
            .then(() => {
              this.refreshTable()
              this.$showToast('删除成功！', 'success')
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    handleDialogSubmit() {
      this.form.validate(valid => {
        if (!valid) return
        const data = this.form.formData()
        switch (this.action) {
          case 'A':
            data.id = ''
            this.contractAdd(data)
            break
          case 'U':
            data.id = this.selectData.id
            this.contractUpdate(data)
            break
        }
      })
    },
    contractAdd(params) {
      customerContactAdd(params, { showLoading: true })
        .then(res => {
          this.refreshTable()
          this.dialogVisible = false
          this.$showToast('新增成功！', 'success')
          this.selectData = null
        })
        .catch(err => {
          console.log(err)
        })
    },
    contractUpdate(params) {
      customerContactUpdate(params, { showLoading: true })
        .then(res => {
          this.refreshTable()
          this.dialogVisible = false
          this.$showToast('修改成功！', 'success')
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDialogClosed() {
      this.form.resetFields()
      this.showDialog = false
    },
    refreshTable() {
      this.$refs.tableDom.getTableData()
    },
    // 根据客户类型获取常用联系人
    getContactColumns() {
      // 1机构 2个人
      const isOrg = this.routeParams.custCategory == 1
      const columns = [
        { attrs: { label: '姓名', prop: 'contactName' }},
        { attrs: { label: '手机号码', prop: 'phoneNumber' }},
        {
          attrs: {
            label: '是否为法人',
            prop: 'isLegalPerson',
            formatter: row => {
              return Vue.filter('filterDictValue')(row.isPrimaryContact, '10004')
            }
          },
          hidden: !isOrg
        },
        {
          attrs: {
            label: '是否为重要联系人',
            prop: 'isPrimaryContact',
            formatter: row => {
              return Vue.filter('filterDictValue')(row.isPrimaryContact, '10004')
            }
          }
        },
        { attrs: { label: '固定电话', prop: 'fixedPhoneNumber' }},
        { attrs: { label: 'QQ', prop: 'qq' }},
        { attrs: { label: '微信号', prop: 'wechat' }},
        { attrs: { label: '职务', prop: 'position' }},
        { attrs: { label: '单位电话', prop: 'companyPhoneNumber' }},
        { attrs: { label: '邮箱', prop: 'email' }}
      ]
      return columns.filter(item => !item.hidden)
    }
  }
}
</script>
