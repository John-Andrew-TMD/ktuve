import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

//根据担保方id查询 担保总额和担保余额
export function amountByGuarantorId(data, options) {
  return requestPost(gateway + '/IPmmGuaranteeBusiness/amountByGuarantorId', data, options)
}
//根据项目id查询担保方信息
export const guaranteeListByRecordId = gateway + '/IPmmGuaranteeBusiness/guaranteeListByRecordId'
export function getGuaranteeListByRecordId(data, options) {
  return requestPost(gateway + '/IPmmGuaranteeBusiness/guaranteeListByRecordId', data, options)
}
//根据 ID （批量）删除 担保方信息
export function removeByIds(data, options) {
  return requestPost(gateway + '/IPmmGuaranteeTable/removeByIds', data, options)
}
//插入或更新（批量）担保方信息，以 ID 为条件更新， ID 为空则插入
export function saveOrUpdateBatch(data, options) {
  return requestPost(gateway + '/IPmmGuaranteeTable/saveOrUpdateBatch', data, options)
}
export function addGuarantee(data, options) {
  return requestPost(gateway + '/IPmmGuaranteeBusiness/addGuarantee', data, options)
}
