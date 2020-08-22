const state = {
    priceInfo: {}
  }
  
  
  const mutations = {
    SET_PRICE_DATA: (state,priceInfo) => {
      state.priceInfo = priceInfo
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
  