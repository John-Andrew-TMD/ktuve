<template>
  <el-dialog
    ref="attachmentChangeDom"
    title="填写签署日期"
    :visible.sync="dialogStatus"
    :modal-append-to-body="false"
    @closed="handleDialogClosed"
    width="500px"
  >
    <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClosed">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { ICommonContractBusinessUpdateSigningDateAddr } from "api/contract-module/api-contract-mng.js";
// 文件类型
export default {
  data() {
    return {
      formApi: null,
      formRules: [
        {
          type: "el-date-picker",
          field: "signingTime",
          title: "签署日期",
          style: { width: "220px" },
          props: {
            type: "date",
            format: "yyyy-MM-dd",
            valueFormat: "timestamp"
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: "el-col",
          native: true,
          col: {
            span: 24
          },
          children: [
            {
              type: "china-region-cascade",
              field: "signingPlace",
              title: "签署地点",
              validate: this.formValidate({
                required: true
              }),
              props: {
                separator: "-"
                // disabled: true
              },
              col: {
                span: 12
              }
            },
            {
              type: "input",
              field: "signingPlaceDetail",
              validate: this.formValidate({
                required: true
              }),
              col: {
                span: 12
              }
            }
          ]
        }
      ],
      formOptions: {
        form: { labelWidth: "85px" },
        submitBtn: { show: false }
      }
    };
  },
  props: {
    contractRowInfo: {
      type: Object,
      default: {}
    },
    dialogStatus: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      if(!this.contractRowInfo.signingPlace) return
      let signingPlaceArr=("" + this.contractRowInfo.signingPlace).split(",")
      // console.log(("" + this.contractRowInfo.signingPlace).split(','+signingPlaceArr[signingPlaceArr.length-1])[0])
      this.formApi.setValue({
        ...this.contractRowInfo,
        signingPlace: ("" + this.contractRowInfo.signingPlace).split(','+signingPlaceArr[signingPlaceArr.length-1])[0].split(","),
        signingPlaceDetail: signingPlaceArr[signingPlaceArr.length-1]||""
      });
    });
  },
  methods: {
    // 上传
    // 上传成功
    handleDialogConfirm() {
      this.formApi.validate(valid => {
        if (valid) {
          let params = {
            ...this.formApi.formData(),
            id: this.contractRowInfo.id
          };
          params.signingPlace = `${params.signingPlace.join(",")},${params.signingPlaceDetail}`;
          ICommonContractBusinessUpdateSigningDateAddr(params)
            .then(res => {
              this.$showToast("签署成功！", "success");
              this.$emit("getSigningTime", params);
              this.handleDialogClosed();
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    handleDialogClosed() {
      this.$emit("handleDialogClosed", false);
    }
  }
};
</script>

<style lang="scss">
</style>
