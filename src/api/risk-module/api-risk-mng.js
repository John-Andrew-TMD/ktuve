import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 反洗钱 ****/

// 反洗钱风险等级
export const ISomMoneyRiskLevelTable = gateway + '/ISomMoneyRiskLevelTable/page'
// 反洗钱等级选项
export const ISomMoneyRiskOptionTable = gateway + '/ISomMoneyRiskOptionTable/page'
// 保存修改后的项目信息
export function getISomMoneyRiskLevelTable(data, options) {
    return requestPost(gateway + '/ISomMoneyRiskLevelTable/page', data, options)
  }
  // 保存修改后的项目信息
export function getISomMoneyRiskOptionTable(data, options) {
    return requestPost(gateway + '/ISomMoneyRiskOptionTable/page', data, options)
  }
