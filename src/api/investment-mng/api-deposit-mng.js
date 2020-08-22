import {
  requestPost
} from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 保证金管理 ****/

// 保证金列表
export const depositList = gateway + '/IPdmRiskfeeBusiness/page'

// 保证金追加申请审批
export function startAdditionalFlow(data, options) {
  return requestPost(gateway + '/IPdmRiskfeeApprovalBusiness/startAdditionalFlow', data, options)
}

// 保证金抵扣申请审批
export function startDeductFlow(data, options) {
  return requestPost(gateway + '/IPdmRiskfeeApprovalBusiness/startDeductFlow', data, options)
}

// 保证金补足申请审批
export function startCompleteFlow(data, options) {
  return requestPost(gateway + '/IPdmRiskfeeApprovalBusiness/startMakeupFlow', data, options)
}

// 保证金退还申请审批
export function startReurnFlow(data, options) {
  return requestPost(gateway + '/IPdmRiskfeeApprovalBusiness/startRefundFlow', data, options)
}

// 查询保证金变更记录
export const depositChangeList = gateway + '/IPdmRiskfeeBusiness/queryFlowRecords'

// 查询附件类型
export const getAttachmentTypeList = gateway + '/IPdmEnclosureBusiness/getPdmEnclosure'

// 根据对应id查询附件资料
export function getAttachment(data, options) {
  return requestPost(gateway + '/IPdmEnclosureBusiness/queryEnclosure', data, options)
}

// 追加补足退还流程更新数据
export function depositUpdate(data, options) {
  return requestPost(gateway + '/IPdmRiskfeeApprovalBusiness/updateById', data, options)
}
