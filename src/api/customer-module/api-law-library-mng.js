import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 律师库 ****/

// 律师库列表
export const lawLibrary = gateway + '/ISysCrmLawyerBusiness/page'

// 律师库新增
export function lawLibraryAdd(data, options) {
  return requestPost(gateway + '/ISysCrmLawyerTable/save', data, options)
}

// 律师库导入批量新增
export function lawLibraryAddBatch(data, options) {
  return requestPost(gateway + '/ISysCrmLawyerBusiness/importLawyer', data, options)
}

// 律师库修改
export function lawLibraryUpdate(data, options) {
  return requestPost(gateway + '/ISysCrmLawyerTable/updateById', data, options)
}

// 律师库删除
export function lawLibraryDelete(data, options) {
  return requestPost(gateway + '/ISysCrmLawyerTable/removeByIds', data, options)
}
