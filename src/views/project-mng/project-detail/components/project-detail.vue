<template>
  <div class="common-project-detail app-content-wrapper" v-if="projectInfo">
    <el-tabs v-model="activeName" @tab-click="handleTabClick" class="tabs-top">
      <el-tab-pane label="项目信息" name="ProjectOverview" />
      <el-tab-pane label="报价方案" name="QuotationInfo" />
      <el-tab-pane label="租赁物" name="SubjectMatter" />
      <el-tab-pane label="抵质押物信息" name="MortgageCollateral" />
      <el-tab-pane label="资料附件" name="Attachment" />
      <el-tab-pane label="审批详情" name="ApprovalMent" />
    </el-tabs>
    <div class="component-container">
      <transition name="fade" mode="out-in">
        <keep-alive include="ProjectOverview">
          <component
            :is="componentName"
            :route-params="urlParams"
            :project-info="projectInfo"
            :flow-info="flowInfo"
          />
        </keep-alive>
      </transition>
    </div>
  </div>
</template>
<script>
import Quote from 'components/Quote'
import ProjectOverview from './components/project-overview'
import { projectInfoId } from 'api/project-module/api-project-mng.js'
// 项目状态
const PROJECT_STATUS = {
  found_init: '0', // 待立项
  found_ing: '1', // 立项审批中
  found_nopass: '2', // 立项不通过
  approve_init: '3', // 待审批
  approve_ing: '4', // 项目审批中
  approve_nopass: '5', // 项目审批不通过
  approve_pass: '6', // 项目审批通过
  change_init: '7', // 项目变更未提交
  change_ing: '8', // 项目变更审批中
  contract_ing: '9', // 合同中
  putin_ing: '10', // 投放中
  fundsreturn_ing: '11', // 资金回笼中
  complete_pass: '12' // 项目完结
}
export default {
  components: {
    Quote,
    ProjectOverview,
    QuotationInfo: () => import('./components/quotation-info'),
    SubjectMatter: () => import('./components/subject-matter'),
    MortgageCollateral: () => import('./components/MortgageCollateral'),
    Guarantor: () => import('./components/guarantor'),
    Attachment: () => import('./components/attachment'),
    ApprovalMent: () => import('./components/approval')
  },
  // props: ['routeParams', 'flowInfo'],
  props: {
    routeParams: {
      type: Object,
      default: () => ({})
    },
    flowInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      activeName: 'ProjectOverview',
      componentName: 'ProjectOverview',
      projectInfo: null,
      urlParams: null
    }
  },
  // inject: ['initPageOperationRight'],
  created() {
    this.init()
  },
  methods: {
    init() {
      this.urlParams = Object.assign({}, this.routeParams)
      this.getProjectInfo()
    },
    getProjectInfo() {
      projectInfoId(
        {
          id: this.routeParams.id
        },
        { showLoading: true }
      )
        .then(res => {
          if (!res.data) return
          const oData = res.data
          this.initPageOperationRight(oData.projectStatus)
          // this.routeParams.project_status = oData.projectStatus
          // this.routeParams.project_id = oData.projectId
          this.projectInfo = oData
          this.$emit('update:projectData', oData)
          // this.projectName = this.projectInfo.projectName
          // this.projectStatus = this.projectInfo.projectStatus
          // const route = Object.assign({}, this.$route, {
          //   title: oData.projectName
          // })
          // this.$store.dispatch('tagsView/updateVisitedView', route)
        })
        .catch(err => {
          console.log(err)
        })
    },
    initPageOperationRight(status) {
      if (this.urlParams.canEdit) {
        return
      }
      if ([PROJECT_STATUS.found_init, PROJECT_STATUS.approve_init, PROJECT_STATUS.change_init].includes(status)) {
        this.urlParams.canEdit = true
      } else {
        this.urlParams.canEdit = false
      }
    },
    handleTabClick(tab) {
      this.componentName = tab.name
    }
  }
}
</script>

<style lang='scss'>
.common-project-detail {
  &.app-content-wrapper {
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
  .el-tabs__header {
    margin: 0 0 0 !important;
  }
  .component-container {
    overflow-y: auto;
    flex: 1;
    padding-top: 10px;
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
