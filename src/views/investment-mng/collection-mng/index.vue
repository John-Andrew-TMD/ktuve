<template>
  <div class="app-content payment-mng-page">
    <div class="app-content-wrapper">
      <form-search collapse @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group" v-if = "!isHandleMatch">
        <el-button type="primary" size="mini" @click="handleVerificationClick">核销</el-button>
        <el-button type="primary" size="mini" @click="handleAccountClick">批量核销</el-button>
        <el-button type="primary" size="mini" @click="handleRecoilClick">反冲</el-button>
        <el-button type="primary" size="mini" @click="handleAccountClick">记账</el-button>
        <el-button type="primary" size="mini" @click="handleDownloadClick">下载通知书</el-button>
      </div>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
      />
      <component
        :is="componentName"
        v-if="dialogStatus"
        :row-data="rowData"
        :dialog-status.sync="dialogStatus"
        @dialog-confirm="handleDialogConfirm"
      />
    </div>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import FormSearch from 'components/FormSearch'
import { queryDictItems, queryDictValue } from 'utils'
import { collectionList, downloadNotification } from 'api/investment-mng/api-collection-mng.js'
import { formSubmit } from 'utils'
export default {
  // name: 'CollectionMng',
  components: {
    TableCreate,
    FormSearch,
    DialogCollectionVerification: () => import('./components/DialogCollectionVerification.vue')
  },
  props:{
    isHandleMatch:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      searchForm: null,
      searchRules: [
        {
          type: 'el-custom-autocomplete',
          title: '项目名称',
          style: { width: '220px' },
          field: 'projectName',
          props: {
            params: {
              url: collectionList,
              data: {},
              searchKey: 'projectName',
              labelKey: 'projectName',
              valueKey: 'projectName',
              repeat: false
            }
          }
        },
        {
          type: 'el-custom-autocomplete',
          title: '付款方',
          style: { width: '220px' },
          field: 'custName',
          props: {
            params: {
              url: collectionList,
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
          title: '主合同编号',
          style: { width: '220px' },
          field: 'contractNo',
          props: {
            params: {
              url: collectionList,
              data: {},
              searchKey: 'contractNo',
              labelKey: 'contractNo',
              valueKey: 'contractNo',
              repeat: false
            }
          }
        },
        {
          type: 'select',
          title: '款项类型',
          field: 'collectionType',
          style: { width: '220px' },
          options: queryDictItems('10063')
        },
        {
          type: 'el-date-picker',
          field: 'dateCollection',
          title: '计划收款日期',
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
          type: 'el-date-picker',
          field: 'dateCheck',
          title: '实际收款日期',
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
          field: 'checkState',
          style: { width: '220px' },
          options: queryDictItems('10074')
        },
        {
          type: 'select',
          title: '记账状态',
          field: 'bookState',
          style: { width: '220px' },
          options: queryDictItems('10075')
        },
        {
          type: 'select',
          title: '匹配状态',
          field: 'isMatch',
          style: { width: '220px' },
          options: queryDictItems('10067')
        }
      ],
      searchOptions: {
        form: { labelWidth: '100px', inline: true },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: collectionList,
          data: {}
        },
        showCheckbox: true,
        showSerialNumber: true,
        showTools: true,
        tableBottomOffset: 50,
        columns: [
          {
            attrs: {
              label: '项目名称',
              prop: 'projectName',
              'min-width': '200',
              'show-overflow-tooltip': true
            }
          },
          { attrs: { label: '主合同编号', prop: 'contractNo', 'min-width': '150', 'show-overflow-tooltip': true } },
          { attrs: { label: '放款期次', prop: 'rentIssue', 'show-overflow-tooltip': true } },
          { attrs: { label: '付款方', prop: 'custName', 'min-width': '150', 'show-overflow-tooltip': true } },
          {
            attrs: {
              label: '款项类型',
              prop: 'collectionType',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.collectionType, '10063')
              }
            }
          },
          {
            attrs: {
              label: '应收金额（元）',
              prop: 'amtCollection',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.amtCollection)
              }
            }
          },
          {
            attrs: {
              label: '已收金额（元）',
              prop: 'amtCollectionVer',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.amtCollectionVer)
              }
            }
          },
          {
            attrs: {
              label: '剩余应收（元）',
              prop: 'amtCheck',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.amtCheck)
              }
            }
          },
          {
            attrs: {
              label: '匹配状态',
              prop: 'isMatch',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.isMatch, '10067')
              }
            }
          },
          { attrs: { label: '匹配流水编号', prop: 'bankFlowNumber', 'show-overflow-tooltip': true } },
          {
            attrs: {
              label: '核销状态',
              prop: 'checkState',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.checkState, '10074')
              }
            }
          },
          {
            attrs: {
              label: '记账状态',
              prop: 'bookState',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.bookState, '10075')
              }
            }
          },
          {
            attrs: {
              label: '计划收款日期',
              prop: 'dateCollection',
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.dateCollection, 'YYYY-MM-DD')
              }
            }
          },
          {
            attrs: {
              label: '实际收款日期',
              prop: 'dateCheck',
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.dateCheck, 'YYYY-MM-DD')
              }
            }
          },
          {
            attrs: {
              label: '核销人员',
              prop: 'checkOper',
              'show-overflow-tooltip': true
            },
            filter: { name: 'user' }
          },
          {
            attrs: {
              label: '核销时间',
              prop: 'checkTime',
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.checkTime)
              }
            }
          }
        ]
      },
      rowData: null,
      componentName: '',
      selectedRows: [],
      dialogStatus: false
    }
  },
  provide(){
    return {
      refreshTable: this.refreshTable
    }
  },
  methods: {
    handleCurrentChange(row) {
      this.rowData = row
    },
    handleSelectionChange(row) {
      this.selectedRows = row
      // if (this.selectedRows.length == 2) {
      //   this.tooManySelected = true
      // } else {
      //   this.tooManySelected = false
      // }
    },
    handleSearch() {
      const data = this.searchForm.formData()
      if (data.dateCollection) {
        data.startCollectionTime = data.dateCollection[0]
        data.endCollectionTime = data.dateCollection[1] + 24 * 60 * 60 * 1000
        delete data.dateCollection
      }
      if (data.dateCheck) {
        data.startCheckTime = data.dateCheck[0]
        data.endCheckTime = data.dateCheck[1] + 24 * 60 * 60 * 1000
        delete data.dateCheck
      }
      this.refreshTable(data)
    },
    handleSearchReset() {
      this.searchForm.resetFields()
      this.refreshTable()
    },
    handleVerificationClick() {
      this.componentName = 'DialogCollectionVerification'
      this.dialogStatus = true
    },
    handleRecoilClick() {
      this.$showToast('该功能还在路上！', 'warning')
      // let recoilPaymentType = queryDictValue('10063',this.rowData.paymentType)
      // this.$confirm(`已选择：${this.rowData.projectName}/${recoilPaymentType}，确定反冲该期核销记录？`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(() => {
      //     this.$showToast('该功能还在路上！', 'warning')
      //     // agencyDelete({
      //     //   ids: [this.rowData.id]
      //     // }, { showLoading: true }).then(res => {
      //     //   this.$showToast('删除成功！', 'success')
      //     //   this.$refs.tableDom.refreshTable(true)
      //     // }).catch(err => {
      //     //   console.log(err)
      //     // })
      //   })
      //   .catch(() => {})
    },
    handleAccountClick() {
      this.$showToast('别点啦！该功能还在路上~')
    },
    handleDownloadClick() {
      if (!this.selectedRows.length) {
        return this.$showToast('未选中任何行！')
      }
      const ids = this.selectedRows.map(item => item.id)
      formSubmit(downloadNotification, { idsDto: ids.join(',') }, 'post', '_blank')
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data)
    }
  }
}
</script>

<style lang="scss">
</style>
