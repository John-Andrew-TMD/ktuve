<!-- 投放-付款管理-放款账户 -->
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
      >添加付款记录</el-button>
      <el-table ref="tableDom" :data="formValues.paymentRecordList" show-summary :summary-method="getSummaries" style="width: auto" border>
        <!-- <el-table-column label="序号" type="index" width="50"></el-table-column> -->
        <el-table-column>
          <template slot="header">
            <span class="is-required">放款类型</span>
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
            <span class="is-required">放款账户/票据类型</span>
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
                :disabled="!canEdit"
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
            <span class="is-required">放款金额（元）</span>
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
        bankInfo: [{ required: true }],
        amtCollection: [{ required: true }],
        loanType: [{ required: true }]
      },
      loanTypeList: [{label:'银行存款',value:'0'},{label:'票据',value:'1'}],
    }
  },
  props: [
    "paymentAmount", 
    "canEdit", 
    "btnType",
    "bankAccount"
  ],
  created() {
    this.initData()
  },
  methods: {
    initData() {
      console.log('account',this.account);
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
    _publicValidateForm(btnType) {
      return new Promise((resolve, reject) => {
        this.$refs.formDom.validate(valid => {
          if (valid) {
            let total = 0
            let paymentList = this.formValues.paymentRecordList
            paymentList.forEach(item => {
              total += +item.amtCollection
            })
            // verification: 核销、save：保存、add:添加付款记录a
            switch(btnType) {
              case 'verification': 
                if(+total != +this.paymentAmount){
                  return this.$showToast("付款金额总和应等于应付金额！")
                } else {
                  resolve(true)
                }
                break;
              case 'save': 
                if (+total > +this.paymentAmount) {
                  return this.$showToast("付款金额总和应等于应付金额！")
                } else {
                  resolve(true)
                }
                break;
              case 'add': 
                if (+total > +this.paymentAmount) {
                  return this.$showToast("付款金额总和应等于应付金额！")
                } else if (+total == +this.paymentAmount) {
                  return this.$showToast("应付金额额度已满,无需继续添加付款记录！")
                } else {
                  resolve(true)
                }
                break;
            }
          }
        })
      })
    }
  }
}
</script>

<style lang='scss'>
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
