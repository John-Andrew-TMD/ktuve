import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_KISSO_GETEWAY

// 登录
export function login(data, options) {
  return requestPost(gateway + '/IAuth/login', data, options)
}

// 注销
export function logout(data, options) {
  return requestPost(gateway + '/IAuth/logout', data, options)
}

