import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 资料附件配置 ****/

// 资料附件列表
export const attachmentList = gateway + '/ITSysSomEnclosureTable/page'

// 资料附件新增
export function attachmentAdd(data, options) {
  return requestPost(gateway + '/ITSysSomEnclosureBusiness/save', data, options)
}

// 资料附件删除
export function attachmentDelete(data, options) {
  return requestPost(gateway + '/ITSysSomEnclosureTable/removeByIds', data, options)
}

// 附件维护列表
export function attachmentMaintainList(data, options) {
  return requestPost(gateway + '/ITSysSomFileMaintainTable/query', data, options)
}

// 附件维护-客户资料新增
export function attachmentCustAttachAdd(data, options) {
  return requestPost(gateway + '/ITSysSomFileMaintainCustBusiness/save', data, options)
}

// 附件维护-客户资料修改
export function attachmentCustAttachUpdate(data, options) {
  return requestPost(gateway + '/ITSysSomFileMaintainCustBusiness/updateById', data, options)
}

// 附件维护-客户资料删除
export function attachmentCustAttachDelete(data, options) {
  return requestPost(gateway + '/ITSysSomFileMaintainCustBusiness/removeByIds', data, options)
}

// 附件维护-项目资料新增
export function attachmentProjectAttachAdd(data, options) {
  return requestPost(gateway + '/ITSysSomFileMaintainPmmBusiness/save', data, options)
}

// 附件维护-项目资料修改
export function attachmentProjectAttachUpdate(data, options) {
  return requestPost(gateway + '/ITSysSomFileMaintainPmmBusiness/updateById', data, options)
}

// 附件维护-项目资料删除
export function attachmentProjectAttachDelete(data, options) {
  return requestPost(gateway + '/ITSysSomFileMaintainPmmBusiness/removeByIds', data, options)
}

// 附件维护-合同资料新增
export function attachmentContractAttachAdd(data, options) {
  return requestPost(gateway + '/ISomFileMaintainConBusiness/save', data, options)
}

// 附件维护-合同资料修改
export function attachmentContractAttachUpdate(data, options) {
  return requestPost(gateway + '/ISomFileMaintainConBusiness/updateById', data, options)
}

// 附件维护-合同资料删除
export function attachmentContractAttachDelete(data, options) {
  return requestPost(gateway + '/ISomFileMaintainConBusiness/removeByIds', data, options)
}

// 附件维护-投放资料新增
export function attachmentLoanAttachAdd(data, options) {
  return requestPost(gateway + '/ISomFileMaintainPdmBusiness/save', data, options)
}

// 附件维护-投放资料修改
export function attachmentLoanAttachUpdate(data, options) {
  return requestPost(gateway + '/ISomFileMaintainPdmBusiness/updateById', data, options)
}

// 附件维护-投放资料删除
export function attachmentLoanAttachDelete(data, options) {
  return requestPost(gateway + '/ISomFileMaintainPdmBusiness/removeByIds', data, options)
}
