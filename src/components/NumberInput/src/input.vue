<template>
  <div
    :class="[
      'el-input',
      'el-number-input',
      inputSize ? 'el-input--' + inputSize : '',
      {
        'is-disabled': inputDisabled,
        'is-exceed': inputExceed,
        'el-input-group': $slots.prepend || $slots.append,
        'el-input-group--append': $slots.append,
        'el-input-group--prepend': $slots.prepend,
        'el-input--prefix': $slots.prefix || prefixIcon,
        'el-input--suffix': $slots.suffix || suffixIcon || clearable
      }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >

    <!-- 前置元素 -->
    <div v-if="$slots.prepend" class="el-input-group__prepend">
      <slot name="prepend" />
    </div>
    <el-tooltip
      v-model="toolTipVisibleStatus"
      effect="dark"
      :content="tipContent"
      placement="top-start"
      :disabled="!showChineseAmount"
      :manual="true"
    >
      <input
        ref="input"
        :tabindex="tabindex"
        class="el-input__inner"
        v-bind="$attrs"
        type="text"
        :disabled="inputDisabled"
        :readonly="readonly"
        autocomplete="off"
        :maxlength="maxlength"
        :style="{textAlign: textDirection}"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        @dragenter="handleDrag"
      >
    </el-tooltip>
    <!-- 前置内容 -->
    <span v-if="$slots.prefix || prefixIcon" class="el-input__prefix">
      <slot name="prefix" />
      <i
        v-if="prefixIcon"
        class="el-input__icon"
        :class="prefixIcon"
      />
    </span>
    <!-- 后置内容 -->
    <span
      v-if="getSuffixVisible()"
      class="el-input__suffix"
    >
      <span class="el-input__suffix-inner">
        <template v-if="!showClear || !isWordLimitVisible">
          <slot name="suffix" />
          <i
            v-if="suffixIcon"
            class="el-input__icon"
            :class="suffixIcon"
          />
        </template>
        <i
          v-if="showClear"
          class="el-input__icon el-icon-circle-close el-input__clear"
          @click="clear"
        />
        <span v-if="isWordLimitVisible" class="el-input__count">
          <span class="el-input__count-inner">
            {{ textLength }}/{{ upperLimit }}
          </span>
        </span>
      </span>
      <i
        v-if="validateState"
        class="el-input__icon"
        :class="['el-input__validateIcon', validateIcon]"
      />
    </span>
    <!-- 后置元素 -->
    <div v-if="$slots.append" class="el-input-group__append">
      <slot name="append" />
    </div>
  </div>
</template>
<script>
import emitter from './emitter'
import Migrating from './migrating'
import { decimalsFormat, thousandSeparator, amountDisplayedByChinese } from 'utils'
export default {
  name: 'ElInputCustom',

  componentName: 'ElInputCustom',

  mixins: [emitter, Migrating],

  inheritAttrs: false,

  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },

  props: {
    value: [String, Number],
    maxlength: [String, Number],
    size: String,
    disabled: Boolean,
    readonly: Boolean,
    validateEvent: {
      type: Boolean,
      default: true
    },
    suffixIcon: String,
    prefixIcon: String,
    clearable: {
      type: Boolean,
      default: false
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    tabindex: String,
    // 是否千分位处理
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
    },
    // 最大值
    maxValue: {
      type: Number,
      default: 999999999999.99
    },
    // 最小值
    minValue: {
      type: Number,
      default: 0
    },
    // 是否显示中文金额
    showChineseAmount: {
      type: Boolean,
      default: false
    },
    // 文字方向
    textDirection: {
      type: String,
      default: 'left'
    },
    // 允许负数
    allowMinus: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      hovering: false,
      focused: false,
      isComposing: false,
      tipContent: '',
      showToolTip: false
    }
  },
  computed: {
    toolTipVisibleStatus: {
      get() {
        return !!this.tipContent.length && this.showToolTip
      },
      set(val) {

      }
    },
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize
    },
    validateState() {
      return this.elFormItem ? this.elFormItem.validateState : ''
    },
    needStatusIcon() {
      return this.elForm ? this.elForm.statusIcon : false
    },
    validateIcon() {
      return {
        validating: 'el-icon-loading',
        success: 'el-icon-circle-check',
        error: 'el-icon-circle-close'
      }[this.validateState]
    },
    inputSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size
    },
    inputDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    },
    nativeInputValue() {
      return this.value == undefined ? '' : String(this.value)
    },
    showClear() {
      return this.clearable &&
          !this.inputDisabled &&
          !this.readonly &&
          this.nativeInputValue &&
          (this.focused || this.hovering)
    },

    isWordLimitVisible() {
      return this.showWordLimit &&
          this.$attrs.maxlength &&
          (this.type === 'text') &&
          !this.inputDisabled &&
          !this.readonly &&
          !this.showPassword
    },
    upperLimit() {
      return this.$attrs.maxlength
    },
    textLength() {
      if (typeof this.value === 'number') {
        return String(this.value).length
      }

      return (this.value || '').length
    },
    inputExceed() {
      // show exceed style if length of initial value greater then maxlength
      return this.isWordLimitVisible &&
          (this.textLength > this.upperLimit)
    },
    _minValue() {
      const minValue = this.minValue
      const minusMinValue = minValue < 0 ? minValue : -999999999999.99
      const plusMinValue = minValue >= 0 ? minValue : 0
      return this.allowMinus ? minusMinValue : plusMinValue
    }
  },

  watch: {
    value(val) {
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [val])
      }
    },
    // native input value is set explicitly
    // do not use v-model / :value in template
    // see: https://github.com/ElemeFE/element/issues/14521
    nativeInputValue() {
      this.setNativeInputValue()
    },
    // when change between <input> and <textarea>,
    // update DOM dependent value and styles
    // https://github.com/ElemeFE/element/issues/14857
    type() {
      this.$nextTick(() => {
        this.setNativeInputValue()
        this.updateIconOffset()
      })
    }
  },
  created() {
    this.$on('inputSelect', this.select)
    this.numberReg = new RegExp(`^-?((0|[1-9]\\d{0,11})(\\.\\d{0,${this.maxDecimal}})?)?$`)
    this.legalNumberReg = /^-?(0|[1-9]\d*)(\.\d*)?$/
  },
  mounted() {
    this.setNativeInputValue()
    this.updateIconOffset()
  },
  updated() {
    this.$nextTick(this.updateIconOffset)
  },

  methods: {
    focus() {
      this.getInput().focus()
    },
    blur() {
      this.getInput().blur()
    },
    getMigratingConfig() {
      return {
        props: {
          'icon': 'icon is removed, use suffix-icon / prefix-icon instead.',
          'on-icon-click': 'on-icon-click is removed.'
        },
        events: {
          'click': 'click is removed.'
        }
      }
    },
    handleDrag() {
      return false
    },
    // handleKeyPress(e) {
    //   const target = e.target
    //   //const keyCode = browser.isIE ? e.keyCode : e.which
    //   const key = e.key || String.fromCharCode(keyCode)
    //   let inputValue = target.value
    //   // 8 backSpace 37 leftArrow 39 rightArrow 46 delete 188 逗号 109 189 减号
    //   // if([8, 37, 39, 46, 188].includes(keyCode)) {
    //   //   return
    //   // }

    //   let selectText
    //   if(document.selection) {
    //     let selecter = document.selection.createRange()
    //     selectText = selecter.text
    //   } else {
    //     let selecter = window.getSelection()
    //     selectText = selecter.toString()
    //   }

    //   if((selectText+'').length) return

    //   if(!/^\-|\d|\./.test(key) || (key === '.' && inputValue.includes('.')) || (key === '-' && inputValue.includes('-'))) {
    //       e.preventDefault()
    //   } else {
    //     let cursorPos = 0
    //     if(target.selectionStart != null) {
    //       cursorPos = target.selectionStart || 0
    //     } else if(document.selection) {
    //       let selectRange = document.selection.createRange()
    //       selectRange.moveStart('character', -inputValue.length)
    //       cursorPos = selectRange.text.length
    //     }

    //     let arr = inputValue.replace(/,/g, '').split('')
    //     arr.splice(cursorPos, 0, key)
    //     if(!this.numberReg.test(arr.join(''))) {
    //         e.preventDefault()
    //     }
    //   }
    // },
    handleBlur(event) {
      this.showToolTip = false
      const res = this.formatValue()

      // this.$emit('input', res)
      const input = this.getInput()
      input.value = res
      // this.$nextTick(() => {
      this.focused = false
      // })
      this.$emit('blur', event)
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.blur', [this.value])
      }
    },
    formatValue() {
      let tempValue = this.nativeInputValue
      if (!this.legalNumberReg.test(tempValue)) {
        this.tipContent = ''
        return ''
      }
      if (!this.allowMinus) {
        tempValue = tempValue.replace(/\-/g, '')
      }
      if (tempValue > this.maxValue) {
        tempValue = this.maxValue
      } else if (tempValue < this._minValue) {
        tempValue = this._minValue
      }
      this.$emit('input', tempValue)
      if (this.needFormat) {
        tempValue = thousandSeparator(tempValue, this.maxDecimal)
      } else {
        tempValue = decimalsFormat(tempValue, this.minDecimal, this.maxDecimal)
      }
      return tempValue
    },
    select() {
      this.getInput().select()
    },
    setNativeInputValue() {
      const input = this.getInput()
      if (!input) return
      if (input.value === this.nativeInputValue) return
      if (!this.focused) {
        const ret = this.formatValue()
        input.value = ret
        // this.$emit('input', ret)
      } else {
        input.value = this.nativeInputValue
      }
    },
    handleFocus(event) {
      this.focused = true
      this.showToolTip = true
      const input = this.getInput()
      let inputValue = input.value
      if (this.needFormat) {
        inputValue = inputValue.replace(/,/g, '')
        // if (inputValue !== this.nativeInputValue) {
        input.value = inputValue
        // this.$emit('input', inputValue)
        // }
      }
      if (this.showChineseAmount && this.tipContent === '') {
        this.tipContent = amountDisplayedByChinese(inputValue)
      }
      this.$nextTick(() => {
        this.select()
        this.$emit('focus', event)
      })
    },
    // 中文输入法下有效
    handleCompositionStart(e) {
      this.isComposing = true
    },
    handleCompositionEnd(event) {
      this.isComposing = false
      this.handleInput(event)
    },
    handleInput(event) {
      // should not emit input during composition
      // see: https://github.com/ElemeFE/element/issues/10516
      if (this.isComposing) return

      // hack for https://github.com/ElemeFE/element/issues/8548
      // should remove the following line when we don't support IE
      // let inputValue = event.target.value.replace(/[^\d|.|,|-]/g,'')
      const inputValue = event.target.value

      // 检查输入数据的合法性
      if (!this.checkValue(inputValue)) return

      if (inputValue === this.nativeInputValue) return
      this.$emit('input', inputValue)

      // ensure native input value is controlled
      // see: https://github.com/ElemeFE/element/issues/12850
      this.$nextTick(this.setNativeInputValue)
      if (this.showChineseAmount) {
        this.tipContent = amountDisplayedByChinese(inputValue)
      } else {
        this.tipContent = ''
      }
    },
    handleChange(event) {
      this.$emit('change', event.target.value)
    },
    checkValue(val) {
      if (val != '' && (!this.numberReg.test(val) || !this.allowMinus && val === '-')) {
        this.$emit('input', this.nativeInputValue)
        this.$nextTick(this.setNativeInputValue)
        return false
      }
      return true
    },
    calcIconOffset(place) {
      const elList = [].slice.call(this.$el.querySelectorAll(`.el-input__${place}`) || [])
      if (!elList.length) return
      let el = null
      for (let i = 0; i < elList.length; i++) {
        if (elList[i].parentNode === this.$el) {
          el = elList[i]
          break
        }
      }
      if (!el) return
      const pendantMap = {
        suffix: 'append',
        prefix: 'prepend'
      }

      const pendant = pendantMap[place]
      if (this.$slots[pendant]) {
        el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${this.$el.querySelector(`.el-input-group__${pendant}`).offsetWidth}px)`
      } else {
        el.removeAttribute('style')
      }
    },
    updateIconOffset() {
      this.calcIconOffset('prefix')
      this.calcIconOffset('suffix')
    },
    clear() {
      this.$emit('input', '')
      this.$emit('change', '')
      this.$emit('clear')
    },
    getInput() {
      return this.$refs.input
    },
    getSuffixVisible() {
      return this.$slots.suffix ||
          this.suffixIcon ||
          this.showClear ||
          this.showPassword ||
          this.isWordLimitVisible ||
          (this.validateState && this.needStatusIcon)
    }
  }
}
</script>

