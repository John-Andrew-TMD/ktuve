import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_KISSO_GETEWAY

/** ** 租户管理 ****/
// 获取租户列表
export function tenantList(data, options) {
  return requestPost(gateway + '/ISysTenantBusiness/getTenantTree', data, options)
}

// 租户新增
export function tenantAdd(data, options) {
  return requestPost(gateway + '/ISysTenantBusiness/save', data, options)
}

// 租户修改
export function tenantUpdate(data, options) {
  return requestPost(gateway + '/ISysTenantBusiness/updateById', data, options)
}

// 租户删除
export function tenantDelete(data, options) {
  return requestPost(gateway + '/ISysTenantTable/delete', data, options)
}

// 根据 ID 查询租户对象
export function getTenantById(data, options) {
  return requestPost(gateway + '/ISysTenantTable/getById', data, options)
}

// 数据源新增
export function tenantDataSourceAdd(data, options) {
  return requestPost(gateway + '/ISysDataSourceBusiness/save', data, options)
}

// 数据源修改
export function tenantDataSourceUpdate(data, options) {
  return requestPost(gateway + '/ISysDataSourceBusiness/updateById', data, options)
}

// 数据源删除
export function tenantDataSourceDelete(data, options) {
  return requestPost(gateway + '/ISysDataSourceBusiness/delete', data, options)
}

// 根据 ID 查询数据源
export function getTenantDataSourceById(data, options) {
  return requestPost(gateway + '/ISysDataSourceBusiness/getById', data, options)
}

// 新增租户初始管理员
export function tenantAdminAdd(data, options) {
  return requestPost(gateway + '/ISysUserBusiness/createTenantAdmin', data, options)
}

// 修改租户初始管理员
export function tenantAdminUpdate(data, options) {
  return requestPost(gateway + '/ISysUserBusiness/updateTenantAdmin', data, options)
}

// 据租户id 获取租户管理员信息
export function getTenantAdminById(data, options) {
  return requestPost(gateway + '/ISysUserBusiness/getTenantAdminByTenantId', data, options)
}

// 获取新增租户根管理员时，角色的配置信息
export function getRootAdminRoleConfig(data, options) {
  return requestPost(gateway + '/ISysRoleBusiness/getRootAdminRoleConfig', data, options)
}

/** ** 部门管理 ****/
// 获取部门列表
export function departmentList(data, options) {
  return requestPost(gateway + '/ISysDepartmentBusiness/list', data, options)
}

// 获取部门树形列表
export function departmentTree(data, options) {
  return requestPost(gateway + '/ISysDepartmentBusiness/getDeptTree', data, options)
}

// 部门新增
export function departmentAdd(data, options) {
  return requestPost(gateway + '/ISysDepartmentBusiness/save', data, options)
}

// 部门修改
export function departmentUpdate(data, options) {
  return requestPost(gateway + '/ISysDepartmentBusiness/updateById', data, options)
}

// 部门删除
export function departmentDelete(data, options) {
  return requestPost(gateway + '/ISysDepartmentBusiness/delete', data, options)
}

// 根据 ID 查询部门
export function getDepartmentById(data, options) {
  return requestPost(gateway + '/ISysDepartmentTable/getById', data, options)
}

/** ** 角色管理 ****/
// 获取角色列表
export function roleList(data, options) {
  return requestPost(gateway + '/ISysRoleBusiness/page', data, options)
}

// 角色新增
export function roleAdd(data, options) {
  return requestPost(gateway + '/ISysRoleBusiness/save', data, options)
}

// 角色修改
export function roleUpdate(data, options) {
  return requestPost(gateway + '/ISysRoleBusiness/updateById', data, options)
}

// 角色删除
export function roleDelete(data, options) {
  return requestPost(gateway + '/ISysRoleBusiness/delete', data, options)
}

// 根据 ID 查询角色
export function getRoleById(data, options) {
  return requestPost(gateway + '/ISysRoleBusiness/getById', data, options)
}

// 获取角色配置信息
export function getAuthConfig(data, options) {
  return requestPost(gateway + '/ISysRoleBusiness/getRoleAuthorityConfig', data, options)
}

export function getReportPermissionByRoleId(data, options) {
  return requestPost(gateway + '/ISysRoleBusiness/getReportPermissionByRoleId', data, options)
}

// 角色权限修改
export function roleUpdatePermission(data, options) {
  return requestPost(gateway + '/ISysRoleBusiness/updatePermission', data, options)
}

// 根据菜单id 获取指定菜单下的权限数据
export function getPermissionByMenuId(data, options) {
  return requestPost(gateway + '/ISysRoleBusiness/getPermissionByMenuId', data, options)
}

// 添加角色用户
export function roleMemberAdd(data, options) {
  return requestPost(gateway + '/ISysRoleBusiness/bindUserRole', data, options)
}

/** ** 用户管理 ****/
// 获取用户管理列表
export const userList = gateway + '/ISysUserBusiness/page'

// 用户新增
export function userAdd(data, options) {
  return requestPost(gateway + '/ISysUserBusiness/save', data, options)
}

// 用户修改
export function userUpdate(data, options) {
  return requestPost(gateway + '/ISysEmployeeBusiness/updateById', data, options)
}

// 用户密码修改
export function userPasswordUpdate(data, options) {
  return requestPost(gateway + '/ISysUserBusiness/updateById', data, options)
}

// 用户删除
export function userDelete(data, options) {
  return requestPost(gateway + '/ISysUserTable/delete', data, options)
}

// 根据 ID 查询用户
export function getUserById(data, options) {
  return requestPost(gateway + '/ISysUserBusiness/getUserById', data, options)
}

// 根据cookie获取用户信息
export function getUserInfo(data, options) {
  return requestPost(gateway + '/ISysUserBusiness/getUserInfo', data, options)
}

// 获取当前租户下的用户列表
export function getTenantUserList(data, options) {
  return requestPost(gateway + '/ISysUserBusiness/getTenantUserList', data, options)
}

// 新增角色成员-用户列表
export const getAssignRoleUserConfig = gateway + '/ISysUserBusiness/getAssignRoleUserConfig'
