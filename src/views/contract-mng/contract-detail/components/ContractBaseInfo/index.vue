<template>
  <div class="comp-contract-base-info" :class="{'fold-contract-page':isFold}">
    <div class="contract-list-wrapper">
      <div class="left">
        <contract-left
          ref="contractLeftDom"
          :route-params="routeParams"
          @handleLeftClick="handleLeftClick"
          @menu-click="showContractDialog"
        />
      </div>
      <div class="right">
        <div class="arrow-wrapper">
          <i
            class="icon-arrow"
            :class="!isFold?'el-icon-d-arrow-left':'el-icon-d-arrow-right'"
            :title="isFold?'收起':'展开'"
            @click="handleToggle"
          />
        </div>
        <contract-right
          ref="contractInfo"
          v-model="accountingEntity"
          :row-data="rowData"
          :route-params="routeParams"
        />
      </div>
    </div>
    <contract-dialog
      v-if="dialogStatus"
      :dialog-status.sync="dialogStatus"
      :contract-item="contractItem"
      :route-params="routeParams"
      :row-data="rowData"
      @dialog-confirm="handleDialogConfirm"
    />
    <!-- <contract-remark-dialog
      v-if="dialogStatusRemark"
      :dialogStatusRemark.sync="dialogStatusRemark"
      :contractNos="contractNos"
      :tips="dialogTips"
      @dialog-confirm="handleApproveComfirm"
    ></contract-remark-dialog>-->
  </div>
</template>

<script>
// import { contractApproval, approvePostHandle } from './js/contract-approval.js'
import { customerList } from 'api/customer-module/api-customer-mng.js'
import { queryDictValue } from 'utils'

export default {
  components: {
    ContractLeft: () => import('./components/ContractLeft/index.vue'),
    ContractRight: () => import('./components/ContractRight'),
    ContractDialog: () => import('./components/ContractDialog')
    // ContractRemarkDialog: () => import('./contract-remark-dialog.vue')
  },
  props: {
    routeParams: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      dialogStatus: false,
      isFold: false, // 是否折叠
      rowData: null,
      contractItem: {}
    }
  },
  provide() {
    return {
      showContractDialog: this.showContractDialog,
      refreshContractLeft: this.refreshContractLeft
    }
  },
  // watch: {
  //   routeParams: {
  //     handler(routeParams) {
  //       this.routeParams = routeParams
  //     },
  //     immediate: true
  //   }
  // },
  methods: {
    handleLeftClick(rowData) {
      if(!rowData)return
      if (['0', '4'].includes(rowData.contractState)) {
        this.$parent.setIsIInFlow(false)
      } else {
        this.$parent.setIsIInFlow(true)
      }
      this.rowData = rowData
    },
    // 显示合同新增or修改对话框
    showContractDialog(data) {
      console.log(data)
      this.contractItem = data
      this.dialogStatus = true
    },
    handleToggle() {
      this.isFold = !this.isFold
      this.$emit('click-arrow', this.isFold)
    },
    refreshContractLeft() {
      const dom = this.$refs.contractLeftDom
      dom.refreshTable()
    }
  }
}
</script>

<style lang='scss' scoped>
.comp-contract-base-info {
  position: relative;
  height: 100%;
  background: #FFFFFF;
  .contract-list-wrapper {
    display: flex;
    height: 100%;
  }
  .panel-title {
    margin-bottom: 15px;
    padding-left: 10px;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    border-left: 3px solid #5595FF;
  }

  .left {
    overflow: auto;
    box-sizing: border-box;
    width: 560px;
    transition: width .3s;
    border-right: 4px solid #F1F4F5;
    &::-webkit-scrollbar-track-piece {
      background-color: #FFFFFF;
    }
  }
  .arrow-wrapper {
    position: absolute;
    top: 50%;
    left: 550px;
    transition: left .3s;
    transform: translateY(-50%);
    .icon-arrow {
      height: 28px;
      line-height: 28px;
      cursor: default;
      vertical-align: middle;
    }
  }
  .right {
    overflow-y: auto;
    flex: 1;
    box-sizing: border-box;
    margin-left: 7px;
    background: #FFFFFF;
    &::-webkit-scrollbar-track-piece {
      background-color: #FFFFFF;
    }
  }
  &.fold-contract-page {
    .left {
      width: 0;
      opacity: 0;
    }
    .arrow-wrapper {
      left: 0;
    }
  }
}

</style>
