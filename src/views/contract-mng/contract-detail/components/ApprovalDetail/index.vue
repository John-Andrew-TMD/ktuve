<template>
  <div class="contract-approval-detail">
    <table-create :options="tableOptions" @row-click="handleRowClick" class="mt-0" />
  </div>
</template>
<script>
import TableCreate from 'components/TableCreate/index'
import { queryApprovalDetail } from 'api/contract-module/api-contract-mng.js'

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
      tableOptions: {
        requestParams: {
          url: queryApprovalDetail,
          data: { managerId: this.routeParams.id }
        },
        tableBottomOffset: 75,
        showPagination: false,
        columns: [
          {
            attrs: {
              label: '流程标题',
              prop: 'title',
              align: 'left',
              'class-name': 'link-type',
              'min-width': '200',
              'show-overflow-tooltip': true
            }
          },
          { 
            attrs: { 
              label: '审批状态', 
              prop: 'approvalStatus',
              formatter: row => {
                return ['', '审批中', '审批通过', '审批不通过'][row.approvalStatus]
              }
            }
          },
          { 
            attrs: { 
              label: '发起人', 
              prop: 'sysCreatorId',
            }, 
            filter: { 
              name: 'user' 
            } 
          },
          { 
            attrs: { 
              label: '审批结束时间', 
              prop: 'endTime',
              formatter: row => {
                if(row.approvalStatus == '1') return '--'
                return Vue.filter('filterTimestamp')(row.endTime)
              }
            }
          },
          { 
            attrs: { 
              label: '创建时间', 
              prop: 'sysCtime',
            }, 
            filter: { 
              name: 'timestamp' 
            } 
          }
        ]
      }
    }
  },
  methods: {
    handleRowClick(rowData, column) {
      if (column.property === 'title') {
        this.$router.push({
          path: '/process/process-approval',
          query: {
            taskId: rowData.flowId
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.contract-approval-detail{
  padding: 10px;
}
</style>
