<template>
  <div>
    <p>
      <span>项目总数：{{ projectNum }}</span>
      <span>自营：{{ proprietaryTradingNum }}</span>
      <span>公司：{{ companyNum }}</span>
    </p>
    <div ref="projectChart" class="chart-canvas"></div>
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
      projectNum: "-",
      proprietaryTradingNum: "-",
      companyNum: "-",
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
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          formatter: "{c0}个"
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
            data: ["立项中", "尽调中", "合同中", "投放中"],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: {
          name: "单位(个)",
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
      this.chart = echarts.init(this.$refs.projectChart);
      this.chart.setOption(chartOptions);
      this.chart.showLoading({
        text: "正在加载数据..."
      });
    },
    _setChartData(data) {
      this.projectNum = data.totel_number;
      this.proprietaryTradingNum = data.self_number;
      this.companyNum = data.company_number;
      this.chart.setOption({
        series: [
          {
            data: [
              {
                value: data.approve_project,
                itemStyle: {
                  color: "#FF6699"
                }
              },
              {
                value: data.inquire_project,
                itemStyle: {
                  color: "#4AA1FF"
                }
              },
              {
                value: data.not_placement,
                itemStyle: {
                  color: "#66CC99"
                }
              },
              {
                value: data.placemented,
                itemStyle: {
                  color: "#FFCC66"
                }
              }
            ]
          }
        ]
      });
      this.chart.hideLoading();
    }
  }
};
</script>

