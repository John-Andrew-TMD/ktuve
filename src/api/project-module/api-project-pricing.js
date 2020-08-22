import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

//根据模型id查询模型数据
export function ISomPricingModelBusinessGetById(data, options) {
  return requestPost(gateway + '/ISomPricingModelBusiness/getById', data, options)
}
//新增定价模型
export function ISomPricingModelBusinessave(data, options) {
  return requestPost(gateway + '/ISomPricingModelBusiness/save', data, options)
}
//翻页查询定价模型
export const ISomPricingModelTableList = gateway + '/ISomPricingModelTable/page'
export function ISomPricingModelTablePage(data, options) {
  return requestPost(gateway + '/ISomPricingModelTable/page', data, options)
}
//根据ID批量删除定价模型
export function ISomPricingModelTableRemoveByIds(data, options) {
  return requestPost(gateway + '/ISomPricingModelTable/removeByIds', data, options)
}
//更新模型名称或启用状态
export function ISomPricingModelTableUpdateById(data, options) {
  return requestPost(gateway + '/ISomPricingModelTable/updateById', data, options)
}
//模型数据维护
export function ISomPricingModelBusinessMaintainModel(data, options) {
  return requestPost(gateway + '/ISomPricingModelBusiness/maintainModel', data, options)
}
//模型新增参数
export function ISomPricingModelBusinessAddModelParameter(data, options) {
  return requestPost(gateway + '/ISomPricingModelBusiness/addModelParameter', data, options)
}

//新增定价测算
export function PriceBusinessave(data, options) {
  return requestPost(gateway + '/PriceBusiness/save', data, options)
}
//批量删除定价
export function IPmmPriceTableRemoveByIds(data, options) {
  return requestPost(gateway + '/IPmmPriceTable/removeByIds', data, options)
}
//查询定价测算明细
export function PriceBusinessQueryPriceDetailed(data, options) {
  return requestPost(gateway + '/PriceBusiness/queryPriceDetailed', data, options)
}
//新增定价测算明细
export function PriceBusinessavePriceDetailed(data, options) {
  return requestPost(gateway + '/PriceBusiness/savePriceDetailed', data, options)
}
//修改定价测算明细
export function PriceBusinessUpdatePriceDetailed(data, options) {
  return requestPost(gateway + '/PriceBusiness/updatePriceDetailed', data, options)
}
//翻页查询 对象列表
export const PriceBusinessPage = gateway + '/PriceBusiness/page'
export function getPriceBusinessPage(data, options) {
  return requestPost(gateway + '/PriceBusiness/page', data, options)
}
//查询项目利率信息
export const PriceBusinessQueryProjectPrimeRateInfo = gateway + '/PriceBusiness/queryProjectPrimeRateInfo'
export function getPriceBusinessQueryProjectPrimeRateInfo(data, options) {
  return requestPost(gateway + '/PriceBusiness/queryProjectPrimeRateInfo', data, options)
}

//查询优惠利率审批详情
export function getPriceBusinessQueryPrimeRate(data, options) {
  return requestPost(gateway + '/PriceBusiness/queryPrimeRate', data, options)
}


//优惠利率
export function getPriceBusinesSavePrimeRate(data, options) {
  return requestPost(gateway + '/PriceBusiness/savePrimeRate', data, options)
}

//根据项目id查询所有报价方案
export const PriceBusinessQueryQuotationByProjectId = gateway + '/PriceBusiness/queryQuotationByProjectId'
