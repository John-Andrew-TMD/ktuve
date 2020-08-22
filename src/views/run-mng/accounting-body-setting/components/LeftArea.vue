<template>
 <div class="comp-left-area">
    <div class="btn-group">
      <el-button
        type="primary"
        size="mini"
        @click="handleAddClick"
      >新增主体</el-button>
      <el-button
        type="danger"
        size="mini"
        @click="handleDeleteClick"
      >删除</el-button>
    </div>
    <table-create
      ref="tableDom"
      :options="tableOptions"
      @current-change="handleCurrentChange"
      @request-complete="handleRequestComplete"
    >
    </table-create>
    <dialog-accounting-add-or-update v-if="dialogStatus" :dialog-status.sync="dialogStatus" />
 </div>
</template>

<script>
import TableCreate from "components/TableCreate";
import { accountingBodyList, accountingBodyDelete } from 'api/run-module/accounting-body-setting.js'
export default {
   data () {
     return {
       tableOptions: {
        columns: [
          {
            attrs: {
              prop: "accountingSubjectName",
              label: "核算主体名称",
              "min-width": "120",
              "show-overflow-tooltip": true
            }
          },
          {
            attrs: {
              prop: "accountingSubjectAbbreviation",
              label: "核算主体简称",
              "min-width": "120",
              "show-overflow-tooltip": true
            }
          },
          {
            attrs: {
              prop: "sysEtime",
              label: "更新时间",
              width: "150",
            },
            filter: { 
              name: 'timestamp' 
            }
          }
        ],
        requestParams: {
          url: accountingBodyList,
          data: {}
        },
        showPagination: false,
        selectedRow: 0
      },
      dialogStatus: false,
      rowData: null
     }
   },
   components: {
     TableCreate,
     DialogAccountingAddOrUpdate: () => import('./DialogAccountingAddOrUpdate.vue'),
   },
   methods: {
    handleAddClick() {
      this.dialogStatus = true;
    },
    handleDeleteClick() {
      if(!this.rowData){
        this.$showToast('未选择任何行！')
        return
      }
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          accountingBodyDelete({
            ids: [this.rowData.id]
          }, { showLoading: true }).then(res => {
            this.$showToast('删除成功！', 'success')
            this.$refs.tableDom.refreshTable()
          }).catch(err => {
            console.log(err)
          })
        })
        .catch(() => {});
    },
    handleCurrentChange(row) {
      this.rowData = row
      this.$emit('update:selected-id', row.id)
    },
    refreshTableData() {
      this.$refs.tableDom.refreshTable()
    },
    handleRequestComplete(data) {
      if(!data.length) {
        this.$emit('update:selected-id', 'noData')
      }
    }
  }
 }
</script>

<style lang='scss' scoped>
.comp-left-area {
  .btn-group {
    margin: 0;
    padding-top: 0;
    padding-left: 0;
    border-top: none;
  }
}
</style>