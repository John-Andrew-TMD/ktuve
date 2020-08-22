import {
  requestPost
} from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 客户评级 ****/

// 客户评级列表
export const custRatingList = gateway + '/ICrmCustEvaluateBusiness/page'

// 查询历史评级
export function getHistoryRating(data, options) {
  return requestPost(gateway + '/ICrmCustEvaluateBusiness/getByCustId', data, options)
}

// 根据客戶id查询评级打分详情
export function getRatingDetail(data, options) {
  return requestPost(gateway + '/ICrmCustEvaluateBusiness/queryEvaluateByCustId', data, options)
}

// 根据评级id和客戶id查询评级打分详情
export function getScoreList(data, options) {
  return requestPost(gateway + '/ICrmCustEvaluateBusiness/getById', data, options)
}

// 查询评级模型列表
export const getModelList = gateway + '/ICrmCustEvaluateBusiness/queryModelName'

// 根据模型ID查询模型详情（模型名称、定性、定量指标）
export function getModelById(data, options) {
  return requestPost(gateway + '/ICrmEvaluateModelBusiness/getByModelId', data, options)
}
// 查询模型信息
export function getModelInfoById(data, options) {
  return requestPost(gateway + '/ICrmEvaluateModelTable/getById', data, options)
}
// 查询所有没有评级过的客户
export const getCustList = gateway + '/ICrmCustEvaluateBusiness/queryCust'

// 发起评级
export function modelLaunch(data, options) {
  return requestPost(gateway + '/ICrmCustEvaluateBusiness/saveListByEvaluate', data, options)
}
// 变更评级
export function modelChange(data, options) {
  return requestPost(gateway + '/ICrmCustEvaluateBusiness/updateStatusById', data, options)
}
// 保存模型及定性定量数据
export function scoreModelSave(data, options) {
  return requestPost(gateway + '/ICrmCustEvaluateBusiness/save', data, options)
}

// 保存模型及定性定量数据并发起审批
export function scoreModelSaveAndApproval(data, options) {
  return requestPost(gateway + '/ICrmCustEvaluateBusiness/saveApproval', data, options)
}

// 变更模型
export function scoreModelChange(data, options) {
  return requestPost(gateway + '/ICrmCustEvaluateBusiness/updateStatusById', data, options)
}

// 撤销变更
export function scoreModelCancelChange(data, options) {
  return requestPost(gateway + '/ICrmCustEvaluateBusiness/evaluateRevoke', data, options)
}

// 根据条件查询评级结果选项
export function ratingResultList(data, options) {
  return requestPost(gateway + '/ICrmEvaluateResultTable/list', data, options)
}

// 更新模型信息
export function modelNumberUpdate(data, options) {
  return requestPost(gateway + '/ICrmCustEvaluateBusiness/updateModelUseTime', data, options)
}
