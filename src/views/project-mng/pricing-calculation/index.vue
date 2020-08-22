<template>
  <div class="app-content customer-mng-page">
    <div class="app-content-wrapper">
      <form-search collapse @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <el-button type="primary" size="mini" @click="handleAddClick">新增定价测算</el-button>
      <el-button
        type="primary"
        size="mini"
        :disabled="disabledApprovalBtn"
        @click="handleRateClick"
      >发起利率优惠</el-button>
      <el-button
        type="danger"
        size="mini"
        :disabled="!selectedRows.length"
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
import { queryDictItems } from "utils";
import { projectList } from "api/project-module/api-project-mng.js";
import {
  IPmmPriceTableRemoveByIds,
  PriceBusinessPage
} from "api/project-module/api-project-pricing";
import { getModelList } from "api/customer-module/api-customer-rating-mng.js";
import { customerList } from "api/customer-module/api-customer-mng.js";
export default {
  components: {
    TableCreate: () => import("components/TableCreate/index"),
    FormSearch: () => import("components/FormSearch"),
    DialogAdd: () => import("./components/DialogPricingAdd.vue")
  },
  data() {
    return {
      searchForm: null,
      searchOptions: {
        form: { labelWidth: "100px", inline: true },
        submitBtn: { show: false }
      },
      searchRules: [
        {
          type: "hidden",
          field: "modelName"
        },
        {
          type: "el-custom-select",
          title: "模型名称",
          field: "modelId",
          value: "",
          props: {
            params: {
              url: PriceBusinessPage,
              data: {},
              searchKey: "modelName",
              labelKey: "modelName",
              valueKey: "id",
              repeat: false
            },
            clearable: true,
            filterable: "true"
          },
          on: {
            change: valueArray => {
              this.searchForm.setValue("modelName", valueArray.data.modelName);
            }
          }
        },
        {
          type: "el-custom-autocomplete",
          title: "项目名称",
          field: "projectName",
          props: {
            params: {
              url: projectList,
              data: {},
              searchKey: "projectName",
              labelKey: "projectName",
              valueKey: "projectName",
              repeat: false
            },
            clearable: true
          }
        },
        {
          type: "el-custom-autocomplete",
          title: "客户名称",
          field: "custName",
          props: {
            params: {
              url: PriceBusinessPage,
              data: {},
              searchKey: "custName",
              labelKey: "custName",
              valueKey: "custName",
              repeat: false
            },
            clearable: true
          }
        },
        {
          type: "select",
          title: "审批状态",
          field: "state",
          options: queryDictItems("10058")
        },
        {
          type: "el-date-picker",
          field: "createTime",
          title: "创建时间",
          style: { width: "220px" },
          props: {
            type: "daterange",
            format: "yyyy-MM-dd",
            valueFormat: "timestamp",
            rangeSeparator: "-",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期"
          }
        }
      ],
      tableOptions: {
        requestParams: {
          url: PriceBusinessPage,
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
              label: "项目名称",
              prop: "projectName",
              "min-width": "150",
              "show-overflow-tooltip": true
            }
          },
          {
            attrs: {
              label: "客户名称",
              prop: "custName",
              "min-width": "150",
              "show-overflow-tooltip": true
            }
          },
          {
            attrs: {
              label: "项目状态",
              prop: "projectStatus",
              formatter: row => {
                return Vue.filter("filterDictValue")(
                  row.projectStatus,
                  "10024"
                );
              }
            }
          },
          {
            attrs: {
              label: "项目IRR(%)",
              prop: "irr",
              formatter: row => {
                if (!row.irr && typeof row.irr === "object") return;
                return (parseFloat(row.irr)).toFixed(4);
              }
            }
          },
          {
            attrs: {
              label: "租赁项目基础利率",
              prop: "basicRate"
            }
          },
          {
            attrs: {
              label: "业务发展调节系数",
              prop: "businessRate"
            }
          },
          {
            attrs: {
              label: "风险调节系数",
              prop: "riskRate"
            }
          },
          {
            attrs: {
              label: "其他调节系数",
              prop: "otherRate"
            }
          },
          {
            attrs: {
              label: "定价测算（irr）(%)",
              prop: "measureIrr",
              formatter: row => {
                if (!row.measureIrr && typeof row.measureIrr === "object")
                  return;
                return (parseFloat(row.measureIrr)).toFixed(4);
              }
            }
          },
          {
            attrs: {
              label: "优惠利率（irr）",
              prop: "discountIrr",
              formatter: row => {
                if (!row.discountIrr && typeof row.discountIrr === "object")
                  return "--";
                if (row.state == "0") return "--";
                return (parseFloat(row.discountIrr)).toFixed(4);
              }
            }
          },
          {
            attrs: {
              label: "审批要件",
              prop: "state"
            }
          },
          {
            attrs: {
              label: "审批状态",
              prop: "state",
              minWidth: 90
            },
            filter: {
              name: "dict",
              params: "10016"
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
  computed: {
    disabledApprovalBtn() {
      return (
        !this.rowData ||
        !this.rowData.id ||
        this.rowData.state === null ||
        +this.rowData.state === 1
      );
    }
  },
  methods: {
    handleRateClick() {
      this.$router.push({
        name: "pricingCalculationDetail",
        query: {
          id: this.rowData.id,
          modelId: this.rowData.modelId,
          projectId: this.rowData.projectId || "1",
          action: "rate"
        }
      });
    },
    handleRowClick(rowData, column) {
      if (column && column.property === "modelName") {
        const { modelId, id, projectId } = rowData;
        this.$router.push({
          name: "pricingCalculationDetail",
          query: {
            modelId,
            id,
            projectId: projectId || "1",
            action: "detail"
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
      // data.registerAddress = data.registerAddress
      //   ? data.registerAddress.join(",")
      //   : null;
      if (data.createTime&&!data.createTime[0]) {
        data.createTime = data.createTime[0];
      }
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
      this.$confirm(`是否从定价测算列表中删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          IPmmPriceTableRemoveByIds(
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
