import {
  requestPost
} from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 合同管理 ****/

// 查询合同管理列表
export const contractList = gateway + '/IConContractManageBusiness/page'
// 查询合同列表
export const queryContractList = gateway + '/ICommonContractBusiness/queryContract'

// 查询立项通过且未创建合同的项目列表
export const projectList = gateway + '/IPmmProjectBusiness/queryProjectForCon'

// 选择项目发起合同创建
export function addNewContract(data, options) {
  return requestPost(gateway + '/IConContractManageBusiness/save', data, options)
}

// 合同结束
// export function endContract(data, options) {
//   return requestPost(gateway + '/IPmmProjectBusiness/page', data, options)
// }

// 新增或者修改合同
export function saveContract(data, options) {
  return requestPost(gateway + '/IContractB/saveContract', data, options)
}

// 准备新增合同的数据（合同编号、人员列表等）
export function prepareContract(data, options) {
  return requestPost(gateway + '/IContractB/prepareContract', data, options)
}

// 准备修改合同的数据
export function prepareUpdateContract(data, options) {
  return requestPost(gateway + '/IContractB/prepareContractForUpdate', data, options)
}

// 根据项目管理id查询担保方信息
export function queryGuaranteeByManagerId(data, options) {
  return requestPost(gateway + '/IConPledgeContractBusiness/queryGuaranteeByManagerId', data, options)
}
// 查询合同信息
export function IContractBQueryById(data, options) {
  return requestPost(gateway + '/IContractB/queryById', data, options)
}
// 根据合同管理id查询合同管理信息
export function getContracInfoById(data, options) {
  return requestPost(gateway + '/IConContractManageBusiness/getById', data, options)
}
// 合同审批发起
// export function IConApprovalDetailBusinesstartContractApproval(data, options) {
//   return requestPost(gateway + '/IConApprovalDetailBusiness/startContractApproval', data, options)
// }

// 查询合同审批详情
export const queryApprovalDetail = gateway + '/IConApprovalDetailTable/page'

// 获取合同模板数据
export function getContractTemplateData(data, options) {
  return requestPost(gateway + '/online/getTemplateData', data, options)
}
// 修改签署日期地点
export function ICommonContractBusinessUpdateSigningDateAddr(data, options) {
  return requestPost(gateway + '/ICommonContractBusiness/updateSigningDateAddr', data, options)
}
// 修改签署日期地点
export function ICommonContractBusinesSynProjectQuotation(data, options) {
  return requestPost(gateway + '/ICommonContractBusiness/synProjectQuotation', data, options)
}
// 删除合同
export function IConContractTableRemoveByIds(data, options) {
  return requestPost(gateway + '/IConContractTable/removeByIds', data, options)
}

// 撤销变更
export function cancelContractChange(data, options) {
  return requestPost(gateway + '/IConApprovalDetailBusiness/cancelContractChange', data, options)
}

// 点击合同变更
export function clickContractChange(data, options) {
  return requestPost(gateway + '/IConApprovalDetailBusiness/clickContractChange', data, options)
}

// 判断Irr
export function judgeIrr(data, options) {
  return requestPost(gateway + '/IConApprovalDetailBusiness/judgeIrr', data, options)
}
