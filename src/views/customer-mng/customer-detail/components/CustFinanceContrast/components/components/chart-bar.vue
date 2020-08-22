<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/title')
import resize from 'mixins/chart-resize'
import { deepAssign } from 'utils'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      default: () => {}
    },
    titleText: {
      type: String,
      default: '营运能力指标'
    },
    tooltipType: {
      type: String,
      default: 'line'
    },
    iShowLegend: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions(options) {
      const barMaxWidth = '10'
      this.chart.setOption({
        title: {
          text: this.titleText,
          textStyle: {
            fontSize: 14,
            color: '#697289'
          },
          x: 'center',
          y: 'top'
        },
        color: [
          '#3AA0FF',
          '#4ECB73',
          '#FAD337',
          '#425087',
          '#8543E0',
          '#E66952'
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: this.tooltipType
          }
        },
        legend: {
          show: this.iShowLegend,
          bottom: 0
        },
        yAxis: {
          type: 'category',
          data: ['2018-1', '2018-2', '2018-3', '2018-4'],
          boundaryGap: true,
          axisTick: {
            alignWithLabel: true,
            lineStyle: {
              color: '#C1C1C1'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#545454',
              opacity: 0.3
            }
          }
        },
        xAxis: [
          {
            type: 'value',
            name: '',
            axisLine: {
              show: false
            },
            axisTick: {
              length: 0
            },
            splitLine: {
              lineStyle: {
                width: 1,
                type: 'dashed',
                color: '#ddd'
              }
            }
          }
        ],

        grid: {
          left: '10%',
          right: '5%',
          top: 40,
          bottom: 60
        },
        series: [
          {
            name: '总资产',
            type: 'bar',
            barGap: 0,
            barMaxWidth: barMaxWidth,
            data: [320, 100, 500, 600]
          },
          {
            name: '净资产',
            type: 'bar',
            barGap: 0,
            barMaxWidth: barMaxWidth,
            data: [400, 200, 232, 234]
          },
          {
            name: '营业收入',
            type: 'bar',
            barGap: 0,
            barMaxWidth: barMaxWidth,
            data: [300, 300, 700, 100]
          },
          {
            name: '净利润',
            type: 'bar',
            barGap: 0,
            barMaxWidth: barMaxWidth,
            data: [100, 500, 100, 350]
          }
        ]
      })
    }
  }
}
</script>
