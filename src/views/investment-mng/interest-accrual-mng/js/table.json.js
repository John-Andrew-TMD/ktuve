import {
    detailBusinessList,sumBusinessList
} from "api/investment-mng/api-interest-accrual-mng.js";
import { queryDictItems } from "utils";
export default {
    "collect": {
        "searchRules": [
            {
                type: "el-custom-autocomplete",
                title: "客户名称1",
                field: "custName",
                props: {
                    params: {
                        url: sumBusinessList,
                        data: {},
                        searchKey: "custName",
                        labelKey: "custName",
                        valueKey: "custName",
                        repeat: false
                    },
                    clearable: true
                }
            },
            {
                type: "select",
                title: "客户类别",
                field: "custCategory",
                options: queryDictItems("10008")
            },
            {
                type: "select",
                title: "客户性质",
                field: "custAttribute",
                options: []
            }
        ],
        "tableOptions": {
            requestParams: {
                url: sumBusinessList,
                data: {}
            },
            showCheckbox: true,
            showSerialNumber: true,
            showTools: true,
            tableBottomOffset: 50,
            columns: [
                {
                    attrs: {
                        label: "计提月",
                        prop: "accrualMonth",
                    }
                },
                {
                    attrs: {
                        label: "租金和",
                        prop: "rentAmountSum",
                    }
                },
                {
                    attrs: {
                        label: "剩余本金和",
                        prop: "residualPrincipalSum",
                    }
                },
                {
                    attrs: {
                        label: "利息和",
                        prop: "interestSum",
                    }
                },
                {
                    attrs: {
                        label: "计息日",
                        prop: "accrualDate",
                    }
                },
                {
                    attrs: {
                        label: "天数",
                        prop: "days",
                    }
                },
                {
                    attrs: {
                        label: "财务租息计提",
                        prop: "finInterestRateAccrual",
                    }
                },
                {
                    attrs: {
                        label: "税额",
                        prop: "taxtion",
                    }
                },
                {
                    attrs: {
                        label: "不含税收入",
                        prop: "incomeUnTax",
                    }
                },
                {
                    attrs: {
                        label: "记账状态",
                        prop: "bookState",
                    }
                },
                {
                    attrs: {
                        label: "创建时间",
                        prop: "sysCtime",
                    }
                }
            ]
        },
    },
    "detail": {
        "searchRules": [
            {
                type: "el-custom-autocomplete",
                title: "客户名称2",
                field: "custName",
                props: {
                    params: {
                        url: detailBusinessList,
                        data: {},
                        searchKey: "custName",
                        labelKey: "custName",
                        valueKey: "custName",
                        repeat: false
                    },
                    clearable: true
                }
            },
            {
                type: "select",
                title: "客户类别",
                field: "custCategory",
                options: queryDictItems("10008")
            },
            {
                type: "select",
                title: "客户性质",
                field: "custAttribute",
                options: []
            }
        ],
        "tableOptions": {
            requestParams: {
                url: detailBusinessList,
                data: {}
            },
            showCheckbox: true,
            showSerialNumber: true,
            showTools: true,
            tableBottomOffset: 50,
            columns: [
                {
                    attrs: {
                        label: "客户名称",
                        prop: "custName",
                    }
                },
                {
                    attrs: {
                        label: "项目编号",
                        prop: "projectNo",
                    }
                },
                {
                    attrs: {
                        label: "主合同编号",
                        prop: "contractNo",
                    }
                },
                {
                    attrs: {
                        label: "投放期次",
                        prop: "placementNo",
                    }
                },
                {
                    attrs: {
                        label: "租金还款日",
                        prop: "rentDay",
                    }
                },
                {
                    attrs: {
                        label: "租金",
                        prop: "rentAmount",
                    }
                },
                {
                    attrs: {
                        label: "利息",
                        prop: "interest",
                    }
                },
                {
                    attrs: {
                        label: "本金",
                        prop: "principal",
                    }
                },
                {
                    attrs: {
                        label: "剩余本金",
                        prop: "residualPrincipal",
                    }
                },
                {
                    attrs: {
                        label: "计提月",
                        prop: "accrualMonth",
                    }
                },
                {
                    attrs: {
                        label: "计息日",
                        prop: "accrualDate",
                    }
                },
                {
                    attrs: {
                        label: "天数",
                        prop: "days",
                    }
                },
                {
                    attrs: {
                        label: "本金积数（计提）",
                        prop: "principalProduct",
                    }
                },
                {
                    attrs: {
                        label: "税率",
                        prop: "taxRate",
                    }
                },
                {
                    attrs: {
                        label: "财务租息率",
                        prop: "finInterestRate",
                    }
                },
                {
                    attrs: {
                        label: "财务租息率（不含税）",
                        prop: "finInterestRateAccrual",
                    }
                },//
                {
                    attrs: {
                        label: "财务租息计提",
                        prop: "finInterestRateAccrual",
                    }
                },
                {
                    attrs: {
                        label: "税额",
                        prop: "taxtion",
                    }
                },
                {
                    attrs: {
                        label: "不含税收入",
                        prop: "incomeUnTax",
                    }
                },
                {
                    attrs: {
                        label: "创建时间",
                        prop: "sysCtime",
                    }
                }
            ]
        }
    }
}
