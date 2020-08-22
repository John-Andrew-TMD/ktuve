<template>
  <div class="app-content rating-mng-page">
    <div class="app-content-wrapper">
      <form-search @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <el-button size="mini" type="primary" @click="handleLaunchClick">发起评级</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="handleChangeRating"
          :disabled="changedDisabeld"
        >变更评级</el-button>
      </div>
      <table-create ref="tableDom" :options="tableOptions" @current-change="handleCurrentChange">
        <template v-slot:operation="{ scope }">
          <el-button
            type="primary"
            size="mini"
            plain
            @click="navigateToRatingScore(scope.row)"
          >最新评分表</el-button>
          <el-button type="primary" size="mini" plain @click="navigateToGradeDetail(scope.row)">评级详情</el-button>
        </template>
      </table-create>
    </div>
    <component
      :is="componentName"
      v-if="dialogStatus"
      :row-data="rowData"
      :dialog-status.sync="dialogStatus"
    />
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import FormSearch from 'components/FormSearch'
import { custRatingList, modelChange } from 'api/customer-module/api-customer-rating-mng.js'
import { queryDictItems } from 'utils'

export default {
  components: {
    TableCreate,
    FormSearch,
    DialogAdd: () => import('./components/DialogAdd.vue')
  },
  data() {
    return {
      // 搜索表单
      searchForm: null,
      searchRules: [
        {
          type: 'el-custom-autocomplete',
          title: '客户名称',
          field: 'custName',
          style: { width: '200px' },
          props: {
            params: {
              url: custRatingList,
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
          type: 'el-custom-autocomplete',
          title: '评定等级',
          field: 'evaluateLevel',
          style: { width: '200px' },
          props: {
            params: {
              url: custRatingList,
              data: {},
              searchKey: 'evaluateLevel',
              labelKey: 'evaluateLevel',
              valueKey: 'evaluateLevel',
              repeat: false
            },
            clearable: true
          }
        },
        {
          type: 'select',
          title: '审批状态',
          field: 'evaluateStatus',
          options: queryDictItems('10022')
        }
      ],
      searchOptions: {
        form: {
          labelWidth: '85px',
          inline: true
        },
        submitBtn: {
          show: false
        }
      },
      // 表格
      tableOptions: {
        requestParams: {
          url: custRatingList,
          data: {}
        },
        showSerialNumber: true,
        selectedRow: 0,
        columns: [
          {
            attrs: {
              label: '客户名称',
              prop: 'custName',
              align: 'left',
              minWidth: 150,
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              label: '客户编号',
              prop: 'custNo',
              minWidth: 120
            }
          },
          {
            attrs: {
              label: '定性指标得分',
              prop: 'changeScore',
              minWidth: 95
            }
          },
          {
            attrs: {
              label: '定量指标得分',
              prop: 'regularScore',
              minWidth: 95
            }
          },
          {
            attrs: {
              label: '总得分',
              prop: 'totalScore',
              minWidth: 90
            }
          },
          {
            attrs: {
              label: '评定等级',
              prop: 'evaluateLevel',
              minWidth: 90
            }
          },
          {
            attrs: {
              label: '评分人',
              prop: 'creatorName',
              minWidth: 90
            }
          },
          {
            attrs: {
              label: '评级日期',
              prop: 'sysEtime',
              minWidth: 90
            },
            filter: {
              name: 'date'
            }
          },
          {
            attrs: {
              label: '审批状态',
              prop: 'evaluateStatus',
              minWidth: 90
            },
            filter: {
              name: 'dict',
              params: '10022'
            }
          },
          {
            attrs: {
              label: '操作',
              prop: 'operation',
              minWidth: 210
            },
            slot: 'operation'
          }
        ]
      },
      rowData: null,
      dialogStatus: false,
      componentName: 'DialogAdd'
    }
  },
  methods: {
    handleCurrentChange(rowData) {
      this.rowData = rowData
    },
    // 发起评级
    handleLaunchClick() {
      this.dialogStatus = true
    },
    // 变更评级
    handleChangeRating() {
      modelChange(
        {
          id: this.rowData.id
        },
        { showLoading: true }
      ).then(res => {
        if (!res.data) return
        const rowData = Object.assign({}, this.rowData, res.data)
        this.navigateToRatingScore(rowData)
      })
    },
    // 跳转到客户评级详情页面
    navigateToGradeDetail(data) {
      this.$router.push({
        path: '/customer-mng/customer-rating-detail',
        query: {
          id: data.custId,
          name: data.custName
        }
      })
    },
    // 跳转到客户评分详情页面
    navigateToRatingScore(data) {
      this.$router.push({
        path: '/customer-mng/customer-rating-score',
        query: {
          id: data.id,
          cust_id: data.custId,
          canEdit: true
        }
      })
    },
    handleSearch() {
      const data = this.searchForm.formData()
      this.$refs.tableDom.searchTableData(data)
    },
    handleSearchReset() {
      this.searchForm.resetFields()
      this.$refs.tableDom.resetTableData()
    }
  },
  computed: {
    changedDisabeld() {
      if (!this.rowData) return true
      return ![2, 6].includes(+this.rowData.evaluateStatus)
    }
  }
}
</script>

<style lang="scss">
.operation-btn {
  display: inline;
}
</style>
