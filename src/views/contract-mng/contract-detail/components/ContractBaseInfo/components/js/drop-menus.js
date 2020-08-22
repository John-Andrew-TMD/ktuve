import contracTypeForm from './contrac-type-form.js'
export default [{
    name: '融资租赁合同',
    businessCategory: '0',
    businessType: '0',
    children: [{
        name: '直租三方购买适用',
        contractType: 1,
        contracTypeForm: contracTypeForm.factoringDirContract
      },
      {
        name: '委托购买，直租',
        contractType: 0,
        contracTypeForm: contracTypeForm.factoringDirCommissionContract
      }
    ]
  },
  {
    name: '购买合同',
    businessCategory: '0',
    businessType: '0',
    children: [{
        name: '购买合同',
        contracTypeForm: contracTypeForm.buyContract,
        contractType: 8
      },
      {
        name: '委托购买合同',
        contracTypeForm: contracTypeForm.commissionBuyContract,
        contractType: 9
      }
    ]
  },
  {
    name: '售后回租赁合同',
    contracTypeForm: contracTypeForm.leasebackContract,
    businessCategory: '0',
    businessType: '1',
    contractType: 2
  },
  {
    name: '应收租赁款转让合同（有追）',
    contracTypeForm: contracTypeForm.transferYesContract,
    businessCategory: '1',
    businessType: '0,1',
    contractType: 3
  },
  {
    name: '应收租赁款转让合同（无追）',
    contracTypeForm: contracTypeForm.transferNoContract,
    businessCategory: '2',
    businessType: '0,1',
    contractType: 4
  },
  {
    name: '保证合同',
    businessCategory: '0',
    businessType: '0,1',
    children: [{
        name: '保证合同（机构）',
        contracTypeForm: contracTypeForm.guarantyUnitContract,
        contractType: 6,
        custCategory: 1
      },
      {
        name: '保证合同（个人）',
        contracTypeForm: contracTypeForm.guarantyPersonContract,
        contractType: 5,
        custCategory: 2
      }
    ]
  },
  {
    name: '保证合同',
    businessCategory: '1,2',
    businessType: '0,1',
    children: [{
        name: '保证合同（应收账款转让）—机构',
        contractType: 11,
        contracTypeForm: contracTypeForm.guarantyUnitTransferContract,
        custCategory: 1
      },
      {
        name: '保证合同（应收账款转让）—个人',
        contractType: 10,
        contracTypeForm: contracTypeForm.guarantyPersonTransferContract,
        custCategory: 2
      }
    ]
  },
  {
    name: '抵押合同',
    businessCategory: '0',
    businessType: '0,1',
    children: [{
        name: '动产抵押合同（机构）',
        contractType: 13,
        contracTypeForm: contracTypeForm.mortgageUnitContract,
        custCategory: 1
      },
      {
        name: '动产抵押合同（个人）',
        contractType: 12,
        contracTypeForm: contracTypeForm.mortgagePersonContract,
        custCategory: 2
      },
      {
        name: '房屋抵押合同（机构）',
        contractType: 15,
        contracTypeForm: contracTypeForm.mortgageUnitContract,
        custCategory: 1
      },
      {
        name: '房屋抵押合同（个人）',
        contractType: 14,
        contracTypeForm: contracTypeForm.mortgagePersonContract,
        custCategory: 2
      },
      {
        name: '土地使用权抵押合同（机构）',
        contractType: 17,
        contracTypeForm: contracTypeForm.mortgageUnitContract,
        custCategory: 1
      },
      {
        name: '土地使用权抵押合同（个人）',
        contractType: 16,
        contracTypeForm: contracTypeForm.mortgagePersonContract,
        custCategory: 2
      },
      {
        name: '土地房产合一抵押合同（机构）',
        contractType: 19,
        contracTypeForm: contracTypeForm.mortgageUnitContract,
        custCategory: 1
      },
      {
        name: '土地房产合一抵押合同（个人）',
        contractType: 18,
        contracTypeForm: contracTypeForm.mortgagePersonContract,
        custCategory: 2
      }
    ]
  },
  {
    name: '质押合同',
    businessCategory: '0',
    businessType: '0,1',
    children: [{
        name: '股份质押合同（上市公司股份）-机构',
        contractType: 21,
        contracTypeForm: contracTypeForm.pledgeUnitContract,
        custCategory: 1
      },
      {
        name: '股份质押合同（上市公司股份）-个人',
        contractType: 20,
        contracTypeForm: contracTypeForm.pledgePersonContract,
        custCategory: 2
      },
      {
        name: '股权质押合同（普通公司股权）-机构',
        contractType: 23,
        contracTypeForm: contracTypeForm.pledgePlainUnitContract,
        custCategory: 1
      },
      {
        name: '股权质押合同（普通公司股权）-个人',
        contractType: 22,
        contracTypeForm: contracTypeForm.pledgePlainPersonContract,
        custCategory: 2
      },
      {
        name: '电费收益权质押合同',
        contractType: 24,
        contracTypeForm: contracTypeForm.electricityContract,
        custCategory: 1
      }
    ]
  },
  {
    name: '经济咨询服务协议',
    contracTypeForm: contracTypeForm.economiContract,
    businessCategory: '0,1,2',
    businessType: '0,1',
    contractType: 7
  },
  {
    name: '其他合同',
    contracTypeForm: contracTypeForm.otherContract,
    businessCategory: '0,1,2',
    businessType: '0,1',
    contractType: 25
  }
]
