<template>
  <el-dialog
    ref="attachmentChangeDom"
    title="上传附件"
    :visible.sync="dialogStatus"
    :modal-append-to-body="false"
    :limit="fileLimit"
    @closed="handleDialogClosed"
    width="500px"
  >
    <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClosed">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  IConEnclosureBusinessave,
  getConEnclosureList,
} from "api/contract-module/api-contract-attachment.js";
// 文件类型
export default {
  data() {
    return {
      formApi: null,
      formRules: [
        {
          type: "el-custom-select",
          title: "附件类型",
          field: "enclosureId",
          validate: this.formValidate({ required: true }),
           props: {
            params: {
              url: getConEnclosureList,
              data: {
              },
              searchKey: "dataContent",
              labelKey: "dataContent",
              valueKey: "enclosureId",
              repeat: false
            },
            clearable: true
          }
        },
        {
          type: "el-custom-upload",
          title: "附件",
          field: "file",
          validate: this.formValidate({ required: true }),
          on: {
            "upload-complete": this.handleAttachUploadComplete
          }
        }
      ],
      formOptions: {
        form: { labelWidth: "85px" },
        submitBtn: { show: false }
      }
    };
  },
  props: [
    "contractRowInfo",
    "routeParams",
    "dialogStatus"
  ],
  created() {},
  methods: {
    // 上传
    handleUpload() {},
    // 上传成功
    handleDialogConfirm() {
      this.formApi.validate(valid => {
        if (valid) {
          this.formApi.el("file").submitUpload();
        }
      });
    },
    handleDialogClosed() {
      this.$emit("handleDialogClosed", false);
    },
    handleAttachUploadComplete() {
      const fileAddedIdList = this.formApi.el("file").fileAddedIdList;
      if (!fileAddedIdList.length) return this.$showToast("文件Id不允许为空！");
      const params = {
        enclosureId:
          this.formApi.getValue("enclosureId"),
        recordId: this.contractRowInfo.id,
        addFileId: fileAddedIdList
      };
      IConEnclosureBusinessave(params)
        .then(res => {
          this.$showToast("新增成功！", "success");
          this.$emit("refreshTable", {});
          this.handleDialogClosed();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss">
</style>
