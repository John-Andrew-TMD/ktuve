import Layout from '@/layout'

const flowRouter = {
  path: '/process',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Process',
  hidden: true,
  children: [
    {
      path: 'process-approval',
      component: () => import('@/views/process-approval/index.vue'),
      name: 'ProcessApproval',
      meta: { title: '流程审批' },
      hidden: true
    }
  ]
}

export default flowRouter
