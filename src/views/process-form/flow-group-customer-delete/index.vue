<template>
  <div class="content flow-group-customer-delete-form">
    <group-customer-delete-action :table-data="tableData" />
  </div>
</template>

<script>
import ClassFlow from 'utils/class-flow.js'
import GroupCustomerDeleteAction from 'views/customer-mng/customer-mng/components/common-components/GroupCustomerDeleteAction.vue'
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
    GroupCustomerDeleteAction
  },
  data() {
    return {
      isDisable: false,
      tableData: []
    }
  },
  created() {
    this.initUI()
    this.generateInstance()
  },
  methods: {
    initUI() {
      const { blocName, custNo, blocNo, memberSize, handOverStatus, businessManage } = this.formData
      this.tableData = [{
        blocName,
        custNo,
        blocNo,
        memberSize,
        handOverStatus,
        businessManage
      }]
    },
    generateInstance() {
      const flowInstance = new ClassFlow(
        this.flowInfo,
        this
      )
      this.$emit('input', flowInstance)
    }
  }
}
</script>

<style lang='scss' scoped>
.flow-group-customer-delete-form {
  padding: 0 7px;
  width: 1018px
}
</style>
