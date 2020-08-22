import {
  validateMobilephone,
  validateTelphone,
  validateIdCard,
  validAlphabets,
  validateIPAddress,
  validatePostCode,
  validteSocialCreditCode,
  validateTaiWanIdCard,
  validateGangAoIdCard
} from './validate'
/* 验证手机号码*/
const isValidateMobilephone = (rule, val, cb) => {
  if (val) {
    if (!validateMobilephone(val)) {
      cb(new Error(rule.message))
    } else {
      cb()
    }
  } else {
    cb()
  }
}

/* 验证固定电话*/
const isValidateTelphone = (rule, val, cb) => {
  if (val) {
    if (!validateTelphone(val)) {
      cb(new Error(rule.message))
    } else {
      cb()
    }
  } else {
    cb()
  }
}

/* 验证固定电话或者手机号码*/
const isValidateTelphoneOrMobile = (rule, val, cb) => {
  if (val) {
    if (!validateTelphone(val) && !validateMobilephone(val)) {
      cb(new Error(rule.message))
    } else {
      cb()
    }
  } else {
    cb()
  }
}

/* 验证身份证号码（15位，18位）*/
const isValidateIdCard = (rule, val, cb) => {
  if (val) {
    if (!validateIdCard(val)) {
      cb(new Error(rule.message))
    } else {
      cb()
    }
  } else {
    cb()
  }
}

/* 验证IP地址 */
const isValidateIPAddress = (rule, val, cb, ...aaa) => {
  if (val) {
    if (!validateIPAddress(val)) {
      cb(new Error(rule.message))
    } else {
      cb()
    }
  } else {
    cb()
  }
}

/* 验证邮编 */
const isValidatePostCode = (rule, val, cb) => {
  if (val) {
    if (!validatePostCode(val)) {
      cb(new Error(rule.message))
    } else {
      cb()
    }
  } else {
    cb()
  }
}

/* 验证数值范围 */
const isValidateRange = (rule, val, cb) => {
  if (isNaN(val)) {
    cb(new Error('请输入数字！'))
  } else {
    val = +val
    if (val > rule.maxValue || val < rule.minValue) {
      cb(new Error(rule.message))
    } else {
      cb()
    }
  }
}

/* 验证最小值 */
const isValidateMinValue = (rule, val, cb) => {
  if (isNaN(val)) {
    cb(new Error('请输入数字！'))
  } else {
    if (+val < rule.minValue) {
      cb(new Error(rule.message))
    } else {
      cb()
    }
  }
}

/* 验证最小值 */
const isValidateMaxValue = (rule, val, cb) => {
  if (isNaN(val)) {
    cb(new Error('请输入数字！'))
  } else {
    if (+val > rule.maxValue) {
      cb(new Error(rule.message))
    } else {
      cb()
    }
  }
}

const generalReg = /^[a-zA-Z]{1}[\w\-@\.]*$/
const isValidateGeneral = (rule, val, cb) => {
  if (val) {
    if (!generalReg.test(val)) {
      cb(new Error(rule.message))
    } else {
      cb()
    }
  } else {
    cb()
  }
}

// 自定义正则表达式验证
const isValidateCustomRegexp = (rule, val, cb) => {
  if (val) {
    if (!new RegExp(rule.regexp).test(val)) {
      cb(new Error(rule.message))
    } else {
      cb()
    }
  } else {
    cb()
  }
}

// 只能包含字母
const isValidateAlphabet = (rule, val, cb) => {
  if (val) {
    if (!validAlphabets(val)) {
      cb(new Error(rule.message))
    } else {
      cb()
    }
  } else {
    cb()
  }
}

/* 验证统一社会信用代码 */
const isValidteSocialCreditCode = (rule, val, cb) => {
  if (val) {
    if (!validteSocialCreditCode(val)) {
      cb(new Error(rule.message))
    } else {
      cb()
    }
  } else {
    cb()
  }
}

/* 验证台胞证 */
const isValidteTaiWanIdCard = (rule, val, cb) => {
  if (val) {
    if (!validateTaiWanIdCard(val)) {
      cb(new Error(rule.message))
    } else {
      cb()
    }
  } else {
    cb()
  }
}

/* 验证港澳通行证 */
const isValidteTaiGangAoIdCard = (rule, val, cb) => {
  if (val) {
    if (!validateGangAoIdCard(val)) {
      cb(new Error(rule.message))
    } else {
      cb()
    }
  } else {
    cb()
  }
}

/**
 * 参数 item
 * required true  必填项
 * maxLength  字符串的最大长度
 * min 和 max 必须同时给 min < max  type=number
 * min max 为数值大小
 * type 电话   phone
 *      邮箱   email
 *      身份证 idCard
 *      统一社会信用代码 creditCode
 *
 * */
const formValidate = item => {
  const rules = []
  if (item.required) {
    rules.push({
      required: true,
      message: '必填项不能为空！',
      trigger: ['blur', 'change']
    })
  }
  // if (item.maxLength) {
  //   rules.push({
  //     max: item.maxLength,
  //     message: `最多输入${item.maxLength}个字符！`,
  //     trigger: 'blur'
  //   })
  // }
  if (item.hasOwnProperty('min') && item.hasOwnProperty('max')) {
    rules.push({
      minValue: item.min,
      maxValue: item.max,
      validator: isValidateRange,
      message: item.message || `数值范围须在${item.min} - ${item.max}之间！`,
      transform(val) {
        if(val == null) return ''
        return (val + '').replace(/,/g, '')
      },
      trigger: 'blur'
    })
  } else if (item.hasOwnProperty('min')) {
    rules.push({
      minValue: item.min,
      validator: isValidateMinValue,
      message: item.message || `允许的最小值为${item.min}！`,
      transform(val) {
        if(val == null) return ''
        return (val + '').replace(/,/g, '')
      },
      trigger: 'blur'
    })
  } else if (item.hasOwnProperty('max')) {
    rules.push({
      maxValue: item.max,
      validator: isValidateMaxValue,
      message: item.message || `允许的最大值为${item.max}！`,
      transform(val) {
        return (val + '').replace(/,/g, '')
      },
      trigger: 'blur'
    })
  }
  if (item.type) {
    const type = item.type
    switch (type) {
      case 'email':
        rules.push({
          type: 'email',
          message: item.message || '请输入正确的邮箱地址！',
          trigger: 'blur'
        })
        break
      case 'mobile':
        rules.push({
          validator: isValidateMobilephone,
          message: item.message || '请输入正确的手机号码！',
          trigger: 'blur'
        })
        break
      case 'tel':
        rules.push({
          validator: isValidateTelphone,
          message: item.message || '请输入正确的固定电话号码！',
          trigger: 'blur'
        })
        break
      case 'fax':
        rules.push({
          validator: isValidateTelphone,
          message: item.message || '请输入正确的传真号码！',
          trigger: 'blur'
        })
        break
      case 'telOrMobile':
        rules.push({
          validator: isValidateTelphoneOrMobile,
          message: item.message || '请输入正确的电话号码！',
          trigger: 'blur'
        })
        break
      case 'idCard':
        // console.log()
        rules.push({
          validator: isValidateIdCard,
          message: item.message || '请输入正确的身份证号码！',
          trigger: 'blur'
        })
        break
      case 'general':
        rules.push({
          validator: isValidateGeneral,
          message: item.message || '只能包含字母，数字@-_.，且以字母开头',
          trigger: 'blur'
        })
        break
      case 'alphabet':
        rules.push({
          validator: isValidateAlphabet,
          message: item.message || '只能包含字母',
          trigger: 'blur'
        })
        break
      case 'ip':
        rules.push({
          validator: isValidateIPAddress,
          message: item.message || 'ip地址非法',
          trigger: 'blur'
        })
        break
      case 'post':
        rules.push({
          validator: isValidatePostCode,
          message: item.message || '邮政编码非法',
          trigger: 'blur'
        })
        break
      case 'creditCode':
        rules.push({
          validator: isValidteSocialCreditCode,
          message: item.message || '请输入正确的社会信用代码',
          trigger: 'blur'
        })
        break
      case 'taiWanIdCard':
        rules.push({
          validator: isValidteTaiWanIdCard,
          message: item.message || '请输入正确的台胞证',
          trigger: 'blur'
        })
        break
      case 'gangAoIdCard':
        rules.push({
          validator: isValidteTaiGangAoIdCard,
          message: item.message || '请输入正确的港澳居民来往内地通行证',
          trigger: 'blur'
        })
        break
      default:
        break
    }
  }
  if (item.validator) {
    const {
      regexp,
      fn,
      message = ''
    } = item.validator
    if (regexp) {
      rules.push({
        validator: isValidateCustomRegexp,
        message,
        regexp,
        trigger: 'blur'
      })
    }
    if (fn) {
      rules.push({
        validator: fn,
        message,
        trigger: 'blur'
      })
    }
  }
  return rules
}

export default formValidate
