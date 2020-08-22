import {
  requestPost
} from 'utils/fetch.js'

const gateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 客户性质维护配置 ****/

// 客户性质维护列表
export const custNatureList = gateway + '/ITSysSomCustomerNatureTable/page'

// 客户性质维护新增
export function custNatureAdd(data, options) {
  return requestPost(gateway + '/ITSysSomCustomerNatureTable/save', data, options)
}

// 客户性质维护修改
export function custNatureUpdate(data, options) {
  return requestPost(gateway + '/ITSysSomCustomerNatureTable/updateById', data, options)
}

// 客户性质维护删除
export function custNatureDelete(data, options) {
  return requestPost(gateway + '/ITSysSomCustomerNatureTable/removeByIds', data, options)
}
