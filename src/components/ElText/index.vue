<template>
  <div class="el-custom-text" :style="{ color: color }">
    <span @click="handleTextClick" :class="{ 'link-type': type === 'link'}">{{ formattedValue }}</span>
    <span v-if="$slots.append">
      <slot name="append" />
    </span>
  </div>
</template>

<script>
import { decimalsFormat, thousandSeparator, dateFormatBySeparator, timestampFormat, queryDictValue, queryChinaRegionByIds } from 'utils'
export default {
  name: 'ElCustomText',
  components: {
  },
  props: {
    value: [String, Number],
    type: {
      type: String,
      default: 'text'
    },
    dictNo: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    needFormat: {
      type: Boolean,
      default: true
    },
    // 最大精度
    maxDecimal: {
      type: Number,
      default: 2
    },
    // 最小精度
    minDecimal: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {

    }
  },
  computed: {
    formattedValue() {
      return this.formatValue()
    }
  },
  methods: {
    formatValue() {
      let tempValue = this.value
      switch (this.type) {
        case 'number':
          if (tempValue === '' || tempValue == null) return tempValue
          if (this.needFormat) {
            tempValue = thousandSeparator(tempValue, this.maxDecimal)
          } else {
            tempValue = decimalsFormat(tempValue, this.minDecimal, this.maxDecimal)
          }
          break
        case 'date':
          tempValue = dateFormatBySeparator(tempValue)
          break
        case 'timestamp':
          tempValue = timestampFormat(tempValue)
          break
        case 'address':
          tempValue = queryChinaRegionByIds(tempValue, '-')
          break
        case 'dict':
          if (this.dictNo) {
            tempValue = queryDictValue(this.dictNo, tempValue)
          }
          break
      }
      return tempValue
    },
    handleTextClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang='scss'>

</style>
