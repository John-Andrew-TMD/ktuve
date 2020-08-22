<template>
  <div class="app-content page-capital-investment-mng">
    <div class="app-content-wrapper">
      <form-search collapse @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <el-button type="primary" size="mini" @click="handleAddClick">新增投放申请</el-button>
        <el-button :disabled="!rowData" type="primary" size="mini" @click="handleReaddClick">投放申请</el-button>
        <el-button :disabled="!rowData" type="primary" size="mini" @click="handlePaymentClick">支付申请</el-button>
        <el-button :disabled="!rowData" type="primary" size="mini" @click="handleDetailClick">详情</el-button>
      </div>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import FormSearch from 'components/FormSearch'
import { queryDictItems } from 'utils'
import { investmentList } from 'api/investment-mng/api-capital-investment-mng.js'
export default {
  // name: 'CapitalInvestmentMng',
  components: {
    TableCreate,
    FormSearch
  },
  data() {
    return {
      searchForm: null,
      searchRules: [
        {
          type: 'el-custom-autocomplete',
          field: 'projectName',
          title: '项目名称',
          props: {
            params: {
              url: '',
              data: {
              },
              searchKey: 'projectName',
              labelKey: 'projectName',
              valueKey: 'projectName'
            }
          }
        },
        {
          type: 'select',
          field: 'businessCategory',
          title: '租赁类别',
          options: queryDictItems('10027')
        },
        {
          type: 'select',
          field: 'businessType',
          title: '租赁类型',
          options: queryDictItems('10026'),
        },
         {
          type: 'select',
          field: 'projectType',
          title: '项目类型',
          options: queryDictItems('10049')
        },
        {
          type: 'el-custom-autocomplete',
          title: '主合同编号',
          field: 'conBundleNo',
          props: {
            params: {
              url: '',
              data: {
              },
              searchKey: 'conBundleNo',
              labelKey: 'conBundleNo',
              valueKey: 'conBundleNo'
            }
          }
        },
        {
          type: 'select',
          field: 'loanState',
          title: '投放状态',
          options: queryDictItems('10057'),
          props: {
            clearable: true
          }
        }
      ],
      searchOptions: {
        form: { labelWidth: '85px', inline: true },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: investmentList,
          data: {}
        },
        showSerialNumber: true,
        showTools: true,
        tableBottomOffset: 50,
        columns: [
          {
            attrs: {
              label: '项目名称',
              prop: 'projectName',
              align: 'left',
              'min-width': '200',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              label: '租赁类别',
              prop: 'businessCategory',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.businessCategory, '10027')
              }
            }
          },
          {
            attrs: {
              label: '租赁类型',
              prop: 'businessType',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.businessType, '10026')
              }
            }
          },
          {
            attrs: {
              label: '项目类型',
              prop: 'projectType',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.projectType, '10049')
              }
            }
          },
          {
            attrs: {
              prop: 'collectionName',
              label: '收款方'
            }
          },
          {
            attrs: {
              prop: 'conBundleNo',
              label: '主合同编号'
            }
          },
          {
            attrs: {
              prop: 'placementNo',
              label: '放款期次',
              'class-name': 'link-type',
              'min-width': '100',
              formatter: row => {
                return row.placementNo ? `第${row.placementNo}笔放款` : '--'
              }
            }
          },
          {
            attrs: {
              prop: 'amtContract',
              label: '合同金额(元)',
              width: '130',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.amtContract)
              }
            }
          },
          {
            attrs: {
              prop: 'amtLoan',
              label: '本期次投放金额(元)',
              width: '150',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.amtLoan)
              }
            }
          },
          {
            attrs: {
              prop: 'totalPrincipal',
              label: '租赁本金',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.totalPrincipal)
              }
            }
          },
          {
            attrs: {
              prop: 'leaseTerm',
              label: '还款期限'
            }
          },
          {
            attrs: {
              prop: 'irr',
              label: 'IRR(%)'
            }
          },
          {
            attrs: {
              prop: 'loanState',
              label: '投放状态',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.businessType, '10057')
              }
            }
          },
          {
            attrs: {
              prop: 'payState',
              label: '付款状态'
            }
          },
          {
            attrs: {
              prop: 'passTime',
              label: '审批通过时间',
              width: '120',
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.passTime)
              }
            }
          },
          {
            attrs: {
              prop: 'sysCtime',
              label: '创建时间',
              width: '120',
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.sysCtime)
              }
            }
          }
        ]
      },
      rowData: null,
      selectedRows: []
    }
  },
  methods: {
    handleRowClick(rowData, column) {
      if (column.property === 'placementNo') {
        this.$router.push({
          path: '/investment-mng/capital-investment-mng/detail',
          query: {
            loanId: rowData.loanId
          }
        })
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
      this.$router.push('/investment-mng/capital-investment-mng/add')
    },
    handleReaddClick() {
      this.$router.push({
        path: '/investment-mng/capital-investment-mng/add',
        query: {
          loanId: this.rowData.loanId
        }
      })
    },
    handlePaymentClick() {
      this.$router.push({
        path: '/investment-mng/capital-investment-mng/payment',
        query: {
          id: this.rowData.loanId
        }
      })
    },
    handleDetailClick() {
      this.$router.push({
        path: '/investment-mng/capital-investment-mng/detail',
        query: {
          loanId: this.rowData.loanId
        }
      })
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

<style lang="scss">
</style>
