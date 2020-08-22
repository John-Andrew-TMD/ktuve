<template>
  <div class="app-content">
    <div class="app-content-wrapper">
      <form-search collapse @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <el-button type="primary" size="mini" @click="handleAddClick">新增合同</el-button>
        <el-button type="primary" :disabled="!rowData||contractEndDiasabled" size="mini" @click="handleEndClick">合同结束</el-button>
      </div>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
        :merger-columns="mergerColumns"
      />
    </div>
    <dialog-contract-add
      v-if="dialogContractAddListStatus"
      :dialog-status.sync="dialogContractAddListStatus"
    />
    <dialog-contract-end
      v-if="dialogContractEndStatus"
      :dialog-status.sync="dialogContractEndStatus"
    />
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import FormSearch from 'components/FormSearch'
import { queryDictItems } from 'utils'
import { contractList } from 'api/contract-module/api-contract-mng.js'
export default {
  // name: 'ContractMngList',
  components: {
    TableCreate,
    FormSearch,
    DialogContractAdd: () => import('./components/DialogContractAdd.vue'),
    DialogContractEnd: () => import('./components/DialogContractEnd.vue')
  },
  data() {
    return {
      rowData: null,
      selectedRows: [],
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
          title: '项目名称',
          style: { width: '220px' },
          field: 'projectName',
          props: {
            params: {
              url: contractList,
              data: {},
              searchKey: 'projectName',
              labelKey: 'projectName',
              valueKey: 'projectName',
              repeat: false
            }
          }
        },
        {
          type: 'select',
          title: '租赁类型',
          field: 'businessType',
          style: { width: '220px' },
          options: queryDictItems('10026')
        },
        {
          type: 'select',
          title: '租赁类别',
          field: 'businessCategory',
          style: { width: '220px' },
          options: queryDictItems('10027')
        },
        {
          type: 'select',
          title: '项目类型',
          field: 'projectType',
          style: { width: '220px' },
          options: queryDictItems('10049')
        },
        {
          type: 'el-custom-autocomplete',
          title: '业务主办经理',
          style: { width: '220px' },
          field: 'businessManage',
          props: {
            params: {
              url: contractList,
              data: {},
              searchKey: 'businessManage',
              labelKey: 'businessManage',
              valueKey: 'businessManage',
              repeat: false
            }
          }
        },
        {
          type: 'el-custom-autocomplete',
          title: '业务协办经理',
          style: { width: '220px' },
          field: 'businessCooperation',
          props: {
            params: {
              url: contractList,
              data: {},
              searchKey: 'businessCooperation',
              labelKey: 'businessCooperation',
              valueKey: 'businessCooperation',
              repeat: false
            }
          }
        },
        {
          type: 'select',
          title: '主合同状态',
          field: 'contractState',
          style: { width: '220px' },
          options: queryDictItems('10056')
        },
        {
          type: 'el-date-picker',
          field: 'signingTime',
          title: '签署时间',
          style: { width: '220px' },
          props: {
            type: 'daterange',
            format: 'yyyy-MM-dd',
            valueFormat: 'timestamp',
            rangeSeparator: '-',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        }
      ],
      searchOptions: {
        form: { labelWidth: '120px', inline: true },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: contractList,
          data: {}
        },
        showSerialNumber: true,
        showTools: true,
        tableBottomOffset: 50,
        colspanAttrs: ['projectName', 'custName', 'projectNo', 'businessCategory', 'businessType',
         'projectType', 'businessManage', 'businessCooperation', 'projectAmount', 'lastAmount'],
        columns: [
          {
            attrs: {
              label: '项目名称',
              prop: 'projectName',
              'class-name': 'link-type',
              'min-width': '200',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              label: '客户名称',
              prop: 'custName',
              'min-width': '150',
              'show-overflow-tooltip': true
            }
          },
          { attrs: { label: '项目编号', prop: 'projectNo',width: '100px', 'show-overflow-tooltip': true } },
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
          { attrs: { label: '业务主办经理', prop: 'businessManage' } },
          { attrs: { label: '业务协办经理', prop: 'businessCooperation' } },
          {
            attrs: {
              label: '项目融资金额（元）',
              prop: 'projectAmount',
              width: '120px',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.projectAmount)
              }
            }
          },
          {
            attrs: {
              label: '可申请合同金额（元）',
              prop: 'lastAmount',
              width: '120px',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.lastAmount)
              }
            }
          },
          { attrs: { label: '主合同编号', prop: 'contractNo', width: '150px','show-overflow-tooltip': true} },
          {
            attrs: {
              label: '合同融资金额（元）',
              prop: 'contractAmount',
              width: '120px',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.contractAmount)
              }
            }
          },
          { attrs: { label: '主合同状态', prop: 'contractState',
            width: '120px',
            formatter: row => {
              return Vue.filter('filterDictValue')(row.contractState, '10056')
            }}
          },
          {
            attrs: {
              label: '签署时间',
              prop: 'signingTime',
              width: '100px',
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.signingTime,'YYYY-MM-DD')
              }
            }
          },
          {
            attrs: {
              label: '签署地点',
              prop: 'signingPlace',
              formatter: row => {
                return Vue.filter('filterChinaAddress')(row.signingPlace)
              },
              'min-width': '150',
              'show-overflow-tooltip': true
            }
          },
          // { attrs: { label: '签署地点', prop: 'signingPlace', 'show-overflow-tooltip': true  } },
          {
            attrs: {
              label: '创建时间',
              prop: 'sysCtime',
              width: '140px',
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.sysCtime)
              }
            }
          }
        ]
      },
      dialogContractAddListStatus: false,
      dialogContractEndStatus: false,
      contractEndDiasabled: true
    }
  },
  methods: {
    handleRowClick(rowData, column) {
      if (column.property === 'projectName') {
        this.$router.push({
          path: '/contract-mng/contract-detail',
          query: {
            id: rowData.id,
            // projectManagerId: rowData.projectManagerId,
            // businessType: rowData.businessType,
            // businessCategory: rowData.businessCategory
          }
        })
      }
    },
    handleCurrentChange(row) {
      console.log('rowData',this.rowData);
      if(['2','8','9'].includes(row.contractState)){
        this.contractEndDiasabled = false
      } else {
        this.contractEndDiasabled = true
      }
      this.rowData = row
    },
    handleAddClick() {
      this.dialogContractAddListStatus = true
    },
    handleEndClick() {
      if (!this.rowData) {
        return this.$showToast('未选中任何行！')
      }
      // this.$showToast('别点啦！该功能还在路上~')
      this.dialogContractEndStatus = true
      // this.$confirm(`已选择：${this.rowData.custName}，确定结束该合同吗？`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(() => {
      //     this.$showToast('该功能还在路上！', 'warning')
      //     // 合同结束
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
    handleSearch() {
      const data = this.searchForm.formData()
      if(data.signingTime){
        data.startTime = data.signingTime[0]
        data.endTime = data.signingTime[1] // + 24*60*60*1000
        delete data.signingTime
      }
      this.refreshTable(data)
    },
    handleSearchReset() {
      this.searchForm.resetFields()
      this.refreshTable()
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data)
    }
  },
  async beforeRouteEnter(to, from, next) {
    next()
  }
}
</script>

<style lang="scss">
</style>
