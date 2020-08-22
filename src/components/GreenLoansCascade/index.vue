<template>
  <el-cascader filterable v-bind="$attrsAll" v-on="$listeners" />
</template>

<script>
import greenLoans from 'utils/green-loans.min.js'
export default {
  inheritAttrs: false,
  props: ['value'],
  data() {
    return {}
  },
  computed: {
    $attrsAll() {
      return {
        options: this.formatData(),
        ...this.$attrs,
        value: this.value
      }
    }
  },
  methods: {
    formatData() {
      const ret = Object.entries(greenLoans['All']).map(([value, label]) => {
        return {
          value,
          label
        }
      })
      function getChildren(value) {
        return Object.entries(greenLoans[value]).map(([key, val]) => {
          return {
            value: key,
            label: val,
            ...!!greenLoans[key] && { children: getChildren(key) }
          }
        })
      }
      ret.forEach(item => {
        if (greenLoans[item.value]) {
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
