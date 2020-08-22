<template>
  <div>
    <el-dialog
      width="900px"
      :modal-append-to-body="false"
      title="退回"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <div class="one-account-mng-return">
        <h3>款项信息</h3>
        <div class="one-account-mng-return-container">
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
                <el-form-item label="交易日期">{{formModels.tradeDate}}</el-form-item>
              </el-col>
              <el-col span="8">
                <el-form-item label="匹配状态">{{formModels.checkState}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="8">
                <el-form-item label="审核状态">{{formModels.bookState}}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <h3>款项退回信息</h3>
        <div class="one-account-mng-return-container">
          <el-form
            ref="returnInfoDom"
            label-suffix="："
            :model="formModels"
            :rules="formRules"
            label-width="160px"
            @submit.native.prevent
          >
            <el-row>
              <el-col span="8">
                <el-form-item label="已匹配金额">{{formModels.matchAmount}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="8">
                <el-form-item label="退回金额">{{formModels.returnAmount}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="计划退回时间" prop="planReturnDate">
                  <el-date-picker
                    v-model.trim="formModels.planReturnDate"
                    type="date"
                    size="mini"
                    placeholder="请选择日期"
                    value-format="yyyyMMdd"
                    style="width:100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="12">
                <el-form-item label="说明">
                  <el-input v-model.trim="formModels.remarks"></el-input>
                </el-form-item>
              </el-col>
            </el-row>   
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('returnInfoDom')">发起审批</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryDictValue, thousandSeparator } from "utils"
import dayjs from "dayjs"
export default {
  inheritAttrs: false,
  data() {
    return {
      dialogVisible: false,
      formModels: {
        payerName: 'xixixixixi',
        flowNo: 'ZGQ00001',
        custName: 'Zhuang',
        collectName: 'test',
        account: 'test',
        checkState: 'test',
        bookState: 'test',
        paymentType: 'test',
        flowAmount: '1000000',
        matchAmount: '8000',
        returnAmount: '3999',
        tradeDate: '2020-7-17',
        remarks: ''
      },
      formRules: {
        planReturnDate: this.formValidate({ required: true })
      },
      canEdit: true
    }
  },
  mounted() {
    this.dialogVisible = true
  },
  methods: {
    // 确定
    handleDialogConfirm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // TODO
          this.$showToast('yes','success')
        } else {
          this.$showToast('no', 'warning')
        }
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.one-account-mng-return {
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
