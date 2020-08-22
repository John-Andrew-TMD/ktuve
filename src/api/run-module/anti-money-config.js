import {
  requestPost,
  requestGet
} from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 反洗钱风险等级配置 ****/

// 反洗钱风险等级列表查询
export const riskLevelUrl = gateway + '/ISomMoneyRiskOptionTable/page'

// 反洗钱风险等级列表条件查询
export function riskLevelList(data, options) {
  return requestPost(gateway + '/ISomMoneyRiskOptionTable/page', data, options)
}

// 风险等级选项新增
export function riskLevelAdd(data, options) {
  return requestPost(gateway + '/ISomMoneyRiskOptionTable/save', data, options)
}

// 查询风险等级
export function getRiskLevel(data, options) {
  return requestPost(gateway + '/ISomMoneyRiskLevelTable/page', data, options)
}
// 风险等级选项配置
export function riskLevelConfig(data, options) {
  return requestPost(gateway + '/ISomMoneyRiskLevelBusiness/save', data, options)
}