<template>
  <div>
    <div class="chart-canvas">
      <div ref="contractPutInChart"></div>
      <div ref="capitalPutInChart"></div>
    </div>
  </div>
</template>
<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/pie");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/legend");
import resize from "mixins/chart-resize";
import { isEmptyObj } from "utils";
export default {
  data() {
    return {
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
      this.contractChartOptions = {
        legend: {
          orient: "vertical",
          bottom: "left",
          textStyle: {
            fontSize: 13
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "合同数",
            type: "pie",
            radius: "80%",
            center: ["50%", "45%"],
            startAngle: 135,
            label: {
              show: true,
              position: "inside",
              fontSize: 13
            },
            labelLine: {
              show: false
            },
            hoverAnimation: false,
            itemStyle: {
              emphasis: {
                shadowBlur: 0,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              borderColor: "#FFF",
              borderWidth: 1
            }
          }
        ]
      };
      this.capitalChartOptions = {
        legend: {
          orient: "vertical",
          bottom: "left",
          textStyle: {
            fontSize: 13
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "合同金额",
            type: "pie",
            radius: "80%",
            center: ["50%", "45%"],
            startAngle: 45,
            hoverAnimation: false,
            label: {
              show: true,
              position: "inside",
              fontSize: 13
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 0,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              borderColor: "#FFF",
              borderWidth: 1
            }
          }
        ]
      };
      this.chart = echarts.init(this.$refs.contractPutInChart);
      this.chart1 = echarts.init(this.$refs.capitalPutInChart);
      this.chart.showLoading({
        text: "正在加载数据..."
      });
      this.chart1.showLoading({
        text: "正在加载数据..."
      });
    },
    _setChartData(data) {
      this.contractChartOptions.series[0].data = [
        {
          value: data.to_contract_number,
          name: "待投放",
          itemStyle: { color: "#fc6" }
        },
        {
          value: data.used_contract_number,
          name: "已投放",
          itemStyle: { color: "#6c9" }
        }
      ];
      this.contractChartOptions.legend.formatter = name => {
        let res = this.contractChartOptions.series[0].data.filter(
          item => item.name === name
        );
        return (res.length && `${name}合同数量：${res[0].value}`) || "";
      };

      this.capitalChartOptions.series[0].data = [
        {
          value: data.to_amt_loan,
          name: "待投放",
          itemStyle: { color: "#fc6" }
        },
        {
          value: data.used_amt_loan,
          name: "已投放",
          itemStyle: { color: "#6c9" }
        }
      ];
      this.capitalChartOptions.legend.formatter = name => {
        let res = this.capitalChartOptions.series[0].data.filter(
          item => item.name === name
        );
        return (res.length && `${name}金额：${res[0].value}`) || "";
      };

      this.chart.setOption(this.contractChartOptions);
      this.chart1.setOption(this.capitalChartOptions);
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
  }
}

</style>


