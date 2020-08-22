// import Vue from 'vue'
// import Router from 'vue-router'

// Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import systemRouter from './modules/system'
// import customerModule from './modules/customer-module.js'
// import project from './modules/project'
// import contract from './modules/contract'
// import funds from './modules/funds'
// import afterRent from './modules/after-rent'
// import financing from './modules/financing'
// import runModule from './modules/run-module.js'
import flow from './modules/flow'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () => import('@/views/redirect/index')
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    hidden: true,
    children: [{
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'Home',
        meta: {
          title: '首页',
          icon: 'home',
          affix: true
        }
      },
      {
        path: 'todo',
        component: () => import('@/views/home/todo'),
        name: 'Todo',
        meta: {
          title: '我的待办',
          hidden: true
        }
      },
      {
        path: 'join-or-create',
        component: () => import('@/views/home/join-or-create'),
        name: 'DoingOrDone',
        meta: {
          title: '参与/创建',
          hidden: true
        }
      }
    ]
  },
  // customerModule,
  // project,
  // contract,
  // funds,
  // afterRent,
  // financing,
  // runModule,
  // ...systemRouter,
  flow,
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    hidden: true,
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [{
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: {
          title: '401',
          noCache: true
        }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: {
          title: '404',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/404',
    component: () => import( /* webpackChunkName: "404" */ '@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }
]

const createRouter = () => new VueRouter({
  mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export function generateAsyncRoutes(menuTree, hasParent) {
  let routerTree = []
  if (Array.isArray(menuTree) && menuTree.length) {
    routerTree = menuTree.map(item => {
      if (hasParent) {
        if (item.children && item.children.length) {

          return {
            path: item.url,
            name: item.nameEn,
            // component: () => import( /* webpackChunkName: "[request]" */ `@/views${item.path}`),
            component: resolve => require([`@/views${item.path}`], resolve),
            redirect: item.redirect || 'noredirect',
            alwaysShow: true,
            hidden: !+item.showFlag,
            meta: {
              title: item.name,
              icon: item.icon,
              noCache: !+item.cacheFlag
            },
            children: generateAsyncRoutes(item.children, true)
          }
        } else {
          return {
            path: item.url,
            name: item.nameEn,
            hidden: !+item.showFlag,
            // component: () => import( /* webpackChunkName: "[request]" */ `@/views${item.path}`),
            component: resolve => require([`@/views${item.path}`], resolve),
            meta: {
              title: item.name,
              icon: item.icon,
              noCache: !+item.cacheFlag
            }
          }
        }
      } else {
        // else if (item.children && item.children.length) {
        return {
          path: item.url,
          name: item.nameEn,
          component: Layout,
          redirect: item.redirect || 'noredirect',
          alwaysShow: true,
          meta: {
            title: item.name,
            icon: item.icon,
            moduleId: item.moduleId,
            noCache: !+item.cacheFlag
          },
          ...item.children && item.children.length && { children: generateAsyncRoutes(item.children, true) } || {}
        }
      }
      // else {
      //   return {
      //     path: item.url,
      //     component: Layout,
      //     redirect: item.redirect || 'noredirect',
      //     children: [{
      //       path: 'index',
      //       name: item.nameEn,
      //       component: () => import( webpackChunkName: "[request]"  `@/views${item.path}`),
      //       meta: {
      //         title: item.name,
      //         icon: item.icon,
      //         moduleId: item.moduleId,
      //         noCache: !+item.cacheFlag
      //       }
      //     }]
      //   }
      // }

    })
  }
  return routerTree
}

export default router
