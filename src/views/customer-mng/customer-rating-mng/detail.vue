<template>
  <div class="app-content app-content--quote customer-rating-detail-page">
    <quote icon="customer" text="客户评级详情">
      <template #left>
        <div class="text">
          <span>客户名称：{{ $route.query.name }}</span>
        </div>
      </template>
    </quote>
    <div class="app-content">
      <cust-rating />
    </div>
  </div>
</template>

<script>
import Quote from 'components/Quote/index'
import CustRating from './components/ModelDetail.vue'

export default {
  components: {
    Quote,
    CustRating
  },
  watch: {
    '$route': function(to, from) {
      this.$store.dispatch('tagsView/refreshCurrentTag', this)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
