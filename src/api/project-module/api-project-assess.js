import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

const kissoway = process.env.VUE_APP_KISSO_GETEWAY

/** ** 项目管理 ****/

// 评审会列表
export const queryAssess = gateway + '/IPmmReviewBusiness/page'

// 评审会详情列表
export const queryAssessDetail = gateway + '/IPmmReviewBusiness/queryFlowDetail'

// 评审会新增自增长编号
export function queryMeetingNo(data, options) {
  return requestPost(gateway + '/IPmmReviewBusiness/addReviewNo', data, options)
}

// 判断编号是否重复
export function checkMeetingNo(data, options) {
  return requestPost(gateway + '/IPmmReviewBusiness/queryReviewNo', data, options)
}

//  查询评审会委员
export function queryMeetingPeople(data, options) {
  return requestPost(kissoway + '/ISysUserBusiness/getTenantUserListByRoleNames', data, options)
}

// 评审会新增或保存
export function assessAdd(data, options) {
  return requestPost(gateway + '/IPmmReviewBusiness/saveOrUpdate', data, options)
}

// 评审会删除
export function assessdelete(data, options) {
  return requestPost(gateway + '/IPmmReviewTable/removeByIds', data, options)
}
