<template>
  <el-form
    ref="formDom"
    :model="formValues"
    size="mini"
    :show-message="false"
    :rules="rules"
    :disabled="!canEdit"
    @submit.native.prevent
  >
    <h3>{{ feesTitle }}</h3>
    <el-table ref="tableDom" :data="formValues.feesDataList" border style="width: 100%">
      <!-- <el-table-column label="序号" type="index" width="50" /> -->
      <el-table-column label="收取方式" prop="outlayWay" min-width="160" v-if="isDepositPayment">
        <template slot-scope="scope">
          <el-form-item :prop="`feesDataList.${scope.$index}.outlayWay`" :rules="rules.outlayWay">
            <el-select
              v-model="scope.row.outlayWay"
              placeholder="请选择"
              size="mini"
              style="width: 100%;"
            >
              <el-option
                v-for="item in outlayWayOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column v-if="isOtherPayment" label="其他款项" min-width="130">
        <template slot-scope="scope">
          <el-form-item
            :prop="`feesDataList.${scope.$index}.dictOutlayType`"
            :rules="rules.dictOutlayType"
          >
            <el-select
              v-model="scope.row.dictOutlayType"
              placeholder="请选择"
              size="mini"
              style="width: 100%;"
            >
              <el-option
                v-for="item in dictOutlayTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="收取金额" min-width="230">
        <template slot-scope="scope">
          <div class="multi-row multi-row2">
            <el-form-item
              :prop="`feesDataList.${scope.$index}.outlayRate`"
              :rules="rules.outlayRate"
            >
              <number-input
                v-model.trim="scope.row.outlayRate"
                :min-decimal="0"
                :max-decimal="8"
                text-direction="right"
                @blur="handleRateBlur(scope.row)"
              >
                <template slot="append">%</template>
              </number-input>
            </el-form-item>
            <el-form-item
              :prop="`feesDataList.${scope.$index}.outlayAmount`"
              :rules="rules.outlayAmount"
            >
              <number-input
                v-model.trim="scope.row.outlayAmount"
                :min-decimal="2"
                :max-decimal="8"
                :need-format="true"
                text-direction="right"
                @blur="handleAmountBlur(scope.row)"
              >
                <template slot="append">元</template>
              </number-input>
            </el-form-item>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="收取时间" min-width="150">
        <template slot-scope="scope">
          <el-form-item :prop="`feesDataList.${scope.$index}.feeDate`" :rules="rules.feeDate">
            <el-date-picker
              v-model="scope.row.feeDate"
              size="mini"
              placeholder="请选择"
              style="width: auto"
              value-format="timestamp"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="到期处理方式" min-width="125" v-if="isDepositPayment">
        <template slot-scope="scope">
          <el-form-item
            :prop="`feesDataList.${scope.$index}.expirationTreatment`"
            :rules="rules.expirationTreatment"
          >
            <el-select
              v-model="scope.row.expirationTreatment"
              placeholder="请选择"
              size="mini"
              style="width: 100%;"
            >
              <el-option
                v-for="item in expirationTreatmentOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column width="50px" label="操作">
        <template slot-scope="scope">
          <i v-if="canEdit" class="el-icon-delete" @click="handleDelete(scope)" />
        </template>
      </el-table-column>
    </el-table>
    <el-button
      v-if="canEdit"
      type="primary"
      icon="el-icon-plus"
      size="mini"
      style="margin-top: 10px;"
      @click="handleFeesAdd"
    >添加</el-button>
  </el-form>
</template>

<script>
import { decimalsFormat, thousandSeparator, deepAssign, queryDictItems } from 'utils'
export default {
  props: {
    quotationPrice: {
      type: Number,
      default: 0
    },
    /**
     * deposit 风险保证金
     * consult 咨询服务费
     * other 其它款项
     */
    type: {
      type: String,
      default: ''
    },
    feesTitle: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formValues: {
        feesDataList: [],
        expirationHandler: ''
      },
      outlayWayOptions: queryDictItems('10036'),
      dictOutlayTypeOptions: [
        {
          value: '4',
          label: '其他支出'
        },
        {
          value: '5',
          label: '其他收入'
        }
      ],
      expirationTreatmentOptions: queryDictItems('10037'),
      rules: {
        outlayWay: this.formValidate({ required: true }),
        expirationTreatment: this.formValidate({ required: true }),
        dictOutlayType: this.formValidate({ required: true }),
        feeDate: this.formValidate({ required: true }),
        outlayRate: this.formValidate({ required: true }),
        outlayAmount: this.formValidate({ required: true })
      }
    }
  },
  watch: {
    quotationPrice(newVal, oldVal) {
      if (newVal === oldVal) return
      this.formValues.feesDataList.forEach(item => {
        if (item.outlayRate !== '') {
          item.outlayAmount = decimalsFormat((Number(item.outlayRate) * this.quotationPrice) / 100)
        }
      })
      // this.$nextTick(() => {
      //   this.calculateSummation()
      // })
    },
    data(newVal) {
      if (!newVal.length) return
      this.formValues.feesDataList = newVal
      // this.$nextTick(() => {
      //   this.calculateSummation()
      // })
    }
  },
  methods: {
    handleRateBlur(row) {
      if (!+this.quotationPrice) {
        row.outlayAmount = 0
      } else {
        row.outlayAmount = (Number(row.outlayRate) * this.quotationPrice) / 100
      }
      // this.calculateSummation()
    },
    handleAmountBlur(row) {
      if (!+this.quotationPrice) {
        row.outlayRate = 0
      } else {
        row.outlayRate = (Number(row.outlayAmount) / this.quotationPrice) * 100
      }
      // this.calculateSummation()
    },
    async handleFeesAdd() {
      const ret = await this._validateForm()
      if (ret) {
        this.formValues.feesDataList.push({
          outlayRate: '',
          outlayAmount: '',
          feeDate: ''
        })
      }
    },
    handleDelete(scope) {
      this.formValues.feesDataList.splice(scope.$index, 1)
    },
    calculateSummation() {
      if (this.isOtherPayment) {
        // this.tempDom =
        //   this.tempDom ||
        //   this.$refs.tableDom.$el
        //     .querySelector('.el-table__footer')
        //     .querySelector('tr')
        //     .querySelectorAll('td')[2]
        //     .querySelector('.cell')
      } else {
        // this.tempDom =
        //   this.tempDom ||
        //   this.$refs.tableDom.$el
        //     .querySelector('.el-table__footer')
        //     .querySelector('tr')
        //     .querySelectorAll('td')[1]
        //     .querySelector('.cell')
      }
      let totalRate = 0
      let totalAmount = 0
      this.formValues.feesDataList.forEach(item => {
        totalRate += +item.outlayRate
        totalAmount += +item.outlayAmount
      })
      totalRate = decimalsFormat(totalRate)
      totalAmount = thousandSeparator(decimalsFormat(totalAmount))
      // this.tempDom.innerHTML = `${totalRate}%;${totalAmount}元`
    },
    async _validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs.formDom.validate(valid => {
          if (valid) {
            resolve(true)
          } else {
            this.$nextTick(() => {
              this.$refs.formDom.$el.querySelector('.el-form-item.is-error').parentNode.scrollIntoView({
                behavior: 'smooth'
              })
            })
            resolve(false)
          }
        })
      })
    }
  },
  computed: {
    isOtherPayment() {
      return this.type === 'other'
    },
    isDepositPayment() {
      return this.type === 'deposit'
    }
  }
}
</script>

<style lang='scss'>
.fees-area {
  h3 {
    position: relative;
    margin-bottom: 10px;
    padding-left: 10px;
    font-size: 14px;
    font-weight: normal;
    line-height: 30px;
    text-align: left;
    border-bottom: 1px solid #f6f6f6;

    &::before {
      position: absolute;
      top: 7px;
      left: 0;
      display: inline-block;
      width: 3px;
      height: 16px;
      content: '';
      background: #85adff;
    }
  }
  .el-form {
    margin-bottom: 15px;
  }
  .multi-row {
    .el-form-item {
      &:last-child {
        .el-form-item__content {
          width: 135px !important;
        }
      }
    }
  }
  .multi-row2 {
    .el-form-item {
      &:last-child {
        .el-form-item__content {
          width: auto !important;
          min-width: 120px;
        }
      }
    }
  }
}
</style>
