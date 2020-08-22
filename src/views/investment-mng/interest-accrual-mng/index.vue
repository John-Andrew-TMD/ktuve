<template>
  <div class="app-content customer-mng-page">
    <div class="app-content-wrapper">
      <el-tabs v-model="activeTab" class="tabs-top">
        <el-tab-pane label="按月计提利息（汇总）" key="1" name="collect">按月计提利息（汇总）</el-tab-pane>
        <el-tab-pane label="按月计提利息（明细）" key="2" name="detail">按月计提利息（明细）</el-tab-pane>
      </el-tabs>
      <table-detail v-if="activeTab" :key = "activeTab" :activeTab="activeTab"></table-detail>
    </div>
  </div>
</template>

<script>
import { queryDictItems } from "utils";

export default {
  components: {
    tableDetail: () => import("./table")
  },
  data() {
    return {
      activeTab: "collect",
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
  mounted() {
    this.getCustAttributeOptions();
  },
  methods: {
    getCustAttributeOptions() {},
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

    handleAddClick() {
      this.componentName = "DialogAdd";
      this.dialogStatus = true;
    },
    // 删除
    handleDeleteClick() {},
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data);
    },
    // 新增成功后，返回新增后的信息，用于页面跳转
    handleDialogConfirm(customerInfo) {}
  },
  activated() {
    this.getCustAttributeOptions();
    this.$refs.tableDom.refreshTable();
  }
};
</script>

<style lang="scss">
</style>
