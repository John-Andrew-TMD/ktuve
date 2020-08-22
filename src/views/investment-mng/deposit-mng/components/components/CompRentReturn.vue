<template>
  <div class="loan-area">
    <el-table
      ref="tableDom"
      :data="tableData"
      border
      show-summary
      highlight-current-row
      :summary-method="getSummaries"
      style="width: 100%"
    >
      <el-table-column label="期数" prop="issue" width="50"></el-table-column>
      <el-table-column label="租金日" width="90">
        <template slot-scope="scope">{{scope.row.rent_day | filterDateSeparate}}</template>
      </el-table-column>
      <el-table-column label="租金">
        <el-table-column prop="actual_rent" label="应收金额" :formatter="formatterMoney"></el-table-column>
        <el-table-column prop="amt_surplus" label="剩余应收" :formatter="formatterMoney"></el-table-column>
      </el-table-column>
      <el-table-column label="本金">
        <el-table-column prop="amt_surplus_principal" label="剩余应收" :formatter="formatterMoney"></el-table-column>
        <el-table-column label="抵扣金额" prop="deduction_principal">
          <template slot-scope="scope">
            <number-input
              size="mini"
              v-model.trim="scope.row.deduction_principal"
              :disabled="isDisabled(scope.row.amt_surplus_principal)"
              :min-decimal="2"
              :max-decimal="2"
              needFormat="true"
              text-direction="right"
              placeholder="请输入金额"
              @blur="handleBlur(scope.row,'deduction_principal','amt_surplus_principal')"
              @change="handleChange(scope.row,'deduction_principal','amt_surplus_principal')"
            ></number-input>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="利息">
        <el-table-column prop="amt_surplus_interest" label="剩余应收" :formatter="formatterMoney"></el-table-column>
        <el-table-column label="抵扣金额" prop="deduction_interest">
          <template slot-scope="scope">
            <number-input
              size="mini"
              v-model.trim="scope.row.deduction_interest"
              :disabled="isDisabled(scope.row.amt_surplus_interest)"
              :min-decimal="2"
              :max-decimal="2"
              needFormat="true"
              text-direction="right"
              placeholder="请输入金额"
              @blur="handleBlur(scope.row,'deduction_interest','amt_surplus_interest')"
              @change="handleChange(scope.row,'deduction_interest','amt_surplus_interest')"
            ></number-input>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="罚息">
        <el-table-column prop="amt_surplus_penalty" label="剩余应收" :formatter="formatterMoney"></el-table-column>
        <el-table-column label="抵扣金额" prop="deduction_penalty">
          <template slot-scope="scope">
            <number-input
              size="mini"
              v-model.trim="scope.row.deduction_penalty"
              :disabled="isDisabled(scope.row.amt_surplus_penalty)"
              :min-decimal="2"
              :max-decimal="2"
              needFormat="true"
              text-direction="right"
              placeholder="请输入金额"
              @blur="handleBlur(scope.row,'deduction_penalty','amt_surplus_penalty')"
              @change="handleChange(scope.row,'deduction_penalty','amt_surplus_penalty')"
            ></number-input>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { thousandSeparator } from 'utils'
export default {
  data() {
    return {
      tableData: []
    }
  },
  props: {
    routeParams: {},
    loanId: {
      type: [String, Number],
      default: ''
    },
    usableAmount: {
      type: [String, Number],
      default: 0
    },
    rentDeductData: {
      type: Object,
      default: () => []
    }
  },
  created() {
    if (!this.rentDeductData || !this.rentDeductData.length) {
      this.initTable(this.loanId)
    } else {
      this.tableData = this.rentDeductData
    }
  },
  watch: {
    loanId(newVal) {
      this.initTable(newVal)
    }
  },
  methods: {
    initTable(loan_id) {
      this.$promiseRequest({
        code: '203408',
        data: {
          loan_id
        }
      }).then(res => {
        if (res.data.record) {
          const data = res.data.record
          this.tableData = data
        }
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 1) {
          sums[index] = ''
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = thousandSeparator(sums[index]) + '元'
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    formatterMoney(row, column, cellValue, index) {
      return thousandSeparator(cellValue)
    },
    async _validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs.formDom.validate(valid => {
          if (valid) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    },
    handleBlur(rowData, currentValue, relationValue) {
      const cVal = +rowData[currentValue]
      if (cVal > +this.usableAmount) {
        rowData[currentValue] = rowData[`prev_${currentValue}`] || 0
        this.$showToast('抵扣金额不能大于可使用金额', 'warning')
        return
      }
      if (cVal > +rowData[relationValue]) {
        rowData[currentValue] = rowData[`prev_${currentValue}`] || 0
        this.$showToast('抵扣金额应小于剩余应收', 'warning')
      }
    },
    handleChange(rowData, currentValue, relationValue) {
      const cVal = +rowData[currentValue]
      if (cVal <= +rowData[relationValue] && cVal <= +this.usableAmount) {
        rowData[`prev_${currentValue}`] = rowData[currentValue]
      }
    }
  },
  computed: {
    isDisabled() {
      return value => {
        if (this.routeParams) {
          const { flow_no, canEdit } = this.routeParams
          return flow_no ? !canEdit : true
        }
        if (this.usableAmount <= 0) {
          return true
        }
        return value <= 0
      }
    }
  }
}
</script>
