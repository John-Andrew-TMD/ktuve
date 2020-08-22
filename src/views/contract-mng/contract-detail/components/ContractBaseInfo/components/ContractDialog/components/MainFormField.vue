<template>
  <div class="comp-main-contarct-from">
    <form-create ref="formDom" v-model="fApi" :rule="formRules" :option="formOptions" />
  </div>
</template>

<script>
import { getCommonFormRules } from '../../js/contract-field.config.js'
import CustomInput from './components/CustomInput'
import GuaranteeList from './components/GuaranteeList'
import CheckboxGroup from './components/CheckboxGroup'
import RadioGroup from './components/RadioGroup'
import { deepAssign } from 'utils'

formCreate.component('custom-input', CustomInput)
formCreate.component('custom-guarantee-list', GuaranteeList)
formCreate.component('custom-checkbox-group', CheckboxGroup)
formCreate.component('custom-radio-group', RadioGroup)

export default {
  data() {
    return {
      fApi: null,
      formRules: [],
      formOptions: {
        form: {
          labelWidth: '220px'
        },
        submitBtn: {
          show: false
        }
      }
    }
  },
  props: {
    contractItem: {
      type: Object,
      default: () => ({})
    },
    contractData: {
      type: Object,
      default: () => ({})
    },
    formType: {
      type: String,
      default: ''
    }
  },
  inject: ['formatContentData'],
  mounted() {
    this.iniForm()
  },
  methods: {
    iniForm() {
      const { action } = this.contractItem
      let formData = action === 'U' ? this.formatUpdateFormData() : this.formatAddFormData()
      const rules = this.getRules(formData)
      if (!rules) return
      this.formRules = rules
      formData = this.formatContentData(formData, rules)
      formData = this.formatCustomData(formData)
      this.$nextTick(() => {
        this.fApi.reload(rules)
        if (action === 'A' && !this.isMainContarct && this.formType === 'mainForm') {
          return
        }
        this.fApi.setValue(formData)
      })
    },

    // 新增时格式化数据
    formatAddFormData(rules) {
      const {
        relatedContractDTOList,
        contractNo,
        conQuotationDto = {},
        secondPersonDTOList = [],
        thirdPersonDTOList = []
      } = this.contractData
      let formData = {}
      if (this.isMainContarct) {
        const data = relatedContractDTOList && relatedContractDTOList[0]
        formData = Object.assign({}, data)
      }
      formData = Object.assign({}, formData, conQuotationDto, {
        contractNo
      })
      switch (+this.contractItem.contractType) {
        case 0: // 直租主合同
        case 1: // 直租主合同
          formData.equipmentLocation = secondPersonDTOList[0].officeAddress || ''
          break
        case 2: // 售后回租
          formData.equipmentLocation = secondPersonDTOList[0].registerAddress || ''
          formData.tradingLocations = secondPersonDTOList[0].officeAddress || ''
          break
        case 8: // 直租购买合同
          formData.equipmentLocation = thirdPersonDTOList[0].officeAddress || ''
          formData.tradingLocations = thirdPersonDTOList[0].officeAddress || ''
          // formData.equipmentPrice = formData.quotationPrice
          // formData.tradingDate = formData.anticipatedRentDate
          // formData.paymentDate = formData.anticipatedRentDate
          break
        case 9: // 直租委托购买合同
          formData.tradingLocations = secondPersonDTOList[0].registerAddress || ''
          // formData.equipmentPrice = formData.quotationPrice
          break
      }
      // // 租金调整
      // formData.rentAdjustType = {
      //   rentAdjustType_radio: formData.interestRateModel
      // }
      // // 风险金/风险金支付方式
      // formData.riskPayment = {
      //   riskPayment_t1: formData.deductionBond,
      //   riskPayment_radio: formData.bondWays
      // }
      // formData.consultingServiceFee = formData.service
      // formData.bond = formData.deductionBond
      return formData
    },
    // 修改时格式化数据
    formatUpdateFormData() {
      let formData = {}
      const { conContractTableEntityDto, relatedContractDTO, conQuotationDto } = this.contractData
      const content = conContractTableEntityDto.content ? JSON.parse(conContractTableEntityDto.content) : {}
      formData = {
        ...conContractTableEntityDto,
        ...content,
        relatedContractNo: relatedContractDTO.relatedContractNo,
        ...conQuotationDto
      }
      formData.guarantee = this.getGuaranteeData()
      return formData
    },
    formatCustomData(data) {
      const formData = deepAssign({}, data)
      // 租金调整
      formData.rentAdjustType = {
        ...formData.interestRateModel,
        rentAdjustType_radio: formData.interestRateModel // 1浮动利率 2固定利率
      }
      // 租赁成本
      formData.customLeaseFinancing = {
        customLeaseFinancing_t1: formData.leaseFinancing
      }
      // 咨询服务费
      formData.consultingServiceFee = formData.service
      return formData
    },
    // 担保信息
    getGuaranteeData() {
      const { conGuaranteeUpdate = [], conGuaranteeInfo = [] } = this.contractData
      let guarantee = []
      if (conGuaranteeUpdate) {
        guarantee = conGuaranteeUpdate.reduce((arr, item) => {
          if (!arr.length || !arr.some(sItem => sItem.contractId === item.contractId)) {
            arr.push(item)
          }
          return arr
        }, conGuaranteeInfo || [])
      }
      return guarantee
    },
    getRules(formData) {
      const { contracTypeForm, action } = this.contractItem
      if (!contracTypeForm) {
        console.error('contracTypeForm为' + contracTypeForm)
        return
      }
      const rules = getCommonFormRules(this, this.formType, contracTypeForm, formData)
      const type = +this.contractItem.contractType
      const {
        relatedContractDTOList = [],
        secondPersonDTO,
        secondPersonDTOList = [],
        thirdPersonDTO,
        thirdPersonDTOList = []
      } = this.contractData
      rules.forEach(item => {
        if (!this.isMainContarct && this.formType === 'mainForm') {
          // 主合同编号
          if (item.field === 'relatedContractId') {
            item.props.params.options = relatedContractDTOList
          }
        }
        // 购买合同 - 指定账户
        if (action === 'U' && [8].includes(type) && ['designatedBankId', 'designatedBankInfo'].includes(item.field)) {
          if (item.field === 'designatedBankId') {
            const secondBankList = (secondPersonDTO && secondPersonDTO.accountingBankList) || []
            const thirdBankList = (thirdPersonDTO && thirdPersonDTO.accountingBankList) || []
            const designatedAccount = secondBankList.concat(thirdBankList)
            const bankList = designatedAccount.reduce((arr, item) => {
              if (!arr.length || !arr.some(sItem => sItem.bankId === item.bankId)) {
                arr.push({
                  ...item,
                  label: item.bankInfo,
                  value: item.bankId
                })
              }
              return arr
            }, [])
            item.props.params.options = bankList
          }
        }
        // 委托购买合同 - 指定账户
        if ([9].includes(type) && ['designatedBankId', 'designatedBankInfo'].includes(item.field)) {
          const bankList = secondPersonDTOList.length ? secondPersonDTOList[0].accountingBankList : []
          const defaultBank = bankList.find(item => +item.isDefault === 1)
          if (item.field === 'designatedBankId') {
            if (defaultBank) {
              item.value = defaultBank.bankId
            }
            item.props.params.options = bankList
          }
          if (item.field === 'designatedBankInfo' && defaultBank) {
            item.value = defaultBank.bankInfo
          }
        }
        return item
      })
      return rules
    },
    handleChange(key, data) {
      this.$emit('change', key, data)
    }
  },
  computed: {
    isMainContarct() {
      // 合同类型0~4为主合同
      return +this.contractItem.contractType <= 4
    }
  },
  components: {
    formCreate: formCreate.$form()
  }
}
</script>

<style lang="scss">
.comp-main-contarct-from {
  .el-input__inner {
    min-width: 100px;
  }
  .no-append-bg .el-input-group__append,
  .no-prepend-bg .el-input-group__prepend {
    background: none;
    border-color: transparent;
    color: #606266;
    font-size: 14px;
    padding: 0;
  }
  .no-prepend-bg .el-input__inner {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .no-append-bg .el-input__inner {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .el-checkbox,
  .el-checkbox__input,
  .el-radio,
  .el-radio__input {
    white-space: normal;
    line-height: 28px;
  }
  .el-radio__input {
    position: absolute;
    top: 2px;
    left: 0;
  }
  .el-radio__label {
    padding-left: 18px;
  }
  .el-checkbox,
  .el-radio {
    position: relative;
    display: block;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label,
  .el-radio__input.is-checked + .el-radio__label {
    color: #606266;
  }
  .custom-group-item {
    vertical-align: middle;
    width: 100px;
    margin: 0 5px;
  }
  .comp-contract-item-form {
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item.is-success .el-input__inner {
      border-color: #dcdfe6 !important;
    }
  }
  [class*='el-col-'] {
    position: relative;
    z-index: 2;
  }
}
</style>
