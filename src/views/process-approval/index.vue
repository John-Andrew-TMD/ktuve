<template>
  <div class="app-content app-content--quote process-approval-page">
    <quote text="流程审批-" :sub-text="flowTitle" icon="approve">
      <el-tabs v-model="activeName" class="el-tabs-flow">
        <el-tab-pane label="流程表单" :name="componentName" />
        <el-tab-pane label="流程处理详情" name="ProcessDisposeDetail" />
        <el-tab-pane label="流程图" name="ProcessChart" />
      </el-tabs>
      <div v-if="!!flowInstance">
        <el-button
          v-for="item in approveBtnList"
          :key="item.name"
          size="mini"
          :type="item.type"
          @click="handleBtnClick(item.name, item.params)"
        >{{ item.title }}</el-button>
      </div>
      <div v-else />
    </quote>
    <div v-if="formData" class="comp-container">
      <transition name="fade" mode="out-in">
        <keep-alive exclude="ProcessDisposeDetail,ProcessChart">
          <component
            :is="activeName"
            v-model="flowInstance"
            :route-params="urlParams"
            :flow-info="flowInfo"
            :form-data="formData"
          />
        </keep-alive>
      </transition>
    </div>
    <dialog-suggestion
      v-if="suggestDialogStatus"
      :dialog-status.sync="suggestDialogStatus"
      :route-params="urlParams"
      :form-configs="formConfigs"
      :action="action"
      @dialogConfirm="handleSuggestionDialogConfirm"
    />
    <dialog-user-select
      v-if="userSelectDialogStatus"
      :user-data="userList"
      :dialog-status.sync="userSelectDialogStatus"
      @dialogConfirm="handleUserSelectDialogConfirm"
    />
  </div>
</template>

<script>
const BUTTON_LIST = [
  {
    title: '下一步',
    name: 'actionFlowNext',
    status: false,
    type: 'success'
  },
  {
    title: '同意',
    name: 'actionFlowAgree',
    status: false,
    type: 'success',
    params: { agree: '1' }
  },
  {
    title: '退回',
    name: 'actionFlowBack',
    status: false,
    type: 'warning'
  },
  {
    title: '驳回',
    name: 'actionFlowReject',
    status: false,
    type: 'warning'
  },
  {
    title: '否决',
    name: 'actionFlowStop',
    status: false,
    type: 'danger'
  },
  {
    title: '移交',
    name: 'actionFlowTransfer',
    status: false,
    type: 'primary'
  },
  {
    title: '续议',
    name: 'actionFlowFurther',
    status: false,
    type: 'primary'
  },
  {
    title: '不同意',
    name: 'actionForceTransfer',
    status: false,
    type: 'warning'
  },
  {
    title: '拒绝',
    name: 'actionFlowRefuse',
    status: false,
    type: 'danger'
  }
]
const FLOW_LIST = {
  kehuxinxixiugai: 'CustomerInfoUpdateForm', // 客户信息修改
  jituanchuangjian: 'GroupCustomerAddForm', // 集团新建
  jituanshanchu: 'GroupCustomerDeleteForm', // 集团删除
  jituanchengyuanweihu: 'GroupCustomerMemberForm', // 集团成员维护
  bumenneiyijiao: 'CustomerTransferForm', // 部门内移交
  bumenwaiyijiao: 'CustomerTransferForm', // 部门外移交
  lixiangshenpi: 'ProjectCommonFlowForm', // 项目立项
  xiangmushenpi_qita: 'ProjectCommonFlowForm', // 项目审批_其他
  xiangmushenpi_xw: 'ProjectCommonFlowForm', // 项目审批_小微
  xiangmubiangeng_xw: 'ProjectCommonFlowForm', // 项目变更更_小薇
  xiangmubiangeng_qita: 'ProjectCommonFlowForm', // 项目变更更_小薇
  kehupingji: 'CustomerRatingForm', // 客户评级
  kehupingjibiangeng: 'CustomerRatingForm', // 客户评级变更
  youhuililv: 'PricingCalculationForm', // 优惠利率
  hetongbiangeng_qita: 'ContractApprovalForm', // 合同变更_其他
  hetongbiangeng_xw: 'ContractApprovalForm', // 合同变更_小微
  hetongshenpi_qita: 'ContractApprovalForm', // 合同审批_其他
  hetongshenpi_xw: 'ContractApprovalForm', // 合同审批_小微
  fengxianjinbuzu: 'DepositCompleteForm', // 风险金补足
  baoxianjintuihuan: 'DepositReturnForm', // 保险保证金退还
  fengxianjintuihuan: 'DepositReturnForm', // 风险保证金退还
  fengxianjindikou: 'DepositDeductForm', // 风险金抵扣
  fengxianjinzhuijia: 'DepositRemarginForm', // 风险保证金金追加
  baoxianjinshouqu: 'DepositRemarginForm', // 保险保证金收取
  fangkuan_qita: 'LoanForm' // 放款_其他
}
const EXCLUDE_REQUEST_LIST = ['fangkuan_qita'] // 无需请求表单信息，由各个流程页面处理
import Quote from 'components/Quote'
import { deepAssign } from 'utils'
import { requestPost } from 'utils/fetch.js'
import DialogSuggestion from './components/DialogSuggestion.vue'
import DialogUserSelect from './components/DialogUserSelect.vue'
import Welcom from './components/Welcom.vue'
export default {
  components: {
    Quote,
    ProcessChart: () => import('./components/ProcessChart.vue'),
    ProcessDisposeDetail: () => import('./components/ProcessDisposeDetail.vue'),
    DialogSuggestion,
    DialogUserSelect,
    Welcom,
    CustomerInfoUpdateForm: () => import('views/process-form/flow-customer-info-update/index.vue'),
    GroupCustomerAddForm: () => import('views/process-form/flow-group-customer-add/index.vue'),
    GroupCustomerDeleteForm: () => import('views/process-form/flow-group-customer-delete/index.vue'),
    GroupCustomerMemberForm: () => import('views/process-form/flow-group-member/index.vue'),
    CustomerTransferForm: () => import('views/process-form/flow-customer-transfer/index.vue'),
    ProjectCommonFlowForm: () => import('views/process-form/flow-project-approval/index.vue'),
    CustomerRatingForm: () => import('views/process-form/flow-customer-rating/index.vue'),
    PricingCalculationForm: () => import('views/process-form/flow-pricing-calculation/index.vue'),
    ContractApprovalForm: () => import('views/process-form/flow-contract-approval/index.vue'),
    DepositCompleteForm: () => import('views/process-form/flow-deposit-complete/index.vue'),
    DepositReturnForm: () => import('views/process-form/flow-deposit-return/index.vue'),
    DepositDeductForm: () => import('views/process-form/flow-deposit-deduct/index.vue'),
    DepositRemarginForm: () => import('views/process-form/flow-deposit-remargin/index.vue'),
    LoanForm: () => import('views/process-form/flow-loan/index.vue')
  },
  data() {
    return {
      flowTitle: '',
      activeName: '',
      componentName: '',
      approveBtnList: [],
      flowInfo: null,
      flowNo: null,
      formData: null,
      urlParams: null,
      formConfigs: null,
      suggestDialogStatus: false,
      userSelectDialogStatus: false,
      flowInstance: null,
      action: '', // 当前审批操作类型
      userList: [] // 待选用户列表
    }
  },
  provide() {
    return {
      showUserSelectDialog: this._showUserSelectDialog
    }
  },
  watch: {
    $route: function(to, from) {
      // if (to.name !== 'CustomerDetail' || this.fullPath === to.fullPath) return
      this.$store.dispatch('tagsView/refreshCurrentTag', this)
    }
  },
  created() {
    this._initParams()
  },
  methods: {
    _initParams() {
      this.urlParams = Object.assign({}, this.$route.query)
      if (this.urlParams.id) {
        this.getProcessInfo()
      } else if (this.urlParams.taskId) {
        this.getHandledProcessInfo()
      } else {
        this._handleParmasError()
      }
    },
    getProcessInfo() {
      this.$store
        .dispatch('common/getProcessInfo', this.urlParams.id)
        .then(res => {
          try {
            res.customizeParam = res.customizeParam && JSON.parse(res.customizeParam)
          } catch (e) {
            res.customizeParam = null
          }
          this.flowInfo = Object.freeze(res)
          this.urlParams.processInstanceId = res.processInstanceId
          this.initUI(res)
          this.initApproveButton(res)
          this.getSubmitFormConfigs(res)
          this.getAttachmentCheckConfigs(res)
          this.getFlowFormData(res)
        })
        .catch(err => {
          console.log(err)
          this.$showToast('流程信息不存在')
        })
    },
    getHandledProcessInfo() {
      this.$store
        .dispatch('common/getHandledProcessInfo', this.urlParams.taskId)
        .then(res => {
          try {
            res.customizeParam = res.customizeParam && JSON.parse(res.customizeParam)
          } catch (e) {
            res.customizeParam = null
          }
          this.flowInfo = Object.freeze(res)
          this.urlParams.processInstanceId = res.processInstanceId
          this.initUI(res)
          this.getFlowFormData(res)
        })
        .catch(err => {
          console.log(err)
          this.$showToast('流程信息不存在')
        })
    },
    initUI(data) {
      // 设置表单始数据是否可修改
      // if (this.urlParams.line_id && this.urlParams.node_no == 1) {
      //   this.urlParams.canEdit = true
      // } else {
      //   this.urlParams.canEdit = false
      // }
      const [flowNo, flowTitle] = data.processInstanceName.split('-')
      this.flowNo = flowNo
      this.flowTitle = flowTitle
      this.componentName = this.activeName = FLOW_LIST[flowNo] || 'Welcom'
    },
    // 获取审批提交表单配置信息
    getSubmitFormConfigs(data) {
      const { componentsValue = {}, components = [] } = data.customizeParam || {}
      this.formConfigs = {
        componentsValue,
        components
      }
    },
    // 获取附件是否必传配置信息
    getAttachmentCheckConfigs(data) {
      if (!data.customizeParam) return
      const { checkAttachment, attachmentCheckUrl, attachmentCheckParam } = data.customizeParam
      if (checkAttachment === '1') {
        this.attachmentCheckConfigs = {
          url: attachmentCheckUrl,
          data: attachmentCheckParam
        }
      }
    },
    // 获取流程中表单数据
    getFlowFormData(data) {
      if (EXCLUDE_REQUEST_LIST.includes(this.flowNo) || !data.customizeParam || !data.customizeParam.param || !data.customizeParam.url) {
        this.formData = (data.customizeParam && data.customizeParam.param) || {}
        return
      }
      const params = data.customizeParam
      requestPost(`/${params.url}`, params.param, {
        showLoading: true
      })
        .then(res => {
          this.formData = Object.freeze(res.data || null)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // _setTagsViewTitle(title) {
    //   const route = Object.assign({}, this.$route, {
    //     title: `${title}[${this.urlParams.title}]`
    //   })
    //   this.$nextTick(() => {
    //     this.$store.dispatch('tagsView/updateVisitedView', route)
    //   })
    // },
    initApproveButton(data) {
      // 非待办
      // if (!this.urlParams.line_id) return
      // 0 下一步 1 同意 2 退回 3 驳回 4 否决 5 移交 6 续议 7 不同意 8 拒绝
      BUTTON_LIST[0].status = data.customizeParam && data.customizeParam.next == 1
      BUTTON_LIST[1].status = data.customizeParam && data.customizeParam.agree == 1
      BUTTON_LIST[2].status = data.rollbackStrategy === 'rollback2last'
      BUTTON_LIST[3].status = data.rejectStrategy === 'submitInOrder'
      BUTTON_LIST[4].status = data.customizeParam && data.customizeParam.stop == 1
      this.approveBtnList = BUTTON_LIST.filter(item => item.status)
    },
    async handleBtnClick(action, params = {}) {
      if (!this.flowInstance) {
        return this.$showToast('流程初始化失败，请刷新页面重试！')
      }
      this.action = action
      const ret = await this.checkAttachmentNecessary()
      if (ret) return
      this.actionParams = params
      // 还原被修改的参数
      if (this.flowInstance.originParams) {
        this.flowInstance.params = deepAssign({}, this.flowInstance.originParams)
      }
      this.flowInstance
        .beforeShowSuggestDialog(action)
        .then(() => {
          this.suggestDialogStatus = true
        })
        .catch(() => {})
    },
    _handleParmasError() {
      this.$showToast('非法参数！')
      this.$nextTick(() => {
        this.$store.dispatch('tagsView/closeCurrentTag', this.$route).then(() => {
          this.$router.push(this.$route.meta.from)
        })
      })
    },
    // 检查是否有必传文件
    checkAttachmentNecessary() {
      if (!this.attachmentCheckConfigs || !['actionFlowNext', 'actionFlowAgree'].includes(this.action)) return false
      return requestPost(`/${this.attachmentCheckConfigs.url}`, this.attachmentCheckConfigs.data, {
        showLoading: true
      })
        .then(res => {
          if (res.data && res.data.message !== '') {
            this.$showToast(res.data.message, 'warning')
            return true
          } else {
            return false
          }
        })
        .catch(err => {
          console.log(err)
          return true
        })
    },
    handleSuggestionDialogConfirm(obj) {
      // // 填写审批意见后往下开始审批操作
      // Object.keys(obj).forEach(key => {
      //   this.flowInstance[key] = obj[key]
      // })
      this.flowInstance.extraParams = { ...obj, ...this.actionParams }
      const action = this.action === 'actionFlowNext' ? 'actionFlowAgree' : this.action
      this.flowInstance[action]()
    },
    _showUserSelectDialog(userList) {
      this.userList = userList
      setTimeout(() => {
        this.userSelectDialogStatus = true
      }, 100)
    },
    handleUserSelectDialogConfirm(selectedUserList) {
      // 选择下一步操作人后，根据类型进入不同的分支
      this.flowInstance.params.accepters = selectedUserList
      if (['actionFlowNext', 'actionFlowAgree'].includes(this.action)) {
        this.flowInstance._actionFlowAgreeSubmit()
      } else if (this.action === 'actionFlowTransfer') {
        this.flowInstance._actionFlowAgreeSubmit()
      }
    }
  }
}
</script>

<style lang='scss'>
.process-approval-page {
  overflow: hidden;
  .el-tabs-flow {
    .el-tabs__header {
      margin: 0;
    }
    .el-tabs__nav-wrap::after {
      display: none;
    }
    .el-tabs__active-bar {
      bottom: 7px;
    }
  }
  .el-tabs__content {
    display: none;
  }
  .el-button + .el-button {
    margin-left: 5px;
  }
  .comp-container {
    overflow: hidden;
    flex: 1;
    background: #ffffff;
  }
}
</style>
