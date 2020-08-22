<template>
  <div class="app-content on-account-mng-page">
    <div class="app-content-wrapper">
      <form-search collapse @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <el-button type="primary" size="mini" @click="handleAddClick">新增</el-button>
        <el-button type="primary" size="mini" @click="handleReturnClick">退回</el-button>
        <el-button type="primary" size="mini" @click="handleAccountClick">记账</el-button>
        <el-button type="primary" size="mini" @click="handleDetailClick">详情</el-button>
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
        @dialog-confirm="handleDialogConfirm"
      />
    </div>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import FormSearch from 'components/FormSearch'
import { queryDictItems } from 'utils'
import { contractList } from 'api/contract-module/api-contract-mng.js'
export default {
  // name: 'OnAccountMng',
  components: {
    TableCreate,
    FormSearch,
    DialogOneAccountAdd: () => import('./components/DialogOneAccountAdd.vue'),
    DialogOneAccountReturn: () => import('./components/DialogOneAccountReturn.vue'),
    DialogOneAccountDetail: () => import('./components/DialogOneAccountDetail.vue')
  },
  data() {
    return {
      searchForm: null,
      searchRules: [
        {
          type: 'el-custom-autocomplete',
          title: '客户名称',
          style: { width: '220px' },
          field: 'custName',
          props: {
            params: {
              url: contractList,
              data: {},
              searchKey: 'custName',
              labelKey: 'custName',
              valueKey: 'custName',
              repeat: false
            }
          }
        },
        {
          type: 'el-custom-autocomplete',
          title: '付款人',
          style: { width: '220px' },
          field: 'payer',
          props: {
            params: {
              url: contractList,
              data: {},
              searchKey: 'payer',
              labelKey: 'payer',
              valueKey: 'payer',
              repeat: false
            }
          }
        },
        {
          type: 'el-date-picker',
          field: 'payTime',
          title: '付款日期',
          style: { width: '220px' },
          props: {
            type: 'daterange',
            format: 'yyyy-MM-dd',
            valueFormat: 'timestamp',
            rangeSeparator: '-',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        },
        {
          type: 'select',
          title: '核销状态',
          field: 'hexiaoState',
          style: { width: '220px' },
          options: queryDictItems('10056')
        },
        {
          type: 'select',
          title: '记账状态',
          field: 'jizhangState',
          style: { width: '220px' },
          options: queryDictItems('10056')
        }
      ],
      searchOptions: {
        form: { labelWidth: '85px', inline: true },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: '',
          data: {}
        },
        showLoading: false,
        showSerialNumber: true,
        requestImmediate: false, // 需要自动展示数据删除此行
        showTools: true,
        tableBottomOffset: 50,
        columns: [
          {
            attrs: {
              label: '客户名称',
              prop: 'custName',
              'min-width': '200',
              'show-overflow-tooltip': true
            }
          },
          { attrs: { label: '付款人', prop: 'payer', 'show-overflow-tooltip': true } },
          { attrs: { label: '付款账号', prop: 'payerAccount', 'show-overflow-tooltip': true } },
          {
            attrs: {
              label: '付款金额',
              prop: 'payerMoney',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.payerMoney)
              }
            }
          },
          {
            attrs: {
              label: '付款日期',
              prop: 'paymentTime',
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.paymentTime)
              }
            }
          },
          { attrs: { label: '流水编号', prop: 'flowNo', 'show-overflow-tooltip': true } },
          {
            attrs: {
              label: '流水状态',
              prop: 'flowState',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.flowState, '10027')
              }
            }
          },
          {
            attrs: {
              label: '核销状态',
              prop: 'hexiaoState',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.hexiaoState, '10026')
              }
            }
          },
          {
            attrs: {
              label: '记账状态',
              prop: 'jizhangState',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.jizhangState, '10026')
              }
            }
          },
          { attrs: { label: '去向/用途', prop: 'useTo', 'show-overflow-tooltip': true } },
          { attrs: { label: '备注', prop: 'remarks', 'show-overflow-tooltip': true } },
          {
            attrs: {
              label: '创建时间',
              prop: 'sysCtime',
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.sysCtime)
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
    handleSelectionChange(row) {
    },
    handleSearch() {
      const data = this.searchForm.formData()
      this.refreshTable(data)
    },
    handleSearchReset() {
      this.searchForm.resetFields()
      this.refreshTable()
    },
    handleAddClick() {
      this.componentName = 'DialogOneAccountAdd'
      this.dialogStatus = true
    },
    handleReturnClick(){
      this.componentName = 'DialogOneAccountReturn'
      this.dialogStatus = true
    },
    handleDetailClick(){
      this.componentName = 'DialogOneAccountDetail'
      this.dialogStatus = true
    },
    handleAccountClick() {
      this.$showToast('别点啦！该功能还在路上~')
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data)
    },
    // 新增成功后，返回新增后的信息，用于页面跳转
    handleDialogConfirm(customerInfo) {
    }
  }
}

</script>
