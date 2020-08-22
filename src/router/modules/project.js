import Layout from '@/layout'

const projectRouter = {
  path: '/project-mng',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ProjectMng',
  meta: {
    title: '项目',
    icon: 'project'
  },
  children: [
    {
      path: 'quotation-list',
      component: () => import('@/views/project-mng/quotation-list.vue'),
      name: 'QuotationList',
      meta: { title: '报价方案' }
    },
    {
      path: '/quotation-add',
      component: () => import('@/views/project-mng/quotation-add.vue'),
      name: 'QuotationAdd',
      hidden: true,
      meta: { title: '报价测算' }
    },
    {
      path: 'quotation-edit',
      component: () => import('@/views/project-mng/quotation-edit.vue'),
      name: 'QuotationEdit',
      hidden: true,
      meta: { title: '报价方案编辑' }
    },
    // {
    //   path: 'pricing-list',
    //   component: () => import('@/views/project-mng/pricing-list'),
    //   name: 'PricingList',
    //   meta: { title: '定价模型' }
    // },
    {
      path: 'project-list',
      component: () => import('@/views/project-mng/project-list'),
      name: 'ProjectList',
      meta: { title: '项目管理' }
    },
    {
      path: 'project-detail',
      component: () => import('@/views/project-mng/project-detail/index.vue'),
      name: 'ProjectDetail',
      hidden: true,
      meta: { title: '项目详情' }
    },
    // {
    //   path: 'project-inquire-detail',
    //   component: () => import('@/views/project-mng/project-inquire-detail'),
    //   name: 'ProjectInquireDetail',
    //   hidden: true,
    //   meta: { title: '项目尽调信息' }
    // },
    {
      path: 'project-assess',
      component: () => import('@/views/project-mng/project-assess'),
      name: 'ProjectAssess',
      meta: { title: '评审会管理' }
    }
  ]
}

export default projectRouter
