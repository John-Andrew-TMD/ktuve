<template>
  <comp-common-payment-application-detail :route-params="routeParams" />
</template>
<script>
import CompCommonPaymentApplicationDetail from './components/CompCommonPaymentApplicationDetail.vue'
export default {
  // name: 'CompCommonPaymentApplicationDetail',
  components: {
    CompCommonPaymentApplicationDetail
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
