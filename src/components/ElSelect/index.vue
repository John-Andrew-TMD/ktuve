<template>
  <el-select
    v-model.trim="selectValue"
    v-bind="$attrsAll"
    :loading="loading"
    :remote-method="handleFetchSuggestion"
    @change="handleSelectChange"
    @visible-change="handleVisibleChange"
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      <p class="el-select-title" :title="item.label" v-html="item.display" />
    </el-option>
  </el-select>
</template>

<script>
import { html2Escape, isEmptyObj, deepAssign } from 'utils'
import { requestPost } from 'utils/fetch.js'
export default {
  inheritAttrs: false,
  props: {
    params: {
      type: Object,
      default: () => {}
    },
    remote: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    value: [String, Number]
  },
  data() {
    return {
      selectValue: '',
      options: [],
      optionsCopy: [], // 数据备份
      loading: false,
      selectedData: null // 当前选中的数据对象
    }
  },
  computed: {
    $attrsAll() {
      return {
        ...this.$attrs,
        ...(this.remote && {
          remote: true,
          'remote-method': this.handleFetchSuggestion
        }),
        ...(this.filterable && {
          filterable: true,
          'filter-method': this.handleDataFilter
        })
      }
    }
  },
  watch: {
    selectValue(val) {
      this.$emit('input', val)
    },
    value: {
      handler(val) {
        this.selectValue = val
      },
      immediate: true
    },
    params: {
      handler(newObj) {
        if (isEmptyObj(newObj) || this.remote) return
        this.getDataLists(newObj)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getDataLists(params) {
      const { url = '', data = {}} = params
      if (url) {
        requestPost(url, {
          ...data,
          pageSize: 10000,
          pageCurrent: 1
        })
          .then(res => {
            if (res.data && Array.isArray(res.data.records) && res.data.records.length) {
              this.setOptionData(params, res.data.records)
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.setOptionData(params)
      }
    },
    setOptionData(params, arrayData) {
      const { labelKey = 'label', valueKey = 'value', repeat = true, autoSelect = false, options = [], dataCallback } = params
      const record = arrayData || options
      if (record.length) {
        let ret = (dataCallback && dataCallback(record)) || record
        if (!repeat) {
          ret = ret.reduce((prev, cur) => {
            prev.some(item => item[labelKey] === cur[labelKey]) || prev.push(cur)
            return prev
          }, [])
        }
        ret = ret.map(item => {
          return {
            label: (typeof labelKey === 'function') ? labelKey(item) : item[labelKey],
            value: item[valueKey],
            display: (typeof labelKey === 'function') ? labelKey(item) : item[labelKey],
            data: item
          }
        })
        this.options = ret
        if (autoSelect) {
          this.handleSelectChange(ret[0].value)
          this.$emit('input', ret[0].value)
        }
        this.optionsCopy = deepAssign([], ret)
      } else {
        this.options = []
      }
    },
    handleFetchSuggestion(queryString) {
      /**
       * url 请求路径
       * data 请求参数
       * searchKey 请求参数中模糊搜索key
       * labelKey 下拉列表label
       * valueKey 下拉列表value
       * repeat 数据是否可重复，默认：是
       * dataCallback 数据预处理方法
       */
      const {
        url = '',
        data = {},
        ext = {},
        searchKey = '',
        labelKey = 'label',
        valueKey = 'value',
        repeat = true,
        dataCallback
      } = this.params
      this.loading = true
      requestPost(url, {
        ...data,
        ...(searchKey && {
          [searchKey]: queryString
        }),
        pageSize: 10000,
        pageCurrent: 1
      })
        .then(res => {
          if (res.data.records.length) {
            const record = res.data.records
            let ret = (dataCallback && dataCallback(record)) || record
            if (!repeat) {
              ret = ret.reduce((prev, cur) => {
                prev.some(item => item[labelKey] === cur[labelKey]) || prev.push(cur)
                return prev
              }, [])
            }
            ret = ret.map(item => {
              return {
                label: item[labelKey],
                value: item[valueKey],
                display:
                  (!!queryString &&
                    html2Escape(item[labelKey] + '').replace(
                      new RegExp(queryString, 'gi'),
                      word => `<b class="red">${word}</b>`
                    )) ||
                  item[labelKey],
                data: item.data
              }
            })
            this.options = ret
          } else {
            this.options = []
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleDataFilter(val) {
      if (val !== '') {
        let ret = this.options.filter(item => {
          const reg = new RegExp(val, 'gi')
          return reg.test(item.label)
        })
        ret = ret.map(item => {
          return {
            label: item.label,
            value: item.value,
            display:
              (!!val &&
                html2Escape(item.label + '').replace(new RegExp(val, 'gi'), word => `<b class="red">${word}</b>`)) ||
              item.label,
            data: item.data
          }
        })
        this.options = ret
      } else {
        this.options = this.optionsCopy
      }
    },
    handleSelectChange(val) {
      const label = []
      if (Array.isArray(val) && val.length) {
        val.forEach(i => {
          this.options.forEach(j => {
            if (j.value == i) {
              label.push(j.label)
            }
          })
        })
      }
      const dataObj = this.options.filter(item => item.value === val)[0] || {}
      this.$emit('change', {
        label: label,
        value: val,
        data: dataObj.data || {}
      })
    },
    handleVisibleChange(flag) {
      if (flag) {
        if (this.options.length !== this.optionsCopy.length) {
          this.options = this.optionsCopy
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.el-select-title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  & /deep/ .red {
    font-weight: normal;
    color: #FF0000;
  }
}

</style>
