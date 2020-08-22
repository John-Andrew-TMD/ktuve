import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

//查询资料附件列表
export const EnclosurePage = gateway + '/IPmmEnclosureBusiness/page'
export function getPage(data, options) {
  return requestPost(gateway + '/IPmmEnclosureBusiness/page', data, options)
}
//根据租赁类型，资料分类，项目状态 查询附件类型
export const pmmEnclosure = gateway + '/IPmmEnclosureBusiness/getPmmEnclosure'
export function getPmmEnclosure(data, options) {
  return requestPost(gateway + '/IPmmEnclosureBusiness/getPmmEnclosure', data, options)
}
//根据项目id 查询审批要件
export const pageImportant = gateway + '/IPmmEnclosureBusiness/pageImportant'
export function getPageImportant(data, options) {
  return requestPost(gateway + '/IPmmEnclosureBusiness/pageImportant', data, options)
}
//删除附件 根据附件ids
export const removeByIds = gateway + '/IPmmEnclosureBusiness/removeByIds'
export function getRemoveByIds(data, options) {
  return requestPost(gateway + '/IPmmEnclosureBusiness/removeByIds', data, options)
}
//附件确定上传
export const IPmmEnclosureBusinessSave = gateway + '/IPmmEnclosureBusiness/save'
export function getIPmmEnclosureBusinessSave(data, options) {
  return requestPost(gateway + '/IPmmEnclosureBusiness/save', data, options)
}

export function getIPmmEnclosureQueryAll(data, options) {
  return requestPost(gateway + '/IPmmEnclosureBusiness/queryAll', data, options)
}