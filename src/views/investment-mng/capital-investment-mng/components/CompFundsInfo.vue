<template>
  <div class="comp-funds-info">
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">放款信息</span>
      </div>
    </div>
    <div class="panel-body" style="margin-bottom: 10px">
      <form-create v-model="loanFormApi" :rule="loanRules" :option="options" />
      <div v-if="from !== 'add'" class="loan-account">
        <label>放款账户</label>
        <table class="el-table-simple" cellspacing="0" cellpadding="0" border="0">
          <thead>
            <th>放款类型</th>
            <th>放款账户/票据类型</th>
            <th>放款金额</th>
          </thead>
          <tbody>
            <tr>
              <td>金证股份</td>
              <td>抵押</td>
              <td>JNFL202005006BZ01</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <template v-if="from !== 'add'">
      <div class="panel-header">
        <div class="panel-wrapper">
          <span class="text">收款信息</span>
        </div>
      </div>
      <div class="panel-body" style="margin-bottom: 10px">
        <table class="el-table-simple" cellspacing="0" cellpadding="0" border="0">
          <thead>
            <th>费用类型</th>
            <th>收款方式</th>
            <th>金额</th>
            <th>摊销时间</th>
          </thead>
          <tbody>
            <template v-if="collectionInfoList.length">
              <tr v-for="(item, index) in collectionInfoList" :key="index">
                <td>{{ item.feeType | filterDictValue('10059') }}</td>
                <td>{{ item.chargeMethod }}</td>
                <td>{{ item.proportion }}%,{{ item.amount }}元</td>
                <td>{{ item.beginDate || '' }}-{{ item.endDate | '' }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="4" style="text-align: center">暂无数据</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="panel-header">
        <div class="panel-wrapper">
          <span class="text">租金支付表</span>
        </div>
      </div>
      <div class="panel-body">
        <form-create v-model="rentPaymentFormApi" :rule="rentPaymentRules" :option="options" />
      </div>
    </template>
  </div>
</template>

<script>
import TableCreate from "components/TableCreate/index";
import { isEmptyObj } from "utils";
import { getLoanInfo } from "api/investment-mng/api-capital-investment-mng.js";
export default {
  components: {
    TableCreate
  },
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
  inject: ["getTransferData", "getDataFromPublicData"],
  data() {
    return {
      loanFormApi: null,
      rentPaymentFormApi: null,
      loanRules: [
        {
          type: "el-custom-text",
          title: "放款期次",
          field: "placementNo"
        },
        {
          type: "el-custom-text",
          title: "合同金额(元)",
          field: "amtContract",
          props: {
            type: "number"
          }
        },
        {
          type: "el-custom-text",
          title: "已投放金额(元)",
          field: "usedLoanAmt",
          props: {
            type: "number"
          }
        },
        {
          type: "el-custom-text",
          title: "剩余可投放金额(元)",
          field: "canLoanAmt",
          props: {
            type: "number",
            color: "#1abc9c"
          }
        },
        {
          type: "el-col",
          col: { span: 24 },
          native: true,
          children: [
            {
              type: "number-input",
              title: "本次投放金额(元)",
              field: "amtLoan",
              validate: this.formValidate({ required: true }),
              on: {
                change: this.handleAmtLoanChange
              },
              col: { span: 12 }
            }
          ]
        },
        {
          type: "el-custom-text",
          title: "抵扣金额(元)",
          field: "amtDeduct",
          props: {
            type: "number"
          }
        },
        {
          type: "el-custom-text",
          title: "实际投放金额元)",
          field: "amtPayment",
          props: {
            type: "number"
          }
        },
        {
          type: "el-col",
          col: { span: 24 },
          native: true,
          children: [
            {
              type: "el-date-picker",
              title: "预计放款日",
              field: "plannedReleaseDate",
              props: {
                "value-format": "timestamp"
              },
              validate: this.formValidate({ required: true }),
              col: { span: 12 }
            }
          ]
        },
        {
          type: "el-custom-text",
          title: "收款方",
          field: "collectionName"
        },
        {
          type: "el-col",
          col: { span: 24 },
          native: true,
          children: [
            {
              type: "el-custom-select",
              title: "收款账户",
              field: "bankAccount",
              // validate: this.formValidate({ required: true }),
              props: {
                params: {
                  "auto-select": true,
                  labelKey(o) {
                    return `${o.bankAccountName}、${o.depositBank}`;
                  },
                  valueKey: "bankAccount"
                }
              },
              on: {
                change: this.handleBankAccountChange
              },
              col: { span: 12 }
            }
          ]
        },
        {
          type: "hidden",
          field: "bankCode"
        },
        {
          type: "hidden",
          field: "bankName"
        },
        {
          type: "hidden",
          field: "depositBank"
        },
        {
          type: "hidden",
          field: "bankInfo"
        }
      ],
      options: {
        form: { labelWidth: "150px", disabled: false },
        submitBtn: { show: false }
      },
      remark: "",
      rentPaymentRules: [
        {
          type: "el-custom-text",
          title: "租金计算方式",
          field: "calculateRentMethod",
          col: { span: 8 }
        },
        {
          type: "el-custom-text",
          title: "期限",
          field: "leaseTerm",
          col: { span: 8 }
        },
        {
          type: "el-custom-text",
          title: "年利率",
          field: "annualInterestRate",
          props: {
            type: "number",
            "need-format": false
          },
          col: { span: 8 }
        },
        {
          type: "el-custom-text",
          title: "租金总额",
          field: "totalRent",
          props: {
            type: "number"
          },
          col: { span: 8 }
        },
        {
          type: "el-custom-text",
          title: "利息总额",
          field: "totalInterest",
          props: {
            type: "number"
          },
          col: { span: 8 }
        },
        {
          type: "el-custom-text",
          title: "收回本金",
          field: "totalPrincipal",
          props: {
            type: "number"
          },
          col: { span: 8 }
        },
        {
          type: "el-custom-text",
          title: "每期租金/每期本金",
          field: "averagePrincipal",
          props: {
            type: "number"
          },
          col: { span: 8 }
        },
        {
          type: "el-custom-text",
          title: "财务收益率(IRR)",
          field: "xirr",
          props: {
            type: "number",
            "need-format": false
          },
          col: { span: 8 }
        },
        {
          type: "el-custom-text",
          title: "去税财务收益率(IRR)",
          field: "removalTaxIrr",
          props: {
            type: "number",
            "need-format": false
          },
          col: { span: 8 }
        },
        {
          type: "el-custom-text",
          title: "项目IRR",
          field: "irr",
          props: {
            type: "number",
            "need-format": false
          },
          col: { span: 8 }
        },
        {
          type: "el-custom-text",
          title: "项目去税IRR",
          field: "measureIrr",
          props: {
            type: "number",
            "need-format": false
          },
          col: { span: 8 }
        }
      ],
      collectionInfoList: []
    };
  },
  mounted() {
    if (!this.routeParams.loanId) {
      this.getLoanData();
    } else {
      this.$nextTick(() => {
        this.setFormData();
      });
    }
  },
  methods: {
    getLoanData() {
      const { conBundleId } = this.getTransferData();
      if (!conBundleId) return;
      getLoanInfo({
        id: conBundleId
      })
        .then(res => {
          if (res.data) {
            this.loanFormApi.setValue(res.data);
            this.loanFormApi.updateRule(
              "amtLoan",
              {
                validate: this.formValidate({
                  required: true,
                  min: 0.01,
                  max: res.data.canLoanAmt || 0
                })
              },
              true
            );
            if (res.data.bankListDto) {
              const tempData = res.data.bankListDto;
              const tempArr = [];
              if(tempData.bankAccount) {
                const defaultObj = {
                  bankAccount: tempData.bankAccount,
                  bankAccountName: tempData.bankAccountName,
                  bankCode: tempData.bankCode,
                  bankName: tempData.bankName,
                  depositBank: tempData.depositBank
                };
                tempArr.push(defaultObj);
              }
              if (
                Array.isArray(tempData.bankDtoList) &&
                tempData.bankDtoList.length
              ) {
                tempData.bankDtoList.forEach(item => {
                  tempArr.push({
                    bankAccount: item.bankAccount,
                    bankAccountName: item.bankAccountName,
                    bankCode: item.bankCode,
                    bankName: item.bankName,
                    depositBank: item.depositBank
                  });
                });
              }
              this.loanFormApi.updateRule("bankAccount", {
                props: {
                  params: {
                    options: tempArr
                  }
                }
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    setFormData() {
      const {
        pdmOtherCollectionsTableEntityDtos,
        pdmLoanTableEntityDto,
        calculatorResultDto
      } = this.getDataFromPublicData("all");
      // 放款信息
      if (!isEmptyObj(pdmLoanTableEntityDto)) {
        this.loanFormApi.setValue(pdmLoanTableEntityDto);
        if (this.from !== "add" && !this.routeParams.canEdit) {
          this.loanFormApi.updateOptions({
            form: {
              disabled: true
            }
          });
        }
      }
      if (this.from === "add") return;
      // 收款信息
      if (Array.isArray(pdmOtherCollectionsTableEntityDtos)) {
        this.collectionInfoList = pdmOtherCollectionsTableEntityDtos;
      }
      // 租金支付表
      if (
        !isEmptyObj(calculatorResultDto) &&
        !isEmptyObj(calculatorResultDto.quotationLeaseTDto)
      ) {
        this.rentPaymentFormApi.setValue(
          calculatorResultDto.quotationLeaseTDto
        );
      }
    },
    handleAmtLoanChange(val) {
      const { amtDeduct = 0 } = this.loanFormApi.formData();
      this.loanFormApi.setValue("amtPayment", +val - amtDeduct);
    },
    handleBankAccountChange({ data }) {
      if (!data) return;
      const {
        bankCode = "",
        bankName = "",
        depositBank = "",
        bankInfo = ""
      } = data;
      this.loanFormApi.setValue({
        bankCode,
        bankName,
        depositBank,
        bankInfo
      });
    },
    validateForm() {
      return new Promise((resolve, reject) => {
        this.loanFormApi.validate(valid => {
          if (valid) {
            resolve({
              loanData: this.loanFormApi.formData()
            });
          } else {
            resolve({
              loanData: {}
            });
          }
        });
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.comp-funds-info /deep/  {
  .el-date-editor, .el-select {
    width: 100%;
  }
  .panel-body {
    max-width: 1000px;
  }
  .loan-account {
    display: flex;
    margin-bottom: 18px;
    label {
      flex-shrink: 0;
      width: 150px;
      padding-right: 12px;
      font-weight: normal;
      text-align: right;
      color: #606266;
    }
  }
}

</style>
