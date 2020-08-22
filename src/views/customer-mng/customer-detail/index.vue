<template>
  <div id="dialogHook" class="app-content app-content--quote customer-detail-page">
    <quote icon="customer" :text="custInfo && custInfo.custName || ''">
      <template #left>
        <div v-if="!!custInfo" class="text">
          <span>（编号: {{ custInfo.custNo }}</span>
          <span class="ml-10">业务经理: {{ custInfo.businessManage }}）</span>
          <span class="status">{{ custInfo.custCategory | filterDictValue('10008') }}</span>
        </div>
      </template>
      <el-switch
        v-if="isOrg"
        v-model="whetherFocus"
        size="mini"
        style="margin: 0 10px 0 auto"
        inactive-text="是否关注客户"
        @change="handleFocusChange"
      />
      <el-button
        v-if="isCompareBtnVisible"
        type="primary"
        size="mini"
        @click="handleCompareClick"
      >新旧数据对比</el-button>
      <el-button v-if="isOrg" size="mini" :disabled="!this.routeParams.globalCanEdit" type="primary" @click="handleApproveClick">发起审批</el-button>
    </quote>
    <div class="app-content-wrapper">
      <el-tabs v-model="componentName" class="tabs-top">
        <el-tab-pane
          v-for="(item,index) in tabsList"
          :key="index"
          :label="item.tabsName"
          :name="item.compName"
          :lazy="true"
        />
      </el-tabs>
      <div class="component-container">
        <keep-alive include="CustBaseInfo">
          <component :is="componentName" v-if="custInfo" :route-params="routeParams" />
        </keep-alive>
      </div>
    </div>
    <cust-approval-dialog v-if="approvalDialogStatus" :dialog-status.sync="approvalDialogStatus" @dialog-confirm="handleApprovalDialogConfirm" />
    <comp-base-info-compare-dialog v-if="compareDialogStatus" :dialog-status.sync="compareDialogStatus" :route-params="routeParams" />
  </div>
</template>
<script>
import Quote from 'components/Quote/index'
import { isEmptyObj } from 'utils'
import { followUser, unfollowUser, customerInfoApprove, getCustomerById } from 'api/customer-module/api-customer-detail.js'
const TAB_LIST = [
  { tabsName: '基本信息', compName: 'CustBaseInfo' },
  { tabsName: '关联关系', compName: 'CustAssociation' },
  { tabsName: '财务情况', compName: 'CustFinance' },
  { tabsName: '额度信息', compName: 'CustQuota' },
  { tabsName: '客户评级', compName: 'CustRating' },
  { tabsName: '反洗钱评级', compName: 'CustMoneyLaunderingRating' },
  { tabsName: '客户跟进', compName: 'CustFollowUp' },
  { tabsName: '历史项目', compName: 'CustHistory' },
  { tabsName: '业务经理', compName: 'CustManager' },
  { tabsName: '资料附件', compName: 'CustAttachment' },
  { tabsName: '动态信息', compName: 'CustActiveNews' },
  { tabsName: '审批详情', compName: 'CustApprovalDetail' }
]
export default {
  name: 'CustomerDetail',
  components: {
    Quote,
    CustBaseInfo: () => import('./components/CustBaseInfo/index.vue'),
    CustAssociation: () => import('./components/CustAssociation/index.vue'),
    CustFinance: () => import('./components/CustFinance/index.vue'),
    CustQuota: () => import('./components/CustQuota.vue'),
    CustRating: () => import('views/customer-mng/customer-rating-mng/components/ModelDetail.vue'),
    CustMoneyLaunderingRating: () => import('./components/CustMoneyLaunderingRating.vue'),
    CustFollowUp: () => import('./components/CustFollowUp/index.vue'),
    CustHistory: () => import('./components/CustHistory.vue'),
    CustManager: () => import('./components/CustManager.vue'),
    CustAttachment: () => import('./components/CustAttachment.vue'),
    CustActiveNews: () => import('./components/CustActiveNews.vue'),
    CustApprovalDetail: () => import('./components/CustApprovalDetail.vue'),
    CustApprovalDialog: () => import('./components/CustApprovalDialog.vue'),
    CompBaseInfoCompareDialog: () => import('./components/CustInfoCompareDialog/index.vue')
  },
  provide() {
    return {
      setTagsViewTitleAndHeaderInfo: this.setTagsViewTitleAndHeaderInfo,
      getCustInfoField: this.getCustInfoField
    }
  },
  data() {
    return {
      custInfo: null,
      tabsList: [],
      componentName: this.$route.query.active_tab || 'CustBaseInfo',
      whetherFocus: false,
      fullPath: '',
      routeParams: {},
      isOrg: false,
      isCompareBtnVisible: false,
      approvalDialogStatus: false,
      compareDialogStatus: false
    }
  },
  computed: {
    // 是否是机构客户
    // isOrg() {
    //   return this.routeParams.custCategory == 1
    // }
  },
  watch: {
    $route: function(to, from) {
      if (to.name !== 'CustomerDetail' || this.fullPath === to.fullPath) return
      this.$store.dispatch('tagsView/refreshCurrentTag', this)
    }
  },
  created() {
    this.initUI()
  },
  methods: {
    initUI() {
      const routeParams = { ...this.$route.query }
      this.routeParams = routeParams
      this.fullPath = this.$route.fullPath
      // this.initTabs()
      this.getFormData()
    },
    initTabs() {
      // custCategory机构类型（1机构  2个人）
      if (!this.isOrg) {
        const compNames = [
          'CustBaseInfo',
          'CustAssociation',
          'CustFollowUp',
          'CustHistory',
          'CustManager',
          'CustAttachment'
        ]
        this.tabsList = TAB_LIST.filter(item => compNames.includes(item.compName))
      } else {
        this.tabsList = Object.freeze(TAB_LIST)
      }
    },
    async getFormData() {
      getCustomerById(
        {
          id: this.routeParams.id
        },
        { showLoading: true }
      )
        .then(res => {
          let data = res.data
          if (data && !isEmptyObj(data.newCrm)) {
            this.isOrg = data.newCrm.custCategory == 1
            if (this.isOrg && !isEmptyObj(data.oldCrm)) {
              this.isCompareBtnVisible = true
            }
            data = data.newCrm
            this.routeParams.globalCanEdit = true
            this.whetherFocus = !!+data.followFlag
            this.routeParams.custCategory = data.custCategory
            this.custInfo = data
            this.initTabs()
            this.setTagsViewTitleAndHeaderInfo(data)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    setTagsViewTitleAndHeaderInfo(data, isUpdate = false) {
      if (isUpdate) {
        // 基本信息修改时，需更新源数据
        this.custInfo.custName = data.custName // 财务数据详情使用
        this.custInfo.enterpriseType = data.enterpriseType // 财务情况页签-上传弹框使用
      }
      this.routeParams.custName = data.custName
      const route = Object.assign({}, this.$route, { title: data.custName })
      this.$nextTick(() => {
        this.$store.dispatch('tagsView/updateVisitedView', route)
      })
    },
    getCustInfoField(field = '') {
      if (field === 'ALL') return this.custInfo || {}
      return this.custInfo && this.custInfo[field]
    },
    handleFocusChange(val) {
      if (val) {
        followUser(
          {
            id: this.$route.query.id
          },
          { showLoading: true }
        )
          .then(res => {
            this.$showToast('关注成功！', 'success')
          })
          .catch(err => {
            this.whetherFocus = !this.whetherFocus
            console.log(err)
          })
      } else {
        unfollowUser({
          id: this.$route.query.id
        })
          .then(res => {
            this.$showToast('取消关注成功！', 'success')
          })
          .catch(err => {
            this.whetherFocus = !this.whetherFocus
            console.log(err)
          })
      }
    },
    handleApproveClick() {
      this.approvalDialogStatus = true
    },
    handleApprovalDialogConfirm(arr = []) {
      if (!arr.length) return this.$showToast('发起审批的客户信息不能为空！')
      customerInfoApprove({
        content: arr.join(','),
        custId: this.routeParams.id
      }, { showLoading: true }).then(res => {
        this.$showToast('发起成功！', 'success')
      }).catch(err => {
        console.log(err)
      })
    },
    handleCompareClick() {
      this.compareDialogStatus = true
    }
  }
}
</script>

<style lang="scss">
.customer-detail-page {
  overflow: hidden;

  .app-content-wrapper {
    display: flex;
    flex-direction: column;
    height: 0;
    padding: 0;
  }
  .form-create {
    .el-row {
      display: flex;
      flex-wrap: wrap;
    }
  }
  // .el-tabs__nav-scroll {
  //   padding: 0 10px;
  // }
  // .main-title {
  //   .text {
  //     display: flex;
  //     align-items: center;
  //   }
  //   .status {
  //     height: 22px;
  //     padding: 0 10px;
  //     font-size: 12px;
  //     line-height: 22px;
  //     color: #3399CC;
  //     border: 1px dashed #99CCE6;
  //     border-radius: 3px;
  //     background: #F1FCFC;
  //   }
  // }
  .tabs-top {
    height: 40px;
    padding: 0 10px;
    .el-tabs__header {
      margin-bottom: 0px;
    }
    .el-tabs__content {
      display: none;
    }
  }
  .component-container {
    overflow-y: auto;
    flex: 1;
    padding-top: 10px;
  }
  .status {
    display: inline-block;
    padding: 0 10px;
    font-size: 12px;
    line-height: 22px;
    color: #3399CC !important;
    border: 1px dashed #99CCE6;
    border-radius: 3px;
    background: #F1FCFC;
  }
  .no-data {
    padding-top: 20px;
    .no-data-top {
      height: 160px;
      background: url('~@/assets/images/no-data-img.png') no-repeat center 0;
    }
    .no-data-text {
      padding: 20px 0;
      text-align: center;
    }
  }
}

</style>
