import {
  requestPost
} from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

// 合同审批
export function contractFlowApproval(data, options) {
  return requestPost(gateway + '/IConApprovalDetailBusiness/startContractApproval', data, options)
}

export const getProjectReplyNo = gateway + '/IConApprovalDetailBusiness/queryReplyNo'

// 合同变更
export function startContractChange(data, options) {
 return requestPost(gateway + '/IConApprovalDetailBusiness/startContractChange', data, options)
}
