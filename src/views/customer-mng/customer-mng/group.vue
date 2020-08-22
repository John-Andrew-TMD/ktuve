<template>
  <div class="app-content customer-group-mng-page">
    <div class="app-content-wrapper">
      <form-search collapse @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <el-button type="primary" size="mini" @click="handleAddClick">新增</el-button>
        <el-button type="primary" size="mini" :disabled="!selectedRow || checkedRows.length || !canEdit" @click="handleMaintainClick">集团成员维护</el-button>
        <el-button type="primary" size="mini" :disabled="!selectedRow || checkedRows.length" @click="handleDetailClick">详情</el-button>
        <el-button type="danger" size="mini" :disabled="!checkedRows.length || !canDelete" @click="handleDeleteClick">删除</el-button>
      </div>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
      />
      <component
        :is="componentName"
        v-if="dialogStatus"
        :selected-row="selectedRow"
        :action="action"
        :checked-rows="checkedRows"
        :dialog-status.sync="dialogStatus"
        @dialog-confirm="handleDialogConfirm"
      />
    </div>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import FormSearch from 'components/FormSearch'
import { queryDictItems, queryIndustryByIds } from 'utils'
import { groupCustomerList } from 'api/customer-module/api-customer-mng.js'
export default {
  name: 'GroupCustomerMng',
  components: {
    TableCreate,
    FormSearch,
    DialogAdd: () => import('./components/DialogGroupCustomerAdd.vue'),
    DialogGroupCustomerMemberAdd: () => import('./components/DialogGroupCustomerMemberAdd.vue'),
    DialogGroupCustomerDelete: () => import('./components/DialogGroupCustomerDelete.vue')
  },
  data() {
    return {
      searchForm: null,
      searchRules: [
        {
          type: 'el-custom-autocomplete',
          title: '集团名称',
          field: 'blocName',
          props: {
            params: {
              url: groupCustomerList,
              data: {},
              searchKey: 'blocName',
              labelKey: 'blocName',
              valueKey: 'blocName',
              repeat: false
            }
          }
        },
        {
          type: 'select',
          title: '行业类别',
          field: 'industry',
          options: queryDictItems('10002')
        },
        {
          type: 'select',
          title: '审批状态',
          field: 'checkStatus',
          options: queryDictItems('10016').filter(item => [1, 3].includes(+item.value))
        },
        {
          type: 'el-custom-autocomplete',
          title: '业务经理',
          field: 'businessManage',
          props: {
            params: {
              url: groupCustomerList,
              data: {},
              searchKey: 'businessManage',
              labelKey: 'businessManage',
              valueKey: 'businessManage',
              repeat: false
            }
          }
        }
      ],
      searchOptions: {
        form: { labelWidth: '85px', inline: true },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: groupCustomerList,
          data: {}
        },
        showTools: true,
        showCheckbox: true,
        showSerialNumber: true,
        columns: [
          {
            attrs: {
              label: '集团名称',
              prop: 'blocName',
              align: 'left',
              'class-name': 'link-type',
              'min-width': '150',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              label: '客户编号',
              prop: 'custNo',
              'min-width': '130'
            }
          },
          {
            attrs: {
              label: '集团编号',
              prop: 'blocNo'
            }
          },
          {
            attrs: {
              label: '审批状态',
              prop: 'checkStatus',
              width: '100px',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.checkStatus, '10016')
              }
            }
          },
          {
            attrs: {
              label: '行业类别',
              prop: 'industry',
              align: 'left',
              'min-width': '200',
              'show-overflow-tooltip': true,
              formatter: row => {
                return queryIndustryByIds(row.industry, '-')
              }
            }
          },
          {
            attrs: {
              label: '主营业务',
              prop: 'majorBusiness',
              'min-width': '150',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              label: '授信总额',
              prop: 'creditPosition',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.creditPosition)
              }
            }
          },
          {
            attrs: {
              label: '授信余额',
              prop: 'creditBalance',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.creditBalance)
              }
            }
          },
          {
            attrs: {
              label: '集团成员总数',
              prop: 'memberSize',
              width: '100px'
            }
          },
          {
            attrs: {
              label: '客户状态',
              prop: 'blacklistState',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.blacklistState, '10005')
              }
            }
          },
          {
            attrs: {
              label: '联系电话',
              prop: 'contactNumber'
            }
          },
          {
            attrs: {
              label: '业务经理',
              prop: 'businessManage'
            }
          }
        ]
      },
      selectedRow: null,
      checkedRows: [],
      componentName: '',
      action: 'A',
      dialogStatus: false,
      canEdit: true, // 是否可维护
      canDelete: true // 是否可删除
    }
  },
  methods: {
    handleDetailClick() {
      this.showGroupCustomerMemberDialog('V')
    },
    handleRowClick(rowData, column) {
      if (column.property === 'blocName') {
        this.showGroupCustomerMemberDialog('V')
      }
    },
    handleCurrentChange(row) {
      if (!row) return
      if (row.inFlow == '1') {
        this.canEdit = false
      } else {
        this.canEdit = true
      }
      // if (row.checkStatus === '1') {
      //   this.canEdit = false
      // } else {
      //   this.canEdit = true
      // }
      this.selectedRow = row
    },
    handleSelectionChange(rows) {
      this.checkedRows = rows
      if (this.checkedRows.some(item => item.checkStatus === '1')) {
        this.canDelete = false
      } else {
        this.canDelete = true
      }
      // return
      // if (!rows.length) return
      // const ret = rows.every(item => item.memberSize < 2 && item.checkStatus != 1)
      // if (ret) {
      //   this.checkedRows = rows
      // }
    },
    handleSearch() {
      const data = this.searchForm.formData()
      this.refreshTable(data)
    },
    handleSearchReset() {
      this.searchForm.resetFields()
      this.refreshTable()
    },
    handleAddClick() {
      this.componentName = 'DialogAdd'
      this.dialogStatus = true
    },
    // 删除
    handleDeleteClick() {
      if (!this.checkedRows.length) {
        return this.$showToast('未勾选任何行！')
      }
      this.componentName = 'DialogGroupCustomerDelete'
      this.dialogStatus = true
    },
    handleMaintainClick() {
      this.showGroupCustomerMemberDialog()
    },
    showGroupCustomerMemberDialog(action = 'A') {
      this.action = action
      // if (this.selectedRow.inFlow == '1') {
      //   this.action = 'V'
      // }
      this.componentName = 'DialogGroupCustomerMemberAdd'
      this.dialogStatus = true
    },
    handleDialogConfirm() {
      this.$refs.tableDom.refreshTable(true)
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data)
    }
  }
}
</script>

<style lang="scss">
</style>
