<template>
  <div>
    <el-dialog
      width="500px"
      :modal-append-to-body="false"
      title="新增定价测算"
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
import { queryDictItems, deepAssign } from "utils";
import {
  PriceBusinessave,
  PriceBusinessQueryProjectPrimeRateInfo
} from "api/project-module/api-project-pricing";

export default {
  inheritAttrs: false,
  data() {
    return {
      dialogVisible: false,
      formApi: null,
      formRules: [
        {
          type: "hidden",
          field: "custId"
        },
        {
          type: "hidden",
          field: "id"
        },
        {
          type: "hidden",
          field: "modelId"
        },
        {
          type: "hidden",
          field: "projectId"
        },
        {
          type: "el-custom-select",
          title: "项目名称",
          field: "projectName",
          props: {
            filterable: "true",
            params: {
              url: PriceBusinessQueryProjectPrimeRateInfo,
              data: {},
              searchKey: "projectName",
              labelKey: "projectName",
              valueKey: "projectName",
              repeat: false
            },
            clearable: true
          },
          validate: this.formValidate({ required: true }),
          on: {
            change: v => {
              let data = v.data;
              this.handleGetProjectInfo(data);
            }
          }
        },
        {
          type: "input",
          field: "custName",
          title: "客户名称",
          props: { disabled: true }
        },
        {
          type: "input",
          field: "projectNo",
          title: "项目编号",
          props: { disabled: true }
        },
        {
          type: "select",
          title: "租赁类型",
          field: "businessType",
          options: queryDictItems("10026"),
          props: { disabled: true }
        },
        {
          type: "input",
          field: "leaseTerm",
          title: "租赁期限",
          props: { disabled: true },
           children: [
            {
              type: "span",
              slot: "append",
              children: ["月"]
            }
          ]
        },
        {
          type: "number-input",
          field: "irr",
          title: "项目IRR",
          props: { disabled: true,'max-decimal': 4  },
          children: [
            {
              type: "span",
              slot: "append",
              children: ["%"]
            }
          ]
        }
      ],
      formOptions: {
        form: { labelWidth: "100px" },
        submitBtn: { show: false }
      },
      projectPrimeRateInfo: []
    };
  },
  mounted() {
    // PriceBusinessQueryProjectPrimeRateInfo({}, { showLoading: true })
    // .then(res => {
    //   this.projectPrimeRateInfo = res.data
    // })
    // .catch(err => {
    //   console.log(err);
    // });
    this.dialogVisible = true;
  },
  methods: {
    handleGetProjectInfo(data) {
      for(let [key, item] of Object.entries(data)){
        if(key=="irr"){
          data[key] = (item*100).toFixed(4)
        }
      }
      this.formApi.setValue(data);
    },
    handleDialogConfirm() {
      this.formApi.validate(async valid => {
        if (valid) {
          const params = deepAssign(this.formApi.formData());
          // params.irr = params.irr
          PriceBusinessave(params, { showLoading: true })
            .then(res => {
              this.$showToast("新增成功！", "success");
              this.dialogVisible = false;
              const { modelId,id } = res.data;
              this.$router.push({
                name: "pricingCalculationDetail",
                query: {
                  projectId:params.projectId||'1',
                  modelId: modelId,
                  id:id,
                  action:'add'
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
