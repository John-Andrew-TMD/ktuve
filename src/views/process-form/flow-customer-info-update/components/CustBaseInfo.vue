<template>
  <div class="cust-baseinfo-comp">
    <!-- 基本信息 -->
    <comp-base-Info :route-params="routeParams" @stockholder-info-change="refreshStockholderInfo" />
    <template v-if="routeParams.baseInfoModule.includes('2')">
      <div class="divide-line" />
      <!-- 银行账户 -->
      <comp-bank-info :route-params="routeParams" />
    </template>
    <template v-if="routeParams.baseInfoModule.includes('3')">
      <div class="divide-line" />
      <!-- 开票信息 -->
      <comp-billing-Info :route-params="routeParams" />
    </template>
    <template v-if="routeParams.baseInfoModule.includes('4')">
      <div class="divide-line" />
      <!-- 股东信息 -->
      <comp-stockholder-info ref="stockholderDom" :route-params="routeParams" />
    </template>
  </div>
</template>

<script>
import CompBaseInfo from 'views/customer-mng/customer-detail/components/CustBaseInfo/components/CompBaseInfo.vue'
import CompBillingInfo from 'views/customer-mng/customer-detail/components/CustBaseInfo/components/CompBillingInfo.vue'
import CompBankInfo from 'views/customer-mng/customer-detail/components/CustBaseInfo/components/CompBankInfo.vue'
import CompStockholderInfo from 'views/customer-mng/customer-detail/components/CustBaseInfo/components/CompStockholderInfo.vue'

export default {
  components: {
    CompBaseInfo,
    CompBillingInfo,
    CompBankInfo,
    CompStockholderInfo
  },
  props: {
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    refreshStockholderInfo() {
      this.$refs.stockholderDom.refreshTable()
    }
  }
}
</script>

<style lang="scss">
.cust-baseinfo-comp {
  margin-top: -10px;
  .content-body {
    box-sizing: border-box;
    max-width: 1020px;
    padding: 0 10px 10px;
  }
  .panel-wrapper {
    position: relative;
    max-width: 1000px;

    .panel-tools {
      position: absolute;
      top: 0;
      right: 0;
      line-height: 36px;
    }
  }
  .divide-line {
    height: 10px;
    border-bottom: 5px solid #FFFFFF;
    background: #F1F4F5;
  }
  .el-form {
    .el-select, .el-input, .el-cascader {
      width: 100%;
    }
  }
}

</style>
