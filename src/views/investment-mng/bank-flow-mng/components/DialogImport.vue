<template>
  <div>
    <el-dialog
      :modal-append-to-body="false"
      title="数据导入"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
      width="1085px"
    >
      <div class="rent-plan-header">
        <!-- <el-form :model="formModel" :inline="true">
          <el-form-item label="导入类型" prop="importtype">
            <el-select v-model="formModel.importtype"></el-select>
          </el-form-item>
        </el-form> -->
        <div style="margin-left: auto;">
          <file-import text="导入" @change="handleImportChange" :field-map="fieldMap" />
          <el-button type="primary" size="mini" @click="handleDownloadTemplete">下载EXCEL模板</el-button>
        </div>
      </div>
      <!-- <form-create   v-model="formApi" :rule="formRules" :option="formOptions" /> -->
      <table-create
        v-if="dialogVisible"
        ref="tableDom"
         :row-class-name="tableRowClassName"
        :options="tableOptions"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
      ></table-create>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formSubmit, deepAssign } from "utils";
import {
  importMatch,
  templateFilePath
} from "api/investment-mng/api-bank-flow-mng.js";
import TableCreate from "components/TableCreate/index";
import FileImport from "components/ElFileImport";
export default {
  inheritAttrs: false,
  components: {
    TableCreate,
    FileImport
  },
  data() {
    return {
      rowData: {},
      formModel: {},
      sourceData: [],
      fieldMap: [
        { title: "交易日期", field: "collectionDate", type: "date" },
        { title: "借方金额（元）", field: "debitAmount", type: "money" },
        { title: "贷方金额（元）", field: "creditAmount", type: "money" },
        { title: "本方账号", field: "collectionAccount" },
        { title: "本方户名", field: "collectionName" },
        { title: "对方账号", field: "paymentAccount" },
        { title: "对方户名", field: "paymentName" },
        { title: "银行类别", field: "collectionBank" },
        { title: "摘要", field: "flowSheetSummary" },
        { title: "备注", field: "remarks" }
      ],
      selectedRows: [],
      dialogVisible: false,
      tableOptions: {
        showCheckbox: true,
        showSerialNumber: true,
        showLoading: false,
        showPagination: false,
        requestImmediate: false,
        selectedRow: 0,
        columns: [
          {
            attrs: {
              label: "流水金额（元）",
              prop: "bankFlowAmount",
              width: "120px",
              formatter: row => {
                return Vue.filter("filterToThousand")(
                  row.debitAmount || row.creditAmount
                );
              }
            }
          },
          {
            attrs: {
              label: "对方账号",
              prop: "paymentAccount"
            }
          },
          {
            attrs: {
              label: "对方户名",
              prop: "paymentName",
              minWidth: "100",
              "show-overflow-tooltip": true
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
              label: "备注",
              prop: "remarks"
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.dialogVisible = true;
  },
  methods: {
    // 确定
    tableRowClassName ({row, rowIndex}) {
        row.index = rowIndex;
      },
    handleRowClick(row) {
      this.rowData = row;
    },
    handleCurrentChange(row) {
      this.rowData = row;
    },
    handleSelectionChange(row) {
      this.selectedRows = row;
    },
    handleDownloadTemplete() {
      formSubmit(templateFilePath, { type: 1 }, "post");
    },
    handleDialogConfirm() {
      if (!this.selectedRows.length){
        return this.$showToast("请勾选要导入的数据", "warning");
      }
      let sourceData = this.selectedRows.map((item, index) => {
        return this.sourceData.filter(
          (item2, index2) => index2 == item.index
        )[0];
      });
      importMatch(sourceData).then(res => {
        this.$showToast("操作成功！", "success");
        this.dialogVisible = false;
        this.$emit("dialog-confirm");
      });
    },
    handleImportChange(data) {
      this.$refs.tableDom.setData(data);
      this.sourceData = Array.from({...deepAssign(data),'length': Object.keys(data).length})
      this.$showToast("导入成功", "success");
    },
    handleDialogClosed() {
      this.$emit("update:dialogStatus", false);
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  .el-autocomplete,
  .el-select {
    width: 100%;
  }
}
.rent-plan-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btn-import {
  position: relative;
  .file-input {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    opacity: 0;
  }
}
</style>
