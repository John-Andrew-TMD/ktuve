import Layout from '@/layout'

const customerRouter = {
  path: '/customer-mng',
  component: Layout,
  redirect: 'noRedirect',
  name: 'CustomerMng',
  meta: {
    title: '客户',
    icon: 'customer'
  },
  children: [
    // 客户管理
    {
      path: 'customer-mng',
      component: () => import('@/views/customer-mng/customer-mng/index.vue'),
      name: 'CustomerMng',
      meta: {
        title: '客户管理'
      }
    },
    {
      path: 'group-customer-mng',
      component: () => import('@/views/customer-mng/customer-mng/group.vue'),
      name: 'GroupCustomerMng',
      meta: {
        title: '集团客户'
      }
    },
    {
      path: 'customer-detail',
      component: () => import('@/views/customer-mng/customer-detail/index.vue'),
      name: 'CustomerDetail',
      hidden: true,
      meta: {
        title: '客户详情'
      }
    },
    {
      path: 'cust-finance-contrast',
      component: () => import('@/views/customer-mng/customer-detail/components/CustFinanceContrast/index'),
      name: 'FinanceContrast',
      hidden: true,
      meta: {
        title: '财务对比图展示'
      }
    },
    {
      path: 'cust-finance-detail',
      component: () => import('@/views/customer-mng/customer-detail/components/CustFinanceDetail/index'),
      name: 'CustFinanceDetail',
      hidden: true,
      meta: {
        title: '财务状况详情'
      }
    },
    // 额度管理
    {
      path: 'quota-mng',
      component: () => import('@/views/customer-mng/customer-quota-mng/index.vue'),
      name: 'QuotaMng',
      meta: {
        title: '客户授信'
      }
    },
    {
      path: 'quota-detail',
      component: () => import('@/views/customer-mng/customer-quota-mng/detail.vue'),
      name: 'QuotaDetail',
      hidden: true,
      meta: {
        title: '额度详情'
      }
    },
    // 客户评级
    {
      path: 'customer-rating',
      component: () => import('@/views/customer-mng/customer-rating-mng/index.vue'),
      name: 'CustomerRating',
      meta: {
        title: '客户评级'
      }
    },
    {
      path: 'customer-rating-score',
      component: () => import('@/views/customer-mng/customer-rating-mng/score.vue'),
      name: 'CustomerRatingScore',
      hidden: true,
      meta: {
        title: '客户评级打分'
      }
    },
    {
      path: 'customer-rating-detail',
      component: () => import('@/views/customer-mng/customer-rating-mng/detail.vue'),
      name: 'CustomerRatingDetail',
      hidden: true,
      meta: {
        title: '客户评级详情'
      }
    },
    // 评级模型
    {
      path: 'rating-model-mng',
      component: () => import('@/views/customer-mng/rating-model-mng/index.vue'),
      name: 'RatingModel',
      meta: {
        title: '模型管理'
      }
    },
    {
      path: 'rating-model-setting',
      component: () => import('@/views/customer-mng/rating-model-mng/setting.vue'),
      name: 'RatingModelSetting',
      hidden: true,
      meta: {
        title: '评级模型设置'
      }
    },
    // 律师库
    {
      path: 'law-library-mng',
      component: () => import('@/views/customer-mng/law-library-mng/index.vue'),
      name: 'LawLibraryMng',
      meta: {
        title: '律师库'
      }
    },
    // 评估机构
    {
      path: 'appraisal-agency-mng',
      component: () => import('@/views/customer-mng/appraisal-agency-mng/index.vue'),
      name: 'AppraisalAgencyMng',
      meta: {
        title: '评估机构'
      }
    },
    // 黑名单
    {
      path: 'customer-blacklist',
      component: () => import('@/views/customer-mng/customer-blacklist-mng/index.vue'),
      name: 'CustomerBlacklist',
      meta: {
        title: '黑名单'
      }
    }
  ]
}

export default customerRouter
