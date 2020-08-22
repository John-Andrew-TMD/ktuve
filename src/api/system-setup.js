import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_KISSO_GETEWAY

const dictGateway = process.env.VUE_APP_KOCA_GETEWAY

/** ** 接口管理 ****/
// 获取接口列表
export const interfaceList = gateway + '/ISysInterfaceTable/page'

// api分组
export function interfaceGroup(data, options) {
  return requestPost(gateway + '/ISysInterfaceBusiness/listGroup', data, options)
}

// 根据serverName+apiName 查询接口列表
export const getInterfaceByName = gateway + '/ISysInterfaceBusiness/listInterface '

// 接口新增
export function interfaceAdd(data, options) {
  return requestPost(gateway + '/ISysInterfaceBusiness/save', data, options)
}

// 接口修改
export function interfaceUpdate(data, options) {
  return requestPost(gateway + '/ISysInterfaceBusiness/updateById', data, options)
}

// 接口删除
export function interfaceDelete(data, options) {
  return requestPost(gateway + '/ISysInterfaceTable/delete', data, options)
}

// 根据 ID 查询接口
export function getInterfaceById(data, options) {
  return requestPost(gateway + '/ISysInterfaceBusiness/getById', data, options)
}

// 接口绑定菜单
export function bindMenu(data, options) {
  return requestPost(gateway + '/ISysInterfaceBusiness/bindMenu', data, options)
}

/** ** 菜单管理 ****/
// 获取菜单列表
export function menuList(data, options) {
  return requestPost(gateway + '/ISysMenuBusiness/list', data, options)
}

// 获取菜单树
export function getMenuTree(data, options) {
  return requestPost(gateway + '/ISysMenuBusiness/getMenuTree', data, options)
}

// 菜单新增
export function menuAdd(data, options) {
  return requestPost(gateway + '/ISysMenuBusiness/save', data, options)
}

// 菜单修改
export function menuUpdate(data, options) {
  return requestPost(gateway + '/ISysMenuBusiness/updateById', data, options)
}

// 接口删除
export function menuDelete(data, options) {
  return requestPost(gateway + '/ISysMenuBusiness/delete', data, options)
}

// 根据 ID 查询菜单
export function getMenuById(data, options) {
  return requestPost(gateway + '/ISysMenuBusiness/getById ', data, options)
}

/** ** 模块管理 ****/
// 模块新增
export function moduleAdd(data, options) {
  return requestPost(gateway + '/ISysModuleBusiness/save', data, options)
}

// 模块修改
export function moduleUpdate(data, options) {
  return requestPost(gateway + '/ISysModuleBusiness/updateById', data, options)
}

// 模块删除
export function moduleDelete(data, options) {
  return requestPost(gateway + '/ISysModuleTable/delete', data, options)
}

// 根据 ID 查询模块
export function getModuleById(data, options) {
  return requestPost(gateway + '/ISysModuleTable/getById', data, options)
}

/** ** 日志管理 ****/
export const logList = gateway + '/ISysLogBusiness/page'

/** ** 业务词库管理 ****/
// 获取公共字段列表
export const fieldList = gateway + '/ISysBusinessFieldBusiness/page'

// 字段新增
export function fieldAdd(data, options) {
  return requestPost(gateway + '/ISysBusinessFieldBusiness/save', data, options)
}

// 字段修改
export function fieldUpdate(data, options) {
  return requestPost(gateway + '/ISysBusinessFieldBusiness/updateById', data, options)
}

// 字段删除
export function fieldDelete(data, options) {
  return requestPost(gateway + '/ISysBusinessFieldBusiness/delete', data, options)
}

// 根据 ID 查询字段
export function getFieldById(data, options) {
  return requestPost(gateway + '/ISysBusinessFieldBusiness/getById', data, options)
}

// 字段绑定
export function fieldBind(data, options) {
  return requestPost(gateway + '/ISysBusinessFieldBusiness/bindTable', data, options)
}

// 获取DB表
export function getDBTableList(data, options) {
  return requestPost(gateway + '/ISysBusinessFieldBusiness/getTableList', data, options)
}

/** ** 字典管理 ****/
// 父字典项列表
export const dictList = gateway + '/dict/query/page'

// 子字典项列表
export const dictItemList = gateway + '/dict/item/query/page'

// 父字典项新增
export const parentDictAdd = gateway + '/dict/add'

// 父字典项修改
export const parentDictUpdate = gateway + '/dict/update'

// 父字典项删除
export const parentDictDelete = gateway + '/dict/delete'

// 子字典项新增
export const childDictAdd = gateway + '/dict/item/add'

// 子字典项修改
export const childDictUpdate = gateway + '/dict/item/update'

// 子字典项删除
export const childDictDelete = gateway + '/dict/item/delete'

// 获取字典项缓存
export function getDictCache(data, options) {
  return requestPost(gateway + '/cache/dict/query', data, options)
}

/** ** 密码策略 ****/
// 密码策略列表
export function passwordStrategyList(data, options) {
  return requestPost(gateway + '/ISysPasswordStrategyTable/list', data, options)
}

// 密码策略新增
export function passwordStrategyAdd(data, options) {
  return requestPost(gateway + '/ISysPasswordStrategyBusiness/save', data, options)
}



