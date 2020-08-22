<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
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
				title: {
					text: '现金流量图',
					textStyle: {
            fontSize: 14,
            fontWeight: 'bolder',
          }
				},
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c} ({d}%)'
				},
        color: [
          '#3AA0FF',
          '#4ECB73',
          '#FAD337',
          '#425087',
          '#8543E0',
          '#E66952'
        ],
        legend: {
          show: true,
          bottom: 0
        },
        series: [
        	{
						name:'',
						type: 'pie',
						radius: '40%',
						center: ['50%', '50%'],
						data: [
							{value: this.chartData[0], name: '经营活动现金流入小计'},
							{value: this.chartData[1], name: '经营活动现金流出小计'},
							{value: this.chartData[2], name: '投资活动现金流入小计'},
							{value: this.chartData[3], name: '投资活动现金流出小计'},
							{value: this.chartData[4], name: '筹资活动现金流入小计'},
							{value: this.chartData[5], name: '筹资活动现金流出小计'}
						],
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}
				]
      }
      const opt = deepAssign({}, defaultOpt, options)
      this.chart.setOption(opt)
    }
  }
}
</script>