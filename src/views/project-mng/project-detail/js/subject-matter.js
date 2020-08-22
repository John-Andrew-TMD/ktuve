import {
  queryDictItems,
  queryDictValue
} from 'utils'
// type为业务类型（1-直租  2-回租 3-保理 5-转租赁  4-通道业务  6-投资类  7-其他类）
const _tableColumns = () => {
  return [{
      attrs: {
        prop: 'subject_type',
        label: '标的物类型',
        'show-overflow-tooltip': true
      }
    },
    {
      attrs: {
        prop: 'subject_name',
        label: '设备名称',
        'show-overflow-tooltip': true
      }
    },
    {
      attrs: {
        prop: 'subject_model',
        label: '规格型号',
        'show-overflow-tooltip': true
      }
    },
    {
      attrs: {
        prop: 'num',
        label: '数量',
        formatter: (row, column) => {
          return row.num + queryDictValue('30014', row.unit)
        }
      }
    },
    {
      attrs: {
        prop: 'total_price',
        label: '总价（元）',
        formatter: (row, column) => {
          return Vue.filter('filterToThousand')(row.total_price)
        }
      }
    },
    {
      attrs: {
        prop: 'purchase_date',
        label: '购入日期（或拟购入日）',
        formatter: (row, column) => {
          return Vue.filter('filterDateSeparate')(row.purchase_date)
        }
      }
    },
    {
      attrs: {
        prop: 'original_value',
        label: '原值（元）',
        formatter: (row, column) => {
          return Vue.filter('filterToThousand')(row.original_value)
        }
      }
    },
    {
      attrs: {
        prop: 'net_value',
        label: '净值（元）',
        formatter: (row, column) => {
          return Vue.filter('filterToThousand')(row.net_value)
        }
      }
    },
    {
      attrs: {
        prop: 'appraisal_value',
        label: '评估价值（元）',
        formatter: (row, column) => {
          return Vue.filter('filterToThousand')(row.appraisal_value)
        }
      }
    },
    {
      attrs: {
        prop: 'firm',
        label: '生产厂商',
        'show-overflow-tooltip': true
      }
    },
    {
      attrs: {
        prop: 'position',
        label: '存放/使用地点',
        'show-overflow-tooltip': true
      }
    },
    {
      attrs: {
        prop: 'time_use',
        label: '经济使用年限（年）'
      }
    },
    {
      attrs: {
        prop: 'remark',
        label: '备注',
        'show-overflow-tooltip': true
      }
    }
  ]
}
const _tableColumnsFactoring = () => {
  return [{
      attrs: {
        prop: 'debtor',
        label: '债务人名称'
      }
    },
    {
      attrs: {
        prop: 'contract_name',
        label: '基础交易合同及编号'
      },
      slot: true
    },
    {
      attrs: {
        prop: 'receive_type',
        label: '应收账款种类'
      }
    },
    {
      attrs: {
        prop: 'receive_amount',
        label: '应收账款金额（元）',
        formatter: (row, column) => {
          return Vue.filter('filterToThousand')(row.receive_amount)
        }
      }
    },
    {
      attrs: {
        prop: 'invoice_no',
        label: '发票号'
      }
    },
    {
      attrs: {
        prop: 'invoice_amount',
        label: '发票金额（元）',
        formatter: (row, column) => {
          return Vue.filter('filterToThousand')(row.invoice_amount)
        }
      }
    },
    {
      attrs: {
        prop: 'invoice_date',
        label: '发票开具日',
        formatter: (row, column) => {
          return Vue.filter('filterDateSeparate')(row.invoice_date)
        }
      }
    },
    {
      attrs: {
        prop: 'transfer_due_date',
        label: '转让的应收账款到期日',
        formatter: (row, column) => {
          return Vue.filter('filterDateSeparate')(row.transfer_due_date)
        }
      }
    },
    {
      attrs: {
        prop: 'transfer_date',
        label: '转付日',
        formatter: (row, column) => {
          return Vue.filter('filterDateSeparate')(row.transfer_date)
        }
      }
    },
    {
      attrs: {
        prop: 'remark',
        label: '备注'
      }
    }
  ]
}
export const getTableColumns = vm => {
  const type = vm.$route.query.business_type || vm.routeParams.business_type
  // console.log('type11', type)
  let columns = []
  let filedArr = []
  switch (parseInt(type)) {
    case 1: // 直租
      filedArr = ['subject_type', 'subject_name', 'subject_model', 'num', 'purchase_price', 'total_price', 'purchase_date', 'firm', 'position', 'remark']
      filedArr.forEach(item => {
        const filterData = _tableColumns().filter(el => el.attrs.prop === item)
        if (filterData.length) {
          columns.push(filterData[0])
        }
      })
      break
    case 3: // 保理
      columns = _tableColumnsFactoring()
      break
    case 2: // 回租
    case 4: // 通道业务
    case 5: // 转租赁
    case 6: // 投资类
    case 7: // 其他类
      filedArr = ['subject_type', 'subject_name', 'subject_model', 'num', 'original_value', 'net_value', 'appraisal_value', 'firm', 'position', 'time_use', 'remark']
      filedArr.forEach(item => {
        const filterData = _tableColumns().filter(el => el.attrs.prop === item)
        if (filterData.length) {
          columns.push(filterData[0])
        }
      })
      break
  }
  return columns
}

const _getTotalPrice = vm => {
  let num = 0
  let price = 0
  vm.fApi.validateField('num', (errMsg) => {
    if (!errMsg) {
      num = parseInt(vm.fApi.getValue('num'))
    }
  })
  vm.fApi.validateField('purchase_price', (errMsg) => {
    if (!errMsg) {
      price = parseFloat(vm.fApi.getValue('purchase_price'))
    }
  })
  if (num && price) {
    vm.fApi.setValue('total_price', num * price)
  } else {
    vm.fApi.setValue('total_price', 0)
  }
}
const _formItem = vm => {
  return [{
      type: 'input',
      field: 'subject_type',
      title: '标的物类型',
      col: {
        span: 12
      }
    },
    {
      type: 'input',
      field: 'subject_name',
      title: '设备名称',
      col: {
        span: 12
      },
      validate: vm.formValidate({
        required: true
      })
    },
    {
      type: 'input',
      field: 'subject_model',
      title: '规格型号',
      col: {
        span: 12
      }
    },
    {
      type: 'number-input',
      field: 'num',
      title: '数量',
      col: {
        span: 9
      },
      validate: vm.formValidate({
        required: true,
        max: 999
      }),
      on: {
        change: v => {
          _getTotalPrice(vm)
        }
      },
      props: {
        maxDecimal: 0
      }
    },
    {
      type: 'select',
      field: 'unit',
      title: '',
      options: queryDictItems('30014'),
      col: {
        span: 3
      }
    },
    {
      type: 'number-input',
      field: 'purchase_price',
      title: '购入价格',
      col: {
        span: 12
      },
      validate: vm.formValidate({
        max: 999999999999.999
      }),
      props: {
        needFormat: true
      },
      children: [{
        type: 'span',
        slot: 'append',
        children: ['元']
      }],
      on: {
        change: v => {
          _getTotalPrice(vm)
        }
      }
    },
    {
      type: 'number-input',
      field: 'total_price',
      title: '总价',
      col: {
        span: 12
      },
      children: [{
        type: 'span',
        slot: 'append',
        children: ['元']
      }],
      props: {
        disabled: true,
        needFormat: true
      }
    },
    {
      type: 'el-date-picker',
      field: 'purchase_date',
      title: '购入日期（或拟购入日）',
      col: {
        span: 12
      },
      props: {
        valueFormat: 'yyyyMMdd'
      },
      style: {
        width: '100%'
      }
    },
    {
      type: 'number-input',
      field: 'original_value',
      title: '原值（元）',
      col: {
        span: 12
      },
      validate: vm.formValidate({
        max: 999999999999.999
      }),
      props: {
        needFormat: true
      }
    },
    {
      type: 'number-input',
      field: 'net_value',
      title: '净值（元）',
      col: {
        span: 12
      },
      validate: vm.formValidate({
        required: true,
        max: 999999999999.999
      }),
      props: {
        needFormat: true
      }
    },
    {
      type: 'number-input',
      field: 'appraisal_value',
      title: '评估价值（元）',
      col: {
        span: 12
      },
      validate: vm.formValidate({
        max: 999999999999.999
      }),
      props: {
        needFormat: true
      }
    },
    {
      type: 'input',
      field: 'firm',
      title: '生产厂商',
      col: {
        span: 12
      }
    },
    {
      type: 'input',
      field: 'position',
      title: '存放/使用地点',
      col: {
        span: 12
      }
    },
    {
      type: 'input',
      field: 'time_use',
      title: '经济使用年限（年）',
      col: {
        span: 12
      },
      validate: vm.formValidate({
        max: 100
      })
    },
    {
      type: 'input',
      field: 'remark',
      title: '备注',
      props: {
        type: 'textarea',
        maxlength: 500
      },
      col: {
        span: 24
      }
    }
  ]
}
const _formItemFactoring = vm => {
  return [{
      type: 'el-row',
      native: true,
      children: [{
        type: 'el-col',
        props: {
          span: 12
        },
        children: [{
          type: 'input',
          field: 'debtor',
          title: '债务人名称'
        }]
      }, {
        type: 'el-col',
        props: {
          span: 12
        },
        children: [{
            type: 'input',
            title: '基础交易合同及编号',
            field: 'contract_name',
            col: {
              span: 17
            },
            props: {
              placeholder: "合同名称"
            }
          },
          {
            type: 'input',
            field: 'contract_no',
            col: {
              span: 7
            },
            props: {
              placeholder: "合同编号"
            }
          }
        ]
      }]
    },
    {
      type: 'input',
      field: 'receive_type',
      title: '应收账款种类',
      col: {
        span: 12
      }
    },
    {
      type: 'number-input',
      field: 'receive_amount',
      title: '应收账款金额（元）',
      col: {
        span: 12
      },
      validate: vm.formValidate({
        max: 999999999999.999,
        required: true
      }),
      props: {
        needFormat: true
      }
    },
    {
      type: 'input',
      field: 'invoice_no',
      title: '发票号',
      col: {
        span: 12
      }
    },
    {
      type: 'number-input',
      field: 'invoice_amount',
      title: '发票金额（元）',
      col: {
        span: 12
      },
      validate: vm.formValidate({
        max: 999999999999.999
      }),
      props: {
        needFormat: true
      }
    },
    {
      type: 'el-date-picker',
      field: 'invoice_date',
      title: '发票开具日',
      col: {
        span: 12
      },
      props: {
        valueFormat: 'yyyyMMdd'
      },
      style: {
        width: '100%'
      }
    },
    {
      type: 'el-date-picker',
      field: 'transfer_due_date',
      title: '转让的应收账款到期日',
      col: {
        span: 12
      },
      props: {
        valueFormat: 'yyyyMMdd'
      },
      style: {
        width: '100%'
      }
    },
    {
      type: 'el-date-picker',
      field: 'transfer_date',
      title: '转付日',
      col: {
        span: 12
      },
      props: {
        valueFormat: 'yyyyMMdd'
      },
      style: {
        width: '100%'
      }
    },
    {
      type: 'input',
      field: 'remark',
      title: '备注',
      props: {
        type: 'textarea',
        maxlength: 500
      },
      col: {
        span: 24
      }
    }
  ]
}
export const getFormItem = vm => {
  const type = vm.$route.query.business_type
  let formRule = []
  let filedArr = []
  switch (parseInt(type)) {
    case 1: // 直租
      filedArr = ['subject_type', 'subject_name', 'subject_model', 'num', 'unit', 'purchase_price', 'total_price', 'purchase_date', 'firm', 'position', 'remark']
      filedArr.forEach((item, i) => {
        const filterData = _formItem(vm).filter(el => item === el.field)
        if (filterData.length) {
          formRule.push(filterData[0])
        }
      })
      break
    case 3: // 保理
      formRule = _formItemFactoring(vm)
      break
    case 2: // 回租
    case 4: // 通道业务
    case 5: // 转租赁
    case 6: // 投资类
    case 7: // 其他类
      filedArr = ['subject_type', 'subject_name', 'subject_model', 'num', 'unit', 'original_value', 'net_value', 'appraisal_value', 'firm', 'position', 'time_use', 'remark']
      filedArr.forEach((item, i) => {
        const filterData = _formItem(vm).filter(el => item === el.field)
        if (filterData.length) {
          formRule.push(filterData[0])
        }
      })
      break
  }
  return formRule
}
