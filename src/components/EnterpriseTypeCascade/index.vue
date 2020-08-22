<template>
  <el-cascader :props="{ checkStrictly: true }" :show-all-levels="false" filterable v-bind="$attrsAll" v-on="$listeners" />
</template>

<script>
import enterpriseData from 'utils/enterprise-type.min.js'
export default {
  inheritAttrs: false,
  props: ['value'],
  data() {
    return {}
  },
  computed: {
    $attrsAll() {
      const val = (this.value || '') + ''
      let newVal = val
      if (val && !Array.isArray(val.split(','))) {
        if (val.substring(1) === '000') {
          newVal = [val]
        } else if (val.substring(2) === '00') {
          newVal = [val.substring(0, 1) + '000', val]
        } else if (val.substring(3) === '0') {
          newVal = [val.substring(0, 1) + '000', val.substring(0, 2) + '00', val]
        } else {
          newVal = [val.substring(0, 1) + '000', val.substring(0, 2) + '00', val.substring(0, 3) + '0', val]
        }
      }
      return {
        options: this.formatData(),
        ...this.$attrs,
        value: newVal
      }
    }
  },
  methods: {
    formatData() {
      const ret = Object.entries(enterpriseData['All']).map(([value, label]) => {
        return {
          value,
          label
        }
      })
      function getChildren(value) {
        return Object.entries(enterpriseData[value]).map(([key, val]) => {
          return {
            value: key,
            label: val,
            ...!!enterpriseData[key] && { children: getChildren(key) }
          }
        })
      }
      ret.forEach(item => {
        if (enterpriseData[item.value]) {
          item.children = getChildren(item.value)
        }
      })
      return Object.freeze(ret)
    }
  }
}
</script>

<style lang='scss'>
</style>
