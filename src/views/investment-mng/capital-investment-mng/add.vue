<template>
  <comp-common-investment-detail from="add" :route-params="routeParams" />
</template>
<script>
import CompCommonInvestmentDetail from './components/CompCommonInvestmentDetail.vue'
export default {
  name: 'CapitalInvestmentAdd',
  components: {
    CompCommonInvestmentDetail
  },
  data() {
    return {
      routeParams: { ...this.$route.query }
    }
  },
  created() {
    if(this.routeParams.loanId) {
      const route = Object.assign({}, this.$route, { title: '投放申请' })
      this.$nextTick(() => {
        this.$store.dispatch('tagsView/updateVisitedView', route)
      })
    }
  }
}
</script>

<style lang='scss'>

</style>
