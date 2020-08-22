<template>
  <el-card class="inner">
    <debt-line ref="chartDom" class="mb-20" :chart-data="chartData" />
    <el-row class="text-right">
      <el-button type="primary" size="mini" @click="handleDownload">点击下载数据</el-button>
    </el-row>
    <table-create ref="tableDom" :options="tableOptions" border highlight-current-row />
  </el-card>
</template>
<script>
import TableCreate from 'components/TableCreate/index'
import DebtLine from './components/debt-line'
export default {
  components: {
    TableCreate,
    DebtLine
  },
  data() {
    return {
      // 偿债能力
      tableOptions: {
        showSerialNumber: true,
        showPagination: false,
        requestImmediate: false,
        columns: [
          { attrs: { label: '报告日期', prop: 'reportDate', minWidth: 90 }, filter: { name: 'date' } },
          {
            attrs: { label: '资产负债率(%)', prop: 'assetLiabilityRatio', minWidth: 110 },
            filter: { name: 'toThousand' }
          },
          { attrs: { label: '流动比率', prop: 'currentRatio' }, filter: { name: 'toThousand' } },
          { attrs: { label: '速动比率', prop: 'quickRatio' }, filter: { name: 'toThousand' } },
          { attrs: { label: '现金流量比率', prop: 'cashFlowRatio', minWidth: 110 }, filter: { name: 'toThousand' } },
          { attrs: { label: '权益乘数', prop: 'equityMultiplier' }, filter: { name: 'toThousand' } }
        ]
      },
      tableData: [],
      chartData: {}
    }
  },
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  inject: ['setDataFitChart', 'downloadCb'],
  watch: {
    data(newArray) {
      this.initData(newArray)
    }
  },
  methods: {
    initData(data) {
      const chartObj = this.setDataFitChart(data)
      // const max = parseInt(Math.max(...chartObj.property_right_ratio)) + 5
      this.tableData = data
      this.$nextTick(() => {
        this.$refs.tableDom.setData(data)
      })
      this.chartData = {
        title: {
          text: '偿债能力指标'
        },
        yAxis: [
          {},
          {
            /**max: max */
          }
        ],
        xAxis: {
          data: chartObj.reportDate
        },
        series: [
          { name: '资产负债率(%)', type: 'line', yAxisIndex: 1, data: chartObj.assetLiabilityRatio },
          { name: '流动比率', type: 'line', data: chartObj.currentRatio },
          { name: '速动比率', type: 'line', data: chartObj.quickRatio },
          { name: '现金流量比率', type: 'line', data: chartObj.cashFlowRatio },
          { name: '权益乘数', type: 'line', data: chartObj.equityMultiplier }
        ]
      }
    },
    handleDownload() {
      const name = '偿债能力指标'
      const fieldMap = [
        { field: 'reportDate', title: '报告日期', type: 'date' },
        { field: 'assetLiabilityRatio', title: '资产负债率（%）', type: 'money' },
        { field: 'currentRatio', title: '流动比率', type: 'money' },
        { field: 'quickRatio', title: '速动比率', type: 'money' },
        { field: 'cashFlowRatio', title: '现金流量比率', type: 'money' },
        { field: 'equityMultiplier', title: '权益乘数', type: 'money' }
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
