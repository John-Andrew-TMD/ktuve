<template>
  <div class="app-content role-mng-page">
    <div class="app-content-wrapper">
      <div class="btn-group sticky">
        <el-button type="primary" size="mini" @click="handleAddClick">新增</el-button>
        <el-button
          type="primary"
          size="mini"
          :disabled="!rowData"
          @click="handlePermissionClick"
        >权限设置</el-button>
        <el-button
          type="primary"
          size="mini"
          :disabled="!rowData"
          @click="handleReportPermissionClick"
        >报表权限</el-button>
        <el-button type="primary" size="mini" :disabled="!rowData" @click="handleMemberClick">管理角色成员</el-button>
      </div>
      <table-create
        ref="tableDom"
        v-model="tableApi"
        :options="tableOptions"
        row-key="id"
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
      >
        <template #status="{ scope }">
          <el-tag
            v-if="!scope.row.userId"
            effect="dark"
            :type="departmentStatusStyle[scope.row.status]"
          >{{ scope.row.status | filterStatus }}</el-tag>
        </template>
        <template #operation="{ scope }">
          <el-button
            v-if="!scope.row.userId"
            type="primary"
            size="mini"
            @click="handleTableClick('update', scope.row)"
          >编辑</el-button>
          <el-button
            v-if="!scope.row.userId"
            type="danger"
            size="mini"
            @click="handleTableClick('delete', scope.row)"
          >删除</el-button>
        </template>
      </table-create>
    </div>
    <dialog-role-add-or-update
      v-if="dialogStatus"
      :dialog-status.sync="dialogStatus"
      :role-id="roleId"
      @confirm="handleDialogConfirm"
    />
    <dialog-role-permission
      v-if="dialogPermissionStatus"
      :dialog-status.sync="dialogPermissionStatus"
      :role-id="roleId"
    />
    <dialog-report-permission
      v-if="dialogReportPermissionStatus"
      :dialog-status.sync="dialogReportPermissionStatus"
      :role-id="roleId"
    />
    <dialog-role-member
      v-if="dialogMemberStatus"
      :dialog-status.sync="dialogMemberStatus"
      :role-data="rowData"
      @confirm="handleDialogConfirm"
    />
  </div>
</template>
<script>
import TableCreate from 'components/TableCreate'
import DialogRoleAddOrUpdate from './components/DialogRoleAddOrUpdate.vue'
import DialogRolePermission from './components/DialogRolePermission.vue'
import DialogReportPermission from './components/DialogReportPermission.vue'
import DialogRoleMember from './components/DialogRoleMember.vue'
import { roleList, roleDelete } from 'api/user-mng.js'
export default {
  filters: {
    filterStatus(val) {
      return ['未知', '启用', '禁用'][val] || ''
    }
  },
  components: {
    TableCreate,
    DialogRoleAddOrUpdate,
    DialogRolePermission,
    DialogReportPermission,
    DialogRoleMember
  },
  data() {
    return {
      tableOptions: {
        columns: [
          {
            attrs: {
              label: '角色名称',
              prop: 'name',
              align: 'left'
            }
          },
          {
            attrs: {
              label: '状态',
              prop: 'status',
              width: '100'
            },
            slot: true
          },
          {
            attrs: {
              label: '操作',
              prop: 'operation',
              width: '150'
            },
            slot: true
          }
        ],
        requestParams: {
          url: '',
          data: {}
        },
        tableBottomOffset: 10,
        requestImmediate: false,
        showTools: false,
        showPagination: false
      },
      dialogStatus: false,
      dialogPermissionStatus: false,
      dialogReportPermissionStatus: false,
      dialogMemberStatus: false,
      roleId: -1,
      departmentStatusStyle: ['info', 'success', 'danger'],
      tableApi: null,
      rowData: null
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      roleList({
        dto: {},
        pageSize: 10000,
        pageCurrent: 1
      })
        .then(res => {
          const data = res.data.records
          if (Array.isArray(data) && data.length) {
            data.forEach(item => {
              item.children = item.sysEmployeeTableEntityDtos || []
            })
            this.$refs.tableDom.setData(data)
          }
        })
        .catch(err => {
          console.log(err)
          this.$refs.tableDom.setData([])
        })
    },
    handleDialogConfirm() {
      this.tableApi.setCurrentRow()
      this.getRoleList()
    },
    handleAddClick() {
      this.roleId = -1
      this.dialogStatus = true
    },
    handleTableClick(action, data) {
      if (action === 'update') {
        this.roleId = data.id
        this.dialogStatus = true
      } else if (action === 'delete') {
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            roleDelete({
              ids: [data.id]
            })
              .then(res => {
                this.$refs.tableDom.refreshTable()
              })
              .catch(() => {})
          })
          .catch(() => {})
      }
    },
    handlePermissionClick() {
      this.dialogPermissionStatus = true
      this.roleId = this.rowData.id
    },
    handleReportPermissionClick() {
      this.dialogReportPermissionStatus = true
      this.roleId = this.rowData.id
    },
    handleMemberClick() {
      this.dialogMemberStatus = true
    },
    handleRowClick(row) {
      if (row.userId) return
      this.rowData = row
    },
    handleCurrentChange() {
      this.rowData = null
    }
  }
}
</script>

<style lang='scss'>
</style>
