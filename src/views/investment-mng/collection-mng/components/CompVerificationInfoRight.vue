<template>
  <div class="comp-verification-info-right">
    <h3>本次可核销对账单</h3>
      <div class="collection-mng-verification-container" v-if="isBankFlow">
        <table-create
          ref="bankFlowDom"
          :options="tableOptions"
        />
      </div>
      <div class="collection-mng-verification-container" v-if="rentTableShow">
        <p class="tips">“租金”默认按以下顺序进行自动核销，可手动调整：</p>
        <el-form
          ref="formDom"
          :model="formValues"
          size="mini"
          :rules="rules"
          @submit.native.prevent
        >
          <el-table ref="tableDom" :data="formValues.loanConditionList" border>
            <el-table-column label="核销顺序">
              <template slot-scope="scope">
                <span>{{scope.row.collectOrder}}</span>
              </template>
            </el-table-column>
            <el-table-column label="应收（元）">
              <template slot-scope="scope">
                <el-form-item :prop="`loanConditionList.${scope.$index}.needCollect`">
                  {{scope.row.needCollect | filterToThousand}}
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="剩余应收（元）">
              <template slot-scope="scope">
                <el-form-item :prop="`loanConditionList.${scope.$index}.leftCollect`">
                  {{scope.row.leftCollect  | filterToThousand}}
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <span class="is-required">本次核销金额（元）</span>
              </template>
              <template slot-scope="scope">
                <el-form-item :prop="`loanConditionList.${scope.$index}.amount`" :rules="rules.amount">
                  <number-input
                  :disabled="leftCollectDisabled(scope.row)"
                    v-model.trim="scope.row.amount"
                    :min-decimal="0"
                    :max-decimal="8"
                    text-direction="right"
                  ></number-input>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import { customerList } from 'api/customer-module/api-customer-mng.js'
import { queryDictValue } from 'utils'

export default {
  components: {
    TableCreate
  },
  props: {
    formModels: {
      type: Object,
      default: {}
    },
    isBankFlow: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    formModels: {
      handler(newVal) {
        this.$nextTick(() => {
          if(newVal && newVal.collectionType == '0'){
            this.rentTableShow = true
          } else {
            this.rentTableShow = false
          }
          let list = [
            {collectOrder:'1.利息：', needCollect: newVal.amtInterest, leftCollect: +newVal.amtInterest - +newVal.amtInterestVer, amount:+newVal.amtInterest - +newVal.amtInterestVer},
            {collectOrder:'2.本金：', needCollect: newVal.amtPrincipal, leftCollect: +newVal.amtPrincipal - +newVal.amtPrincipalVer, amount:+newVal.amtPrincipal - +newVal.amtPrincipalVer}
          ]
          this.formValues.loanConditionList = list
        })
      }
    },
    isBankFlow: {
      handler(newVal){
        this.$nextTick(() => {
          if(this.$refs.bankFlowDom){
            let tableData = this.$refs.bankFlowDom
            tableData.setData(this.formModels.bankFlowInfo)
          }
        })
      },
    }
  },
  computed: {
    leftCollectDisabled() {
      return row => {
        if(row.leftCollect == '0'){
          return true
        } else {
          return false
        }
      };
    }
  },
  data() {
    return {
      rowData: null,
      formValues: {
        loanConditionList: []
      },
      rules: {
        amount: this.formValidate({ required: true })
      },
      rentTableShow: false,
      tableOptions: {
        requestImmediate: false,
        showLoading: false,
        showSerialNumber: true,
        tableBottomOffset: 50,
        columns: [
          { attrs: { label: '流水单号', prop: 'bankFlowNumber', 'min-width': '150', 'show-overflow-tooltip': true } },
          {
            attrs: {
              label: '收款日期',
              prop: 'collectionDate',
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.collectionDate, 'YYYY-MM-DD')
              }
            }
          },
          {
            attrs: {
              label: '金额（元）',
              prop: 'bankFlowAmount',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.bankFlowAmount)
              }
            }
          },
          { attrs: { label: '付款人账号', prop: 'paymentAccount', 'show-overflow-tooltip': true } },
          { attrs: { label: '付款人名称', prop: 'paymentName', 'min-width': '150', 'show-overflow-tooltip': true } },
          {
            attrs: {
              label: '收款方式',
              prop: 'collectionMethod',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.collectionMethod, '10063')
              }
            }
          },
          {
            attrs: {
              label: '审核时间',
              prop: 'importTime',
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.importTime)
              }
            }
          }
        ]
      },
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.comp-verification-info-right{
  padding: 0 10px;
  h3 {
    background:#85adff;
    color: #ffffff;
    position: relative;
    margin-bottom: 10px;
    padding-left: 10px;
    font-size: 14px;
    font-weight: normal;
    line-height: 30px;
    text-align: left;
  }
  .collection-mng-verification-container{
    margin-bottom: 5px;
    .tips{
      margin-bottom: 10px;
    }
    span.is-required::before{
      content: '*';
      color: red;
      font-size: 16px;
      margin-right: 5px;
    }
  }
  
}
</style>