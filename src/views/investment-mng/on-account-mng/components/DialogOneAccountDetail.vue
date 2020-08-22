<template>
  <div>
    <el-dialog
      width="980px"
      :modal-append-to-body="false"
      title="详情"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <div class="one-account-mng-detail">
        <h3>款项信息</h3>
        <div class="one-account-mng-detail-container">
          <el-form
            ref="paymentInfoDom"
            label-suffix="："
            :model="formModels"
            label-width="160px"
            @submit.native.prevent
          >
            <el-row>
              <el-col span="8">
                <el-form-item label="流水编号">{{formModels.flowNo}}</el-form-item>
              </el-col>
              <el-col span="8">
                <el-form-item label="付款人">{{formModels.payerName}}</el-form-item>
              </el-col>
              <el-col span="8">
                <el-form-item label="付款账号">{{formModels.account}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="8">
                <el-form-item label="付款（流水单）金额">{{formModels.flowAmount}}</el-form-item>
              </el-col>
              <el-col span="8">
                <el-form-item label="付款日期">{{formModels.tradeDate}}</el-form-item>
              </el-col>
              <el-col span="8">
                <el-form-item label="核销状态">{{formModels.checkState}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="8">
                <el-form-item label="记账状态">{{formModels.bookState}}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <h3>款项处理详情</h3>
        <table-create
          ref="tableDom"
          :options="tableOptions"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import { queryDictValue, thousandSeparator } from "utils"
import dayjs from "dayjs"
export default {
  inheritAttrs: false,
  components: {
    TableCreate
  },
  data() {
    return {
      dialogVisible: false,
      formModels: {
        flowNo: 'xixixixixi',
        payerName: 'Zhuang',
        collectName: 'test',
        account: 'test',
        checkState: 'test',
        bookState: 'test',
        flowAmount: '1000000',
        tradeDate: '2020-7-17'
      },
      formRules: {
        dateCheck: this.formValidate({ required: true })
      },
      tableOptions: {
        requestParams: {
          url: '',
          data: {}
        },
        showLoading: false,
        showSerialNumber: true,
        requestImmediate: false, // 需要自动展示数据删除此行
        showTools: true,
        tableBottomOffset: 50,
        columns: [
          {
            attrs: {
              label: '操作时间',
              prop: 'checkTime',
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.checkTime)
              }
            }
          },
          { attrs: { label: '操作人员', prop: 'checkOper', 'show-overflow-tooltip': true } },
          { attrs: { label: '操作事项', prop: 'operation', 'show-overflow-tooltip': true } },
          {
            attrs: {
              label: '操作金额（元）',
              prop: 'payerMoney',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.payerMoney)
              }
            }
          },
          { attrs: { label: '备注/详情', prop: 'operation', 'show-overflow-tooltip': true } }
        ]
      },
    }
  },
  mounted() {
    this.dialogVisible = true
  },
  methods: {
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.one-account-mng-detail {
  padding: 0 10px;
  h3 {
    color: #5c6478;
    position: relative;
    margin-bottom: 10px;
    padding-left: 10px;
    font-size: 14px;
    font-weight: bold;
    line-height: 40px;
    text-align: left;
    border-bottom: 1px solid #f6f6f6;
    &::before {
      position: absolute;
      top: 11px;
      left: 0;
      display: inline-block;
      width: 3px;
      height: 18px;
      content: "";
      background: #85adff;
    }
  }
}
</style>
