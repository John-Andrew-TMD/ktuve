<template>
  <el-card class="inner">
    <du-pont-line ref="chartDom" class="mb-20" :chart-data="chartData" />
    <el-row class="text-right">
      <el-button type="primary" size="mini" @click="handleGrowthDownload">点击下载数据</el-button>
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
import DuPontLine from './components/du-pont-line'
import { getGrowthList } from 'api/customer-module/api-finance-contrast.js'
export default {
  components: {
    TableCreate,
    DuPontLine
  },
  data() {
    return {
      // 成长能力指标
      tableOptions: {
        showSerialNumber: true,
        showPagination: false,
        requestImmediate: false,
        columns: [
          { attrs: { label: '报告日期', prop: 'reportDate', minWidth: 90 }, filter: { name: 'date' } },
          { attrs: { label: '总资产增长率', prop: 'assetGrowthRate', minWidth: 110 }, filter: { name: 'toThousand' } },
          {
            attrs: { label: '股东权益增长率', prop: 'equityGrowthRate', minWidth: 120 },
            filter: { name: 'toThousand' }
          },
          {
            attrs: { label: '固定资产增长率', prop: 'fixedAssetsGrowthRate', minWidth: 120 },
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
      this.getGrowthData(financeIds)
    },
    // 成长能力
    getGrowthData(ids) {
      getGrowthList(
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
            title: {
              text: '成长能力指标'
            },
            xAxis: {
              data: chartObj.reportDate
            },
            series: [
              { name: '总资产增长率', data: chartObj.assetGrowthRate, type: 'line' },
              { name: '股东权益增长率', data: chartObj.equityGrowthRate, type: 'line' },
              { name: '固定资产增长率', data: chartObj.fixedAssetsGrowthRate, type: 'line' }
            ]
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleGrowthDownload() {
      const name = '成长能力指标'
      const fieldMap = [
        { field: 'reportDate', title: '报告日期', type: 'date' },
        { field: 'assetGrowthRate', title: '总资产增长率', type: 'money' },
        { field: 'equityGrowthRate', title: '股东权益增长率', type: 'money' },
        { field: 'fixedAssetsGrowthRate', title: '固定资产增长率', type: 'money' }
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
