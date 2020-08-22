<template>
  <div id="dialogHook" class="app-content deposit-mng-page">
    <div class="app-content-wrapper">
      <form-search collapse @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <el-button type="primary" :disabled="btnDisabled" @click="handleButtonClick('Deduct')">抵扣申请</el-button>
        <el-button
          type="primary"
          :disabled="btnDisabled"
          @click="handleButtonClick('Complete')"
        >补足申请</el-button>
        <el-button
          type="primary"
          :disabled="btnDisabled"
          @click="handleButtonClick('Remargin')"
        >追加申请</el-button>
        <el-button type="primary" :disabled="btnDisabled" @click="handleButtonClick('Return')">退还申请</el-button>
        <el-button type="primary" :disabled="!rowData" @click="handleButtonClick('Detail')">详情</el-button>
      </div>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
      />
      <component
        :is="componentName"
        v-if="dialogStatus"
        :dialog-status.sync="dialogStatus"
        :row-data="rowData"
        @dialog-confirm="handleDialogConfirm"
      />
    </div>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import FormSearch from 'components/FormSearch'
import { queryDictItems } from 'utils'
import { depositList } from 'api/investment-mng/api-deposit-mng.js'
export default {
  name: 'DepositMngList',
  components: {
    TableCreate,
    FormSearch,
    DialogDepositDeduct: () => import('./components/DialogDepositDeduct.vue'),
    DialogDepositComplete: () => import('./components/DialogDepositComplete.vue'),
    DialogDepositReturn: () => import('./components/DialogDepositReturn.vue'),
    DialogDepositDetail: () => import('./components/DialogDepositDetail.vue'),
    DialogDepositRemargin: () => import('./components/DialogDepositRemargin.vue')
  },
  provide() {
    return {
      refreshTable: this.refreshTable
    }
  },
  data() {
    return {
      searchForm: null,
      searchRules: [
        {
          type: 'el-custom-autocomplete',
          title: '项目名称',
          field: 'projectName',
          style: { width: '200px' },
          props: {
            params: {
              url: depositList,
              searchKey: 'projectName',
              labelKey: 'projectName',
              valueKey: 'projectName',
              repeat: false
            }
          }
        },
        {
          type: 'el-custom-autocomplete',
          field: 'custName',
          title: '客户名称',
          style: { width: '200px' },
          props: {
            params: {
              url: depositList,
              searchKey: 'custName',
              labelKey: 'custName',
              valueKey: 'custName',
              repeat: false
            }
          }
        },
        {
          type: 'el-custom-autocomplete',
          title: '主合同编号',
          field: 'contractNo',
          style: { width: '200px' },
          props: {
            params: {
              url: depositList,
              searchKey: 'contractNo',
              labelKey: 'contractNo',
              valueKey: 'contractNo',
              repeat: false
            }
          }
        },
        {
          type: 'select',
          field: 'riskfeeType',
          title: '保证金类型',
          options: queryDictItems('10062'),
          style: { width: '200px' }
        },
        {
          type: 'select',
          field: 'deductState',
          title: '抵扣申请状态',
          options: queryDictItems('10064'),
          style: { width: '200px' }
        },
        {
          type: 'select',
          field: 'refundState',
          title: '退还申请状态',
          options: queryDictItems('10064'),
          style: { width: '200px' }
        },
        {
          type: 'select',
          field: 'makeupState',
          title: '补足申请状态',
          options: queryDictItems('10064'),
          style: { width: '200px' }
        },
        {
          type: 'select',
          field: 'additionalState',
          title: '追加申请状态',
          options: queryDictItems('10064'),
          style: { width: '200px' }
        }
      ],
      searchOptions: {
        form: { labelWidth: '100px', inline: true },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: depositList,
          data: {}
        },
        selectedRow: 0,
        showSerialNumber: true,
        tableBottomOffset: 85,
        colspanAttrs: ['projectName', 'custName', 'contractNo'],
        columns: [
          {
            attrs: {
              prop: 'projectName',
              label: '项目名称',
              minWidth: 140,
              showOverflowTooltip: true
            }
          },
          {
            attrs: {
              prop: 'custName',
              label: '客户名称',
              minWidth: 140,
              showOverflowTooltip: true
            }
          },
          {
            attrs: {
              prop: 'contractNo',
              label: '主合同编号',
              minWidth: 140,
              showOverflowTooltip: true
            }
          },
          {
            attrs: {
              prop: 'riskfeeType',
              label: '保证金类型',
              minWidth: 100,
              showOverflowTooltip: true
            },
            filter: {
              name: 'dict',
              params: ['10062']
            }
          },
          {
            attrs: {
              prop: 'contractAmount',
              label: '合同约定金额(元)',
              minWidth: 115
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'additionalAmount',
              label: '追加金额',
              minWidth: 115
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'receivedAmount',
              label: '已收金额(元)',
              minWidth: 115
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'deductionedAmount',
              label: '已抵金额(元)',
              minWidth: 115
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'refundedAmount',
              label: '已退金额(元)',
              minWidth: 115
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'filledAmount',
              label: '已补足金额(元)',
              minWidth: 115
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'riskfeeBalance',
              label: '风险金余额(元）',
              minWidth: 115
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'refundAmount',
              label: '待退金额(元)',
              minWidth: 115
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'receiveAmount',
              label: '待收金额(元)',
              minWidth: 115
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'deductState',
              label: '抵扣申请状态',
              minWidth: 130,
              formatter: (row, column) => {
                const state = +row.deductState
                const value = Vue.filter('filterDictValue')(state, '10064')
                return state === 0 ? value : `${value} (第${row.deductNum}笔)`
              }
            }
          },
          {
            attrs: {
              prop: 'refundState',
              label: '退还申请状态',
              minWidth: 130,
              formatter: (row, column) => {
                const state = +row.refundState
                const value = Vue.filter('filterDictValue')(state, '10064')
                return state === 0 ? value : `${value} (第${row.refundNum}笔)`
              }
            }
          },
          {
            attrs: {
              prop: 'makeupState',
              label: '补足申请状态',
              minWidth: 130,
              formatter: (row, column) => {
                const state = +row.makeupState
                const value = Vue.filter('filterDictValue')(state, '10064')
                return state === 0 ? value : `${value} (第${row.makeupNum}笔)`
              }
            }
          },
          {
            attrs: {
              prop: 'additionalState',
              label: '追加申请状态',
              minWidth: 130,
              formatter: (row, column) => {
                const state = +row.additionalState
                const value = Vue.filter('filterDictValue')(state, '10064')
                return state === 0 ? value : `${value} (第${row.additionalNum}笔)`
              }
            }
          }
        ]
      },
      rowData: null,
      selectedRows: [],
      componentName: '',
      dialogStatus: false
    }
  },
  methods: {
    handleRowClick(rowData, column) {
      if (column.property === 'demo') {
        // TODO 页面调整
      }
    },
    handleCurrentChange(row) {
      this.rowData = row
    },
    handleSelectionChange(row) {},
    handleSearch() {
      const data = this.searchForm.formData()
      this.refreshTable(data)
    },
    handleSearchReset() {
      this.searchForm.resetFields()
      this.refreshTable()
    },
    handleButtonClick(name) {
      this.componentName = `DialogDeposit${name}`
      console.log(this.componentName)
      this.dialogStatus = true
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data)
    },
    // 新增成功后，返回新增后的信息，用于页面跳转
    handleDialogConfirm(customerInfo) {}
  },
  computed: {
    btnDisabled() {
      if (!this.rowData) {
        return true
      } else {
        const stateArr = ['deductState', 'makeupState', 'additionalState', 'refundState']
        for (const key in this.rowData) {
          if (this.rowData.hasOwnProperty(key)) {
            const value = this.rowData[key]
            if (stateArr.includes(key) && +value === 1) {
              return true
            }
          }
        }
        return false
      }
    }
  }
}
</script>

<style lang="scss">
</style>
