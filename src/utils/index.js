import store from '@/store'
// import aes from '../../public/plugins/aes.js'
import dayjs from 'dayjs'
import ChinaRegion from 'utils/china-region-202007.min.js'
import Industries from 'utils/GBT4754-2017.min.js'
import EnterpriseType from 'utils/enterprise-type.min.js'
import ClassFlow from 'utils/class-flow.js'
import {
  Decimal
} from 'decimal.js'
let returnedItem = {}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @description object转url
 * @param {Object} obj
 */
export const objToUrl = obj => {
  return Object.keys(obj).map(key => `${key}=${obj[key] && encodeURIComponent(obj[key]) || ''}`).join('&')
}

/**
 * @description url转obj
 * @param {String} str 路径
 */
export const urlToObj = (str = location.href) => {
  const obj = {}
  const idx = str.indexOf('?')
  if (idx > -1) {
    str = str.substring(idx + 1)
  }
  str.replace(/([^=&]+)=([^&]*)/g, function(m, key, value) {
    obj[key] = decodeURIComponent(value)
  })
  return obj
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * localStorage/sessionStorage 增删查
 */
/* 存储localStorage */
export const setStore = (name, content, type = 'localStorage') => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window[type] && window[type].setItem(name, content)
}
/* 获取localStorage */
export const getStore = (name, parse = false, type = 'localStorage') => {
  if (!name) return
  try {
    if (parse) {
      return window[type] && JSON.parse(window[type].getItem(name))
    }
  } catch (e) {
    return
  }
  return window[type] && window[type].getItem(name)
}
/* 删除localStorage */
export const removeStore = (name, type = 'localStorage') => {
  if (!name) return
  window[type] && window[type].removeItem(name)
}

/**
 * 提示框
 * @param {string} message
 * @param {string} type
 */
export const showToast = (message = '', type = 'error', showModal = false) => {
  showModal && store.commit('app/SHOW_MODAL_BOX')
  Vue.prototype.$message({
    message,
    type,
    duration: 3000
  })
}

/**
 * 判断是否为空 包括空格，null, undefined
 * @param {every} val
 */
export const isEmpty = val => {
  if (val === 0) return false
  if (!val) return true
  return !!/^\s*$/.test(val)
}

/**
 * 空对象判断
 * @param {*} obj
 * @returns {boolean}
 */
export const isEmptyObj = (obj) => {
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    return true
  } else if (!Object.keys(obj).length) {
    return true
  } else {
    return false
  }
}

/**
 * 目前系统存在节点id相同的数据，导致死循坏，新系统上线再使用此方法
 * @param {array} data 原始数据
 * @param {string} parentId 父节点id
 * @param {string} childrenKey 子节点id字段名称
 * @param {string} parentKey 父节点id字段名称
 */
export const generateTree = (data, parentId = 0, childrenKey, parentKey, orderKey = '') =>
  data
    .filter(item => item[parentKey] === parentId)
    .map(item => {
      let children = generateTree(data, item[childrenKey], childrenKey, parentKey, orderKey)
      if (orderKey !== '') {
        children = children.sort((a, b) => (a[orderKey] || 0) - (b[orderKey] || 0))
      }
      return {
        ...item,
        ...children.length && {
          children
        }
      }
    }).sort((a, b) => (orderKey !== '' ? ((a[orderKey] || 0) - (b[orderKey] || 0)) : 0))
/**
 * 获取当前日期，如20190202
 * @param {String} separator 分隔符
 */
export const getCurrentDate = (separator = '') => {
  const oDate = new Date()
  const yyyy = oDate.getFullYear()
  let MM = oDate.getMonth() + 1
  let dd = oDate.getDate()
  if (MM < 10) {
    MM = '0' + MM
  }
  if (dd < 10) {
    dd = '0' + dd
  }
  return `${yyyy}${separator}${MM}${separator}${dd}`
}
/**
 * 日期分割
 * @param {string} date
 * @param {string} separator
 */
export const dateFormatBySeparator = (date, separator = '-') => {
  if (!+date) return ''
  if (String(date).length == 8) {
    return (date + '').replace(/(\d{4})(\d{2})/, `$1${separator}$2${separator}`)
  } else {
    return timestampFormat(date, `YYYY${separator}MM${separator}DD`)
  }
}

export const timestampFormat = (timestamp, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!+timestamp) return ''
  return dayjs(+timestamp).format(format)
}

function numberRound(num, digit) {
  const newNum = new Decimal(num)
  const res = +newNum.toFixed(digit)
  if (digit === 0) return res
  const decimal = (res + '').split('.')[1]
  if (!decimal || decimal && decimal.length < 2) {
    return res.toFixed(2)
  }
  return res
}

/**
 * 数字小数点格式化
 * @param {string, number} digit 待处理数字
 * @param {number} minDecimals 最小小数点位数
 * @param {number} maxDecimals 最大小数点位数
 * @param {string, number} defaultVal 参数非法默认返回值
 */
export const decimalsFormat = (digit, minDecimals = 2, maxDecimals = 2, defaultVal = 0) => {
  // 非数值或者数值小于0.000000001
  if (isNaN(digit) || digit === '') return defaultVal
  if (!Number(digit) || digit > 0 && (digit * 100000000 < 1) || digit < 0 && (digit * 100000000 > -1)) return 0
  const flVal = parseFloat(digit)
  // 数值为整数
  if (Number.isInteger(flVal)) return flVal.toFixed(minDecimals)
  // 如果数值为科学计数法，则小数位已经达到8位
  if (/e/.test(flVal)) {
    return numberRound(flVal, maxDecimals)
  }
  const digitArr = (flVal + '').split('.')
  const decimalPoint = digitArr[1]

  if (decimalPoint.length < minDecimals) {
    return numberRound(flVal, minDecimals)
  } else if (decimalPoint.length > maxDecimals) {
    let [newDigit, point] = (numberRound(flVal, maxDecimals) + '').split('.')
    // 保留8位后，出现多余的填充0，进一步处理
    point = point.replace(/(0+)$/, '').padEnd(minDecimals, '0')
    return `${newDigit}.${point}`
  } else {
    return flVal
  }
}

export const thousandSeparator = (digit, minDecimals = 2) => {
  if (isNaN(digit)) return 0
  if (!+digit) return 0
  const num = (numberRound(+digit, minDecimals)).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
  return num
}
/**
 * 通过功能号和字典项key查找字典项值
 * @param {string} dictCode 字段项code
 * @param {number, string} dictValue 字典项值
 */

export const queryDictValue = (dictCode, dictValue) => {
  if ((dictValue + '').includes(',')) {
    return dictValue.split(',').map(item => queryDictValue(dictCode, item)).join('，')
  }
  const dictData = store.getters.dictData
  if (!dictData || isEmpty(dictValue)) return ''
  const tempArr = dictData[dictCode]
  const res = Array.isArray(tempArr) && tempArr.filter(item => item.value == dictValue)
  return res.length && res[0].label || dictValue
}

/**
 * 通过功能号和字典项值查找字典项KEY
 * @param {string} dictCode 字段项code
 * @param {number, string} dictKey 字典项值
 */

export const queryDictKey = (dictCode, dictKey) => {
  if ((dictKey + '').includes(',')) {
    return dictKey.split(',').map(item => queryDictKey(dictCode, item)).join('，')
  }
  const dictData = store.getters.dictData
  if (!dictData || isEmpty(dictKey)) return ''
  const tempArr = dictData[dictCode]
  const res = Array.isArray(tempArr) && tempArr.filter(item => item.label == dictKey)
  return res.length && res[0].value || dictKey
}
/**
 * 通过功能号查找字典项列表
 * @param {string} dictCode 功能号
 */
export const queryDictItems = dictCode => {
  const dictData = store.getters.dictData
  if (!dictData) return []
  const res = (dictData[dictCode] || []).filter(item => !isEmpty(item.value))
  res.sort((a, b) => a.value - b.value)
  return Object.freeze(res.map(item => {
    return {
      label: item.label,
      value: item.value
    }
  }))
}
/**
 * 查找省份
 */
export const queryChinaProvinces = () => {
  const provincesObj = ChinaRegion['86']
  const ret = Object.entries(provincesObj).map(item => {
    return {
      value: item[0],
      label: item[1]
    }
  })
  return Object.freeze(ret)
}
/**
 * 通过userId查找userName
 * @param {string} userId
 */
export const queryUserNameById = userId => {
  if (userId == '0') return '系统生成'
  if (isNaN(userId)) return ''
  const userList = getStore('userList', true)

  if (userList) {
    const res = userList.filter(item => {
      return item.userId == userId
    })
    return res.length && res[0].employeeName || userId
  } else {
    // store.dispatch('user/getUserInfo')
    return userId
  }
}
/**
 * 通过orgId查找orgName
 * @param {string} orgid
 */
export const queryOrgNameById = orgId => {
  if (isNaN(orgId)) return orgId
  const orgInfo = getStore('orgInfo', true)

  if (!isEmptyObj(orgInfo) && orgInfo.data) {
    const res = orgInfo.data.filter(item => {
      return item.orgid == orgId
    })
    return res.length && res[0].orgname || orgId
  } else {
    store.dispatch('user/getOrgInfo')
    return orgId
  }
}

/**
 * 通过custId查找custName
 * @param {string} userId
 */
export const queryCustNameById = custId => {
  if (custId == 0 || isNaN(custId)) return ''
  const custInfo = store.state.user.custInfo

  if (custInfo) {
    const res = custInfo.filter(item => {
      return item.id == custId
    })
    return res.length && res[0].cust_name || custId
  } else {
    store.dispatch('user/getCustInfo')
    return custId
  }
}

/**
 * 通过中国行政区域代码查找区域
 * @param {string} ids 行政区域代码,以逗号分割
 * @param {string} separator 分隔符
 */
export const queryChinaRegionByIds = (ids, separator = '-') => {
  if (!ids) return ''
  const idArr = (ids + '').split(',')
  const res = idArr.map((code, index, arr) => {
    if (index === 3) return code
    if (!code) return ''
    code = code.padEnd(6, 0)
    arr[index] = code
    if (index === 0) return (ChinaRegion['86'][code] + '').replace(/\(.+\)/, '')
    const parentArea = ChinaRegion[arr[index - 1]]
    return parentArea && parentArea[code] || code
  })
  return res.join(separator)
}

/**
 * 通过行业代码查找行业
 * @param {string} ids 行政区域代码,以逗号分割
 * @param {string} separator 分隔符
 */
export const queryIndustryByIds = (ids, separator = '') => {
  if (!ids) return ''
  const idArr = (ids + '').split(',')
  const res = idArr.map((code, index) => {
    if (!code) return ''
    if (index === 0) return Industries['All'][code]
    return Industries[idArr[index - 1]][code]
  })
  return res.join(separator)
}

/**
 * 通过企业类型代码查找企业类型
 * @param {string} ids 企业类型代码
 * @param {string} separator 分隔符
 */
export const queryEnterpriseTypeByIds = (id, separator = '') => {
  if (!id) return ''
  let ids = []
  if (id.substring(1) === '000') {
    ids = [id]
  } else if (id.substring(2) === '00') {
    ids = [id.substring(0, 1) + '000', id]
  } else if (id.substring(3) === '0') {
    ids = [id.substring(0, 1) + '000', id.substring(0, 2) + '00', id]
  } else {
    ids = [id.substring(0, 1) + '000', id.substring(0, 2) + '00', id.substring(0, 3) + '0', id]
  }
  const res = ids.map((code, index, arr) => {
    if (!code) return ''
    if (index === 0) return EnterpriseType['All'][code]
    return EnterpriseType[arr[index - 1]][code]
  })
  return res.pop()
}

const class2type = {}
const toString = class2type.toString
const hasOwn = class2type.hasOwnProperty
const fnToString = hasOwn.toString
const ObjectFunctionString = fnToString.call(Object)

const isPlainObject = (obj) => {
  let proto, Ctor
  if (!obj || toString.call(obj) !== '[object Object]') {
    return false
  }
  proto = Object.getPrototypeOf(obj)
  if (!proto) {
    return true
  }
  Ctor = hasOwn.call(proto, 'constructor') && proto.constructor
  return typeof Ctor === 'function' && fnToString.call(Ctor) === ObjectFunctionString
}
/**
 * 深拷贝
 * @param {array, object} target
 */
export const deepAssign = function(target) {
  const args = arguments
  let result = {}
  let i = 0
  let argsLenth = args.length
  let keys = null
  let key = null
  let src
  let copy
  let clone
  let copyIsArray
  let _parent = null
  let parent = null

  if (argsLenth > 1) {
    i = 1
    result = target || {}
  }

  if (toString.call(args[argsLenth - 1]) === '[object Object]' && args[argsLenth - 1].originalParent) {
    _parent = parent = args[argsLenth - 1]
    argsLenth--
  }
  // 该字段有父级则需要追溯该字段的父级
  while (_parent) {
    // 如果该字段引用了它的父级则为循环引用
    if (_parent.originalParent === args[1]) {
      // 循环引用直接返回同级的新对象
      return _parent.currentParent
    }
    _parent = _parent.parent
  }
  for (; i < argsLenth; i++) {
    keys = Object.keys(args[i])
    for (let j = 0; j < keys.length; j++) {
      key = keys[j]
      src = result[key]
      copy = args[i][key]

      if (src === copy) {
        continue
      }
      if (copy && (isPlainObject(copy) ||
          (copyIsArray = Array.isArray(copy)))) {
        if (copyIsArray) {
          copyIsArray = false
          clone = src && Array.isArray(src) ? src : []
        } else {
          clone = src && (isPlainObject(src) ? src : {})
        }
        result[key] = deepAssign(clone, copy, {
          originalParent: args[i],
          currentParent: result,
          parent: parent
        })
      } else if (copy !== undefined) {
        result[key] = copy
      }
    }
  }

  return result
}

/**
 * @description 中文展示金额
 * @param {String} money
 */
export const amountDisplayedByChinese = money => {
  const maxNum = 999999999999999.9999 // 最大处理的数字

  const sdata = parseFloat(money)
  if (sdata == 0) return '零元整'
  if (!sdata || isNaN(sdata) || sdata >= maxNum) return ''
  const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'] // 汉字的数字
  const cnIntRadice = ['', '拾', '佰', '仟'] // 基本单位
  const cnIntUnits = ['', '万', '亿', '兆'] // 对应整数部分扩展单位
  const cnDecUnits = ['角', '分', '毫', '厘'] // 对应小数部分单位
  const cnInteger = '整' // 整数金额时后面跟的字符
  const cnIntLast = '元' // 整型完以后的单位
  const cnPre = '负' // 负数

  let IntegerNum // 金额整数部分
  let DecimalNum // 金额小数部分
  let ChineseStr = '' // 输出的中文金额字符串
  let parts // 分离金额后用的数组，预定义

  money = sdata + '' // 转换为字符串
  if (sdata < 0) {
    ChineseStr += cnPre
    money = money.substring(money.indexOf('-') + 1, money.length)
  }
  if (money.indexOf('.') == -1) {
    IntegerNum = money
    DecimalNum = ''
  } else {
    parts = money.split('.')
    IntegerNum = parts[0]
    DecimalNum = parts[1].substr(0, 2)
  }
  if (parseInt(IntegerNum, 10) > 0) { // 获取整型部分转换
    let zeroCount = 0
    const IntLen = IntegerNum.length
    for (let i = 0; i < IntLen; i++) {
      const n = IntegerNum.substr(i, 1)
      const p = IntLen - i - 1
      const q = p / 4
      const m = p % 4
      if (n == '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          ChineseStr += cnNums[0]
        }
        zeroCount = 0 // 归零
        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m == 0 && zeroCount < 4) {
        ChineseStr += cnIntUnits[q]
      }
    }
    ChineseStr += cnIntLast
    // 整型部分处理完毕
  }
  if (DecimalNum != '') { // 小数部分
    const decLen = DecimalNum.length
    for (let i = 0; i < decLen; i++) {
      const n = DecimalNum.substr(i, 1)
      if (n != '0') {
        ChineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  } else {
    ChineseStr += cnInteger
  }
  return ChineseStr
}

const userAgent = navigator.userAgent
export const browser = {
  isIE: userAgent.includes('MSIE'),
  isFF: userAgent.includes('Firefox')
}

/**
 *
 * @param {string} value 待加密内容
 * @param {string} enckey 密钥
 */
// export const aesEncrypt = (value, enckey) => {
//   const keys = ['l', 'm', 'e', 'n', 'z']
//   const keyMixin = enckey || keys[0] +
//     keys[2] +
//     keys[2] +
//     keys[1] +
//     keys[2] +
//     keys[3] +
//     keys[4] +
//     keys[4] +
//     keys[0] +
//     keys[2] +
//     keys[2] +
//     keys[1] +
//     keys[2] +
//     keys[3] +
//     keys[4] +
//     keys[4]

//   const srcs = aes.CryptoJS.enc.Utf8.parse(value)
//   const key = aes.CryptoJS.enc.Utf8.parse(keyMixin)
//   const iv = aes.CryptoJS.enc.Utf8.parse('0102020303040506')
//   const encrypted = aes.CryptoJS.AES.encrypt(srcs, key, {
//     iv: iv,
//     mode: aes.CryptoJS.mode.CBC
//   })
//   return encrypted.toString()
// }
/**
 * 文件下载
 * @param {string} url 请求地址
 * @param {object} params 请求参数
 * @param {string} method 请求方式
 */
export const formSubmit = (url = '', params = {}, method = 'post', target = '_self') => {
  const formDom = document.createElement('form')
  formDom.enctype = 'multipart/form-data'
  formDom.action = url
  formDom.method = method
  formDom.target = target
  formDom.style.display = 'none'
  const inputNode = document.createElement('input')
  Object.keys(params).map(key => {
    const cloneNode = inputNode.cloneNode()
    cloneNode.name = key
    cloneNode.value = params[key]
    formDom.appendChild(cloneNode)
  })
  inputNode.type = 'submit'
  formDom.appendChild(inputNode)
  document.body.appendChild(formDom)
  formDom.submit()
  document.body.removeChild(formDom)
}

/**
 *  创建流程实例
 * @param {Object} params 表单数据
 * @param {Object} ctx 上下文
 */
export const createFlowInstance = (params, ctx) => {
  class FlowSubClass extends ClassFlow {
    constructor(params, ctx) {
      super()
      this.params = params
      this.ctx = ctx
    }
  }
  const flowInstance = new FlowSubClass(params, ctx)
  return flowInstance
}

/**
 *  清空form-create创建的表单
 * @param {Object} ctx 上下文
 * @param {Object} formApi form对象
 */
export const resetFormCreateFields = (ctx, formApi) => {
  if (!formApi) return
  ctx[formApi].fields().forEach(key => {
    ctx[formApi].setValue(key, '')
  })
}

//  浏览器判断
export const browserType = () => {
  var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
  var isOpera = userAgent.indexOf('Opera') > -1 // 判断是否Opera浏览器
  var isIE = window.ActiveXObject || 'ActiveXObject' in window
  var isEdge = userAgent.indexOf('Edge') > -1 // 判断是否IE的Edge浏览器
  var isFF = userAgent.indexOf('Firefox') > -1 // 判断是否Firefox浏览器
  var isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') == -1 // 判断是否Safari浏览器
  var isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1 && !isEdge // 判断Chrome浏览器

  if (isIE) {
    var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    reIE.test(userAgent)
    var fIEVersion = parseFloat(RegExp['$1'])
    if (userAgent.indexOf('MSIE 6.0') != -1) {
      return 'IE6'
    } else if (fIEVersion == 7) {
      return 'IE7'
    } else if (fIEVersion == 8) {
      return 'IE8'
    } else if (fIEVersion == 9) {
      return 'IE9'
    } else if (fIEVersion == 10) {
      return 'IE10'
    } else if (userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/)) {
      return 'IE11'
    } else {
      return '0'
    } // IE版本过低
  } // isIE end

  if (isFF) {
    return 'FF'
  }
  if (isOpera) {
    return 'Opera'
  }
  if (isSafari) {
    return 'Safari'
  }
  if (isChrome) {
    return 'Chrome'
  }
  if (isEdge) {
    return 'Edge'
  }
}

export const html2Escape = sHtml => {
  return sHtml.replace(/[<>&"]/g, function(c) {
    return {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;'
    }[c]
  })
}
/**
 *  转换对象指定属性类型
 * @param {Object} obj 对象
 * @param {Object} arrays 对象的要转换key
 * @param {Object} transType 转换成什么类型,Integer,Float,String,Boolean
 */
export const transObject = (obj, arrays, transType) => {
  let targetObj = {}
  switch (transType) {
    case 'Integer':
      Object.keys(obj).forEach(key => {
        if (arrays.includes(key)) {
          obj[key] = parseInt(obj[key])
        }
      })
      targetObj = obj
      break
    case 'Float':
      Object.keys(obj).forEach(key => {
        if (arrays.includes(key)) {
          obj[key] = parseFloat(obj[key])
        }
      })
      targetObj = obj
      break
    case 'String':
      Object.keys(obj).forEach(key => {
        if (arrays.includes(key)) {
          obj[key] = obj[key].toString()
        }
      })
      targetObj = obj
      break
    default:
      break
  }

  return targetObj
}
/**
 *  针对树形数组对象通过相应的唯一值查询相应的信息
 * @param {Array} arr 树形数组对象，有children属性
 * @param {String} value 要查找的key对应的值
 * @param {String} key 要查找的key
 */
export const getTargetData = (arr, value, key) => {
  arr.forEach(function(item) { // 利用foreach循环遍历
    if (item[key] == value)// 判断递归结束条件
    {
      returnedItem = item
      return item
    } else if (item.children && item.children.length > 0) // 判断chlidren是否有数据
    {
      getTargetData(item.children, value, key) // 递归调用
    }
  })
  return returnedItem
}

export const openNewWindow = (path, query) => {
  const url = `${path}?${objToUrl(query)}`
  window.open(url, '', `height=${window.screen.availHeight - 60}, width=${window.screen.availWidth - 16}, toolbar=no, menubar=no, location=no, status=no`)
}
