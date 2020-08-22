import Layout from '@/layout'

const fundsRouter = {
  path: '/funds-mng',
  component: Layout,
  redirect: 'noRedirect',
  name: 'FundsMng',
  meta: {
    title: '资金',
    icon: 'funds'
  },
  children: [
    {
      path: 'funds-launch',
      component: () => import('@/views/funds-mng/funds-launch'),
      name: 'FundsLaunch',
      meta: { title: '资金投放' }
    },
    {
      path: 'payment-mng',
      component: () => import('@/views/funds-mng/payment-mng'),
      name: 'PaymentMng',
      meta: { title: '付款管理' }
    },
    {
      path: 'proceeds-mng',
      component: () => import('@/views/funds-mng/proceeds-mng'),
      name: 'ProceedsMng',
      meta: { title: '收款管理' }
    }
    // {
    //   path: 'deposit-mng',
    //   component: () => import('@/views/funds-mng/deposit-mng'),
    //   name: 'DepositMng',
    //   meta: { title: '保证金管理' }
    // }
  ]
}

export default fundsRouter
