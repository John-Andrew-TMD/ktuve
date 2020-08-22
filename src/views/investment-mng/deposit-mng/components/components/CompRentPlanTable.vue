<template>
  <div class="loan-area">
    <el-table
      :data="tableData"
      border
      show-summary
      highlight-current-row
      :summary-method="getSummaries"
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="计划收款日期" width="94">
        <template slot-scope="scope">{{scope.row.rent_day | filterDateSeparate}}</template>
      </el-table-column>
      <el-table-column label="款项类型" width="90">
        <template slot-scope="scope">{{scope.row.rent_day | filterDateSeparate}}</template>
      </el-table-column>
      <el-table-column label="款项金额">
        <el-table-column prop="actual_rent" label="应收金额" min-width="100" :formatter="formatterMoney"></el-table-column>
        <el-table-column prop="amt_surplus" label="剩余应收" min-width="100" :formatter="formatterMoney"></el-table-column>
        <el-table-column prop="amt_surplus" label="抵扣金额" min-width="120">
          <template slot-scope="scope">
            <number-input size="mini" v-model.trim="scope.row.amt_surplus" placeholder="请输入金额" />
          </template>
        </el-table-column>
        <el-table-column
          prop="amt_surplus"
          label="剩余可抵金额"
          :formatter="formatterMoney"
          min-width="100"
        ></el-table-column>
      </el-table-column>
      <el-table-column label="本金">
        <el-table-column prop="amt_surplus_principal" label="剩余应收" min-width="100" :formatter="formatterMoney"></el-table-column>
        <el-table-column label="抵扣金额" prop="deduction_principal" min-width="120">
          <template slot-scope="scope">
            <number-input
              size="mini"
              v-model.trim="scope.row.deduction_principal"
              placeholder="请输入金额"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="利息">
        <el-table-column prop="amt_surplus_interest" label="剩余应收" min-width="100" :formatter="formatterMoney"></el-table-column>
        <el-table-column label="抵扣金额" prop="deduction_interest" min-width="120">
          <template slot-scope="scope">
            <number-input
              size="mini"
              v-model.trim="scope.row.deduction_interest"
              placeholder="请输入金额"
            />
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate'
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
    this.initTable()
  },
  watch: {
    loanId(newVal) {
      // this.initTable(newVal)
    }
  },
  methods: {
    initTable(loan_id) {
      const data = [
        {
          projectName: '121',
          RateDikoujine: 22
        }
      ]
      this.tableData = data
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
  },
  components: {
    TableCreate
  }
}
</script>
