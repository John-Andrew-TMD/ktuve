<!-- 保证金抵扣 -->
<template>
  <div class="flow-deposit-deduct app-content white-bg">
    <comp-deposit-deduct
      v-if="urlParams"
      :row-data="rowData"
      :flow-info="flowInfo"
      :route-params="urlParams"
    />
  </div>
</template>

<script>
import ClassFlow from 'utils/class-flow.js'
import CompDepositDeduct from 'views/investment-mng/deposit-mng/components/components/CompDepositDeduct.vue'
export default {
  components: {
    CompDepositDeduct
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
      urlParams: null,
      rowData: {}
    }
  },
  created() {
    this.initForm()
    this.generateInstance()
  },
  methods: {
    initForm() {
      this.rowData = Object.assign({}, this.formData.riskfeeDto, this.formData)
      this.urlParams = Object.assign({}, this.formData, {
        canEdit: this.flowInfo.startFlag
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
.flow-deposit-deduct {
  position: static;
  padding-bottom: 20px;
}
</style>
