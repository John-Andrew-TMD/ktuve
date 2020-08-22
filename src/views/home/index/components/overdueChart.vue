<template>
  <div>
    <div class="chart-canvas">
      <div class="left">
        <div class="left-container">
          <img src="@/assets/images/clock.png" />
          <span>
            逾期笔数：
            <b>{{ overDueNum }}</b>笔
          </span>
        </div>
      </div>
      <div class="right" ref="overdueChart"></div>
    </div>
  </div>
</template>
<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/bar");
require("echarts/lib/component/tooltip");
import resize from "mixins/chart-resize";
import { isEmptyObj } from "utils";
export default {
  data() {
    return {
      overDueNum: "-",
      chart: null
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
      this.overdueChartOptions = {
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
            data: ["逾期本金", "逾期利息", "总罚息"],
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
            barWidth: "55%"
          }
        ]
      };
      this.chart = echarts.init(this.$refs.overdueChart);
      this.chart.showLoading({
        text: "正在加载数据..."
      });

    },
    _setChartData(data) {
      this.overDueNum = data.overdue_num;
      this.overdueChartOptions.series[0].data = [
        {
          value: data.sum_principal,
          itemStyle: {
            color: "#f69"
          }
        },
        {
          value: data.sum_interest,
          itemStyle: {
            color: "#4aa1ff"
          }
        },
        {
          value: data.sum_amt_confirm,
          itemStyle: {
            color: "#6c9"
          }
        }
      ];

      this.chart.setOption(this.overdueChartOptions);
      this.chart.hideLoading();
    }
  }
};
</script>
<style lang="scss" scoped>
.chart-canvas {
  display: flex;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35%;
    padding-right: 15px;

    .left-container {
      box-sizing: border-box;
      padding: 25px 5px;
      font-size: 14px;
      text-align: center;
      border: 1px solid #FF3333;
      border-radius: 10px;
      box-shadow: 4px 4px 5px rgba(255, 51, 51, .2);

      img {
        display: block;
        max-width: 50%;
        margin: 0 auto 5px;
      }

      b {
        padding: 0 5px;
        font-size: 28px;
      }
    }
  }
  .right {
    width: 65%;
  }
}

</style>


