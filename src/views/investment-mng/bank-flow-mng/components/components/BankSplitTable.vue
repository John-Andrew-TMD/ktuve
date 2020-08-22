<template>
  <div id="SpilitTable">
    <div class="btn-flex">
      <h4>流水拆分</h4>
      <el-button class="flex-btn" type="primary" size="mini" @click="handleAddClick">添加</el-button>
    </div>
    <el-form
      ref="formDom"
      class="stockholder-info-table-comp"
      :show-message="false"
      :model="formItems"
      style="margin-top: 10px"
      @submit.native.prevent
    >
      <el-table
        highlight-current-row
        :row-class-name="tableRowClassName"
        @current-change="handleCurrentChange"
        :data="formItems.bankFlowDTOList"
        :summary-method="getSummaries"
        show-summary
        border
        style="width: 100%"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="流水单号" prop="bankFlowNumber">
          <template slot-scope="scope">
            <el-form-item
            style="margin-bottom:0px"
              :prop="`bankFlowDTOList.${scope.$index}.bankFlowNumber`"
            >
            {{scope.row.bankFlowNumber}}
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="流水单金额（元）" prop="bankFlowAmount">
          <template slot-scope="scope">
            <!-- formItems.0.bankFlowDTOList.{{scope.$index}}.bankFlowAmount -->
            <el-form-item
              style="margin-bottom:0px"
              required
              :prop="`bankFlowDTOList.${scope.$index}.bankFlowAmount`"
            >
              <number-input
                size="mini"
                v-model.trim="scope.row.bankFlowAmount"
                :min-decimal="0"
                :max-decimal="4"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.$index>1"
              type="text"
              class="operation"
              :disabled="delBtnDisabled"
              icon="el-icon-remove-outline"
              @click="handleDeleteClick(scope.row,scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import { thousandSeparator } from "utils";

export default {
  inheritAttrs: false,
  props: {
    rowData: {
      type: Object,
      default: {}
    },
    tableData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      splitTableRowData: {}
    };
  },
  computed: {
    formItems() {
      if (this.tableData.length) {
        let tableData = this.tableData.map((item, index) => {
          item.index = index;
          return item;
        });
        return { bankFlowDTOList: tableData };
      } else {
        return {
          bankFlowDTOList: [
            { bankFlowAmount: "", bankFlowNumber: "", index: 0 },
            { bankFlowAmount: "", bankFlowNumber: "", index: 1 }
          ]
        };
      }
    }
  },
  mounted() {
    // this.formItems.bankFlowDTOList = this.tableData
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
      });
      sums[1] = "";
      this.$emit("get-flow-summaries", sums[2]);
      return sums;
    },
    handleCurrentChange(row, index) {
      if (!row) return;
      this.splitTableRowData = row;
    },
    handleAddClick(rowData) {
      let index = +(this.formItems.bankFlowDTOList[this.formItems.bankFlowDTOList.length - 1].bankFlowNumber+"").split("-")[1] ;
      this.formItems.bankFlowDTOList.splice(
        this.formItems.bankFlowDTOList.length - 1 + 1,
        0,
        {
          bankFlowAmount: "",
          bankFlowNumber:  `${this.rowData.bankFlowNumber}-${
          index + 1 >= 10 ? index + 1 : "0" + (index + 1)
        }`
        }
      );
    },
    handleDeleteClick(rowData, index) {
      if (this.formItems.bankFlowDTOList.length == 1) return;
      this.formItems.bankFlowDTOList.splice(index, 1);
    },
    handleAutoClick() {}
  }
};
</script>

<style lang="scss" scoped>
#SpilitTable {
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
