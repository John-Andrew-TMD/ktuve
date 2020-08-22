<template>
  <div class="history-wrap">
    <div class="content">
      <table-create :options="tableOptions" class="mt-0"></table-create>
    </div>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import { custManagerList } from 'api/customer-module/api-customer-detail.js'

export default {
  props: {
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableOptions: {
        requestParams: {
          url: custManagerList,
          data: { custId: this.routeParams.id }
        },
        showSerialNumber: true,
        showPagination: true,
        columns: [
          { attrs: { label: '业务经理', prop: 'businessManage' } },
          { attrs: { label: '业务协办经理', prop: 'coBusinessManage' } },
          { attrs: { label: '所属部门', prop: 'department' } },
          { attrs: { label: '经手时间', prop: 'handlingTime' } },
          { attrs: { label: '说明', prop: 'handOverReason', 'show-overflow-tooltip': true} }
        ]
      }
    }
  },
  components: {
    TableCreate
  }
}
</script>

<style lang="scss" scoped>
.history-wrap {
  padding: 0 10px;
}
</style>
