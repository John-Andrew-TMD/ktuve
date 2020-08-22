import { getFlowInfo, getHandledFlowInfo } from 'api/workflow-module/index.js'
import { getTenantUserList } from 'api/user-mng.js'
import { showToast, isEmptyObj, setStore } from 'utils'
const state = {

}

const mutations = {
}

const actions = {
  // queryCustName({
  //   commit
  // }, {
  //   keyword,
  //   cb
  // }) {
  //   promiseRequest({
  //     code: '201634',
  //     data: {
  //       business_manager_id: Vue.prototype.$userId,
  //       cust_category: 1,
  //       cust_attribute: 1,
  //       cust_id: keyword
  //     }
  //   })
  //     .then(res => {
  //       if (res.data.record.length) {
  //         let ret = res.data.record.map(item => ({
  //           value: item.cust_id,
  //           label: item.cust_name
  //         }))
  //         ret.push({
  //           value: '0',
  //           label: '暂无客户'
  //         })
  //         if (!keyword.trim().length) {
  //           cb(ret)
  //           return
  //         }
  //         ret = ret.filter(item => item.label.includes(keyword))
  //         cb(ret)
  //       } else {
  //         cb([])
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // },

  // 根据userid 获取部门负责人
  // getDepartmentLeader({
  //   commit
  // }, userId = '', businessType = '1') {
  //   return promiseRequest({
  //     code: '200278',
  //     data: {
  //       user_id: userId,
  //       business_type: businessType
  //     }
  //   }, { showLoading: true }).then(res => {
  //     if (res.data.record.length) {
  //       return res.data.record
  //     } else {
  //       showToast('获取接受人失败，请重试！')
  //       return false
  //     }
  //   }).catch(() => {
  //     return false
  //   })
  // },

  // 获取部门下所有用户信息
  // getRoleAllUserInfo({
  //   commit
  // }, roleId = '') {
  //   return promiseRequest({
  //     code: '201053',
  //     data: {
  //       role_id: roleId
  //     }
  //   }, { showLoading: true }).then(res => {
  //     if (res.data.record.length) {
  //       return res.data.record
  //     } else {
  //       showToast('获取接受人失败，请重试！')
  //       return false
  //     }
  //   }).catch(() => {
  //     return false
  //   })
  // },

  // 根据roleid 获取角色用户列表
  // getUserListByRoleId({
  //   commit
  // }, roleId = '') {
  //   let params = []
  //   if (Array.isArray(roleId)) {
  //     roleId.forEach(id => {
  //       params.push({
  //         code: '100210',
  //         data: {
  //           roleid: id
  //         }
  //       })
  //     })
  //   } else {
  //     params = {
  //       code: '100210',
  //       data: {
  //         roleid: roleId
  //       }
  //     }
  //   }
  //   return promiseRequest(params, { showLoading: true }).then(res => {
  //     return res.data || null
  //   }).catch(err => {
  //     console.log(err)
  //     return null
  //   })
  // },

  // 发送微信模板消息
  // sendTemplateMsg({
  //   commit
  // }, params) {
  //   promiseRequest({
  //     url: process.env.VUE_APP_VECHAT_TEMPLATE_MESSAGE_URL,
  //     data: params
  //   }, {}, true).then(res => {
  //     if (!res) {
  //       console.log('模板消息发送失败')
  //     } else {
  //       if (!res.code) {
  //         console.log('模板消息发送成功')
  //       } else {
  //         console.log('模板消息发送失败')
  //       }
  //     }
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // },

  // 获取流程信息
  getProcessInfo({
    commit
  }, id) {
    return new Promise(async(resolve, reject) => {
      getFlowInfo({ id }, {
        showLoading: true
      }).then(res => {
        if (!isEmptyObj(res.data)) {
          resolve(res.data)
        } else {
          reject()
        }
      }).catch(err => {
        console.log(err)
        reject()
      })
    })
  },

  getHandledProcessInfo({
    commit
  }, id) {
    return new Promise(async(resolve, reject) => {
      getHandledFlowInfo({ id }, {
        showLoading: true
      }).then(res => {
        if (!isEmptyObj(res.data)) {
          resolve(res.data)
        } else {
          reject()
        }
      }).catch(err => {
        console.log(err)
        reject()
      })
    })
  },

  // 获取当前租户下的用户列表
  getAllUserList({
    commit
  }) {
    getTenantUserList({}).then(res => {
      if (res.data && Array.isArray(res.data.records)) {
        setStore('userList', res.data.records)
      }
    }).catch(err => {
      console.log(err)
    })
  }
  // getFlowContentByReqId({ commit }, reqId) {
  //   return promiseRequest({
  //     code: '209011',
  //     data: {
  //       flow_id: reqId
  //     }
  //   }, { showLoading: true }).then(res => {
  //     if (res.data.record.length) {
  //       try {
  //         return JSON.parse(res.data.record[0].content)
  //       } catch (e) {
  //         return false
  //       }
  //     } else {
  //       return false
  //     }
  //   }).catch(() => { return false })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
