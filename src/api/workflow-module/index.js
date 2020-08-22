import { requestGet, requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_WORKFLOW_GETEWAY

/** ** 工作流 ****/
// 获取待办流程信息
export function getFlowInfo(data, options) {
  return requestPost(gateway + '/ISysWorkFlowRunningBusiness/getTaskInfo', data, options)
}

// 获取已办，我发起的流程信息
export function getHandledFlowInfo(data, options) {
  return requestPost(gateway + '/ISysWorkFlowRunningBusiness/getFormInfoByProcessId', data, options)
}

// 流程下一步
export function setFlowNext(data, options) {
  return requestPost(gateway + '/ISysWorkFlowRunningBusiness/completeTask', data, options)
}

// 流程退回
export function setFlowBack(data, options) {
  return requestPost(gateway + '/ISysWorkFlowRunningBusiness/rollback', data, options)
}

// 流程驳回
export function setFlowReject(data, options) {
  return requestPost(gateway + '/ISysWorkFlowRunningBusiness/rejectToStart', data, options)
}

// 流程否决
export function setFlowStop(data, options) {
  return requestPost(gateway + '/ISysWorkFlowRunningBusiness/endProcess', data, options)
}

// 获取代办流程表单
export function getFlowFormData(data, options) {
  return requestGet(gateway + '/workflow/history/processInstanceDetail', data, options)
}

// 获取流程图数据
export function getFlowImageData(data, options) {
  return requestGet(gateway + '/workflow/coordinate/processInstance', data, options)
}

// 获取流程图热点数据
export function getFlowHotAreaData(data, options) {
  return requestGet(gateway + '/workflow/task/instanceDiagramData', data, options)
}

// 获取流程审批环节数据
export function getFlowApprovalNodesData(data, options) {
  return requestGet(gateway + '/workflow/history/proInstanceTasks', data, options)
}

// 获取流程审批历史数据
export function getFlowApprovalHistoryData(data, options) {
  return requestGet(gateway + '/workflow/history/historyCommentList', data, options)
}

// 获取待办数据
export function getFlowTodoTaskData(data, options) {
  return requestPost(gateway + '/workflow/task/todoTaskListPage', data, options)
}

// 获取已办数据
export function getFlowDoneTaskData(data, options) {
  return requestPost(gateway + '/workflow/task/doneTasksPage', data, options)
}

// 获取我发起数据
export function getFlowMineStartedTaskData(data, options) {
  return requestPost(gateway + '/workflow/task/myStartedProcessPage', data, options)
}

// 获取各个业务模块流程详情
export const getModuleFlowHistoryList = gateway + '/IWkfHistoryBusiness/pageByBusinessId'
