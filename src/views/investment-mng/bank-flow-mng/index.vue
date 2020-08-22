<template>
  <div class="app-content customer-mng-page">
    <div class="app-content-wrapper">
      <form-search collapse @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <el-button type="primary" size="mini" @click="handleDiaLogClick('DialogImport')">导入流水</el-button>
        <el-button
          type="primary"
          :disabled="isDisabled('DialogSplit')"
          size="mini"
          @click="handleDiaLogClick('DialogSplit')"
        >拆分流水</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="handleShowConfirmClick('自动匹配','autoMatch',undefined)"
        >自动匹配</el-button>
        <el-button
          type="primary"
          :disabled="isDisabled('DialogMatch')"
          size="mini"
          @click="handleDiaLogClick('DialogMatch')"
        >手动匹配</el-button>
        <el-button
          type="primary"
          size="mini"
          :disabled="isDisabled('reviewBankFlow')"
          @click="handleShowConfirmClick('审核','reviewBankFlow',true)"
        >审核</el-button>
        <el-button
          type="primary"
          size="mini"
          :disabled="isDisabled('cancelReviewBankFlow')"
          @click="handleShowConfirmClick({props:'取消审核后，将解除银行流水与款项的关联匹配，是否继续？'},'cancelReviewBankFlow',false)"
        >取消审核</el-button>
        <el-button
          type="danger"
          size="mini"
          :disabled="isDisabled('deleteBankFlow')"
          @click="handleShowConfirmClick('删除','deleteBankFlow',true)"
        >删除</el-button>
      </div>
      <table-create
        ref="tableDom"
        :bank-info="rowData"
        default-expand-all
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :options="tableOptions"
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
      />
      <component
        :is="componentName"
        v-if="dialogStatus"
        :selected-rows="selectedRows"
        :row-data="rowData"
        :dialog-status.sync="dialogStatus"
        @dialog-confirm="handleDialogConfirm"
      />
    </div>
  </div>
</template>

<script>
import TableCreate from "components/TableCreate/index";
import FormSearch from "components/FormSearch";
import { queryDictItems, isEmptyObj } from "utils";
import {
  bankList,
  deleteBankFlow,
  autoMatch,
  reviewBankFlow,
  cancelReviewBankFlow
} from "api/investment-mng/api-bank-flow-mng.js";
import { customerList } from "api/customer-module/api-customer-mng.js";
import { projectList } from "api/contract-module/api-contract-mng.js";
import currentAmount from "./components/CompCurrentAmount";
const bankApi = {
  autoMatch,
  reviewBankFlow,
  cancelReviewBankFlow,
  deleteBankFlow
};
formCreate.component("currentAmount-input", currentAmount);
export default {
  provide() {
    return {
      showConfirm: this.showConfirm
    }
  },
  components: {
    TableCreate,
    FormSearch,
    DialogMatch: () => import("./components/DialogMatch.vue"),
    DialogImport: () => import("./components/DialogImport.vue"),
    DialogSplit: () => import("./components/DialogSplit.vue"),
    formCreate: formCreate.$form()
  },
  data() {
    return {
      searchForm: null,
      searchRules: [
        {
          type: "el-custom-select",
          title: "流水单号",
          field: "bankFlowNumber",
          props: {
            params: {
              url: bankList,
              data: {},
              labelKey: "bankFlowNumber",
              valueKey: "bankFlowNumber"
            },
            clearable: true,
            filterable: "true"
          }
        },
        {
          type: "el-custom-autocomplete",
          title: "付款人名称",
          field: "paymentName",
          props: {
            params: {
              url: bankList,
              data: {},
              searchKey: "paymentName",
              labelKey: "paymentName",
              valueKey: "paymentName",
              repeat: false
            }
          }
        },
        {
          type: "select",
          title: "审批状态",
          field: "reviewState",
          options: queryDictItems("10070")
        },
        {
          type: "select",
          title: "流水状态",
          field: "bankFlowState",
          options: queryDictItems("10071")
        },
        {
          type: "el-custom-select",
          title: "付款方",
          field: "payer",
          props: {
            params: {
              url: bankList,
              data: {},
              labelKey: "payer",
              valueKey: "payer",
              repeat: false
            },
            clearable: true,
            filterable: "true"
          }
        },
        {
          type: "select",
          title: "挂帐状态",
          field: "accountState",
          options: queryDictItems("10072")
        },
        {
          type: "select",
          title: "核销状态",
          field: "verifyState",
          options: queryDictItems("10073")
        },
        {
          type: "select",
          title: "款项类型",
          field: "collectionType",
          options: queryDictItems("10063")
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
          type: "el-date-picker",
          field: "collectionDate",
          title: "交易日期",
          style: { width: "220px" },
          props: {
            type: "daterange",
            format: "yyyy-MM-dd",
            valueFormat: "timestamp",
            rangeSeparator: "-",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期"
          }
        },
        {
          type: "currentAmount-input",
          title: "流水金额",
          col: { span: 12 },
          field: "bankFlowAmount",
          value: "",
          props: {}
        }
      ],
      searchOptions: {
        form: { labelWidth: "120px", inline: true },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: bankList,
          data: {}
        },
        selectedRow: 0,
        showCheckbox: true,
        showSerialNumber: true,
        showTools: false,
        tableBottomOffset: 50,
        columns: [
          {
            attrs: {
              label: "流水单号",
              prop: "bankFlowNumber",
              align: "left",
              minWidth: "150",
              "show-overflow-tooltip": true
            }
          },
          {
            attrs: {
              label: "交易日期",
              prop: "collectionDate",
              width: "100px",
              formatter: (row, column) => {
                return Vue.filter("filterTimestamp")(
                  row.collectionDate,
                  "YYYY-MM-DD"
                );
              }
            }
          },
          {
            attrs: {
              label: "流水金额（元）",
              prop: "bankFlowAmount",
              width: "120px",
              formatter: row => {
                return Vue.filter("filterToThousand")(row.bankFlowAmount);
              }
            }
          },
          {
            attrs: {
              label: "对方户名",
              prop: "paymentName",
              minWidth: "150",
              "show-overflow-tooltip": true
            }
          },
          {
            attrs: {
              label: "挂帐状态",
              prop: "accountState",
              formatter: row => {
                return Vue.filter("filterDictValue")(row.accountState, "10072");
              }
            }
          },
          {
            attrs: {
              label: "流水状态",
              prop: "bankFlowState",
              formatter: row => {
                return Vue.filter("filterDictValue")(
                  row.bankFlowState,
                  "10071"
                );
              }
            }
          },
          {
            attrs: {
              label: "匹配结果"
            },
            children: [
              {
                attrs: {
                  label: "付款方",
                  prop: "payer",
                  "min-width": "150",
                  "show-overflow-tooltip": true,
                  formatter: (row, column) => {
                    if (+row.bankFlowState == 0 || +row.bankFlowState == 5) {
                      return "--";
                    }
                    return row.payer;
                  }
                }
              },
              {
                attrs: {
                  label: "项目名称",
                  prop: "projectName",
                  "min-width": "150",
                  "show-overflow-tooltip": true,
                  formatter: (row, column) => {
                    if (+row.bankFlowState == 0 || +row.bankFlowState == 5) {
                      return "--";
                    }
                    return row.projectName;
                  }
                }
              },
              {
                attrs: {
                  label: "款项类型",
                  prop: "collectionType",
                  formatter: row => {
                    if (+row.bankFlowState == 0 || +row.bankFlowState == 5) {
                      return "--";
                    }
                    return Vue.filter("filterDictValue")(
                      row.collectionType,
                      "10063"
                    );
                  }
                }
              }
            ]
          },
          {
            attrs: {
              label: "审核状态",
              prop: "reviewState",
              formatter: row => {
                if (+row.bankFlowState == 5) {
                  return "--";
                }
                return Vue.filter("filterDictValue")(row.reviewState, "10070");
              }
            }
          },
          {
            attrs: {
              label: "核销状态",
              prop: "verifyState",
              formatter: row => {
                if (+row.bankFlowState == 5) {
                  return "--";
                }
                return Vue.filter("filterDictValue")(row.verifyState, "10073");
              }
            }
          },
          {
            attrs: {
              label: "对方账户",
              prop: "paymentAccount"
            }
          },
          {
            attrs: {
              label: "银行类别",
              prop: "collectionBank"
            }
          },
          {
            attrs: {
              label: "本方账号",
              prop: "collectionAccount"
            }
          },
          {
            attrs: {
              label: "本方户名",
              prop: "collectionName",
              "min-width": "150",
              "show-overflow-tooltip": true
            }
          },
          {
            attrs: {
              label: "摘要",
              prop: "flowSheetSummary"
            }
          },
          {
            attrs: {
              label: "备注",
              prop: "remarks"
            }
          },
          {
            attrs: {
              label: "交易时间",
              prop: "collectionDate",
              minWidth: 88,
              formatter: (row, column) => {
                return Vue.filter("filterTimestamp")(row.collectionDate);
              }
            }
          },
          {
            attrs: {
              label: "导入时间",
              prop: "importTime",
              minWidth: 88,
              formatter: (row, column) => {
                return Vue.filter("filterTimestamp")(row.importTime);
              }
            }
          }
        ]
      },
      rowData: null,
      selectedRows: [],
      componentName: "",
      dialogStatus: false
    };
  },
  computed: {
    isDisabled() {
      return function(key) {
        let autoMatch = [];
        if (this.rowData) {
          switch (key) {
            case "DialogSplit":
              return !((+this.rowData.reviewState == 0)&&( +this.rowData.bankFlowState<6));
              break;
            case "autoMatch":
              return !(
                +this.rowData.reviewState == 0 &&
                +this.rowData.bankFlowState < 4
              );
            case "DialogMatch":
              return !(
                +this.rowData.reviewState == 0&&( +this.rowData.bankFlowState<6)
              );
            case "reviewBankFlow":
              if (!this.selectedRows.length) {
                return true;
              }
              return !this.selectedRows.every(
                item => (+item.bankFlowState == 4 || +item.bankFlowState == 3)&&(+item.reviewState==0)
              );
            case "cancelReviewBankFlow":
              return !(
                +this.rowData.reviewState == 1 &&
                +this.rowData.verifyState == 0
              );
            case "deleteBankFlow":
              if (!this.selectedRows.length) {
                return true;
              }
              return !this.selectedRows.every(item => item.canDel);
            default:
              break;
          }
        }
      };
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
      const data = {
        ...this.searchForm.formData(),
        ...this.searchForm.formData().bankFlowAmount
      };
      delete data.bankFlowAmount;
      if (data.collectionDate) {
        data.collectionDateS = data.collectionDate[0];
        data.collectionDateE = data.collectionDate[1];
        delete data.collectionDate;
      }
      this.refreshTable(data);
    },
    handleSearchReset() {
      this.searchForm.resetFields();
      this.refreshTable();
    },
    handleShowConfirmClick(title, api, multiple) {
      let params = {};
      if (multiple) {
        params = {
          bankFlowIds:this.selectedRows.map(item => item.id).join(",")
        }
      } else {
        if (multiple !== undefined) {
          params = {
            bankFlowId:this.rowData.id
          }
        }
      }
      this.showConfirm(title, () => {
        bankApi[api](params).then(res => {
          this.$showToast("操作成功！", "success");
          if (this.$refs.tableDom.tableData.length == ids.length) {
            this.$refs.tableDom.resetTableData();
          } else {
            this.$refs.tableDom.refreshTable(true);
          }
        });
      });
    },
    showConfirm(title, confirmCb) {
      this.$confirm(`确定${title.props?title.props:title}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        // customClass: "inline-dialog",
        type: "warning"
      })
        .then(({ value }) => {
          confirmCb && confirmCb(value);
        })
        .catch(() => {});
    },
    handleCancelClick() {},
    handleDiaLogClick(componentName) {
      if (componentName == "DialogSplit" && !this.rowData)
        return this.$showToast("未选任何行！", "warning");
      this.componentName = componentName;
      this.dialogStatus = true;
    },
    handleDialogConfirm() {
      this.$refs.tableDom.refreshTable(true);
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data);
    }
  },
  activated() {
    this.getCustAttributeOptions();
    this.$refs.tableDom.refreshTable();
  }
};
</script>

<style lang="scss">
</style>
