<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogShow"
    width="600px"
    :modal-append-to-body="false"
    @closed="handleDialogClosed"
  >
    <table-create
      v-model="tableApi"
      :options="tableOptions"
      @request-complete="handleTableRequestComplete"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogShow=false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getAssignRoleUserConfig,
  roleMemberAdd
} from 'api/user-mng.js'
import TableCreate from 'components/TableCreate'
export default {
  components: {
    TableCreate
  },
  props: {
    roleData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dialogShow: false,
      dialogTitle: '管理角色成员',
      tableApi: null,
      tableOptions: {
        columns: [
          {
            attrs: {
              label: '用户名',
              prop: 'name'
            }
          },
          {
            attrs: {
              label: '用户编号',
              prop: 'code'
            }
          },
          {
            attrs: {
              label: '部门名称',
              prop: 'deptName'
            }
          }
        ],
        requestParams: {
          url: getAssignRoleUserConfig,
          data: {}
        },
        showTools: false,
        showPagination: false,
        showCheckbox: true
      }
    }
  },
  created() {

  },
  mounted() {
    this.dialogShow = true
  },
  methods: {
    handleDialogConfirm() {
      const selectedUsers = this.tableApi.selection
      roleMemberAdd({
        roleId: this.roleData.id,
        userIds: selectedUsers.map(item => item.userId)
      }, { showLoading: true })
        .then(res => {
          this.dialogShow = false
          this.$showToast('新增成功！', 'success')
          this.$emit('confirm')
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDialogClosed() {
      this.$emit('update:dialog-status', false)
    },
    handleTableRequestComplete(data) {
      if (Array.isArray(this.roleData.sysEmployeeTableEntityDtos) && this.roleData.sysEmployeeTableEntityDtos.length) {
        const userIds = this.roleData.sysEmployeeTableEntityDtos.map(item => item.userId)
        const selectedRows = data.filter(item => userIds.includes(item.userId))
        selectedRows.forEach(row => {
          this.tableApi.toggleRowSelection(row, true)
        })
      }
    }
  }
}
</script>

<style lang='scss'>
</style>
