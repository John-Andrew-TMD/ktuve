import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 评估机构 ****/

// 评估机构列表
export const agencyList = gateway + '/ISysAssessAgencyBusiness/page'

// 评估机构新增
export function agencyAdd(data, options) {
  return requestPost(gateway + '/ISysAssessAgencyTable/save', data, options)
}

// 评估机构导入批量新增
export function agencyAddBatch(data, options) {
  return requestPost(gateway + '/ISysAssessAgencyBusiness/importAssessAgency', data, options)
}

// 评估机构修改
export function agencyUpdate(data, options) {
  return requestPost(gateway + '/ISysAssessAgencyTable/updateById', data, options)
}

// 评估机构删除
export function agencyDelete(data, options) {
  return requestPost(gateway + '/ISysAssessAgencyTable/removeByIds', data, options)
}
