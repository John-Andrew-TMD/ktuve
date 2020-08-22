<template>
  <el-cascader v-bind="$attrsAll" v-on="$listeners" />
</template>

<script>
import ChinaAddress from 'utils/china-region-202007.min.js'
export default {
  inheritAttrs: false,
  props: ['value'],
  data() {
    return {}
  },
  computed: {
    $attrsAll() {
      return {
        options: this.formatAddressData(),
        ...this.$attrs,
        props: {
          checkStrictly: this.$attrs['check-strictly'] === 'true'
        },
        value: this.value
      }
    }
  },
  methods: {
    formatAddressData() {
      const addressData = Object.keys(ChinaAddress['86']).map(key => {
        return {
          value: key,
          label: ChinaAddress['86'][key]
        }
      })
      addressData.forEach(province => {
        const provinceKey = province.value
        if (ChinaAddress[provinceKey]) {
          const citys = Object.keys(ChinaAddress[provinceKey]).map(cityKey => {
            let counties = []
            if (ChinaAddress[cityKey]) {
              counties = Object.keys(ChinaAddress[cityKey]).map(countyKey => {
                return {
                  value: countyKey,
                  label: ChinaAddress[cityKey][countyKey]
                }
              })
            }
            return {
              value: cityKey,
              label: ChinaAddress[provinceKey][cityKey],
              ...counties.length && { children: counties }
            }
          })
          if (provinceKey !== '710000') {
            province.children = citys
          }
        }
      })
      return Object.freeze(addressData)
    }
  }
}
</script>

<style lang='scss'>
</style>
