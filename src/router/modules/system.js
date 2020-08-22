import Layout from '@/layout'

const systemRouter = [{
  path: '/user',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true,
  name: 'User',
  meta: {
    title: '用户管理',
    icon: 'user-mng'
  },
  children: [{
    path: 'tenant-mng',
    component: () => import('@/views/user-mng/tenant-mng/index'),
    name: 'TenantMng',
    meta: {
      title: '租户管理'
    }
  },
  {
    path: 'department-mng',
    component: () => import('@/views/user-mng/department-mng/index'),
    name: 'DepartmentMng',
    meta: {
      title: '部门管理'
    }
  },
  {
    path: 'role-mng',
    component: () => import('@/views/user-mng/role-mng/index'),
    name: 'RoleMng',
    meta: {
      title: '角色管理'
    }
  },
  {
    path: 'user-mng',
    component: () => import('@/views/user-mng/user-mng/index'),
    name: 'UserMng',
    meta: {
      title: '用户管理'
    }
  }]
},
{
  path: '/system-setup',
  component: Layout,
  redirect: 'noRedirect',
  name: 'SystemSetup',
  meta: {
    title: '系统设置',
    icon: 'setting'
  },
  children: [{
    path: 'interface-mng',
    component: () => import('@/views/system-setup/interface-mng/index.vue'),
    name: 'InterfaceMng',
    meta: {
      title: '接口管理'
    }
  },
  {
    path: 'menu-mng',
    component: () => import('@/views/system-setup/menu-mng/index.vue'),
    name: 'MenuMng',
    meta: {
      title: '菜单管理'
    }
  },
  {
    path: 'file-store-mng',
    component: () => import('@/views/system-setup/file-store-mng/index.vue'),
    name: 'FileStoreMng',
    meta: {
      title: '文件存储配置'
    }
  },
  {
    path: 'file-test',
    component: () => import('@/views/system-setup/file-test.vue'),
    name: 'FileTest',
    meta: {
      title: '文件上传下载'
    }
  },
  {
    path: 'file-records',
    component: () => import('@/views/system-setup/file-records.vue'),
    name: 'FileRecords',
    meta: {
      title: '文件记录'
    }
  },
  {
    path: 'file-transfer',
    component: () => import('@/views/system-setup/file-transfer.vue'),
    name: 'FileTransfer',
    meta: {
      title: '文件转换'
    }
  },
  // {
  //   path: 'system-params',
  //   component: () => import('@/views/system-setup/system-params'),
  //   name: 'SystemParams',
  //   meta: {
  //     title: '系统参数'
  //   }
  // },
  // {
  //   path: 'dictionary-entries-mng',
  //   component: () => import('@/views/system-setup/dictionary-entries-mng/index'),
  //   name: 'DictionaryEntriesMng',
  //   meta: {
  //     title: '字典管理'
  //   }
  // },
  // {
  //   path: 'department-mng',
  //   component: () => import('@/views/system-setup/department-mng'),
  //   name: 'DepartmentMng',
  //   meta: {
  //     title: '部门管理'
  //   }
  // }
  ]
}
// {
//   path: '/workflow',
//   component: Layout,
//   redirect: '/workflow/process-mng',
//   name: 'Workflow',
//   meta: {
//     title: '工作流',
//     icon: 'process'
//   },
//   children: [{
//     path: 'process-mng',
//     component: () => import('@/views/workflow/process-mng'),
//     name: 'ProcessMng',
//     meta: {
//       title: '流程信息维护'
//     }
//   },
//   {
//     path: 'process-design',
//     component: () => import('@/views/workflow/process-design'),
//     name: 'ProcessDesign',
//     meta: {
//       title: '流程设计'
//     }
//   },
//   {
//     path: 'process-hand-over',
//     component: () => import('@/views/workflow/process-hand-over'),
//     name: 'ProcessHandOver',
//     meta: {
//       title: '流程移交'
//     }
//   },
//   {
//     path: 'process-draw',
//     component: () => import('@/views/workflow/process-draw/index.vue'),
//     hidden: true,
//     name: 'ProcessDraw',
//     meta: {
//       title: '流程绘制'
//     }
//   },
//   {
//     path: 'process-monitor',
//     component: () => import('@/views/workflow/process-monitor'),
//     name: 'ProcessMonitor',
//     meta: {
//       title: '流程监控'
//     }
//   },
//   {
//     path: 'process-detail',
//     component: () => import('@/views/workflow/process-detail/index.vue'),
//     hidden: true,
//     name: 'ProcessDetail',
//     meta: {
//       title: '流程详情'
//     }
//   }
//   ]
// },
// {
//   path: '/timed-task',
//   component: Layout,
//   redirect: '/timed-task/task',
//   name: 'TimedTask',
//   meta: {
//     title: '调度任务',
//     icon: 'task'
//   },
//   children: [{
//     path: 'task',
//     component: () => import('@/views/timed-task/task'),
//     name: 'Task',
//     meta: {
//       title: '调度任务'
//     }
//   },
//   {
//     path: 'task-log',
//     component: () => import('@/views/timed-task/task-log'),
//     name: 'TaskLog',
//     meta: {
//       title: '调度任务日志'
//     }
//   }
//   ]
// },
// {
//   path: '/template-mng',
//   component: Layout,
//   redirect: '/template-mng/template-list',
//   name: 'TemplateMng',
//   meta: {
//     title: '合同模板',
//     icon: 'template'
//   },
//   children: [{
//     path: 'template-list',
//     component: () => import('@/views/template-mng/template-list.vue'),
//     name: 'TemplateList',
//     meta: {
//       title: '模板列表'
//     }
//   },
//   {
//     path: 'template-design',
//     component: () => import('@/views/template-mng/template-design.vue'),
//     name: 'TemplateDesign',
//     meta: {
//       title: '模板设计'
//     }
//   },
//   {
//     path: 'template-make',
//     component: () => import('@/views/template-mng/template-make/index.vue'),
//     name: 'TemplateMake',
//     meta: {
//       title: '模板制作'
//     }
//   }
//   ]
// }
]
export default systemRouter
