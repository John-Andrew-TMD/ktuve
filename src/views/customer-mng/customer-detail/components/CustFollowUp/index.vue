<template>
  <div class="cust-follow-up-page">
    <div class="btn-group">
      <el-button :disabled="globalCanEdit" type="primary" @click="handleBtnClick('添加跟进记录','A')">添加跟进记录</el-button>
      <el-button
        type="primary"
        :disabled="globalCanEdit || !rowData || tooManySelected"
        @click="handleBtnClick('修改跟进记录','U')"
      >修改</el-button>
      <el-button
        :disabled="!rowData || tooManySelected"
        type="primary"
        @click="handleBtnClick('跟进客户详情','Q')"
      >跟进详情</el-button>
      <el-button :disabled="globalCanEdit || !selectedRows.length" type="danger" @click="handleDeleteClick">删除</el-button>
    </div>
    <table-create
      ref="tableDom"
      :options="tableOptions"
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
    />
    <dialog-follow-up
      v-if="dialogFollowUpStatus"
      :dialog-status.sync="dialogFollowUpStatus"
      :dialog-title="dialogTitle"
      :action="action"
      :row-data="rowData"
      :route-params="routeParams"
      @dialog-confirm="handleDialogConfirm"
    />
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import { queryDictItems, isEmptyObj } from 'utils'
import { custFollowUpList, custFollowUpAdd, custFollowUpUpdate, custFollowUpDelete } from 'api/customer-module/api-customer-detail.js'

export default {
  components: {
    TableCreate,
    DialogFollowUp: () => import('./components/DialogFollowUp.vue')
  },
  props: {
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    globalCanEdit() {
      return !this.routeParams.globalCanEdit
    }
  },
  data() {
    return {
      dialogFollowUpStatus: false,
      tableOptions: {
        requestParams: {
          url: custFollowUpList,
          data: { custId: this.routeParams.id },
          ext: { descs: ['followUpTime'] }
        },
        showCheckbox: true,
        showSerialNumber: true,
        showPagination: true,
        columns: [
          { attrs: { label: '跟进事项', prop: 'followUpMatter' }, filter: { name: 'dict', params: '10017' }},
          { attrs: { label: '跟进人员', prop: 'followUpStaff' }},
          { attrs: { label: '跟进方式', prop: 'followUpManner' }, filter: { name: 'dict', params: '10018' }},
          { attrs: { label: '跟进对象', prop: 'followUpPeople' }},
          { attrs: { label: '跟进对象职务', prop: 'followUpPeoplePosition' }},
          { attrs: { label: '跟进日期', prop: 'followUpTime' }, filter: { name: 'date' }},
          { attrs: { label: '描述', prop: 'remark', 'show-overflow-tooltip': true }}
        ]
      },
      formApi: null,
      dialogTitle: '',
      action: '',
      rowData: null,
      selectedRows: [],
      tooManySelected: false
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.rowData = val
    },
    handleSelectionChange(row) {
      this.selectedRows = row
      if (this.selectedRows.length == 2) {
        this.tooManySelected = true
      } else {
        this.tooManySelected = false
      }
    },
    handleBtnClick(title, type) {
      this.action = type
      this.dialogTitle = title
      this.dialogFollowUpStatus = true
    },
    handleDeleteClick() {
      if (!this.selectedRows.length) {
        return this.$showToast('未选中任何行！')
      }
      this.$confirm(`确定删除选中的跟进记录吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除记录
          const ids = []
          this.selectedRows.map(item => {
            ids.push(item.id)
          })
          custFollowUpDelete({
            ids: ids
          }, { showLoading: true }).then(res => {
            this.$showToast('删除成功！', 'success')
            this.$refs.tableDom.refreshTable(true)
          }).catch(err => {
            console.log(err)
          })
        })
        .catch(() => {})
    },
    handleDialogConfirm() {
      this.refreshTable()
    },
    refreshTable() {
      this.$refs.tableDom.resetTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.cust-follow-up-page {
  padding: 0 20px 20px;
  .btn-group {
    padding-top: 0;
    border-top: none;
  }
}

</style>
