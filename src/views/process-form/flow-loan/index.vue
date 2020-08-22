<!-- 放款_其他 -->
<template>
  <div class="flow-loan">
    <comp-common-investment-detail
      ref="investmentDetailDom"
      from="detail"
      v-if="urlParams"
      :flow-info="flowInfo"
      :route-params="urlParams"
    />
  </div>
</template>

<script>
import ClassFlow from 'utils/class-flow.js'
import CompCommonInvestmentDetail from 'views/investment-mng/capital-investment-mng/components/CompCommonInvestmentDetail.vue'
export default {
  components: {
    CompCommonInvestmentDetail
  },
  inheritAttrs: false,
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
  data() {
    return {
      urlParams: null
    }
  },
  created() {
    this.initForm()
    this.generateInstance()
  },
  methods: {
    initForm() {
      if(this.formData.id) {
        this.urlParams = Object.assign({}, this.formData, {
          canEdit: this.flowInfo.startFlag,
          loanId: this.formData.id
        })
      }
    },
    beforeNext() {
      return new Promise(async(resolve, reject) => {
        // 不是第一个节点不用提交表单信息
        if (!this.flowInfo.startFlag) return resolve(true)
        const ret = await this.$refs.investmentDetailDom.validateAllForm()
        if(!ret) return
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
.flow-loan {
  height: 100%;
}

</style>
