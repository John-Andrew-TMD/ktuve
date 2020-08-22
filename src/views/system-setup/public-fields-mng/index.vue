<template>
  <div class="app-content public-fields-mng-page">
    <div class="app-content-wrapper">
      <form-search @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchFormApi" :rule="searchFormRules" :option="searchFormOptions" />
      </form-search>
      <div class="btn-group">
        <el-button type="primary" size="mini" @click="handleAddClick">新增</el-button>
        <el-button type="primary" :disabled="!rowData" size="mini" @click="handleBindClick">绑定</el-button>
      </div>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
      >
        <template #operation="{ scope }">
          <el-button type="primary" size="mini" @click="handleTableClick('update', scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleTableClick('delete', scope.row)">删除</el-button>
        </template>
      </table-create>
      <dialog-field-add-or-update
        v-if="dialogStatus"
        :dialog-status.sync="dialogStatus"
        :field-id="fieldId"
        @confirm="handleDialogConfirm"
      />
      <dialog-field-bind
        v-if="dialogFieldBindStatus"
        :dialog-status.sync="dialogFieldBindStatus"
        :field-id="fieldId"
        @confirm="handleDialogConfirm"
      />
    </div>
  </div>
</template>
<script>
import TableCreate from "components/TableCreate";
import DialogFieldAddOrUpdate from "./components/DialogFieldAddOrUpdate.vue";
import DialogFieldBind from "./components/DialogFieldBind.vue";
import { fieldList, fieldDelete } from "api/system-setup.js";
import FormSearch from "components/FormSearch";
export default {
  components: {
    TableCreate,
    DialogFieldAddOrUpdate,
    DialogFieldBind,
    FormSearch
  },
  data() {
    return {
      searchFormApi: null,
      searchFormRules: [
        {
          type: "input",
          field: "name",
          title: "业务名词"
        },
        {
          type: "input",
          field: "field",
          title: "表字段"
        },
        {
          type: "input",
          field: "des",
          title: "描述"
        },
        {
          type: "input",
          field: "tableName",
          title: "绑定表"
        }
      ],
      searchFormOptions: {
        form: {
          inline: true,
          labelWidth: "85px"
        },
        submitBtn: {
          show: false
        }
      },
      tableOptions: {
        columns: [
          {
            attrs: {
              label: "业务名词",
              prop: "name",
              align: "left"
            }
          },
          {
            attrs: {
              label: "表字段",
              prop: "field"
            }
          },
          {
            attrs: {
              label: "类型",
              prop: "fieldType"
            }
          },
          {
            attrs: {
              label: "描述",
              prop: "des"
            }
          },
          {
            attrs: {
              label: "绑定表",
              prop: "tables",
              formatter: (row, column) => {
                return row.tables.map(item => item.tableName).join("，");
              }
            }
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
          url: fieldList,
          data: {}
        },
        showTools: false
      },
      dialogStatus: false,
      dialogFieldBindStatus: false,
      fieldId: -1,
      rowData: null
    };
  },
  methods: {
    handleDialogConfirm() {
      this.$refs.tableDom.refreshTable();
    },
    handleAddClick() {
      this.fieldId = -1;
      this.dialogStatus = true;
    },
    handleBindClick() {
      this.fieldId = this.rowData && this.rowData.id;
      this.dialogFieldBindStatus = true;
    },
    handleTableClick(action, data) {
      if (action === "update") {
        this.fieldId = data.id;
        this.dialogStatus = true;
      } else if (action === "delete") {
        this.$confirm("确定删除吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            fieldDelete({
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
    handleRowClick(row) {
      this.rowData = row;
    },
    handleCurrentChange() {
      this.rowData = null;
    },
    handleSearch() {
      this.$refs.tableDom.searchTableData(this.searchFormApi.formData());
    },
    handleSearchReset() {
      this.searchFormApi.resetFields();
      this.$refs.tableDom.resetTableData();
    }
  }
};
</script>

<style lang='scss'>
</style>
