<template>
  <div>
    <el-dialog
      width="600px"
      v-transfer-dom
      :modal-append-to-body="false"
      title="新建项目"
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
import { queryDictItems } from "utils";
import { projectAdd, projectList } from "api/project-module/api-project-mng.js";
import { customerList } from "api/customer-module/api-customer-mng.js";
import { mapGetters } from "vuex";
let dataSource = [
  {
    type: "el-custom-select",
    title: "承租人",
    props: {
      filterable: "true",
      params: {
        url: customerList,
        data: {
          custAttribute: "1263390879744671746,1263391047416168450",
          blacklistState: "1"
        },
        labelKey: "custName",
        valueKey: "custName"
      },
      clearable: true
    }
  },
  {
    type: "el-custom-select",
    title: "转让方",
    props: {
      filterable: "true",
      params: {
        url: customerList,
        data: {
          custAttribute: "1263390975840370689",
          blacklistState: "1"
        },
        labelKey: "custName",
        valueKey: "custName"
      },
      clearable: true
    }
  }
];
let transferorType = {
  type: "select",
  title: "转让机构类型",
  field: "transferorType",
  value: "0",
  options: queryDictItems("10025")
};
export default {
  inheritAttrs: false,
  data() {
    return {
      dialogVisible: false,
      formApi: null,
      formRules: [
        {
          type: "select",
          title: "租赁类别",
          field: "businessCategory",
          value: "0",
          options: queryDictItems("10027"),
          validate: this.formValidate({ required: true }),
          on: {
            change: ({ val, data }) => {
              this.formApi.setValue({
                lesseeName: null,
                lesseeId: null,
                transferorName: null,
                transferorId: null
              });
            }
          },
          control: [
            {
              value: "0",
              rule: [
                {
                  field: "lesseeName",
                  on: {
                    change: ({ val, data }) => {
                      this.formApi.setValue({
                        lesseeId: data.id,
                        transferorId: null
                      });
                    }
                  },
                  ...dataSource[0],
                  validate: this.formValidate({ required: true })
                }
              ]
            },
            {
              value: "1",
              rule: [
                {
                  field: "lesseeName",
                  on: {
                    change: ({ val, data }) => {
                      this.formApi.setValue({
                        lesseeId: data.id
                      });
                    }
                  },
                  ...dataSource[1],
                  validate: this.formValidate({ required: true })
                },
                {
                  field: "transferorName",
                  on: {
                    change: ({ val, data }) => {
                      this.formApi.setValue({
                        transferorId: data.id
                      });
                    }
                  },
                  ...dataSource[0],
                  validate: this.formValidate({ required: true })
                },
                {
                  ...transferorType,
                  validate: this.formValidate({ required: true })
                }
              ]
            },
            {
              value: "2",
              rule: [
                {
                  field: "lesseeName",
                  on: {
                    change: ({ val, data }) => {
                      this.formApi.setValue({
                        lesseeId: data.id
                      });
                    }
                  },
                  ...dataSource[0],
                  validate: this.formValidate({ required: true })
                },
                {
                  field: "transferorName",
                  on: {
                    change: ({ val, data }) => {
                      this.formApi.setValue({
                        transferorId: data.id
                      });
                    }
                  },
                  ...dataSource[1],
                  validate: this.formValidate({ required: true })
                },
                {
                  ...transferorType,
                  validate: this.formValidate({ required: true })
                }
              ]
            }
          ]
        },
        {
          type: "hidden",
          title: "承租人",
          field: "transferorId"
        },
        {
          type: "hidden",
          title: "承租人",
          field: "lesseeId"
        },
        {
          type: "hidden",
          title: "租赁类型",
          value: "直租",
          field: "businessTypeName",
          validate: this.formValidate({ required: true })
        },
        {
          type: "select",
          title: "租赁类型",
          value: "0",
          field: "businessType",
          options: queryDictItems("10026"),
          validate: this.formValidate({ required: true }),
          on: {
            change: ({ val, data }) => {
              this.formApi.setValue({
                businessTypeName: Vue.filter("filterDictValue")(
                  this.formApi.getValue("businessType"),
                  "10026"
                )
              });
            }
          }
        },
        {
          type: "select",
          title: "项目类型",
          field: "projectType",
          options: queryDictItems("10049"),
          props: {
            disabled: true
          }
        }
      ],
      formOptions: {
        form: { labelWidth: "140px" },
        submitBtn: { show: false }
      }
    };
  },
  computed: {
    ...mapGetters(["departmentName"])
  },
  mounted() {
    this.dialogVisible = true;
    this.initProjectType();
  },
  methods: {
    handleDialogConfirm() {
      this.formApi.validate(async valid => {
        if (valid) {
          const params = this.formApi.formData();
          params.businessCooperation = this.businessCooperation;
          projectAdd(params, { showLoading: true })
            .then(res => {
              this.$showToast("新增成功！", "success");
              this.dialogVisible = false;
              const { id } = res.data;
              this.$emit("dialog-confirm", {
                id
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    initProjectType() {
      this.$nextTick(() => {
        if (this.departmentName == "普惠金融部") {
          this.formApi.setValue({
            projectType: "0"
          });
        } else {
          this.formApi.setValue({
            projectType: "1"
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
