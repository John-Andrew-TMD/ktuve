<!-- 项目审批 -->
<template>
  <customer-rating-score :flow-info="flowInfo" :route-params="urlParams" />
</template>

<script>
import ClassFlow from 'utils/class-flow.js'
import customerRatingScore from 'views/customer-mng/customer-rating-mng/score.vue'
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
    customerRatingScore
  },
  data() {
    return {
      urlParams: {},
      action: ''
    }
  },
  created() {
    this.urlParams = Object.assign({}, this.flowInfo.formDatas, {
      isFlow: true,
      canEdit: this.flowInfo.startFlag
    })
    this.initForm()
    this.generateInstance()
  },
  methods: {
    initForm() {},
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
