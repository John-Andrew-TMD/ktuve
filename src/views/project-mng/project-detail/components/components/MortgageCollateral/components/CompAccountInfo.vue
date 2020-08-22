<template>
  <div>
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">应收账款类</span>
        <div class="panel-tools" v-if="routeParams.canEdit">
          <el-button type="primary" @click="handleBtnClick('新增应收账款','A')">新增应收账款</el-button>
          <el-button
            type="primary"
            :disabled="!selectData || checkData.length"
            @click="handleBtnClick('修改应收账款','U', selectData)"
          >修改</el-button>
          <el-button type="danger" :disabled="!checkData.length" @click="handleDeleteClick">删除</el-button>
        </div>
      </div>
    </div>
    <div class="content-body">
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
        :show-summary="true"
        :ignore-columns="[1, 2, 3, 4, 5, 6, 9, 10, 11]"
      />
    </div>
    <el-dialog
      v-transfer-dom
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      width="800px"
      @closed="handleDialogClosed"
    >
      <form-create v-model="formApi" :rule="formRules" :option="option" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TableCreate from 'components/TableCreate/index'
import { queryDictItems } from 'utils/index'
import { queryAccount, addAccount, updateAccount, deleteAccount } from 'api/project-module/api-project-mortgage-collateral.js'
import { agencyList } from 'api/customer-module/api-appraisal-agency-mng.js'
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
      dialogTitle: '',
      action: 'A',
      formApi: {},
      formRules: [
        { type: 'hidden', title: '应收账款ID', field: 'id' },
        {
          type: 'select',
          title: '应收账款押品类型',
          field: 'pawnType',
          options: queryDictItems('10040'),
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'select',
          title: '应收账款分类',
          field: 'accountType',
          col: { span: 12 },
          options: queryDictItems('10041'),
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '债权人',
          field: 'owner',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '债务人',
          field: 'debtor',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '期限',
          field: 'deadline',
          col: { span: 12 }
        },
        {
          type: 'number-input',
          title: '认定价值',
          field: 'affirmValue',
          col: { span: 12 },
          props: {
            'min-decimal': 2,
            'max-decimal': 2,
            'need-format': true
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
          title: '评估价值',
          field: 'evaluateValue',
          col: { span: 12 },
          props: {
            'min-decimal': 2,
            'max-decimal': 2,
            'need-format': true
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
          type: 'el-date-picker',
          title: '评估日期',
          field: 'evaluateTime',
          props: { valueFormat: 'timestamp' },
          col: { span: 12 }
        },
        {
          type: 'el-custom-select',
          title: '评估机构',
          field: 'evaluateAgencyId',
          col: { span: 12 },
          props: {
            params: {
              url: agencyList,
              data: {},
              labelKey: "agencyName",
              valueKey: "id"
            }
          },
          on: {
            change: obj => {
              this.formApi.setValue('evaluateAgency', obj.data.agencyName)
            }
          }
        },
        { type: 'hidden', title: '评估机构名称', field: 'evaluateAgency' },
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
        form: { labelWidth: '140px' },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: queryAccount,
          data: { recordId: this.routeParams.id }
        },
        showTools: true,
        showPagination: false,
        showCheckbox: true,
        showSerialNumber: true,
        columns: [
          { attrs: { label: '应收账款押品类型', prop: 'pawnType', "min-width": "120", formatter: row => {
            return Vue.filter('filterDictValue')(row.pawnType, '10040')}
          }},
          { attrs: { label: '应收账款分类', prop: 'accountType',  'show-overflow-tooltip': true, formatter: row => {
            return Vue.filter('filterDictValue')(row.accountType, '10041')}
          }},
          { attrs: { label: '债权人', prop: 'owner' , 'show-overflow-tooltip': true }},
          { attrs: { label: '债务人', prop: 'debtor', 'show-overflow-tooltip': true }},
          { attrs: { label: '期限', prop: 'deadline' }},
          { attrs: { label: '认定价值（万元）', prop: 'affirmValue', formatter: row => {
            return Vue.filter('filterToThousand')(row.affirmValue)}
          }},
          { attrs: { label: '评估价值（万元）', prop: 'evaluateValue', formatter: row => {
            return Vue.filter('filterToThousand')(row.evaluateValue)}
          }},
          { attrs: { label: '评估日期', prop: 'evaluateTime', formatter: (row, column) => {
            return Vue.filter('filterTimestamp')(row.evaluateTime,'YYYY-MM-DD')}
          }},
          { attrs: { label: '评估机构', prop: 'evaluateAgency', 'show-overflow-tooltip': true  }},
          { attrs: { label: '备注', prop: 'remarks', 'show-overflow-tooltip': true }}
        ]
      },
      selectData: null,
      checkData: []
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
      this.dialogVisible = true
      this.action = action
      this.$nextTick(() => {
        this.formApi.setValue(data)
      })
    },
    handleDeleteClick() {
      this.$confirm(`确定删除选中的应收账款信息？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = []
          this.checkData.map(item => {
            ids.push(item.id)
          })
          deleteAccount({ ids: ids }, { showLoading: true }).then(res => {
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
      this.formApi.validate(valid => {
        if (!valid) return
        const data = this.formApi.formData()
        data.recordId = this.routeParams.id
        switch (this.action) {
          case 'A':
            data.id = null
            this.accountAdd(data)
            break
          case 'U':
            this.accountUpdate(data)
        }
      })
    },
    accountAdd(params) {
      addAccount(params, { showLoading: true })
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
    accountUpdate(params) {
      updateAccount(params, { showLoading: true })
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
      this.formApi.resetFields()
    },
    refreshTable() {
      this.$refs.tableDom.getTableData()
    }
  }
}
</script>