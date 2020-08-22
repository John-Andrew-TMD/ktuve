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
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions(options = {}) {
      const defaultOpt = {
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
            type: 'shadow'
          }
        },
        legend: {
          show: true,
          bottom: 0
        },
        xAxis: {
          type: 'category',
          data: [],
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
          name: '万元',
          nameGap: 20,
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
          containLabel: true,
          left: 0,
          right: 0,
          top: 40,
          bottom: 60
        },
        series: []
      }
      const opt = deepAssign({}, defaultOpt, options)
      this.chart.setOption(opt)
    }
  }
}
</script>
