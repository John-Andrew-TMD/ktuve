<template>
  <!-- 文本框 + 文本 -->
  <el-form v-bind="$attrs" class="comp-contract-item-form" :model="formModel" :inline="true">
    <div v-for="(oItem,index) in options" :key="index">
      <span v-for="(item,idx) in oItem" :key="idx">
        <el-form-item
          :prop="item.field"
          :rules="[{ required: isRequired, message: ' ', trigger: 'blur' }]"
          v-if="typeof item == 'object'"
        >
          <template v-if="item.type === 'select'">
            <el-select
              class="custom-group-item"
              size="mini"
              v-bind="item.props"
              :style="item.style"
              @change="handleBlur"
              v-model.trim="formModel[item.field]"
            >
              <el-option
                v-for="item in item.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
          <template v-else-if="item.type === 'number-input'">
            <number-input
              class="custom-group-item"
              size="mini"
              v-bind="item.props"
              :style="item.style"
              @blur="handleBlur(item.field)"
              @change="handleChange(formModel[item.field],item)"
              v-model.trim="formModel[item.field]"
            />
          </template>
          <template v-else-if="item.type === 'date-picker'">
            <el-date-picker
              class="custom-group-item"
              size="mini"
              v-bind="item.props"
              :style="item.style"
              @blur="handleBlur(item.field)"
              v-model.trim="formModel[item.field]"
            />
          </template>
          <template v-else>
            <el-input
              class="custom-group-item"
              size="mini"
              v-bind="item.props"
              :style="item.style"
              @blur="handleBlur(item.field)"
              v-model.trim="formModel[item.field]"
            />
          </template>
        </el-form-item>
        <template v-else>{{item}}</template>
      </span>
    </div>
  </el-form>
</template>

<script>
import { isEmptyObj, amountDisplayedByChinese } from 'utils'
export default {
  inheritAttrs: false,
  data() {
    return {
      formModel: {}
    }
  },
  props: {
    value: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
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
      this.formModel = Object.assign({}, this.formModel, newVal)
      const valid = this.validateForm()
      if (!valid) {
        this.$emit('input', '')
        return
      }
    }
  },
  created() {
    this.initForm()
  },
  methods: {
    initForm() {
      this.formModel = this.getFormField()
      this.setValue()
    },
    setValue() {
      const valid = this.validateForm()
      if (!valid) {
        this.$emit('input', '')
        return
      } else {
        this.$parent.resetField()
        this.$emit('input', this.formModel)
      }
    },
    relatedField() {
      for (let i = 0; i < this.fieldMap.length; i++) {
        const item = this.fieldMap[i]
        if (item.hasOwnProperty('props')) {
          if (item.props.related) {
            const value = this.formModel[item.field]
            this.formModel[item.props.related] = amountDisplayedByChinese(value || value == 0 ? value : '')
          }
        }
      }
    },
    validateForm() {
      this.relatedField()
      if (!this.isRequired) return true
      for (let i = 0; i < this.fieldMap.length; i++) {
        const item = this.fieldMap[i]
        if (item.hasOwnProperty('props')) {
          if (item.props.required && !this.formModel[item.field]) {
            return
          }
        }
      }
      return true
    },
    handleBlur(key) {
      this.setValue()
    },
    handleChange(val, item) {
      this.setValue()
    },
    getFormField() {
      const obj = {}
      const value = this.value && !isEmptyObj(this.value) ? this.value : null
      this.fieldMap.forEach(item => {
        const key = item.field
        obj[key] = value ? value[key] : ''
      })
      return obj
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
    fieldMap() {
      const tempArr = []
      this.options.forEach(item => {
        if (Array.isArray(item)) {
          item.forEach(fItem => {
            if (typeof fItem === 'object') {
              tempArr.push(fItem)
            }
          })
        }
      })
      return tempArr
    }
  }
}
</script>
