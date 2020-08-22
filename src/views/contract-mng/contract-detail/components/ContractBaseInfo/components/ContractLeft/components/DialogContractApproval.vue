<template>
  <div>
    <el-dialog
      width="500px"
      :modal-append-to-body="false"
      title="发起审批"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">发起审批</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  contractFlowApproval,
  startContractChange,
  getProjectReplyNo
} from "api/contract-module/api-contract-flow.js";
import { queryDictValue } from "utils";
export default {
  inheritAttrs: false,
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    },
    routeParams: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      formApi: null,
      formRules: [
        {
          type: "input",
          title: "已选择0份合同",
          field: "contractDesc",
          props: {
            type: "textarea",
            disabled: true,
            rows: 3
          }
        },
        {
          type: "el-custom-select",
          title: "请选择项目审批编号",
          field: "businessCooperationId",
          props: {
            params: {
              url: getProjectReplyNo,
              data: {
                id: this.routeParams.id
              },
              labelKey: "replyNo",
              valueKey: "id",
              autoSelect: true
            }
          }
        }
      ],
      formOptions: {
        form: { labelWidth: "150px" },
        submitBtn: { show: false }
      },
      dialogVisible: false
    };
  },
  computed: {
    contractNum() {
      return this.selectedRows.length;
    }
  },
  inject: ["refreshContractLeft"],
  mounted() {
    this.dialogVisible = true;
    this.initUI();
    // console.log(this.routeParams);
  },
  methods: {
    initUI() {
      if (!this.selectedRows.length) return;
      this.$nextTick(() => {
        const desc = this.selectedRows.map(item => {
          return `${queryDictValue("10053", item.contractType)}(${
            item.contractNo
          })`;
        });
        this.formApi.setValue("contractDesc", desc.join("，"));
        this.formApi.updateRule("contractDesc", {
          title: `已选择${this.contractNum}份合同`
        });
      });
    },
    handleDialogConfirm() {
      const params = {
        conManagerId: this.routeParams.id,
        recordIds: this.selectedRows.map(item => item.id)
      };
      const isChange = this.selectedRows.every(item => item.contractState == 4);
      if (isChange) {
        this.approvalContractChange(params);
      } else {
        this.approvalContract(params);
      }
    },
    // 发起审批
    approvalContract(params) {
      contractFlowApproval(params, { showLoading: true })
        .then(res => {
          this.$showToast("发起成功", "success");
          this.dialogVisible = false;
          this.refreshContractLeft()
          // this.$emit("dialog-confirm");
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 发起合同变更
    approvalContractChange(params) {
      startContractChange(params, { showLoading: true })
        .then(res => {
          this.$showToast("发起审批成功", "success");
          this.dialogVisible = false;
          this.refreshContractLeft()
          // this.$emit("dialog-confirm");
        })
        .catch(err => {
          console.log(err);
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
  .el-select {
    width: 100%;
  }
}
</style>
