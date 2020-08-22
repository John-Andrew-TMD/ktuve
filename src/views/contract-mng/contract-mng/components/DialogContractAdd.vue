<template>
  <div class="inline-dialog">
    <el-dialog
      class="comp-dialog-contract-add-list"
      title="选择项目"
      :visible.sync="dialogShow"
      width="1085px"
      :modal="false"
      @closed="handleDialogClosed"
    >
      <p class="tips">以下为立项已通过且未创建合同的项目，请选择并开始创建合同：</p>
      <form-search @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <table-create
        v-if="dialogShow"
        ref="tableDom"
        :options="tableOptions"
        @current-change="handleCurrentChange"
      ></table-create>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow=false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate'
import FormSearch from 'components/FormSearch'
import { projectList, addNewContract } from 'api/contract-module/api-contract-mng.js'
export default {
  data() {
    return {
      dialogShow: false,
      searchForm: null,
      searchRules: [
        {
          type: 'el-custom-autocomplete',
          title: '项目名称',
          style: { width: '220px' },
          field: 'projectName',
          props: {
            params: {
              url: projectList,
              data: {},
              searchKey: 'projectName',
              labelKey: 'projectName',
              valueKey: 'projectName',
              repeat: false
            }
          }
        }
      ],
      searchOptions: {
        form: { labelWidth: 'auto', inline: true },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: projectList,
          data: {}
        },
        showPagination: true,
        showSerialNumber: true,
        // tableBottomOffset: 242,
        columns: [
          {
            attrs: {
              prop: 'projectName',
              label: '项目名称',
              align: 'left',
              'min-width': '160',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              prop: 'projectNo',
              label: '项目编号',
              'min-width': '120',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              prop: 'businessCategory',
              label: '租赁类别',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.businessCategory, '10027')
              }
            }
          },
          {
            attrs: {
              prop: 'businessType',
              label: '租赁类型',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.businessType, '10026')
              }
            }
          },
          {
            attrs: {
              prop: 'projectType',
              label: '项目类型',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.projectType, '10049')
              }
            }
          },
          {
            attrs: {
              prop: 'businessManagerName',
              label: '业务主办经理',
              'min-width': '110',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              prop: 'viceBusinessManagerName',
              label: '业务协办经理',
              'min-width': '110',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              prop: 'leaseFinancing',
              label: '项目融资金额(元)',
              'min-width': '100',
              'show-overflow-tooltip': true,
              formatter: row => {
                return Vue.filter('filterToThousand')(row.leaseFinancing)
              }
            }
          },
          {
            attrs: {
              prop: 'approvalTime',
              label: '立项通过时间',
              'min-width': '140',
              'show-overflow-tooltip': true,
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.approvalTime)
              }
            }
          },
          {
            attrs: {
              prop: 'inquireTime',
              label: '项目审批通过时间',
              'min-width': '140',
              'show-overflow-tooltip': true,
              formatter: (row, column) => {
                return row.inquireTime ? Vue.filter('filterTimestamp')(row.inquireTime) : '--'
              }
            }
          }
        ]
      },
      rowData: null
    }
  },
  mounted() {
    this.dialogShow = true
  },
  methods: {
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    },
    handleDialogConfirm() {
      if (!this.rowData) return this.$showToast('请选择一个项目！')
      let params = {
        businessCooperation: this.rowData.viceBusinessManagerName,
        businessCooperationId: this.rowData.viceBusinessManagerId,
        businessManage: this.rowData.businessManagerName,
        businessManagerId: this.rowData.businessManagerId,
        custId: this.rowData.businessCategory == '2' ? this.rowData.transferorId : this.rowData.lesseeId,
        projectManagerId: this.rowData.managerId
      }
      addNewContract(
        {
          dto: params
        },
        { showLoading: true }
      )
        .then(res => {
          this.$showToast('成功！', 'success')
          this.dialogShow = false
          this.$router.push({
            path: '/contract-mng/contract-detail',
            query: {
              id: res.data.id
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleCurrentChange(row) {
      this.rowData = row
    },
    handleSearch() {
      const data = this.searchForm.formData()
      this.refreshTable(data)
    },
    handleSearchReset() {
      this.searchForm.resetFields()
      this.refreshTable()
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data)
    }
  },
  components: {
    TableCreate,
    FormSearch
  }
}
</script>

<style lang='scss'>
.comp-dialog-contract-add-list {
  .el-dialog__body {
    min-height: 336px;
  }
  .tips {
    margin-bottom: 20px;
  }
}
</style>
