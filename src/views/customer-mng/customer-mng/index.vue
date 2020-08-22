<template>
  <div class="app-content customer-mng-page">
    <div class="app-content-wrapper">
      <form-search collapse @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <el-button type="primary" size="mini" @click="handleAddClick">新增</el-button>
        <el-button type="primary" size="mini" @click="handleVerifyClick">客户验证</el-button>
        <el-button
          size="mini"
          type="primary"
          :disabled="!canTransfer || !selectedRows.length"
          @click="handleTransferClick"
        >移交</el-button>
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
import { requestPost } from 'utils/fetch.js'
import { queryDictItems, isEmptyObj, queryIndustryByIds, getStore } from 'utils'
import { customerList, customerDelete } from 'api/customer-module/api-customer-mng.js'
import store from '@/store'
export default {
  name: 'CustomerMngList',
  components: {
    TableCreate,
    FormSearch,
    DialogAdd: () => import('./components/DialogCustomerAdd.vue'),
    DialogCustomerTransfer: () => import('./components/DialogCustomerTransfer.vue')
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
        },
        {
          type: 'select',
          title: '行业类别',
          field: 'industry',
          options: queryDictItems('10002')
        },
        {
          type: 'select',
          title: '企业性质',
          field: 'enterpriseNature',
          options: queryDictItems('10006')
        },
        {
          type: 'select',
          title: '是否集团客户',
          field: 'isGroupCustomer',
          options: queryDictItems('10004')
        },
        {
          type: 'select',
          title: '是否绿色贷款',
          field: 'greenLoan',
          options: queryDictItems('10004')
        },
        {
          type: 'select',
          title: '客户状态',
          field: 'blacklistState',
          options: queryDictItems('10005')
        },
        {
          type: 'china-region-cascade',
          field: 'registerAddress',
          title: '注册(身份证)地址',
          props: {
            separator: '-',
            'check-strictly': 'true'
          }
        },
        {
          type: 'input',
          title: '业务经理',
          field: 'businessManage'
        },
        {
          type: 'select',
          title: '是否关注客户',
          field: 'followFlag',
          options: queryDictItems('10004')
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
          },
          {
            attrs: {
              label: '客户类别',
              prop: 'custCategory',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.custCategory, '10008')
              }
            }
          },
          {
            attrs: {
              label: '客户性质',
              prop: 'custAttribute',
              'min-width': '150',
              'show-overflow-tooltip': true,
              formatter: row => {
                return Vue.filter('filterCustomerNature')(row.custAttribute)
              }
            }
          },
          {
            attrs: {
              label: '是否集团客户',
              prop: 'isGroupCustomer',
              width: '100px',
              formatter: row => {
                if (row.custCategory === '2') return '--'
                return Vue.filter('filterDictValue')(row.isGroupCustomer, '10004')
              }
            }
          },
          {
            attrs: {
              label: '是否绿色贷款',
              prop: 'greenLoan',
              width: '100px',
              formatter: row => {
                if (row.custCategory === '2') return '--'
                return Vue.filter('filterDictValue')(row.greenLoan, '10004')
              }
            }
          },
          {
            attrs: {
              label: '是否关注客户',
              prop: 'followFlag',
              width: '100px',
              formatter: row => {
                if (row.custCategory === '2') return '--'
                return Vue.filter('filterDictValue')(row.followFlag, '10004')
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
              label: '企业性质',
              prop: 'enterpriseNature',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.enterpriseNature, '10006')
              }
            }
          },
          {
            attrs: {
              label: '主营业务',
              prop: 'majorBusiness',
              'min-width': '100',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              label: '移交状态',
              prop: 'handOverStatus',
              formatter: row => {
                const handOverStatus = Vue.filter('filterDictValue')(row.handOverStatus, '10007')
                return handOverStatus == '0' ? '' : handOverStatus
              }
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
              label: '注册(身份证)地址',
              prop: 'registerAddress',
              formatter: row => {
                return Vue.filter('filterChinaAddress')(row.registerAddress)
              },
              'min-width': '150',
              'show-overflow-tooltip': true
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
          },
          {
            attrs: {
              label: '业务协办经理',
              prop: 'businessCooperation',
              width: '100px'
            }
          }
        ]
      },
      rowData: null,
      selectedRows: [],
      componentName: '',
      dialogStatus: false,
      canTransfer: false
    }
  },
  mounted() {
    this.getCustAttributeOptions()
  },
  activated() {
    this.getCustAttributeOptions()
    this.$refs.tableDom.refreshTable()
  },
  methods: {
    getCustAttributeOptions() {
      let ret = getStore('customerNature', true, 'sessionStorage') || []
      const tempObj = {}
      ret = ret.filter(item => item.display !== '0')
      ret.forEach(item => {
        tempObj[item.label] = tempObj[item.label] || []
        tempObj[item.label].push(item.value)
      })
      ret = Object.entries(tempObj).map(([key, value]) => {
        return {
          label: key,
          value: value.join(',')
        }
      })
      this.$nextTick(() => {
        this.searchForm.updateRule('custAttribute', {
          options: Object.freeze(ret)
        }, true)
      })
    },
    handleRowClick(rowData, column) {
      if (column.property === 'custName') {
        this.$router.push({
          path: '/customer-mng/customer-detail',
          query: {
            id: rowData.id
          }
        })
      }
    },
    handleCurrentChange(row) {
      this.rowData = row
    },
    handleSelectionChange(row) {
      this.selectedRows = row
      if (this.selectedRows.some(item => item.handOverStatus === '2')) {
        this.canTransfer = false
      } else {
        this.canTransfer = true
      }
    },
    handleSearch() {
      const data = this.searchForm.formData()
      data.registerAddress = data.registerAddress ? data.registerAddress.join(',') : null
      this.refreshTable(data)
    },
    handleSearchReset() {
      this.searchForm.resetFields()
      this.refreshTable()
    },
    // 判断客户是否可以移交
    canTransfer(id) {
      // TODO
    },
    handleAddClick() {
      this.componentName = 'DialogAdd'
      this.dialogStatus = true
    },
    handleTransferClick() {
      this.componentName = 'DialogCustomerTransfer'
      this.dialogStatus = true
    },
    handleVerifyClick() {
      this.$confirm('确定校验现有客户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          requestPost(
            customerList,
            {
              dto: {
                blacklistState: '0'
              },
              pageCurrent: 1,
              pageSize: 10000
            },
            { showLoading: true }
          )
            .then(res => {
              if (res.data && Array.isArray(res.data.records)) {
                const len = res.data.records.length
                if (len === 0) {
                  this.$showToast('未查找出客户属于黑名单内！', 'success')
                } else {
                  this.$showToast(`查找出${len}个客户属于黑名单内、请关注！`, 'success')
                }
              } else {
                this.$showToast('未查找出客户属于黑名单内！', 'success')
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    // 删除
    handleDeleteClick() {
      const custNames = []
      const ids = []
      this.selectedRows.forEach(item => {
        custNames.push(item.custName)
        ids.push(item.id)
      })
      this.$confirm(`是否从客户列表删除：${custNames.join('、')}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          customerDelete(
            {
              ids
            },
            { showLoading: true }
          )
            .then(res => {
              this.$showToast('删除成功！', 'success')
              this.$refs.tableDom.refreshTable(true)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data)
    },
    // 新增成功后，返回新增后的信息，用于页面跳转
    handleDialogConfirm(customerInfo) {
      if (!isEmptyObj(customerInfo)) {
        this.$nextTick(() => {
          this.$router.push({
            path: '/customer-mng/customer-detail',
            query: {
              id: customerInfo.id,
              action: 'add'
            }
          })
        })
      }
      // this.$refs.tableDom.refreshTable(true)
    }
  },
  async beforeRouteEnter(to, from, next) {
    await store.dispatch('user/getCustomerNature')
    next()
  }
}
</script>

<style lang="scss">
</style>
