<template>
  <div class="white-bg mb-10">
    <div class="title">
      <i class="el-icon-s-data" />财务数据展示
    </div>
    <div class="content-wrap">
      <finance-bar ref="chartDom" class="mb-20" :chart-data="chartData" />
      <el-row class="text-right">
        <el-button type="primary" size="mini" @click="handleDownload">点击下载数据</el-button>
      </el-row>
      <table-create ref="tableDom" :options="tableOptions" border highlight-current-row />
    </div>
  </div>
</template>
<script>
import TableCreate from 'components/TableCreate/index'
import FinanceBar from './components/finance-bar'
import { getFinanceList } from 'api/customer-module/api-finance-contrast.js'
export default {
  components: {
    TableCreate,
    FinanceBar
  },
  data() {
    return {
      // 财务数据
      tableOptions: {
        showSerialNumber: true,
        showPagination: false,
        requestImmediate: false,
        columns: [
          { attrs: { label: '财报标题', prop: 'finStatementHeadline' } },
          { attrs: { label: '报告日期', prop: 'reportDate', minWidth: 90 }, filter: { name: 'date' } },
          { attrs: { label: '总资产（万元）', prop: 'totalAssets', minWidth: 120 }, filter: { name: 'toThousand' } },
          { attrs: { label: '净资产（万元）', prop: 'netAsset', minWidth: 120 }, filter: { name: 'toThousand' } },
          {
            attrs: { label: '营业收入（万元）', prop: 'operatingReceipt', minWidth: 120 },
            filter: { name: 'toThousand' }
          },
          { attrs: { label: '净利润（万元）', prop: 'netMargin', minWidth: 120 }, filter: { name: 'toThousand' } }
        ]
      },
      tableData: [],
      chartData: {}
    }
  },
  props: {
    financeIds: {
      type: Array,
      default: null
    }
  },
  inject: ['setDataFitChart', 'downloadCb'],
  watch: {
    financeIds(newIds) {
      this.init(newIds)
    }
  },
  created() {
    this.init(this.financeIds)
  },
  methods: {
    init(financeIds) {
      this.getFinanceData(financeIds)
    },
    // 获取财务数据
    getFinanceData(financeIds) {
      getFinanceList({
        ids: financeIds
      })
        .then(res => {
          const data = res.data.records
          const financeField = ['totalAssets', 'netAsset', 'operatingReceipt', 'netMargin', 'reportDate']
          const chartObj = this.setDataFitChart(data, financeField)
          this.tableData = data
          this.$nextTick(() => {
            this.$refs.tableDom.setData(data)
          })
          this.chartData = {
            xAxis: {
              data: chartObj.reportDate
            },
            series: [
              { name: '总资产', type: 'bar', barGap: 0, barMaxWidth: '10%', data: chartObj.totalAssets },
              { name: '净资产', type: 'bar', barGap: 0, barMaxWidth: '10%', data: chartObj.netAsset },
              { name: '营业收入', type: 'bar', barGap: 0, barMaxWidth: '10%', data: chartObj.operatingReceipt },
              { name: '净利润', type: 'bar', barGap: 0, barMaxWidth: '10%', data: chartObj.netMargin }
            ]
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 下载
    handleDownload() {
      const name = '财务数据'
      const fieldMap = [
        { field: 'finStatementHeadline', title: '财报标题' },
        { field: 'reportDate', title: '报告日期', type: 'date' },
        { field: 'totalAssets', title: '总资产（万元）', type: 'money' },
        { field: 'netAsset', title: '净资产（万元）', type: 'money' },
        { field: 'operatingReceipt', title: '营业收入（万元）', type: 'money' },
        { field: 'netMargin', title: '净利润（万元）', type: 'money' }
      ]
      const data = {
        name,
        tableData: this.tableData,
        fieldMap,
        baseString: this.$refs.chartDom._data.chart.getDataURL()
      }
      this.downloadCb(data)
    }
  }
}
</script>
