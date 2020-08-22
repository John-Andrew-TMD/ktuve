<!-- 标的物 -->
<template>
  <div>
    <h4>
      <span>合同要素</span>
      <el-button v-if="canEdit && isHistory" type="primary" size="mini" @click="handleEdit">修改</el-button>
    </h4>
    <contract-form
      v-if="mainFormRules.length"
      :form-rules="mainFormRules"
      :contract-row-info="contractRowInfo"
    />
    <template v-for="(item,index) in personList">
      <h4 :key="index" />
      <table :key="index" border="0" cellpadding="0" cellspacing="0">
        <tbody>
          <template v-for="(item2,index2,key2) in item.roleFormRules">
            <template v-if="getFormRulesTitle(item2).type!='hidden'">
              <tr :key="key2">
                <th width="150">{{ getFormRulesTitle(item2).title }}:</th>
                <td>{{ getFormRulesTitle(item2)?getFormRulesTitle(item2).value:'' }}</td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </template>
    <h4 />
    <contract-form
      v-if="otherFormRules.length"
      :form-rules="otherFormRules"
      :contract-row-info="contractRowInfo"
    />
  </div>
</template>

<script>
import {
  getContractBycommand,
  getCommonFormRules,
  getFormRules
} from "../../js/contract-field.config.js";
import { queryChinaRegionByIds, thousandSeparator } from "utils";
import ContractRightMixins from "./mixins/ContractRightMixins";
let returnedItem = [];
export default {
  components: {
    contractForm: () => import("./contract-form.vue")
  },
  mixins: [ContractRightMixins],
  props: {
    contracTypeData: {
      type: Object,
      default: () => ({})
    },
    rowData: {
      type: Object,
      default: () => ({})
    },
    contractRowInfo: {
      type: Object,
      default: () => ({})
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fApi: null,
      formRules: [],
      formOptions: {
        form: {
          labelWidth: "220px"
        },
        submitBtn: {
          show: false
        }
      },
      personList: {},
      mainFormRules: {},
      otherFormRules: {},
      moneyMap: ["equipmentPrice"],
      addressMap: [
        "officeAddress",
        "registerAddress",
        "shipmentLocations",
        "tradingLocations"
      ],
      controlField: {
        showfield: [
          "roleName",
          "bankInfo",
          "relatedContractNo",
          "designatedAccounts",
          "designatedBankInfo"
        ],
        hiddenfield: [
          "roleId",
          "bankId",
          "relatedContractId",
          "designatedAccountId",
          "designatedBankId"
        ]
      }
    };
  },
  inject: ["showContractDialog"],
  watch: {
    contractRowInfo: {
      handler(contractRowInfo) {
        if (contractRowInfo.id && this.contractRowInfo) {
          this.initRightData(this.contractRowInfo);
        }
      },
      immediate: true
    }
  },
  methods: {
    handleEdit() {
      const data = Object.assign({}, this.contracTypeData, {
        action: "U",
        conManagerId: this.rowData.conManagerId,
        parentId: this.contractRowInfo.parentId,
        contractId: this.contractRowInfo.id
      });
      this.showContractDialog(data);
    },
    initRightData(contractRowInfo) {
      this.contractRowInfo = contractRowInfo;
      const contracTypeForm = this.contracTypeData.contracTypeForm;
      const { roleForm = [], roleTypes = [] } = getContractBycommand(
        contracTypeForm
      );
      this.mainFormRules = getCommonFormRules(
        this,
        "mainForm",
        contracTypeForm
      ).map((item, index) => {
        return this.getFormValue(this.getFormRulesTitle(item));
      });
      this.otherFormRules = getCommonFormRules(
        this,
        "otherForm",
        contracTypeForm
      ).map((item, index) => {
        return this.getFormValue(this.getFormRulesTitle(item));
      });
      this.personList = roleForm.map((item, index) => {
        item.roleFormRules = getFormRules(
          this,
          roleTypes[index],
          contracTypeForm
        ).map((item2, index2) => {
          return this.getPersonFormValue(
            this.getFormRulesTitle(item2),
            index2,
            roleTypes[index],
            index
          );
        });
        return Object.assign({}, item, { roleType: roleTypes[index] });
      });
    },
    getPersonFormValue(item2, index2, roleType, index) {
      let conContractPersonTableEntityDto =
        this.contractRowInfo &&
        this.contractRowInfo.conContractPersonTableEntityDtos &&
        this.contractRowInfo.conContractPersonTableEntityDtos.filter(
          el => el.roleType == roleType
        )[0];
      if (!conContractPersonTableEntityDto) return {};
      if (item2.children) {
        item2.children.map((el, elIndex) => {
          let personField = conContractPersonTableEntityDto[el.field];
          if (personField) {
            if (el.field == "registerAddress") {
              item2.value = personField;
            } else {
              item2.value = personField;
            }
          }
        });
      } else {
        this.setShowField(item2);
        item2.value = conContractPersonTableEntityDto[item2.field];
      }
      this.setTimeValue(item2);
      this.setAddress(item2);
      this.setMoney(item2);
      return item2;
    },
    setShowField(item2) {
      if (this.controlField.showfield.includes(item2.field)) {
        item2.type = "input";
      } else if (this.controlField.hiddenfield.includes(item2.field)) {
        item2.type = "hidden";
      }
    },
    setTimeValue(item) {
      if (
        ("" + item.field).endsWith("Date") ||
        ("" + item.title).endsWith("期限")
      ) {
        if (Array.isArray(item.value)) {
          item.value = `${Vue.filter("filterTimestamp")(
            item.value[0],
            "YYYY-MM-DD"
          )}-${Vue.filter("filterTimestamp")(item.value[1], "YYYY-MM-DD")}`;
        } else {
          item.value =
            Vue.filter("filterTimestamp")(item.value, "YYYY-MM-DD") ||
            item.value;
        }
      }
    },
    setMoney(item) {
      if (this.moneyMap.includes(this.getFormRulesTitle(item).field)) {
        item.value = thousandSeparator(item.value) + "元";
      }
    },
    setAddress(item) {
      if (this.addressMap.includes(this.getFormRulesTitle(item).field)) {
        item.value = queryChinaRegionByIds(item.value);
      }
    },
    getFormValue(item) {
      
      if (
        this.contractRowInfo.hasOwnProperty(item.field) &&
        item.field != "disputeResolution" &&
        item.field != "rentAdjustType"
      ) {
        item.value = this.contractRowInfo && this.contractRowInfo[item.field];
      } else {
        const content =
          this.contractRowInfo.content &&
          JSON.parse(this.contractRowInfo.content);
        if (("" + item.type).startsWith("custom-")) {
          if (item.field == "paymentConditions") {
            item.value = content.paymentConditions_value;
            if (content.hasOwnProperty("paymentConditions_t1")) {
              item.input = content.paymentConditions_t1;
            }
          } else if (item.type == "custom-radio-group") {
            item.value = {
              radio2: content[`${item.field}_radio2`],
              radio: content[`${item.field}_radio`],
              t1: content[`${item.field}_t1`],
              t2: content[`${item.field}_t2`]
            };
          } else {
            item.value = content[item.field];
          }
        } else {
          item.value = content[item.field];
        }
      }
      if (
        this.contractRowInfo.conQuotationDto &&
        this.contractRowInfo.conQuotationDto[item.field]
      ) {
        item.value = this.contractRowInfo.conQuotationDto[item.field];
      }
      this.setShowField(item);
      if (!item.children) {
        this.setTimeValue(item);
        this.setAddress(item);
        this.setMoney(item);
      }
      return item;
    },
    getFormRulesTitle(formRules) {
      if (typeof formRules === "undefined") return;

      if (formRules.hasOwnProperty("field")) {
        // 判断递归结束条件
        returnedItem = formRules;
      } else if (!formRules.hasOwnProperty("field")) {
        // 判断chlidren是否有数据
        this.getFormRulesTitle(formRules.children[0]); // 递归调用
      }
      return returnedItem;
    }
  }
};
</script>

<style lang='scss' scoped>
h4 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  color: #5b6377;
}
</style>
