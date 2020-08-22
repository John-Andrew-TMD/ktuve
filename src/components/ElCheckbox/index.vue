<template>
  <el-checkbox-group v-model="checkList">
    <el-checkbox v-for="(item, index) in dataList" :label="item.value" :key="index">{{ item.label }}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
import { requestPost } from 'utils/fetch.js'
export default {
  inheritAttrs: false,
  props: {
    params: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      checkList: [],
      dataList: []
    }
  },
  watch: {
    checkList(val) {
      this.$emit('input', val)
    },
    value: {
      handler(val) {
        this.checkList = val
      },
      immediate: true
    },
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      /**
       * url 请求路径
       * data 请求参数
       * labelKey 下拉列表label
       * valueKey 下拉列表value
       * dataCallback 数据预处理方法
       */
      const { url = '', data = {}, labelKey = 'label', valueKey = 'value',  dataCallback } = this.params

      requestPost(url, data).then(res => {
        if (res.data.records.length) {
          const records = res.data.records
          let ret = dataCallback && dataCallback(records) || records
          ret = ret.map(item => {
            return {
              label: item[labelKey],
              value: item[valueKey],
            }
          })
          this.dataList = ret
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
