import store from '@/store'
window.addEventListener('message', function(e) {
  // if (e.origin != process.env.VUE_APP_PARENT_WINDOW_URL) return
  // 页面激活主框架通知子页面
  if (e.data === 'notify') {
    store.commit('common/REFRESH_PAGE_DATA')
    return
  }
  const { data, cbName } = e.data
  window[cbName] && window[cbName](data)
}, false)

// window.addEventListener('storage', function(e) {
//   if (e.key === 'vuex-mutation') {
//     try {
//       const obj = JSON.parse(e.newValue)
//       store.commit(obj.mutation)
//     } catch (err) {
//       console.log(err)
//     }
//   }
// })

/**
 * @description VUE与JROS通信
 * @param {String} key 查询的key
 * @param {Array} params 传参
 * @param {String} type 取值|执行函数
 * @param {Boolen} needReturnResult 是否需要返回值
 */
const _jrosDataBridge = (key, params, type = 'string', needReturnResult = true) => {
  if (!key) return
  if (process.env.NODE_ENV === 'production') {
    const keys = key.split('.')
    let target = window.top.ui
    let context = window.top.ui
    keys.map((item, index) => {
      if (!target) return
      target = target[item] || ''
      if (keys.length > 1 && index === keys.length - 2) {
        context = target
      }
    })
    if (typeof target === 'function') {
      const result = target.call(context, ...params)
      return result
    } else {
      return target
    }
  } else {
    // if(type === 'string' && window.ui && window.ui[key]) {
    //   return window.ui[key]
    // }
    return new Promise((resolve, reject) => {
      const cbName = `messageEvtCallback_${+new Date()}`
      window[cbName] = data => {
        resolve(data)
        delete window[cbName]
      }
      window.parent.postMessage({
        key,
        params,
        cbName,
        needReturnResult
      }, process.env.VUE_APP_PARENT_WINDOW_URL)
    })
  }
}

const jrosUtils = {
  // 页面跳转
  navigateTo(...params) {
    _jrosDataBridge('frame.loadPage', params, 'function', false)
  },
  // 获取基础配置信息
  getConfig() {
    return _jrosDataBridge('config')
  },
  // 获取权限配置信息
  getPermissionInfo() {
    return _jrosDataBridge('global.permission')
  },
  // 获取用户信息
  getUserInfo() {
    return _jrosDataBridge('global.user')
  },
  // 关闭当前页签
  closeCurrentPage() {
    _jrosDataBridge('frame.tab.removeCurrentTab', [], 'function', false)
  },
  // 显示登陆弹框
  showLoginDialog() {
    _jrosDataBridge('showLoginDialog', [], 'function', false)
  },
  // 获取缓存的配置信息
  getDictByKey(...params) {
    return _jrosDataBridge('cache.getByKey', params, 'function')
  },
  // ('dict', 40000)
  getDictCache(...params) {
    return _jrosDataBridge('cache.get', params, 'function')
  }
}

export default jrosUtils
