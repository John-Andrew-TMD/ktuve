<template>
  <table border="0" cellpadding="0" cellspacing="0">
    <template v-for="(item,index,key) in formRules">
      <tr v-if="getFormRulesTitle(item).type!='hidden'" :key="key">
        <template
          v-if="(''+getFormRulesTitle(item).type).startsWith('custom-')||(''+getFormRulesTitle(item).type).startsWith('dispute-')"
        >
          <th width="150"  v-if = "getFormRulesTitle(item).type!='custom-guarantee-list'">{{getFormRulesTitle(item).title}}：</th>
          <td :colspan="(getFormRulesTitle(item).type!='custom-guarantee-list')?1:2">
            <h4  v-if = "getFormRulesTitle(item).type=='custom-guarantee-list'">{{getFormRulesTitle(item).title}}：</h4>
            <contract-components
              :contractRowInfo="contractRowInfo"
              :otherFormItem="getFormRulesTitle(item)"
            ></contract-components>
          </td>
        </template>
        <template v-else-if="item.type=='radio'">
          <th width="150">{{getFormRulesTitle(item).title}}：</th>
          <td>{{getValueByRadio(item) }}</td>
        </template>
        <template v-else>
          <template v-if="getFormRulesTitle(item).children">
            <th width="150">{{getFormRulesTitle(item).title}}：</th>
            <td>
              <contract-components
                :contractRowInfo="contractRowInfo"
                :otherFormItem="getFormRulesTitle(item)"
              ></contract-components>
            </td>
          </template>
          <template v-else>
            <template v-if="addressMap.includes(getFormRulesTitle(item).field)">
              <th width="150">{{getFormRulesTitle(item).title}}:</th>
              <td>{{queryChinaRegionByIds(item.value)}}</td>
            </template>
            <template v-else>
              <th width="150">{{getFormRulesTitle(item).title}}：</th>
              <td>{{getFormRulesTitle(item).value}}</td>
            </template>
          </template>
        </template>
      </tr>
    </template>
  </table>
</template>

<script>
let returnedItem = [];
import { queryChinaRegionByIds, deepAssign } from "utils";
export default {
  components: {
    contractComponents: () => import("./contract-components.vue")
  },
  props: {
    contractRowInfo: {
      type: Object,
      default: {}
    },
    formRules: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      queryChinaRegionByIds,
      addressMap: ["officeAddress", "registerAddress", "equipmentLocation"]
    };
  },
  created() {},
  methods: {
    getValueByRadio(item) {
      if (!this.getFormRulesTitle(item).value) {
        return this.getFormRulesTitle(item).options[0].label;
      } else {
        let formRules = this.getFormRulesTitle(item).options.filter(
          el => el.value == this.getFormRulesTitle(item).value
        )[0];
        if (formRules) {
          return formRules.label;
        } else {
          return this.getFormRulesTitle(item).options[0].label;
        }
      }
    },

    getFormRulesTitle(formRules) {
      if (typeof formRules == "undefined") return;

      if (formRules.hasOwnProperty("field")) {
        //判断递归结束条件
        returnedItem = formRules;
      } else if (!formRules.hasOwnProperty("field")) {
        //判断chlidren是否有数据
        this.getFormRulesTitle(formRules.children[0]); //递归调用
      }
      return returnedItem;
    }
  }
};
</script>

<style lang="scss">

</style>
