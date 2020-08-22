<template>
  <div class="quotation-common-page" :class="{'fold-quotation-page':isFold}">
    <div class="left">
      <calc-form
        ref="quotationFormDom"
        :url-params="urlParams"
        :is-calculate.sync="isCalculate"
        @calc-method-change="handleCalcMethodChange"
        @calc-click="handleCalClick"
        v-on="$listeners"
      />
    </div>
    <div class="right">
      <div class="arrow-wrapper">
        <i
          class="icon-arrow"
          :class="!isFold?'el-icon-d-arrow-left':'el-icon-d-arrow-right'"
          :title="isFold?'收起':'展开'"
          @click="handleToggle"
        ></i>
      </div>
      <rent-plan
        ref="rentPlanDom"
        :rent-plan="rentPlan"
        :calc-result="calcResult"
        :fee-data="feeData"
        :url-params="urlParams"
        :is-calculate.sync="isCalculate"
        @import-success="handleImportSuccess"
        @adjust-rent="handleAdjustRent"
      />
    </div>
    <quotation-save-dialog
      v-if="showSaveDialog"
      :show-save-dialog.sync="showSaveDialog"
      :dialog-confirm="handleQuotationSaveConfirm"
    />
  </div>
</template>

<script>
import CalcForm from './components/CalcForm'
import RentPlan from './components/RentPlan'
import QuotationSaveDialog from './components/QuotationSaveDialog'
export default {
  components: {
    CalcForm,
    RentPlan,
    QuotationSaveDialog
  },
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
      isFold: false, // 是否折叠
      rentPlan: [], // 租金计划<- 来源表单输入计算
      calcResult: null, // 计算结果<- 来源表单输入计算
      feeData: [],
      isCalculate: false,
      showSaveDialog: false, // 是否显示保存对话框
      importRentData: []
    }
  },
  provide() {
    return {
      setRentPlanAndCalcResult: this._setRentPlanAndCalcResult,
      setQuotationFormSaveBtnStatus: this._setQuotationFormSaveBtnStatus,
      setFeeData: this._setFeeData,
      showQuotationSaveDialog: this._showQuotationSaveDialog,
      getImportRentPlan: this._getImportRentPlan
    }
  },
  created() {
    console.log('报价方案urlParams', this.urlParams)
  },
  methods: {
    /**
     * 使用provide的方式将表单组件的报价方案计算结果传递到租金计划组件，为啥不用vuex，
     * 当报价方案新增页面与详情页面同时打开时，计算结果会互相影响
     * @param {array} rentPlan 租金计划列表
     * @param {object} calcResult 报价方案计算结果
     */
    _setRentPlanAndCalcResult(rentPlan, calcResult) {
      rentPlan && (this.rentPlan = rentPlan)
      this.calcResult = calcResult
    },
    // 获取导入的租金计划数据
    _getImportRentPlan() {
      return this.importRentData
    },
    _setFeeData(data) {
      data && (this.feeData = data)
    },
    // 显示保存对话框
    _showQuotationSaveDialog() {
      this.showSaveDialog = true
    },
    // 点击计算按钮
    handleCalClick() {
      this.$refs.rentPlanDom.handleCancelAdjust()
    },
    // 不规则计算时，导入自定义计划成功，则设置保存按钮可点击
    _setQuotationFormSaveBtnStatus() {
      this.$refs.quotationFormDom.isDisabled = true
    },
    // 报价方案保存确认，并把对话框中表单数据传递到报价方案计算组件中
    handleQuotationSaveConfirm(formData) {
      if (!formData) return this.$showToast('参数错误！')
      this.$refs.quotationFormDom.submitSave(formData)
    },
    // 不规则还款，租金计划导入成功，设置保存按钮可用
    handleImportSuccess(rentData) {
      this.importRentData = rentData
      this.$refs.quotationFormDom.isDisabled = false
    },
    // 租金调整，设置保存按钮不可用
    handleAdjustRent() {
      this.$refs.quotationFormDom.isDisabled = true
    },
    // 还款方式发生改变 1等额本金 2等额租金 3自定义
    handleCalcMethodChange(val) {
      this.isCalculate = false
      this.$refs.rentPlanDom.calculateRentMethod = val
      this.$refs.rentPlanDom.handleCancelAdjust()
    },
    // 折叠展开切换
    handleToggle() {
      this.isFold = !this.isFold
      this.$emit('click-arrow', this.isFold)
    }
  }
}
</script>

<style lang='scss'>
.quotation-common-page {
  display: flex;
  flex: 1;
  height: 0;
  position: relative;
  background: #fff;
  .panel-title {
    margin-bottom: 15px;
    padding-left: 10px;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    border-left: 3px solid #5595ff;
  }

  .left {
    box-sizing: border-box;
    width: 600px;
    transition: width 0.3s;
    &::-webkit-scrollbar-track-piece {
      background-color: #ffffff;
    }
  }
  .arrow-wrapper {
    position: absolute;
    left: 590px;
    transition: left 0.3s;
    top: 50%;
    transform: translateY(-50%);
    .icon-arrow {
      cursor: pointer !important;
      height: 28px;
      line-height: 28px;
      vertical-align: middle;
      cursor: default;
    }
  }
  .right {
    overflow-y: auto;
    flex: 1;
    box-sizing: border-box;
    margin-left: 7px;
    background: #ffffff;
    &::-webkit-scrollbar-track-piece {
      background-color: #ffffff;
    }
  }
}
.quotation-common-page.fold-quotation-page {
  .left {
    width: 0;
    opacity: 0;
  }
  .arrow-wrapper {
    left: 0;
  }
}
</style>
