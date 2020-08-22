import { queryDictItems } from 'utils'
export const customerTableOptions = {
  requestParams: {
    url: '',
    data: {}
  },
  showSerialNumber: true,
  showPagination: false,
  requestImmediate: false,
  columns: [
    {
      attrs: {
        label: '客户类型',
        prop: 'custCategory',
        width: '150px',
        formatter: row => {
          return Vue.filter('filterDictValue')(row.custCategory, '10008')
        }
      }
    },
    {
      attrs: {
        label: '资料内容',
        prop: 'dataContent',
        align: 'left'
      }
    }
  ]
}

export const projectTableOptions = {
  requestParams: {
    url: '',
    data: {}
  },
  showSerialNumber: true,
  showPagination: false,
  requestImmediate: false,
  columns: [
    {
      attrs: {
        label: '租赁类型',
        prop: 'businessType',
        width: '150px'
      },
      filter: {
        name: 'dict',
        params: ['10047']
      }
    },
    {
      attrs: {
        label: '资料分类',
        prop: 'dataType',
        width: '150px'
      },
      filter: {
        name: 'dict',
        params: ['10048']
      }
    },
    {
      attrs: {
        label: '资料内容',
        prop: 'dataContent',
        align: 'left'
      }
    }
  ]
}

export const contractTableOptions = {
  requestParams: {
    url: '',
    data: {}
  },
  showSerialNumber: true,
  showPagination: false,
  requestImmediate: false,
  columns: [
    {
      attrs: {
        label: '资料内容',
        prop: 'dataContent',
        align: 'left'
      }
    }
  ]
}

export const loanTableOptions = {
  requestParams: {
    url: '',
    data: {}
  },
  showSerialNumber: true,
  showPagination: false,
  requestImmediate: false,
  columns: [
    {
      attrs: {
        label: '菜单分类',
        prop: 'menuType',
        width: '150px'
      },
      filter: {
        name: 'dict',
        params: ['10069']
      }
    },
    {
      attrs: {
        label: '资料分类',
        prop: 'dataType',
        width: '150px'
      },
      filter: {
        name: 'dict',
        params: ['10060']
      }
    },
    {
      attrs: {
        label: '资料内容',
        prop: 'dataContent',
        align: 'left'
      }
    }
  ]
}
