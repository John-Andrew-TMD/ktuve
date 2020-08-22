const state = {
    contractInfo:{}
  }
  
  const mutations = {
    SET_CONTRACT_INFO: (state,contractInfo) => {
      state.contractInfo = contractInfo
    }
  }
  
  const actions = {

  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  