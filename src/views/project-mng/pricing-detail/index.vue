<template>
  <div
    ref="container"
    class="app-content app-content--quote rating-model-setting-page"
  >
    <pricing-detail v-if = "priceInfo.id"  :priceInfo="priceInfo"></pricing-detail>
  </div>
</template>

<script>
import {
  ISomPricingModelBusinessGetById,
  getPriceBusinessPage
} from "api/project-module/api-project-pricing";
// import { mapGetters } from "vuex";
export default {
  components: {
    PricingDetail: () => import("./PricingDetail.vue")
  },
  data() {
    return {
      priceInfo:{}
    };
  },
  // computed: {
  //   ...mapGetters(['priceInfo'])
  // },
  watch: {
    $route: function(to, from) {
      if (to.name !== "PricingDetail" || this.fullPath === to.fullPath) return;
      this.$store.dispatch("tagsView/refreshCurrentTag", this);
    },
    "priceInfo.projectName": function() {
      const route = Object.assign({}, this.$route, {
        title: this.priceInfo.projectName
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    }
  },
  created() {
    this.$nextTick(()=>{
      this.getPriceInfo();
    })
  },
  methods: {
    getPriceInfo() {
      getPriceBusinessPage(
        { projectId: this.$route.query.projectId },
        { showLoading: true }
      ).then(res => {
        this.priceInfo =  res.data.records[0]
      });
    }
  }
};
</script>

<style lang="scss" scoped >

</style>
