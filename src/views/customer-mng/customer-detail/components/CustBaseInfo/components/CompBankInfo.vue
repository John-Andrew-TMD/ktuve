<template>
  <div>
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">银行账户</span>
        <div class="panel-tools">
          <el-button type="primary" :disabled="globalCanEdit" @click="handleBtnClick('添加银行账户','A')">新增</el-button>
          <el-button
            type="primary"
            :disabled="globalCanEdit || !selectData || checkData.length"
            @click="handleBtnClick('修改银行账户','U', selectData)"
          >修改</el-button>
          <el-button type="danger" :disabled="globalCanEdit || !checkData.length" @click="handleDel">删除</el-button>
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
        width="800px"
        @closed="handleDialogClosed"
      >
        <form-create v-model="form" :rule="rule" :option="option" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDialogSubmit()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import TableCreate from 'components/TableCreate/index'
import { queryDictItems } from 'utils'
import { getCustomerBankList, customerBankAdd, customerBankUpdate, customerBankDelete } from 'api/customer-module/api-customer-detail.js'
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
          title: '银行户名',
          field: 'bankAccountName',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '银行名称',
          field: 'bankName',
          col: { span: 12 }
        },
        {
          type: 'input',
          title: '银行开户行',
          field: 'depositBank',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '银行账号',
          field: 'bankAccount',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'radio',
          title: '是否默认账号',
          field: 'isDefault',
          value: '1',
          col: { span: 12 },
          options: queryDictItems('10004')
        },
        {
          type: 'input',
          field: 'remarks',
          title: '备注',
          props: {
            type: 'textarea',
            maxlength: 500
          }
        }
      ],
      option: {
        form: { labelWidth: '150px' },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: getCustomerBankList,
          data: { custId: this.routeParams.id }
        },
        dataCallbackFn(data) {
          if (data && Array.isArray(data.newCrm)) {
            return data.newCrm
          } else {
            return []
          }
        },
        showPagination: false,
        showCheckbox: true,
        showSerialNumber: true,
        requestImmediate: true,
        showLoading: false,
        columns: [
          { attrs: { label: '银行户名', prop: 'bankAccountName' }},
          { attrs: { label: '银行名称', prop: 'bankName' }},
          { attrs: { label: '银行开户行', prop: 'depositBank' }},
          { attrs: { label: '银行账号', prop: 'bankAccount' }},
          {
            attrs: {
              label: '是否默认账号',
              prop: 'isDefault',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.isDefault, '10004')
              }
            }
          },
          { attrs: { label: '备注', prop: 'remarks', 'show-overflow-tooltip': true }}
        ]
      },
      selectData: null,
      checkData: []
    }
  },
  computed: {
    globalCanEdit() {
      return !this.routeParams.globalCanEdit
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
      this.dialogTitle = title
      this.showDialog = true
      this.dialogVisible = true
      this.action = action
      data.isDefault = data.isDefault + ''
      this.$nextTick(() => {
        this.form.setValue(data)
      })
    },
    handleDel() {
      const bankIds = this.checkData.map(item => item.id)
      this.$confirm(`确定删除此信息？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          customerBankDelete({ ids: bankIds }, { showLoading: true }).then(res => {
            this.refreshTable()
            this.$showToast('删除成功！', 'success')
          })
        })
        .catch(err => {
          console.log(err)
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
            this.bankAdd(data)
            break
          case 'U':
            data.id = this.selectData.id
            this.bankUpdate(data)
        }
      })
    },
    bankAdd(params) {
      customerBankAdd(params, { showLoading: true })
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
    bankUpdate(params) {
      customerBankUpdate(params, { showLoading: true })
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
    }
  }
}
</script>
