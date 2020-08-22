<template>
  <div>
    <el-dialog
      :modal-append-to-body="false"
      title="手动匹配"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
      width="1085px"
    >
      <bank-flow-table ref = "flowTable" :table-data="bankFlowDTOList"></bank-flow-table>
      <bank-match-table
        ref="collectMatch"
        v-if="matchResultDTOList.length"
        :collect-row-data="collectRowData"
        :table-data="matchResultDTOList"
      ></bank-match-table>
      <div class="btn-group">
        <div class="btn-flex">
          <h4>应收款项（列表中为所有未核销、部分核销应收款项，请选择目标行，点击匹配）</h4>
        </div>
      </div>
      <bank-receivables-table ref="collectionMng" :isHandleMatch="true"></bank-receivables-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('manualMatch')">保 存</el-button>
        <el-button type="primary" @click="handleDialogConfirm('manualMatchAndReview')">保存并复核</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryDictItems } from "utils";
import {
  customerList,
  customerDelete
} from "api/customer-module/api-customer-mng.js";
import {
  prepareManualMatch,
  manualMatch,
  manualMatchAndReview
} from "api/investment-mng/api-bank-flow-mng.js";
import TableCreate from "components/TableCreate/index";
const bankApi = {
  manualMatchAndReview,
  manualMatch
};
export default {
  inheritAttrs: false,
  components: {
    TableCreate,
    BankFlowTable: () => import("./components/BankFlowTable.vue"),
    BankMatchTable: () => import("./components/BankMatchTable.vue"),
    BankReceivablesTable: () => import("../../collection-mng/index")
  },
  props: {
    rowData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      bankFlowDTOList: [],
      // flowDTOArrayList:[],
      matchResultDTOList: []
    };
  },
  computed: {
    bankApiData() {
      return this.$refs.collectMatch.matchData;
    },
    collectRowData() {
      return this.$refs.collectionMng.rowData;
    }
  },
  mounted() {
    this.dialogVisible = true;
    this.initUI();
  },
  methods: {
    initUI() {
      prepareManualMatch({
        bankFlowId: this.rowData.id
      }).then(res => {
        if (res.data) {
          let { bankFlowDTOList, matchResultDTOList } = res.data || {};
          this.bankFlowDTOList = bankFlowDTOList;
          this.matchResultDTOList = matchResultDTOList;
        }
      });
    },
    // 确定
    handleDialogConfirm(api) {
      // this.formApi.validate(async valid => {
      //   if (valid) {
      if(!this.bankApiData.id){
        this.$showToast('请先进行匹配','warning')
      }
      let params = {
        bankFlowId: this.rowData.id,
        collectionId:this.bankApiData.id,
        ...this.bankApiData
      };
      bankApi[api](params).then(res => {
        this.$showToast("操作成功！", "success");
        this.dialogVisible = false;
        this.$emit("dialog-confirm");
        //   });
        // }
      });
    },
    handleDialogClosed() {
      this.$emit("update:dialogStatus", false);
    }
  }
};
</script>

<style lang="scss" scoped>
// /deep/ .el-dialog {
//   .el-autocomplete,
//   .el-select {
//     width: 100%;
//   }
// }
</style>
