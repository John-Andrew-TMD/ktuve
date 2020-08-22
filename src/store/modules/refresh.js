const state = {

  // 刷新首页数据
  refreshHomePage: false,

  // 刷新报价方案列表
  refreshQuotationList: false,

  // 刷新项目列表
  refreshProjectList: false,

  // 刷新合同列表
  refreshContractList: false,

}

const mutations = {
  REFRESH_HOME_PAGE: state => {
    state.refreshHomePage = !state.refreshHomePage
  },

  REFRESH_QUOTATION_LIST: state => {
    state.refreshQuotationList = !state.refreshQuotationList
  },

  REFRESH_PROJECT_LIST: state => {
    state.refreshProjectList = !state.refreshProjectList
  },
  
  REFRESH_CONTRACT_LIST: state => {
    state.refreshContractList = !state.refreshContractList
  }
}


export default {
  namespaced: true,
  state,
  mutations,
}
