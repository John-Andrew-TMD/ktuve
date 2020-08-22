<!-- 投放-付款管理-付款账户 -->
<template>
  <div class="payment-record-area">
    <el-form
      ref="formDom"
      :model="formValues"
      size="mini"
      :show-message="true"
      :rules="rules"
      @submit.native.prevent
    >
      <el-button
        icon="el-icon-plus"
        type="primary"
        size="mini"
        plain
        @click="handlePaymentRecordAdd"
        class="addBtn"
        style="margin-bottom: 10px"
        v-if="canEdit"
      >添加付款记录</el-button>
      <el-table ref="tableDom" :data="formValues.paymentRecordList" show-summary :summary-method="getSummaries" style="width: auto" border>
        <el-table-column>
          <template slot="header">
            <span class="is-required">付款类型</span>
          </template>
          <template slot-scope="scope">
            <el-form-item
              :prop="`paymentRecordList.${scope.$index}.loanType`"
              :rules="rules.loanType"
            >
              <el-select
                v-model="scope.row.loanType"
                placeholder="请选择"
                style="width:100%"
                @change="loanTypeChange(scope)"
                :disabled="!canEdit"
              >
                <el-option
                  v-for="item in loanTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header">
            <span class="is-required">付款账户/票据类型</span>
          </template>
          <template slot-scope="scope">
            <el-form-item
              :prop="`paymentRecordList.${scope.$index}.bankInfo`"
              :rules="rules.bankInfo"
            >
              <el-select
                v-model="scope.row.bankInfo"
                placeholder="请选择"
                style="width:100%"
                :disabled="loanTypeDisabled(scope.row)"
              >
                <el-option
                  v-for="item in account"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="amtCollection">
          <template slot="header">
            <span class="is-required">付款金额（元）</span>
          </template>
          <template slot-scope="scope">
            <el-form-item
              :prop="`paymentRecordList.${scope.$index}.amtCollection`"
              :rules="rules.amtCollection"
            >
              <number-input
                v-model.trim="scope.row.amtCollection"
                :min-decimal="2"
                :max-decimal="2"
                needFormat="true"
                text-direction="right"
                :disabled="!canEdit"
              >
                <template slot="append">元</template>
              </number-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="50px" label="操作" v-if="canEdit">
          <template slot-scope="scope">
            <i class="el-icon-delete" @click="handleDelete(scope)" />
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import { thousandSeparator } from 'utils'
export default {
  data() {
    return {
      formValues: {
        paymentRecordList: []
      },
      rules: {
        bankInfo: this.formValidate({ required: true }),
        amtCollection: this.formValidate({ required: true }),
        loanType: this.formValidate({ required: true })
      },
      loanTypeList: [{label:'银行存款',value:'0'},{label:'票据',value:'1'}],
      account: null,
      isBill: false
    }
  },
  props: {
    canEdit: {
      type: Boolean,
      default: false
    },
    bankAccount: {
      type: Array,
      default: () => []
    },
    verifys: {
      type: Array,
      default: () => []
    }
  },
  created() {
    this.initData()
  },
  computed: {
    loanTypeDisabled() {
      return row => {
        if(!this.canEdit){
          return true
        } else {
          if(row.loanType == '1'){
            return true
          } else {
            return false
          }
        }
      };
    }
  },
  methods: {
    initData() {
      if(this.bankAccount){
        this.account = this.bankAccount.map(item => {
          return {
            value: item.bankInfo,
            label: item.bankInfo,
            checked: item.checked
          }
        })
      }
      if(this.verifys){
        this.formValues.paymentRecordList = this.verifys
      }
    },
    loanTypeChange(scope){
      if(scope.row.loanType == '1'){
        scope.row.bankInfo = '--'
      } else {
        this.bankAccount.forEach(item =>{
          if(item.checked){
            scope.row.bankInfo = item.bankInfo
          }
        })
      }
    },
    // 添加付款记录
    async handlePaymentRecordAdd() {
      let ret = await this._publicValidateForm('add')
      if(ret == true){
        this.formValues.paymentRecordList.push({
          loanType: "",
          bankInfo: "",
          amtCollection: ""
        })
      }
    },
    // 删除付款记录
    handleDelete(scope) {
      this.formValues.paymentRecordList.splice(scope.$index, 1)
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
    // 添加付款记录之前的校验公共方法
    _publicValidateForm() {
      return new Promise((resolve, reject) => {
        this.$refs.formDom.validate(valid => {
          if (valid) {
            resolve(true)
          }
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.payment-record-area {
  text-align: right;
  background: #ffffff;
  .el-form-item {
    margin: 0 0 12px 0 !important;
  }
  span.is-required::before{
    content: '*';
    color: red;
    font-size: 16px;
    margin-right: 5px;
  }
}
</style>
