<template>
  <div>
    <p>
      <span>客户总数：{{custsNum}}</span>
      <span style="color: #f93">本月新增：{{increasedNum}}</span>
    </p>
    <div ref="custChart" class="chart-canvas"></div>
  </div>
</template>
<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line");
require("echarts/lib/component/title");
require("echarts/lib/component/markPoint");
import resize from "mixins/chart-resize";
import { isEmptyObj } from "utils";
export default {
  data() {
    return {
      custsNum: "-",
      increasedNum: "-",
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
        this._setChartData(obj)
      } else {
        this.chart.clear()
        this.chart.hideLoading()
      }
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      let chartOptions = {
        title: {
          left: "center",
          bottom: 0,
          text: `${new Date().getFullYear()}年每月新增客户（承租人）走势图`,
          textStyle: {
            fontWeight: "normal",
            fontSize: 14
          }
        },
        xAxis: {
          type: "category",
          data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
          nameTextStyle: {
            color: "#666666"
          },
          axisTick: {
            interval: 0
          }
        },
        yAxis: {
          name: "单位(个)",
          type: "value",
          minInterval: 1,
          splitLine: {
            lineStyle: {
              type: "dotted"
            }
          }
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "10%",
          containLabel: true
        },
        series: [
          {
            data: [],
            type: "line",
            itemStyle: {
              color: "#5BA4FF",
              borderWidth: "5",
              borderColor: "#5BA4FF",
              borderType: "solid"
            },
            lineStyle: {
              width: 2
            },
            markPoint: {
              symbol: "circle",
              symbolSize: 25,
              label: {
                show: true
              },
              itemStyle: {
                color: "#FF9933",
                borderColor: "#FFD6AD",
                borderWidth: 3
              },
              data: []
            }
          }
        ]
      };
      this.chart = echarts.init(this.$refs.custChart);
      this.chart.setOption(chartOptions);
      this.chart.showLoading({
        text: "正在加载数据..."
      });
    },
    _setChartData(data) {
      this.custsNum = data.total;
      this.increasedNum = data.currentmonth;
      this.chart.setOption({
        series: [
          {
            data: data.everymonth.split(","),
            markPoint: {
              data: [
                {
                  value: data.currentmonth,
                  coord: [new Date().getMonth() + 1, data.currentmonth]
                }
              ]
            }
          }
        ]
      });
      this.chart.hideLoading();
    }
  }
};
</script>

