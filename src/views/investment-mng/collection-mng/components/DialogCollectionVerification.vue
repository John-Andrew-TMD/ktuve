<template>
  <div>
    <el-dialog
      width="1280px"
      :modal-append-to-body="false"
      title="核销"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <div class="collection-mng-verification">
        <h3>相关信息</h3>
        <div class="collection-mng-verification-container">
          <el-form
            ref="relatedInfoDom"
            label-suffix="："
            :model="formModels"
            label-width="120px"
            @submit.native.prevent
          >
            <el-row>
              <el-col span="8">
                <el-form-item label="项目名称">{{formModels.projectName}}</el-form-item>
              </el-col>
              <el-col span="8">
                <el-form-item label="租赁类别">{{formModels.businessCategory | filterDictValue('10027')}}</el-form-item>
              </el-col>
              <el-col span="8">
                <el-form-item label="租赁类型">{{formModels.businessType | filterDictValue('10026')}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="8">
                <el-form-item label="主合同编号">{{formModels.contractNo}}</el-form-item>
              </el-col>
              <el-col span="8">
                <el-form-item label="付款方">{{formModels.custName}}</el-form-item>
              </el-col>
              <el-col span="8">
                <el-form-item label="对应放款其次">{{formModels.rentIssue}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col span="8">
                <el-form-item label="核销状态">{{formModels.checkState | filterDictValue('10065')}}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <h3>请确认本次核销信息</h3>
        <div class="collection-mng-verification-container">
          <el-form
            ref="verificationFormDom"
            label-suffix="："
            :model="formModels"
            :rules="formRules"
            label-width="120px"
            @submit.native.prevent
          >
            <el-row>
              <el-col span="12">
                <el-form-item label="核销方式" prop="collectionWay">
                  <el-select v-model.trim="formModels.collectionWay" value-key="item" style="width: 100%" @change='handleSelectChange'>
                    <el-option
                      v-for="(item,idx) in collectionWayList"
                      :key="idx"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <comp-verification-info
              ref="verificationInfoDom"
              :form-models="formModels"
              :is-bank-flow="isBankFlow"
            ></comp-verification-info> 
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CompVerificationInfo from "./CompVerificationInfo"
import { queryCollectionDetail, startVerification } from 'api/investment-mng/api-collection-mng.js'
import dayjs from "dayjs"

export default {
  inject: ['refreshTable'],
  components: {
    CompVerificationInfo
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
        collectionWay: this.formValidate({ required: true })
      },
      collectionWayList: [{label:'票据',value:'0'},{label:'银行流水',value:'1'}],
      canEdit: true,
      isBankFlow: false
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
      queryCollectionDetail({
        id: this.rowData.id
      }, { showLoading: true }).then(res => {
        this.formModels = res.data
        this.formModels.collectionWay = '0'
      }).catch(err => {
        console.log(err)
      })
    },
    handleSelectChange(value){
      if(value == '0'){
        this.isBankFlow = false
      } else {
        this.isBankFlow = true
      }
    },
    // 确定
    handleDialogConfirm() {
      this.$refs.verificationFormDom.validate(async valid => {
        if (valid) {
          let leftDom = this.$refs.verificationInfoDom.$refs.infoLeftDom  //左组件dom
          let rightDom = this.$refs.verificationInfoDom.$refs.infoRightDom //右组件dom
          leftDom.$refs.relatedInfoDom.validate(async leftValid => {
            if (leftValid) {
              if (rightDom.$refs.formDom) {
                rightDom.$refs.formDom.validate(async rightValid => {
                  if (rightValid) {
                    if (this.formModels.bankFlowInfo && this.formModels.collectionWay =='1') {
                      let flowMoney = 0
                      this.formModels.bankFlowInfo.forEach(item => {
                        flowMoney += item.bankFlowAmount
                      });
                      let interestAddPrincipal = +rightDom.formValues.loanConditionList[1].amount + +rightDom.formValues.loanConditionList[0].amount
                      if(flowMoney != interestAddPrincipal){
                        return this.$showToast('本次核销金额总和应等于匹配的流水金额总和！')
                      }
                    } 
                    let requestParams = this.getAllNeedParams(leftDom,rightDom)
                    this.startVerification(requestParams)
                  }
                })
              } else {
                let requestParams = this.getAllNeedParams(leftDom,rightDom)
                this.startVerification(requestParams)
              }
            }
          })
        }
      })
    },
    // 获取所有核销需要的参数   collectionWay： 0.票据 1.银行流水
    getAllNeedParams(leftDom,rightDom){
      let requestParams = {}
      if(this.formModels.collectionWay =='0') {
        requestParams = {
          id: this.rowData.id,
          collectionWay: this.formModels.collectionWay,
          amtCollectionNow: leftDom.formModels.amtCollectionNow,
          dateCheck: leftDom.formModels.dateCheck,
          verifyPrincipal: rightDom.formValues.loanConditionList[1].amount || 0,
          verifyInterest: rightDom.formValues.loanConditionList[0].amount || 0
        }
      } else {
        let flowMoney = 0
        this.formModels.bankFlowInfo.forEach(item => {
          flowMoney += item.bankFlowAmount
        })
        let maxDate = Math.max.apply(Math, this.formModels.bankFlowInfo.map(function(o) {return o.collectionDate}))
        requestParams = {
          id: this.rowData.id,
          collectionWay: this.formModels.collectionWay,
          amtCollectionNow: flowMoney,
          dateCheck: maxDate,
          verifyPrincipal: rightDom.formValues.loanConditionList[1].amount || 0,
          verifyInterest: rightDom.formValues.loanConditionList[0].amount || 0
        }
      }
      return requestParams
    },
    // 发起核销
    startVerification(requestParams) {
      debugger
      startVerification(requestParams, { showLoading: true }).then(res => {
        this.$showToast('核销成功！', 'success')
        this.dialogVisible = false
        this.refreshTable()
      }).catch(err => {
        console.log(err)
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.collection-mng-verification {
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
