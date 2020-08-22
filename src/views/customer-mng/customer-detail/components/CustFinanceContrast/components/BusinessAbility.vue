<template>
  <el-card class="inner">
    <business-bar ref="chartDom" class="mb-20" :chart-data="chartData" />
    <el-row class="text-right">
      <el-button type="primary" size="mini" @click="handleDownload">点击下载数据</el-button>
    </el-row>
    <table-create
      ref="tableDom"
      :options="tableOptions"
      :data="tableData"
      border
      highlight-current-row
    />
  </el-card>
</template>
<script>
import TableCreate from 'components/TableCreate/index'
import BusinessBar from './components/business-bar'
import { getBusinessList } from 'api/customer-module/api-finance-contrast.js'

export default {
  components: {
    TableCreate,
    BusinessBar
  },
  data() {
    return {
      // 运营能力
      tableOptions: {
        showSerialNumber: true,
        showPagination: false,
        requestImmediate: false,
        columns: [
          { attrs: { label: '报告日期', prop: 'reportDate', minWidth: 90 }, filter: { name: 'date' } },
          {
            attrs: { label: '应收账款周转天数', prop: 'accountsReceivableTurnoverta', minWidth: 130 },
            filter: { name: 'toThousand' }
          },
          {
            attrs: { label: '应付账款周转天数', prop: 'accountsPayableTurnoverta', minWidth: 130 },
            filter: { name: 'toThousand' }
          },
          {
            attrs: { label: '存货周转天数', prop: 'inventoryTurnover', minWidth: 110 },
            filter: { name: 'toThousand' }
          },
          {
            attrs: { label: '总资产周转率（次）', prop: 'turnoverOfTotalaassets', minWidth: 130 },
            filter: { name: 'toThousand' }
          },
          {
            attrs: { label: '流动资产周转率（次）', prop: 'turnoverOfCurrentassets', minWidth: 150 },
            filter: { name: 'toThousand' }
          }
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
      this.getBusinessData(financeIds)
    },
    // 运营能力
    getBusinessData(ids) {
      getBusinessList(
        {
          ids
        },
        { showLoading: false }
      )
        .then(res => {
          const data = res.data.records
          const chartObj = this.setDataFitChart(data)
          this.tableData = data
          this.$nextTick(() => {
            this.$refs.tableDom.setData(data)
          })
          this.chartData = {
            yAxis: {
              data: chartObj.reportDate
            },
            series: [
              {
                name: '应收账款周转天数',
                type: 'bar',
                barGap: 0,
                barMaxWidth: '10%',
                data: chartObj.accountsReceivableTurnoverta
              },
              {
                name: '应付账款周转天数',
                type: 'bar',
                barGap: 0,
                barMaxWidth: '10%',
                data: chartObj.accountsPayableTurnoverta
              },
              {
                name: '存货周转天数',
                type: 'bar',
                barGap: 0,
                barMaxWidth: '10%',
                data: chartObj.inventoryTurnover
              },
              {
                name: '总资产周转率（次）',
                type: 'bar',
                barGap: 0,
                barMaxWidth: '10%',
                data: chartObj.turnoverOfTotalaassets
              },
              {
                name: '流动资产周转率（次）',
                type: 'bar',
                barGap: 0,
                barMaxWidth: '10%',
                data: chartObj.turnoverOfCurrentassets
              }
            ]
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDownload() {
      const name = '运营能力指标'
      const fieldMap = [
        { field: 'reportDate', title: '报告日期', type: 'date' },
        { field: 'accountsReceivableTurnoverta', title: '应收账款周转天数', type: 'money' },
        { field: 'accountsPayableTurnoverta', title: '应付账款周转天数', type: 'money' },
        { field: 'inventoryTurnover', title: '存货周转天数', type: 'money' },
        { field: 'turnoverOfTotalaassets', title: '总资产周转率（次）', type: 'money' },
        { field: 'turnoverOfCurrentassets', title: '流动资产周转率（次）', type: 'money' }
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
