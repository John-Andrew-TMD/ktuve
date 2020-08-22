<template>
  <div class="app-content deposit-mng-page">
    <div class="app-content-wrapper">
      <form-search collapse @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <el-button
          type="primary"
          :disabled="deductDisabled"
          @click="handleButtonClick('Deduct')"
        >生成租赁询证函</el-button>
        <el-button
          type="primary"
          :disabled="completeDisabled"
          @click="handleButtonClick('Complete')"
        >上传</el-button>
        <el-button
          type="primary"
          :disabled="completeDisabled"
          @click="handleButtonClick('Remargin')"
        >下载</el-button>
        <el-button type="primary" @click="handleDetailClick">详情</el-button>
      </div>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
      />
      <component
        :is="componentName"
        v-if="dialogStatus"
        :dialog-status.sync="dialogStatus"
        @dialog-confirm="handleDialogConfirm"
      />
    </div>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import FormSearch from 'components/FormSearch'
import { queryDictItems, queryDictValue } from 'utils'
export default {
  components: {
    TableCreate,
    FormSearch,
    DialogCreateLetter: () => import('./components/DialogCreateLetter')
  },
  data() {
    return {
      searchForm: null,
      searchRules: [
        {
          type: 'el-custom-autocomplete',
          field: 'custName',
          title: '客户名称',
          style: { width: '220px' },
          props: {
            params: {
              code: '203400',
              data: {
                action: 'Q'
              },
              searchKey: 'custName',
              labelKey: 'custName',
              valueKey: 'custName',
              repeat: false
            }
          }
        },
        {
          type: 'el-date-picker',
          field: 'create_time',
          style: { width: '220px' },
          title: '首次起租时间',
          props: {
            valueFormat: 'timestamp',
            type: 'daterange'
          }
        },
        {
          type: 'el-date-picker',
          field: 'create_time34',
          style: { width: '220px' },
          title: '系统生成时间',
          props: {
            valueFormat: 'timestamp',
            type: 'daterange'
          }
        },
        {
          type: 'el-date-picker',
          field: 'create_time3',
          style: { width: '220px' },
          title: '数据截止时间',
          props: {
            valueFormat: 'timestamp',
            type: 'daterange'
          }
        },
        {
          type: 'select',
          field: 'sfdsfsd',
          title: '是否回传',
          options: queryDictItems('10004'),
          style: { width: '220px' }
        },
        {
          type: 'el-date-picker',
          field: 'create_time4',
          style: { width: '220px' },
          title: '回传时间',
          props: {
            valueFormat: 'timestamp',
            type: 'daterange'
          }
        }
      ],
      searchOptions: {
        form: { labelWidth: '100px', inline: true },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: '',
          data: {}
        },
        showTools: true,
        selectedRow: 0,
        showSerialNumber: true,
        colspanAttrs: ['projectName', 'custName', 'contractNo', 'accounting_entity'],
        tableBottomOffset: 85,
        requestImmediate: false,
        columns: [
          {
            attrs: {
              prop: 'custName',
              label: '客户名称',
              minWidth: 140,
              showOverflowTooltip: true
            }
          },
          {
            attrs: {
              prop: 'contractNo',
              label: '首次起租时间',
              minWidth: 140,
              showOverflowTooltip: true
            }
          },
          {
            attrs: {
              prop: 'contractNo',
              label: '合同数（n/N）',
              minWidth: 140,
              showOverflowTooltip: true
            }
          },
          {
            attrs: {
              prop: 'receivable_amount',
              label: '剩余租金',
              minWidth: 130
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'receivable_amount',
              label: '剩余本金',
              minWidth: 130
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'received_amount',
              label: '剩余利息',
              minWidth: 130
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'deductible_amount',
              label: '剩余风险保证金金（元）',
              minWidth: 130
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'returned_amount',
              label: '剩余续保保证金金（元）',
              minWidth: 130
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'completed_amount',
              label: '询证函',
              minWidth: 130
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'bond_balance',
              label: '数据截止到（时间）',
              minWidth: 130
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'depositType',
              label: '是否回传',
              minWidth: 120,
              showOverflowTooltip: true
            },
            filter: {
              name: 'dict',
              params: ['10004']
            }
          },
          {
            attrs: {
              prop: 'bond_balance',
              label: '回传时间',
              minWidth: 130
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'deductState',
              label: '系统生成时间',
              minWidth: 120,
              showOverflowTooltip: true
            },
            filter: {
              name: 'dict',
              params: ['33302']
            }
          }
        ]
      },
      rowData: null,
      selectedRows: [],
      componentName: '',
      dialogStatus: false
    }
  },
  methods: {
    handleRowClick(rowData, column) {
      if (column.property === 'demo') {
        // TODO 页面调整
      }
    },
    handleCurrentChange(row) {
      this.rowData = row
    },
    handleSelectionChange(row) {},
    handleSearch() {
      const data = this.searchForm.formData()
      this.refreshTable(data)
    },
    handleSearchReset() {
      this.searchForm.resetFields()
      this.refreshTable()
    },
    handleButtonClick(name) {
      this.componentName = `DialogCreateLetter`
      this.dialogStatus = true
    },
    handleDetailClick() {
      this.$router.push({
        path: '/investment-mng/confirmation-letter-detail',
        query: {}
      })
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data)
    },
    // 新增成功后，返回新增后的信息，用于页面跳转
    handleDialogConfirm(customerInfo) {}
  }
}
</script>

<style lang="scss">
</style>
