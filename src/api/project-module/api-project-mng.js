import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 项目管理 ****/

// 项目列表
export const projectList = gateway + '/IPmmProjectBusiness/page'

// 查询项目列表
export function getprojectList(data, options) {
  return requestPost(gateway + '/IPmmProjectBusiness/page', data, options)
}

// 项目新增
export function projectAdd(data, options) {
  return requestPost(gateway + '/IPmmProjectBusiness/addProject', data, options)
}

// 根据项目基本信息id查询项目基本信息
export function projectInfoId(data, options) {
  return requestPost(gateway + '/IPmmProjectBusiness/queryByRecordId', data, options)
}
// 根据 ID （批量）删除其他押品信息
export function removeByIds(data, options) {
  return requestPost(gateway + '/IPmmProjectTable/removeByIds', data, options)
}
// 保存修改后的项目信息
export function getUpdateById(data, options) {
  return requestPost(gateway + '/IPmmProjectTable/updateById', data, options)
}
// 判断项目编号是否重复
export function queryProjectNo(data, options) {
  return requestPost(gateway + '/IPmmProjectBusiness/queryProjectNo', data, options)
}
// 发起项目立项
export function projectFound(data, options) {
  return requestPost(gateway + '/IPmmProjectBusiness/initiateProjectFound', data, options)
}

// 发起项目审批
export function projectApproval(data, options) {
  return requestPost(gateway + '/IPmmProjectBusiness/initiateProjectApproval', data, options)
}
// 发起项目变更
export function projectChange(data, options) {
  return requestPost(gateway + '/IProjectChange/clickProjectChange', data, options)
}

// 项目变更提交
export function projectChangeSubmit(data, options) {
  return requestPost(gateway + '/IProjectChange/initiateProjectChange', data, options)
}

// 撤销项目变更
export function projectChangeCancel(data, options) {
  return requestPost(gateway + '/IProjectChange/undoProjectChange', data, options)
}

// 项目审批详情
export const projectApprovalDetail = gateway + '/IPmmApprovalDetailTable/page'
