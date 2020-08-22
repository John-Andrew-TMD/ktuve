<template>
  <div class="app-content-wrapper flow-customer-info-update-form">
    <el-tabs v-model="componentName" class="tabs-top">
      <el-tab-pane
        v-for="(item,index) in tabsList"
        :key="index"
        :label="item.tabsName"
        :name="item.compName"
        :lazy="true"
      />
    </el-tabs>
    <el-button
      v-if="isCompareBtnVisible"
      style="position: absolute;top: 6px;right: 10px"
      type="primary"
      size="mini"
      @click="handleCompareClick"
    >新旧数据对比</el-button>
    <div class="component-container">
      <keep-alive include="CustBaseInfo">
        <component :is="componentName" v-if="custInfo" :route-params="routeParams" />
      </keep-alive>
    </div>
    <comp-base-info-compare-dialog v-if="compareDialogStatus" :dialog-status.sync="compareDialogStatus" :route-params="routeParams" />
  </div>
</template>

<script>
import ClassFlow from 'utils/class-flow.js'
import { getCustomerById } from 'api/customer-module/api-customer-detail.js'
import { isEmptyObj } from 'utils'
const TAB_LIST = [
  { tabsName: '基本信息', compName: 'CustBaseInfo' },
  { tabsName: '关联关系', compName: 'CustAssociation' }
]
export default {
  components: {
    CustBaseInfo: () => import('./components/CustBaseInfo.vue'),
    CustAssociation: () => import('views/customer-mng/customer-detail/components/CustAssociation/index.vue'),
    CompBaseInfoCompareDialog: () => import('views/customer-mng/customer-detail/components/CustInfoCompareDialog/index.vue')

  },
  props: {
    flowInfo: {
      type: Object,
      default: () => ({})
    },
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tabsList: [],
      componentName: 'CustBaseInfo',
      isCompareBtnVisible: false,
      compareDialogStatus: false,
      custInfo: null
    }
  },
  provide() {
    return {
      getCustInfoField: this.getCustInfoField
    }
  },
  created() {
    this.initUI()
    this.generateInstance()
  },
  methods: {
    initUI() {
      const content = this.formData.content
      // 1 机构信息 2 银行信息 3 开票信息 4 股东信息 5 关联信息
      if (!content.includes('5')) {
        // 不显示关联关系页签
        this.tabsList = TAB_LIST.filter(item => item.compName !== 'CustAssociation')
      } else {
        this.tabsList = Object.freeze(TAB_LIST)
      }
      this.routeParams = {
        id: this.formData.approvalStatus == 1 ? this.formData.custId : this.formData.custBackupId,
        custCategory: '1',
        baseInfoModule: content,
        globalCanEdit: this.flowInfo.startFlag
      }
      this.getFormData()
    },
    async getFormData() {
      getCustomerById(
        {
          id: this.routeParams.id
        },
        { showLoading: true }
      )
        .then(res => {
          const data = res.data
          if (data && !isEmptyObj(data.newCrm)) {
            if (!isEmptyObj(data.oldCrm)) {
              this.isCompareBtnVisible = true
            }
            this.custInfo = Object.freeze(data.newCrm)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getCustInfoField(field = '') {
      if (field === 'ALL') return this.custInfo || {}
      return this.custInfo && this.custInfo[field]
    },
    handleCompareClick() {
      this.compareDialogStatus = true
    },
    generateInstance() {
      const flowInstance = new ClassFlow(this.flowInfo, this)
      this.$emit('input', flowInstance)
    }
  }
}
</script>

<style lang='scss' scoped>
.flow-customer-info-update-form {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  padding: 0;

  .tabs-top /deep/  {
    height: 40px;
    padding: 0 10px;
  }

  .component-container {
    overflow-y: auto;
    flex: 1;
    padding-top: 10px;
  }
}

</style>
