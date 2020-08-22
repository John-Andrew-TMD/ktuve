import { setStore } from 'utils'
const state = {
  sidebar: {
    opened: window.localStorage.getItem('sidebarStatus') ? !!+window.localStorage.getItem('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: window.localStorage.getItem('size') || 'small',
  modalBoxStatus: false

}

let loadingInstance = null

const showLoading = ({fullscreen = false, text = '请求中...'}) => {
  hideLoading()
  loadingInstance = Vue.prototype.$loading({
    fullscreen,
    ...fullscreen ? {} : { target: document.querySelector('.app-main').children[0] },
    lock: true,
    text,
    background: 'rgba(0, 0, 0, 0.15)'
  })
}

const hideLoading = () => {
  loadingInstance && loadingInstance.close()
  loadingInstance = null
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      setStore('sidebarStatus', 1)
    } else {
      setStore('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    setStore('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    setStore('size', size)
  },
  SHOW_MODAL_BOX: (state) => {
    state.modalBoxStatus = true
    setTimeout(() => {
      state.modalBoxStatus = false
    }, 2000)
  },
  SHOW_LOADING: (state, params = {}) => {
    Vue.prototype.$nextTick(() => {
      showLoading(params)
    })
  },
  HIDE_LOADING: (state) => {
    hideLoading()
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
