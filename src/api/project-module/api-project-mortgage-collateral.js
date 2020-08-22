import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY


// 查询押品类别
export function queryPawnName(data, options) {
  return requestPost(gateway + '/IPmmPawnProjectBusiness/getTypeByProjectId', data, options)
}
// 新增押品类别
export function editPawnName(data, options) {
  return requestPost(gateway + '/IPmmPawnProjectBusiness/updateByProjectId', data, options)
}

/** ** 金融质押物 ****/
// 根据项目id查询金融质押物
export const queryFinance = gateway + '/IPmmPawnFinancialTable/page'

// 新增一条金融质押物
export function addFinance(data, options) {
  return requestPost(gateway + '/IPmmPawnFinancialTable/save', data, options)
}

// 更新金融质押物信息
export function updateFinance(data, options) {
  return requestPost(gateway + '/IPmmPawnFinancialTable/updateById', data, options)
}

// 删除金融质押物信息
export function deleteFinance(data, options) {
  return requestPost(gateway + '/IPmmPawnFinancialTable/removeByIds', data, options)
}

/** ** 应收账款 ****/
// 根据项目id查询应收账款
export const queryAccount = gateway + '/IPmmPawnAcceptAccountTable/page'

// 新增一条应收账款
export function addAccount(data, options) {
  return requestPost(gateway + '/IPmmPawnAcceptAccountTable/save', data, options)
}

// 更新应收账款信息
export function updateAccount(data, options) {
  return requestPost(gateway + '/IPmmPawnAcceptAccountTable/updateById', data, options)
}

// 删除应收账款信息
export function deleteAccount(data, options) {
  return requestPost(gateway + '/IPmmPawnAcceptAccountTable/removeByIds', data, options)
}

/** ** 房地产 ****/
// 根据项目id查询房地产
export const queryEstate = gateway + '/IPmmPawnEstateTable/page'

// 新增一条房地产
export function addEstate(data, options) {
  return requestPost(gateway + '/IPmmPawnEstateTable/save', data, options)
}

// 更新房地产信息
export function updateEstate(data, options) {
  return requestPost(gateway + '/IPmmPawnEstateTable/updateById', data, options)
}

// 删除房地产信息
export function deleteEstate(data, options) {
  return requestPost(gateway + '/IPmmPawnEstateTable/removeByIds', data, options)
}

/** ** 其他押品 ****/
// 根据项目id查询房地产
export const queryOthers = gateway + '/IPmmPawnOthersTable/page'

// 新增一条房地产
export function addOthers(data, options) {
  return requestPost(gateway + '/IPmmPawnOthersTable/save', data, options)
}

// 更新房地产信息
export function updateOthers(data, options) {
  return requestPost(gateway + '/IPmmPawnOthersTable/updateById', data, options)
}

// 删除房地产信息
export function deleteOthers(data, options) {
  return requestPost(gateway + '/IPmmPawnOthersTable/removeByIds', data, options)
}