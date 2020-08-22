const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  priceInfo: state => state.price.priceInfo,
  // token: state => state.user.token,
  // avatar: state => state.user.avatar,
  userName: state => state.user.userName, // 用户名名称
  contractInfo: state => state.contract.contractInfo, // 用户名名称
  // roles: state => state.user.roles,
  permissionRoutes: state => state.permission.dynamicRoutes, // 权限路由
  permissionIds: state => state.user.permissionIds, // 权限id列表
  loginDialogStatus: state => state.user.loginDialogStatus, // 登录框显示状态
  loginStatus: state => state.user.loginStatus, // 用户登录状态
  showErrorLogs: state => state.errorLog.showErrorLogs, // 错误日志列表
  dictData: state => state.user.dictData, // 字典项数据
  departmentName:state=>state.user.departmentName,
  project:state=>state.project,

}
export default getters
