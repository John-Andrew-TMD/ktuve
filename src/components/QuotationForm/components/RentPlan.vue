<template>
  <div class="quotation-rent-plan">
    <h3 class="panel-title">租金计划测算结果</h3>
    <div class="statistics-area">
      <p v-for="item in calculateResultList" :key="item.en" :class="{ hide: !item.show }">
        <span>{{ item.zh }}</span>
        {{ item.value }}
      </p>
    </div>
    <div class="rent-plan-header">
      <h3 class="panel-title" style="margin:0">租金计划</h3>
      <div>
        <el-button
          type="primary"
          size="mini"
          :disabled="isAdjustDisable"
          @click="handleAdjustRent"
          v-show="!canAdjust"
        >租金调整</el-button>
        <el-button size="mini" @click="handleCancelAdjust" v-show="!isAdjustDisable && canAdjust">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="handleSaveAdjust"
          v-show="!isAdjustDisable && canAdjust"
        >保存</el-button>
        <el-button
          type="primary"
          size="mini"
          :disabled="isDownloadDisable"
          @click="handleDownloadTemplete"
        >模板下载</el-button>
        <file-import
          text="导入租金计划"
          @change="handleImportChange"
          :disabled="isImportDisable"
          :list-head="listHead"
          :field-map="fieldMap"
        />
        <el-button type="primary" size="mini" :disabled="!quotationId" @click="handleExport">导出</el-button>
      </div>
    </div>
    <rent-plan-table
      ref="rentPlanTableDom"
      :can-adjust="canAdjust"
      :cal-method="calculateRentMethod"
      v-model="rentPlanTableInstance"
    />
  </div>
</template>

<script>
import { isEmptyObj, formSubmit, decimalsFormat, thousandSeparator, deepAssign } from 'utils'
import FileImport from 'components/ElFileImport'
import RentPlanTable from './RentPlanTable.vue'
import {
  quotationAdjust,
  templateFilePath,
  quotationImport,
  quotationExportPath
} from 'api/project-module/api-quotation.js'

export default {
  components: {
    RentPlanTable,
    FileImport
  },
  props: {
    rentPlan: {
      type: [Array, Object],
      default: () => {
        return []
      }
    },
    calcResult: {
      type: Array,
      default() {
        return []
      }
    },
    feeData: {
      type: Array,
      default() {
        return []
      }
    },
    isCalculate: {
      type: Boolean,
      default: false
    },
    urlParams: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      calculateResultList: [
        {
          zh: '租金总额：',
          en: 'totalRent',
          value: '--',
          show: true
        },
        {
          zh: '利息总额：',
          en: 'totalInterest',
          value: '--',
          show: true
        },
        {
          zh: '收回本金：',
          en: 'totalPrincipal',
          value: '--',
          show: true
        },
        {
          zh: '每期平均本金/每期租金：',
          en: 'averagePrincipal',
          value: '--',
          show: true
        },
        {
          zh: '测算IRR：',
          en: 'measureIrr',
          value: '--',
          show: true
        },
        {
          zh: '项目IRR：',
          en: 'irr',
          value: '--',
          show: true
        },
        {
          zh: '去税IRR：',
          en: 'removalTaxIrr',
          value: '--',
          show: true
        }
      ],
      quotationId: '', // 报价方案id
      isExportDisable: true,
      rentPlanTableInstance: null,
      canAdjust: false,
      originRentPlan: [],
      calculateRentMethod: '',
      listHead: [
        ['租金支付表导入（不规则）', '', '', '', '', ''],
        ['期数', '日期', '租赁相关流入', '利息', '收回本金', '尚未收回本金']
      ],
      fieldMap: [
        { title: '期数', field: 'issue' },
        { title: '日期', field: 'rentDay', type: 'date' },
        { title: '租赁相关流入', field: 'leaseRelatedInflow', type: 'money' },
        { title: '利息', field: 'interest', type: 'money' },
        { title: '收回本金', field: 'principal', type: 'money' },
        { title: '尚未收回本金', field: 'residualPrincipal', type: 'money' }
      ]
    }
  },
  inject: ['setRentPlanAndCalcResult'],
  watch: {
    // 租金计划
    rentPlan(arr) {
      if (!Array.isArray(arr)) {
        this.rentPlanTableInstance.setData([])
        this.isExportDisable = true
      } else {
        this.originRentPlan = deepAssign([], arr)
        this.rentPlanTableInstance.setData(arr)
        this.isExportDisable = false
      }
    },
    // 测算结果
    calcResult(obj) {
      this.setCalResult(obj)
    }
  },
  mounted() {
    // 项目详情中创建报价方案
    if (this.urlParams.addQuotationFromProject) return
    if (this.urlParams.quotation_id || this.urlParams.project_id) {
      this.rentPlanTableInstance.showLoading = true
    }
  },
  methods: {
    setCalResult(obj = {}) {
      if (isEmptyObj(obj)) return
      this.calculateResultList.forEach(item => {
        if (['irr', 'measureIrr', 'removalTaxIrr'].includes(item.en)) {
          const value = decimalsFormat(obj[item.en] * 100, 4, 4, '--')
          item.value = value === '--' ? '--' : value + '%'
        } else {
          item.value = thousandSeparator(decimalsFormat(obj[item.en], 2, 2, '--')) + '元'
        }
      })
      this.quotationId = obj.id
      this.calculateRentMethod = obj.calculateRentMethod
      const calculateRentMethod = obj.calculateRentMethod

      if (calculateRentMethod === '3') {
        this.calculateResultList[3].value = '--'
        this.calculateResultList[3].show = true
      }
    },
    // 租金调整
    handleAdjustRent() {
      this.canAdjust = !this.canAdjust
      this.$emit('adjust-rent')
    },
    // 租金调整-取消
    handleCancelAdjust() {
      this.canAdjust = false
      const data = deepAssign([], this.originRentPlan)
      this.rentPlanTableInstance.setData(data)
    },
    // 租金调整-保存
    handleSaveAdjust() {
      quotationAdjust(
        {
          cashFlowTDtos: this.rentPlan,
          chargeDetailTDtos: this.feeData,
          quotationLeaseTDto: this.calcResult
        },
        { showLoading: true }
      ).then(res => {
        if (!res.data) return
        this.canAdjust = false
        const { cashFlowTDtos, quotationLeaseTDto } = res.data
        this.setRentPlanAndCalcResult(cashFlowTDtos, quotationLeaseTDto)
        this.$showToast('租金调整成功！', 'success')
      })
    },
    // 模板下载
    handleDownloadTemplete() {
      formSubmit(templateFilePath, { type: 1 }, 'get')
    },
    // 导入租金计划
    handleImportChange(data) {
      for (let i = 0; i < data.length; i++) {
        const issueReg = /^\d+$/
        if (!issueReg.test(data[i].issue)) {
          this.$showToast('期数格式不正确', 'warning')
          return
        }
      }
      const newData = data.map(item => {
        item.quotationId = this.quotationId
        return item
      })
      quotationImport({
        cashFlowTDtos: newData,
        chargeDetailTDtos: this.feeData,
        quotationLeaseTDto: this.calcResult
      })
        .then(res => {
          if (!res.data) return
          const { cashFlowTDtos, quotationLeaseTDto } = res.data
          this.setRentPlanAndCalcResult(cashFlowTDtos, quotationLeaseTDto)
          this.$showToast('导入成功', 'success')
          this.$emit('import-success', newData)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 导出
    handleExport() {
      formSubmit(quotationExportPath, { id: this.quotationId })
    }
  },
  computed: {
    // 租金调整按钮状态
    isAdjustDisable() {
      if (!this.urlParams.canEdit || !this.isCalculate) {
        return true
      } else {
        return +this.calculateRentMethod === 3
      }
    },
    // 导入租金计划按钮状态
    isImportDisable() {
      if (!this.urlParams.canEdit || !this.isCalculate) {
        return true
      } else {
        return +this.calculateRentMethod !== 3
      }
    },
    // 模板下载按钮状态
    isDownloadDisable() {
      if (!this.urlParams.canEdit || !this.isCalculate) {
        return true
      } else {
        return +this.calculateRentMethod !== 3
      }
    }
  }
}
</script>

<style lang='scss'>
.quotation-rent-plan {
  padding: 0 10px 10px 10px;
  .statistics-area {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid rgb(231, 238, 252);
    border-radius: 5px;
    p {
      width: 33.33%;
      min-width: 340px;
      line-height: 30px;
      span {
        display: inline-block;
        width: 170px;
        text-align: right;
        color: #697289;
      }
    }
  }
  .rent-plan-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .btn-import {
    position: relative;
    .file-input {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      opacity: 0;
    }
  }
  .hide {
    display: none;
  }
}
</style>
