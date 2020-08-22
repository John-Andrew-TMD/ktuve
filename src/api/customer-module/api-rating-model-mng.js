import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 评级模型管理 ****/

// 模型列表
export const modelList = gateway + '/ICrmEvaluateModelBusiness/page'

// 模型删除
export function modelDelete(data, options) {
  return requestPost(gateway + '/ICrmEvaluateModelTable/removeByIds', data, options)
}

// 模型新增
export function modelAdd(data, options) {
  return requestPost(gateway + '/ICrmEvaluateModelBusiness/save', data, options)
}

// 模型修改
export function modelUpdate(data, options) {
  return requestPost(gateway + '/ICrmEvaluateModelTable/updateById', data, options)
}

// 模型详情定性|定量数据修改
export function modelDataUpdate(data, options) {
  return requestPost(gateway + '/ICrmEvaluateModelBusiness/updateById', data, options)
}

// 根据id查询模型
export function getModelById(data, options) {
  return requestPost(gateway + '/ICrmEvaluateModelBusiness/getByModelId', data, options)
}

// 评级结果列表
export function ratingResultList(data, options) {
  return requestPost(gateway + '/ICrmEvaluateResultTable/list', data, options)
}

// 根据id删除某一条评级结果
export function ratingResultDeleteById(data, options) {
  return requestPost(gateway + '/ICrmEvaluateResultTable/removeByIds', data, options)
}

// 评级结果插入或更新
export function ratingResultUpdate(data, options) {
  return requestPost(gateway + '/ICrmEvaluateResultTable/saveOrUpdateBatch', data, options)
}
