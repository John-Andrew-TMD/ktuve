<template>
  <div class="app-content customer-mng-page" style="padding: 0px;">
    <div class="app-content-wrapper">
      <form-search collapse @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <el-button type="primary" size="mini" @click="handleBookingClick">记账</el-button>
      </div>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
      />
    </div>
  </div>
</template>

<script>
import TableCreate from "components/TableCreate/index";
import FormSearch from "components/FormSearch";
import { queryDictItems, isEmptyObj } from "utils";
import tableJson from "./js/table.json";
import {
  customerList,
  customerDelete
} from "api/customer-module/api-customer-mng.js";
export default {
  components: {
    TableCreate,
    FormSearch
  },
  props: {
    activeTab: {
      type: String,
      default: []
    }
  },
  data() {
    return {
      tableJson: tableJson,
      searchForm: null,
      searchOptions: {
        form: { labelWidth: "120px", inline: true },
        submitBtn: { show: false }
      },
      rowData: null,
      selectedRows: [],
      componentName: "",
      dialogStatus: false
    };
  },
  computed: {
    searchRules() {
      return tableJson[this.activeTab].searchRules;
    },
    tableOptions() {
      return tableJson[this.activeTab].tableOptions;
    }
  },
  mounted() {},
  methods: {
    handleRowClick(rowData, column) {},
    handleCurrentChange(row) {
      this.rowData = row;
    },
    handleSelectionChange(row) {
      this.selectedRows = row;
    },
    handleSearch() {
      const data = this.searchForm.formData();
      this.refreshTable(data);
    },
    handleSearchReset() {
      this.searchForm.resetFields();
      this.refreshTable();
    },
    handleBookingClick() {
      this.$confirm(
        `当前选择的款项信息为：
        xxxxx项目，第一期租金
        确定记账并生成凭证？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {})
        .catch(() => {});
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data);
    },
    // 新增成功后，返回新增后的信息，用于页面跳转
    handleDialogConfirm(customerInfo) {}
  },
  activated() {
    this.$refs.tableDom.refreshTable();
  }
};
</script>

<style lang="scss">
</style>
