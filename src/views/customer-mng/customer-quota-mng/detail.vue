<template>
  <div class="app-content">
    <main-title title="额度详情" style="margin-bottom: 5px" border icon="el-icon-s-custom" :subtitle="decodeURIComponent(routeParams.name)" />
    <div class="content">
      <cust-quota :routeParams="routeParams" />
    </div>
  </div>
</template>

<script>
import MainTitle from 'components/MainTitle/index'
import CustQuota from '../customer-detail/components/CustQuota.vue'

export default {
  components: {
    MainTitle,
    CustQuota
  },
  data() {
    return {
      routeParams: this.$route.query
    }
  }
}
</script>

<style lang="scss" scoped></style>
