<template>
  <div class="app-content quotation-list-page">
    <div class="app-content-wrapper">
      <form-search @search="handleSearch" collapse @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <div class="left">
          <el-button type="primary" size="mini" @click="handleAddClick">报价测算</el-button>
          <el-button
            type="danger"
            size="mini"
            :disabled="isDelDisabled"
            @click="handleDeleteClick"
          >删除</el-button>
        </div>
      </div>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { queryDictItems, getStore } from 'utils'
import FormSearch from 'components/FormSearch'
import TableCreate from 'components/TableCreate'
import { mapState } from 'vuex'
import { quotationList, quotationDelete } from 'api/project-module/api-quotation.js'

export default {
  components: {
    TableCreate,
    FormSearch
  },
  computed: {
    ...mapState({
      refreshQuotationList: state => state.refresh.refreshQuotationList
    }),
    isDelDisabled() {
      if (this.selectedRow) {
        return this.selectedRow.state != 0
      } else {
        return true
      }
    }
  },
  data() {
    return {
      searchForm: null,
      searchRules: [
        {
          type: 'el-custom-autocomplete',
          title: '方案名称',
          field: 'quotationName',
          props: {
            params: {
              url: quotationList,
              data: {},
              searchKey: 'quotationName',
              labelKey: 'quotationName',
              valueKey: 'quotationName',
              repeat: false
            },
            clearable: true
          }
        },
        {
          type: 'el-custom-autocomplete',
          title: '关联项目',
          field: 'projectName',
          props: {
            params: {
              url: quotationList,
              data: {},
              searchKey: 'projectName',
              labelKey: 'projectName',
              valueKey: 'projectName',
              repeat: false
            },
            clearable: true
          }
        },
        {
          type: 'select',
          title: '选用状态',
          field: 'state',
          options: queryDictItems('10039')
        },
        {
          type: 'select',
          title: '租赁类别',
          field: 'businessCategory',
          options: queryDictItems('10027')
        },
        {
          type: 'select',
          title: '租赁类型',
          field: 'businessType',
          options: queryDictItems('10026')
        },
        {
          type: 'select',
          title: '租金计算方式',
          field: 'calculateRentMethod',
          options: queryDictItems('10030')
        },
        {
          type: 'el-custom-select',
          title: '创建人',
          field: 'sysCreatorId',
          props: {
            params: {
              options: getStore('userList', true) || [],
              searchKey: 'userId',
              labelKey: 'employeeName',
              valueKey: 'userId',
              repeat: false
            },
            filterable: true
          }
        }
      ],
      searchOptions: {
        form: { labelWidth: '100px', inline: true },
        submitBtn: { show: false }
      },
      tableOptions: {
        columns: [
          {
            attrs: {
              prop: 'quotationName',
              label: '方案名称',
              'class-name': 'quotation-name',
              'min-width': '120',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              prop: 'quotationNo',
              label: '方案编号'
            }
          },
          {
            attrs: {
              prop: 'state',
              label: '选用状态',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.state, '10039')
              }
            }
          },
          {
            attrs: {
              prop: 'projectName',
              label: '关联项目',
              'min-width': '200',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              prop: 'businessCategory',
              label: '租赁类别',
              formatter: row => {
                const type = row.businessCategory
                if (!type || type === '--') {
                  return '--'
                } else {
                  return Vue.filter('filterDictValue')(type, '10027')
                }
              }
            }
          },
          {
            attrs: {
              prop: 'businessType',
              label: '租赁类型',
              formatter: row => {
                return !row.businessType ? '--' : Vue.filter('filterDictValue')(row.businessType, '10026')
              }
            }
          },
          {
            attrs: {
              prop: 'calculateRentMethod',
              label: '租金计算方式',
              'min-width': '100',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.calculateRentMethod, '10030')
              }
            }
          },
          {
            attrs: {
              prop: 'quotationPrice',
              label: '项目金额（元）',
              'min-width': '120',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.quotationPrice)
              }
            }
          },
          {
            attrs: {
              prop: 'firstPrice',
              label: '首付款（元）',
              'min-width': '120',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.firstPrice)
              }
            }
          },
          {
            attrs: {
              prop: 'leaseFinancing',
              label: '融资金额(元)',
              'min-width': '120',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.leaseFinancing)
              }
            }
          },
          {
            attrs: {
              prop: 'leaseTerm',
              label: '还款期限（月）',
              'min-width': '110'
            }
          },
          {
            attrs: {
              prop: 'repaymentFrequency',
              label: '还款频次',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.repaymentFrequency, '10031')
              }
            }
          },
          {
            attrs: {
              prop: 'irr',
              label: '项目IRR(%)',
              'min-width': '100',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.irr * 100, 4)
              }
            }
          },
          {
            attrs: {
              prop: 'removalTaxIrr',
              label: '去税IRR(%)',
              'min-width': '100',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.removalTaxIrr * 100, 4)
              }
            }
          },
          {
            attrs: {
              prop: 'measureIrr',
              label: '测算IRR(%)',
              'min-width': '100',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.measureIrr * 100, 4)
              }
            }
          },
          {
            attrs: {
              prop: 'annualInterestRate',
              label: '年利率(%)',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.annualInterestRate, 4)
              }
            }
          },
          {
            attrs: {
              prop: 'sysCreatorId',
              label: '创建人',
              formatter: row => {
                return Vue.filter('filterUserInfo')(row.sysCreatorId)
              }
            }
          },
          {
            attrs: {
              prop: 'sysEtime',
              label: '更新时间',
              width: '135',
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.sysEtime)
              }
            }
          }
        ],
        requestParams: {
          url: quotationList,
          data: {}
        },
        tableName: '报价方案列表',
        tableBottomOffset: 50,
        showTools: true,
        showSerialNumber: true
      },
      businessTypeOptions: queryDictItems('31600'),
      selectedRow: null
    }
  },
  watch: {
    refreshQuotationList() {
      this.refreshTable()
    }
  },
  methods: {
    handleSearch() {
      const data = this.searchForm.formData()
      this.refreshTable(data)
    },
    handleSearchReset() {
      this.searchForm.resetFields()
      this.refreshTable()
    },
    handleRowClick(row, column) {
      if (column.property === 'quotationName') {
        this.$router.push({
          path: '/project-mng/quotation-edit',
          query: {
            quotation_id: row.quotationId,
            quotation_name: row.quotationName,
            state: row.state,
            project_name: row.projectName
          }
        })
      }
      this.selectedRow = row
    },
    handleCurrentChange() {
      this.selectedRow = null
    },
    // 报价测算
    handleAddClick() {
      this.$router.push({
        path: '/project-mng/quotation-add',
        query: {}
      })
    },
    // 删除
    handleDeleteClick() {
      this.$confirm(`确定删除方案名称为“${this.selectedRow.quotationName}”的记录吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          quotationDelete({
            id: this.selectedRow.quotationId
          })
            .then(res => {
              this.$showToast('删除成功！', 'success')
              this.$refs.tableDom.refreshTable()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data)
    }
  }
}
</script>

<style lang='scss'>
.quotation-list-page {
  .el-table__row {
    cursor: pointer;
    .quotation-name {
      color: #5595ff;
    }
  }
}
</style>
