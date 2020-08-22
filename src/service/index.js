import Axios from 'utils/fetch'

export const generalRequest = (url, method, data, options) => Axios[method](url, data, options)

export const commonRequest = (data, options) => Axios.post('/ajax_fm.do', data, options)

