<template>
  <div class="app-content app-content--quote customer-finance-detail-page">
    <quote icon="customer" text="客户财务数据详情">
      <template v-slot:left>
        <div class="quote-left">
          客户名称：{{routeParams.custName}} | 财报标题：{{routeParams.finStatementHeadline}}
          <el-tag>{{reportDetailedType}}</el-tag>
        </div>
      </template>
    </quote>
    <div class="app-content-wrapper">
      <!-- 财务分析  -->
      <financial-analysis />
      <div class="panel-header" style="margin: 10px 0 0">
        <span class="text">报告详情</span>
      </div>
      <el-tabs v-model="componentName">
        <el-tab-pane
          v-for="(item,index) in tabsList"
          :key="index"
          :label="item.tabsName"
          :name="item.compName"
          :lazy="true"
        />
      </el-tabs>
      <div class="component-container">
        <component :is="componentName" />
      </div>
    </div>
  </div>
</template>

<script>
import Quote from 'components/Quote/index'
const TAB_LIST = [
  { tabsName: '资产负债表', compName: 'BalanceSheet' }, // 企业
  { tabsName: '利润表', compName: 'ProfitStatement' },
  { tabsName: '现金流量表', compName: 'CashFlowStatement' },
  { tabsName: '资产负债表', compName: 'BalanceSheetInstitution' }, // 事业单位
  { tabsName: '收入支出表', compName: 'IncomeExpense' },
  { tabsName: '财务报告附件', compName: 'FinancialReportAttachment' }
]
export default {
  components: {
    Quote,
    FinancialAnalysis: () => import('./components/FinancialAnalysis.vue'),
    IncomeExpense: () => import('./components/IncomeExpense.vue'),
    BalanceSheet: () => import('./components/BalanceSheet.vue'),
    BalanceSheetInstitution: () => import('./components/BalanceSheetInstitution.vue'),
    ProfitStatement: () => import('./components/ProfitStatement.vue'),
    CashFlowStatement: () => import('./components/CashFlowStatement.vue'),
    FinancialReportAttachment: () => import('./components/FinancialReportAttachment.vue')
  },
  data() {
    return {
      componentName: this.$route.query.companyType == 0 ? 'BalanceSheet' : 'BalanceSheetInstitution',
      routeParams: this.$route.query
    }
  },
  watch: {
    $route: function(to, from) {
      this.$store.dispatch('tagsView/refreshCurrentTag', this)
    }
  },
  computed: {
    reportDetailedType() {
      const type = +this.routeParams.reportDetailedType
      return type === 1 ? '合并报表' : '非合并报表'
    },
    tabsList() {
      const type = +this.routeParams.companyType
      if (type === 4) {
        return TAB_LIST.filter((item, index) => [3, 4, 5].includes(index))
      } else {
        return TAB_LIST.filter((item, index) => [0, 1, 2, 5].includes(index))
      }
    }
  }
}
</script>

<style lang='scss'>
.customer-finance-detail-page {
  .quote-left {
    font-size: 14px;
    margin-left: 10px;
  }
  .el-tabs__header {
    margin-bottom: 0px;
  }
  .el-tabs__content {
    display: none;
  }
}
</style>
