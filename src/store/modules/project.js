const state = {
    formData: {},
    disabled:true
  }
  
  let lfInstance = null
  
  const mutations = {
    SET_FORM_DATA: (state) => {
      state.formData = state
    },
    SET_DISABLED: (disabled) => {
    state.disabled =disabled
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
  