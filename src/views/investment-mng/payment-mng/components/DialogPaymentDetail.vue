<template>
  <div>
    <el-dialog
      width="980px"
      :modal-append-to-body="false"
      title="详情"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <div class="payment-mng-verification">
        <h3>相关信息</h3>
        <div class="payment-mng-verification-container">
          <el-form
            ref="relatedInfoDom"
            label-suffix="："
            :model="formModels"
            label-width="120px"
            @submit.native.prevent
          >
            <el-row>
              <el-col span="8">
                <el-form-item label="项目名称">
                  <el-link type="primary" @click="handleProjectDetail">{{formModels.projectName}}</el-link>
                </el-form-item>
              </el-col>
              <el-col span="8">
                <el-form-item label="主合同编号">{{formModels.contractNo}}</el-form-item>
              </el-col>
              <el-col span="8">
                <el-form-item label="客户名称">
                  <el-link type="primary" @click="handleCustDetail">{{formModels.custName}}</el-link>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="8">
                <el-form-item label="收款方">{{formModels.collectId | filterUserInfo}}</el-form-item>
              </el-col>
              <el-col span="8">
                <el-form-item label="收款方账号">{{formModels.collectAccount}}</el-form-item>
              </el-col>
              <el-col span="8">
                <el-form-item label="核销状态">{{formModels.checkState | filterDictValue('10065')}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="8">
                <el-form-item label="记账状态">{{formModels.bookState | filterDictValue('10066')}}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <h3>核销信息</h3>
        <div class="payment-mng-verification-container">
          <el-form
            ref="verificationInfoDom"
            label-suffix="："
            :model="formModels"
            :rules="formRules"
            label-width="120px"
            @submit.native.prevent
          >
            <el-row>
              <el-col span="8">
                <el-form-item label="款项类型">{{formModels.paymentType | filterDictValue('10061')}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="8">
                <el-form-item label="应付金额">{{formModels.amtPayment | filterToThousand}}元</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="8">
                <el-form-item label="计划付款日期">{{(formModels.datePayment || '--') | filterTimestamp("YYYY-MM-DD")}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="8">
                <el-form-item label="实际付款日期" prop="dateCheck">
                  <el-date-picker
                    v-model.trim="formModels.dateCheck"
                    type="date"
                    size="mini"
                    placeholder="请选择日期"
                    value-format="timestamp"
                    :disabled="true"
                    style="width:100%"
                  ></el-date-picker> 
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="24">
                 <el-form-item label="付款账户">
                  <comp-payment-record
                    ref="paymentRecordDom"
                    v-if="formModels.bankAccounts"
                    :can-edit="canEdit"
                    :bank-account="formModels.bankAccounts"
                    :verifys="formModels.verifys"
                  ></comp-payment-record>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="24">
                <el-form-item label="备注">
                  <el-input v-model.trim="formModels.remarks"  :disabled="true" type="textarea" :rows="1"></el-input>
                </el-form-item>
              </el-col>
            </el-row>   
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CompPaymentRecord from "./CompPaymentRecord"
import { queryPaymentDetail, verifyPayment } from 'api/investment-mng/api-payment-mng.js'
import dayjs from "dayjs"

export default {
  inject: ['refreshTable'],
  components: {
    CompPaymentRecord
  },
  inheritAttrs: false,
  props: {
    rowData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: false,
      formModels: {},
      formRules: {
        dateCheck: this.formValidate({ required: true })
      },
      canEdit: false,
    }
  },
  mounted() {
    this.dialogVisible = true
  },
  created() {
    this.initFormData()
  },
  methods: {
    initFormData() {
      queryPaymentDetail({
        id: this.rowData.id
      }, { showLoading: true }).then(res => {
        this.formModels = res.data
        this.$nextTick(()=>{
          this.$refs.verificationInfoDom.clearValidate()
        })
      }).catch(err => {
        console.log(err)
      })
    },
    // 跳转项目详情
    handleProjectDetail(){
      this.$router.push({
        path: '/project-mng/project-detail',
        query: {
          id: this.rowData.projectId,
          action_type: 'view',
          active_tab: 'ProjectBaseInfo'
        }
      })
    },
    // 跳转客户详情
    handleCustDetail(){
      this.$router.push({
        path: '/customer-mng/customer-detail',
        query: {
          id: this.rowData.custId,
          cust_category: this.rowData.custCategory,
          action_type: 'view',
          active_tab: 'CustBaseInfo'
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
.payment-mng-verification {
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
