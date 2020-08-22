import {
  queryDictItems,
  queryDictValue
} from 'utils'
import leaseData from './lease-type.min'
import LEASE from './lease-dict.min'
// type为业务类型（1-直租  2-回租 3-保理 5-转租赁  4-通道业务  6-投资类  7-其他类）
const _tableColumns = () => {
  return [{
      attrs: {
        prop: 'leaseType',
        label: '租赁物分类',
        showOverflowTooltip: true,
        minWidth: 90,
        formatter: row => {
          return queryleaseTypeByIds(row.leaseType, ',')
        },
      }
    },
    {
      attrs: {
        prop: 'name',
        label: '租赁物分项名称',
        showOverflowTooltip: true,
        minWidth: 90
      }
    },
    {
      attrs: {
        prop: 'model',
        label: '规格型号',
        showOverflowTooltip: true
      }
    },
    {
      attrs: {
        prop: 'num',
        label: '数量'
      }
    },
    {
      attrs: {
        prop: 'unit',
        label: '单位'
      }
    },
    {
      attrs: {
        prop: 'buildDate',
        label: '购置/建造年月',
        formatter: (row, column) => {
          return Vue.filter('filterDateSeparate')(row.buildDate)
        },
        showOverflowTooltip: true,
        minWidth: 120
      }
    },
    {
      attrs: {
        prop: 'sourceValue',
        label: '原值（万元）',
        formatter: (row, column) => {
          return Vue.filter('filterToThousand')(row.sourceValue)
        },
        showOverflowTooltip: true,
        minWidth: 90
      }
    },
    {
      attrs: {
        prop: 'newRate',
        label: '成新率'
      }
    },
    {
      attrs: {
        prop: 'elevateValue',
        label: '净/估值（万元）',
        formatter: (row, column) => {
          return Vue.filter('filterToThousand')(row.elevateValue)
        },
        showOverflowTooltip: true,
        minWidth: 90
      }
    },
    {
      attrs: {
        prop: 'remarks',
        label: '备注（描述位置、厂家）',
        showOverflowTooltip: true,
        minWidth: 150
      }
    }
  ]
}
const _tableColumnsFactoring = () => {
  return [{
      attrs: {
        prop: 'debtor',
        label: '债务人名称',
        showOverflowTooltip: true,
        minWidth: 90
      }
    },
    {
      attrs: {
        prop: 'contract_name',
        label: '基础交易合同及编号',
        formatter: (row, column) => {
          return row.contract_name + row.contract_no
        },
        showOverflowTooltip: true,
        minWidth: 140
      }
    },
    {
      attrs: {
        prop: 'receive_type',
        label: '应收账款种类',
        showOverflowTooltip: true,
        minWidth: 100
      }
    },
    {
      attrs: {
        prop: 'receive_amount',
        label: '应收账款金额（元）',
        formatter: (row, column) => {
          return Vue.filter('filterToThousand')(row.receive_amount)
        },
        showOverflowTooltip: true,
        minWidth: 140
      }
    },
    {
      attrs: {
        prop: 'invoice_no',
        label: '发票号',
        showOverflowTooltip: true
      }
    },
    {
      attrs: {
        prop: 'invoice_amount',
        label: '发票金额（元）',
        formatter: (row, column) => {
          return Vue.filter('filterToThousand')(row.invoice_amount)
        },
        showOverflowTooltip: true,
        minWidth: 120
      }
    },
    {
      attrs: {
        prop: 'invoice_date',
        label: '发票开具日',
        formatter: (row, column) => {
          return Vue.filter('filterDateSeparate')(row.invoice_date)
        },
        showOverflowTooltip: true,
        minWidth: 90
      }
    },
    {
      attrs: {
        prop: 'transfer_due_date',
        label: '转让的应收账款到期日',
        formatter: (row, column) => {
          return Vue.filter('filterDateSeparate')(row.transfer_due_date)
        },
        showOverflowTooltip: true,
        minWidth: 160
      }
    },
    {
      attrs: {
        prop: 'transfer_date',
        label: '转付日',
        formatter: (row, column) => {
          return Vue.filter('filterDateSeparate')(row.transfer_date)
        },
        showOverflowTooltip: true
      }
    },
    {
      attrs: {
        prop: 'remark',
        label: '备注',
        showOverflowTooltip: true,
        minWidth: 150
      }
    }
  ]
}
export const getTableColumns = (vm, type) => {
  let columns = []
  let filedArr = []
  switch (parseInt(type)) {
    case 1: // 直租
      filedArr = ['leaseType', 'name', 'model', 'num', 'unit', 'buildDate', 'sourceValue', 'newRate', 'elevateValue', 'remarks']
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

const _formItem = vm => {
  return [{
      type: 'hidden',
      field: 'id',
      title: '租赁物id',
      col: {
        span: 12
      }
    },
    {
      type: 'cascader',
      title: '租赁物分类',
      field: 'leaseType',
      col: { span: 12 },
      style: { width: '100%' },
      props:{
        options: Object.freeze(leaseData),
      },
      validate: vm.formValidate({
        required: true
      })
    },
    {
      type: 'input',
      field: 'name',
      title: '租赁物分项名称',
      col: {
        span: 12
      },
      validate: vm.formValidate({
        required: true
      })
    },
    {
      type: 'input',
      field: 'model',
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
        span: 12
      },
      props: {
        maxDecimal: 0
      }
    },
    {
      type: 'input',
      field: 'unit',
      title: '单位',
      col: {
        span: 12
      }
    },
    {
      type: 'el-date-picker',
      field: 'buildDate',
      title: '购置/建造年月',
      col: {
        span: 12
      },
      props: {
        valueFormat: 'timestamp'
      },
      style: {
        width: '100%'
      }
    },
    {
      type: 'number-input',
      field: 'sourceValue',
      title: '原值（万元）',
      col: {
        span: 12
      },
      props: {
        needFormat: true
      }
    },
    {
      type: 'input',
      field: 'newRate',
      title: '成新率',
      col: {
        span: 12
      }
    },
    {
      type: 'number-input',
      field: 'elevateValue',
      title: '净/估值（万元）',
      col: {
        span: 12
      },
      props: {
        needFormat: true
      }
    },
    {
      type: 'input',
      field: 'remarks',
      title: '备注（描述位置、厂家）',
      props: {
        type: 'textarea',
        maxlength: 500,
        rows: 2
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
        max: 999999999999.99,
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
        max: 999999999999.99
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
export const getFormItem = (vm, type) => {
  let formRule = []
  let filedArr = []
  switch (parseInt(type)) {
    case 1: // 直租
      filedArr = ['id','leaseType','name', 'model', 'num', 'unit', 'buildDate', 'sourceValue', 'newRate', 'elevateValue', 'remarks']

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

export const queryleaseTypeByIds = (ids, separator = '') => {
  if (!ids) return ''
  const idArr = (ids + '').split(',')
  const res = idArr.map((code, index) => {
    if (!code) return ''
    if (index === 0) return LEASE['All'][code]
    return LEASE[idArr[index - 1]][code]
  })
  return res.join(separator)
}
