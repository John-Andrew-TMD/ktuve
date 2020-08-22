import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 客户管理 ****/

// 客户列表
export const customerList = gateway + '/ICrmCustBasicInformationBusiness/page'

// 查询客户列表
export function getcustomerList(data, options) {
  return requestPost(gateway + '/ICrmCustBasicInformationBusiness/page', data, options)
}

// 客户新增
export function customerAdd(data, options) {
  return requestPost(gateway + '/ICrmCustBasicInformationBusiness/save', data, options)
}

export const searchCompany = gateway + '/IWindReportBusiness/searchCompany'

// 查询同部门下的员工列表
export const getDepartmentUser = gateway + '/ICrmCustTransferBusiness/getSourceDepartmentUser'

// 查询全部业务部门员工列表
export function getAllDepartmentUser(data, options) {
  return requestPost(gateway + '/ICrmCustTransferBusiness/getAllDepartmentUser', data, options)
}

// 客户移交
export function customerTransfer(data, options) {
  return requestPost(gateway + '/ICrmCustTransferBusiness/transfer', data, options)
}

// 客户移交流程修改
export function customerTransferUpdate(data, options) {
  return requestPost(gateway + '/ICrmCustTransferBusiness/update', data, options)
}

// 客户删除
export function customerDelete(data, options) {
  return requestPost(gateway + '/ICrmCustBasicInformationTable/removeByIds', data, options)
}


/** ** 集团客户管理 ****/

// 集团客户列表
export const groupCustomerList = gateway + '/ISysCrmBlocBusiness/page'

// 集团客户新增
export function groupCustomerAdd(data, options) {
  return requestPost(gateway + '/ISysCrmBlocBusiness/save', data, options)
}

// 更改集团客户id，在新增集团被驳回时，调用此接口修改集团客户id
export function groupCustomerUpdate(data, options) {
  return requestPost(gateway + '/ISysCrmBlocBusiness/updateBloc', data, options)
}

// 集团客户删除
export function groupCustomerDelete(data, options) {
  return requestPost(gateway + '/ISysCrmBlocBusiness/removeByIds', data, options)
}

// 根据id查找集团客户
export function getgGroupCustomerById(data, options) {
  return requestPost(gateway + '/ISysCrmBlocBusiness/getById', data, options)
}

// 集团成员新增
export function groupMemberAdd(data, options) {
  return requestPost(gateway + '/ISysCrmBlocMemberBusiness/save', data, options)
}

// 集团成员删除
export function groupMemberDelete(data, options) {
  return requestPost(gateway + '/ISysCrmBlocMemberBusiness/removeByIds', data, options)
}

// 集团成员删除撤销
export function groupMemberRevoke(data, options) {
  return requestPost(gateway + '/ISysCrmBlocMemberBusiness/revokeDelMember', data, options)
}

// 集团成员维护审批
export function groupMemberApprove(data, options) {
  return requestPost(gateway + '/ISysCrmBlocBusiness/startBlocMemberEditFlow', data, options)
}

// 添加集团|维护集团成员客户选择
export const getGroupCustList = gateway + '/ISysCrmBlocBusiness/getCustList'

// 检查集团审核状态
export function checkBlocStatus(data, options) {
  return requestPost(gateway + '/ISysCrmBlocBusiness/checkBlocStatus', data, options)
}

// 集团维护审批流程第一个节点数据保存
export function groupMemberFirstNodeDataSave(data, options) {
  return requestPost(gateway + '/ISysCrmBlocBusiness/saveCommentMessageAndFiles', data, options)
}

/** ** 黑名单、评估机构、律师所模板下载 ****/

// 模板下载
export const templateDownloadUrl = gateway + '/ITSysCrmBlacklistBusiness/downExcel'
