import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 付款管理 ****/

// 付款管理列表
export const paymentList = gateway + '/IPdmFundPaymentManageBusiness/page'

// 根据id查询付款详情
export function queryPaymentDetail(data, options) {
  return requestPost(gateway + '/IPdmFundPaymentManageBusiness/getById', data, options)
}

// 核销
export function verifyPayment(data, options) {
  return requestPost(gateway + '/IPdmFundPaymentManageBusiness/amtFundPayment', data, options)
}

// 反冲
export function recoilPayment(data, options) {
  return requestPost(gateway + '/IPdmFundPaymentManageBusiness/recoilPayment', data, options)
}
