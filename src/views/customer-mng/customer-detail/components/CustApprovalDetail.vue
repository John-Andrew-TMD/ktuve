<template>
  <div class="approval-wrap">
    <table-create :options="table" class="mt-0" @row-click="handleRowClick" />
  </div>
</template>
<script>
import TableCreate from 'components/TableCreate/index'
import { getApprovalList } from 'api/customer-module/api-customer-detail.js'
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
          url: getApprovalList,
          data: { custId: this.routeParams.id }
        },
        showPagination: false,
        columns: [
          {
            attrs: {
              label: '流程标题',
              prop: 'title',
              'class-name': 'link-type'
            }
          },
          {
            attrs: {
              label: '审批内容',
              prop: 'content',
              formatter: row => {
                const tempObj = {
                  '1': '机构信息',
                  '2': '银行信息',
                  '3': '开票信息',
                  '4': '股东信息',
                  '5': '关联信息'
                }
                return row.content.split(',').map(key => tempObj[key]).join(',')
              }
            }
          },
          {
            attrs: {
              label: '审批状态',
              prop: 'approvalStatus',
              width: '130px',
              formatter: row => {
                return ['', '审批中', '审批通过', '审批不通过'][row.approvalStatus]
              }
            }
          },
          {
            attrs: {
              label: '发起人',
              prop: 'sysCreatorId',
              width: '130px'
            },
            filter: {
              name: 'user'
            }
          },
          {
            attrs: {
              label: '审批结束时间',
              prop: 'endTime',
              width: '150px',
              formatter: row => {
                if (row.approvalStatus == '1') return '--'
                return Vue.filter('filterTimestamp')(row.endTime)
              }
            }
          },
          {
            attrs: {
              label: '创建时间',
              prop: 'sysCtime',
              width: '150px'
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
.approval-wrap {
  padding: 0 10px;
}

</style>
