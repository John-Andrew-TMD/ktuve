<template>
  <comp-common-investment-detail from="detail" :route-params="routeParams" />
</template>
<script>
import CompCommonInvestmentDetail from './components/CompCommonInvestmentDetail.vue'
export default {
  name: 'CapitalInvestmentDetail',
  components: {
    CompCommonInvestmentDetail
  },
  data() {
    return {
      routeParams: { ...this.$route.query }
    }
  }
}
</script>

<style lang='scss'>

</style>
