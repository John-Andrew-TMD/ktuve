<template>
  <el-row type="flex" justify="space-between" class="area-top">
    <el-col :span="5">
      <div class="area-top_item">
        <div class="icon">
          <i class="iconfont icon-backlog" />
          <span>待办</span>
        </div>
        <data-statisic :num="areaTopData.backlog" title="我的待办" />
        <div class="data" />
      </div>
    </el-col>
    <el-col :span="5">
      <div class="area-top_item">
        <div class="icon tenant">
          <i class="iconfont icon-tenant" />
          <span>承租人</span>
        </div>
        <data-statisic :num="areaTopData.tenantIncreasedThisMonth" title="本月新增" />
        <data-statisic :num="areaTopData.tenantAccountThisYear" title="本年累计" />
      </div>
    </el-col>
    <el-col :span="5">
      <div class="area-top_item">
        <div class="icon survey">
          <i class="iconfont icon-survey" />
          <span>尽调</span>
        </div>
        <data-statisic :num="areaTopData.surveyIncreasedThisMonth" title="本月新建" />
        <data-statisic :num="areaTopData.surveyAccountThisYear" title="本年累计" />
      </div>
    </el-col>
    <el-col :span="5">
      <div class="area-top_item">
        <div class="icon contract">
          <i class="iconfont icon-list" />
          <span>合同</span>
        </div>
        <data-statisic :num="areaTopData.contractIncreasedThisMonth" title="本月新增" />
        <data-statisic :num="areaTopData.contractAccountThisYear" title="本年累计" />
      </div>
    </el-col>
  </el-row>
</template>
<script>
import DataStatisic from './AreaTopDataStatisic'
export default {
  components: {
    DataStatisic
  },
  props: {
    areaTopData: {
      type: Object
    }
  },
  data() {
    return {
      contractIncreasedThisMonth: '-',
      contractAccountThisYear: '-'
    }
  }
}
</script>
<style lang="scss">
  .home-page {
    .area-top {
      .el-col-5 {
        width: 23%;
      }

      .el-col {
        height: 120px;
        margin-bottom: 15px;
        border-radius: 10px;
        box-shadow: 0 0 5px rgba(176, 205, 255, .8);
      }

      .area-top_item {
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 100%;
        padding: 0 15px;

        .icon {
          box-sizing: content-box;
          width: 60px;
          height: 60px;
          text-align: center;
          color: #FFFFFF;
          border: 8px solid #F6D0AD;
          border-radius: 50%;
          background: #FF9933;

          i {
            display: block;
            margin: 8px auto 1px;
            font-size: 20px;
          }
          span {
            margin-left: 0;
          }
        }

        .tenant {
          border: 8px solid #B8E5D6;
          background: #6ECBA4;
        }

        .survey {
          border: 8px solid #C2D7FF;
          background: #1890FF;
        }

        .contract {
          border: 8px solid #F5BCD6;
          background: #FF6699;
        }

        .data {
          margin-left: 30px;
          text-align: center;

          .data-num {
            display: block;
            margin-bottom: 2px;
            font-size: 28px;
            font-weight: normal;
          }
        }
      }
    }

    @media screen and (max-width: 1460px) {
      .area-top {
        .el-col-5 {
          width: 24%;
          .area-top_item {
            padding: 0 10px;
            .data {
              margin-left: 15px;
            }
          }
        }
      }
    }

    @media screen and (max-width: 1250px) {
      .area-top {
        flex-wrap: wrap;

        .el-col-5 {
          width: 49%;
          .area-top_item {
            padding: 0 5px;

            .data {
              margin-left: 30px;
            }
          }
        }
      }
    }
  }

</style>

