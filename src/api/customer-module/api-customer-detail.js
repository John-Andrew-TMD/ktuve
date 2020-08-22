import {
  requestPost
} from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 客户管理-基本信息页签 ****/
// 风报信息同步
export function customerInfoSync(data, options) {
  return requestPost(gateway + '/IWindReportBusiness/synWindInfo', data, options)
}

// 风报-关注用户
export function followUser(data, options) {
  return requestPost(gateway + '/IWindReportBusiness/follow', data, options)
}

// 风报-关注用户
export function unfollowUser(data, options) {
  return requestPost(gateway + '/IWindReportBusiness/cancelFollow', data, options)
}
// 客户修改
export function customerUpdate(data, options) {
  return requestPost(gateway + '/ICrmCustBasicInformationBusiness/updateById', data, options)
}

// 客户信息修改流程发起
export function customerInfoApprove(data, options) {
  return requestPost(gateway + '/ICrmCustBasicInformationBusiness/startCustInfoFlow', data, options)
}

// 根据id查询客户
export function getCustomerById(data, options) {
  return requestPost(gateway + '/ICrmCustBasicInformationBusiness/getById', data, options)
}

// 银行账户列表
export function customerBankList(data, options) {
  return requestPost(gateway + '/ICrmBankAccountTable/page', data, options)
}

// 银行账户列表-客户模块基本信息页签
export const getCustomerBankList = gateway + '/ICrmBankAccountTable/page'

// 添加银行账户
export function customerBankAdd(data, options) {
  return requestPost(gateway + '/ICrmBankAccountTable/save', data, options)
}

// 修改银行账户
export function customerBankUpdate(data, options) {
  return requestPost(gateway + '/ICrmBankAccountTable/updateById', data, options)
}

// 删除银行账户
export function customerBankDelete(data, options) {
  return requestPost(gateway + '/ICrmBankAccountTable/removeByIds', data, options)
}

// 股东信息列表
export const customerShareholderList = gateway + '/ICrmShareholderInfoTable/page'

// 股东信息列表
export function getCustomerShareholderList(data, options) {
  return requestPost(gateway + '/ICrmShareholderInfoTable/page', data, options)
}

// 添加股东信息
export function customerShareholderAdd(data, options) {
  return requestPost(gateway + '/ICrmShareholderInfoTable/save', data, options)
}

// 修改股东信息
export function customerShareholderUpdate(data, options) {
  return requestPost(gateway + '/ICrmShareholderInfoTable/updateById', data, options)
}

// 删除股东信息
export function customerShareholderDelete(data, options) {
  return requestPost(gateway + '/ICrmShareholderInfoTable/removeByIds', data, options)
}

// 常用联系人列表
export const customerContactList = gateway + '/ICrmContactInfoTable/page'

// 添加常用联系人
export function customerContactAdd(data, options) {
  return requestPost(gateway + '/ICrmContactInfoTable/save', data, options)
}

// 修改常用联系人
export function customerContactUpdate(data, options) {
  return requestPost(gateway + '/ICrmContactInfoTable/updateById', data, options)
}

// 删除常用联系人
export function customerContactDelete(data, options) {
  return requestPost(gateway + '/ICrmContactInfoTable/removeByIds', data, options)
}

// 查询开票信息
export function getBillInfoById(data, options) {
  return requestPost(gateway + '/ICrmInvoiceInformationBusiness/getById', data, options)
}
// 更新开票信息
export function billInfoUpdate(data, options) {
  return requestPost(gateway + '/ICrmInvoiceInformationTable/updateById', data, options)
}
// 开票信息获取银行列表
export const getBillBankList = gateway + '/ICrmBankAccountTable/page'

/** ** 客户管理-关联关系页签 ****/
// 关联关系列表
export const custAssociationList = gateway + '/ICrmRelationShipBusiness/page'

// 关联关系列表-修旧对比
export function getCustAssociationList(data, options) {
  return requestPost(gateway + '/ICrmRelationShipBusiness/page', data, options)
}

// 添加关联关系
export function custAssociationAdd(data, options) {
  return requestPost(gateway + '/ICrmRelationShipBusiness/save', data, options)
}

// 修改关联关系
export function custAssociationUpdate(data, options) {
  return requestPost(gateway + '/ICrmRelationShipTable/updateById', data, options)
}

// 删除关联关系
export function custAssociationDelete(data, options) {
  return requestPost(gateway + '/ICrmRelationShipTable/removeByIds', data, options)
}

/** ** 客户管理-客户跟进页签 ****/
// 客户跟进列表
export const custMoneyLaunderingRatingList = gateway + '/ICrmAmlRatingTable/page'

/** ** 客户管理-客户跟进页签 ****/
// 客户跟进列表
export const custFollowUpList = gateway + '/ICrmCustFollowUpTable/page'

// 新增客户跟进
export function custFollowUpAdd(data, options) {
  return requestPost(gateway + '/ICrmCustFollowUpTable/save', data, options)
}

// 修改客户跟进
export function custFollowUpUpdate(data, options) {
  return requestPost(gateway + '/ICrmCustFollowUpTable/updateById', data, options)
}

// 删除客户跟进
export function custFollowUpDelete(data, options) {
  return requestPost(gateway + '/ICrmCustFollowUpTable/removeByIds', data, options)
}

/** ** 客户管理-历史项目页签 ****/
// 历史项目列表
export const custHistoryList = gateway + '/IPmmProjectBusiness/queryProjectByCustId'

/** ** 客户管理-业务经理页签 ****/
// 业务经理列表
export const custManagerList = gateway + '/ICrmServiceManagerTable/page'

/** ** 客户管理-动态信息页签 ****/
// 动态信息列表
export const activeNewsList = gateway + '/IWindReportBusiness/dynamicInfo'

// 更新动态信息
export function activeNewsUpdate(data, options) {
  return requestPost(gateway + '/IWindReportBusiness/feed', data, options)
}

/** ** 客户管理-财务状况页签 ****/
// 财务状况列表
export const custFinanceList = gateway + '/ICrmFinConditionTable/page'

// 删除财务状况
export function custFinanceDelete(data, options) {
  return requestPost(gateway + '/ICrmFinConditionBusiness/removeByIds', data, options)
}

// 新增财务状况
export function custFinanceAdd(data, options) {
  return requestPost(gateway + '/ICrmFinConditionBusiness/save', data, options)
}

// 修改财务状况
export function custFinanceUpdate(data, options) {
  return requestPost(gateway + '/ICrmFinConditionBusiness/updateById', data, options)
}
// 导出财务报表
export const exportFinanceReport = gateway + '/ICrmBatchDownloadFile/batchDownloadFile'

// 下载财务状况模板
export const custFinanceTemplateDownloadUrl = gateway + '/ICrmFinConditionBusiness/downExcel'

// 查询偿债能力数据
export function getDebtPayingAbility(data, options) {
  return requestPost(gateway + '/ICrmFinSovencyTable/listByFinIds', data, options)
}

// 查询盈利能力数据
export function getProfitAbility(data, options) {
  return requestPost(gateway + '/ICrmFinProfitabilityTable/listByFinIds', data, options)
}

// 营运能力数据
export function getOperationCapacity(data, options) {
  return requestPost(gateway + '/ICrmFinOperationTable/listByFinIds', data, options)
}

// 成长能力数据
export function getGrowthAbility(data, options) {
  return requestPost(gateway + '/ICrmFinGrowthAbilityTable/listByFinIds', data, options)
}

// 资产负债表数据
export function getBalanceSheet(data, options) {
  return requestPost(gateway + '/ICrmFinBalanceSheetDataTable/list', data, options)
}

// 收入支出表数据
export function getIncomeExpense(data, options) {
  return requestPost(gateway + '/ICrmFinInExTable/list', data, options)
}

// 利润表数据
export function getProfitStatement(data, options) {
  return requestPost(gateway + '/ICrmFinProfitDataTable/list', data, options)
}

// 现金流量表数据
export function getCashFlowStatement(data, options) {
  return requestPost(gateway + '/ICrmFinCashFlowDataTable/list', data, options)
}

/** ** 客户管理-资料页签 ****/
// 附件列表
export const getAttachmentList = gateway + '/IDataAttachmentBusiness/page'

// 获取资料附件类型
export function getAttachmentType(data, options) {
  return requestPost(gateway + '/IDataAttachmentBusiness/getByCustCategory', data, options)
}

// 资料附件保存
export function attachmentSave(data, options) {
  return requestPost(gateway + '/IDataAttachmentBusiness/save', data, options)
}

// 资料附件删除
export function attachmentDelete(data, options) {
  return requestPost(gateway + '/IDataAttachmentBusiness/removeByIds', data, options)
}

/** ** 客户管理-审批详情 ****/
// 审批列表
export const getApprovalList = gateway + '/ICrmApprovalDetailTable/page'
