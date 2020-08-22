import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 合同管理 ****/

//查询资料附件
export const IConEnclosureBusinessPage = gateway + '/IConEnclosureBusiness/page'
//根据合同管理id查询附件汇总
export const getEnclosureSummary = gateway + '/IConEnclosureBusiness/getEnclosureSummary'
// export function getEnclosureSummary(data, options) {
//   return requestPost(gateway + '/IConEnclosureBusiness/getEnclosureSummary', data, options)
// }
//查询合同上传的附件类型
export const getConEnclosureList = gateway + '/IConEnclosureBusiness/getConEnclosure'

//附件确定上传
export function IConEnclosureBusinessave(data, options) {
  return requestPost(gateway + '/IConEnclosureBusiness/save', data, options)
}
//删除附件 根据附件ids
export function IConEnclosureBusinessRemoveByIds(data, options) {
  return requestPost(gateway + '/IConEnclosureBusiness/removeByIds', data, options)
}

// 获取合同详情合同类型
export function getContractDocList(data, options) {
	return requestPost(gateway + '/online/getContractDoc', data, options)
}

