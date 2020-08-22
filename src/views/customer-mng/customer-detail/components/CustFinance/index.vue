<template>
  <div class="cust-finance-comp">
    <div class="btn-group">
      <el-button
        :disabled="globalCanEdit"
        size="mini"
        type="primary"
        @click="handleUploadReport('上传财务报表','A')"
      >上传财务报表</el-button>
      <el-button
        size="mini"
        type="primary"
        :disabled="isCheckedDataCompanyType"
        @click="handleGenerateGraph"
      >生成对比图</el-button>
      <el-button size="mini" type="primary" :disabled="!checkedData.length" @click="handleExport">导出</el-button>
      <el-button
        size="mini"
        type="primary"
        :disabled="globalCanEdit || isEditDisabled"
        @click="handleUploadReport('修改财务报表','U')"
      >修改</el-button>
      <el-button
        size="mini"
        type="danger"
        :disabled="globalCanEdit || !checkedData.length"
        @click="handleDeleteClick"
      >删除</el-button>
      <!-- <el-button size="mini" type="primary" @click="handleTemplateDownload">模板下载</el-button> -->
      <el-dropdown
        size="mini"
        type="primary"
        style="margin-left: 10px"
        @command="handleTemplateDownload"
      >
        <el-button size="mini" type="primary">
          模板下载
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="0">企业</el-dropdown-item>
          <el-dropdown-item command="4">事业单位</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <el-dropdown size="mini" class="ml-10" @command="handleDownload">
        <el-button type="primary">
          模板下载
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item,index) in modelList"
            :key="index"
            :command="item.value"
          >{{ item.label }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>-->
    </div>
    <table-create
      ref="tableDom"
      :options="table"
      @row-click="handleRowClick"
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <template v-slot:finStatementHeadline="{scope}">
        <span @click="navigateToDetailPage(scope.row)">{{scope.row.finStatementHeadline}}</span>
      </template>
    </table-create>
    <dialog-finance-report-upload
      v-if="dialogUploadStatus"
      :dialog-status.sync="dialogUploadStatus"
      :dialog-title="dialogTitle"
      :action="action"
      :selected-data="selectedData"
      :route-params="routeParams"
      @dialog-confirm="handleDialogConfirm"
    />
    <dialog-finance-report-export
      v-if="dialogExportStatus"
      :dialog-status.sync="dialogExportStatus"
      :checked-data="checkedData"
    />
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import { isEmptyObj, formSubmit } from 'utils'
import {
  custFinanceList,
  custFinanceDelete,
  custFinanceTemplateDownloadUrl
} from 'api/customer-module/api-customer-detail.js'

export default {
  components: {
    TableCreate,
    DialogFinanceReportUpload: () => import('./components/DialogFinanceReportUpload.vue'),
    DialogFinanceReportExport: () => import('./components/DialogFinanceReportExport.vue')
  },
  props: {
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogUploadStatus: false,
      dialogExportStatus: false,
      dialogTitle: '',
      action: '',
      table: {
        requestParams: {
          url: custFinanceList,
          data: { custId: this.routeParams.id }
        },
        showSerialNumber: true,
        showCheckbox: true,
        showPagination: true,
        columns: [
          {
            attrs: {
              label: '财报标题',
              prop: 'finStatementHeadline',
              align: 'left',
              'class-name': 'link-type',
              'min-width': '150',
              'show-overflow-tooltip': true
            },
            slot: true
          },
          {
            attrs: {
              label: '企业类型',
              prop: 'companyType',
              formatter: row => {
                return (
                  {
                    '0': '企业',
                    '4': '事业单位'
                  }[row.companyType] || row.companyType
                )
              }
            }
          },
          {
            attrs: {
              label: '报表类型',
              prop: 'reportType',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.reportType, '10020')
              }
            }
          },
          {
            attrs: {
              label: '报表细分类型',
              prop: 'reportDetailedType',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.reportDetailedType, '10021')
              }
            }
          },
          {
            attrs: {
              label: '报告日期',
              prop: 'reportDate',
              formatter: row => {
                return Vue.filter('filterTimestamp')(row.reportDate, 'YYYY-MM-DD')
              }
            }
          },
          {
            attrs: {
              label: '是否审计',
              prop: 'isAudit',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.isAudit, '10004')
              }
            }
          },
          {
            attrs: {
              label: '审计事务所名称',
              prop: 'auditFirmName'
            }
          },
          {
            attrs: {
              label: '审计人员名称',
              prop: 'auditorsName'
            }
          },
          {
            attrs: {
              label: '审计日期',
              prop: 'auditDate',
              formatter: row => {
                return Vue.filter('filterTimestamp')(row.auditDate, 'YYYY-MM-DD')
              }
            }
          },
          {
            attrs: {
              label: '上传时间',
              prop: 'sysCtime',
              formatter: row => {
                return Vue.filter('filterTimestamp')(row.sysCtime)
              },
              minWidth: 110
            }
          }
        ]
      },
      isCheckedDataCompanyType: false,
      selectedData: null,
      checkedData: []
    }
  },
  inject: ['getCustInfoField'],
  computed: {
    globalCanEdit() {
      return !this.routeParams.globalCanEdit
    },
    isEditDisabled() {
      return isEmptyObj(this.selectedData) || this.checkedData.length
    }
  },
  methods: {
    isCheckedDataFour(data) {
      var _this = this
      this.isCheckedDataCompanyType = false
      data.some(function(item) {
        if (item.companyType == '4') {
          _this.isCheckedDataCompanyType = true
          return true
        }
      })
    },
    navigateToDetailPage(rowData) {
      this.$router.push({
        path: '/customer-mng/cust-finance-detail',
        query: {
          id: rowData.id,
          companyType: rowData.companyType,
          finStatementHeadline: rowData.finStatementHeadline,
          custName: this.routeParams.custName,
          reportDetailedType: rowData.reportDetailedType,
          reportDate: rowData.reportDate
        }
      })
    },
    handleCurrentChange(rowData) {
      this.selectedData = rowData
    },
    handleSelectionChange(data) {
      this.checkedData = data
      this.isCheckedDataFour(data)
    },
    // 上传财务报告&修改
    handleUploadReport(title, type) {
      this.action = type
      this.dialogUploadStatus = true
      this.dialogTitle = title
    },
    // 生成对比图
    handleGenerateGraph() {
      const { checkedData } = this
      if (!checkedData || checkedData.length < 2) {
        this.$message.warning('请勾选至少2条数据')
        return
      }
      const ids = checkedData.map(item => item.id)
      this.$router.push({
        path: '/customer-mng/cust-finance-contrast',
        query: {
          finance_ids: ids.join(','),
          cust_id: this.routeParams.id
        }
      })
    },
    // 导出
    handleExport(type) {
      this.dialogExportStatus = true
      this.dialogTitle = '财务报表导出'
    },
    // 删除
    handleDeleteClick() {
      const ids = []
      let names = []
      this.checkedData.forEach(item => {
        ids.push(item.id)
        names.push(`<span style="color:#f56c6c;">${item.finStatementHeadline}</span>`)
      })
      names = names.join('、')
      this.$confirm(`是否确定删除：${names}?`, '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          custFinanceDelete({
            ids
          })
            .then(res => {
              this.$showToast('删除成功！', 'success')
              this.refreshTable()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    handleDialogConfirm() {
      this.refreshTable()
    },
    refreshTable() {
      this.$refs.tableDom.refreshTable()
    },
    // 模板下载
    handleTemplateDownload(type) {
      // const enterpriseType = this.getCustInfoField('companyType')
      formSubmit(
        custFinanceTemplateDownloadUrl,
        {
          companyType: type
        },
        'get'
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.cust-finance-comp {
  padding: 0 10px 10px;
  .btn-group {
    padding-top: 0;
    border-top: none;
  }
  .el-icon-arrow-down {
    vertical-align: bottom;
  }
}
</style>
