<template>
  <div id = "customer-mng-page" class="app-content customer-mng-page">
    <div class="app-content-wrapper">
      <form-search collapse @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <el-button type="primary" size="mini" @click="handleAddClick">创建新项目</el-button>
        <el-button type="primary" :disabled="disabledFoundBtn" size="mini" @click="handleFlowClick('projectFound','发起立项审批')">发起立项审批</el-button>
        <el-button type="primary" :disabled="disabledApprovalBtn" size="mini" @click="handleFlowClick('projectApproval','发起项目审批')">发起项目审批</el-button>
        <el-button type="primary" :disabled="disabledChangeBtn" size="mini" @click="handleChangeClick">项目变更</el-button>
        <el-button type="primary" :disabled="disabledEndBtn" size="mini" @click="handleFlowClick('projectChange','项目完结')">项目完结</el-button>
        <el-button type="danger" size="mini" :disabled="disabledDeleteBtn" @click="handleDeleteClick">删除</el-button>
      </div>
      <table-create ref="tableDom" :options="tableOptions" @row-click="handleRowClick" @current-change="handleCurrentChange" @selection-change="handleSelectionChange" />
      <component :is="componentName" v-if="dialogStatus" :selected-rows="selectedRows" :dialog-status.sync="dialogStatus" @dialog-confirm="handleDialogConfirm" />
    </div>
  </div>
</template>
<script>
import TableCreate from 'components/TableCreate/index'
import FormSearch from 'components/FormSearch'
import { requestPost } from 'utils/fetch.js'
import { queryDictItems, isEmptyObj, thousandSeparator } from 'utils'
import { getDepartmentUser } from 'api/customer-module/api-customer-mng.js'
import { mapState } from 'vuex'
import {
  projectList,
  projectDelete,
  removeByIds,
  projectFound,
  projectApproval,
  projectChange
} from 'api/project-module/api-project-mng.js'
const projectMng = {
  projectFound,
  projectApproval
}
export default {
  name: 'ProjectList',
  components: {
    TableCreate,
    FormSearch,
    DialogAdd: () => import('./components/DialogProjectAdd.vue')
  },
  data() {
    return {
      searchForm: null,
      searchRules: [{
          type: 'el-custom-autocomplete',
          title: '项目名称',
          field: 'projectName',
          props: {
            params: {
              url: projectList,
              data: {},
              searchKey: 'projectName',
              labelKey: 'projectName',
              valueKey: 'projectName',
              repeat: false
            },
            // "popper-class":"my-autocomplete",
            clearable: true
          }
        },
        {
          type: 'el-custom-autocomplete',
          title: '客户名称',
          field: 'lesseeName',
          props: {
            params: {
              url: projectList,
              data: {},
              searchKey: 'lesseeName',
              labelKey: 'lesseeName',
              valueKey: 'lesseeName',
              repeat: false
            },
            clearable: true
          }
        },
        {
          type: 'el-custom-autocomplete',
          title: '业务经理',
          field: 'businessManagerName',
          props: {
            params: {
              url: projectList,
              data: {},
              searchKey: 'businessManagerName',
              labelKey: 'businessManagerName',
              valueKey: 'businessManagerName',
              repeat: false
            }
          }
        },
        {
          type: 'el-custom-autocomplete',
          title: '业务协办经理',
          field: 'viceBusinessManagerName',
          props: {
            params: {
              url: projectList,
              data: {},
              searchKey: 'viceBusinessManagerName',
              labelKey: 'viceBusinessManagerName',
              valueKey: 'viceBusinessManagerName',
              repeat: false
            },
            clearable: true
          }
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
          title: '项目状态',
          field: 'projectStatus',
          options: queryDictItems('10024')
        },
        {
          type: 'select',
          title: '项目来源',
          field: 'projectSource',
          options: queryDictItems('10028')
        }
      ],
      searchOptions: {
        form: { labelWidth: '100px', inline: true },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: projectList,
          data: {}
        },
        showCheckbox: true,
        showSerialNumber: true,
        showTools: false,
        tableBottomOffset: 50,
        selectedRow: 0,
        columns: [{
            attrs: {
              label: '项目名称',
              prop: 'projectName',
              align: 'left',
              'class-name': 'link-type',
              'min-width': '200px',
              'show-overflow-tooltip': true,
              formatter: row => {
                return row.projectName
              }
            }
          },
          {
            attrs: {
              label: '项目编号',
              prop: 'projectNo',
              'min-width': '130'
            }
          },
          {
            attrs: {
              label: '租赁类别',
              prop: 'businessCategory',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.businessCategory, '10027')
              }
            }
          },
          {
            attrs: {
              label: '租赁类型',
              prop: 'businessType',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.businessType, '10026')
              }
            }
          },
          {
            attrs: {
              label: '项目类型',
              prop: 'projectType',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.projectType, '10049')
              }
            }
          },
          {
            attrs: {
              label: '客户名称',
              prop: 'lesseeName',
              'min-width': '150',
              'show-overflow-tooltip': true,
              formatter: row => {
                if (row.businessCategory == '2') {
                  return row.transferorName
                }
                return row.lesseeName
              }
            }
          },
          {
            attrs: {
              label: '融资金额（元）',
              prop: 'leaseFinancing',
              'min-width': '150',
              'show-overflow-tooltip': true,
              formatter: row => {
                return thousandSeparator(row.leaseFinancing)
              }
            }
          },
          {
            attrs: {
              label: '租赁期限',
              prop: 'leaseTerm',
              formatter: row => {
                if (!row.leaseTerm) return ''
                return row.leaseTerm ? parseInt(row.leaseTerm) : ''
              }
            }
          },
          {
            attrs: {
              label: '项目IRR',
              prop: 'irr',
              formatter: row => {
                if (!row.irr) return
                return (parseFloat(row.irr) * 100).toFixed(4) + '%'

              }
            }
          },
          {
            attrs: {
              label: '业务经理',
              prop: 'businessManagerName'
            }
          },
          {
            attrs: {
              label: '业务协办经理',
              prop: 'viceBusinessManagerName'
            }
          },
          {
            attrs: {
              label: '风险审查岗',
              prop: 'riskReviewName'
            }
          },
          {
            attrs: {
              label: '法律审查岗',
              prop: 'legalReviewName'
            }
          },
          {
            attrs: {
              label: '项目状态',
              prop: 'projectStatus',
              'min-width': '150',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.projectStatus, '10024')
              }
            }
          },
          {
            attrs: {
              label: '项目来源',
              prop: 'projectSource',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.projectSource, '10028')
              }
            }
          },
          {
            attrs: {
              label: '更新时间',
              'min-width': '150',
              prop: 'sysEtime'
            },
            filter: {
              name: 'timestamp'
            }
          },
          {
            attrs: {
              label: '创建时间',
              'min-width': '150',
              prop: 'sysCtime'
            },
            filter: {
              name: 'timestamp'
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
  computed: {
     disabledDeleteBtn(){
      if(this.selectedRows.length){
         return Boolean(this.selectedRows.filter(el=>(el.projectStatus)!=0).length)
      }else{
        return true
      }
    },
    disabledFoundBtn() {
      return !this.rowData || +this.rowData.projectStatus !== 0
    },
    disabledApprovalBtn() {
      return !this.rowData || +this.rowData.projectStatus !== 3
    },
    disabledChangeBtn() {
      return !this.rowData || ![6, 10].includes(+this.rowData.projectStatus)
    },
    disabledEndBtn() {
      return !this.rowData || +this.rowData.projectStatus !== 12
    },
    ...mapState({
      refreshProjectList: state => state.refresh.refreshProjectList
    })
  },
  watch: {
    refreshProjectList() {
      this.$refs.tableDom.refreshTable()
    }
  },
  methods: {
    handleFlowClick(funName, text) {
      this.showConfirm(text, val => {
        projectMng[funName]({
            id: this.rowData.recordId,
            commentMessage: val || ''
          }, { showLoading: true })
          .then(res => {
            this.refreshTable();
            this.$showToast("发起成功", "success");
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    showConfirm(title, confirmCb) {
      this.$prompt(`确定${title}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'textarea',
          inputPlaceholder: '请输入发起意见',
          // inputPattern: /[^\s*]/,
          // inputErrorMessage: '发起意见不允许为空',
          type: 'warning'
        })
        .then(({value}) => {
          confirmCb && confirmCb(value)
        })
        .catch(() => {})
    },
    handleChangeClick() {
      this.$confirm('确定发起项目变更？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          projectChange({
            id: this.rowData.recordId
          }, { showLoading: true })
          .then(res => {
            if (res.data && res.data.id) {
              this.$showToast("发起成功", "success");
              this.refreshTable();
              this.$router.push({
                path: '/project-mng/project-detail',
                query: {
                  id: res.data.id
                }
              })
            } else {
              this.$showToast("发起失败");
            }
          })
          .catch(err => {
            console.log(err);
          });
        })
        .catch(() => {})
    },
    handleRowClick(rowData, column) {
      if (column&&column.property === 'projectName') {
        this.$router.push({
          path: '/project-mng/project-detail',
          query: {
            id: rowData.recordId,
            action_type: 'view',
            active_tab: 'ProjectBaseInfo'
          }
        })
      }
    },
    handleCurrentChange(row) {
      if (!row) return
      this.rowData = row
    },
    handleSelectionChange(row) {
      this.selectedRows = row
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

    handleAddClick() {
      this.componentName = 'DialogAdd'
      this.dialogStatus = true
    },
    // 删除
    handleDeleteClick() {
      if (!this.selectedRows.length) {
        return this.$showToast('未选中任何行！')
      }
      let ids = this.selectedRows.map(item => item.recordId)
      this.$confirm(`是否从项目列表中删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          removeByIds({
              ids
            }, { showLoading: true })
            .then(res => {
              this.$showToast('删除成功！', 'success')
              if (this.$refs.tableDom.tableData.length == ids.length) {
                this.$refs.tableDom.resetTableData()
              } else {
                this.$refs.tableDom.refreshTable(true)
              }
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
    handlesCooperationChange(obj) {
      if (!obj) return
      this.businessCooperation = obj.data.employeeName
    },
    // 新增成功后，返回新增后的信息，用于页面跳转
    handleDialogConfirm(projectInfo) {
      this.$refs.tableDom.refreshTable(true)
      if (!isEmptyObj(projectInfo)) {
        this.$nextTick(() => {
          this.$router.push({
            path: '/project-mng/project-detail',
            query: {
              id: projectInfo.id,
              action_type: 'add',
              active_tab: 'ProjectBaseInfo'
            }
          })
        })
        return
      }
    }
  }
}

</script>
// <style lang="scss">
//   .my-autocomplete{
//     width: 405px!important;
//   }
// </style>
