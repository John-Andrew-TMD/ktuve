import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 客户授信 ****/

// 客户授信列表
export const creditList = gateway + '/ICrmCreditBusiness/page'

// 额度列表
export function quotaList(data, options) {
  return requestPost(gateway + '/ICrmCreditUsedBusiness/listCreditByCustId', data, options)
}

// 额度明细
export function quotaDetail(data, options) {
  return requestPost(gateway + '/ICrmCreditUsedBusiness/listUsedByCustId', data, options)
}

// 根据客户id查询额度信息
export function queryQuotaByCustId(data, options) {
  return requestPost(gateway + '/ICrmCreditBusiness/getByCustId', data, options)
}
