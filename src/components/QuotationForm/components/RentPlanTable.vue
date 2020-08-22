<template>
  <table-create
    ref="tableDom"
    :show-summary="true"
    :ignore-columns="[1, 5, 8]"
    :options="tableOptions"
    class="comp-rent-plan-table"
  >
    <template v-slot:issue="{scope}">{{ scope.row.issue == 0 ? '' : scope.row.issue }}</template>
    <template v-slot:rentDay="{scope}">
      <el-date-picker
        v-if="canAdjust && scope.row.issue != 0"
        :disabled="scope.$index === 0"
        v-model="scope.row.rentDay"
        :clearable="false"
        size="mini"
        type="date"
        value-format="timestamp"
        style="width:100%;"
        @focus="handleRentDayFocus(scope.row)"
        @change="handleRentDayChange(scope)"
      ></el-date-picker>
      <template v-else>{{ scope.row.rentDay | filterDateSeparate }}</template>
    </template>
    <template v-slot:leaseRelatedInflow="{scope}">
      <number-input
        v-if="canAdjust && calMethod == 2 && scope.row.issue != 0"
        v-model="scope.row.leaseRelatedInflow"
        size="mini"
        style="width:100%;"
      ></number-input>
      <template v-else>{{ scope.row.leaseRelatedInflow | filterToThousand }}</template>
    </template>
    <template v-slot:principal="{scope}">
      <number-input
        v-if="canAdjust && calMethod == 1 && scope.row.issue != 0"
        v-model="scope.row.principal"
        size="mini"
        style="width:100%;"
      ></number-input>
      <template v-else>{{ scope.row.principal | filterToThousand }}</template>
    </template>
  </table-create>
</template>

<script>
import TableCreate from 'components/TableCreate'
export default {
  components: {
    TableCreate
  },
  props: {
    canAdjust: {
      type: Boolean,
      default: false
    },
    calMethod: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      tableOptions: {
        showLoading: false,
        showPagination: false,
        requestImmediate: false,
        columns: [
          {
            attrs: {
              prop: 'issue',
              label: '期数',
              width: 50,
              formatter: (row, column) => {
                return row.issue == 0 ? '' : row.issue
              }
            }
          },
          {
            attrs: {
              prop: 'rentDay',
              label: '日期',
              'min-width': 130,
              formatter: (row, column) => {
                return Vue.filter('filterDateSeparate')(row.rentDay)
              }
            },
            slot: true
          },
          {
            attrs: {
              prop: 'leaseRelatedInflow',
              label: '租金收入',
              'min-width': 100,
              formatter: (row, column) => {
                return Vue.filter('filterToThousand')(row.leaseRelatedInflow)
              }
            },
            slot: true
          },
          {
            attrs: {
              prop: 'interest',
              label: '利息收入',
              'min-width': 100,
              formatter: (row, column) => {
                return Vue.filter('filterToThousand')(row.interest)
              }
            }
          },
          {
            attrs: {
              prop: 'principal',
              label: '回收成本',
              'min-width': 100,
              formatter: (row, column) => {
                return Vue.filter('filterToThousand')(row.principal)
              }
            },
            slot: true
          },
          {
            attrs: {
              prop: 'residualPrincipal',
              label: '未回收成本',
              'min-width': 100,
              formatter: (row, column) => {
                return Vue.filter('filterToThousand')(row.residualPrincipal)
              }
            }
          },
          {
            attrs: {
              prop: 'otherCashInflow',
              label: '其它现金流入',
              'min-width': 100,
              formatter: (row, column) => {
                return Vue.filter('filterToThousand')(row.otherCashInflow)
              }
            }
          },
          {
            attrs: {
              prop: 'otherCashOutflow',
              label: '其它现金流出',
              'min-width': 100,
              formatter: (row, column) => {
                return Vue.filter('filterToThousand')(row.otherCashOutflow)
              }
            }
          },
          {
            attrs: {
              prop: 'cashInflow',
              label: '现金流入',
              'min-width': 100,
              formatter: (row, column) => {
                return Vue.filter('filterToThousand')(row.cashInflow)
              }
            }
          },
          {
            attrs: {
              prop: 'cashOutflow',
              label: '现金流出',
              'min-width': 100,
              formatter: (row, column) => {
                return Vue.filter('filterToThousand')(row.cashOutflow)
              }
            }
          },
          {
            attrs: {
              prop: 'cashFlow',
              label: '净现金流',
              'min-width': 100,
              formatter: (row, column) => {
                return Vue.filter('filterToThousand')(row.cashFlow)
              }
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.$emit('input', this.$refs.tableDom)
  },
  methods: {
    handleRentDayFocus(rowData) {
      rowData.prevRentDay = rowData.rentDay
    },
    handleRentDayChange(scope) {
      const { row, $index } = scope
      const tableData = this.$refs.tableDom.tableData
      const currentDay = row.rentDay
      const prevDay = tableData[$index - 1].rentDay
      const nextDay = tableData[$index + 1].rentDay
      if (currentDay <= prevDay || currentDay >= nextDay) {
        row.rentDay = row.prevRentDay
        this.$showToast('选择日期需大于上期日期且小于下期日期', 'warning')
      } else {
        row.prevRentDay = row.currentDay
      }
    }
  }
}
</script>

<style lang='scss'>
.comp-rent-plan-table {
  .el-input--suffix .el-input__inner {
    padding-right: 10px;
  }
}
</style>
