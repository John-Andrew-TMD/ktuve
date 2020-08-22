<template>
  <div>
    <el-dialog
      width="1000px"
      :modal-append-to-body="false"
      title="生成租赁询证函"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <form-search @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import FormSearch from 'components/FormSearch'
export default {
  inheritAttrs: false,
  components: {
    TableCreate,
    FormSearch
  },
  data() {
    return {
      dialogVisible: false,
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
              prop: 'bond_balance',
              label: '最新生成时间',
              minWidth: 130
            },
            filter: {
              name: 'toThousand'
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.dialogVisible = true
  },
  methods: {
    // 确定
    handleDialogConfirm() {
      this.formApi.validate(async valid => {
        if (valid) {
          // TODO
        }
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
