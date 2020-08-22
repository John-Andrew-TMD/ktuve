<template>
  <el-cascader filterable v-bind="$attrsAll" v-on="$listeners" />
</template>

<script>
import industries from 'utils/GBT4754-2017.min.js'
export default {
  inheritAttrs: false,
  props: ['value', 'disabled'],
  data() {
    return {}
  },
  computed: {
    $attrsAll() {
      return {
        options: this.formatData(),
        ...this.$attrs,
        value: this.value,
        disabled: this.disabled
      }
    }
  },
  methods: {
    formatData() {
      const ret = Object.entries(industries['All']).map(([value, label]) => {
        return {
          value,
          label
        }
      })
      function getChildren(value) {
        return Object.entries(industries[value]).map(([key, val]) => {
          return {
            value: key,
            label: val,
            ...!!industries[key] && { children: getChildren(key) }
          }
        })
      }
      ret.forEach(item => {
        if (industries[item.value]) {
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
