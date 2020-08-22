import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 黑名单 ****/

// 黑名单列表
export const blackList = gateway + '/ITSysCrmBlacklistBusiness/page'

// 黑名单新增
export function blacklistAdd(data, options) {
  return requestPost(gateway + '/ITSysCrmBlacklistBusiness/save', data, options)
}

// 黑名单导入批量新增
export function blacklistAddBatch(data, options) {
  return requestPost(gateway + '/ITSysCrmBlacklistBusiness/saveBatch', data, options)
}

// 黑名单删除
export function blacklistDelete(data, options) {
  return requestPost(gateway + '/ITSysCrmBlacklistBusiness/removeByIds', data, options)
}
