<template>
  <div class="app-content user-mng-page">
    <div class="app-content-wrapper">
      <div class="btn-group sticky">
        <el-button type="primary" size="mini" @click="handleAddClick">新增</el-button>
      </div>
      <table-create ref="tableDom" :options="tableOptions">
        <template #status="{ scope }">
          <el-tag
            effect="dark"
            :type="statusStyle[scope.row.status]"
          >{{ scope.row.status | filterStatus }}</el-tag>
        </template>
        <template #operation="{ scope }">
          <el-button type="primary" size="mini" @click="handleTableClick('update', scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleTableClick('delete', scope.row)">删除</el-button>
        </template>
      </table-create>
    </div>
    <dialog-user-add-or-update
      v-if="dialogStatus"
      :dialog-status.sync="dialogStatus"
      :user-id="userId"
      @confirm="handleDialogConfirm"
    />
  </div>
</template>
<script>
import TableCreate from "components/TableCreate";
import DialogUserAddOrUpdate from "./components/DialogUserAddOrUpdate.vue";
import { userList, userDelete } from "api/user-mng.js";
export default {
  filters: {
    filterStatus(val) {
      return ["正常", "冻结", "过期", "离职"][val] || "";
    }
  },
  components: {
    TableCreate,
    DialogUserAddOrUpdate
  },
  data() {
    return {
      tableOptions: {
        columns: [
          {
            attrs: {
              label: "用户名",
              prop: "name"
            }
          },
          {
            attrs: {
              label: "登录名",
              prop: "loginName"
            }
          },
          {
            attrs: {
              label: "用户编号",
              prop: "code"
            }
          },
          {
            attrs: {
              label: "所属部门",
              prop: "deptName"
            }
          },
          // {
          //   attrs: {
          //     label: '员工级别',
          //     prop: 'levelId'
          //   }
          // },
          // {
          //   attrs: {
          //     label: '员工职务',
          //     prop: 'positionId'
          //   }
          // },
          {
            attrs: {
              label: "性别",
              prop: "sex",
              formatter: row => {
                return ["未知", "男", "女"][row.sex];
              }
            }
          },
          {
            attrs: {
              label: "状态",
              prop: "status",
              width: "100",
              formatter: row => {
                return ["正常", "冻结", "过期", "离职"][row.status] || "";
              }
            },
            slot: true
          },
          {
            attrs: {
              label: "操作",
              prop: "operation",
              width: "150"
            },
            slot: true
          }
        ],
        requestParams: {
          url: userList,
          data: {}
        },
        showTools: false
      },
      dialogStatus: false,
      userId: -1,
      statusStyle: ["success", "danger", "danger", "danger"]
    };
  },
  methods: {
    handleDialogConfirm() {
      this.$refs.tableDom.refreshTable();
    },
    handleAddClick() {
      this.userId = -1;
      this.dialogStatus = true;
    },
    handleTableClick(action, data) {
      if (action === "update") {
        this.userId = data.userId;
        this.dialogStatus = true;
      } else if (action === "delete") {
        this.$confirm("确定删除吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            userDelete({
              ids: [data.id]
            })
              .then(res => {
                this.$showToast("删除成功！", "success");
                this.$refs.tableDom.refreshTable();
              })
              .catch(() => {});
          })
          .catch(() => {});
      }
    }
  }
};
</script>

<style lang='scss'>
</style>
