<!-- 事业单位-资产负债表 -->
<template>
  <div class="comp-balance-sheet">
    <div class="left-area">
      <h3 class="title">资产负债表</h3>
      <p class="meta">
        <span>报告期：{{reportDate}}</span>
        <span>单位：元 币种：人民币</span>
      </p>
      <table border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th width="220">数据项名称</th>
            <th width="50">行次</th>
            <th width="120">期初余额</th>
            <th width="120">期末余额</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) of tableData" :key="index">
            <td
              :class="{bold: tatalRowsCode.includes(item.accountCode)}"
            >{{ item.accountName }}</td>
            <td class="gray">{{ +item.lineOn }}</td>
            <td class="text-center">{{ item.openingBalance | filterDigitDecimals(2, 2) }}</td>
            <td class="text-center">{{ item.closingBalance | filterDigitDecimals(2, 2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="right-area">
      <div class="right-area-item">
        <balance-sheet-bar ref="balanceSheetChartDom" :chart-data="balanceSheetData" />
      </div>
      <div class="right-area-item">
        <capital-pie ref="capitalPieDom" :chart-data="capitalPie" />
      </div>
      <div class="right-area-item">
        <debt-pie ref="debtDom" :chart-data="debtPie" />
      </div>
    </div>
  </div>
</template>

<script>
import { getBalanceSheet } from 'api/customer-module/api-customer-detail.js'
import BalanceSheetBar from './components/balance-sheet-bar'
import CapitalPie from './components/capital-pie'
import DebtPie from './components/debt-pie'
import { timestampFormat } from 'utils'

export default {
  components: {
    BalanceSheetBar,
    CapitalPie,
    DebtPie
  },
  props: {},
  data() {
    return {
      tatalRowsCode: [
        'BSB10010901',
        'BSB10020901',
        'BSB10020902',
        'BSB10031001',
        'BSB10040201',
        'BSB10040202',
        'BSB10050901',
        'BSB10050902'
      ],
      tableData: [],
      balanceSheetData: {},
      capitalPie: [],
      debtPie: []
    }
  },
  created() {
    this.getBalanceSheetData()
  },
  mounted() {},
  methods: {
    getBalanceSheetData() {
      getBalanceSheet({
        finConditionId: this.$route.query.id
      })
        .then(res => {
          if (res.data && Array.isArray(res.data.records) && res.data.records.length) {
            this.tableData = res.data.records
            // 流动资产、非流动资产、流动负债、非流动负债、资产总计
            const itemArr = ['BSB10010901', 'BSB10020901', 'BSB10031001', 'BSB10040201', 'BSB10020902']
            const tempArry = this.tableData.filter(item => itemArr.includes(item.accountCode))
            const finalTemp = []
            itemArr.forEach(item => {
              tempArry.map(x => {
                if (item == x.accountCode) {
                  finalTemp.push(x)
                  // 流动资产、非流动资产
                  if (['BSB10010901', 'BSB10020901'].includes(x.accountCode)) {
                    this.capitalPie.push(x.closingBalance)
                  }
                  // 流动负债、非流动负债
                  if (['BSB10031001', 'BSB10040201'].includes(x.accountCode)) {
                    this.debtPie.push(x.closingBalance)
                  }
                }
              })
            })
            const opening = []
            const closing = []
            finalTemp.map(item => {
              opening.push(item.openingBalance)
              closing.push(item.closingBalance)
            })
            this.balanceSheetData = {
              xAxis: {
                data: ['流动资产', '非流动资产', '流动负债', '非流动负债', '资产总计']
              },
              series: [
                {
                  name: '期初',
                  type: 'bar',
                  barGap: 0,
                  barMaxWidth: '30%',
                  data: opening
                },
                {
                  name: '期末',
                  type: 'bar',
                  barGap: 0,
                  barMaxWidth: '30%',
                  data: closing
                }
              ]
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  computed: {
    reportDate() {
      const reportDate = this.$route.query.reportDate
      return reportDate ? timestampFormat(reportDate, 'YYYY年MM月DD日') : 'XXXX 年 X 月 X 日'
    },
    companyType() {
      return this.$route.query.companyType
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

