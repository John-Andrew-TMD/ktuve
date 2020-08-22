import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 核算主体设置 ****/
// 核算主体列表
export const accountingBodyList = gateway + '/ISomAccountingSubjectInformationTable/page'

// 核算主体新增
export function accountingBodyAdd(data, options) {
  return requestPost(gateway + '/ISomAccountingSubjectInformationTable/save', data, options)
}

// 核算主体修改
export function accountingBodyUpdate(data, options) {
  return requestPost(gateway + '/ISomAccountingSubjectInformationTable/updateById', data, options)
}

// 核算主体删除
export function accountingBodyDelete(data, options) {
  return requestPost(gateway + '/ISomAccountingSubjectInformationTable/removeByIds', data, options)
}

// 根据ID查询核算主体
export function getAccountingBodyById(data, options) {
  return requestPost(gateway + '/ISomAccountingSubjectInformationTable/getById', data, options)
}

// 银行列表
export const bankList = gateway + '/ISomAccountingSubjectBankTable/page'

// 银行新增
export function bankAdd(data, options) {
  return requestPost(gateway + '/ISomAccountingSubjectBankTable/save', data, options)
}

// 银行修改
export function bankUpdate(data, options) {
  return requestPost(gateway + '/ISomAccountingSubjectBankTable/updateById', data, options)
}

// 银行修改
export function bankDelete(data, options) {
  return requestPost(gateway + '/ISomAccountingSubjectBankTable/removeByIds', data, options)
}

// 根据ID查询银行信息
export function getBankById(data, options) {
  return requestPost(gateway + '/ISomAccountingSubjectBankTable/getById', data, options)
}
