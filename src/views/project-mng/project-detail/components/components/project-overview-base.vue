<!-- 项目概览-项目基本信息 -->
<template>
  <div class="panel-project-overview">
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">项目基本信息</span>
        <div class="panel-tools" v-if="routeParams.canEdit">
          <el-button v-if="!canEdit" size="mini" type="primary" @click="handleEditClick(true)">修改</el-button>
          <template v-else>
            <el-button size="mini" @click="handleEditClick(false,true)">取消</el-button>
            <el-button size="mini" type="primary" @click="handleSaveClick">保存</el-button>
          </template>
        </div>
      </div>
    </div>
    <div class="content-body">
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    </div>
  </div>
</template>

<script>
import { queryDictItems, transObject, deepAssign } from "utils";
import {
  groupCustomerList,
  getcustomerList,
  customerList
} from "api/customer-module/api-customer-mng.js";
import EnterpriseInfo from "./project-overview-enterprise";
import {
  getUpdateById,
  queryProjectNo
} from "api/project-module/api-project-mng.js";
import {
  ISomMoneyRiskLevelTable,
  getISomMoneyRiskOptionTable,
  ISomMoneyRiskOptionTable
} from "api/risk-module/api-risk-mng.js";
import enterpriseScaleConfig from "./enterpriseScaleConfig.js";
export default {
  components: {
    EnterpriseInfo
  },
  props: ["routeParams", "projectInfo", "enterpriseInfo"],
  data() {
    return {
      canEdit: false,
      formApi: {},
      levelOption: [],
      supplierOption: [],
      transferorType: {
        type: "select",
        field: "transferorType",
        options: queryDictItems("10025"),
        validate: this.formValidate({ required: true })
      },
      transferorName: {
        type: "el-custom-select",
        field: "transferorName",
        on: {
          change: ({ val, data }) => {
            this.formApi.setValue({
              transferorId: data.id
            });
          }
        },
        validate: this.formValidate({ required: true })
      },
      lesseeName: {
        type: "el-custom-select",
        field: "lesseeName",
        on: {
          change: ({ val, data }) => {
            this.formApi.setValue({
              lesseeId: data.id
            });
          }
        },
        validate: this.formValidate({ required: true })
      },
      formRules: [
        {
          type: "input",
          field: "projectName",
          title: "项目名称",
          validate: this.formValidate({ required: true }),
          col: { span: 12 }
        },
        {
          type: "input",
          field: "projectNo",
          title: "项目编号",
          col: { span: 12 },
          validate: [
            {
              trigger: ["blur"],
              validator: (rule, val, cb) => {
                let params = {
                  id: this.projectInfo.recordId,
                  projectNo: val
                };
                queryProjectNo(params, {
                  showLoading: true,
                  captureError: true
                }).then(res => {
                  if (!res.status) {
                    cb();
                  } else {
                    cb(new Error(res.msg));
                  }
                });
              }
            }
          ]
        },
        {
          type: "select",
          title: "租赁类别",
          field: "businessCategory",
          col: { span: 12 },
          value: "1",
          options: queryDictItems("10027"),
          on: {
            change: ({ val, data }) => {
              this.handleBusinessCategoryChange(
                this.formApi.getValue("businessCategory")
              );
            }
          },
          control: [
            {
              handle: function(val) {
                return val == "1" || val == "2";
              },
              rule: []
            }
          ]
        },
        {
          type: "hidden",
          field: "transferorTypeId",
          col: { span: 0 }
        },
        {
          type: "hidden",
          field: "transferorId",
          col: { span: 0 }
        },
        {
          type: "hidden",
          field: "lesseeId",
          col: { span: 0 }
        },
        {
          type: "select",
          title: "租赁类型",
          value: "0",
          col: { span: 12 },
          field: "businessType",
          options: queryDictItems("10026"),
          on: {
            change: ({ val, data }) => {
              this.handleBusinessTypeChange(
                this.formApi.getValue("businessType")
              );
              if (this.formApi.getValue("businessType") == "0") {
                this.getSupplierOption();
              }
            }
          },
          control: [
            {
              value: "0",
              rule: [
                {
                  type: "select",
                  title: "供应商",
                  field: "supplierId",
                  options: this.supplierOption,
                  props: {
                    filterable: "true",
                    multiple: "true",
                    clearable: "true"
                  },
                  validate: this.formValidate({ required: true })
                }
              ]
            }
          ]
        },
        {
          type: "input",
          title: "业务经理",
          col: { span: 12 },
          field: "businessManagerName",
          props: {
            disabled: "true",
            params: {
              url: groupCustomerList,
              data: {},
              searchKey: "businessManagerName",
              labelKey: "businessManagerName",
              valueKey: "businessManagerName",
              repeat: false
            }
          }
        },
        {
          type: "input",
          title: "业务协办经理",
          col: { span: 12 },
          field: "viceBusinessManagerName",
          props: {
            disabled: true,
            params: {
              url: groupCustomerList,
              data: {},
              searchKey: "viceBusinessManagerName",
              labelKey: "viceBusinessManagerName",
              valueKey: "viceBusinessManagerName",
              repeat: false
            }
          }
        },
        {
          // 项目审批过程通过后
          type: "input",
          title: "风险审查岗",
          col: { span: 12 },
          field: "riskReviewName",
          props: { disabled: "true" }
        },
        {
          // 项目审批过程中
          type: "input",
          title: "法律审查岗",
          col: { span: 12 },
          field: "legalReviewName",
          props: { disabled: "true" }
        },
        {
          type: "select",
          field: "projectSource",
          title: "项目来源",
          options: queryDictItems("10028"),
          validate: this.formValidate({ required: true }),
          col: { span: 12 },
          style: { width: "100%" },
          props: {
            clearable: true
          }
        },
        {
          type: "radio",
          title: "是否办理保险",
          field: "isInsure",
          col: { span: 12 },
          value: "1",
          options: queryDictItems("10004"),
          validate: this.formValidate({ required: true }),
          control: [
            {
              value: "1",
              rule: [
                {
                  type: "radio",
                  title: "我司是否为第一受益人",
                  col: { span: 12 },
                  field: "firstBeneficiary",
                  options: queryDictItems("10004"),
                  validate: this.formValidate({ required: true })
                },
                {
                  type: "input",
                  title: "租赁物保险商",
                  col: { span: 12 },
                  field: "leaseInsurer",
                  validate: this.formValidate({ required: true })
                }
              ]
            }
          ]
        },
        {
          type: "radio",
          title: "是否集团授信", // 是否swager上的集团客户?
          col: { span: 12 },
          field: "isGroupCustomer",
          value: "0",
          props: { disabled: "true" },
          options: queryDictItems("10004")
        },
        {
          type: "industry-cascade",
          field: "inveseDirection",
          title: "贷款行业投向",
          validate: this.formValidate({ required: true }),
          col: { span: 24 },
          on: {
            change: this.calclateEnterpriseScale
          }
        },
        {
          type: "industry-cascade",
          title: "行业类别",
          field: "industry",
          props: { disabled: "true" }
        },
        {
          type: "el-custom-select",
          title: "反洗钱风险等级",
          col: { span: 12 },
          field: "riskLevel",
          props: {
            params: {
              url: ISomMoneyRiskLevelTable,
              data: {},
              searchKey: "id",
              labelKey: "riskLevel",
              valueKey: "id",
              repeat: false
            }
          },
          on: {
            change: ({ val, data }) => {
              this.formApi.setValue("levelOption", null);
              this.getRiskOptions(data.id);
            }
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: "select",
          title: "反洗钱等级选项",
          field: "levelOption",
          options: this.levelOption,
          props: {
            filterable: "true",
            multiple: "true",
            clearable: "true"
          },
          validate: this.formValidate({ required: true })
        },

        {
          type: "input",
          title: "租赁物",
          field: "lease",
          validate: this.formValidate({ required: true }),
          props: {
            type: "textarea"
          }
        },
        {
          type: "input",
          title: "租金支付方式",
          field: "rentPayment"
        },
        {
          type: "input",
          title: "租金用途",
          field: "rentalPurpose",
          validate: this.formValidate({ required: true }),
          props: {
            type: "textarea"
          }
        },
        {
          type: "input",
          title: "抵押事项",
          field: "mortgageMatter",
          validate: this.formValidate({ required: true }),
          props: {
            type: "textarea"
          }
        },
        {
          type: "input",
          title: "保证措施",
          field: "assuranceStep",
          validate: this.formValidate({ required: true }),
          props: {
            type: "textarea"
          }
        },
        {
          type: "input",
          title: "项目情况",
          field: "projectSituation",
          props: {
            type: "textarea"
          }
        },
        {
          type: "input",
          title: "发债情况",
          field: "issuanceStatus",
          props: {
            type: "textarea"
          }
        },
        {
          type: "input",
          title: "备注",
          field: "remarks",
          props: {
            type: "textarea"
          }
        }
      ],
      formOptions: {
        form: {
          labelWidth: "150px",
          disabled: true
        },
        submitBtn: { show: false }
      },
      formData: {}, // 用来存放查询到的数据
      numberArrays: [
        "approvalTime",
        "capitalPaid",
        "externalFinance",
        "externalGuarantee",
        "inquireTime",
        "fixedAsset",
        "isChange",
        "projectStatus",
        "sysOverTime",
        "sysVersion",
        "leaseAsset",
        "totalAssets"
      ],
      showEdit: true,
      lesseeIndex: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initForm();
    });
  },
  methods: {
    initForm() {
      this.formData = this.projectInfo;
      const businessCategory = this.formData.businessCategory;
      this.handleBusinessTypeChange(this.formData.businessType);
      this.getRiskOptions(this.projectInfo.riskLevel);
      this.getSupplierOption();
      this.formApi.resetFields();
      this.initFormSetValue();
      this.handleBusinessCategoryChange(businessCategory);
    },

    async getRiskOptions(levelId = null) {
      if (levelId) {
        await getISomMoneyRiskOptionTable({ levelId }, { showLoading: true })
          .then(res => {
            this.levelOption = res.data.records.map((item, index) => {
              return {
                value: item.id,
                label: item.content
              };
            });
            this.formApi.updateRule(
              "levelOption",
              {
                options: this.levelOption
              },
              true
            );
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    async getSupplierOption() {
      await getcustomerList(
        {
          custAttribute: "1263390954222927873,1263391096523079682",
          queryFlag: "1"
        },
        { showLoading: true }
      )
        .then(res => {
          this.supplierOption = res.data.records.map((item, index) => {
            if (item.blacklistState == "0") {
              return {
                value: item.id,
                label: item.custName + "(黑名单)"
              };
            } else {
              return {
                value: item.id,
                label: item.custName
              };
            }
          });
          this.formApi.updateRule(
            "supplierId",
            {
              options: this.supplierOption
            },
            true
          );
        })
        .catch(err => {
          console.log(err);
        });
    },
    initFormSetValue() {
      let formData = deepAssign(this.formData);
      let str = (
        Vue.filter("filterDictValue")(formData.businessType, "10026") +
        "项目" +
        formData.projectNo
      ).trim();
      if (this.formData.projectName.indexOf(str) != -1) {
        var reg = new RegExp("(.*)" + str, "ig");
        formData.projectName = ("" + this.formData.projectName).replace(
          reg,
          "$1"
        );
      }
      this.formApi.setValue(formData);
      this.formApi.setValue({
        supplierId:
          (this.formData.supplierId &&
            (this.formData.supplierId + "").split(",")) ||
          "",
        levelOption:
          (this.formData.levelOption &&
            (this.formData.levelOption + "").split(",")) ||
          "",
        inveseDirection:
          (this.formData.inveseDirection &&
            (this.formData.inveseDirection + "").split(",")) ||
          "",
        industry:
          (this.formData.industry &&
            (this.formData.industry + "").split(",")) ||
          ""
      });
    },
    getLesseeNameRule(data) {
      return [
        {
          title: "承租人",
          col: { span: 12 },
          props: {
            disabled: data.disabled,
            filterable: "true",
            clearable: true,
            params: {
              url: customerList,
              data: {
                custAttribute: "1263390879744671746,1263391047416168450",
                blacklistState: "1"
              },
              labelKey: "custName",
              valueKey: "custName"
            }
          }
        },
        {
          title: "转让方",
          col: { span: 12 },
          props: {
            disabled: data.disabled,
            filterable: "true",
            clearable: true,
            params: {
              url: customerList,
              data: {
                custAttribute: "1263390975840370689",
                blacklistState: "1"
              },
              labelKey: "custName",
              valueKey: "custName"
            }
          }
        },
        {
          type: "select",
          title: "转让机构类型",
          col: { span: 12 },
          props: {
            disabled: data.disabled
          },
          value: "0",
          options: queryDictItems("10025"),
          validate: this.formValidate({ required: true })
        }
      ];
    },
    handleBusinessCategoryChange(businessCategory) {
      this.formApi.setValue({
        lesseeName: null,
        lesseeId: null,
        transferorName: null,
        transferorId: null
      });
      this.formApi.removeField("transferorType");
      this.formApi.removeField("transferorName");
      this.formApi.removeField("lesseeName");
      let data = {
        disabled: "" + (businessCategory == this.projectInfo.businessCategory)
      };
      if (businessCategory == this.projectInfo.businessCategory) {
        data = {
          disabled: "" + (businessCategory == this.projectInfo.businessCategory)
        };
      } else {
        data = {
          disabled: undefined
        };
      }
      this.$nextTick(() => {
        this.formApi.append(
          {
            ...this.transferorType,
            ...this.getLesseeNameRule(data)[2]
          },
          "transferorTypeId"
        );
        switch (businessCategory) {
          case "1":
            this.formApi.append(
              {
                ...this.transferorName,
                ...this.getLesseeNameRule(data)[0]
              },
              "transferorId"
            );
            this.formApi.append(
              {
                ...this.lesseeName,
                ...this.getLesseeNameRule(data)[1]
              },
              "lesseeId"
            );
            break;
          case "2":
            this.formApi.append(
              {
                ...this.transferorName,
                ...this.getLesseeNameRule(data)[1]
              },
              "transferorId"
            );
            this.formApi.append(
              {
                ...this.lesseeName,
                ...this.getLesseeNameRule(data)[0]
              },
              "lesseeId"
            );
            break;
          default:
            this.formApi.append(
              {
                ...this.lesseeName,
                ...this.getLesseeNameRule(data)[0]
              },
              "lesseeId"
            );
            break;
        }
      });
      if (businessCategory == this.formData.businessCategory) {
        setTimeout(() => {
          this.formApi.setValue({
            lesseeName: this.formData.lesseeName,
            lesseeId: this.formData.lesseeId,
            transferorName: this.formData.transferorName,
            transferorId: this.formData.transferorId
          });
        }, 0);
      }
    },
    handleBusinessTypeChange(businessType) {
      this.formApi.updateRules({
        projectName: {
          children: [
            {
              type: "span",
              slot: "append",
              children: [
                Vue.filter("filterDictValue")(businessType, "10026") + "项目"
              ]
            }
          ]
        }
      });
    },
    isIncloud(arrA, arrB) {
      return arrA.some(item => arrB.includes(item));
    },
    calclateEnterpriseScale() {
      const {
        industry = [],
        employeesNumber = 0,
        totalAssets = 0,
        businessIncome = 0
      } = this.formApi.formData();
      if (!industry || !industry.length) return;
      let myIndustry = [];
      myIndustry = enterpriseScaleConfig.filter(item => {
        // 根据行业类型筛选
        let isDetele = false;
        isDetele = !!this.isIncloud(industry, item.industry);
        return isDetele;
      });
      myIndustry =
        myIndustry.length === 1
          ? myIndustry
          : [enterpriseScaleConfig[enterpriseScaleConfig.length - 1]]; // 未匹配到归为其他未列明行业
      const element = myIndustry[0];
      const businessSize = this.getKey(
        element,
        employeesNumber,
        totalAssets,
        businessIncome
      );
    },
    getKey(element, employeesNumber, totalAssets, businessIncome) {
      // 获取key
      const arr = Object.keys(element.size);
      let key;
      for (let index = 0; index < arr.length; index++) {
        if (
          this.commonRule(element.size[arr[index]], {
            staff: employeesNumber,
            assets: totalAssets,
            revenue: businessIncome
          })
        ) {
          key = arr[index];
          break;
        }
      }
      return key;
    },
    commonRule(item, data) {
      // 匹配规则
      const isTrue = [];
      const keys = Object.keys(data);
      for (const key of keys) {
        if (item[key]) {
          isTrue.push(data[key] >= item[key][0]);
        }
      }
      return isTrue.every(item => item);
    },
    handleEditClick(state, isCancel) {
      this.setFormEditStatus(state, isCancel);
    },
    handleSaveClick() {
      this.formApi.validate(async valid => {
        if (valid) {
          let params = Object.assign({}, this.formApi.formData());
          if (!this.routeParams.id) return this.$showToast("客户id不允许为空");
          params.projectName =
            params.projectName +
            Vue.filter("filterDictValue")(params.businessType, "10026") +
            "项目" +
            params.projectNo;
          params.id = this.routeParams.id;
          //   params.projectName = params.projectDisplayName;
          params.levelOption = params.levelOption + "";
          params.inveseDirection = params.inveseDirection + "";
          params.industry = params.industry + "";
          params.supplierId = params.supplierId + "";
          params = transObject(params, this.numberArrays, "Float");
          getUpdateById(params, { showLoading: true })
            .then(res => {
              this.$showToast("保存成功", "success");
              // this.changeParentPageHeadInfo(params);
              this.formData = Object.assign({}, this.formApi.formData());
              this.setFormEditStatus(false);
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    setFormEditStatus(status = false, isCancel = false) {
      this.canEdit = status;
      this.formApi.updateOptions({
        form: { disabled: !status }
      });
      if (!status) {
        if (isCancel) {
          this.formApi.resetFields();
          this.handleBusinessCategoryChange(this.formData.businessCategory);
        }
        this.formApi.setValue(this.formData);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.cust-baseinfo-comp {
  .content-body {
    box-sizing: border-box;
    max-width: 1020px;
    padding: 0 10px 10px;
  }
  .panel-wrapper {
    position: relative;
    max-width: 1000px;

    .panel-tools {
      position: absolute;
      top: 0;
      right: 0;
      line-height: 36px;
    }
  }
  .divide-line {
    height: 10px;
    border-bottom: 5px solid #ffffff;
    background: #f1f4f5;
  }
  .el-form {
    .el-select,
    .el-input,
    .el-cascader {
      width: 100%;
    }
  }
}
</style>
