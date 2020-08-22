<template>
  <div id="dialogHook" class="app-content app-content--quote contract-detail-page">
    <quote icon="contract" :text="`合同详情（项目名称：${contractInfo && contractInfo.projectName || ''}）`">
      <el-tabs v-model="componentName" class="tabs-top">
        <el-tab-pane
          v-for="(item,index) in tabsList"
          :key="index"
          :label="item.tabsName"
          :name="item.compName"
          :lazy="true"
        />
      </el-tabs>
    </quote>
    <div class="app-content-wrapper">
      <div class="component-container">
        <keep-alive include="ContractBaseInfo">
          <component :is="componentName" v-if="contractInfo" :contract-info="contractInfo" :route-params="routeParams" />
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
import Quote from 'components/Quote/index'
import { getContracInfoById } from 'api/contract-module/api-contract-mng.js'
const TAB_LIST = [
  { tabsName: '合同列表', compName: 'ContractBaseInfo' },
  { tabsName: '审批详情', compName: 'ApprovalDetail' },
  { tabsName: '附件汇总', compName: 'AttachCollect' }
]
export default {
  components: {
    Quote,
    ContractBaseInfo: () => import('./ContractBaseInfo/index.vue'),
    ApprovalDetail: () => import('./ApprovalDetail/index.vue'),
    AttachCollect: () => import('./AttachCollect/index.vue')
  },
  provide() {
    return {
      getContractInfoField: this.getContractInfoField,
      getEditStatus: this.getEditStatus
    }
  },
  props: {
    routeParams: {
      type: Object,
      default: () => ({})
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tabsList: TAB_LIST,
      componentName: 'ContractBaseInfo',
      contractInfo: null,
      isInFlow: false
    }
  },
  created() {
    this._getContractInfoById()
  },
  methods: {
    _getContractInfoById() {
      getContracInfoById(
        {
          id: this.routeParams.id
        },
        { showLoading: true }
      )
        .then(res => {
          if (!res.data) return
          this.contractInfo = Object.freeze(res.data)
        	this.$emit('set-tags-view-title', res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getContractInfoField(field) {
      return this.contractInfo && this.contractInfo[field] || ''
    },
    getEditStatus() {
      return this.canEdit && !this.isInFlow
    },
    setIsIInFlow(status = true) {
      if (this.routeParams.approvalId) {
        this.isInFlow = false
        return
      }
      this.isInFlow = status
    }
  }
}
</script>

<style lang="scss">
.contract-detail-page {
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
  .el-tabs__nav-scroll {
    padding: 0 10px;
  }
  .tabs-top {
    margin: 0 auto 0 100px;
    .el-tabs__header {
      margin-bottom: 0px;
    }
    .el-tabs__nav-wrap::after {
      display: none;
    }
    .el-tabs__active-bar {
      bottom: 7px;
    }
    .el-tabs__content {
      display: none;
    }
  }
  .component-container {
    //overflow-y: auto;
    flex: 1;
    height: 0;
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
}

</style>
