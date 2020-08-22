<template>
  <div>
    <el-dialog
       width="500px"
      :modal-append-to-body="false"
      title="新增模型"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ISomPricingModelBusinessave } from "api/project-module/api-project-pricing";
export default {
  inheritAttrs: false,
  data() {
    return {
      dialogVisible: false,
      formApi: null,
      formRules: [
         {
          type: 'input',
          title: '模型名称',
          field: 'modelName',
          validate: this.formValidate({ required: true })
        }
      ],
      formOptions: {
        form: { labelWidth: "100px" },
        submitBtn: { show: false }
      }
    };
  },
  mounted() {
    this.dialogVisible = true;
  },
  methods: {
    handleDialogConfirm() {
      this.formApi.validate(async valid => {
        if (valid) {
          const params = this.formApi.formData();
          ISomPricingModelBusinessave(params, { showLoading: true })
            .then(res => {
              this.$showToast("新增成功！", "success");
              this.dialogVisible = false;
              const { id } = res.data;
               this.$router.push({
               name:"PricingDetail",
                query: {
                  id: id
                }
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
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
