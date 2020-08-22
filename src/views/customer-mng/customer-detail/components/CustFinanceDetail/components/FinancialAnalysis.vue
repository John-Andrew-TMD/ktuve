<template>
  <div class="comp-financial-analysis">
    <div class="panel-header">
      <span class="text">财务分析</span>
    </div>
    <div class="kpi-list">
      <div v-if="isCompany" class="kpi-list-item">
        <h3>
          <span>杜邦分析</span>
        </h3>
        <div class="dupont-container">
          <b>{{ dupontAnalysis }}%</b>
          <span>权益净利率</span>
        </div>
      </div>
      <financial-analysis-item :data-list="debtPayingAbilityData" color="#fa3" title="偿债能力指标" />
      <financial-analysis-item
        v-if="isCompany"
        :data-list="profitAbilityData"
        color="#7a87ff"
        title="盈利能力指标"
      />
      <financial-analysis-item
        v-if="isCompany"
        :data-list="operationCapacityData"
        color="#1dccff"
        title="营运能力指标"
      />
      <financial-analysis-item :data-list="growthAbilityData" color="#00b3ff" title="成长能力状况" />
    </div>
  </div>
</template>

<script>
import { decimalsFormat } from 'utils'
import {
  getDebtPayingAbility,
  getProfitAbility,
  getOperationCapacity,
  getGrowthAbility
} from 'api/customer-module/api-customer-detail.js'
import FinancialAnalysisItem from './FinancialAnalysisItem.vue'
const DEBT_PAYING_ABILITY = [
  {
    name: 'assetLiabilityRatio',
    label: '资产负债率',
    value: '-'
  },
  {
    name: 'currentRatio',
    label: '流动比率',
    value: '-'
  },
  {
    name: 'quickRatio',
    label: '速动比率',
    value: '-'
  },
  {
    name: 'cashRatio',
    label: '现金比率',
    value: '-'
  },
  {
    name: 'cashFlowRatio',
    label: '现金流量比率',
    value: '-',
    include: [0]
  },
  {
    name: 'equityMultiplier',
    label: '权益乘数',
    value: '-',
    include: [0]
  },
  {
    name: 'timesInterestEarned',
    label: '利息保障倍数',
    value: '-',
    include: [0]
  }
]
const PROFIT_ABILITY = [
  {
    name: 'returnOnAssets',
    label: '总资产收益率（ROA）',
    value: '-'
  },
  {
    name: 'returnOnNetassets',
    label: '净资产收益率（ROE）',
    value: '-'
  },
  {
    name: 'surplusesOfCashSurpluses',
    label: '盈余现金保障倍数',
    value: '-'
  },
  {
    name: 'netOperatingInterestRate',
    label: '销售毛利率',
    value: '-'
  }
]
const OPERATION_CAPACITY = [
  {
    name: 'accountsReceivableTurnoverta',
    label: '应收账款周转天数',
    value: '-'
  },
  {
    name: 'inventoryTurnover',
    label: '存货周转天数',
    value: '-'
  },
  {
    name: 'accountsPayableTurnoverta',
    label: '应付账款周转天数',
    value: '-'
  },
  {
    name: 'turnoverOfTotalaassets',
    label: '总资产周转率（次）',
    value: '-'
  },
  {
    name: 'turnoverOfCurrentassets',
    label: '流动资产周转率（次）',
    value: '-'
  }
]
const GROWTH_ABLILITY = [
  {
    name: 'assetGrowthRate',
    label: '总资产增长率',
    value: '-'
  },
  {
    name: 'equityGrowthRate',
    label: '股东权益增长率',
    value: '-',
    include: [0]
  },
  {
    name: 'fixedAssetsGrowthRate',
    label: '固定资产增长率',
    value: '-'
  }
]
export default {
  components: {
    FinancialAnalysisItem
  },
  props: {},
  data() {
    return {
      dupontAnalysis: '-',
      debtPayingAbilityData: [], // 偿债能力
      profitAbilityData: [], // 盈利能力
      operationCapacityData: [], // 营运能力
      growthAbilityData: [], // 成长能力
      companyType: +this.$route.query.companyType
    }
  },
  created() {
    this.getDebtPayingAbilityData()
    this.getProfitAbilityData()
    this.getOperationCapacityData()
    this.getGrowthAbilityData()
  },
  methods: {
    getDebtPayingAbilityData() {
      getDebtPayingAbility({
        ids: [this.$route.query.id]
      })
        .then(res => {
          if (res.data && Array.isArray(res.data.records) && res.data.records.length) {
            const data = res.data.records[0]
            this.dupontAnalysis = decimalsFormat(data.dupontAnalysis)
            this.debtPayingAbilityData = DEBT_PAYING_ABILITY.filter(
              item => !item.include || (item.include && item.include.includes(this.companyType))
            ).map(item => {
              return {
                name: item.name,
                label: item.label,
                value:
                  item.name === 'assetLiabilityRatio'
                    ? decimalsFormat(data[item.name]) + '%'
                    : decimalsFormat(data[item.name])
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getProfitAbilityData() {
      getProfitAbility({
        ids: [this.$route.query.id]
      })
        .then(res => {
          if (res.data && Array.isArray(res.data.records) && res.data.records.length) {
            const data = res.data.records[0]
            this.profitAbilityData = PROFIT_ABILITY.map(item => {
              return {
                name: item.name,
                label: item.label,
                value:
                  item.name == 'surplusesOfCashSurpluses'
                    ? decimalsFormat(data[item.name])
                    : decimalsFormat(data[item.name]) + '%'
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getOperationCapacityData() {
      getOperationCapacity({
        ids: [this.$route.query.id]
      })
        .then(res => {
          if (res.data && Array.isArray(res.data.records) && res.data.records.length) {
            const data = res.data.records[0]
            this.operationCapacityData = OPERATION_CAPACITY.map(item => {
              return {
                name: item.name,
                label: item.label,
                value: decimalsFormat(data[item.name])
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getGrowthAbilityData() {
      getGrowthAbility({
        ids: [this.$route.query.id]
      })
        .then(res => {
          if (res.data && Array.isArray(res.data.records) && res.data.records.length) {
            const data = res.data.records[0]
            this.growthAbilityData = GROWTH_ABLILITY.filter(
              item => !item.include || (item.include && item.include.includes(this.companyType))
            ).map(item => {
              return {
                name: item.name,
                label: item.label,
                value: decimalsFormat(data[item.name])
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  computed: {
    // 企业类型是否企业
    isCompany() {
      return +this.$route.query.companyType === 0
    }
  }
}
</script>

<style lang='scss'>
.comp-financial-analysis {
  .kpi-list {
    display: flex;
    justify-content: flex-start;
    .kpi-list-item {
      margin-left: 20px;
      padding: 0 10px 10px;
      vertical-align: top;
      border: solid 1px #e6efff;
      border-radius: 10px;
      box-shadow: 0 0 3px #e6efff;
      h3 {
        font-size: 14px;
        font-weight: normal;
        line-height: 40px;
        color: #ff7799;
        &:before {
          display: inline-block;
          width: 7px;
          height: 7px;
          margin-right: 5px;
          content: '';
          border-radius: 50%;
          background: currentColor;
        }
        span {
          color: #666666;
        }
      }
      p {
        font-size: 14px;
        font-weight: 700;
        line-height: 24px;
        color: #666666;
        label {
          display: inline-block;
          width: 110px;
          font-size: 12px;
          font-weight: 400;
          text-align: right;
          color: #8f96a9;
        }
      }
    }
    .dupont-container {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      width: 120px;
      height: 120px;
      margin: 0 auto;
      color: #7e7cce;
      background: url('~@/assets/images/duPontBackground.png') no-repeat;
    }
  }
  .company {
    width: 50%;
  }
}
</style>
