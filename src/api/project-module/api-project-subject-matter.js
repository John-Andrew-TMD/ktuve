import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

// 根据项目id查询租赁物信息
export const querySubjectMatter = gateway + '/IPmmLeaseTable/page'

// 新增一条租赁物信息
export function addSubjectMatter(data, options) {
  return requestPost(gateway + '/IPmmLeaseTable/save', data, options)
}

// 更新租赁物信息
export function updateSubjectMatter(data, options) {
  return requestPost(gateway + '/IPmmLeaseTable/updateById', data, options)
}

// 删除租赁物信息
export function deleteSubjectMatter(data, options) {
  return requestPost(gateway + '/IPmmLeaseTable/removeByIds', data, options)
}
// 导入
export function saveBatch(data, options) {
  return requestPost(gateway + '/IPmmLeaseBusiness/saveBatch', data, options)
}

//同步项目数据
export function synchronizeProject(data, options) {
  return requestPost(gateway + '/IPmmLeaseBusiness/synchronizeProject', data, options)
}