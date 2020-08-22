const state = {
  showErrorLogs: false
}

let lfInstance = null

const mutations = {
  SHOW_ERROR_LOG: (state) => {
    state.showErrorLogs = true
  },
  CLEAR_ERROR_LOG: (state) => {
    state.logs.splice(0)
  }
}

const actions = {
  addErrorLog({ commit }, log) {
    !lfInstance && (lfInstance = Vue.prototype.$localforage.createInstance({
      name: `errorLogs`
    }))
    setTimeout(() => {
      lfInstance.setItem('aaa', 'cccc')
    }, 5000)
    // commit('SHOW_ERROR_LOG')
  },
  clearErrorLog({ commit }) {
    commit('CLEAR_ERROR_LOG')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
