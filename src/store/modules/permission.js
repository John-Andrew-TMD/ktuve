import { constantRoutes, generateAsyncRoutes } from '@/router'
import router, { resetRouter } from '@/router'
import { setStore, getStore, generateTree } from 'utils'
// 加载路由+进入首页
const loadRoutesAndEnterSystem = (commit, accessedRouters) => {
  accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
  resetRouter()
  router.addRoutes(accessedRouters)
  commit('SET_ROUTES', accessedRouters)
  // 默认显示业务菜单
  commit('CHANGE_ROUTES')
}

const state = {
  routes: [],
  dynamicRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    // state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  CHANGE_ROUTES: (state, type) => {
    // state.dynamicRoutes = state.routes.filter(item => !item.meta || item.meta.moduleId == type)
    state.dynamicRoutes = state.routes
  }
}

const actions = {
  // 获取菜单
  generateRoutes({ commit, state }, { sysMenuTableEntityDtos = [] }) {
    return new Promise((resolve, reject) => {
      let accessedRouters = []
      // if (process.env.NODE_ENV === 'development') {
      //   const menuTrees = getStore('menuTree', true) || []
      //   if (menuTrees.length) {
      //     accessedRouters = generateAsyncRoutes(menuTrees)
      //     loadRoutesAndEnterSystem(commit, accessedRouters)
      //     return resolve()
      //   }
      // }
      if (sysMenuTableEntityDtos.length) {
        const menuTrees = generateTree(sysMenuTableEntityDtos, '0', 'id', 'parentId', 'sortNo')
        if (process.env.NODE_ENV === 'development') {
          setStore('menuTree', menuTrees)
        }
        accessedRouters = generateAsyncRoutes(menuTrees)
      }
      loadRoutesAndEnterSystem(commit, accessedRouters)
      resolve()
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
