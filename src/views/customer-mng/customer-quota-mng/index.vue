<template>
  <div class="app-content quota-mng-page">
    <div class="app-content-wrapper">
      <form-search @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <el-button size="mini" type="primary" :disabled="!rowData" @click="handleDetailClick">额度详情</el-button>
        <!-- <el-button size="mini" type="primary" @click="handleAdd">新增授信（调试用）</el-button> -->
      </div>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        border
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <template v-slot:creditStatus="slotScope">
          <div
            :class="{green:slotScope.scope.row.creditStatus!=1,red:slotScope.scope.row.creditStatus==1}"
          >{{ slotScope.scope.row.creditStatus | filterDictValue('10050') }}</div>
        </template>
      </table-create>
    </div>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import FormSearch from 'components/FormSearch'
import { creditList, creditAdd } from 'api/customer-module/api-customer-quota-mng.js'
import { customerList } from 'api/customer-module/api-customer-mng.js'
import { queryDictItems, parseTime } from 'utils'
export default {
  components: {
    TableCreate,
    FormSearch
  },
  data() {
    return {
      searchForm: null,
      searchRules: [
        {
          type: 'el-custom-autocomplete',
          title: '客户名称',
          field: 'custName',
          style: { width: "220px" }, 
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
          title: '状态',
          field: 'creditStatus',
          style: { width: "220px" }, 
          options: queryDictItems("10050")
        }
      ],
      searchOptions: {
        form: { labelWidth: '100px', inline: true },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: creditList,
          data: {}
        },
        columns: [
          {
            attrs: {
              label: '客户名称',
              prop: 'custName',
              align: 'left',
              'min-width': '150',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              label: '状态',
              prop: 'creditStatus'
            },
            slot: 'creditStatus'
          },
          {
            attrs: {
              label: '授信额度(元)',
              prop: 'amtTotal'
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              label: '已用额度(元)',
              prop: 'amtUsed'
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              label: '可用额度(元)',
              prop: 'amtCan'
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              label: '创建日期',
              prop: 'sysCtime'
            },
            filter: {
              name: 'timestamp'
            }
          },
          {
            attrs: {
              label: '到期日期',
              prop: 'overTime'
            },
            filter: {
              name: 'timestamp'
            }
          },
          {
            attrs: { label: '更新时间', prop: 'sysEtime' },filter: {
              name: 'timestamp'
            }
          },
          {
            attrs: {
              label: '是否循环授信',
              prop: 'isRevolve'
            },
            filter: { name: 'dict', params: '10004' }
          }
        ],
        showSerialNumber: true,
        showTools: true
      },
      rowData: null
    }
  },
  methods: {
    handleSearch() {
      const data = this.searchForm.formData()
      this.refreshTable(data)
    },
    handleSearchReset() {
      this.$refs.searchForm.resetFields()
      this.refreshTable()
    },
    handleCurrentChange(data) {
      this.rowData = data
    },
    handleDetailClick() {
      this.$router.push({
        path: '/customer-mng/quota-detail',
        query: {
          id: this.rowData.custId,
          name: encodeURIComponent(this.rowData.custName)
        }
      })
    },
    // handleAdd(){
    //   let params = {
    //     amtHappen: 1110,
    //     creditNo: 'XM202006001',
    //     custId: '1267272883588075521',
    //     managerId: '1274973394957271042'
    //   }
    //   creditAdd(params, { showLoading: true }).then(res => {
    //     this.$showToast("新增成功!", "success");
    //     this.$refs.tableDom.refreshTable(true)
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data)
    }
  }
}
</script>

<style lang="scss" scoped>
  .green {
    color: #67C23A;
  }
  .red {
    color: #FF4949;
  }
</style>

