/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * @description 手机号码是否合法
 * @param {String} tel 电话号码
 */
const mobilePhoneReg = /^1[3456789]\d{9}$/
export const validateMobilephone = (tel = '') => {
  return mobilePhoneReg.test(tel)
}

/**
 * @description 固定电话号码是否合法
 * @param {String} tel 电话号码
 */
const telphoneReg = /^0\d{2,3}(-)\d{7,8}(-\d{1,4})?$/
export const validateTelphone = (tel = '') => {
  return telphoneReg.test(tel)
}

/**
 * @description 验证邮箱是否合法
 * @param {String} email 邮箱地址
 */
const emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
export const validateEmail = (email = '') => {
  return emailReg.test(email)
}

/**
 * @description 验证身份证号码是否合法
 * @param {String} cardNum 身份证号码
 */
const idCard18Reg = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
export const validateIdCard = (cardNum = '') => {
  cardNum = cardNum + ''
  // 号码规则校验
  if (!idCard18Reg.test(cardNum)) {
    return false
  }
  // 出生年月日校验 限制起始年份为1900;
  const year = cardNum.substr(6, 4); const // 身份证年
    month = cardNum.substr(10, 2); const // 身份证月
    date = cardNum.substr(12, 2); const // 身份证日
    time = Date.parse(month + '-' + date + '-' + year); const // 身份证日期时间戳date
    now_time = +new Date(); const // 当前时间戳
    dates = (new Date(year, month, 0)).getDate()// 身份证当月天数
  if (time > now_time || date > dates) {
    return false
  }
  // 校验码判断
  var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2) // 系数
  var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2') // 校验码对照表
  var id_array = cardNum.split('')
  var sum = 0
  for (var k = 0; k < 17; k++) {
    sum += parseInt(id_array[k]) * parseInt(c[k])
  }
  if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
    return false
  }
  return true
}
// const idCard15Reg = /^[1-9]\d{5}\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}$/
// export const validateIdCard = (cardNum = '') => {
//   return idCard18Reg.test(cardNum)
// }
/**
 * @description 验证IP地址是否合法
 * @param {string} ip IP地址
 */
const IPAddressReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
export const validateIPAddress = ip => {
  return IPAddressReg.test(ip)
}

/**
 * @description 验证邮编是否合法
 * @param {string} val 邮编
 */
const postCodeReg = /^[0-8][0-7]\d{4}$/
export const validatePostCode = code => {
  return postCodeReg.test(code)
}

/**
 * @description 验证统一社会信用代码
 * @param {string} value 统一社会信用代码
 */
const logicCheckCode = value => {
  let Ancode // 统一社会信用代码的每一个值
  let Ancodevalue // 统一社会信用代码每一个值的权重
  let total = 0
  const weightedFactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28] // 加权因子
  const str = '0123456789ABCDEFGHJKLMNPQRTUWXY'
  // 不用I、O、S、V、Z
  for (let i = 0; i < value.length - 1; i++) {
    Ancode = value.substring(i, i + 1)
    Ancodevalue = str.indexOf(Ancode)
    total = total + Ancodevalue * weightedFactors[i] // 权重与加权因子相乘之和
  }
  let logiccheckcode = 31 - (total % 31)
  if (logiccheckcode === 31) {
    logiccheckcode = 0
  }
  const newStr = '0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y'
  const newArray = newStr.split(',')
  return newArray[logiccheckcode]
}
// 验证社会信用代码
export const validteSocialCreditCode = value => {
  const creditCodeReg = /^[0-9A-Z]{18}$/
  const checkCode = value.substring(17, 18)
  return creditCodeReg.test(value) && logicCheckCode(value) === checkCode
}

// 验证台胞证
const taiWanIdReg = /^(?:(830000(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX])|\d{10}[DAB]|\d{8}|[a-zA-Z0-9]{10})$/
export const validateTaiWanIdCard = id => {
  return taiWanIdReg.test(id)
}

// 验证港澳通行证
const gangAoIdReg = /^[H|M]\d{10}$/
export const validateGangAoIdCard = id => {
  return gangAoIdReg.test(id)
}
