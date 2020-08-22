<template>
  <div class="app-content payment-mng-page">
    <div class="app-content-wrapper">
      <form-search collapse @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <el-button type="primary" :disabled= !rowData||verifyDisabled size="mini" @click="handleVerificationClick">核销</el-button>
        <el-button type="primary" :disabled= !rowData||recoilDisabled size="mini" @click="handleRecoilClick">反冲</el-button>
        <el-button type="primary" :disabled= !rowData size="mini" @click="handleAccountClick">记账</el-button>
      </div>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @current-change="handleCurrentChange"
      >
        <template v-slot:operation="slotScope">
          <p class="file-name" @click="handleDetailClick">详情</p>
        </template>
      </table-create>
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
import { paymentList, recoilPayment } from 'api/investment-mng/api-payment-mng.js'
export default {
  // name: 'PaymentMng',
  components: {
    TableCreate,
    FormSearch,
    DialogPaymentVerification: () => import('./components/DialogPaymentVerification.vue'),
    DialogPaymentDetail: () => import('./components/DialogPaymentDetail.vue')
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
              url: paymentList,
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
          title: '收款方',
          style: { width: '220px' },
          field: 'collectName',
          props: {
            params: {
              url: paymentList,
              data: {},
              searchKey: 'collectName',
              labelKey: 'collectName',
              valueKey: 'collectName',
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
              url: paymentList,
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
          field: 'paymentType',
          style: { width: '220px' },
          options: queryDictItems('10061')
        },
        {
          type: 'el-date-picker',
          field: 'datePayment',
          title: '计划付款日期',
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
          title: '实际付款日期',
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
          title: '付款状态',
          field: 'checkState',
          style: { width: '220px' },
          options: queryDictItems('10065')
        },
        {
          type: 'select',
          title: '记账状态',
          field: 'bookState',
          style: { width: '220px' },
          options: queryDictItems('10066')
        }
      ],
      searchOptions: {
        form: { labelWidth: '100px', inline: true },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: paymentList,
          data: {}
        },
        selectedRow: 0,
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
          { attrs: { label: '主合同编号', prop: 'contractNo', 'show-overflow-tooltip': true } },
          { 
            attrs: {
              label: '收款方', 
              prop: 'collectId', 
              'show-overflow-tooltip': true 
            },
            filter: { name: 'user' }
          },
          {
            attrs: {
              label: '款项类型',
              prop: 'paymentType',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.paymentType, '10061')
              }
            }
          },
          {
            attrs: {
              label: '应付金额（元）',
              prop: 'amtPayment',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.amtPayment)
              }
            }
          },
          {
            attrs: {
              label: '核销状态',
              prop: 'checkState',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.checkState, '10065')
              }
            }
          },
          {
            attrs: {
              label: '记账状态',
              prop: 'bookState',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.bookState, '10066')
              }
            }
          },
          {
            attrs: {
              label: '计划付款日期',
              prop: 'datePayment',
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.datePayment,'YYYY-MM-DD')
              }
            }
          },
          {
            attrs: {
              label: '实际付款日期',
              prop: 'dateCheck',
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.dateCheck,'YYYY-MM-DD')
              }
            }
          },
          { attrs: { label: '核销人员', prop: 'checkOper', 'show-overflow-tooltip': true } },
          {
            attrs: {
              label: '核销时间',
              prop: 'checkTime',
              width: '140px',
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.checkTime)
              }
            }
          },
          { attrs: { label: '操作', prop: 'operation', 'show-overflow-tooltip': true },slot:true }
        ]
      },
      rowData: null,
      componentName: '',
      dialogStatus: false,
      verifyDisabled: false,
      recoilDisabled: false
    }
  },
  provide(){
    return {
      refreshTable: this.refreshTable
    }
  },
  methods: {
    handleCurrentChange(row) {
      if(row){
        this.rowData = row
        if(this.rowData.checkState == '0'){
          this.verifyDisabled = false
          this.recoilDisabled = true
        } else {
          this.verifyDisabled = true
          this.recoilDisabled = false
        }
      }
    },
    handleSearch() {
      const data = this.searchForm.formData()
      if(data.datePayment){
        data.datePaymentStart = data.datePayment[0]
        data.datePaymentEnd = data.datePayment[1] + 24*60*60*1000
        delete data.datePayment
      }
      if(data.dateCheck){
        data.dateCheckStart = data.dateCheck[0]
        data.dateCheckEnd = data.dateCheck[1] + 24*60*60*1000
        delete data.dateCheck
      }
      this.refreshTable(data)
    },
    handleSearchReset() {
      this.searchForm.resetFields()
      this.refreshTable()
    },
    handleVerificationClick() {
      this.componentName = 'DialogPaymentVerification'
      this.dialogStatus = true
    },
    handleRecoilClick(){
      let recoilPaymentType = queryDictValue('10061',this.rowData.paymentType)
      this.$confirm(`已选择：${this.rowData.projectName}/${recoilPaymentType}，确定反冲该期核销记录？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          recoilPayment({
            id: this.rowData.id
          }, { showLoading: true }).then(res => {
            this.$showToast('反冲成功！', 'success')
            this.refreshTable()
          }).catch(err => {
            console.log(err)
          })
        })
        .catch(() => {})
    },
    handleDetailClick() {
      this.componentName = 'DialogPaymentDetail'
      this.dialogStatus = true
    },
    handleAccountClick() {
      this.$showToast('别点啦！该功能还在路上~')
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data)
    }
  }
}

</script>

<style lang="scss">
.payment-mng-page{
  .file-name{
    color: #5595ff;
  }
}
</style>
