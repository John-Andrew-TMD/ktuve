import router, { resetRouter } from '@/router'
import {
  getStore,
  setStore,
  showToast
} from 'utils'
import store from '@/store'
import { logout } from 'api/common.js'
import { getUserInfo, userPasswordUpdate } from 'api/user-mng.js'
import { getDictCache } from 'api/system-setup.js'
import { custNatureList } from 'api/run-module/customer-type-setting.js'
import { requestPost } from 'utils/fetch.js'
import md5 from 'js-md5'
import {
  promiseRequest
} from '@/utils/fetch-utils'

const state = {
  userName: '',
  userId: '',
  // orgId: '',
  loginDialogStatus: false, // 登录框弹框状态
  loginStatus: null, // 用户登录状态
  permissionIds: [], // 页面权限按钮集合
  dictData: null, // 字典项
  custInfo: null, // 客户信息
  departmentName:''
}

const mutations = {
  SET_USER_INFO: (state, { name = 'anonymous', id = '8888', menuCodes = [],departmentName='' }) => {
    state.departmentName = departmentName
    state.userName = name
    state.userId = id
    state.permissionIds = menuCodes
    state.loginStatus = true
    setStore('userName', name, 'sessionStorage')
    Vue.prototype.$lf = Vue.prototype.$localforage.createInstance({
      name: `User${id}conifgs`
    })
    Vue.prototype.$userName = name
    Vue.prototype.$userId = id
  },
  SET_LOGIN_DIALOG_STATUS: (state, status) => {
    state.loginDialogStatus = status
  },
  SET_DICT_DATA: (state, val) => {
    state.dictData = val
  },
  SET_USER_LOGIN_STATUS: (state, status) => {
    state.loginStatus = status
  },
  SET_CUST_INFO: (state, list) => {
    state.custInfo = list
  }
}
// 角色空数据处理
const disposeRoleData = (data, updateTime) => {
  const res = data.filter(item => item.orgid != '')
  setStore('roleInfo', {
    data: res
  })
  return res
}

const actions = {

  // user logout
  logout({
    commit,
    dispatch
  }) {
    return new Promise((resolve, reject) => {
      logout({}, { showLoading: true, fullScreen: true }).then(res => {
        if (res.status === 0) {
          dispatch('navigateToLoginPage')
          resolve
        } else {
          reject()
        }
      }).catch(err => {
        console.log(err)
        reject()
      })
    })
  },

  getUserInfo({
    commit,
    dispatch
  }) {
    return new Promise((resolve, reject) => {
      getUserInfo({}).then(res => {
        if (res.data.id) {
          commit('SET_USER_INFO', res.data)
          store.dispatch('permission/generateRoutes', res.data).then(res => {
            resolve()
          }).catch(err => {
            console.log(err)
            reject()
          })
        } else {
          reject()
        }
      }).catch(err => {
        console.log(err)
        reject()
      })
    })
  },

  // user password modify
  passwordModify({
    commit
  }, params) {
    const {
      oldPassword,
      password
    } = params
    const userId = state.userId
    if (!userId) {
      showToast('用户Id不能为空')
      return Promise.reject()
    }
    return userPasswordUpdate({
      id: userId,
      oldPassword: md5(oldPassword),
      password: md5(password)
    }, { showLoading: true, fullScreen: true })
  },

  // dynamically modify permissions
  // changeRoles({ commit, dispatch }, role) {
  //   return new Promise(async resolve => {
  //     const { roles } = await dispatch('getInfo')

  //     resetRouter()

  //     // generate accessible routes map based on roles
  //     const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

  //     // dynamically add accessible routes
  //     router.addRoutes(accessRoutes)

  //     // reset visited views and cached views
  //     dispatch('tagsView/delAllViews', null, { root: true })

  //     resolve()
  //   })
  // },

  // 获取所有字典项
  getAllDictData({
    commit
  }, force = false) {
    return new Promise((resolve, reject) => {
      getDictCache({}, { needDto: false }).then(res => {
        if (Array.isArray(res.body)) {
          const ret = {}
          res.body.forEach(item => {
            ret[item.dictCode] = Array.isArray(item.dictItemList) && item.dictItemList.map(it => {
              return {
                value: it.dictItem,
                label: it.dictItemName
              }
            }) || []
          })
          commit('SET_DICT_DATA', Object.freeze(ret))
          // console.log(ret)
        }
        resolve(true)
      }).catch(err => {
        console.log(err)
        resolve(false)
      })
    })
  },

  // 获取客户性质
  getCustomerNature({
    commit
  }) {
    return new Promise((resolve, reject) => {
      // const res = getStore('customerNature', false, 'sessionStorage')
      // if (res) {
      //   return resolve()
      // }
      requestPost(custNatureList, {
        dto: {},
        pageSize: 100000,
        pageCurrent: 1
      }).then(res => {
        if (res.data && Array.isArray(res.data.records)) {
          const ret = res.data.records.map(item => {
            return {
              value: item.id,
              label: item.custNature,
              display: item.display
            }
          })
          setStore('customerNature', ret, 'sessionStorage')
        }
      }).finally(() => {
        resolve()
      })
    })
  },

  // 获取机构信息
  // getOrgInfo({
  //   commit
  // }, force = false) {
  //   return getCacheData('orgInfo', {
  //     cache_id: 'org',
  //     cache_param: '{}',
  //     cache_type: '2'
  //   }, null, force)
  // },

  // // 获取角色信息
  // getRoleInfo({
  //   commit
  // }, force = false) {
  //   return getCacheData('roleInfo', {
  //     cache_id: 'role',
  //     cache_param: '{}',
  //     cache_type: '2'
  //   }, (data, cache_time) => {
  //     return disposeRoleData(data, cache_time)
  //   }, force)
  // },

  setLoginDialogStatus({
    commit
  }, status) {
    commit('SET_LOGIN_DIALOG_STATUS', status)
  },

  setUserLoginStatus({
    commit
  }, status) {
    commit('SET_USER_LOGIN_STATUS', status)
  },

  navigateToLoginPage({
    commit
  }) {
    commit('SET_USER_LOGIN_STATUS', false)
    commit('SET_LOGIN_DIALOG_STATUS', false)
    Vue.nextTick(() => {
      router.push('/login')
      resetRouter()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
