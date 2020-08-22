import {
  requestPost
} from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 项目-报价方案 ****/

// 根据项目ID查询报价方案
export function getQuotationInfoById(data, options) {
  return requestPost(gateway + '/ICalculator/queryQuotationInfoByRecordId', data, options)
}

// 选择报价后进行关联
export function quotationRelation(data, options) {
  return requestPost(gateway + '/RelationQuotation/choiceQuotationRelation', data, options)
}
