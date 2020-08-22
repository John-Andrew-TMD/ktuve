import Layout from '@/layout'

const contractRouter = {
  path: '/contract-mng',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Contract',
  meta: {
    title: '合同',
    icon: 'contract'
  },
  children: [
    {
      path: 'contract-list',
      component: () => import('@/views/contract-mng/contract-list'),
      name: 'ContractList',
      meta: { title: '合同管理' }
    },
    {
      path: 'contract-detail',
      component: () => import('@/views/contract-mng/contract-detail'),
      name: 'ContractDetail',
      hidden: true,
      meta: { title: '合同管理详情' }
    },
    {
      path: 'contract-online',
      component: () => import('@/views/contract-mng/contract-online'),
      name: 'ContractOnlie',
      hidden: true,
      meta: { title: '合同在线文档' }
    },
    {
      path: 'contract-online-fill',
      component: () => import('@/views/contract-mng/contract-online-fill'),
      name: 'ContractOnlieFill',
      hidden: true,
      meta: { title: '合同在线填报' }
    },
    {
      path: 'contract-change',
      component: () => import('@/views/contract-mng/contract-change'),
      name: 'ContractChange',
      hidden: true,
      meta: { title: '合同变更详情' }
    }
  ]
}

export default contractRouter
