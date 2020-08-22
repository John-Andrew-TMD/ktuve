<template>
  <el-form v-bind="$attrs" ref="form" :model="formModel" :inline="true" label-width="0px">
    <el-form-item label="" prop = "bankFlowAmountS">
        <number-input
        v-model="formModel.bankFlowAmountS"
        :allow-minus = "true"
        size="mini"
        @blur="handleBlur('bankFlowAmountS',formModel.bankFlowAmountS)"
      >
         <el-button slot="append" >元</el-button>
      </number-input>
    </el-form-item>
    <div class = "currentAmount-link">-</div>
    <el-form-item label= "" prop = "bankFlowAmountE">
        <number-input
        v-model="formModel.bankFlowAmountE"
        :allow-minus = "true"
        size="mini"
        @blur="handleBlur('bankFlowAmountE',formModel.bankFlowAmountE)"
      >
      <el-button slot="append" >元</el-button>
      </number-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { queryDictItems } from "utils";
export default {
  inheritAttrs: false,
  data() {
    return {
      formModel: {}
    }
  },
  props: {
    value: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: () => []
    },
    validate: {
      type: Array,
      default: () => []
    },
  },
  mounted() {},
  methods: {
    handleBlur(key, parantValue) {
      this.$parent.resetField()
      this.$emit('input', {...this.formModel})
    }
  }
};
</script>

<style lang="scss" scoped>
.currentAmount-link{
    display: inline-block;
    padding-right:10px ;
}
</style>
