<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
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
      default: '280px'
    },
    pieData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      chart: null
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
      let legendData = []
      this.chart = echarts.init(this.$el, 'macarons')
      this.pieData.forEach(item => {
        legendData.push({
          name: item.name,
          icon: 'circle'
        })
      })
      this.chart.setOption({
        color: ['#3AA0FF', '#36CBCB'],
        tooltip: {
          trigger: 'item',
          formatter: '{b}：{d}%',
          confine: true
        },
        legend: {
          left: 'center',
          bottom: '6%',
          data: legendData
        },
        series: [
          {
            type: 'pie',
            radius: '60%',
            center: ['50%', '40%'],
            label: {
              normal: {
                formatter: '{b} : {d}%'
              }
            },
            data: this.pieData
          }
        ]
      })
    }
  },
  watch: {
    pieData() {
      this.initChart()
    }
  }
}
</script>
