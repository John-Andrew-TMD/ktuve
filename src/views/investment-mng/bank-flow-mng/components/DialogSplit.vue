<template>
  <div class="inline-dialog" v-transfer-dom id="DialogSplit">
    <el-dialog
      :modal="false"
      title="拆分流水"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
      width="1085px"
    >
      <h4 class="mb-10">原始流水信息</h4>
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      <bank-split-table
        v-if="rowData.id&&tableData"
        :row-data="rowData"
        :table-data="tableData"
        ref="splitTable"
        @get-flow-summaries="getFlowSummaries"
      ></bank-split-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryDictItems } from "utils";
import {
  setSplitFlow,
  prepareSplitFlow
} from "api/investment-mng/api-bank-flow-mng.js";
export default {
  inheritAttrs: false,
  components: {
    BankSplitTable: () => import("./components/BankSplitTable.vue")
  },
  inject: ["showConfirm"],
  props: {
    rowData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      bankFlowAmountSum: 0,
      formApi: {},
      tableData: [],
      formRules: [
        {
          type: "el-custom-text",
          field: "bankFlowNumber",
          title: "流水单号",
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          field: "bankFlowAmount",
          title: "流水金额（元）",
          props: {
            type: "number"
          },
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          field: "collectionDate",
          title: "交易日期",
          col: { span: 12 },
          props: {
            type: "date",
            format: "yyyy-MM-dd",
            valueFormat: "timestamp"
          }
        },
        {
          type: "el-custom-text",
          field: "collectionBank",
          title: "银行类别",
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          field: "collectionAccount",
          title: "本方账号",
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          field: "collectionName",
          title: "本方户名",
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          field: "paymentAccount",
          title: "对方账号",
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          field: "paymentName",
          title: "对方户名",
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          field: "flowSheetSummary",
          title: "摘要",
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          field: "remarks",
          title: "备注",
          col: { span: 12 }
        }
      ],
      formOptions: {
        form: {
          labelWidth: "120px",
          disabled: true
        },
        submitBtn: { show: false }
      },
      dialogVisible: false
    };
  },
  mounted() {
    this.initUI();
  },
  methods: {
    // 确定
    initUI() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.formApi.setValue(this.rowData);
        this.getTableData();
      });
    },
    getTableData() {
      prepareSplitFlow({
        bankFlowId: this.rowData.id
      }).then(res => {
        this.tableData = res.data.records;
      });
    },
    getFlowSummaries(bankFlowAmountSum) {
      this.bankFlowAmountSum = bankFlowAmountSum;
    },
    handleDialogConfirmAfter() {
      return new Promise((resolve, reject) => {
        this.$refs.splitTable.$refs.formDom.validate(async valid => {
          if (valid) {
            let params = {};
            params.bankFlowId = this.rowData.id;
            params.flowDTOArrayList = this.$refs.splitTable.formItems.bankFlowDTOList;
            if (+this.bankFlowAmountSum !== +this.rowData.bankFlowAmount) {
              return this.$showToast(
                "拆分后的流水金额之和与原流水金额不一致",
                "warning"
              );
            }
            if (+this.rowData.bankFlowState == 5) {
              this.showConfirm(
                "流水已重新拆分，系统将解除已关联的款项，确定继续？",
                () => {
                  resolve(params);
                }
              );
            } else {
               resolve(params);
            }
          }
        });
      });
    },
    handleDialogConfirm() {
      this.handleDialogConfirmAfter().then((params) => {
        setSplitFlow(params).then(res => {
          this.$showToast("操作成功！", "success");
          this.dialogVisible = false;
          this.$emit("dialog-confirm");
        });
      });
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
</style>
