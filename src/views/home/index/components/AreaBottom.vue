<template>
  <div class="area-bottom">
    <el-row type="flex" justify="space-between" class="top">
      <el-col>
        <h3>客户数据(承租人)</h3>
        <cust-chart class="chart-container" :data="custData" />
      </el-col>
      <el-col>
        <h3>项目数据</h3>
        <project-chart class="chart-container" :data="projectData" />
      </el-col>
      <el-col>
        <h3>投放数据</h3>
        <put-in-chart class="chart-container" :data="putInData" />
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" class="bottom">
      <el-col>
        <h3>回款数据（本月）</h3>
        <refund-chart class="chart-container" :data="refundData" />
      </el-col>
      <el-col>
        <h3>逾期数据</h3>
        <overdue-chart class="chart-container" :data="overdueData" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import CustChart from './CustChart'
import ProjectChart from './ProjectChart'
import PutInChart from './PutInChart'
import RefundChart from './RefundChart'
import overdueChart from './overdueChart'
export default {
  data() {
    return {
      custData: null,
      projectData: null,
      putInData: null,
      refundData: null,
      overdueData: null
    }
  },
  inject: ['setAretTopData'],
  components: {
    CustChart,
    ProjectChart,
    PutInChart,
    RefundChart,
    overdueChart
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$promiseRequest([
        {
          code: '200313',
          data: {
            objcode: '200313'
          }
        },
        {
          code: "213002",
          data: {
            objcode: "213002"
          }
        },
        {
          code: "213003",
          data: {
            objcode: "213003"
          }
        },
        {
          code: "213005",
          data: {
            objcode: "213005"
          }
        },
        {
          code: "213006",
          data: {
            objcode: "213006"
          }
        }
      ]).then(res => {
        let data = res.data
        if(data.length) {
          let [custData, projectData, putInData, refundData, overdueData] = data
          if(custData.record && custData.record.length) {
            this.custData = custData.record[0]
            this.setAretTopData({
              tenantIncreasedThisMonth: this.custData.currentmonth,
              tenantAccountThisYear: this.custData.currentyeas
            })
          } else {
            this.custData = {}
          }

          if(projectData.record && projectData.record.length) {
            this.projectData = projectData.record[0]
            this.setAretTopData({
              surveyIncreasedThisMonth: this.projectData.inquire_project,
              surveyAccountThisYear: this.projectData.inquire_project_year
            });
          } else {
            this.projectData = {}
          }

          if(putInData.record && putInData.record.length) {
            this.putInData = putInData.record[0]
          } else {
            this.putInData = {}
          }

          if(refundData.record && refundData.record.length) {
            this.refundData = refundData.record[0]
          } else {
            this.refundData = {}
          }

          if(overdueData.record && overdueData.record.length) {
            this.overdueData = overdueData.record[0]
          } else {
            this.overdueData = {}
          }
        }
      }).catch(err => {})
    }
  }
}
</script>
<style lang="scss">
  .home-page {
    .area-bottom {
      .el-col {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        height: 420px;
        margin-bottom: 15px;
        box-shadow: 0 0 5px rgba(176, 205, 255, .8);

        h3 {
          padding-left: 10px;
          font-size: 14px;
          font-weight: normal;
          line-height: 49px;
          border-bottom: 1px solid #E7F0FF;
        }
        .chart-container {
          position: relative;
          flex: 1;
          box-sizing: border-box;
          height: 100%;
          padding: 10px;

          p {
            line-height: 24px;
            text-align: center;
            span {
              padding: 0 15px;
              font-size: 12px;
            }
          }
          .chart-canvas {
            position: absolute;
            top: 10px;
            right: 10px;
            bottom: 10px;
            left: 10px;
          }
        }
      }

      .top {
        .el-col {
          width: 32%;
        }
      }

      .bottom {
        .el-col {
          width: 48.666666%;
        }
      }
    }

    @media screen and (max-width: 1350px) {
      .area-bottom {
        .bottom .el-col {
          width: 49.333333%;
        }
      }
    }

    @media screen and (max-width: 1150px) {
      .area-bottom {
        .top {
          flex-wrap: wrap;
          .el-col {
            width: 49.333333%;
          }
        }
      }
    }

    // @media screen and (max-width: 1060px) {
    //   .area-bottom {
    //     .bottom .el-col {
    //       width: 49%;
    //     }
    //   }
    // }

    @media screen and (max-width: 800px) {
      .area-bottom {
        .top, .bottom {
          flex-wrap: wrap;
          .el-col {
            width: 100%;
          }
        }
      }
    }
  }


</style>


