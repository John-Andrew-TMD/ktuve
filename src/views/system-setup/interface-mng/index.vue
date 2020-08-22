<template>
  <div class="app-content interface-mng-page">
    <div class="app-content-wrapper">
      <div class="btn-group sticky">
        <el-button type="primary" size="mini" @click="handleAddClick">新增</el-button>
        <el-button
          type="primary"
          size="mini"
          :disabled="!rowData"
          @click="handlePermissionClick"
        >权限设置</el-button>
      </div>
      <div class="interface-container">
        <div class="left">
          <ul class="api-list">
            <li
              v-for="(item, index) in interfaceGroup"
              :key="index"
              :class="{selected: activeIndex === index}"
              @click="handleInterfaceGroupItemClick(item, index)"
            >{{ item }}</li>
          </ul>
        </div>
        <div class="right">
          <table-create
            ref="tableDom"
            style="margin-top: 0"
            :options="tableOptions"
            @row-click="handleRowClick"
            @current-change="handleCurrentChange"
          >
            <template #status="{ scope }">
              <el-tag
                effect="dark"
                :type="statusStyle[scope.row.status]"
              >{{ scope.row.status | filterStatus }}</el-tag>
            </template>
            <template #operation="{ scope }">
              <el-button
                type="primary"
                size="mini"
                @click="handleTableClick('update', scope.row)"
              >编辑</el-button>
              <el-button type="danger" size="mini" @click="handleTableClick('delete', scope.row)">删除</el-button>
            </template>
          </table-create>
        </div>
      </div>
    </div>
    <dialog-interface-add-or-update
      v-if="dialogStatus"
      :dialog-status.sync="dialogStatus"
      :interface-id="interfaceId"
      @confirm="handleDialogConfirm"
    />
    <dialog-interface-permission
      v-if="dialogPermissionStatus"
      :dialog-status.sync="dialogPermissionStatus"
      :interface-id="interfaceId"
    />
  </div>
</template>

<script>
import TableCreate from "components/TableCreate";
import DialogInterfaceAddOrUpdate from "./components/DialogInterfaceAddOrUpdate.vue";
import DialogInterfacePermission from "./components/DialogInterfacePermission.vue";
import {
  interfaceGroup,
  getInterfaceByName,
  interfaceDelete
} from "api/system-setup.js";
export default {
  filters: {
    filterStatus(val) {
      return ["启用", "禁用"][val] || "";
    }
  },
  components: {
    TableCreate,
    DialogInterfaceAddOrUpdate,
    DialogInterfacePermission
  },
  data() {
    return {
      tableOptions: {
        columns: [
          {
            attrs: {
              label: "接口名称",
              prop: "name",
              align: "left"
            }
          },
          {
            attrs: {
              label: "请求路径",
              prop: "url"
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
          url: getInterfaceByName,
          data: {}
        },
        requestImmediate: false
      },
      interfaceGroup: [],
      statusStyle: ["success", "danger"],
      dialogStatus: false,
      dialogPermissionStatus: false,
      interfaceId: -1,
      activeIndex: 0,
      rowData: null
    };
  },
  created() {
    this.getInterfaceGroup();
  },
  methods: {
    getInterfaceGroup() {
      interfaceGroup({}, { showLoading: true })
        .then(({ data }) => {
          if (
            data &&
            Array.isArray(data.records) &&
            data.records[0] &&
            Array.isArray(data.records[0].apiNames)
          ) {
            const { apiNames, serverName } = data.records[0];
            this.interfaceGroup = apiNames;
            this.serverName = serverName;
            this.getInterfaceListByName(apiNames[0]);
          } else {
            this.$refs.tableDom.setData([]);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getInterfaceListByName(name) {
      this.$refs.tableDom.searchTableData({
        apiName: name,
        serverName: this.serverName
      });
    },
    handleDialogConfirm() {
      this.$refs.tableDom.refreshTable();
    },
    handleAddClick() {
      this.interfaceId = -1;
      this.dialogStatus = true;
    },
    handlePermissionClick() {
      this.dialogPermissionStatus = true;
      this.interfaceId = this.rowData.id;
    },
    handleRowClick(row) {
      this.rowData = row;
    },
    handleCurrentChange() {
      this.rowData = null;
    },
    handleTableClick(action, data) {
      if (action === "update") {
        this.interfaceId = data.id;
        this.dialogStatus = true;
      } else if (action === "delete") {
        this.$confirm("确定删除吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            interfaceDelete({
              ids: [data.id]
            })
              .then(res => {
                this.$refs.tableDom.refreshTable();
              })
              .catch(() => {});
          })
          .catch(() => {});
      }
    },
    handleInterfaceGroupItemClick(name, index) {
      this.activeIndex = index;
      this.getInterfaceListByName(name);
    }
  }
};
</script>

<style lang='scss'>
.interface-mng-page {
  .interface-container {
    display: flex;
    flex: 1;
    padding-top: 10px;
    .left {
      overflow: auto;
      flex-shrink: 0;
      width: 200px;
      margin-right: 10px;
      padding: 5px 10px 0;
      color: #606266;
      border: 1px solid #EEEEEE;
      .api-list {
        padding-left: 10px;
        li {
          line-height: 30px;
          cursor: pointer;
          &:hover {
            color: #409EFF;
          }
        }
      }
      .selected {
        color: #409EFF;
      }
    }
    .right {
      overflow: hidden;
      flex: 1;
    }
  }
}

</style>
