<template>
  <div class="app-content customer-mng-page">
    <div class="app-content-wrapper">
      <form-search collapse @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <el-button type="primary" size="mini" @click="handleAddClick">新增</el-button>
       
        <el-button
          type="danger"
          size="mini"
          :disabled="!selectedRows.length"
          @click="handleDeleteClick"
        >删除</el-button>
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
        :selected-rows="selectedRows"
        :dialog-status.sync="dialogStatus"
        @dialog-confirm="handleDialogConfirm"
      />
    </div>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import FormSearch from 'components/FormSearch'
import { queryDictItems, isEmptyObj } from 'utils'
import { customerList, customerDelete } from 'api/customer-module/api-customer-mng.js'
export default {
  components: {
    TableCreate,
    FormSearch,
    DialogAdd: () => import('./components/DialogAmortizeAdd.vue'),
  },
  data() {
    return {
      searchForm: null,
      searchRules: [
        {
          type: 'el-custom-autocomplete',
          title: '客户名称',
          field: 'custName',
          props: {
            params: {
              url: customerList,
              data: {},
              searchKey: 'custName',
              labelKey: 'custName',
              valueKey: 'custName',
              repeat: false
            },
            clearable: true
          }
        },
        {
          type: 'select',
          title: '客户类别',
          field: 'custCategory',
          options: queryDictItems('10008')
        },
        {
          type: 'select',
          title: '客户性质',
          field: 'custAttribute',
          options: []
        }
      ],
      searchOptions: {
        form: { labelWidth: '120px', inline: true },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: customerList,
          data: {}
        },
        showCheckbox: true,
        showSerialNumber: true,
        showTools: true,
        tableBottomOffset: 50,
        columns: [
          {
            attrs: {
              label: '客户名称',
              prop: 'custName',
              align: 'left',
              'class-name': 'link-type',
              'min-width': '200',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              label: '客户编号',
              prop: 'custNo',
              'min-width': '130'
            }
          }
        ]
      },
      rowData: null,
      selectedRows: [],
      componentName: '',
      dialogStatus: false,
    }
  },
  mounted() {
    this.getCustAttributeOptions()
  },
  methods: {
    getCustAttributeOptions() {
      
    },
    handleRowClick(rowData, column) {
      
    },
    handleCurrentChange(row) {
      this.rowData = row
    },
    handleSelectionChange(row) {
      this.selectedRows = row
      
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

    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data)
    },
    // 新增成功后，返回新增后的信息，用于页面跳转
    handleDialogConfirm(customerInfo) {
 
    }
  },
  activated() {
    this.getCustAttributeOptions()
    this.$refs.tableDom.refreshTable()
  }
}
</script>

<style lang="scss">
</style>
