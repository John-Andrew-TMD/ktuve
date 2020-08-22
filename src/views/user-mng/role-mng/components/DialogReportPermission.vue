<template>
  <el-dialog
    title="报表权限设置"
    :visible.sync="dialogShow"
    width="600px"
    :modal-append-to-body="false"
    @closed="handleDialogClosed"
  >
    <div class="user-report-permission-container">
      <el-form ref="formDom" :model="formItem" label-width="90px" :rules="formRules">
        <el-form-item label="权限类型" prop="reportPermissionType">
          <el-select v-model="formItem.reportPermissionType" placeholder="请选择" @change="handleReportPermissionTypeChange">
            <el-option
              v-for="item in reportPermissionTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div v-show="formItem.reportPermissionType === '2'" class="report-list">
          <el-form-item>
            <el-checkbox v-model="formItem.checkAll" :indeterminate="formItem.isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox-group v-model="formItem.checkedReports" @change="handleCheckedReportsChange">
              <el-checkbox v-for="item in reportList" :key="item.widgetId" :label="item.widgetId">{{ item.widgetName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogShow=false">取消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  roleUpdatePermission,
  getAuthConfig,
  getReportPermissionByRoleId
} from 'api/user-mng.js'
import { isEmptyObj } from 'utils'
export default {
  props: {
    roleId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      dialogShow: false,
      formItem: {
        reportPermissionType: '',
        checkAll: false,
        isIndeterminate: false,
        checkedReports: []
      },
      formRules: {
        reportPermissionType: [{ required: true, message: '必填项不能为空！' }]
      },
      reportList: [],
      reportPermissionTypeOptions: [
        {
          label: '全部',
          value: '1'
        },
        {
          label: '自定义',
          value: '2'
        }
      ]
    }
  },
  created() {
    this.getPermissionData()
  },
  mounted() {
    this.dialogShow = true
  },
  methods: {
    getPermissionData() {
      Promise.all([
        getReportPermissionByRoleId({
          id: this.roleId
        }),
        getAuthConfig({})
      ]).then(res => {
        const [reportData, configData] = res
        if (!isEmptyObj(configData.data)) {
          const { sysReportRoleCheckDtos } = configData.data
          this.reportList = sysReportRoleCheckDtos.map(item => {
            return {
              widgetId: item.widgetId + '',
              widgetName: item.widgetName
            }
          })
        }
        if (reportData.data && Array.isArray(reportData.data.records)) {
          const records = reportData.data.records
          if (records.length === 1 && records[0].permissionId === '0') {
            this.formItem.reportPermissionType = '1'
          } else if (records.length) {
            this.formItem.checkedReports = records.map(item => item.permissionId)
            this.formItem.reportPermissionType = '2'
            this.handleCheckedReportsChange(this.formItem.checkedReports)
          }
        }
      }).catch(err => { console.log(err) })
        .finally(() => {
          this.emptyText = '暂无数据'
        })
    },
    handleDialogConfirm() {
      this.updateReportPermission()
    },
    // 更新报表权限
    updateReportPermission() {
      this.$refs.formDom.validate(valid => {
        if (!valid) return
        const params = {
          roleId: this.roleId,
          type: 6
        }
        let permissions = [{
          type: 6,
          permissionId: 0
        }]
        if (this.formItem.reportPermissionType === '2') {
          permissions = this.formItem.checkedReports.map(id => {
            return {
              type: 6,
              permissionId: id
            }
          })
        }
        params.permissions = permissions
        roleUpdatePermission(params, { showLoading: true }).then(res => {
          this.$showToast('修改成功！', 'success')
          this.handleDialogClosed()
        }).catch(err => {
          console.log(err)
        })
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialog-status', false)
    },
    handleReportPermissionTypeChange(val) {
      if (val === '1') {
        this.formItem.checkedReports = []
        this.formItem.isIndeterminate = false
      }
    },
    handleCheckAllChange(val) {
      this.formItem.checkedReports = val ? this.reportList.map(item => item.widgetId) : []
      this.formItem.isIndeterminate = false
    },
    handleCheckedReportsChange(value) {
      const checkedCount = value.length
      this.formItem.checkAll = checkedCount === this.reportList.length
      this.formItem.isIndeterminate = checkedCount > 0 && checkedCount < this.reportList.length
    }
  }
}
</script>

<style lang='scss' scoped>
.user-report-permission-container {
  min-height: 500px;
  .report-list {
    .el-form-item {
      margin-bottom: 5px;
    }
    .el-checkbox-group label {
      display: block;
    }
  }
}

</style>
