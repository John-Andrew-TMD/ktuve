// import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

// import Element from 'element-ui'
// import '@/assets/css/element-variables.scss'

import '@/assets/css/index.scss' // global css
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import localforage from 'localforage'

// import 'default-passive-events'

import adaptive from '@/directive/el-table'
Vue.directive('el-height-adaptive-table', adaptive)

import permission from '@/directive/permission'
Vue.directive('permission', permission)

import transferDom from '@/directive/transfer-dom'
Vue.directive('transfer-dom', transferDom)

import Validate from 'utils/form-validate'
Vue.prototype.formValidate = Validate

import NumberInput from 'components/NumberInput'
Vue.component('number-input', NumberInput)

import ElAutoComplete from 'components/ElAutoComplete'
Vue.component('el-custom-autocomplete', ElAutoComplete)

import ElSelect from 'components/ElSelect'
Vue.component('el-custom-select', ElSelect)

import ElUpload from 'components/Upload'
Vue.component('el-custom-upload', ElUpload)

import ElFileImport from 'components/ElFileImport'
Vue.component('el-file-import', ElFileImport)

import ChinaRegionCascade from 'components/AddressCascade'
Vue.component('china-region-cascade', ChinaRegionCascade)

import IndustryCascade from 'components/IndustryCascade'
Vue.component('industry-cascade', IndustryCascade)

import GreenLoansCascade from 'components/GreenLoansCascade'
Vue.component('green-loans-cascade', GreenLoansCascade)

import ElText from 'components/ElText'
Vue.component('el-custom-text', ElText)

import { requestPost } from 'utils/fetch.js'

import { showToast } from 'utils'
Vue.prototype.$promiseRequest = requestPost
Vue.prototype.$showToast = showToast
Vue.prototype.$localforage = localforage

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }
ELEMENT.Dialog.props.closeOnClickModal.default = false
ELEMENT.MessageBox.setDefaults({
  closeOnClickModal: false
})
Vue.use(ELEMENT, {
  size: 'mini' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// const errorHandler = (error, vm) => {
//   console.error(error)
//   store.commit('HIDE_LOADING')
// }

// Vue.config.errorHandler = errorHandler
// Vue.prototype.$throw = (error) => errorHandler(error, this)
