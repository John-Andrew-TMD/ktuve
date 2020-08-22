import {
  requestPost
} from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 报价方案 ****/

// 报价方案列表
export const quotationList = gateway + '/RelationQuotation/page'

// 删除报价方案
export function quotationDelete(data, options) {
  return requestPost(gateway + '/IQuotationLeaseT/removeById', data, options)
}

// 查询报价方案
export function getQuotationInfo(data, options) {
  return requestPost(gateway + '/ICalculator/queryQuotationInfoById', data, options)
}
// 查询报价方案
export function getQuotationRecordInfo(data, options) {
  return requestPost(gateway + '/ICalculator/queryQuotationInfoByRecordId', data, options)
}
// 计算报价方案
export function quotationCalculate(data, options) {
  return requestPost(gateway + '/ICalculator/getQuotationInfo', data, options)
}

// 等额本金、等额租金-保存报价方案
export function quotationSave(data, options) {
  return requestPost(gateway + '/ICalculator/calculate', data, options)
}

// 不规则-保存报价方案
export function quotationCustomSave(data, options) {
  return requestPost(gateway + '/ICalculator/calculateImport', data, options)
}

// 修改报价方案
export function quotationUpdate(data, options) {
  return requestPost(gateway + '/ICalculator/updateQuotationInfo', data, options)
}

// 租金调整
export function quotationAdjust(data, options) {
  return requestPost(gateway + '/ICalculator/calculateAdjust', data, options)
}

// 查询生效的利率
export function getInterestRate(data, options) {
  return requestPost(gateway + '/ISomBenchmarkTypeTable/listEffective', data, options)
}

// 模板下载路径
export const templateFilePath = gateway + '/ICommonDownloadTempFile/downTemp'

// 报价方案导入
export function quotationImport(data, options) {
  return requestPost(gateway + '/ICalculator/getCalculateImportData', data, options)
}

// 导出
export const quotationExportPath = gateway + '/Export/exportQuotation'
