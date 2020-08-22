<template>
  <!-- 复选框 + 文本 -->
  <el-form :inline="true" :model="formModel" class="comp-contract-item-form">
    <el-form-item
      :prop="checkboxKey"
      :rules="[{ required: isRequired, message: ' ', trigger: 'change' }]"
    >
      <el-checkbox-group v-model="formModel[checkboxKey]" @change="handleChange">
        <el-checkbox v-for="(item,index) in options" :label="item.value" :key="index">
          {{index+1}}.
          <template v-if="Array.isArray(item.label)">
            <span v-for="(oItem,idx) in item.label" :key="idx">
              <template v-if="typeof oItem == 'object'">
                <el-input
                  class="custom-group-item"
                  size="mini"
                  v-model="formModel[oItem.field]"
                  @change="handleInputChange"
                />
              </template>
              <template v-else>{{oItem}}</template>
            </span>
          </template>
          <template v-else>{{ item.label }}</template>
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>

<script>
import { isEmptyObj, deepAssign } from 'utils'
export default {
  inheritAttrs: false,
  data() {
    return {
      formModel: {},
      checkboxKey: '',
      checkData: []
    }
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Array,
      default: () => []
    },
    validate: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    value(newVal) {
      if (!newVal) return
      this.initForm(newVal)
    }
  },
  created() {
    this.formModel = this.getFormField()
    this.setValue()
  },
  methods: {
    initForm(newVal) {
      const tempData = deepAssign({}, newVal)
      const ckbValue = tempData[this.checkboxKey]
      tempData[this.checkboxKey] = !ckbValue ? [] : ckbValue.split(',')
      this.formModel = Object.assign({}, this.formModel, tempData)
      const valid = this.validForm()
      if (!valid) {
        this.$emit('input', '')
      }
    },
    setValue() {
      const tempData = deepAssign({}, this.formModel)
      tempData[this.checkboxKey] = this.formModel[this.checkboxKey].join(',')
      const valid = this.validForm()
      if (!valid) {
        this.$emit('input', '')
        return
      }
      this.$parent.resetField()
      this.$emit('input', tempData)
    },
    handleChange(val) {
      this.checkData = val
      this.setValue()
    },
    handleInputChange() {
      this.setValue()
    },
    validForm() {
      if (!this.isRequired) {
        return true
      } else {
        const dataArr = this.checkData.length ? this.checkData : this.formModel[this.checkboxKey]
        if (!dataArr.length) return
        const valid = dataArr.every(value => this.isEmptyValue(this.checkboxValueObj[value]))
        if (!valid) return
        return true
      }
    },
    getFormField() {
      const value = this.value && !isEmptyObj(this.value) ? this.value : null
      const tempObj = {}
      this.options.forEach(item => {
        if (Array.isArray(item.label)) {
          item.label.forEach(oItem => {
            if (typeof oItem === 'object') {
              const key = oItem.field
              tempObj[key] = value ? (value[key] ? value[key] : '') : ''
              if (!this.checkboxKey) {
                const arr = key.split('_')
                this.checkboxKey = `${arr[0]}_value`
                tempObj[this.checkboxKey] = value
                  ? value[this.checkboxKey]
                    ? value[this.checkboxKey].split(',')
                    : []
                  : []
              }
            }
          })
        }
      })
      return tempObj
    },
    isEmptyValue(data) {
      if (!data) return
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        const value = this.formModel[item]
        if (!value) return
      }
      return true
    }
  },
  computed: {
    // 是否必填
    isRequired() {
      if (this.validate.length) {
        const obj = this.validate.find(item => item.required)
        return obj ? obj.required : false
      } else {
        return false
      }
    },
    // 获取checkbox每一行value值的字段
    checkboxValueObj() {
      const tempArr = {}
      this.options.forEach((item, index) => {
        tempArr[item.value] = []
        if (Array.isArray(item.label)) {
          item.label.forEach(cItem => {
            if (typeof cItem === 'object') {
              tempArr[index + 1].push(cItem.field)
            }
          })
        }
      })
      return tempArr
    }
  }
}
</script>
