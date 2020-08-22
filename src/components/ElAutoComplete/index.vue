<template>
  <el-autocomplete
    v-model.trim="searchValue"
    v-bind="$attrs"
    :fetch-suggestions="handleFetchSuggestion"
    :trigger-on-focus="true"
    :clearable="true"
    v-on="$listeners"
  >
    <template slot-scope="{ item }">
      <p class="autocomplete-title" :title="item.label" v-html="item.display" />
    </template>
  </el-autocomplete>
</template>

<script>
import { html2Escape } from 'utils'
import { requestPost } from 'utils/fetch.js'
export default {
  inheritAttrs: false,
  props: {
    params: {
      type: Object,
      default: () => {}
    },
    value: [String, Number]
  },
  data() {
    return {
      searchValue: '',
      ajaxStack: {}
    }
  },
  watch: {
    searchValue(val) {
      this.$emit('input', val)
    },
    value: {
      handler(val) {
        this.searchValue = val
      },
      immediate: true
    }
  },
  methods: {
    handleFetchSuggestion(queryString, cb) {
      /**
       * url 请求路径
       * data 请求参数
       * searchKey 请求参数中模糊搜索key
       * labelKey 下拉列表label
       * valueKey 下拉列表value
       * repeat 数据是否可重复，默认：是
       * dataCallback 数据预处理方法
       */
      const { url = '', data = {}, searchKey = '', labelKey = 'label', valueKey = 'value', repeat = true, canEmpty = true, disabled = false, dataCallback } = this.params
      this.ajaxStack.reqInstance && this.ajaxStack.reqInstance()

      // 禁用联想搜索|关键字不允许为空
      if (disabled || !canEmpty && (queryString === '' || queryString == null)) {
        cb([])
        return
      }
      let params = {
        ...data,
        ...searchKey && {
          [searchKey]: queryString
        }
      }
      if (url.endsWith('/page')) {
        params = {
          dto: {
            ...data,
            ...searchKey && {
              [searchKey]: queryString
            }
          },
          pageSize: 1000,
          pageCurrent: 1
        }
      }
      requestPost(url, params, { cancelKey: 'reqInstance', ctx: this }).then(res => {
        if (res.data.records.length) {
          const records = res.data.records
          let ret = dataCallback && dataCallback(records) || records
          if (!repeat) {
            ret = ret.reduce((prev, cur) => {
              prev.some(item => item[labelKey] === cur[labelKey]) || (cur[labelKey] && prev.push(cur))
              return prev
            }, [])
          }
          ret = ret.map(item => {
            return {
              label: item[labelKey],
              value: item[valueKey],
              display: html2Escape(item[labelKey] + '').replace(new RegExp(queryString, 'g'), `<b class="red">${queryString}</b>`),
              data: item
            }
          })
          cb(ret)
        } else {
          cb([])
        }
      }).catch(err => {
        cb([])
        console.log(err)
      })
    }
    // handleSelectChange(obj) {
    //   // const dataObj = this.dataList.filter(item => item.value === val)[0] || {}
    //   this.$emit('select', obj)
    // },
    // handleInputChange()
  }
}
</script>

<style lang='scss' scoped>
  .autocomplete-title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    & /deep/ .red {
      font-weight: normal;
      color: #FF0000;
    }
  }

</style>
