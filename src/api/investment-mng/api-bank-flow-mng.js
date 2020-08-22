import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 银行流水 ****/

//自动匹配银行流水
export const bankList = gateway + '/IBankFlowB/page'
export const templateFilePath = gateway+'/IBankFlowB/downBankFlowExcel'
// 删除银行流水
export function deleteBankFlow(data, options) {
    return requestPost(gateway + '/IBankFlowB/deleteBankFlow', data, options)
}
// 自动匹配银行流水
export function autoMatch(data, options) {
    return requestPost(gateway + '/IBankFlowB/autoMatch', data, options)
}
// 复核银行流水
export function reviewBankFlow(data, options) {
    return requestPost(gateway + '/IBankFlowB/reviewBankFlow', data, options)
}
// 取消复核银行流水
export function cancelReviewBankFlow(data, options) {
    return requestPost(gateway + '/IBankFlowB/cancelReviewBankFlow', data, options)
}
// 手动匹配银行流水前查询
export function prepareManualMatch(data, options) {
    return requestPost(gateway + '/IBankFlowB/prepareManualMatch', data, options)
}
// 手动匹配银行流水
export function manualMatch(data, options) {
    return requestPost(gateway + '/IBankFlowB/manualMatch', data, options)
}
// 手动匹配并复核银行流水
export function manualMatchAndReview(data, options) {
    return requestPost(gateway + '/IBankFlowB/manualMatchAndReview', data, options)
}
// 拆分流水
export function setSplitFlow(data, options) {
    return requestPost(gateway + '/IBankFlowB/splitFlow', data, options)
}
//  导入银行流水
export function importMatch(data, options) {
    return requestPost(gateway + '/IBankFlowB/importMatch', data, options)
}
//  准备导入银行流水
export function prepareSplitFlow(data, options) {
    return requestPost(gateway + '/IBankFlowB/prepareSplitFlow', data, options)
}
