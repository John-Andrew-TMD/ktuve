<template>
  <!-- 单选 + 文本 -->
  <el-form
    class="comp-contract-item-form comp-contract-radio-form"
    :model="formModel"
    :inline="true"
  >
    <el-form-item
      :prop="radioKey"
      :rules="[{ required: isRequired, message: ' ', trigger: 'change' }]"
    >
      <div v-for="(firstItem,fIndex) in options" :key="fIndex">
        <el-radio-group
          v-if="isRadio(firstItem)"
          v-model="formModel[firstItem.field]"
          :class="{'radio-child-group':firstItem.level == 2}"
          v-bind="firstItem.props"
          @change="setValue"
        >
          <el-radio v-for="(item,index) in firstItem.options" :label="item.value" :key="index">
            <template v-if="Array.isArray(item.label)">
              <span v-for="(cItem,idx) in item.label" :key="idx">
                <template v-if="typeof cItem == 'object'">
                  <number-input
                    v-if="cItem.type === 'number-input'"
                    class="custom-group-item"
                    size="mini"
                    v-bind="cItem.props"
                    :style="cItem.style"
                    @blur="setValue"
                    v-model.trim="formModel[cItem.field]"
                  />
                  <el-input
                    v-else
                    class="custom-group-item"
                    size="mini"
                    v-bind="cItem.props"
                    v-model="formModel[cItem.field]"
                    @blur="setValue"
                  />
                </template>
                <template v-else>{{cItem}}</template>
              </span>
            </template>
            <template v-else>{{ item.label }}</template>
          </el-radio>
        </el-radio-group>
        <div v-else>
          <span v-for="(item,index) in firstItem" :key="index">
            <template v-if="typeof item === 'object'">
              <number-input
                v-if="item.type === 'number-input'"
                class="custom-group-item"
                size="mini"
                v-bind="item.props"
                :style="item.style"
                @blur="setValue"
                v-model.trim="formModel[item.field]"
              />
              <el-input
                v-else
                class="custom-group-item"
                v-bind="item.props"
                v-model="formModel[item.field]"
                @blur="setValue"
              />
            </template>
            <template v-else>{{item}}</template>
          </span>
        </div>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { isEmptyObj } from 'utils'
export default {
  inheritAttrs: false,
  data() {
    return {
      formModel: {},
      radioKey: '',
      childKey: ''
    }
  },
  props: {
    value: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: () => {}
    },
    validate: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    value(newVal) {
      if (!newVal) return
      this.formModel = Object.assign({}, this.formModel, newVal)
      this.setChildDisabled()
      const valid = this.validForm()
      if (!valid) {
        this.$emit('input', '')
      }
    }
  },
  created() {
    this.initForm()
  },
  methods: {
    initForm() {
      this.formModel = this.getFormField()
      this.setChildDisabled()
      this.setValue()
    },
    validForm() {
      if (!this.isRequired) {
        return true
      } else {
        for (let i = 0; i < this.options.length; i++) {
          const item = this.options[i]
          if (Array.isArray(item)) {
            for (let j = 0; j < item.length; j++) {
              const tempItem = item[j]
              if (typeof tempItem === 'object' && tempItem.hasOwnProperty('props')) {
                if (tempItem.props.required && !this.formModel[tempItem.field]) {
                  return
                }
              }
            }
          } else if (typeof item === 'object' && item.type === 'radio') {
            const valid = this.validRadioForm(item)
            if (valid) {
              continue
            } else {
              return
            }
          }
        }
        return true
      }
    },
    validRadioForm(item) {
      const { field, options } = item
      const val = this.formModel[field]
      const fieldArr = this.radioValueObj(options)[val]
      if (fieldArr && fieldArr.length) {
        const valid = this.isEmptyValue(fieldArr, val)
        if (!valid) return
      }
      return true
    },
    // 根据options提取字段名及赋值
    getFormField() {
      const value = this.value && !isEmptyObj(this.value) ? this.value : null
      let obj = {}
      this.options.forEach((fItem, fIndex) => {
        if (typeof fItem === 'object' && fItem.type === 'radio') {
          const key = fItem.field
          obj[key] = value ? (value[key] ? value[key] : '') : ''
          fItem.options.forEach(sItem => {
            if (Array.isArray(sItem.label)) {
              obj = Object.assign({}, obj, this._getFiled(sItem.label, value))
            }
          })
          if (!this.radioKey) {
            this.radioKey = key
            return
          }
          if (this.radioKey && !this.childKey) {
            this.childKey = key
          }
        } else {
          obj = Object.assign({}, obj, this._getFiled(fItem, value))
        }
      })
      return obj
    },
    // 提取字段名
    _getFiled(data, value) {
      const obj = {}
      data.forEach(item => {
        if (typeof item === 'object') {
          const key = item.field
          obj[key] = value ? (value[key] ? value[key] : '') : ''
        }
      })
      return obj
    },
    setChildDisabled() {
      const radioValue = this.formModel[this.radioKey]
      if (!radioValue) return
      this.options.forEach(fItem => {
        if (typeof fItem === 'object' && fItem.type === 'radio') {
          if (fItem.field === this.childKey) {
            if (!fItem.hasOwnProperty('props')) {
              fItem.props = {}
            }
            const disabled = radioValue != fItem.parentValue
            fItem.props.disabled = disabled
            fItem.options.forEach(sItem => {
              if (Array.isArray(sItem.label)) {
                sItem.label.forEach(tItem => {
                  if (typeof tItem === 'object') {
                    if (!tItem.hasOwnProperty('props')) {
                      tItem.props = {}
                    }
                    tItem.props.disabled = disabled
                  }
                })
              }
            })
          }
        }
      })
    },
    setValue() {
      const valid = this.validForm()
      if (!valid) {
        this.$emit('input', '')
      }
      this.$parent.resetField()
      this.$emit('input', this.formModel)
    },
    isEmptyValue(data, val) {
      if (!data) return
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        const value = this.formModel[item]
        if (!value) return
      }
      return true
    },
    // 获取单选值及当前单选所有的字段
    radioValueObj(options = []) {
      let tempOpt = options
      if (!options.length) {
        const obj = this.radioOptions.find(item => +item.level === 1)
        tempOpt = obj.options
      }
      const tempArr = {}
      tempOpt.forEach((item, index) => {
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
  },
  computed: {
    isRequired() {
      if (this.validate.length) {
        const obj = this.validate.find(item => item.required)
        return obj ? obj.required : false
      } else {
        return false
      }
    },
    isRadio() {
      return item => {
        return item && typeof item === 'object' && item.hasOwnProperty('level')
      }
    },
    fieldKey() {
      return item => {
        return typeof item === 'object' && item.level == 2 ? this.childKey : this.radioKey
      }
    },
    radioOptions() {
      return this.options.filter(item => typeof item === 'object' && item.type === 'radio')
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-contract-radio-form {
  .radio-child-group {
    padding-left: 24px;
  }
  /deep/ .el-radio__input.is-disabled + span.el-radio__label {
    color: #606266;
  }
}
</style>
