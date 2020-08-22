<template>
  <div class="comp-balance-sheet">
    <div class="left-area">
      <h3 class="title">利润表</h3>
      <p class="meta">
        <span>报告期：{{reportDate}}</span>
        <span>单位：元      币种：人民币</span>
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
        <cash-pie ref="cashPieChartDom" :chart-data="cashPieData" />
      </div>
    </div>
  </div>
</template>

<script>
import { getCashFlowStatement } from 'api/customer-module/api-customer-detail.js'
import CashPie from './components/cash-pie'
import { timestampFormat } from 'utils'

export default {
  components: {
    CashPie
  },
  props: {},
  data() {
    return {
      tableData: [],
      tatalRowsCode: ['CF10010301', 'CF10040401', 'CF10020401', 'CF10020402', 'CF10030501', 'CF10040402', 'CF10050301', 'CF10060301', 'CF10060302', 'CF10070101', 'CF10080101'],
      cashPieData: []
    }
  },
  created() {
    this.getCashFlowStatementData()
  },
  mounted() {},
  methods: {
    getCashFlowStatementData() {
      getCashFlowStatement({
        finConditionId: this.$route.query.id
      }).then(res => {
        if (res.data && Array.isArray(res.data.records) && res.data.records.length) {
          this.tableData = res.data.records
          // 获取现金流量表中第一、二、三、四五、六大分类数值的百分比图，取本年累计数据
          const itemArr = ['CF10010301', 'CF10020401', 'CF10030501', 'CF10040401', 'CF10050301', 'CF10060301']
          const tempArry = this.tableData.filter(item => itemArr.includes(item.accountCode))
          tempArry.map(item => {
            this.cashPieData.push(item.accrualCurrent)
          })
        }
      }).catch(err => {
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
    border: solid 1px #E6EFFF;
    border-radius: 5px;
    box-shadow: 0 0 3px #E6EFFF;
    .title {
      font-size: 13px;
      line-height: 39px;
      text-align: center;
      border-bottom: solid 1px #F5F5F5;
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
        background: #F5F5F5;
      }
      tbody td {
        padding: 7px;
        border-bottom: 1px solid #F8F8F8;
      }
      .gray {
        text-align: center;
        background: #F5F5F5;
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
      border: solid 1px #E6EFFF;
      border-radius: 5px;
      box-shadow: 0 0 3px #E6EFFF;
    }
  }
}

</style>

