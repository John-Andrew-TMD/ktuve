import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 收款管理 ****/

// 分页查询利息计提明细
export const detailBusinessList = gateway + '/IPdmInterestAccrualDetailBusiness/page'
// 分页查询利息计提汇总
export const sumBusinessList = gateway + '/IPdmInterestAccrualSumBusiness/page'
// // 根据id查询收款详情
// export function queryCollectionDetail(data, options) {
//   return requestPost(gateway + '/IPdmCollectionBusiness/getById', data, options)
// }