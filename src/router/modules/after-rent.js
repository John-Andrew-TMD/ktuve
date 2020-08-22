import Layout from '@/layout'

const afterRentRouter = {
  path: '/after-rent-mng',
  component: Layout,
  redirect: 'noRedirect',
  name: 'AfterRentMng',
  meta: {
    title: '租后',
    icon: 'after-rent'
  },
  children: [
    {
      path: 'rent-plan',
      component: () => import('@/views/after-rent-mng/rent-plan/index'),
      name: 'RentPlan',
      meta: { title: '租金计划' }
    },
    {
      path: 'detail',
      component: () => import('@/views/after-rent-mng/rent-plan/detail/index'),
      name: 'detail',
      hidden: true,
      meta: {
        title: '详情'
      }
    },
    {
      path: 'overdue-mng',
      component: () => import('@/views/after-rent-mng/overdue-mng'),
      name: 'OverdueMng',
      meta: { title: '逾期管理' }
    },
    {
      path: 'lease-mng',
      component: () => import('@/views/after-rent-mng/lease-mng'),
      name: 'LeaseMng',
      meta: { title: '租赁物管理' }
    },
    {
      path: 'insurance-mng',
      component: () => import('@/views/after-rent-mng/insurance-mng/index'),
      name: 'InsuranceMng',
      meta: { title: '保险管理' }
    },
    {
      path: 'rent-report',
      component: () => import('@/views/after-rent-mng/rent-report/index'),
      name: 'RentReport',
      meta: { title: '租后报告' }
    },
    {
      path: 'asset-classification',
      component: () => import('@/views/after-rent-mng/asset-classification/index'),
      name: 'AssetClassification',
      meta: { title: '资产五级分类' }
    },
    {
      path: 'project-warning',
      component: () => import('@/views/after-rent-mng/project-warning/index'),
      name: 'ProjectWarning',
      meta: { title: '项目预警' }
    }
  ]
}

export default afterRentRouter
