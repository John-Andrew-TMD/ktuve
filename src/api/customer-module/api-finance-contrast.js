import {
  requestPost
} from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 财务对比图 ****/
// 查询所有财务列表
export function getAllFinanceList(data, options) {
  return requestPost(gateway + '/ICrmFinConditionTable/page', data, options)
}
// 查询财务数据
export function getFinanceList(data, options) {
  return requestPost(gateway + '/ICrmFinConditionTable/listByFinIds', data, options)
}

// 查询偿债能力
export function getDeptList(data, options) {
  return requestPost(gateway + '/ICrmFinSovencyTable/listByFinIds', data, options)
}

// 查询盈利能力
export function getProfitList(data, options) {
  return requestPost(gateway + '/ICrmFinProfitabilityTable/listByFinIds', data, options)
}

// 查询运营能力
export function getBusinessList(data, options) {
  return requestPost(gateway + '/ICrmFinOperationTable/listByFinIds', data, options)
}

// 查询成长能力
export function getGrowthList(data, options) {
  return requestPost(gateway + '/ICrmFinGrowthAbilityTable/listByFinIds', data, options)
}

// 下载对比图Excel
export function downloadExcel(data, options) {
  return requestPost(gateway + '/ICrmFinConditionBusiness/downloadMergeForm', data, options)
}

// 根据文件路径下载文件
export const downloadFilePath = gateway + '/ICrmFinConditionBusiness/downFileByPath'
