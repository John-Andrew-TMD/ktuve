<template>
  <div class="app-content app-content--quote comp-common-investment-detail">
    <quote icon="financing" text="支付申请">
      <el-button size="mini" type="primary" @click="handleNextClick">发起审批</el-button>
    </quote>
    <div class="app-content-wrapper">
      <div style="overflow-y: auto">
        <div class="panel-header">
          <div class="panel-wrapper">
            <span class="text">基本信息</span>
          </div>
        </div>
        <div class="panel-body project-base-info-body">
          <form-create v-model="projectFormApi" :rule="projectRules" :option="options" />
        </div>
        <div class="panel-header">
          <div class="panel-wrapper">
            <span class="text">收款信息</span>
          </div>
        </div>
        <div class="panel-body">
          <collection-info />
        </div>
        <div class="panel-header">
          <div class="panel-wrapper">
            <span class="text">支付申请</span>
          </div>
        </div>
        <div class="panel-body">
          <form-create v-model="paymentFormApi" :rule="paymentRules" :option="options" />
          <el-button size="mini" type="primary" style="margin-left: 150px">保存</el-button>
        </div>
        <div class="panel-header">
          <div class="panel-wrapper">
            <span class="text">租金支付表</span>
          </div>
        </div>
        <div class="panel-body">
          <form-create v-model="rentPaymentFormApi" :rule="rentPaymentRules" :option="options" />
        </div>
        <div class="panel-header">
          <div class="panel-wrapper">
            <span class="text">租金计划表</span>
          </div>
        </div>
        <div class="panel-body">
          <table-create
            ref="rentPlanTableDom"
            :options="rentPlanTableOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Quote from 'components/Quote/index'
import CollectionInfo from './CompCommonPaymentApplicationCollectionInfo.vue'
import TableCreate from 'components/TableCreate/index'
import { isEmptyObj } from 'utils'
import { queryLoanDetail } from 'api/investment-mng/api-capital-investment-mng.js'
export default {
  components: {
    Quote,
    CollectionInfo,
    TableCreate
  },
  props: {
    routeParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      projectFormApi: null,
      paymentFormApi: null,
      rentPaymentFormApi: null,
      projectRules: [
        {
          type: 'el-custom-text',
          title: '项目名称',
          field: 'projectName',
          prop: {
            color: '#5595FF'
          },
          col: { span: 12 }
        },
        {
          type: 'el-custom-text',
          title: '收款方',
          field: 'collectionName',
          prop: {
            color: '#5595FF'
          },
          col: { span: 12 }
        },
        {
          type: 'el-custom-text',
          title: '放款期次',
          field: 'placementNo',
          col: { span: 12 }
        },
        {
          type: 'el-custom-text',
          title: '主合同编号',
          field: 'contractNo',
          col: { span: 12 }
        },
        {
          type: 'el-custom-text',
          title: '合同金额(元)',
          field: 'amtContract',
          props: {
            type: 'number'
          },
          col: { span: 12 }
        },
        {
          type: 'el-custom-text',
          title: '首付款(元)',
          field: 'firstPrice',
          props: {
            type: 'number'
          },
          col: { span: 12 }
        },
        {
          type: 'el-custom-text',
          title: '租金计算方式',
          field: 'calculateRentMethod',
          props: {
            type: "dict",
            "dict-no": "10030"
          },
          col: { span: 12 }
        },
        {
          type: 'el-custom-text',
          title: '利息税率(%)',
          field: 'lourddd',
          props: {
            type: "number",
            "need-format": false
          },
          col: { span: 12 }
        },
        {
          type: 'el-custom-text',
          title: '还款期限',
          field: 'leaseTerm',
          col: { span: 12 }
        },
        {
          type: 'el-custom-text',
          title: '租金还款频次',
          field: 'repaymentFrequency',
          props: {
            type: "dict",
            "dict-no": "10031"
          },
          col: { span: 12 }
        },
        {
          type: 'el-custom-text',
          title: '利率模式',
          field: 'interestRateModel',
          props: {
            type: "dict",
            "dict-no": "10033"
          },
          col: { span: 12 }
        },
        {
          type: 'el-custom-text',
          title: '年利率(%)',
          field: 'annualInterestRate',
          props: {
            type: "number",
            "need-format": false
          },
          col: { span: 12 }
        },
        {
          type: 'el-custom-text',
          title: '已投放额度(元)',
          field: 'usedLoanAmt',
          props: {
            type: 'number'
          },
          col: { span: 12 }
        },
        {
          type: 'el-custom-text',
          title: '剩余投放额度(元)',
          field: 'canLoanAmt',
          props: {
            type: 'number'
          },
          col: { span: 12 }
        }
      ],
      paymentRules: [
        {
          type: 'el-custom-text',
          title: '放款期次',
          field: 'placementNo'
        },
        {
          type: 'el-custom-text',
          title: '支付申请金额(元)',
          field: 'amtLoan'
        },
        {
          type: 'el-custom-text',
          title: '抵扣金额(元)',
          field: 'amtDeduct',
        },
        {
          type: 'el-custom-text',
          title: '实际投放金额(元)',
          field: 'amtPayment'
        },
        {
          type: 'el-col',
          col: { span: 24 },
          native: true,
          children: [
            {
              type: 'el-date-picker',
              title: '预计放款日',
              field: 'plannedReleaseDate',
              props: {
                'value-format': 'timestamp'
              },
              validate: this.formValidate({ required: true }),
              col: { span: 12 }
            }
          ]
        },
        {
          type: 'el-custom-text',
          title: '收款方',
          field: 'collectionName'
        },
        {
          type: 'el-col',
          col: { span: 24 },
          native: true,
          children: [
            {
              type: 'el-custom-select',
              title: '收款账户',
              field: 'bankAccount',
              style: {
                width: '220px'
              },
              validate: this.formValidate({ required: true }),
              col: { span: 12 }
            }
          ]
        }
      ],
      options: {
        form: { labelWidth: '150px', disabled: false },
        submitBtn: { show: false }
      },
      rentPaymentRules: [
        {
          type: 'el-custom-text',
          title: '租金计算方式',
          field: 'calculateRentMethod',
          col: { span: 8 }
        },
        {
          type: 'el-custom-text',
          title: '期限',
          field: 'leaseTerm',
          col: { span: 8 }
        },
        {
          type: 'el-custom-text',
          title: '年利率',
          field: 'annualInterestRate',
          props: {
            type: 'number',
            'need-format': false
          },
          col: { span: 8 }
        },
        {
          type: 'el-custom-text',
          title: '租金总额',
          field: 'totalRent',
          props: {
            type: 'number'
          },
          col: { span: 8 }
        },
        {
          type: 'el-custom-text',
          title: '利息总额',
          field: 'totalInterest',
          props: {
            type: 'number'
          },
          col: { span: 8 }
        },
        {
          type: 'el-custom-text',
          title: '收回本金',
          field: 'totalPrincipal',
          props: {
            type: 'number'
          },
          col: { span: 8 }
        },
        {
          type: 'el-custom-text',
          title: '每期租金/每期本金',
          field: 'averagePrincipal',
          props: {
            type: 'number'
          },
          col: { span: 8 }
        },
        {
          type: 'el-custom-text',
          title: '财务收益率(IRR)',
          field: 'xirr',
          props: {
            type: 'number',
            'need-format': false
          },
          col: { span: 8 }
        },
        {
          type: 'el-custom-text',
          title: '去税财务收益率(IRR)',
          field: 'removalTaxIrr',
          props: {
            type: 'number',
            'need-format': false
          },
          col: { span: 8 }
        },
        {
          type: 'el-custom-text',
          title: '项目IRR',
          field: 'irr',
          props: {
            type: 'number',
            'need-format': false
          },
          col: { span: 8 }
        },
        {
          type: 'el-custom-text',
          title: '项目去税IRR',
          field: 'measureIrr',
          props: {
            type: 'number',
            'need-format': false
          },
          col: { span: 8 }
        },
      ],
      rentPlanTableOptions: {
        requestParams: {
          url: '',
          data: {}
        },
        showSerialNumber: true,
        showLoading: false,
        requestImmediate: false, // 需要自动展示数据删除此行
        columns: [
          {
            attrs: {
              label: '期数',
              prop: 'issue'
            }
          },
          {
            attrs: {
              label: '日期',
              prop: 'rentDay',
              formatter: row => {
                return Vue.filter('filterTimestamp')(row.rentDay)
              }
            }
          },
          {
            attrs: {
              label: '租金收入',
              prop: 'leaseRelatedInflow',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.leaseRelatedInflow)
              }
            }
          },
          {
            attrs: {
              label: '利息收入',
              prop: 'interest',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.interest)
              }
            }
          },
          {
            attrs: {
              label: '回收成本',
              prop: 'principal',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.principal)
              }
            }
          },
          {
            attrs: {
              prop: 'residualPrincipal',
              label: '未回收成本',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.residualPrincipal)
              }
            }
          },
          {
            attrs: {
              label: '其它现金流入',
              prop: 'otherCashInflow',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.otherCashInflow)
              }
            }
          },
          {
            attrs: {
              prop: 'otherCashOutflow',
              label: '其它现金流出',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.otherCashOutflow)
              }
            }
          },
          {
            attrs: {
              prop: 'cashInflow',
              label: '现金流入',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.cashInflow)
              }
            }
          },
          {
            attrs: {
              prop: 'cashOutflow',
              label: '现金流出',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.cashOutflow)
              }
            }
          },
          {
            attrs: {
              prop: 'cashFlow',
              label: '净现金流',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.cashFlow)
              }
            }
          }
        ]
      }
    }
  },
  created() {
    if (this.routeParams.id) {
      this.getLoanDetialById()
    }
  },
  methods: {
    getLoanDetialById() {
      queryLoanDetail({
        id: this.routeParams.id
      }).then(res => {
        if (res.data) {
          const data = res.data
          // 项目基本信息
          let projectName, collectionName, placementNo, contractData = {};
          if (!isEmptyObj(data.projectInfoDto)) {
            projectName = data.projectInfoDto.projectName
          }
          // 放款信息
          if(!isEmptyObj(data.pdmLoanTableEntityDto)) {
            collectionName = data.pdmLoanTableEntityDto.collectionName
            placementNo = data.pdmLoanTableEntityDto.placementNo
            this.paymentFormApi.setValue(data.pdmLoanTableEntityDto)
          }
          // 合同信息
          if(!isEmptyObj(data.contractInfoDto)) {
            contractData = data.contractInfoDto
          }
          this.projectFormApi.setValue({
            ...contractData,
            projectName,
            collectionName,
            placementNo
          })
          // 租金支付表
          if (!isEmptyObj(data.calculatorResultDto) ) {
            if(!isEmptyObj(data.calculatorResultDto.quotationLeaseTDto)) {
              this.rentPaymentFormApi.setValue(
                data.calculatorResultDto.quotationLeaseTDto
              );
            }
            if(Array.isArray(data.calculatorResultDto.cashFlowTDtos)) {
              this.$refs.rentPlanTableDom.setData(data.calculatorResultDto.cashFlowTDtos)
            }
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
</script>

<style lang='scss' scoped>
.comp-common-investment-detail /deep/  {
  .app-content-wrapper {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    padding: 5px 5px 0;
    .panel-body {
      max-width: 1000px;
    }
  }
  .project-base-info-body .el-form-item {
    margin-bottom: 5px;
  }
}

</style>
