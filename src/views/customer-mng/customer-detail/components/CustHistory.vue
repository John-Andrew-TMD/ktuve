<template>
  <div class="history-wrap">
    <div class="content">
      <table-create :options="table" class="mt-0" />
    </div>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import { custHistoryList } from 'api/customer-module/api-customer-detail.js'

export default {
  components: {
    TableCreate
  },
  props: {
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      table: {
        requestParams: {
          url: custHistoryList,
          data: { id: this.routeParams.id }
        },
        showPagination: false,
        showSerialNumber: true,
        columns: [
          { attrs: { label: '项目编号', prop: 'projectNo' }},
          { attrs: { label: '项目名称', prop: 'projectName','show-overflow-tooltip': true, width: '250px' }},
          { attrs: { label: '租赁类型', prop: 'businessType', width: '80px' }, filter: { name: 'dict', params: '10026' }},
          { attrs: { label: '租赁类别', prop: 'businessCategory' }, filter: { name: 'dict', params: '10027' }},
          { attrs: { label: '客户性质', prop: 'custAttribute' }},
          { attrs: { label: '融资/担保额度', prop: 'leaseFinancing' }, filter: { name: 'number' }},
          { attrs: { label: '项目/担保余额', prop: 'guaranteeBalance' }, filter: { name: 'number' }},
          { attrs: { label: '业务经理', prop: 'businessManage' }},
          { attrs: { label: '业务协办经理', prop: 'businessCooperation' }},
          { attrs: { label: '所属部门', prop: 'departmentName' }},
          { attrs: { label: '项目状态', prop: 'projectStatus' }, filter: { name: 'dict', params: '10024' }},
          { attrs: { label: '到期日', prop: 'endTime',formatter: (row, column) => {
            return Vue.filter('filterTimestamp')(row.endTime,'YYYY-MM-DD')}}
          },
          { attrs: { label: '创建时间', prop: 'sysCtime' }, filter: { name: 'timestamp' }}
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.history-wrap {
  padding: 0 10px;
}

</style>
