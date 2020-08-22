import Layout from '@/layout'

const operationRouter = {
  path: '/run-mng',
  component: Layout,
  redirect: 'noRedirect',
  name: 'RunMng',
  meta: {
    title: '运行',
    icon: 'setting'
  },
  children: [
    {
      path: 'customer-type-setting',
      component: () => import('@/views/run-mng/customer-type-setting'),
      name: 'CustomerTypeSetting',
      meta: { title: '客户性质维护' }
    },
    {
      path: 'attachment-setting',
      component: () => import('@/views/run-mng/attachment-setting'),
      name: 'AttachmentSetting',
      meta: { title: '资料附件配置' }
    },
    {
      path: 'anti-money-config',
      component: () => import('@/views/run-mng/anti-money-config'),
      name: 'antiMoneyConfig',
      meta: { title: '反洗钱风险等级配置' }
    }
    // {
    //   path: 'interest-rate-definition',
    //   component: () => import('@/views/operations-mng/interest-rate-definition'),
    //   name: 'InterestRateDefinition',
    //   meta: { title: '基准利率定义' }
    // },
    // {
    //   path: 'tax-rate-setting',
    //   component: () => import('@/views/operations-mng/tax-rate-setting'),
    //   name: 'TaxRateSetting',
    //   meta: { title: '税率设置' }
    // },
    // {
    //   path: 'penalty-setting',
    //   component: () => import('@/views/operations-mng/penalty-setting'),
    //   name: 'PenaltySetting',
    //   meta: { title: '罚息设置' }
    // },
    // {
    //   path: 'workday-setting',
    //   component: () => import('@/views/operations-mng/workday-setting'),
    //   name: 'WorkdaySetting',
    //   meta: { title: '工作日设置' }
    // },
    // {
    //   path: 'message-setting',
    //   component: () => import('@/views/operations-mng/message-setting/index.vue'),
    //   name: 'MessageSetting',
    //   meta: { title: '消息设置' }
    // }
  ]
}

export default operationRouter
