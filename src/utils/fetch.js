import { showToast } from 'utils'
import store from '@/store'

axios.defaults.timeout = 20000
axios.defaults.withCredentials = true
// axios.defaults.headers.post['Content-Type'] = 'text'
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8'

// axios.defaults.baseURL = 'http://10.220.10.78:8082/'

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (config.showLoading) {
      store.commit('app/SHOW_LOADING', { fullScreen: config.fullScreen })
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(false)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    // console.log(response)
    if (response.config.showLoading) {
      store.commit('app/HIDE_LOADING')
    }
    const res = response.data
    if (!res) return false

    let code = null
    if (res.hasOwnProperty('status')) {
      code = +res.status
    } else {
      code = +res.code
    }
    switch (code) {
      case 0:
      case 200:
        return res
      /**
       * 10001 session失效
       * 10002 redis用户记录为空
       */
      case 10001:
      case 10002:
        // loginStatus为true表示在使用过程中出现session失效
        if (store.getters.loginStatus) {
          showToast(res.msg)
          store.dispatch('user/setUserLoginStatus', false)
          store.dispatch('user/setLoginDialogStatus', true)
        }
        return Promise.reject(res.msg)
      case 20001:
        showToast('权限不足！')
        return Promise.reject(res.msg)
      default:
        // 是否在回调函数中处理错误
        if (!response.config.captureError) {
          showToast(res.msg)
          return Promise.reject(res.msg)
        } else {
          return res
        }
    }
  },
  error => {
    console.log(error)
    if (error.config.showLoading) {
      store.commit('app/HIDE_LOADING')
    }
    if (error.message === 'Network Error') {
      showToast('网络连接错误，请检查网络连接！')
    } else if (error.code && error.code === 'ECONNABORTED') {
      showToast('网络连接超时，请稍后重试！')
    } else {
      showToast('服务器异常，请稍后重试！')
    }
    return Promise.reject(false)
  }
)

const commonFetch = (method, url, data = {}, options = {}) => {
  let params = data
  if (!data.hasOwnProperty('dto') && options.needDto !== false) {
    params = {
      dto: data
    }
  }
  if (options.paramsType === 'multipart') {
    options.headers = {
      'Content-Type': 'multipart/form-data'
    }
  }
  // else if (method === 'delete') {
  //   params = {
  //     data
  //   }
  // }
  // else {
  //   params = stringify(data)
  // }
  return axios[method](url, params, options)
}

export function requestGet(url, data = {}, options = {}) {
  return axios.get(url, {
    params: data,
    ...options
  })
}

export function requestPost(url, data, options) {
  return commonFetch('post', url, data, options)
}

// // 删除
// delete(url, data, options) {
//   return commonFetch('delete', url, data, options)
// }
// // 更新某个字段
// put(url, data, options) {
//   return commonFetch('put', url, data, options)
// }
// // 更新完整的内容
// patch(url, data, options) {
//   return commonFetch('put', url, data, options)
// }
