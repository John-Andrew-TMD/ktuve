<template>
  <div class="left-content">
    <div class="btn-tools">
      <el-button v-if="urlParams.canEdit" type="primary" size="mini" @click="handleCalcClick">计算</el-button>
      <el-button
        v-if="urlParams.canEdit"
        type="success"
        size="mini"
        @click="handleSaveClick"
        :disabled="isDisabled"
      >保存</el-button>
    </div>
    <div style="overflow-y: auto">
      <div class="quotation-calc-form">
        <form-create
          ref="formDom"
          v-model="fApi"
          class="form-area"
          :rule="formRules"
          :option="formOptions"
        />
        <div class="fees-area">
          <other-fees
            ref="depositDom"
            :data="depositData"
            :can-edit="urlParams.canEdit"
            fees-title="风险保证金"
            type="deposit"
            :quotation-price="quotationPrice"
          />
          <other-fees
            ref="consultFeeDom"
            :data="consultFeeData"
            :can-edit="urlParams.canEdit"
            fees-title="咨询服务费"
            type="consult"
            :quotation-price="quotationPrice"
          />
          <other-fees
            ref="otherFeeDom"
            :data="otherFeeData"
            :can-edit="urlParams.canEdit"
            fees-title="其它款项"
            type="other"
            :quotation-price="quotationPrice"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OtherFees from './OtherFees'
import { queryDictItems, decimalsFormat, deepAssign } from 'utils'
import {
  quotationCalculate,
  quotationSave,
  quotationCustomSave,
  quotationUpdate,
  getQuotationInfo,
  getInterestRate
} from 'api/project-module/api-quotation.js'

export default {
  components: {
    OtherFees
  },
  inheritAttrs: false,
  props: {
    urlParams: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      fApi: null,
      formRules: [
        {
          type: 'el-radio-group',
          title: '租金计算方式',
          field: 'calculateRentMethod',
          value: '1',
          style: {
            width: 'auto'
          },
          children: queryDictItems('10030').map(item => {
            return {
              type: 'el-radio-button',
              props: {
                label: item.value
              },
              children: [item.label]
            }
          }),
          on: {
            change: this.handleRentCalcMethodChange
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'number-input',
          title: '项目金额',
          field: 'quotationPrice',
          props: {
            'show-chinese-amount': true,
            'min-decimal': 2,
            'max-decimal': 2,
            'need-format': true,
            'text-direction': 'right'
          },
          style: {
            width: '350px'
          },
          on: {
            change: this.handleQuotationPriceChange
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['元']
            }
          ],
          validate: this.formValidate({ required: true })
        },
        {
          type: 'number-input',
          title: '首付款',
          field: 'firstPriceRate',
          value: 0,
          props: {
            'min-decimal': 2,
            'max-decimal': 8,
            'text-direction': 'right'
          },
          style: {
            width: '130px'
          },
          col: {
            span: 12
          },
          on: {
            change: () => this.handleDownPaymentChange('rate')
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['%']
            }
          ],
          validate: this.formValidate({ required: true })
        },
        {
          type: 'number-input',
          field: 'firstPrice',
          value: 0,
          props: {
            'show-chinese-amount': true,
            'min-decimal': 2,
            'max-decimal': 2,
            'need-format': true,
            'text-direction': 'right'
          },
          style: {
            width: '216px',
            marginLeft: '12px'
          },
          on: {
            change: () => this.handleDownPaymentChange('amount')
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['元']
            }
          ],
          col: {
            span: 10
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'number-input',
          title: '融资金额',
          field: 'leaseFinancing',
          props: {
            disabled: true,
            'min-decimal': 2,
            'max-decimal': 2,
            'need-format': true,
            'text-direction': 'right'
          },
          style: {
            width: '350px'
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['元']
            }
          ]
        },
        {
          type: 'number-input',
          title: '留购价',
          field: 'firmDiscount',
          value: 0,
          props: {
            'min-decimal': 2,
            'max-decimal': 2,
            'need-format': true,
            'text-direction': 'right'
          },
          style: {
            width: '350px'
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['元']
            }
          ],
          validate: this.formValidate({ required: true })
        },
        {
          type: 'number-input',
          title: '租赁期限',
          field: 'leaseTerm',
          props: {
            'max-decimal': 0,
            'text-direction': 'right'
          },
          style: {
            width: '350px'
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['月']
            }
          ],
          validate: this.formValidate({ required: true, min: 1 })
        },
        {
          type: 'el-radio-group',
          title: '还款频次',
          field: 'repaymentFrequency',
          children: queryDictItems('10031').map(item => {
            return {
              type: 'el-radio-button',
              props: {
                label: item.value
              },
              children: [item.label]
            }
          }),
          validate: this.formValidate({ required: true })
        },
        {
          type: 'el-radio-group',
          title: '支付方式',
          field: 'paymentType',
          value: '1',
          children: queryDictItems('10032').map(item => {
            return {
              type: 'el-radio-button',
              props: {
                label: item.value
              },
              children: [item.label]
            }
          }),
          validate: this.formValidate({ required: true })
        },
        {
          type: 'el-date-picker',
          title: '预计起租日',
          field: 'anticipatedRentDate',
          props: {
            'value-format': 'timestamp'
          },
          style: {
            width: '350px'
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'select',
          title: '第一期租金日',
          field: 'firstRentDate',
          style: {
            width: '350px'
          },
          value: 15,
          options: (() => {
            const arr = []
            for (let i = 1; i < 32; i++) {
              arr.push({
                value: i,
                label: `${(i + '').padStart(2, 0)}日`
              })
            }
            return arr
          })(),
          validate: this.formValidate({ required: true })
        },
        {
          type: 'el-radio-group',
          title: '利率模式',
          field: 'interestRateModel',
          value: '1',
          children: queryDictItems('10033').map(item => {
            return {
              type: 'el-radio-button',
              props: {
                label: item.value
              },
              children: [item.label]
            }
          }),
          on: {
            // change: this.handleInterestRateModelChange
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'select',
          field: 'benchmarkInterestRateId',
          title: 'LPR贷款基准利率',
          style: {
            width: '100%'
          },
          validate: this.formValidate({ required: true }),
          col: {
            span: 17
          },
          on: {
            change: this.handleBenchmarkInterestRateNameChange
          }
        },
        {
          type: 'input',
          field: 'benchmarkInterestRateValue',
          title: '',
          props: {
            disabled: true
          },
          style: {
            width: '118px',
            marginLeft: '3px'
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['%']
            }
          ],
          col: {
            span: 5
          }
        },
        {
          type: 'number-input',
          title: '浮动基点',
          field: 'floatingPoint',
          props: {
            'min-decimal': 2,
            'max-decimal': 2,
            'text-direction': 'right',
            'allow-minus': true
          },
          on: {
            change: this.handleFloatContentChange
          },
          style: {
            width: '350px'
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['bp']
            }
          ],
          validate: this.formValidate({ required: true })
        },
        {
          type: 'el-radio-group',
          title: '利率调整方式',
          field: 'interestAdjustmentMode',
          children: queryDictItems('10035').map(item => {
            return {
              type: 'el-radio-button',
              props: {
                label: item.value
              },
              children: [item.label]
            }
          }),
          validate: this.formValidate({ required: true })
        },
        {
          type: 'number-input',
          title: '年利率',
          field: 'annualInterestRate',
          props: {
            disabled: true,
            'min-decimal': 4,
            'max-decimal': 4,
            'text-direction': 'right'
          },
          style: {
            width: '350px'
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['%']
            }
          ],
          validate: this.formValidate({ required: true })
        }
      ],
      formOptions: {
        form: {
          labelWidth: '135px'
        },
        submitBtn: {
          show: false
        }
      },
      quotationId: '',
      quotationPrice: 0,
      isDisabled: true, // 控制保存按钮是否可用，自定义还款时不可用
      hasSaved: false, // 在当前页面是否保存过报价方案
      depositData: [], // 保证金数据
      consultFeeData: [], // 咨询服务费
      otherFeeData: [], // 其他费用
      rentPlanList: [], // 租金计划，用于保存时传参
      feeList: [], // 费用，用于保存时传参
      caseInfo: {} // 方案信息，用于保存时传参
    }
  },
  inject: [
    'setRentPlanAndCalcResult',
    'showQuotationSaveDialog',
    'setQuotationNameAndState',
    'setFeeData',
    'getImportRentPlan'
  ],
  created() {
    this._initUI()
  },
  mounted() {
    if (!this.urlParams.canEdit) {
      this.fApi.disabled(true)
    }
  },
  methods: {
    // 初始化页面UI
    _initUI() {
      this.getBenchmarkInterestRateOptions()
      // 项目详情中创建报价方案
      if (!this.urlParams.quotation_id || this.urlParams.addQuotationFromProject) return
      // 获取报价方案数据
      this.getQuotationData()
    },
    // 报价方案计算
    handleCalcClick() {
      this.fApi.validate(async valid => {
        if (valid) {
          // 验证其他费用是否合法
          if (await this._validateOtherFees()) return
          this.$emit('calc-click')
          this.submitCalculate()
        } else {
          this.$nextTick(() => {
            this.$refs.formDom.$el.querySelector('.el-form-item__error').parentNode.scrollIntoView({
              behavior: 'smooth'
            })
          })
        }
      })
    },
    // 报价方案保存
    handleSaveClick() {
      this.fApi.validate(async valid => {
        if (valid) {
          this.submitSave()
        } else {
          this.$parent.$el.scrollTop = 0
          this.$emit('scrollToTop')
        }
      })
    },
    // 验证其他费用是否合法
    async _validateOtherFees() {
      const feesDomKeys = ['depositDom', 'consultFeeDom', 'otherFeeDom']
      const ret = await Promise.all(feesDomKeys.map(domKey => this.$refs[domKey]._validateForm())).then(res => {
        return res
      })
      return ret.includes(false)
    },
    // 报价方案计算提交
    async submitCalculate(updated = false) {
      const params = this.formatCalcRequestParams()
      const id = this.urlParams.id
      if (id) {
        params.quotationLeaseTDto.recordId = id
      }
      quotationCalculate(params, { showLoading: true })
        .then(res => {
          const { cashFlowTDtos, quotationLeaseTDto } = res.data
          this.$emit('update:isCalculate', true)
          this.rentPlanList = cashFlowTDtos
          this.feeList = params.chargeDetailTDtos
          this.caseInfo = deepAssign({}, params.quotationLeaseTDto)

          // 将计算结果传递到租金计划组件中显示
          if (params.quotationLeaseTDto.calculateRentMethod == 3) {
            this.setRentPlanAndCalcResult([], quotationLeaseTDto)
          } else {
            this.setRentPlanAndCalcResult(cashFlowTDtos, quotationLeaseTDto)
          }
          this.setFeeData(params.chargeDetailTDtos)
          // 根据租金计算方式控制保存禁用状态
          this._setSaveButtonStatus()
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 报价保存提交
    async submitSave() {
      const id = this.urlParams.id
      if (id) {
        this.caseInfo.recordId = id
      }
      const params = {
        chargeDetailTDtos: this.feeList,
        quotationLeaseTDto: this.caseInfo
      }
      if (+this.caseInfo.calculateRentMethod === 3) {
        // 不规则
        params.cashFlowTDtos = this.getImportRentPlan()
        quotationCustomSave(params, { showLoading: true }).then(res => {
          if (!res.data) return
          this.$showToast('保存成功！', 'success')
          this.newQuotationId = ''
          this.hasSaved = true
          this.caseInfo = res.data.quotationLeaseTDto
        })
      } else {
        // 等额租金、等额本金
        if (this.urlParams.quotation_id) {
          // 修改
          quotationUpdate(params, { showLoading: true })
            .then(res => {
              if (!res.data) return
              this.$showToast('保存成功！', 'success')
              this.newQuotationId = ''
              this.hasSaved = true
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          // 新增
          quotationSave(params, { showLoading: true })
            .then(res => {
              if (!res.data) return
              const formData = res.data.quotationLeaseTDto
              this.$showToast('保存成功！', 'success')
              this.setQuotationNameAndState && this.setQuotationNameAndState(formData.quotationName, '0')
              this.newQuotationId = ''
              this.hasSaved = true
              this.urlParams.quotation_id = formData.id
              this.feeList = this.feeList.map(item => {
                item.quotationId = formData.id
                return item
              })
              this.caseInfo = formData
              this.quotationId = formData.id
              this.$emit('submit-save', formData)
              this.$store.commit('common/REFRESH_QUOTATION_LIST')
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    },
    // 格式化，拼接报价方案报价方案计算参数
    formatCalcRequestParams() {
      const params = this.fApi.formData()
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const value = params[key]
          if (!value && value !== 0) params[key] = ''
        }
      }
      if (this.quotationId) {
        params.id = this.quotationId
      }
      if (this.urlParams.project_id != null) {
        params.project_id = this.urlParams.project_id
      }
      params.rentValueDate = params.anticipatedRentDate
      const depositData = this.getFeeData('depositDom', 1)
      const consultFeeData = this.getFeeData('consultFeeDom', 13)
      const otherFeeData = this.getFeeData('otherFeeDom')
      const allFeeData = depositData.concat(consultFeeData, otherFeeData)
      return {
        quotationLeaseTDto: params,
        chargeDetailTDtos: allFeeData
      }
    },
    /**
     * 获取其他费用
     * @param {string} key
     * @param {number} type 1风险保证金 13咨询服务费 4和5其他款项
     */
    getFeeData(key, type) {
      let data = this.$refs[key].formValues.feesDataList
      data = data.filter(item => +item.outlayAmount !== 0)
      if (!type) {
        return data.map(item => {
          return {
            quotationId: this.quotationId,
            outlayRate: item.outlayRate,
            outlayAmount: item.outlayAmount,
            dictOutlayType: item.dictOutlayType,
            feeDate: item.feeDate
          }
        })
      }
      return data.map(item => {
        const obj = {
          quotationId: this.quotationId,
          outlayRate: item.outlayRate,
          outlayAmount: item.outlayAmount,
          feeDate: item.feeDate,
          dictOutlayType: type
        }
        if (type === 1) {
          obj.outlayWay = item.outlayWay
          obj.expirationTreatment = item.expirationTreatment
        }
        return obj
      })
    },
    // 根据租金计算方式控制保存禁用状态
    _setSaveButtonStatus() {
      const isIrregular = this.fApi.getValue('calculateRentMethod') === '3'
      this.isDisabled = isIrregular
    },
    getQuotationData() {
      getQuotationInfo(
        {
          id: this.urlParams.quotation_id
        },
        { showLoading: true }
      ).then(res => {
        if (!res.data) return
        const { cashFlowTDtos, chargeDetailTDtos, quotationLeaseTDto } = res.data
        this.quotationId = quotationLeaseTDto.id
        // 展示接口获取的数据到页面
        this.displayDataToForm(quotationLeaseTDto)
        // 设置保存按钮禁用状态
        // this._setSaveButtonStatus()
        // 设置租金计划及测算结果
        this.setRentPlanAndCalcResult && this.setRentPlanAndCalcResult(cashFlowTDtos, quotationLeaseTDto)
        // 费用
        this.displayFeesData(chargeDetailTDtos)
        this.setFeeData(chargeDetailTDtos)
      })
    },
    // 设置报价方案
    displayDataToForm(data) {
      this.handleRentCalcMethodChange(data.calculateRentMethod)
      // this.handleInterestRateModelChange(data.interestRateModel)
      this.fApi.setValue(data)
      this.quotationPrice = data.leaseFinancing
      this.fApi.setValue('firstPriceRate', decimalsFormat((+data.firstPrice / +data.quotationPrice) * 100))

      if (!this.urlParams.canEdit) {
        this.fApi.disabled(true)
      }
    },
    // 设置费用
    displayFeesData(data) {
      this.depositData = []
      this.consultFeeData = []
      this.otherFeeData = []
      data.forEach(item => {
        switch (+item.dictOutlayType) {
          case 1: // 风险保证金
            this.depositData.push(item)
            break
          case 13: // 咨询服务费
            this.consultFeeData.push(item)
            break
          case 4: // 其他款项
          case 5:
            this.otherFeeData.push(item)
            break
        }
      })
    },
    // 设置年利率
    setAnnualInterestRate() {
      const { benchmarkInterestRateValue = '', floatingPoint = '' } = this.fApi.formData()
      if (benchmarkInterestRateValue === '') {
        return
      }
      let ret = ''
      if (floatingPoint) {
        ret = Number(benchmarkInterestRateValue) + Number(floatingPoint) / 100
      } else {
        ret = Number(benchmarkInterestRateValue)
      }
      this.fApi.setValue('annualInterestRate', decimalsFormat(ret, 4, 4))
    },
    // 设置融资金额
    setLeaseFinancing() {
      const { quotationPrice, firstPrice } = this.fApi.formData()
      if (quotationPrice === '') return
      const ret = decimalsFormat(Number(quotationPrice) - Number(firstPrice))
      this.fApi.setValue('leaseFinancing', ret)
      this.quotationPrice = ret
    },
    // 租金计算方式改变
    handleRentCalcMethodChange(val) {
      // 1 等额本金 2 等额租金 3 不规则
      this.isDisabled = true
      this.$emit('calc-method-change', val)
    },
    // 利率模式改变
    handleInterestRateModelChange(val) {
      // 1 浮动利率 2 固定利率
      const isFloatRate = val === '1'
      this.fApi.updateRules({
        annualInterestRate: {
          props: { disabled: isFloatRate }
        },
        benchmarkInterestRateId: {
          validate: [{ required: isFloatRate }]
        },
        floatingPoint: {
          validate: [{ required: isFloatRate }]
        },
        interestAdjustmentMode: {
          validate: [{ required: isFloatRate }]
        }
      })
      this.fApi.hidden(!isFloatRate, [
        'benchmarkInterestRateId',
        'floatingPoint',
        'benchmarkInterestRateValue',
        'interestAdjustmentMode'
      ])
      if (isFloatRate) {
        this.setAnnualInterestRate()
      } else {
        this.fApi.setValue('annualInterestRate', '')
      }
      this.$nextTick(() => {
        this.fApi.clearValidateState('annualInterestRate')
      })
    },
    // 获取基准利率的选项
    getBenchmarkInterestRateOptions() {
      getInterestRate({}).then(res => {
        const data = res.data || []
        if (!data.length) return
        this.benchmarkInterestRateOptions = data.map(item => {
          return { label: item.interestRatesType, value: item.interestRateId, rate: item.interestRateValue }
        })
        this.$nextTick(() => {
          this.fApi.updateRule(
            'benchmarkInterestRateId',
            {
              options: this.benchmarkInterestRateOptions
            },
            true
          )
        })
      })
    },
    // 基准利率发生变化
    handleBenchmarkInterestRateNameChange(val) {
      const target = this.benchmarkInterestRateOptions.find(item => item.value === val)
      if (!target) return
      this.fApi.setValue('benchmarkInterestRateValue', decimalsFormat(target.rate))
      this.setAnnualInterestRate()
    },
    // 浮动幅度，浮动基点值发生变化
    handleFloatContentChange() {
      this.setAnnualInterestRate()
    },
    // 项目金额发生变化
    handleQuotationPriceChange() {
      this.setDownPayment()
      this.setLeaseFinancing()
    },
    // 首付款发生变化
    handleDownPaymentChange(type) {
      this.setDownPayment(type)
      this.setLeaseFinancing()
    },
    // 设置首付款
    setDownPayment(type = '') {
      const { quotationPrice, firstPriceRate, firstPrice } = this.fApi.formData()
      switch (type) {
        case 'rate':
          this.fApi.setValue('firstPrice', decimalsFormat((firstPriceRate * +quotationPrice) / 100), 2, 2)
          break
        case 'amount':
          if (+quotationPrice === 0) {
            this.fApi.setValue('firstPriceRate', '0')
          }
          this.fApi.setValue('firstPriceRate', decimalsFormat((firstPrice / +quotationPrice) * 100))
          break
        default:
          if (firstPriceRate === '') return
          this.fApi.setValue('firstPrice', decimalsFormat((firstPriceRate * +quotationPrice) / 100), 2, 2)
          break
      }
    }
  }
}
</script>

<style lang='scss'>
.left-content {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  height: 100%;
  .btn-tools {
    flex-shrink: 0;
    box-sizing: border-box;
    height: 38px;
    padding: 0 15px 0 15px;
    text-align: right;
    border-bottom: 1px solid #eeeeee;
    background: #ffffff;
    &:empty {
      display: none;
    }
  }
  .quotation-calc-form {
    flex: 1;
    .el-input-group__append {
      padding: 0 10px;
    }
    .form-area {
      padding: 15px;
      background: #ffffff;
      .el-row {
        width: 516px;
      }
      .el-form-item {
        margin-bottom: 18px !important;
      }
      .el-date-editor.el-input {
        width: 190px;
      }
    }
    .el-select {
      vertical-align: top;
    }
    .multi-row {
      display: flex;
      width: auto;
      .el-form-item {
        &:last-child {
          .el-form-item__content {
            width: 190px;
            margin: 0 !important;
          }
        }
      }
    }
    .fees-area {
      overflow: hidden;
      margin-top: 5px;
      padding: 15px 10px 0;
      text-align: center;
      background: #ffffff;
      .el-form-item {
        margin-bottom: 0 !important;
      }
    }
  }
}
</style>
