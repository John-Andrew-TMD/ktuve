import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  if (store.getters.loginStatus === false) {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next({ path: '/login' })
      NProgress.done()
    }
  } else if (store.getters.loginStatus == null) {
    if (whiteList.includes(to.path)) {
      next()
      NProgress.done()
    } else {
      store.dispatch('user/getUserInfo').then(async res => {
        store.dispatch('common/getAllUserList', true)
        await store.dispatch('user/getAllDictData', true)
        next({ ...to, replace: true })
      }).catch(err => {
        console.log(err)
        next('/login')
        NProgress.done()
      })
    }
  } else {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger afterEach hook, so manually handle it
    } else {
      next()
    }
  }
})

router.afterEach((to, from) => {
  !to.meta.from && (to.meta.from = from.fullPath)
  // finish progress bar
  NProgress.done()
})
