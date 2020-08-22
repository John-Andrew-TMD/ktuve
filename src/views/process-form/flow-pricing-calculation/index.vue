<!-- 项目立项 -->
<template>
  <pricing-detail :flow-info="flowInfo" :priceInfo = "priceInfo" :route-params="flowInfo.formDatas" :form-data = "formData" />
</template>

<script>
import ClassFlow from 'utils/class-flow.js'
import PricingDetail from 'views/project-mng/pricing-detail/PricingDetail.vue'
import {
  getPriceBusinessPage
} from "api/project-module/api-project-pricing";
export default {
  props: {
    flowInfo: {
      type: Object,
      default: () => ({})
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    routeParams: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    PricingDetail
  },
  //  watch: {
  //   "flowInfo.formDatas": function() {
  //     this.flowInfo.formDatas = {...this.flowInfo.formDatas,"action":'detail'}
  //   }
  // },
  data() {
    return {
      action: '',
      priceInfo:{}
    }
  },
  created() {
    this.generateInstance()
    
  },
  mounted(){
    this.initForm()
  },
  methods: {
    getPriceInfo() {
      getPriceBusinessPage(
        { projectId:  this.formData.primeRateInfoDto.projectId },
        { showLoading: true }
      ).then(res => {
        this.priceInfo = res.data.records[0]
        // this.$store.commit('price/SET_PRICE_DATA', res.data.records[0])
      });
    },
    initForm() {
      this.$nextTick(()=>{
        this.getPriceInfo();
      })
    },
    generateInstance() {
      const flowInstance = new ClassFlow(this.flowInfo, this)
      this.$emit('input', flowInstance)
    }
  }
}
</script>

<style lang='scss' scoped>
.flow-group-member-form {
  padding-top: 10px;
  width: 1100px;
}
</style>
