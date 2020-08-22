<template>
  <el-card class="inner">
    <du-pont-line ref="chartDom" class="mb-20" :chart-data="chartData" />
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
import DuPontLine from './components/du-pont-line'
export default {
  components: {
    TableCreate,
    DuPontLine
  },
  data() {
    return {
      // 杜邦分析
      tableOptions: {
        showSerialNumber: true,
        showPagination: false,
        requestImmediate: false,
        columns: [
          { attrs: { label: '报告日期', prop: 'reportDate' }, filter: { name: 'date' } },
          { attrs: { label: '权益净利率（%）', prop: 'dupontAnalysis' }, filter: { name: 'toThousand' } }
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
      // 杜邦分析
      const chartObj = this.setDataFitChart(data)
      this.tableData = data
      this.$nextTick(() => {
        this.$refs.tableDom.setData(data)
      })
      this.chartData = {
        xAxis: {
          data: chartObj.reportDate
        },
        series: [{ name: '权益净利率（%）', data: chartObj.dupontAnalysis, type: 'line' }]
      }
    },

    handleDownload() {
      const name = '杜邦分析'
      const fieldMap = [
        { field: 'reportDate', title: '报告日期', type: 'date' },
        { field: 'dupontAnalysis', title: '权益净利率（%）', type: 'money' }
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
