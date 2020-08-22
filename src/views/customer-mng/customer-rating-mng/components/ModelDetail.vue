<template>
  <div class="cust-detail-rating-page">
    <div v-if="ratingInfo" class="content">
      <div class="section-top">
        <div class="item">
          <div class="g-sub-title bd-bottom mb-20">
            <span class="text">当前评级</span>
          </div>
          <div class="content-body text-center">
            <el-row class="level-wrap" type="flex" justify="center">
              <el-col :span="5">
                <p>评定等级</p>
                <b>{{ ratingInfo.evaluateLevel | formatText }}</b>
              </el-col>
              <el-col :span="5">
                <p>总得分</p>
                <b>{{ ratingInfo.totalScore | formatText }}</b>
              </el-col>
              <el-col :span="5">
                <p>信用提示</p>
                <b>{{ ratingInfo.creditSuggest | formatText }}</b>
              </el-col>
              <el-col :span="5">
                <p>定性指标得分</p>
                <b>{{ ratingInfo.changeScore | formatText }}</b>
              </el-col>
              <el-col :span="5">
                <p>定量指标得分</p>
                <b>{{ ratingInfo.regularScore | formatText }}</b>
              </el-col>
            </el-row>
            <div class="info-wrap">
              <span>评分人：{{ ratingInfo.creatorName | formatText }}</span>
              <span>评分时间：{{ ratingInfo.sysEtime | filterTimestamp }}</span>
              <span>评级状态：{{ratingInfo.evaluateStatus | filterDictValue('10022')}}</span>
            </div>
            <div class="btns-wrap">
              <el-button
                type="success"
                round
                size="medium"
                @click="navigateToRatingScore(ratingInfo)"
              >评分详情描述</el-button>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="g-sub-title bd-bottom mb-20">
            <span class="text">评级走势</span>
          </div>
          <div class="content-body">
            <chart-line v-if="historyGrade" :chart-data="historyGrade" />
          </div>
        </div>
      </div>
      <div class="section-bottom">
        <div class="g-sub-title bd-bottom mb-20">
          <span class="text">历史评级</span>
        </div>
        <table-create ref="tableDom" :options="tableOptions" border highlight-current-row>
          <template v-slot:opeartion="slotScope">
            <el-button
              type="primary"
              plain
              @click="navigateToRatingScore(slotScope.scope.row)"
            >评分详情描述</el-button>
          </template>
        </table-create>
      </div>
    </div>
    <div v-else class="no-data">
      <div class="no-data-top" />
      <p class="no-data-text">您还没有录入相关信息</p>
    </div>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import ChartLine from './ModelDetailChartLine'
import { getRatingDetail, getHistoryRating } from 'api/customer-module/api-customer-rating-mng.js'
import { parseTime } from 'utils'

export default {
  filters: {
    formatText(val) {
      if (!val && val !== 0) return '--'
      return val
    }
  },
  components: {
    TableCreate,
    ChartLine
  },
  data() {
    return {
      tableOptions: {
        requestImmediate: false,
        showPagination: false,
        showSerialNumber: true,
        columns: [
          { attrs: { label: '定性指标得分', prop: 'changeScore', minWidth: 95 } },
          { attrs: { label: '定量指标得分', prop: 'regularScore', minWidth: 95 } },
          { attrs: { label: '总得分', prop: 'totalScore' } },
          { attrs: { label: '评定等级', prop: 'evaluateLevel' } },
          { attrs: { label: '信用提示', prop: 'creditSuggest' } },
          { attrs: { label: '选用模型', prop: 'modelName' } },
          { attrs: { label: '评分人', prop: 'creatorName' } },
          {
            attrs: { label: '评分日期', prop: 'sysEtime', minWidth: 90 },
            filter: { name: 'date' }
          },
          {
            attrs: { label: '评级状态', prop: 'evaluateStatus' },
            filter: { name: 'dict', params: '10022' }
          },
          { attrs: { label: '操作', prop: 'opeartion', minWidth: 120 }, slot: 'opeartion' }
        ]
      },
      ratingInfo: null,
      historyGrade: null
    }
  },
  created() {
    this.getRatingDetailData()
  },
  methods: {
    // 查询历史评级
    getHistoryRatingData() {
      getHistoryRating({ custId: this.$route.query.id })
        .then(res => {
          const data = res.data.records
          this.setGradeChartData(data)
          this.$nextTick(() => {
            this.$refs.tableDom.setData(data)
          })
        })
        .catch(err => {
          this.$nextTick(() => {
            this.$refs.tableDom.setData([])
          })
          console.log(err)
        })
    },
    // 处理数据符合图表数据格式
    setGradeChartData(data) {
      if (!data || !data.length) return
      const oData = {
        xAxis: [],
        data: []
      }
      data.forEach(item => {
        oData.xAxis.push(parseTime(item.sysEtime, '{y}-{m}-{d}'))
        oData.data.push(item.totalScore || 0)
      })
      this.historyGrade = oData
    },
    // 评价详情信息
    getRatingDetailData() {
      getRatingDetail({
        id: this.$route.query.id
      })
        .then(res => {
          if (!res.data) return
          this.ratingInfo = res.data
          this.getHistoryRatingData()
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 页面跳转
    navigateToRatingScore(data) {
      this.$router.push({
        path: '/customer-mng/customer-rating-score',
        query: {
          id: data.id,
          cust_id: data.custId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cust-detail-rating-page {
  .no-data {
    padding-top: 100px;
    .no-data-top {
      height: 160px;
      background: url('~@/assets/images/no-data-img.png') no-repeat center 0;
    }
    .no-data-text {
      padding: 20px 0;
      text-align: center;
    }
  }
  .text {
    position: relative;
    display: block;
    padding-bottom: 10px;
    padding-left: 10px;
    line-height: 1.4;
    border-bottom: 1px solid #f2f2f2;
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 20px;
      content: '';
      border-left: 3px solid #5595ff;
    }
  }
  .section-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    border-bottom: 1px solid #f2f2f2;
    .item {
      width: 49.8%;
      padding: 10px;
      background: #ffffff;
      &:first-child {
        .level-wrap {
          border-bottom: 1px solid #f1f4f5;
        }
        .el-col {
          padding-bottom: 20px;
          line-height: 2;
          p {
            padding-bottom: 10px;
            font-size: 13px;
            color: #a1a1a1;
          }
          b {
            font-size: 28px;
            font-weight: normal;
            color: #ff9933;
            text-shadow: 0px 0px 3px rgba(161, 161, 161, 0.6);
          }
        }
        .info-wrap {
          padding: 30px 0 40px;
          span {
            margin: 0 22px;
            color: #5b6377;
          }
        }
        .btns-wrap {
          padding-bottom: 30px;
          .el-button {
            padding: 15px 40px;
            border-radius: 50px;
          }
        }
      }
    }
  }
  .section-bottom {
    padding: 10px;
    background: #ffffff;
  }
}
</style>
