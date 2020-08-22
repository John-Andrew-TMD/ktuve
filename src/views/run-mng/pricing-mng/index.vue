<template>
  <div class="app-content customer-mng-page">
    <div class="app-content-wrapper">
      <!-- <form-search collapse @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>-->
      <el-button type="primary" size="mini" @click="handleAddClick">新增</el-button>
      <el-button
        type="danger"
        size="mini"
        :disabled="iselectedDelete"
        @click="handleDeleteClick"
      >删除</el-button>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
      />
      <component
        :is="componentName" 
        v-if="dialogStatus"
        :selected-rows="selectedRows"
        :dialog-status.sync="dialogStatus"
      />
    </div>
  </div>
</template>

<script>
import TableCreate from "components/TableCreate/index";
import FormSearch from "components/FormSearch";
import {
  ISomPricingModelTableList,
  ISomPricingModelTableRemoveByIds
} from "api/project-module/api-project-pricing";
export default {
  components: {
    TableCreate,
    FormSearch,
    DialogAdd: () => import("./components/DialogPricingAdd.vue")
  },
  computed:{
    iselectedDelete(){
        return !this.selectedRows.length||this.selectedRows.filter(item=>item.enableStatus=="1").length
    }
  },
  data() {
    return {
      tableOptions: {
        requestParams: {
          url: ISomPricingModelTableList,
          data: {}
        },
        showCheckbox: true,
        showSerialNumber: true,
        showTools: false,
        tableBottomOffset: 75,
        columns: [
          {
            attrs: {
              label: "模型名称",
              prop: "modelName",
              align: "center",
              "class-name": "link-type",
              "min-width": "150",
              "show-overflow-tooltip": true
            }
          },
          {
            attrs: {
              label: "启用状态",
              prop: "enableStatus",
              "min-width": "130",
              formatter: row => {
                return Vue.filter("filterDictValue")(row.enableStatus, "10004");
              }
            }
          },
          {
            attrs: {
              label: "模板使用次数",
              prop: "frequency",
              "show-overflow-tooltip": true
            }
          },
          {
            attrs: {
              label: "创建人",
              prop: "sysCreatorId",
              formatter: row => {
                return Vue.filter("filterUserInfo")(row.sysCreatorId);
              }
            }
          },
          {
            attrs: {
              label: "创建时间",
              prop: "sysCtime",
              formatter: row => {
                return Vue.filter("filterDateSeparate")(row.sysCtime);
              }
            }
          },
          {
            attrs: {
              label: "更新时间",
              prop: "sysEtime",
              formatter: row => {
                return Vue.filter("filterDateSeparate")(row.sysEtime);
              }
            }
          }
        ]
      },
      rowData: {
        projectStatus: 0
      },
      selectedRows: [],
      componentName: "",
      dialogStatus: false
    };
  },
  methods: {
    handleRowClick(rowData, column) {
      if (column.property === "modelName") {
        this.$router.push({
          name:"PricingDetail",
          query: {
            id: rowData.id
          }
        });
      }
    },
    handleCurrentChange(row) {
      this.rowData = row;
    },
    handleSelectionChange(row) {
      this.selectedRows = row;
    },
    handleSearch() {
      const data = this.searchForm.formData();
      data.registerAddress = data.registerAddress
        ? data.registerAddress.join(",")
        : null;
      this.refreshTable(data);
    },
    handleSearchReset() {
      this.searchForm.resetFields();
      this.refreshTable();
    },

    handleAddClick() {
      this.componentName = "DialogAdd";
      this.dialogStatus = true;
    },
    handleDeleteClick() {
      if (!this.selectedRows.length) {
        return this.$showToast("未选中任何行！");
      }
      let ids = this.selectedRows.map(item => item.id);
      this.$confirm(`是否从定价模型列表中删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          ISomPricingModelTableRemoveByIds(
            {
              ids
            },
            { showLoading: true }
          )
            .then(res => {
              this.$showToast("删除成功！", "success");
              if (this.$refs.tableDom.tableData.length == ids.length) {
                this.$refs.tableDom.resetTableData();
              } else {
                this.$refs.tableDom.refreshTable(true);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data);
    }
  }
};
</script>

<style lang="scss">
</style>
