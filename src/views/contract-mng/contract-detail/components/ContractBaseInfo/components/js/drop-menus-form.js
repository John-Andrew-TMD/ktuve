import contracTypeForm from "./contrac-type-form.js";

export default [{
    "name": "融资租赁-直租买卖",
    "contracTypeForm": contracTypeForm.factoringDirContract,
    "mainForm": [{
        "contractNo": {
          "name": "融资租赁合同编号"
        }
      },
      {
        "relatedContractNo": {
          name: "卖方/购买合同编号"
        }
      }
    ],
    "roleForm": [{
        "formItem": [{
            "roleName": {
              "name": "出租人（甲方）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode",
          "bankId",
          "bankInfo",
          {
            "bankCode": {
              "name": "甲方收款银行"
            }
          }
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "承租人（乙方）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "officeAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      }
    ],
    "otherForm": ["equipmentLocation", "paymentWay", "customPurchasePrice", "firstPrice", "customFirstPriceWay", "bond", "customBondWay", "insurance", "guarantee", "paymentConditions", "disputeResolution"],
    "roleTypes": ["1", "2"],
    "roleOrder": ["first", "second"]
  },
  {
    "name": "融资租赁-委托购买合同",
    "contracTypeForm": contracTypeForm.factoringDirCommissionContract,
    "mainForm": [{
        "contractNo": {
          "name": "融资租赁合同编号"
        }
      },
      {
        "relatedContractNo": {
          name: "卖方/购买合同编号"
        }
      }
    ],
    "roleForm": [{
        "formItem": [{
            "roleName": {
              "name": "出租人（甲方）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode",
          "bankId",
          "bankInfo",
          {
            "bankCode": {
              "name": "甲方收款银行"
            }
          }
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "承租人（乙方）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "officeAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      }
    ],
    "otherForm": ["equipmentLocation", "paymentWay", "rentAdjustType", "customPurchasePrice", "firstPrice", "customFirstPriceWay", "bond", "customBondWay", "insurance", "guarantee", "paymentConditions", "disputeResolution"],
    "roleTypes": ["1", "2"],
    "roleOrder": ["first", "second"]
  },
  {
    "name": "融资租赁-售后回租",
    "contracTypeForm": contracTypeForm.leasebackContract,
    "mainForm": [{
      "contractNo": {
        "name": "融资租赁合同编号"
      }
    }],
    "roleForm": [{
        "formItem": [{
            "roleName": {
              "name": "出租人（甲方）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode",
          "bankId",
          "bankInfo",
          {
            "bankCode": {
              "name": "甲方收款银行"
            }
          }
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "承租人（乙方）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode",
          {
            "officeAddress": {
              "name": "联系地址"
            }
          },
          {
            "bankId": {
              "name": "乙方收款账户"
            }
          },
          {
            "bankInfo": {
              "name": "乙方收款账户"
            }
          }
        ]
      }
    ],
    "otherForm": ["tradingLocations", "equipmentLocation", "customLeaseFinancing", "leaseTerm", "paymentWay", "customRentAmount", "rentAdjustType", "riskPayment", "agreementPrice", "agreementPriceUse", "customPurchasePrice", "insurance", "guarantee", "paymentConditions", "disputeResolution"],
    "roleTypes": ["1", "2"],
    "roleOrder": ["first", "second"]
  },
  {
    "name": "融资租赁-有追转让",
    "contracTypeForm": contracTypeForm.transferYesContract,
    "mainForm": [{
        "contractNo": {
          "name": "应收租赁款转让合同（有追索权）编号"
        }
      },
      "transferContractName",
      "transferContractNo",
      "transferSignDate",
      {
        "leaseName": {
          disabled: false,
          validate: true
        }
      }
    ],
    "roleForm": [{
        "formItem": [{
            "roleName": {
              "name": "甲方（转让人）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "officeAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode",
          "bankId",
          "bankInfo"
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "乙方（受让人）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode",
          "bankId",
          "bankInfo",
          {
            "bankCode": {
              "name": "乙方收款银行"
            }
          }
        ]
      }
    ],
    "otherForm": ["creditorTransferPayment", "bond", "disputeResolution2", "contractNumber"],
    "roleTypes": ["3", "4"],
    "roleOrder": ["first", "second"]
  },
  {
    "name": "融资租赁-无追转让",
    "contracTypeForm": contracTypeForm.transferNoContract,
    "mainForm": [{
        "contractNo": {
          "name": "应收租赁款转让合同（无追索权）编号"
        }
      },
      "transferContractName",
      "transferContractNo",
      "transferSignDate",
      {
        "leaseName": {
          disabled: false,
          validate: true
        }
      }
    ],
    "roleForm": [{
        "formItem": [{
            "roleName": {
              "name": "甲方（转让人）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode",
          "bankId",
          "bankInfo"
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "乙方（受让人）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode",
          "bankId",
          "bankInfo",
          {
            "bankCode": {
              "name": "乙方收款银行"
            }
          }
        ]
      }
    ],
    "otherForm": ["leaseReceivable", "creditorTransferPayment2", "consultingServiceFee", "bond", "disputeResolution2", "contractNumber"],
    "roleTypes": ["3", "4"],
    "roleOrder": ["first", "second"]
  },
  {
    "name": "融资租赁-保证合同（机构）",
    "contracTypeForm": contracTypeForm.guarantyUnitContract,
    "mainForm": [
      "relatedContractId",
      {
        "relatedContractNo": {
          hidden: true
        }
      },
      {
        "contractNo": {
          "name": "保证合同编号"
        }
      },
      "leaseName",
      "quotationPrice",
      "amountCurrency",
      "dueDate",
      "plusTwoDueDate"
    ],
    "roleForm": [{
        "formItem": [{
            "selectRoleId": {
              "name": "保证人（乙方）"
            }
          },
          {
            "roleName": {
              "name": "保证人（乙方）",
              hidden: true
            }
          },
          "roleType",
          "idCode",
          "legalPerson",
          {
            "officeAddress": {
              "name": "地址"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "甲方（债权人）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "officeAddress": {
              "name": "地址"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      }
    ],
    "otherForm": ["disputeResolution3"],
    "roleTypes": ["7", "8"],
    "roleOrder": ["second", "first"]
  },
  {
    "name": "融资租赁-保证合同（个人）",
    "contracTypeForm": contracTypeForm.guarantyPersonContract,
    "mainForm": [
      "relatedContractId",
      {
        "relatedContractNo": {
          hidden: true
        }
      },
      {
        "contractNo": {
          "name": "保证合同编号"
        }
      },
      "leaseName",
      "quotationPrice",
      "amountCurrency",
      "dueDate",
      "plusTwoDueDate"
    ],
    "roleForm": [{
        "formItem": [{
            "selectRoleId": {
              "name": "保证人（乙方）"
            }
          },
          {
            "roleName": {
              "name": "保证人（乙方）",
              hidden: true
            }
          },
          "roleType",
          {
            "idCode": {
              name: '身份证号码'
            }
          },
          {
            "officeAddress": {
              "name": "住所（地址）"
            }
          },
          {
            "employer": {
              validate: false
            }
          },
          "contactNumber",
          "zipCode"
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "甲方（债权人）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      }
    ],
    "otherForm": ["disputeResolution4"],
    "roleTypes": ["7", "8"],
    "roleOrder": ["second", "first"]
  },
  {
    "name": "经济咨询服务协议",
    "contracTypeForm": contracTypeForm.economiContract,
    "mainForm": [{
        "relatedContractId": {
          name: '主合同编号'
        }
      },
      {
        "relatedContractNo": {
          hidden: true,
          name: '主合同编号'
        }
      },
      {
        "contractNo": {
          "name": "协议编号"
        }
      },
      "leaseName"
    ],
    "roleForm": [{
        "formItem": [{
            "roleName": {
              "name": "甲方"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          {
            "officeAddress": {
              "name": "联系地址"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode",
          "bankId",
          "bankInfo",
          {
            "bankCode": {
              "name": "甲方收款银行"
            }
          }
        ]
      },
      {
        "formItem": [{
            "selectRoleId": {
              "name": "乙方"
            }
          },
          {
            "roleName": {
              "name": "乙方",
              hidden: true
            }
          },
          "roleType",
          "idCode",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          {
            "officeAddress": {
              "name": "联系地址"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      }
    ],
    "otherForm": ["consultingServiceDate", "consultingServiceFee2", {
      "paymentDate": {
        validate: false
      }
    }, "disputeResolution3"],
    "roleTypes": ["1", "2"],
    "roleOrder": ["first", "second"]
  },
  {
    "name": "直租购买合同",
    "contracTypeForm": contracTypeForm.buyContract,

    "mainForm": [
      "relatedContractId",
      {
        "relatedContractNo": {
          hidden: true
        }
      },
      {
        "contractNo": {
          "name": "购买合同编号"
        }
      }
    ],
    "roleForm": [{
        "formItem": [{
            "roleName": {
              "name": "买方（甲方）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      },
      {
        "formItem": [{
            "selectRoleId": {
              "name": "卖方（乙方）"
            }
          },
          {
            "roleName": {
              "name": "卖方（乙方）",
              hidden: true
            }
          },
          "roleType",
          "legalPerson",
          {
            "officeAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "丙方（承租人）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "officeAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      }
    ],
    "otherForm": ["equipmentPrice", "shipmentLocations", "tradingLocations", {
      "equipmentLocation": {
        name: '设置场所'
      }
    }, "tradingDate", "freeWarranty", "firstEquipmentAmount", "secondEquipmentAmount", "paymentDate", "designatedBankId", "designatedBankInfo", "specialAgreement"],
    "roleTypes": ["5", "6", "2"],
    "roleOrder": ["first", "second", "third"]
  },
  {
    "name": "直租委托代理购买合同",
    "contracTypeForm": contracTypeForm.commissionBuyContract,

    "mainForm": [
      "relatedContractId",
      {
        "relatedContractNo": {
          hidden: true
        }
      },
      {
        "contractNo": {
          "name": "委托代理购买合同编号"
        }
      }
    ],
    "roleForm": [{
        "formItem": [{
            "roleName": {
              "name": "买方（甲方）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "乙方（承租人）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "officeAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      }
    ],
    "otherForm": ["tradingLocations", "equipmentPrice", "equipmentPricePayment", "paymentConditions2", {
      designatedBankId: {
        name: '乙方指定账户信息'
      }
    }, "designatedBankInfo", "yiToJiaFile", "yiPayEquipment"],
    "roleTypes": ["5", "2"],
    "roleOrder": ["first", "second"]
  },
  {
    "name": "保证合同（应收账款转让）—个人",
    "contracTypeForm": contracTypeForm.guarantyPersonTransferContract,
    "mainForm": [{
        "relatedContractId": {
          name: "应收租赁款转让协议编号"
        }
      },
      {
        "relatedContractNo": {
          name: "应收租赁款转让协议编号",
          hidden: true
        }
      },
      {
        "contractNo": {
          "name": "保证合同编号"
        }
      },
      "relatedSideContractNo",
      "leaseName",
      "quotationPrice",
      "amountCurrency",
      "dueDate",
      {
        "plusTwoDueDate": {
          disabled: true
        }
      }
    ],
    "roleForm": [{
        "formItem": [{
            "selectRoleId": {
              "name": "保证人（乙方）"
            }
          },
          {
            "roleName": {
              "name": "保证人（乙方）",
              hidden: true
            }
          },
          "roleType",
          {
            idCode: {
              name: '身份证号码'
            }
          },
          {
            "officeAddress": {
              "name": "住所（地址）"
            }
          },
          "contactNumber",
          {
            "employer": {
              validate: false
            }
          },
          "fax",
          "zipCode"
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "甲方（债权人）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      }
    ],
    "otherForm": ["disputeResolution4"],
    "roleTypes": ["7", "8"],
    "roleOrder": ["second", "first"]
  },
  {
    "name": "保证合同（应收账款转让）—机构",
    "contracTypeForm": contracTypeForm.guarantyUnitTransferContract,
    "mainForm": [{
        "relatedContractId": {
          name: "应收租赁款转让协议编号"
        }
      },
      {
        "relatedContractNo": {
          name: "应收租赁款转让协议编号",
          hidden: true
        }
      },
      {
        "contractNo": {
          "name": "保证合同编号"
        }
      },
      "relatedSideContractNo",
      "leaseName",
      "quotationPrice",
      "amountCurrency",
      "dueDate",
      {
        "plusTwoDueDate": {
          disabled: true
        }
      }
    ],
    "roleForm": [{
        "formItem": [{
            "selectRoleId": {
              "name": "保证人（乙方）"
            }
          },
          {
            "roleName": {
              "name": "保证人（乙方）",
              hidden: true
            }
          },
          "roleType",
          "idCode",
          "legalPerson",
          "contactPeople",
          "contactNumber",
          {
            "officeAddress": {
              "name": "地址"
            }
          },
          "fax",
          "zipCode"
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "甲方（债权人）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      }
    ],
    "otherForm": ["disputeResolution4"],
    "roleTypes": ["7", "8"],
    "roleOrder": ["second", "first"]
  },
  {
    "name": "抵押合同（动产、房屋、土地、土地+房屋）—机构",
    "contracTypeForm": contracTypeForm.mortgageUnitContract,
    "mainForm": [{
        "relatedContractId": {
          name: '主合同编号'
        }
      },
      {
        "relatedContractNo": {
          name: '主合同编号',
          hidden: true
        }
      },
      {
        "contractNo": {
          "name": "抵押合同编号"
        }
      },
      "leaseName",
      {
        plusTwoDueDate: {
          name: '抵押期限'
        }
      }
    ],
    "roleForm": [{
        "formItem": [{
            "selectRoleId": {
              "name": "抵押人（乙方）"
            }
          },
          {
            "roleName": {
              "name": "抵押人（乙方）",
              hidden: true
            }
          },
          "roleType",
          "idCode",
          "legalPerson",
          {
            "officeAddress": {
              "name": "地址"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "甲方（抵押权人）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      }
    ],
    "otherForm": ["disputeResolution4"],
    "roleTypes": ["9", "10"],
    "roleOrder": ["second", "first"]
  },
  {
    "name": "抵押合同（动产、房屋、土地、土地+房屋）—个人",
    "contracTypeForm": contracTypeForm.mortgagePersonContract,
    "mainForm": [{
        "relatedContractId": {
          name: '主合同编号'
        }
      },
      {
        "relatedContractNo": {
          name: '主合同编号',
          hidden: true
        }
      },
      {
        "contractNo": {
          "name": "抵押合同编号"
        }
      },
      "leaseName",
      {
        plusTwoDueDate: {
          name: '抵押期限'
        }
      }
    ],
    "roleForm": [{
        "formItem": [{
            "selectRoleId": {
              "name": "抵押人（乙方）"
            }
          },
          {
            "roleName": {
              "name": "抵押人（乙方）",
              hidden: true
            }
          },
          "roleType",
          {
            "idCode": {
              name: '身份证号码'
            }
          },
          {
            "registerAddress": {
              "name": "住所（地址）"
            }
          },
          "contactNumber",
          "zipCode"
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "甲方（抵押权人）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      }
    ],
    "otherForm": ["disputeResolution4"],
    "roleTypes": ["9", "10"],
    "roleOrder": ["second", "first"]
  },
  {
    "name": "质押合同（上市公司股权）—机构",
    "contracTypeForm": contracTypeForm.pledgeUnitContract,
    "mainForm": [{
        "relatedContractId": {
          name: '主合同编号'
        }
      },
      {
        "relatedContractNo": {
          name: '主合同编号',
          hidden: true
        }
      },
      {
        "contractNo": {
          "name": "质押合同编号"
        }
      },
      "leaseName",
      "pledgeSubject",
      {
        plusTwoDueDate: {
          name: '质押期限'
        }
      }
    ],
    "roleForm": [{
        "formItem": [{
            "selectRoleId": {
              "name": "乙方（出质人）"
            }
          },
          {
            "roleName": {
              "name": "乙方（出质人）",
              hidden: true
            }
          },
          "roleType",
          "idCode",
          "legalPerson",
          {
            "officeAddress": {
              "name": "地址"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "甲方（质权人）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      }
    ],
    "otherForm": ["disputeResolution4"],
    "roleTypes": ["11", "12"],
    "roleOrder": ["second", "first"]
  },
  {
    "name": "质押合同（上市公司股权）—个人",
    "contracTypeForm": contracTypeForm.pledgePersonContract,
    "mainForm": [{
        "relatedContractId": {
          name: '主合同编号'
        }
      },
      {
        "relatedContractNo": {
          name: '主合同编号',
          hidden: true
        }
      },
      {
        "contractNo": {
          "name": "质押合同编号"
        }
      },
      "leaseName",
      "pledgeSubject",
      {
        plusTwoDueDate: {
          name: '质押期限'
        }
      }
    ],
    "roleForm": [{
        "formItem": [{
            "selectRoleId": {
              "name": "乙方（出质人）"
            }
          },
          {
            "roleName": {
              "name": "乙方（出质人）",
              hidden: true
            }
          },
          "roleType",
          {
            "idCode": {
              name: '身份证号码'
            }
          },
          {
            "registerAddress": {
              "name": "住所（地址）"
            }
          },
          "contactPeople",
          "contactNumber",
          "employer",
          "zipCode"
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "甲方（质权人）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      }
    ],
    "otherForm": ["disputeResolution4"],
    "roleTypes": ["11", "12"],
    "roleOrder": ["second", "first"]
  },
  {
    "name": "质押合同（普通公司股权）—机构",
    "contracTypeForm": contracTypeForm.pledgePlainUnitContract,
    "mainForm": [{
        "relatedContractId": {
          name: '主合同编号'
        }
      },
      {
        "relatedContractNo": {
          name: '主合同编号',
          hidden: true
        }
      },
      {
        "contractNo": {
          "name": "质押合同编号"
        }
      },
      "leaseName",
      "pledgeSubject2",
      {
        plusTwoDueDate: {
          name: '质押期限'
        }
      }
    ],
    "roleForm": [{
        "formItem": [{
            "selectRoleId": {
              "name": "乙方（出质人）"
            }
          },
          {
            "roleName": {
              "name": "乙方（出质人）",
              hidden: true
            }
          },
          "roleType",
          "idCode",
          "legalPerson",
          {
            "officeAddress": {
              "name": "地址"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "甲方（质权人）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      }
    ],
    "otherForm": ["disputeResolution4"],
    "roleTypes": ["11", "12"],
    "roleOrder": ["second", "first"]
  },
  {
    "name": "质押合同（普通公司股权）—个人",
    "contracTypeForm": contracTypeForm.pledgePlainPersonContract,
    "mainForm": [{
        "relatedContractId": {
          name: '主合同编号'
        }
      },
      {
        "relatedContractNo": {
          name: '主合同编号',
          hidden: true
        }
      },
      {
        "contractNo": {
          "name": "质押合同编号"
        }
      },
      "leaseName",
      "pledgeSubject2",
      {
        plusTwoDueDate: {
          name: '质押期限'
        }
      }
    ],
    "roleForm": [{
        "formItem": [{
            "selectRoleId": {
              "name": "乙方（出质人）"
            }
          },
          {
            "roleName": {
              "name": "乙方（出质人）",
              hidden: true
            }
          },
          "roleType",
          {
            "idCode": {
              name: '身份证号码'
            }
          },
          {
            "registerAddress": {
              "name": "住所（地址）"
            }
          },
          "employer",
          "contactPeople",
          "contactNumber",
          "zipCode"
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "甲方（质权人）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      }
    ],
    "otherForm": ["disputeResolution4"],
    "roleTypes": ["11", "12"],
    "roleOrder": ["second", "first"]
  },
  {
    "name": "电费收益权质押合同",
    "contracTypeForm": contracTypeForm.electricityContract,
    "mainForm": [{
        "relatedContractId": {
          name: '主合同编号'
        }
      },
      {
        "relatedContractNo": {
          name: '主合同编号',
          hidden: true
        }
      },
      {
        "contractNo": {
          "name": "质押合同编号"
        }
      },
      "leaseName",
      {
        "electricityFee": {
          "disabled": false,
          "validate": true
        }
      },
      "gager",
      "guaranteeObligation",
      {
        plusTwoDueDate: {
          name: '质押期限'
        }
      }
    ],
    "roleForm": [{
        "formItem": [{
            "selectRoleId": {
              "name": "乙方（出质人）"
            }
          },
          {
            "roleName": {
              "name": "乙方（出质人）",
              hidden: true
            }
          },
          "roleType",
          "idCode",
          "legalPerson",
          {
            "officeAddress": {
              "name": "地址"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      },
      {

        "formItem": [{
            "roleName": {
              "name": "甲方（质权人）"
            }
          },
          "roleId",
          "roleType",
          "legalPerson",
          {
            "registerAddress": {
              "name": "住所地"
            }
          },
          "contactPeople",
          "contactNumber",
          "fax",
          "zipCode"
        ]
      }
    ],
    "roleTypes": ["11", "12"],
    "roleOrder": ["second", "first"]
  },
  {
    "name": "其他合同",
    "contracTypeForm": contracTypeForm.otherContract,
    "mainForm": [{
        "relatedContractId": {
          name: '主合同编号'
        }
      },
      {
        "relatedContractNo": {
          name: '主合同编号',
          hidden: true
        }
      },
      {
        "contractNo": {
          "name": "合同编号",
          validate: false
        }
      },
      {
        "contractName": {
          "disabled": false,
          "validate": true
        }
      },
      "contractExplain"
    ]
  }
]
