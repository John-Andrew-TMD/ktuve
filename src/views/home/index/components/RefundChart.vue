<template>
  <div>
    <p>
      <span>回款总额：{{ refundAmount }}</span>
      <span>待回款总额：{{ stayRefundAmount }}</span>
    </p>
    <div class="chart-canvas">
      <div ref="refundChart"></div>
      <div ref="forRefundChart"></div>
    </div>
  </div>
</template>
<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/bar");
require("echarts/lib/component/tooltip");
import { thousandSeparator } from "utils";
import resize from "mixins/chart-resize";
import { isEmptyObj } from "utils";
export default {
  data() {
    return {
      refundAmount: "-",
      stayRefundAmount: "-",
      chart: null,
      chart1: null
    };
  },
  mixins: [resize],
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    data(obj) {
      if (!isEmptyObj(obj)) {
        this._setChartData(obj);
      } else {
        this.chart.clear();
        this.chart.hideLoading();
      }
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      this.refundChartOptions = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["回款金额", "剩余回款金额"],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: {
          name: "单位(万)",
          type: "value",
          splitLine: {
            lineStyle: {
              type: "dotted"
            }
          }
        },
        series: [
          {
            type: "bar",
            barWidth: "45%"
          }
        ]
      };
      this.forRefundChartOptions = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["待回款本金", "待回款利息"],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: {
          name: "单位(万)",
          type: "value",
          splitLine: {
            lineStyle: {
              type: "dotted"
            }
          }
        },
        series: [
          {
            type: "bar",
            barWidth: "45%"
          }
        ]
      };
      this.chart = echarts.init(this.$refs.refundChart);
      this.chart1 = echarts.init(this.$refs.forRefundChart);
      this.chart.showLoading({
        text: "正在加载数据..."
      });
      this.chart1.showLoading({
        text: "正在加载数据..."
      });
    },
    _setChartData(data) {
      this.refundAmount = thousandSeparator(data.amt_totalrefund);
      this.stayRefundAmount = thousandSeparator(data.amt_totalrepaid);
      this.refundChartOptions.series[0].data = [
        {
          value: data.amt_paymenthismonth,
          itemStyle: { color: "#f69" }
        },
        {
          value: data.amt_repaymenthismonth,
          itemStyle: { color: "#4aa1ff" }
        }
      ];

      this.forRefundChartOptions.series[0].data = [
        {
          value: data.amt_repaidprithismonth,
          itemStyle: { color: "#6c9" }
        },
        {
          value: data.amt_repaidintthismonth,
          itemStyle: { color: "#4aa1ff" }
        }
      ];

      this.chart.setOption(this.refundChartOptions);
      this.chart1.setOption(this.forRefundChartOptions);
      this.chart.hideLoading();
      this.chart1.hideLoading();
    }
  }
};
</script>
<style lang="scss" scoped>
.chart-canvas {
  font-size: 0;
  div {
    display: inline-block;
    width: 50%;
    height: 100%;
    p {
      text-align: left;
    }
  }
}

</style>


