<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
import resize from 'mixins/chart-resize'

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
      default: '300px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      default: () => {}
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
    setOptions(chartData) {
      this.chart.setOption({
        color: ['#b72d2a'],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: chartData.xAxis,
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
        yAxis: {
          type: 'value',
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
        },
        grid: {
          top: 20,
          bottom: 50
        },
        series: [
          {
            data: chartData.data,
            name: '评级得分',
            // data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
          }
        ]
      })
    }
  }
}
</script>
