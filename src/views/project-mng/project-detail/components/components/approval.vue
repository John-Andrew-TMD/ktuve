<template>
  <div style="padding: 0 10px;">
      <table-create
        class="mt-0"
        ref="tableDom"
        :options="tableOptions"
        @row-click="handleRowClick"
      ></table-create>
  </div>
</template>

<script>
import TableCreate from "components/TableCreate/index";
import { projectApprovalDetail } from "api/project-module/api-project-mng.js";
export default {
  props: {
    routeParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tableOptions: {
        requestParams: {
          url: projectApprovalDetail,
          data: { recordId: this.routeParams.id }
        },
        showSerialNumber: true,
        columns: [
          {
            attrs: {
              label: "流程标题",
              prop: "title",
              align: "left",
              "class-name": "link-type",
              "min-width": "150",
              "show-overflow-tooltip": true
            }
          },
          {
            attrs: {
              label: "流程类型",
              prop: "flowType"
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
              label: "审批结束时间",
              prop: "endTime",
              width: '150px',
              formatter: row => {
                if(row.approvalStatus == '1') return '--'
                return Vue.filter('filterTimestamp')(row.endTime)
              }
            }, 
            filter: { 
              name: 'timestamp' 
            } 
          },
          {
            attrs: {
              label: "创建时间",
              prop: 'sysCtime',
              width: '150px'
            }, 
            filter: { 
              name: 'timestamp' 
            }
          }
        ]
      }
    };
  },
  components: {
    TableCreate
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
};
</script>

<style lang="scss"></style>
