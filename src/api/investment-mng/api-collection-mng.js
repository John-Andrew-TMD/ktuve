import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 收款管理 ****/

// 收款管理列表
export const collectionList = gateway + '/IPdmCollectionBusiness/page'

// 根据id查询收款详情
export function queryCollectionDetail(data, options) {
  return requestPost(gateway + '/IPdmCollectionBusiness/getById', data, options)
}

// 核销
export function startVerification(data, options) {
  return requestPost(gateway + '/IPdmCollectionBusiness/verify', data, options)
}

// 下载通知书
export const downloadNotification = gateway + '/IPdmCollectionBusiness/noticeExport'
