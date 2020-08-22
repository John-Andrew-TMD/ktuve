<!-- 项目概览 -->
<!-- 项目概览 -->
<template>
  <div class="cust-baseinfo-comp">
    <!-- <el-collapse v-model="activeNames"> -->
    <!-- <el-collapse-item title="复议信息" :name="callapseNames[5]" v-if="showReconsider">
        <reconsider-info :route-params="routeParams" :form-data.sync="reconsiderData"></reconsider-info>
      </el-collapse-item>
      <el-collapse-item title="变更信息" :name="callapseNames[6]" v-if="showChange">
        <change-info :route-params="routeParams" :form-data.sync="changeData"></change-info>
    </el-collapse-item>-->
    <!-- <el-collapse-item title="项目基本信息" :name="callapseNames[0]"> -->
    <!-- <template v-if = "projectInfo.projectStatus">

    </template> -->
    <base-info :route-params="routeParams" :project-info="projectInfo" />
    <div class="divide-line" />
    <enterprise-info
      :route-params="routeParams"
      :project-info="projectInfo"
      :is-refresh="isRefresh"
    />
    <div class="divide-line" />
    <quota-info
      :route-params="routeParams"
      :project-info="projectInfo"
      :is-refresh="isRefresh"
    />
    <div class="divide-line" />
    <guarantor-info :route-params="routeParams" :project-info="projectInfo" />
    <!-- </el-collapse-item> -->
    <!-- <el-collapse-item title="融资租赁方案 （此部分信息由“报价方案”页面反显，若需调整，请在报价方案页面编辑）" :name="callapseNames[1]">
        <lease-case :route-params="routeParams"></lease-case>
      </el-collapse-item>
      <el-collapse-item
        title="供应商信息"
        :name="callapseNames[2]"
        v-if="this.routeParams.business_type == 1"
      >
        <supplier-table :route-params="routeParams"></supplier-table>
      </el-collapse-item>
      <el-collapse-item
        title="银行信息"
        :name="callapseNames[3]"
        v-if="this.routeParams.business_type == 4"
      >
        <bank-table :route-params="routeParams"></bank-table>
      </el-collapse-item>
      <el-collapse-item title="拟承租企业基本信息" :name="callapseNames[4]">
        <enterprise-info :route-params="routeParams" :is-refresh="isRefresh"></enterprise-info>
    </el-collapse-item>-->
    <!-- </el-collapse> -->
  </div>
</template>

<script>
import BaseInfo from './project-overview-base'
import LeaseCase from './project-overview-case'
import SupplierTable from './project-overview-supplier'
import BankTable from './project-overview-bank'
import EnterpriseInfo from './project-overview-enterprise'
import ChangeInfo from './project-overview-change'
import ReconsiderInfo from './project-overview-reconsider'
import quotaInfo from './project-overview-quota'

import GuarantorInfo from './guarantor'
const COLLAPSE_NAME = ['0', '1', '2', '3', '4', '5', '6']
export default {
  components: {
    BaseInfo,
    LeaseCase,
    SupplierTable,
    BankTable,
    EnterpriseInfo,
    ChangeInfo,
    ReconsiderInfo,
    GuarantorInfo,
    quotaInfo
  },
  props: ['routeParams', 'projectInfo'],
  data() {
    return {
      callapseNames: COLLAPSE_NAME,
      activeNames: COLLAPSE_NAME,
      showChange: false,
      changeData: {},
      showReconsider: false,
      reconsiderData: {},
      isRefresh: false // 是否刷新
    }
  },
  created() {
    this.getApproalInfo()
  },
  methods: {
    getApproalInfo() {
      const { project_status, id } = this.routeParams
      // if (project_status < 9) return
      const params = {
        id,
        action: 'Q'
      }
      // this.$promiseRequest([
      //   { code: '201830', data: params },
      //   { code: '201831', data: params }
      // ]).then(res => {
      //   if (res.flag == 1) {
      //     // 变更信息
      //     const changeData = res.data[0]
      //     if (changeData.record && changeData.record.length) {
      //       this.showChange = true
      //       this.changeData = changeData.record[0]
      //       if (this.changeData['is_show'] !== '1') {
      //         this.activeNames.splice(this.callapseNames[6], 1)
      //       }
      //     } else {
      //       this.showChange = false
      //     }
      //     // 复议信息
      //     const reconsiderData = res.data[1]
      //     if (reconsiderData.record && reconsiderData.record.length) {
      //       this.showReconsider = true
      //       this.reconsiderData = reconsiderData.record[0]
      //     } else {
      //       this.showReconsider = false
      //     }
      //   }
      // })
    }
  }
}
</script>

<style lang="scss">
.cust-baseinfo-comp {
  .content-body {
    box-sizing: border-box;
    max-width: 1020px;
    padding: 0 10px 10px;
  }
  .panel-wrapper {
    position: relative;
    max-width: 1000px;

    .panel-tools {
      position: absolute;
      top: 0;
      right: 0;
      line-height: 36px;
    }
  }
  .divide-line {
    height: 10px;
    border-bottom: 5px solid #FFFFFF;
    background: #F1F4F5;
  }
  .el-form {
    .el-select, .el-input, .el-cascader {
      width: 100%;
    }
  }
}
.project-overview-page {
  .el-collapse-item {
    > div {
      &:first-child {
        padding: 0 15px 0 25px;
        border-bottom: 1px solid #F1F4F5;
        background-color: #FFFFFF;
        .el-collapse-item__header {
          position: relative;
          height: 40px;
          font-weight: bold;
          line-height: 40px;
          color: #5C6478;
          border-bottom: 0;
          &::before {
            position: absolute;
            top: 50%;
            left: -10px;
            width: 3px;
            height: 17px;
            content: '';
            transform: translateY(-50%);
            background: #5595FF;
          }
        }
      }
    }
    .btn-sync {
      margin: 10px 10px 0 0;
      text-align: right;
      .el-button {
        width: 121px;
      }
    }
  }
}

</style>

