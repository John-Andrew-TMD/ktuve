<template>
  <div class="cust-association-comp">
    <div class="btn-group">
      <el-button size="mini" type="primary" :disabled="routeParams.globalCanEdit === false" @click="handleAddClick">新增</el-button>
      <el-button size="mini" type="primary" :disabled="(!selectedRow || tooManySelected) || routeParams.globalCanEdit === false" @click="handleUpdateClick">修改</el-button>
      <el-button
        size="mini"
        type="danger"
        :disabled="!checkedRows.length || routeParams.globalCanEdit === false"
        @click="handleDelClick"
      >删除</el-button>
    </div>
    <table-create
      ref="tableDom"
      :options="tableOptions"
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
    />
    <dialog-add-or-update
      v-if="dialogStatus"
      :dialog-status.sync="dialogStatus"
      :selected-row="selectedRow"
      :route-params="routeParams"
      :action="action"
      @dialog-confirm="handleDialogConfirm"
    />
  </div>
</template>
<script>
import TableCreate from 'components/TableCreate/index'
import {
  custAssociationList,
  custAssociationDelete
} from 'api/customer-module/api-customer-detail.js'
export default {
  components: {
    TableCreate,
    DialogAddOrUpdate: () => import('./components/DialogAddOrUpdate.vue')
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
          url: custAssociationList,
          data: { custId: this.routeParams.id }
        },
        dataCallbackFn(data) {
          if (data && Array.isArray(data.newCrm)) {
            return data.newCrm
          } else {
            return []
          }
        },
        columns: [
          {
            attrs: {
              label: '客户类别',
              prop: 'custCategory'
            },
            filter: { name: 'dict', params: ['10008'] }
          },
          { attrs: { label: '关联人名称', prop: 'custName' }},
          { attrs: { label: '关联人证件名称及号码', prop: 'idCode' }},
          { attrs: { label: '关联人编号', prop: 'custNo' }},
          {
            attrs: {
              label: '关联关系类型(人行)',
              prop: 'relationshipTypeBank'
            },
            filter: { name: 'dict', params: ['10046'] }
          },
          {
            attrs: {
              label: '关系类型(east)',
              prop: 'relationshipType'
            },
            filter: { name: 'dict', params: ['10014'] }
          },
          {
            attrs: {
              label: '关联关系状态',
              prop: 'associationStatus',
              formatter: row => {
                return ['有效', '失效'][row.associationStatus]
              }
            }
          },
          {
            attrs: {
              label: '地址(注册/住址)',
              prop: 'address'
            },
            filter: { name: 'address' }
          },
          {
            attrs: {
              label: '备注',
              prop: 'remarks',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              label: '创建日期',
              prop: 'sysCtime'
            },
            filter: { name: 'timestamp' }
          }
        ],
        showCheckbox: true,
        showSerialNumber: true
      },
      selectedRow: null,
      checkedRows: [],
      action: 'add',
      dialogStatus: false,
      tooManySelected: false
    }
  },
  methods: {
    handleAddClick() {
      this.action = 'add'
      this.dialogStatus = true
    },
    handleUpdateClick() {
      this.action = 'update'
      this.dialogStatus = true
    },
    handleDelClick() {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          custAssociationDelete({
            ids: this.checkedRows.map(item => item.id)
          }, { showLoading: true }).then(res => {
            this.$showToast('删除成功', 'success')
            this.$refs.tableDom.refreshTable(true)
          }).catch(err => {
            console.log(err)
          })
        })
        .catch(() => {})
    },
    handleCurrentChange(rowData) {
      this.selectedRow = rowData
    },
    handleSelectionChange(data) {
      this.checkedRows = data
      if (this.checkedRows.length == 2) {
        this.tooManySelected = true
      } else {
        this.tooManySelected = false
      }
    },
    handleDialogConfirm() {
      this.$refs.tableDom.refreshTable(true)
    }
  }
}
</script>

<style lang='scss' scoped>
.cust-association-comp {
  padding: 0 10px;
  .btn-group {
    padding-top: 0;
    border-top: none;
  }
}

</style>
