<template>
  <el-card class="inner">
    <profit-bar ref="chartDom" class="mb-20" :chart-data="chartData" />
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
import ProfitBar from './components/profit-bar'
import { getProfitList } from 'api/customer-module/api-finance-contrast.js'
export default {
  components: {
    TableCreate,
    ProfitBar
  },
  data() {
    return {
      // 盈利能力
      tableOptions: {
        showSerialNumber: true,
        showPagination: false,
        requestImmediate: false,
        columns: [
          { attrs: { label: '报告日期', prop: 'reportDate', minWidth: 90 }, filter: { name: 'date' } },
          {
            attrs: { label: '总资产收益率（ROA）（%）', prop: 'returnOnAssets', minWidth: 180 },
            filter: { name: 'toThousand' }
          },
          {
            attrs: { label: '盈余现金保障倍数', prop: 'surplusesOfCashSurpluses', minWidth: 120 },
            filter: { name: 'toThousand' }
          },
          {
            attrs: { label: '营业净利率(%)', prop: 'netInterestRate', minWidth: 120 },
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
      this.getProfitData(financeIds)
    },
    // 盈利能力
    getProfitData(ids) {
      getProfitList(
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
          const rightMax = Math.max.apply(null, chartObj.surplusesOfCashSurpluses)
          const max1 = Math.max.apply(null, chartObj.returnOnAssets)
          const max2 = Math.max.apply(null, chartObj.netInterestRate)

          this.chartData = {
            xAxis: {
              data: chartObj.reportDate
            },
            yAxis: [
              { name: '倍数(比例)', min: 0 },
              {
                type: 'value',
                name: '（%）',
                min: 0,
                max: max1 > max2 ? max1 : max2
              }
            ],
            series: [
              {
                name: '总资产收益率（ROA）（%）',
                type: 'bar',
                barGap: 0,
                barMaxWidth: '10%',
                data: chartObj.returnOnAssets
              },
              {
                name: '盈余现金保障倍数',
                type: 'bar',
                barGap: 0,
                barMaxWidth: '10%',
                data: chartObj.surplusesOfCashSurpluses
              },
              { name: '营业净利率(%)', type: 'bar', barGap: 0, barMaxWidth: '10%', data: chartObj.netInterestRate }
            ]
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDownload() {
      const name = '盈利能力指标'
      const fieldMap = [
        { field: 'reportDate', title: '报告日期', type: 'date' },
        { field: 'returnOnAssets', title: '总资产收益率（ROA）（%）', type: 'money' },
        { field: 'surplusesOfCashSurpluses', title: '盈余现金保障倍数', type: 'money' },
        { field: 'netInterestRate', title: '营业净利率(%)', type: 'money' }
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
