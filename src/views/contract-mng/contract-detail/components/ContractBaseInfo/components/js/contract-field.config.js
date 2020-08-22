const formValidate = Vue.prototype.formValidate
import {
  deepAssign,
  isEmptyObj
} from 'utils'
import DROP_MENUS_FORM from "./drop-menus-form.js";
import staticOption from "./static-option.js";
export function getContractBycommand(contracTypeForm) {
  return deepAssign([], DROP_MENUS_FORM.find(item => item.contracTypeForm === contracTypeForm))
}
// 根据合同英文类型查找对应的合同类型数字
export const findContractType = type => {
  return getContractBycommand(type).contract_type
}

// 渲染人员数据
export const setRoleInfo = (context, oData) => {
  const obj = {}
  for (const key in oData) {
    if (oData.hasOwnProperty(key)) {
      const element = oData[key]
      obj[key] = element
      // 地址
      if (key.endsWith('Address') && obj[key]) {
        let arr = obj[key].split(',')
        if (arr.length <= 1) {
          arr = ['', '', ''].concat(arr)
        }
        const detail = arr.pop()
        obj[key] = arr
        if (detail) {
          obj[key + 'Detail'] = detail
        }
      }
      // 银行账户
      if (key === 'accountingBankList' && obj[key]) {
        const bankOpt = element.map(item => {
          return {
            label: item.bankInfo,
            value: item.bankId,
            ...item
          }
        })
        context.fApi.updateRule('bankId', {
          props: {
            params: {
              options: bankOpt
            }
          }
        }, true)
      }
    }
  }
  context.fApi.setValue(obj)
  context.fApi.clearValidateState()
}

// 获取数据
export const formatFormData = (context, data) => {
  const oData = deepAssign({}, data)
  for (const key in oData) {
    if (oData.hasOwnProperty(key)) {
      const element = oData[key]
      if (!element) {
        oData[key] = ''
      }
      if (element) {
        if (element instanceof Array) {
          // 地址
          if (key.endsWith('Address') || key.endsWith('Location') || key.endsWith('Locations')) {
            const addrArr = element.length <= 1 ? new Array(3).fill('') : element
            let addr = addrArr.join(',') + ','
            if (oData[key + 'Detail']) {
              addr += oData[key + 'Detail']
            }
            oData[key] = addr
            delete oData[key + 'Detail']
          }
          // 时间段
          if (key.endsWith('Date')) {
            oData[`${key}1`] = element[0]
            oData[`${key}2`] = element[1]
          }
        } else if (typeof element === 'object') {
          // 对象
          for (const k in element) {
            if (element.hasOwnProperty(k)) {
              oData[k] = element[k]
            }
          }
          delete oData[key]
        }
      }
    }
  }
  return oData
}

// 人员rules配置项
const _roleRuleMaker = (context, data = {}) => {
  const rules = {
    id: {
      type: 'hidden',
      field: 'id',
      title: '主键'
    },
    roleId: {
      type: 'hidden',
      field: 'roleId',
      title: '人员ID',
      show: false
    },
    roleName: {
      type: 'input',
      field: 'roleName',
      title: '人员名称',
      show: true,
      props: {
        disabled: true
      }
    },
    selectRoleId: {
      type: 'el-custom-select',
      field: 'roleId',
      title: '人员名称',
      show: false,
      validate: formValidate({
        required: true
      }),
      props: {
        params: {
          options: [],
          searchKey: 'roleName',
          labelKey: 'roleName',
          valueKey: 'roleId',
          repeat: false
        },
        filterable: true
      },
      on: {
        change: oData => {
          const prevValue = context.fApi.getValue('roleId')
          const custCategory = context.contractItem.custCategory
          const formData = oData.data
          if (custCategory) {
            const tips = custCategory == 1 ? '个人' : '机构'
            if (custCategory != formData.custCategory) {
              context.$showToast(`该合同不可新增${tips}客户!`, 'warning')
              setTimeout(() => {
                context.fApi.setValue('roleId', prevValue)
              })
              return
            }
          }
          formData.contactPeople = formData.contactPeople ? formData.contactPeople : formData.roleName
          setRoleInfo(context, formData)
          context.handleRoleChange(formData)
        }
      }
    },
    roleType: {
      type: 'hidden',
      field: 'roleType',
      title: '人员类型'
    },
    idCode: {
      type: 'input',
      field: 'idCode',
      title: '统一社会信用代码', // 身份证号
      props: {
        disabled: true
      }
    },
    legalPerson: {
      type: 'input',
      field: 'legalPerson',
      title: '法定代表人',
      props: {
        disabled: true
      }
    },
    registerAddress: {
      type: 'el-col',
      native: true,
      col: {
        span: 24
      },
      children: [{
          type: 'china-region-cascade',
          field: 'registerAddress',
          title: '注册地址',
          validate: formValidate({
            required: true
          }),
          props: {
            separator: '-'
          },
          col: {
            span: 12
          }
        },
        {
          type: 'input',
          field: 'registerAddressDetail',
          validate: formValidate({
            required: true
          }),
          col: {
            span: 12
          }
        }
      ]
    },
    contactPeople: {
      type: 'input',
      field: 'contactPeople',
      title: '联系人',
      validate: formValidate({
        required: true
      })
    },
    employer: {
      type: 'input',
      field: 'employer',
      title: '工作单位',
      validate: formValidate({
        required: true
      })
    },
    contactNumber: {
      type: 'input',
      field: 'contactNumber',
      title: '电话',
      validate: formValidate({
        required: true
      })
    },
    officeAddress: {
      type: 'el-col',
      native: true,
      col: {
        span: 24
      },
      children: [{
          type: 'china-region-cascade',
          field: 'officeAddress',
          title: '办公地址',
          validate: formValidate({
            required: true
          }),
          props: {
            separator: '-'
          },
          col: {
            span: 12
          }
        },
        {
          type: 'input',
          field: 'officeAddressDetail',
          validate: formValidate({
            required: true
          }),
          col: {
            span: 12
          }
        }
      ]
    },
    zipCode: {
      type: 'input',
      field: 'zipCode',
      title: '邮编',
      validate: formValidate({
        // type: 'post'
      })
    },
    fax: {
      type: 'input',
      field: 'fax',
      title: '传真'
    },
    bankInfo: {
      type: 'hidden',
      field: 'bankInfo',
      title: '银行账户',
      show: true
    },
    bankId: {
      type: 'el-custom-select',
      title: '银行账户',
      field: 'bankId',
      show: false,
      validate: formValidate({
        required: true
      }),
      props: {
        params: {
          options: [],
          searchKey: 'bankInfo',
          labelKey: 'bankInfo',
          valueKey: 'bankId',
          repeat: false
        }
      },
      on: {
        change: oData => {
          const data = oData.data
          context.fApi.setValue('bankCode', data.bankCode)
          context.fApi.setValue('bankInfo', data.bankInfo)
        }
      }
    },
    bankCode: {
      type: 'input',
      title: '收款银行',
      field: 'bankCode',
      validate: formValidate({
        required: true
      }),
      props: {
        disabled: true
      }
    }
  }
  return rules
}

// 合同rules配置项
const _ruleMaker = (context, data = {}) => {
  const rules = {
    id: {
      field: 'id',
      type: 'hidden',
      value: ''
    },
    relatedContractId: {
      type: 'el-custom-select',
      field: 'relatedContractId',
      title: '融资租赁合同编号',
      show: false,
      validate: formValidate({
        required: true
      }),
      props: {
        params: {
          options: [],
          searchKey: 'relatedContractId',
          labelKey: 'relatedContractNo',
          valueKey: 'relatedContractId',
          repeat: false
        },
        filterable: true
      },
      on: {
        change: oData => {
          context.handleChange('relatedContractId', oData.data)
          // console.log('--------', oData)
          // setRoleInfo(context, formData)
        }
      }
    },
    relatedContractNo: {
      type: 'input',
      field: 'relatedContractNo',
      title: '融资租赁合同编号',
      show: true,
      props: {
        disabled: true
      }
    },
    relatedSideContractNo: {
      type: 'input',
      field: 'relatedSideContractNo',
      title: '租赁合同编号',
      props: {
        disabled: true
      }
    },
    projectManagerId: {
      field: 'projectManagerId',
      type: 'hidden',
      title: '项目管理ID'
    },
    contractNo: {
      type: 'input',
      field: 'contractNo',
      title: '合同编号',
      validate: formValidate({
        required: true
      })
    },
    contractName: {
      type: 'input',
      field: 'contractName',
      title: '合同名称',
      props: {
        disabled: true
      }
    },
    transferContractName: {
      type: 'input',
      field: 'transferContractName',
      title: '被转让合同名称',
      validate: formValidate({
        required: true
      }),
      on: {
        change: val => {
          context.handleChange('transferContractName', val)
        }
      }
    },
    transferContractNo: {
      type: 'input',
      field: 'transferContractNo',
      title: '被转让合同编号',
      validate: formValidate({
        required: true
      }),
      on: {
        change: val => {
          context.handleChange('transferContractNo', val)
        }
      }
    },
    transferSignDate: {
      type: 'el-date-picker',
      field: 'transferSignDate',
      title: '被转让合同签订日期',
      validate: formValidate({
        required: true
      }),
      props: {
        valueFormat: 'timestamp'
      }
    },
    leaseId: {
      type: 'hidden',
      field: 'leaseId',
      title: '承租人ID'
    },
    leaseName: {
      type: 'input',
      field: 'leaseName',
      title: '承租人',
      props: {
        disabled: true
      }
    },
    pledgeSubject: {
      type: 'custom-input',
      field: 'pledgeSubject',
      title: '质押标的',
      validate: formValidate({
        required: true
      }),
      props: {
        validate: formValidate({
          required: true
        }),
        options: staticOption.pledgeSubject
      }
    },
    pledgeSubject2: {
      type: 'custom-input',
      field: 'pledgeSubject',
      title: '质押标的',
      validate: formValidate({
        required: true
      }),
      props: {
        validate: formValidate({
          required: true
        }),
        options: staticOption.pledgeSubject2
      }
    },
    dueDate: {
      type: 'el-date-picker',
      field: 'dueDate',
      title: '主合同期限',
      validate: formValidate({
        required: true
      }),
      props: {
        'value-format': 'timestamp',
        disabled: true
      },
      fieldMap: 'lastRentDay',
      style: {
        width: '250px'
      }
    },
    quotationPrice: {
      type: 'number-input',
      title: '主合同金额',
      field: 'quotationPrice',
      validate: formValidate({
        required: true
      }),
      children: [{
        type: 'i-button',
        slot: 'append',
        children: ['元']
      }],
      props: {
        disabled: true
      }
    },
    amountCurrency: {
      type: 'input',
      title: '主合同币种',
      field: 'amountCurrency',
      validate: formValidate({
        required: true
      }),
      value: '人民币'
    },
    plusTwoDueDate: {
      type: 'el-date-picker',
      field: 'plusTwoDueDate',
      title: '担保期限', // 抵质押期限
      validate: formValidate({
        required: true
      }),
      props: {
        'value-format': 'timestamp',
        disabled: false
      },
      style: {
        width: '250px'
      }
    },
    transferAgreement: {
      type: 'el-custom-select',
      field: 'transferAgreement',
      title: '应收租赁款转让协议',
      validate: formValidate({
        required: false
      }),
      props: {
        params: {
          options: [],
          searchKey: 'transferAgreement',
          labelKey: 'transferAgreement',
          valueKey: 'transferAgreement',
          repeat: false
        },
        filterable: true
      },
      on: {
        change: oData => {

        }
      }
    },
    gager: {
      type: 'input',
      title: '质物',
      field: 'gager',
      validate: formValidate({
        required: true
      }),
      style: {
        maxWidth: '100%',
        width: '100%'
      },
      col: {
        span: 24
      },
      className: 'no-prepend-bg',
      children: [{
        type: 'i-button',
        slot: 'prepend',
        children: ['本合同项下质物为']
      }]
    },
    guaranteeObligation: {
      type: 'custom-input',
      title: '担保主债权的种类、金额',
      field: 'guaranteeObligation',
      validate: formValidate({
        required: true
      }),
      props: {
        validate: formValidate({
          required: true
        }),
        options: staticOption.guaranteeObligation
      }
    },
    /** 底部表单 */
    equipmentLocation: {
      type: 'el-col',
      native: true,
      col: {
        span: 24
      },
      children: [{
          type: 'china-region-cascade',
          field: 'equipmentLocation',
          title: '设置场所(设备存放地点)',
          validate: formValidate({
            required: true
          }),
          props: {
            separator: '-'
          },
          col: {
            span: 12
          }
        },
        {
          type: 'input',
          validate: formValidate({
            required: true
          }),
          field: 'equipmentLocationDetail',
          col: {
            span: 12
          }
        }
      ]
    },
    customPurchasePrice: {
      type: 'custom-input',
      field: 'customPurchasePrice',
      title: '留购价款',
      fieldMap: getFieldMap(staticOption.customPurchasePrice),
      validate: formValidate({
        required: true
      }),
      value: {
        purchasePriceDefault: data.firmDiscount,
        purchasePrice: data.firmDiscount
      },
      props: {
        validate: formValidate({
          required: true
        }),
        options: staticOption.customPurchasePrice
      }
    },
    contractExplain: {
      type: 'input',
      field: 'contractExplain',
      title: '合同说明',
      props: {
        type: 'textarea',
        maxlength: 1024
      }
    },
    firstPrice: {
      type: 'number-input',
      field: 'firstPrice',
      title: '首付款',
      props: {
        needFormat: true,
        disabled: true
      },
      children: [{
        type: 'i-button',
        slot: 'append',
        children: ['元']
      }]
    },
    customFirstPriceWay: {
      type: 'radio',
      field: 'customFirstPriceWay',
      title: '首付款支付方式',
      value: '1',
      validate: formValidate({
        required: true
      }),
      options: staticOption.customFirstPriceWay
    },
    bond: {
      type: 'number-input',
      field: 'bond',
      title: '风险保证金',
      props: {
        needFormat: true,
        disabled: true
      },
      children: [{
        type: 'i-button',
        slot: 'append',
        children: ['元']
      }]
    },
    customBondWay: {
      type: 'radio',
      field: 'customBondWay',
      title: '风险金支付方式',
      value: '1',
      validate: formValidate({
        required: true
      }),
      options: staticOption.customBondWay
    },
    insurance: {
      type: 'number-input',
      title: '保险',
      field: 'insurance',
      className: 'no-append-bg no-prepend-bg',
      children: [{
          type: 'i-button',
          slot: 'prepend',
          children: ['起租后']
        },
        {
          type: 'i-button',
          slot: 'append',
          children: ['个工作日内，由乙方自行向保险公司办理租赁物的财产一切险或其他保险']
        }
      ],
      props: {
        minDecimal: 0,
        maxDecimal: 0,
        needFormat: false
      }
    },
    consultingServiceFee: {
      type: 'number-input',
      field: 'consultingServiceFee',
      title: '咨询服务费',
      props: {
        needFormat: true,
        disabled: true
      },
      value: data.service,
      children: [{
        type: 'i-button',
        slot: 'append',
        children: ['元']
      }]
    },
    consultingServiceFee2: {
      type: 'custom-input',
      field: 'consultingServiceFee',
      title: '咨询服务费',
      fieldMap: getFieldMap(staticOption.consultingServiceFee2),
      props: {
        options: staticOption.consultingServiceFee2
      }
    },
    tradingLocations: {
      type: 'el-col',
      native: true,
      col: {
        span: 24
      },
      children: [{
          type: 'china-region-cascade',
          field: 'tradingLocations',
          title: '交货地点',
          validate: formValidate({
            required: true
          }),
          props: {
            separator: '-'
          },
          col: {
            span: 12
          }
        },
        {
          type: 'input',
          field: 'tradingLocationsDetail',
          validate: formValidate({
            required: true
          }),
          col: {
            span: 12
          }
        }
      ]
    },
    tradingDate: {
      type: 'el-date-picker',
      field: 'tradingDate',
      fieldMap: 'anticipatedRentDate',
      title: '交货时间',
      validate: formValidate({
        required: true
      }),
      props: {
        'value-format': 'timestamp'
      }
    },
    freeWarranty: {
      type: 'el-row',
      native: true,
      children: [{
        type: 'el-col',
        props: {
          span: 24
        },
        children: [{
          type: 'number-input',
          title: '免费保修期',
          field: 'freeWarranty',
          validate: formValidate({
            required: true
          }),
          className: 'no-prepend-bg no-append-bg',
          children: [{
              type: 'i-button',
              slot: 'prepend',
              children: ['为设备验收合格日起']
            },
            {
              type: 'i-button',
              slot: 'append',
              children: ['个月']
            }
          ],
          props: {
            minDecimal: 0,
            maxDecimal: 0,
            needFormat: false
          }
        }]
      }]
    },
    firstEquipmentAmount: {
      type: 'el-row',
      native: true,
      children: [{
        type: 'el-col',
        props: {
          span: 24
        },
        children: [{
          type: 'number-input',
          title: '第一笔设备款',
          field: 'firstEquipmentAmount',
          validate: formValidate({
            required: true
          }),
          className: 'no-prepend-bg',
          children: [{
              type: 'i-button',
              slot: 'prepend',
              children: ['丙方在本合同签订后5个工作日内向乙方支付']
            },
            {
              type: 'i-button',
              slot: 'append',
              children: ['元']
            }
          ]
        }]
      }]
    },
    secondEquipmentAmount: {
      type: 'custom-input',
      field: 'secondEquipmentAmount',
      title: '第二笔设备款',
      fieldMap: getFieldMap(staticOption.secondEquipmentAmount),
      props: {
        options: staticOption.secondEquipmentAmount
      }
    },
    shipmentLocations: {
      type: 'el-col',
      native: true,
      col: {
        span: 24
      },
      children: [{
          type: 'china-region-cascade',
          field: 'shipmentLocations',
          title: '装运地',
          validate: formValidate({
            required: true
          }),
          props: {
            separator: '-'
          },
          col: {
            span: 12
          }
        },
        {
          type: 'input',
          field: 'shipmentLocationsDetail',
          validate: formValidate({
            required: true
          }),
          col: {
            span: 12
          }
        }
      ]
    },
    content: {
      type: 'hidden',
      field: 'content'
    },
    equipmentPrice: {
      type: 'number-input',
      field: 'equipmentPrice',
      fieldMap: 'quotationPrice',
      title: '设备价款',
      props: {
        disabled: true
      },
      value: data.quotationPrice,
      children: [{
        type: 'i-button',
        slot: 'append',
        children: ['元']
      }]
    },
    equipmentPricePayment: {
      type: 'custom-input',
      field: 'equipmentPricePayment',
      title: '设备价款支付',
      fieldMap: getFieldMap(staticOption.equipmentPricePayment),
      props: {
        disabled: 'true',
        options: staticOption.equipmentPricePayment
      }
    },
    yiToJiaFile: {
      type: 'custom-input',
      field: 'yiToJiaFile',
      title: '乙方需向甲方提供的文件 ',
      validate: formValidate({
        required: true
      }),
      props: {
        validate: formValidate({
          required: true
        }),
        options: staticOption.yiToJiaFile
      }
    },
    yiPayEquipment: {
      type: 'custom-input',
      field: 'yiPayEquipment',
      title: '乙方支付购买合同项下设备价款 ',
      validate: formValidate({
        required: true
      }),
      props: {
        validate: formValidate({
          required: true
        }),
        options: staticOption.yiPayEquipment
      }
    },
    guarantee: {
      type: 'custom-guarantee-list',
      field: 'guarantee',
      title: '担保'
    },
    paymentConditions: {
      type: 'custom-input',
      field: 'paymentConditions',
      title: '支付前提条件',
      validate: formValidate({
        required: true
      }),
      props: {
        validate: formValidate({
          required: true
        }),
        options: staticOption.paymentConditions
      }
    },
    paymentConditions2: {
      type: 'custom-input',
      field: 'paymentConditions',
      title: '支付前提条件',
      validate: formValidate({
        required: true
      }),
      fieldMap: getFieldMap(staticOption.paymentConditions2),
      props: {
        validate: formValidate({
          required: true
        }),
        options: staticOption.paymentConditions2
      }
    },
    disputeResolution: {
      type: 'custom-radio-group',
      field: 'disputeResolution',
      title: '争议解决方式',
      value: {
        disputeResolution_radio: '1'
      },
      validate: formValidate({
        required: true
      }),
      props: {
        validate: formValidate({
          required: true
        }),
        options: staticOption.disputeResolution
      }
    },
    disputeResolution2: {
      type: 'custom-radio-group',
      field: 'disputeResolution',
      title: '争议解决方式',
      validate: formValidate({
        required: true
      }),
      value: {
        disputeResolution_radio: '1'
      },
      props: {
        validate: formValidate({
          required: true
        }),
        options: staticOption.disputeResolution2
      }
    },
    disputeResolution3: {
      type: 'custom-radio-group',
      field: 'disputeResolution',
      title: '争议解决方式',
      value: {
        disputeResolution_radio: '1'
      },
      validate: formValidate({
        required: true
      }),
      props: {
        validate: formValidate({
          required: true
        }),
        options: staticOption.disputeResolution3
      }
    },
    disputeResolution4: {
      type: 'custom-radio-group',
      field: 'disputeResolution',
      title: '争议解决方式',
      value: {
        disputeResolution_radio: '1'
      },
      validate: formValidate({
        required: true
      }),
      props: {
        validate: formValidate({
          required: true
        }),
        options: staticOption.disputeResolution4
      }
    },
    creditorTransferPayment: {
      type: 'custom-input',
      field: 'creditorTransferPayment',
      title: '应收租赁款债权转让款',
      fieldMap: getFieldMap(staticOption.creditorTransferPayment),
      props: {
        options: staticOption.creditorTransferPayment
      }
    },
    creditorTransferPayment2: {
      type: 'custom-input',
      field: 'creditorTransferPayment',
      title: '应收租赁款债权转让款',
      validate: formValidate({
        required: true
      }),
      fieldMap: getFieldMap(staticOption.creditorTransferPayment2),
      props: {
        validate: formValidate({
          required: true
        }),
        disabled: 'true',
        options: staticOption.creditorTransferPayment2,
        beRelated: ['transferContractName', 'transferContractNo']
      }
    },
    contractNumber: {
      type: 'custom-input',
      field: 'contractNumber',
      title: '合同',
      validate: formValidate({
        required: true
      }),
      props: {
        validate: formValidate({
          required: true
        }),
        options: staticOption.contractNumber
      }
    },
    leaseReceivable: {
      type: 'custom-input',
      field: 'leaseReceivable',
      title: '应收租赁款',
      fieldMap: getFieldMap(staticOption.leaseReceivable),
      props: {
        disabled: 'true',
        options: staticOption.leaseReceivable,
        beRelated: ['transferContractName', 'transferContractNo']
      }
    },
    customLeaseFinancing: {
      type: 'custom-input',
      title: '租赁成本',
      field: 'customLeaseFinancing',
      className: 'no-prepend-bg no-append-bg',
      value: {
        customLeaseFinancing_t1: data.leaseFinancing
      },
      props: {
        disabled: 'true',
        options: staticOption.customLeaseFinancing
      }
    },
    leaseTerm: {
      type: 'number-input',
      title: '租赁期限',
      field: 'leaseTerm',
      className: 'no-prepend-bg no-append-bg',
      children: [{
          type: 'i-button',
          slot: 'prepend',
          children: ['共（']
        },
        {
          type: 'i-button',
          slot: 'append',
          children: ['）个月，自起租日起算。']
        }
      ],
      props: {
        disabled: true,
        minDecimal: 0,
        maxDecimal: 0
      }
    },
    paymentWay: {
      type: 'custom-input',
      field: 'paymentWay',
      title: '租金支付方式',
      validate: formValidate({
        required: true
      }),
      fieldMap: getFieldMap(staticOption.paymentWay),
      props: {
        validate: formValidate({
          required: true
        }),
        options: staticOption.paymentWay
      }
    },
    customRentAmount: {
      type: 'custom-input',
      field: 'customRentAmount',
      title: '租金金额',
      validate: formValidate({
        required: data.calculateRentMethod == 2
      }),
      fieldMap: data.calculateRentMethod == 2 ? getFieldMap(staticOption.customRentAmount) : [],
      props: {
        validate: formValidate({
          required: data.calculateRentMethod == 2
        }),
        options: data.calculateRentMethod == 2 ? staticOption.customRentAmount : ['详见租金支付表']
      }
    },
    rentAdjustType: {
      type: 'custom-radio-group',
      field: 'rentAdjustType',
      title: '租金调整',
      validate: formValidate({
        required: true
      }),
      props: {
        validate: formValidate({
          required: true
        }),
        options: staticOption.rentAdjustType
      }
    },
    riskPayment: {
      type: 'custom-radio-group',
      field: 'riskPayment',
      title: '风险金/风险金支付方式',
      validate: formValidate({
        required: true
      }),
      value: {
        riskPayment_t1: data.deductionBond + '',
        riskPayment_radio: data.bondWays
      },
      props: {
        validate: formValidate({
          required: true
        }),
        options: staticOption.riskPayment
      }
    },
    agreementPrice: {
      type: 'custom-input',
      field: 'agreementPrice',
      title: '协议价款支付',
      fieldMap: getFieldMap(staticOption.agreementPrice),
      props: {
        options: staticOption.agreementPrice,
        disabled: 'true'
      }
    },
    agreementPriceUse: {
      type: 'input',
      field: 'agreementPriceUse',
      title: '租赁物协议价款用途',
      validate: formValidate({
        required: true
      }),
      props: {
        type: 'textarea'
      }
    },
    electricityFee: {
      type: 'input',
      field: 'electricityFee',
      title: '电费收益权',
      props: {
        validate: formValidate({
          required: true
        }),
        type: 'textarea',
        maxlength: 1024
      }
    },
    consultingServiceDate: {
      type: 'el-date-picker',
      field: 'consultingServiceDate',
      title: '咨询服务时间',
      style: {
        width: "250px"
      },
      fieldMap: ['consultingServiceDate1', 'consultingServiceDate2'],
      props: {
        type: "daterange",
        format: "yyyy-MM-dd",
        valueFormat: "timestamp",
        rangeSeparator: '-',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
      }
    },
    paymentDate: {
      type: 'el-date-picker',
      field: 'paymentDate',
      fieldMap: 'anticipatedRentDate',
      title: '支付时间',
      validate: formValidate({
        required: true
      }),
      props: {
        valueFormat: "timestamp"
      }
    },
    designatedBankId: {
      type: 'el-custom-select',
      field: 'designatedBankId',
      title: '乙方和丙方指定账户',
      show: false,
      validate: formValidate({
        required: true
      }),
      props: {
        params: {
          options: [],
          searchKey: 'bankInfo',
          labelKey: 'bankInfo',
          valueKey: 'bankId',
          repeat: false
        },
        filterable: true
      },
      on: {
        change: oData => {
          context.fApi.setValue('designatedBankInfo', oData.data.bankInfo)
        }
      }
    },
    designatedBankInfo: {
      type: 'hidden',
      field: 'designatedBankInfo',
      title: '乙方和丙方指定账户',
      show: true
    },
    specialAgreement: {
      type: 'custom-input',
      title: '特别约定',
      field: 'specialAgreement',
      validate: formValidate({
        required: true
      }),
      props: {
        validate: formValidate({
          required: true
        }),
        options: staticOption.specialAgreement
      }
    }
  }
  return rules
}

// 获取options字段集合
function getFieldMap(options) {
  const tempArr = []
  options.forEach(item => {
    item.forEach(cItem => {
      if (typeof cItem == 'object') {
        tempArr.push(cItem.field)
      }
    })
  })
  return tempArr
}

/**
 * 处理人员字段
 * @param {Object} context 上下文
 * @param {Object} roleType 人员类型
 * @param {String} name 合同自定义英文名
 * @param {Object} data 表单数据
 */
export const getFormRules = (context, roleType, name, data = {}) => {
  if (!name || !roleType) return
  const contractType = getContractBycommand(name)
  if (!contractType) return
  const index = contractType.roleTypes.findIndex(idx => idx == roleType)
  const fieldArr = contractType.roleForm[index].formItem
  if (!fieldArr) return []
  return _getField(context, fieldArr, roleType, data)
}
/**
 * 处理合同字段
 * @param {Object} context 上下文
 * @param {Object} formType 表单类型，可选mainForm、otherForm
 * @param {String} name 合同自定义英文名
 * @param {Object} data 表单数据
 */
export const getCommonFormRules = (context, formType, name, data) => {
  const contractType = getContractBycommand(name)
  const fieldArr = contractType[formType]
  if (!fieldArr) return []
  return _getField(context, fieldArr, null, data)
}
/**
 * json转符合formCreated的rules格式
 * @param {Object} context 上下文
 * @param {Array} fieldMap 字段数组集合
 * @param {Object} roleType 人员类型
 * @param {Object} data 表单数据
 */
function _getField(context, fieldMap, roleType, data = {}) {
  const rulesPools = roleType ? _roleRuleMaker(context, data) : _ruleMaker(context, data)
  const rules = []
  fieldMap.forEach(item => {
    let obj = {}
    if (typeof item === 'object') {
      const key = Object.keys(item)[0]
      if (rulesPools[key]) {
        obj = deepAssign({}, rulesPools[key])
        if (obj.type === 'el-col') {
          // 地址
          for (let c = 0; c < obj.children.length; c++) {
            const cItem = obj.children[c]
            if (cItem.field === key) {
              cItem.title = item[key].name
            }
            if (cItem.field === key || cItem.field === `${key}Detail`) {
              if (!cItem.props) cItem.props = {}
              if (item[key].hasOwnProperty('disabled')) {
                cItem.props.disabled = item[key].disabled ? 'true' : false
              }
              if (item[key].hasOwnProperty('validate')) {
                cItem.validate = context.formValidate({
                  required: !!item[key].validate
                })
              }
            }
          }
        } else {
          if (item[key].hasOwnProperty('name')) {
            obj.title = item[key].name
          }
          if (item[key].hasOwnProperty('disabled')) {
            obj.props.disabled = item[key].disabled
          }
          if (item[key].hasOwnProperty('hidden')) {
            obj.type = 'hidden'
          }
          if (item[key].hasOwnProperty('validate')) {
            obj.validate = context.formValidate({
              required: item[key].validate
            })
          }
        }
      } else {
        console.error(`${item}未配置rules规则`)
      }
    } else if (rulesPools[item]) {
      obj = deepAssign({}, rulesPools[item])
    } else {
      console.error(`${item}未配置rules规则`)
    }
    if (!isEmptyObj(obj)) {
      rules.push(obj)
    }
  })
  return rules
}
