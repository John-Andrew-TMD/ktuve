<template>
  <div class="app-content department-mng-page">
    <div class="app-content-wrapper">
      <div class="btn-group sticky">
        <el-button type="primary" size="mini" @click="handleAddClick">新增</el-button>
      </div>
      <table-create ref="tableDom" :options="tableOptions" row-key="id" default-expand-all>
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
    <dialog-department-add-or-update
      v-if="dialogStatus"
      :dialog-status.sync="dialogStatus"
      :department-id="departmentId"
      @confirm="handleDialogConfirm"
    />
  </div>
</template>
<script>
import TableCreate from "components/TableCreate";
import DialogDepartmentAddOrUpdate from "./components/DialogDepartmentAddOrUpdate.vue";
import { departmentList, departmentDelete } from "api/user-mng.js";
import { generateTree } from "utils";
export default {
  filters: {
    filterStatus(val) {
      return ["正常", "停用", "到期"][val] || "";
    }
  },
  components: {
    TableCreate,
    DialogDepartmentAddOrUpdate
  },
  data() {
    return {
      tableOptions: {
        columns: [
          {
            attrs: {
              label: "部门名称",
              prop: "name",
              align: "left"
            }
          },
          {
            attrs: {
              label: "部门编码",
              prop: "code"
            }
          },
          {
            attrs: {
              label: "状态",
              prop: "status",
              width: "100"
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
          url: departmentList,
          data: {}
        },
        requestImmediate: false,
        showTools: false
      },
      dialogStatus: false,
      departmentId: -1,
      statusStyle: ["success", "danger", "danger"]
    };
  },
  created() {
    this.getDepartmentData();
  },
  methods: {
    getDepartmentData() {
      departmentList({})
        .then(res => {
          const data = res.data.records;
          if (Array.isArray(data) && data.length) {
            const ret = generateTree(data, "0", "id", "parentId");
            this.$refs.tableDom.setData(ret);
          }
        })
        .catch(err => {
          console.log(err);
          this.$refs.tableDom.setData([]);
        });
    },
    handleDialogConfirm() {
      this.$refs.tableDom.setData([]);
    },
    handleAddClick() {
      this.departmentId = -1;
      this.dialogStatus = true;
    },
    handleTableClick(action, data) {
      if (action === "update") {
        this.departmentId = data.id;
        this.dialogStatus = true;
      } else if (action === "delete") {
        this.$confirm("确定删除吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            departmentDelete({
              ids: [data.id]
            })
              .then(res => {
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
