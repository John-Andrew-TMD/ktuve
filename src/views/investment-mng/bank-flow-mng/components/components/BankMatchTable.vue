<template>
  <div id="BankMatchTable">
    <div class="btn-group">
      <div class="btn-flex">
        <h4>匹配结果</h4>
        <el-button class="flex-btn" type="primary" size="mini" @click="handleMatchClick">匹配</el-button>
      </div>
    </div>
    <table-create
      @current-change="handleCurrentChange"
      :data="resultData"
      :options="tableOptions"
      class="mt-0"
    />
  </div>
</template>

<script>
import TableCreate from "components/TableCreate/index";
import { queryDictItems, deepAssign } from "utils";
import { bankList } from "api/investment-mng/api-bank-flow-mng.js";
import { projectList } from "api/contract-module/api-contract-mng.js";
export default {
  inheritAttrs: false,
  components: {
    TableCreate
  },
  props: {
    collectRowData: {
      type: Object,
      default: {}
    },
    tableData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      rowData: null,
      matchData: [],
      tableOptions: {
        tableBottomOffset: 75,
        showPagination: false,
        requestImmediate: false,
        showLoading: false,
        columns: [
          {
            attrs: {
              label: "匹配方式",
              prop: "matchMethod",
              formatter: row => {
                return Vue.filter("filterDictValue")(row.matchMethod, "10069");
              }
            }
          },
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
      }
    };
  },
  computed: {
    resultData() {
      let resultData = this.tableData;
      if (this.matchData.id) {
        this.$set(resultData, 1, { ...this.matchData, matchMethod: "2" });
      }
      return resultData;
    }
  },
  mounted() {},
  methods: {
    handleMatchClick() {
      this.matchData = {
        ...deepAssign(this.collectRowData),
        payer: this.collectRowData.custName,
        payerId: this.collectRowData.custId,
        issue: this.collectRowData.rentIssue
      };
    },
    handleCurrentChange(row, index) {
      if (!row) return;
      this.rowData = row;
    }
  }
};
</script>

<style lang="scss" scoped>
#BankMatchTable {
  .btn-group {
    border: none;
  }
  h4 {
    line-height: 28px;
  }
  .flex-btn {
    margin-left: auto;
  }
  .btn-flex {
    display: flex;
    // flex-direction: row;
    justify-content: flex-start;
    align-content: center;
  }
  .operation {
    font-size: 16px !important;
  }
}
</style>
