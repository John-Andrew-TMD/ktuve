import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

// 投放列表
export const investmentList = gateway + '/IPdmBusiness/quereyLoanList'

// 合同列表-新增投放
export function contractList(data, options) {
  return requestPost(gateway + '/IPdmBusiness/getContractToLoan', data, options)
}

// 项目列表-新增投放
export const projectList = gateway + '/IPdmBusiness/getProjectToLoan'

// 放款信息查询-新增投放
export function getLoanInfo(data, options) {
  return requestPost(gateway + '/IPdmBusiness/getLoan', data, options)
}

// 放款信息修改-新增投放
export function saveLoanInfo(data, options) {
  return requestPost(gateway + '/IPdmBusiness/saveOrUpdateLoan', data, options)
}

// 投放信息查询-新增投放
export function queryLoanDetail(data, options) {
  return requestPost(gateway + '/IPdmBusiness/queryLoanInfo', data, options)
}

// 资料附件-新增投放
export function attachmentList(data, options) {
  return requestPost(gateway + '/IPdmEnclosureBusiness/queryAll', data, options)
}

// 查询资料附件类型-新增投放
export function getAttachmentType(data, options) {
  return requestPost(gateway + '/IPdmEnclosureBusiness/getPdmEnclosure', data, options)
}

// 资料附件删除-新增投放
export function attachmentDeleteAById(data, options) {
  return requestPost(gateway + '/IPdmEnclosureBusiness/removeByIds', data, options)
}

// 资料附件上传-新增投放
export function attachmentUpload(data, options) {
  return requestPost(gateway + '/IPdmEnclosureBusiness/save', data, options)
}

