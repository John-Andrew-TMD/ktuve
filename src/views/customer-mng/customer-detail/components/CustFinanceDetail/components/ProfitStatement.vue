<template>
  <div class="comp-balance-sheet">
    <div class="left-area">
      <h3 class="title">利润表</h3>
      <p class="meta">
        <span>报告期：{{reportDate}}</span>
        <span>单位：元 币种：人民币</span>
      </p>
      <table border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th width="220">数据项名称</th>
            <th width="50">行次</th>
            <th width="120">期末余额</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) of tableData" :key="index">
            <td :class="{bold: tatalRowsCode.includes(item.accountCode)}">{{ item.accountName }}</td>
            <td class="gray">{{ +item.lineOn }}</td>
            <td class="text-center">{{ item.accrualCurrent | filterDigitDecimals(2, 2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="right-area">
      <div class="right-area-item">
        <cost-pie ref="costPieChartDom" :chart-data="costPieData" />
      </div>
    </div>
  </div>
</template>

<script>
import { getProfitStatement } from 'api/customer-module/api-customer-detail.js'
import CostPie from './components/cost-pie'
import { timestampFormat } from 'utils'

export default {
  components: {
    CostPie
  },
  props: {},
  data() {
    return {
      tableData: [],
      tatalRowsCode: ['IS100101', 'IS100301', 'IS100401', 'IS100501'],
      costPieData: []
    }
  },
  created() {
    this.getProfitStatementData()
  },
  mounted() {},
  methods: {
    getProfitStatementData() {
      getProfitStatement({
        finConditionId: this.$route.query.id
      })
        .then(res => {
          if (res.data && Array.isArray(res.data.records) && res.data.records.length) {
            this.tableData = res.data.records
            // 获取营业成本、营业税金及附加、销售费用、管理费用、财务费用，取本年累计数据
            const itemArr = ['IS100201', 'IS100202', 'IS100203', 'IS100204', 'IS100205']
            const tempArry = this.tableData.filter(item => itemArr.includes(item.accountCode))
            tempArry.map(item => {
              this.costPieData.push(item.accrualCurrent)
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  computed: {
    reportDate() {
      const timestamp = this.$route.query.reportDate
      return timestamp ? timestampFormat(timestamp, 'YYYY年MM月DD日') : 'XXXX 年 X 月 X 日'
    }
  }
}
</script>

<style lang='scss' scoped>
.comp-balance-sheet {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  .left-area {
    flex: 1;
    padding: 0 10px 10px;
    border: solid 1px #e6efff;
    border-radius: 5px;
    box-shadow: 0 0 3px #e6efff;
    .title {
      font-size: 13px;
      line-height: 39px;
      text-align: center;
      border-bottom: solid 1px #f5f5f5;
    }
    .meta {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      line-height: 39px;
    }
    table {
      width: 100%;
      table-layout: fixed;
      font-size: 12px;
      thead th {
        height: 40px;
        font-size: 13px;
        font-weight: normal;
        background: #f5f5f5;
      }
      tbody td {
        padding: 7px;
        border-bottom: 1px solid #f8f8f8;
      }
      .gray {
        text-align: center;
        background: #f5f5f5;
      }
      .bold {
        font-size: 13px;
        font-weight: 700;
      }
    }
  }
  .right-area {
    flex-shrink: 0;
    width: 500px;
    margin-left: 10px;
    padding: 0 10px 10px;
    .right-area-item {
      margin-bottom: 10px;
      padding: 10px;
      border: solid 1px #e6efff;
      border-radius: 5px;
      box-shadow: 0 0 3px #e6efff;
    }
  }
}
</style>

