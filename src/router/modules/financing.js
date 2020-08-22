import Layout from '@/layout'

const financingRouter = {
  path: '/financing-mng',
  component: Layout,
  redirect: 'noRedirect',
  name: 'FinancingMng',
  meta: {
    title: '融资',
    icon: 'financing'
  },
  children: [
    {
      path: 'financing-plan',
      component: () => import('@/views/financing-mng/financing-plan'),
      name: 'FinancingPlan',
      meta: { title: '融资方案' }
    },
    {
      path: 'financing-detail',
      component: () => import('@/views/financing-mng/financing-detail'),
      name: 'FinancingDetail',
      hidden: true,
      meta: { title: '融资方案' }
    },
    {
      path: 'financing-add',
      component: () => import('@/views/financing-mng/financing-add'),
      name: 'FinancingAdd',
      hidden: true,
      meta: { title: '新增融资方案' }
    },
    {
      path: 'financing-receivable',
      component: () => import('@/views/financing-mng/financing-receivable'),
      name: 'FinancingReceivable',
      meta: { title: '融资应收' }
    },
    {
      path: 'financing-payable',
      component: () => import('@/views/financing-mng/financing-payable'),
      name: 'FinancingPayable',
      meta: { title: '融资应付' }
    }
  ]
}

export default financingRouter
