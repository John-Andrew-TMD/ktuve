import {
  queryDictItems
} from 'utils'
export default {
  // 支付前提条件
  paymentConditions: [
    ['1.甲方收到乙方出具的付款通知书正本'],
    ['2.甲方收到乙方应当向甲方支付的其他款项。'],
    ['3.甲方已见证关于租赁物的发票原件，并收到发票复印件；或甲方已收到第三方评估公司出具的租赁物评估报告。'],
    ['4.甲方收到乙方出具的董事会/股东会决议正本并审核确认完毕。'],
    [
      '5.乙方已根据本合同约定办妥租赁物保险，甲方收到保险单复印件。若根据甲方、乙方协商，确认乙方可以在甲方支付之后一定期限内',
      {
        type: 'number-input',
        field: 'paymentConditions_t1',
        props: {
          required: true,
          minDecimal: 0,
          maxDecimal: 0,
          needFormat: false
        }
      },
      '日补办租赁物保险，那么乙方应当根据约定在期限内',
      {
        type: 'number-input',
        field: 'paymentConditions_t2',
        props: {
          required: true,
          minDecimal: 0,
          maxDecimal: 0,
          needFormat: false
        }
      },
      '日将保险单复印件送达甲方。如果发生未按期办理保险或送达保险单复印件的情况，视为乙方构成融资租赁一般条款第十条中约定的违约事项。'
    ],
    [
      '6.甲方收到',
      {
        type: 'input',
        field: 'paymentConditions_t3',
        props: {
          required: true
        }
      },
      '出具同意为乙方提供连带责任保证的董事会/股东会决议正本并审核确认完毕。'
    ],
    ['7.甲方收到本合同以及与本合同相关的担保文件（如有）或其他法律文件的签署版本，且该合同等法律文件已经根据约定及相关法律规定生效。'],
    ['8.若本合同约定乙方或其他担保方应就本合同提供担保，且法律规定或者合同约定需要办理担保登记手续的，甲方收到该等担保登记证明文件。'],
    ['9.乙方已配合甲方在中国人民银行征信中心“中征动产融资统一登记平台”完成了融资租赁登记。']
  ],
  // 支付前提条件2
  paymentConditions2: [
    ['1、甲方收到乙方出具的付款通知书正本。'],
    [
      '2、甲方收到乙方出具的金额为RMB',
      {
        type: 'number-input',
        field: 'leaseFinancingSubBond',
        props: {
          required: true
        }
      },
      '元的资金收据正本；如资金收据非财政或税务部门监制、或虽为财政税务部门监制但与指定用途（若有）不相符，乙方在出具资金收据的同时需提供同等金额且加盖乙方公章的款项收讫证明正本。'
    ],
    ['3、甲方收到乙方提供的租赁物签收文件。'],
    ['4、甲方收到乙方应当向甲方支付的其他款项。'],
    ['5、甲方收到乙方购买的租赁物保险的保险单复印件。'],
  ],
  // 争议解决方式
  disputeResolution: [{
    level: 1,
    type: 'radio',
    field: 'disputeResolution_radio',
    options: [{
        value: '1',
        label: '双方一致同意向甲方所在地法院提起诉讼解决。因诉讼发生的一切费用（包括法院费用、律师费、执行费用及其他相关的费用）由败诉方承担'
      },
      {
        value: '2',
        label: ['双方一致同意提交', {
          type: 'input',
          field: 'disputeResolution_t1'
        }, '仲裁委员会按其仲裁规则予以裁决。仲裁裁决为最终裁决，对双方均具有约束力']
      }
    ]
  }],
  // 争议解决方式2
  disputeResolution2: [{
      level: 1,
      type: 'radio',
      field: 'disputeResolution_radio',
      options: [{
          value: '1',
          label: '向乙方所在地法院提起诉讼解决。因诉讼发生的一切费用（包括法院费用、律师费、执行费用及其他相关的费用）由败诉方承担'
        },
        {
          value: '2',
          label: ['向', {
            type: 'input',
            field: 'disputeResolution_t1'
          }, '仲裁委员会依照其现行有效的仲裁规则申请仲裁。仲裁裁决是终局的，对双方均具有法律约束力。根据中国有关法律，若本合同任何条款被裁决为无效，并不影响本合同其他条款的持续有效和执行']
        }
      ]
    }

  ],
  // 争议解决方式3
  disputeResolution3: [
    [
      '在本合同履行期间，凡因履行本合同所发生的或与本合同有关的一切争议、纠纷，双方可协商解决。协商不能解决时，双方一致同意采取以下第',
      {
        type: 'input',
        field: 'disputeResolution_radio',
        props: {
          disabled: true
        }
      },
      '种方式解决争议：'
    ],
    {
      level: 1,
      type: 'radio',
      field: 'disputeResolution_radio',
      options: [{
          value: '1',
          label: '（1）向甲方住所地人民法院提起诉讼解决。因诉讼发生的一切费用（包括诉讼费用、律师费用、执行费用及其它有关的费用）由败诉方承担。'
        },
        {
          value: '2',
          label: ['（2）向', {
            type: 'input',
            field: 'disputeResolution_t1'
          }, '仲裁委员会依照其现行有效的仲裁规则申请仲裁。仲裁裁决是终局的，对双方均具有法律约束力。']
        }
      ]
    }
  ],
  // 争议解决方式4
  disputeResolution4: [{
    level: 1,
    type: 'radio',
    field: 'disputeResolution_radio',
    options: [{
        value: '1',
        label: '（1）向甲方住所地人民法院提起诉讼解决。因诉讼发生的一切费用（包括诉讼费用、律师费用、执行费用及其它有关的费用）由败诉方承担。'
      },
      {
        value: '2',
        label: ['（2）向', {
          type: 'input',
          field: 'disputeResolution_t1'
        }, '仲裁委员会依照其现行有效的仲裁规则申请仲裁。仲裁裁决是终局的，对双方均具有法律约束力。']
      }
    ]
  }],
  // 首付款支付方式
  customFirstPriceWay: [{
      value: '1',
      label: '由乙方于本合同签署后5个工作日内向甲方支付'
    },
    {
      value: '2',
      label: '由乙方于本合同签署后5个工作日内向卖方支付'
    }
  ],
  // 风险金支付方式
  customBondWay: [{
      value: '1',
      label: '由乙方于本合同签署后5个工作日内向甲方支付'
    },
    {
      value: '2',
      label: '为减少付款次数，甲方从其向乙方支付的融资款中直接扣除风险金，并视同乙方向甲方支付了相应金额的风险金'
    }
  ],
  // 租金支付方式
  paymentWay: [
    [
      '1.本合同租金按年利率',
      {
        type: 'number-input',
        field: 'annualInterestRate', // 年利率
        props: {
          disabled: true
        }
      },
      '%（',
      {
        type: 'select',
        field: 'interestRateModel', // 利率模式
        options: queryDictItems('10033'),
        props: {
          disabled: true
        }
      },
      '，合同签订前一日借款期限',
      {
        type: 'input',
        field: 'benchmarkInterestRateName', // lpr基准利率
        props: {
          disabled: true
        }
      },
      '的LPR',
      {
        type: 'input',
        field: 'benchmarkInterestRateValue', // lpr基准利率
        props: {
          disabled: true
        }
      },
      '%+',
      {
        type: 'input',
        field: 'floatingPoint', // 浮动基点
        props: {
          disabled: true
        }
      },
      '%）',
      {
        type: 'select',
        field: 'calculateRentMethod',
        options: queryDictItems('10030'),
        props: {
          disabled: true
        }
      },
      '计算，共',
      {
        type: 'input',
        field: 'totalYears',
        props: {
          disabled: true
        }
      },
      '年',
      {
        type: 'input',
        field: 'totalIssue',
        props: {
          disabled: true
        }
      },
      '期；'
    ],
    [
      '2.调整项',
      {
        type: 'input',
        field: 'adjustmentItem',
        props: {
          required: true
        },
        style: {
          width: '200px'
        }
      }
    ],
    ['3.租金支付表详见附件三。'],
    ['4.本合同所称的“LPR”是指中国人民银行授权全国银行业同业拆借中心发布的“贷款市场报价利率”。借款期限在一年期以下（含）的适用一年期LPR，借款期限超过一年期的适用五年期以上LPR。']
  ],
  // 质押标的
  pledgeSubject: [
    [
      '本合同项下的质物为乙方持有的',
      {
        type: 'input',
        field: 'pledgeSubject_t1',
        props: {
          required: true
        }
      },
      '股份（代码：',
      {
        type: 'input',
        field: 'pledgeSubject_t2',
        props: {
          required: true
        }
      },
      '）',
      {
        type: 'input',
        field: 'pledgeSubject_t3',
        props: {
          required: true
        }
      },
      '股上市流通股及其孳息（包括但不限于质押股票应得股息、红利、送股及其他收益）（以下简称“质物”）。'
    ],
    [
      '股票简称：',
      {
        type: 'input',
        field: 'pledgeSubject_t4',
        props: {
          required: true
        },
        style: {
          width: '200px'
        }
      },
      '股票代码：',
      {
        type: 'input',
        field: 'pledgeSubject_t5',
        props: {
          required: true
        },
        style: {
          width: '200px'
        }
      }
    ],
    [
      '证券数量：',
      {
        type: 'input',
        field: 'pledgeSubject_t6',
        props: {
          required: true
        },
        style: {
          width: '200px'
        }
      },
      '股票市值：',
      {
        type: 'input',
        field: 'pledgeSubject_t7',
        props: {
          required: true
        },
        style: {
          width: '200px'
        }
      }
    ]
  ],
  // 质押标的
  pledgeSubject2: [
    ['第一条  质押标的'],
    [
      '1.1 本合同的质押标的为乙方合法持有的',
      {
        type: 'input',
        field: 'pledgeSubject_t1',
        props: {
          required: true
        }
      },
      '公司（统一社会信用代码证',
      {
        type: 'input',
        field: 'pledgeSubject_t2',
        props: {
          required: true
        }
      },
      '）投资的',
      {
        type: 'input',
        field: 'pledgeSubject_t3',
        props: {
          required: true
        }
      },
      '股权及其派生权益（以下简称出质权利）。'
    ],
    [
      '1.2 质押股权金额为',
      {
        type: 'input',
        field: 'pledgeSubject_t4',
        props: {
          required: true
        },
        style: {
          width: '200px'
        }
      },
      '元。'
    ]
  ],
  // 设备价款支付
  equipmentPricePayment: [
    [
      '甲方在本合同生效并在下述支付前提条件满足后十个工作日内向乙方支付RMB',
      {
        type: 'number-input',
        field: 'leaseFinancing' // 融资金额
      },
      '元，抵扣租赁合同项下乙方应付的风险金RMB',
      {
        type: 'number-input',
        field: 'deductionBond'
      },
      '元，甲方实际向乙方支付RMB',
      {
        type: 'number-input',
        field: 'leaseFinancingSubBond',
        props: {
          related: 'equipmentPricePayment_t1'
        }
      },
      '元（人民币',
      {
        type: 'input',
        field: 'equipmentPricePayment_t1',
        style: {
          width: '250px'
        }
      },
      '）后，即完成买方（甲方）支付全部设备价款的义务。'
    ]
  ],
  // 乙方需向甲方提供的文件
  yiToJiaFile: [
    [
      '乙方应当在',
      {
        type: 'number-input',
        field: 'yiToJiaFile_t1',
        props: {
          required: true,
          minDecimal: 0,
          maxDecimal: 0
        }
      },
      '日内向甲方提供：'
    ],
    ['1、对外采购过程中签订的购买合同的正本。'],
    ['2、供货商签发的发票复印件（加盖乙方财务专用章）。']
  ],
  // 乙方支付购买合同项下设备价款
  yiPayEquipment: [
    [
      '乙方应当在',
      {
        type: 'number-input',
        field: 'yiPayEquipment_t1',
        props: {
          required: true,
          minDecimal: 0,
          maxDecimal: 0
        }
      },
      '日内向卖方支付购买合同项下设备价款RMB',
      {
        type: 'number-input',
        field: 'yiPayEquipment_t2',
        props: {
          required: true
        }
      },
      '元'
    ]
  ],
  // 应收租赁款债权转让款
  creditorTransferPayment: [
    [
      '3.1 甲乙双方一致同意，应收租赁款债权转让价款为人民币',
      {
        type: 'number-input',
        field: 'quotationPrice',
        props: {
          disabled: true,
          related: 'creditorTransferPayment_t2'
        },
        style: {
          width: '150px'
        }
      },
      '元（大写：',
      {
        type: 'input',
        field: 'creditorTransferPayment_t2',
        props: {
          disabled: true
        },
        style: {
          width: '250px'
        }
      },
      '）。'
    ],
    [
      '3.2	乙方在下列条件全部满足后',
      {
        type: 'input',
        field: 'creditorTransferPayment_t3'
      },
      '个工作日内将应收租赁款债权转让价款一次性支付给甲方'
    ]
  ],
  // 应收租赁款债权转让款2
  creditorTransferPayment2: [
    [
      '指乙方因受让甲方在《',
      {
        type: 'input',
        field: 'transferContractName'
      },
      '》（编号：',
      {
        type: 'input',
        field: 'transferContractNo'
      },
      '）项下的应收未收租赁款而应向甲方支付的对价。'
    ]
  ],
  // 合同
  contractNumber: [
    [
      '本合同正本一式（',
      {
        type: 'input',
        field: 'contractNumber_t1',
        props: {
          required: true
        }
      },
      '）份，双方各持（',
      {
        type: 'input',
        field: 'contractNumber_t2',
        props: {
          required: true
        }
      },
      '）份，每份具有同等法律效力'
    ]
  ],
  // 应收租赁款
  leaseReceivable: [
    [
      '应收租赁款转让价款：指依据《',
      {
        type: 'input',
        field: 'transferContractName'
      },
      '》（编号：',
      {
        type: 'input',
        field: 'transferContractNo'
      },
      '），甲方在该合同项下的应收未收租赁款金额，具体见附件一《应收租赁款转让清单》。'
    ]
  ],
  // 租金金额
  customRentAmount: [
    [
      '每期租金（',
      {
        type: 'number-input',
        field: 'rentAmount',
        props: {
          required: true
        }
      },
      '）元，租金总额（',
      {
        type: 'number-input',
        field: 'totalRent',
        props: {
          required: true
        }
      },
      '）元'
    ]
  ],
  // 租金调整
  rentAdjustType: [{
      level: 1,
      type: 'radio',
      field: 'rentAdjustType_radio',
      props: {
        disabled: true,
        required: true
      },
      options: [{
        value: '2',
        label: '1.如本合同为固定利率，则租赁期间租金不调整。'
      }, {
        value: '1',
        label: [
          '2.如本合同为浮动利率，则租赁期限内，随着LPR的调整，甲方有权单方面按照以下（',
          {
            type: 'input',
            field: 'rentAdjustType_radio2',
            props: {
              disabled: true
            }
          },
          '）方式进行租赁利率调整：'
        ]
      }]
    },
    {
      level: 2,
      parentValue: 1,
      type: 'radio',
      field: 'rentAdjustType_radio2',
      options: [{
        value: '1',
        label: '（1）每年1月1日调整本年度的租赁利率。'
      }, {
        value: '2',
        label: '（2）项目起租日后每满一年调整一次租赁利率。'
      }, {
        value: '3',
        label: [
          '（3）项目起租日后满（',
          {
            type: 'number-input',
            field: 'rentAdjustType_t2',
            props: {
              minDecimal: 0,
              maxDecimal: 0
            }
          },
          '）月调整一次租赁利率。'
        ]
      }]
    },
    ['调整后租金支付以《租金调整通知书》为准，甲方无须征得乙方同意即可按调整后的租赁利率收取租金。']
  ],
  // 风险金/风险金支付方式
  riskPayment: [
    [
      'RMB（',
      {
        type: 'number-input',
        field: 'riskPayment_t1',
        props: {
          required: true
        }
      },
      '）元；'
    ],
    [
      '根据甲方、乙方的协商，乙方以下述两种方式中的第',
      {
        type: 'input',
        field: 'riskPayment_radio',
        props: {
          disabled: true,
          required: true
        }
      },
      '种方法进行风险金的支付。'
    ],
    {
      level: 1,
      type: 'radio',
      field: 'riskPayment_radio',
      options: [{
          value: '1',
          label: '（1）乙方于本合同签署后5个工作日向甲方支付。'
        },
        {
          value: '2',
          label: '（2）为减少付款次数，甲方从其向乙方支付的融资款中直接扣除风险金，并视同乙方向甲方支付了相应金额的风险金。'
        }
      ]
    }
  ],
  // 协议价款支付
  agreementPrice: [
    [
      '甲方在本合同生效并在下述支付前提条件满足后10个工作日内向乙方支付RMB（',
      {
        type: 'number-input',
        field: 'leaseFinancing',
        props: {
          related: 'agreementPrice_t1'
        }
      },
      '）元（人民币',
      {
        type: 'input',
        field: 'agreementPrice_t1',
        style: {
          width: '250px'
        }
      },
      '），扣除风险金RMB（',
      {
        type: 'number-input',
        field: 'deductionBond',
        props: {
          related: 'agreementPrice_t2'
        }
      },
      '）元 (人民币',
      {
        type: 'input',
        field: 'agreementPrice_t2',
        style: {
          width: '250px'
        }
      },
      ')，甲方实际支付RMB（',
      {
        type: 'number-input',
        field: 'leaseFinancingSubBond'
      },
      '）元，即完成甲方支付全部租赁物协议价款RMB（',
      {
        type: 'number-input',
        field: 'leaseFinancing'
      },
      '）元的义务。'
    ]
  ],
  // 特别约定
  specialAgreement: [
    [
      '截止',
      {
        type: 'date-picker',
        field: 'specialAgreement_t1',
        props: {
          'value-format': 'timestamp'
        },
        style: {
          width: '130px'
        }
      },
      '，甲乙丙三方还未签署完毕本合同，或甲方还未收到已签署完毕的本合同的，则本合同自动解除，但甲方书面同意继续履行本合同的除外'
    ]
  ],
  // 担保主债权的种类、金额
  guaranteeObligation: [
    [
      '出质人担保的主债权的种类、金额（币种及大写金额）分别为主合同项下的全部租金，金额为人民币',
      {
        type: 'number-input',
        field: 'guaranteeObligation_t1',
        props: {
          required: true,
          related: 'guaranteeObligation_t2'
        },
        style: {
          width: '200px'
        }
      },
      '（',
      {
        type: 'input',
        field: 'guaranteeObligation_t2',
        props: {
          disabled: true
        },
        style: {
          width: '250px'
        }
      },
      ')。'
    ]
  ],
  // 咨询服务费
  consultingServiceFee2: [
    [
      'RMB',
      {
        type: 'number-input',
        field: 'consultingServiceFee2_t1',
        style: {
          width: '215px'
        },
        props: {
          related: 'consultingServiceFee2_t2'
        }
      },
      '元（人民币',
      {
        type: 'input',
        field: 'consultingServiceFee2_t2',
        props: {
          disabled: true
        },
        style: {
          width: '250px'
        }
      },
      '）'
    ]
  ],
  // 第二笔设备款
  secondEquipmentAmount: [
    [
      'RMB',
      {
        type: 'number-input',
        field: 'secondEquipmentAmount_t1',
        style: {
          width: '215px'
        },
        props: {
          related: 'secondEquipmentAmount_t2'
        }
      },
      '元(人民币',
      {
        type: 'input',
        field: 'secondEquipmentAmount_t2',
        props: {
          disabled: true
        },
        style: {
          width: '250px'
        }
      },
      '）'
    ]
  ],
  // 租赁成本
  customLeaseFinancing: [
    [
      'RMB',
      {
        type: 'number-input',
        field: 'customLeaseFinancing_t1',
        props: {
          related: 'customLeaseFinancing_t2'
        }
      },
      '元（人民币',
      {
        type: 'input',
        field: 'customLeaseFinancing_t2',
        style: {
          width: '250px'
        }
      },
      '）。'
    ]
  ],
  // 留购价款
  customPurchasePrice: [
    [
      '若乙方在履约过程中发生违约情况RMB',
      {
        type: 'number-input',
        field: 'purchasePriceDefault',
        props: {
          required: true
        }
      },
      '元'
    ],
    [
      '若乙方在履约过程中未发生违约情况RMB',
      {
        type: 'number-input',
        field: 'purchasePrice',
        props: {
          required: true
        }
      },
      '元'
    ]
  ]
}
