<template>
  <div class="comp-investment-info">
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">项目基本信息</span>
      </div>
    </div>
    <div class="panel-body">
      <form-create v-model="projectFormApi" :rule="projectRules" :option="options" />
    </div>
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">合同信息</span>
      </div>
    </div>
    <div class="panel-body">
      <form-create v-model="contractFormApi" :rule="contractRules" :option="options" />
    </div>
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">担保信息</span>
      </div>
    </div>
    <div class="panel-body">
      <table class="el-table-simple" cellspacing="0" cellpadding="0" border="0">
        <thead>
          <th>担保方</th>
          <th>担保方式</th>
          <th>担保合同编号</th>
          <th>担保金额</th>
          <th>抵押物/质押物</th>
        </thead>
        <tbody>
          <template v-if="guaranteeInfoList.length">
            <tr v-for="(item, index) in guaranteeInfoList" :key="index">
              <td>{{ item.guaranteeName }}</td>
              <td>抵押</td>
              <td>{{ item.contractNo }}</td>
              <td>{{ item.amtGuarantee }}元</td>
              <td>{{ item.collateral }}</td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="5" style="text-align: center">暂无数据</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div style="height: 10px" />
  </div>
</template>

<script>
import {
  contractList,
  projectList,
  queryLoanDetail,
  getLoanInfo
} from "api/investment-mng/api-capital-investment-mng.js";
import { riskLevelList } from "api/run-module/anti-money-config.js";
import { isEmptyObj } from "utils";
export default {
  components: {},
  props: {
    from: {
      type: String,
      default: "add"
    },
    routeParams: {
      type: Object,
      default: () => ({})
    }
  },
  inject: ["getDataFromPublicData"],
  data() {
    return {
      projectFormApi: null,
      contractFormApi: null,
      projectRules: [
        {
          type: "el-col",
          col: { span: 24 },
          native: true,
          children: [
            {
              type: "el-custom-select",
              title: "项目名称",
              field: "projectName",
              validate: this.formValidate({ required: true }),
              props: {
                params: {
                  url: projectList,
                  data: {},
                  labelKey: "projectName",
                  valueKey: "projectName"
                },
                filterable: true
              },
              col: { span: 12 },
              on: {
                change: this.handleProjectSelectChange
              }
            }
          ]
        },
        {
          type: "hidden",
          field: "projectManagerId"
        },
        {
          type: "hidden",
          field: "projectRecordId"
        },
        {
          type: "el-custom-text",
          title: "租赁类别",
          field: "businessCategory",
          props: {
            type: "dict",
            "dict-no": "10027"
          },
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "租赁类型",
          field: "businessType",
          props: {
            type: "dict",
            "dict-no": "10026"
          },
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "项目类型",
          field: "projectType",
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "转让方",
          field: "transferorName",
          props: {
            color: "#409EFF"
          },
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "转让机构类型",
          field: "transferorType",
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "项目金额(元)",
          field: "quotationPrice",
          props: {
            type: "number"
          },
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "首付款(元)",
          field: "firstPrice",
          props: {
            type: "number"
          },
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "融资金额(元)",
          field: "leaseFinancing",
          props: {
            type: "number"
          },
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "已投放金额(元)",
          field: "amtUsedAmount",
          props: {
            type: "number"
          },
          col: { span: 12 }
        },
        {
          type: "hidden",
          field: "lesseeId"
        },
        {
          type: "el-custom-text",
          title: "承租人名称",
          field: "lesseeName",
          props: {
            type: "link"
          },
          col: { span: 12 },
          on: {
            click: this.handleLesseeNameClick
          }
        },
        {
          type: "el-custom-text",
          title: "是否绿色贷款",
          field: "greenLoan",
          props: {
            type: "dict",
            "dict-no": "10004"
          },
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "反洗钱风险等级",
          field: "riskLevel",
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "是否需要投保",
          field: "isInsure",
          props: {
            type: "dict",
            "dict-no": "10004"
          },
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "项目情况",
          field: "projectSituation",
          col: { span: 24 }
        },
        {
          type: "el-custom-text",
          title: "备注",
          field: "remarks",
          col: { span: 24 }
        }
      ],
      contractRules: [
        {
          type: "hidden",
          field: "conBundleId"
        },
        {
          type: "el-col",
          col: { span: 24 },
          native: true,
          children: [
            {
              type: "el-custom-select",
              title: "主合同编号",
              field: "contractNo",
              validate: this.formValidate({ required: true }),
              props: {
                filterable: true
              },
              on: {
                change: this.handleContractSelectChange
              },
              col: { span: 12 }
            }
          ]
        },
        {
          type: "el-custom-text",
          title: "合同金额(元)",
          field: "amtContract",
          props: {
            type: "number"
          },
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "首付款(元)",
          field: "firstPrice",
          props: {
            color: "#1abc9c",
            type: "number"
          },
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "租金计算方式",
          field: "calculateRentMethod",
          props: {
            type: "dict",
            "dict-no": "10030"
          },
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "利息税率(%)",
          field: "lourddd",
          props: {
            type: "number",
            "need-format": false
          },
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "还款期限",
          field: "leaseTerm",
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "租金还款频次",
          field: "repaymentFrequency",
          props: {
            type: "dict",
            "dict-no": "10031"
          },
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "利率模式",
          field: "interestRateModel",
          props: {
            type: "dict",
            "dict-no": "10033"
          },
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "年利率(%)",
          field: "annualInterestRate",
          props: {
            type: "number",
            "need-format": false
          },
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "已投放额度(元)",
          field: "usedLoanAmt",
          props: {
            type: "number"
          },
          col: { span: 12 }
        },
        {
          type: "el-custom-text",
          title: "剩余投放额度(元)",
          field: "canLoanAmt",
          props: {
            type: "number"
          },
          col: { span: 12 }
        }
      ],
      guaranteeInfoList: [],
      options: {
        form: { labelWidth: "150px", disabled: false },
        submitBtn: { show: false }
      }
    };
  },
  created() {
    this.initUI();
    this.getRiskLevelList();
  },
  mounted() {
    this.$nextTick(() => {
      this.setFormData()
    })
  },
  methods: {
    initUI() {
      if (this.routeParams.loanId) {
        this.projectRules[0].children[0].type = "el-custom-text";
        this.contractRules[1].children[0].type = "el-custom-text";
      }
    },
    setFormData() {
      const {
        projectInfoDto,
        contractInfoDto,
        pdmGuaranteeInfoTableEntityDtos,
        pdmProjectPlacementTableEntityDto
      } = this.getDataFromPublicData("all");
      // 项目基本信息
      if (!isEmptyObj(projectInfoDto)) {
        projectInfoDto.riskLevel =
          (this.riskLevelList &&
            this.riskLevelList[projectInfoDto.riskLevel]) ||
          projectInfoDto.riskLevel;
        this.projectFormApi.setValue(projectInfoDto);
      }
      // 合同基本信息
      if (!isEmptyObj(contractInfoDto)) {
        this.contractFormApi.setValue(contractInfoDto);
      }
      // 担保信息
      if (Array.isArray(pdmGuaranteeInfoTableEntityDtos)) {
        this.guaranteeInfoList = pdmGuaranteeInfoTableEntityDtos;
      }
      // 项目合同字段提取
      if (!isEmptyObj(pdmProjectPlacementTableEntityDto)) {
        const {
          amtUsedAmount = 0,
          usedLoanAmt = 0,
          canLoanAmt = 0
        } = pdmProjectPlacementTableEntityDto;
        this.projectFormApi.setValue({
          amtUsedAmount
        });
        this.contractFormApi.setValue({
          usedLoanAmt,
          canLoanAmt
        });
      }
    },
    getRiskLevelList() {
      riskLevelList({
        dto: {},
        pageCurrent: 1,
        pageSize: 100
      })
        .then(res => {
          if (res.data && Array.isArray(res.data.records)) {
            const tempObj = {};
            res.data.records.forEach(item => {
              tempObj[item.levelId] = item.riskLevel;
            });
            this.riskLevelList = tempObj;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleProjectSelectChange({ data }) {
      if (!data) return;
      if (data.businessCategory === "0") {
        this.projectFormApi.hidden(true, ["transferorName", "transferorType"]);
      }
      data.riskLevel =
        (this.riskLevelList && this.riskLevelList[data.riskLevel]) ||
        data.riskLevel;
      this.projectFormApi.setValue(data);
      // this.projectManagerId = data.projectManagerId
      // this.projectRecordId = data.projectRecordId
      this.contractFormApi.resetFields();
      this.getContractByProjectId(data.projectManagerId);
    },
    getContractByProjectId(id) {
      contractList({
        id
      })
        .then(res => {
          if (res.data && Array.isArray(res.data.records)) {
            const options = res.data.records;
            this.contractFormApi.updateRule(
              "contractNo",
              {
                props: {
                  params: {
                    options: res.data.records,
                    labelKey: "contractNo",
                    valueKey: "contractNo"
                  }
                }
              },
              true
            );
            this.$nextTick(() => {
              this.contractFormApi.clearValidateState();
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleContractSelectChange({ data }) {
      if (!data) return;
      this.contractFormApi.setValue(data);
      this.getGuaranteeInfo(data.conBundleId);
    },
    handleLesseeNameClick() {
      const { lesseeId } = this.projectFormApi.formData();
      if (!lesseeId) return this.$showToast("承租人id不允许为空！");
      this.$router.push({
        path: "/customer-mng/customer-detail",
        query: {
          id: lesseeId
        }
      });
    },
    getGuaranteeInfo(conBundleId) {
      getLoanInfo({
        id: conBundleId,
        loadId: this.routeParams.loanId
      })
        .then(res => {
          if (
            res.data &&
            Array.isArray(res.data.pdmGuaranteeInfoTableEntityDtos)
          ) {
            this.guaranteeInfoList = res.data.pdmGuaranteeInfoTableEntityDtos;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    validateForm() {
      this.projectFormApi.validate(valid => {});
      this.contractFormApi.validate(valid => {});
      const {
        projectManagerId,
        projectRecordId
      } = this.projectFormApi.formData();
      if (!projectManagerId) {
        // this.$showToast("projectManagerId不允许为空！", "warning");
        return false;
      }
      const { conBundleId } = this.contractFormApi.formData();
      if (!conBundleId) {
        // this.$showToast("conBundleId不允许为空！", "warning");
        return false;
      }
      return {
        projectManagerId,
        projectRecordId,
        conBundleId
      };
    }
  }
};
</script>

<style lang='scss' scoped>
.comp-investment-info /deep/  {
  max-width: 1000px;
  .el-select {
    width: 100%;
  }
  .el-form-item {
    margin-bottom: 5px;
  }
  .el-form-item.is-required {
    margin-bottom: 18px;
  }
}

</style>
