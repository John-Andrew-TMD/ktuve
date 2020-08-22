<template>
  <div class="cust-baseinfo-comp">
    <!-- 基本信息 -->
    <comp-base-Info :route-params="routeParams" @stockholder-info-change="refreshStockholderInfo" />
    <div class="divide-line" />
    <!-- 银行账户 -->
    <comp-bank-info :route-params="routeParams" />
    <div class="divide-line" />
    <!-- 开票信息 -->
    <comp-billing-Info :route-params="routeParams" />
    <div class="divide-line" />
    <!-- 股东信息 -->
    <comp-stockholder-info v-if="isOrg" ref="stockholderDom" :route-params="routeParams" />
    <div v-if="isOrg" class="divide-line" />
    <!-- 常用联系人 -->
    <comp-contacts-info :route-params="routeParams" />
    <div v-if="!isOrg" class="divide-line" />
    <!-- 家庭成员 -->
    <!-- <comp-family-info v-if="!isOrg" :route-params="routeParams" /> -->
  </div>
</template>

<script>
import CompBaseInfo from './components/CompBaseInfo.vue'
import CompBillingInfo from './components/CompBillingInfo.vue'
import CompBankInfo from './components/CompBankInfo.vue'
import CompStockholderInfo from './components/CompStockholderInfo.vue'
import CompContactsInfo from './components/CompContactsInfo.vue'
// import CompFamilyInfo from './components/CompFamilyInfo.vue'

export default {
  components: {
    CompBaseInfo,
    CompBillingInfo,
    CompBankInfo,
    CompStockholderInfo,
    CompContactsInfo
    // CompFamilyInfo
  },
  props: {
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    // 是否是机构客户
    isOrg() {
      return this.routeParams.custCategory === '1'
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
