<template>
  <transition name="fade">
    <div v-if="rowData" id="contract-right" class="comp-right-area">
      <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick" v-if="showTabs">
        <el-tab-pane
          :label="item.version_title"
          :name="item.id+'_'+index"
          v-for="(item,index) in tabList"
          :key="index"
        ></el-tab-pane>
      </el-tabs>
      <header class="header" v-if=" !!contracTypeData&&contractRowInfo.id">
        {{contracTypeData.name}}
        <span  v-if="this.canEdit&&isHistory" id="sign_time" @click="handleSignClick">
          签署日期：{{ dateFormatBySeparator(contractRowInfo.signingTime) || '(点击编辑)' }}
          <i
            class="el-icon-edit"
          ></i>
        </span>
        <template v-else>
           <span class = "can-edit" id="sign_time" v-if = "contractRowInfo.signingTime" >
            签署日期：{{ dateFormatBySeparator(contractRowInfo.signingTime) }}
          </span>
        </template>
        <sign-diaLog
          v-if="dialogStatus"
          ref="signDialog"
          :dialogStatus="dialogStatus"
          @handleDialogClosed="handleDialogClosed"
          @getSigningTime="getSigningTime"
          :contractRowInfo="contractRowInfo"
        ></sign-diaLog>
      </header>
      <section class="main-body" v-if="!!contracTypeData&&contractRowInfo.id">
        <div v-if="contractRowInfo.contractType!='25'" class="panel online-edit-panel">
          <online-edit ref="onlineEdit" :contractRowInfo="contractRowInfo" :can-edit="canEdit" ></online-edit>
        </div>
        <div class="panel">
          <contract-elements
            :contracTypeData="contracTypeData"
            :contractRowInfo="contractRowInfo"
            :rowData="rowData"
			:can-edit="canEdit"
          ></contract-elements>
        </div>
        <!-- v-if="rowData.mainContract" -->
        <div class="panel" v-if="+rowData.contractType<=4">
          <transaction-elements
            ref="quotation"
            :rowData="rowData"
            :routeParams="routeParams"
			:can-edit="canEdit"
            @initUI="initUI"
            :contractRowInfo="contractRowInfo"
          ></transaction-elements>
        </div>
        <div class="panel-table-create" v-if="+rowData.contractType<=4">
          <subject-matter
            v-if = "contractRowInfo.id"
            :rowData="rowData"
            :routeParams="routeParams"
            :contractRowInfo="contractRowInfo"
			:can-edit="canEdit"
          ></subject-matter>
        </div>
        <div
          class="panel-table-create"
          v-if="+rowData.contractType>=12 && +rowData.contractType <= 19"
        >
          <mortgage-collateral 
            v-if = "contractRowInfo.id"
            :rowData="rowData" 
            :routeParams="routeParams"
            :contractRowInfo="contractRowInfo"
			:can-edit="canEdit"
          ></mortgage-collateral>
        </div>
        <div class="panel-table-create">
          <attachment
            ref="attachment"
            :contractRowInfo="contractRowInfo"
            :routeParams="routeParams"
			:can-edit="canEdit"
          ></attachment>
        </div>
      </section>
    </div>
    <!-- <div v-else class="comp-right-area">
      <section class="main-body">
        <div class="panel">
          <table border="0" cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td>
                  <div class="no-data">
                    <div class="no-data-top" />
                    <p class="no-data-text">暂无合同</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>-->
  </transition>
</template>

<script>
import { IContractBQueryById } from "api/contract-module/api-contract-mng.js";
import DROP_MENUS from "../js/drop-menus.js";
import {
  getTargetData,
  dateFormatBySeparator,
  isEmptyObj,
  deepAssign
} from "utils";
import  ContractRightMixins  from "./components/mixins/ContractRightMixins";
export default {
  mixins:[ContractRightMixins],
  components: {
    signDiaLog: () => import("./components/sign-diaLog"),
    onlineEdit: () => import("./components/online-edit"),
    subjectMatter: () => import("./components/subject-matter"),
    mortgageCollateral: () => import("./components/mortgage-collateral"),
    transactionElements: () => import("./components/transaction-elements"),
    attachment: () => import("./components/attachment"),
    contractElements: () => import("./components/contract-elements")
  },
 inject: ['getEditStatus'],
  props: {
    rowData: {
      type: Object,
      default: {}
    },
    routeParams: {
      type: Object,
      default: {}
    }
  },
  watch: {
    $route: function(to, from) {
      if (to.name !== "ContractDetail") return;
      this.initUI(this.rowData);
    },
    rowData(obj) {
      if (!isEmptyObj(obj)) {
        this.contractRowInfo = {}
        // console.log(this.$parent.$refs.contractLeftDom.$refs.tableDom)
        this.initUI(obj);
        // this.refresh = true;
      }
    }
  },
  // mounted() {
  //   if (!this.refresh) {
  //     if (this.rowData) {
  //       this.initUI(this.rowData);
  //     }
  //   }
  // },
  data() {
    return {
      activeTab: null,
      showTabs: false,
      dialogStatus: false,
      contractRowInfo: {},
      contractVersionData: [],
      tabIndex: 0,
      refresh: false,
      dateFormatBySeparator
    };
  },
 computed: {
    canEdit() {
      return this.getEditStatus()
    }
  },
  methods: {
    handleTabClick(target) {
      this.contracTypeData = getTargetData(
        DROP_MENUS,
        this.rowData.contractType,
        "contractType"
      );
      this.tabIndex = target.index;
      const filterData = this.contractVersionData.filter(item => {
        return item.id + "_" + target.index == this.activeTab;
      });
      this.contractRowInfo = filterData[0];
    },
    initUI(rowData, target = { index: 0 }) {
      this.tabIndex = 0;
      this.contracTypeData = getTargetData(
        DROP_MENUS,
        rowData.contractType,
        "contractType"
      );
      this.getContractRowInfoById(rowData, target);
      // setTimeout(() => {
      //   //  console.log('ref',this.$refs)
      //   this.$refs.attachment.refreshTable();
      // }, 0);
    },
    setInitVersionData(data, target) {
      if (data.conHistoryVersionDtos.length) {
        let contractRowInfo = deepAssign(data);
        // delete contractRowInfo.conHistoryVersionDtos;
        this.contractVersionData = [contractRowInfo].concat(
          data.conHistoryVersionDtos
        );
        this.contractRowInfo = this.contractVersionData[0];
        this.tabIndex = target.index;
        this.showTabs = true;
        this.setTabsTitle();
      } else {
        this.contractRowInfo = data;
        this.showTabs = false;
      }
    },
    setTabsTitle() {
      if (!this.showTabs) return;
      const data = this.contractVersionData;
      const n = data.length;
      const newData = [];
      let title = "";
      this.activeTab = `${this.contractRowInfo.id}_0`;

      for (let i = 0; i < n; i++) {
        const item = data[i];
        if (i === 0) {
          title = "当前版本(请更新后提交)";
        } else if (i === n - 1) {
          title = "初始版本";
        } else {
          title = "第" + (n - 1 - i) + "次变更";
        }
        newData.push({ id: item.id, version_title: title });
      }
      this.tabList = newData;
    },
    getSigningTime(formData) {
      // const filterData = this.contractVersionData.filter(
      //   item => {
      //    return item.id + "_" + this.tabIndex.index == this.activeTab}
      // );
      this.contractRowInfo = {
        ...this.contractRowInfo,
        ...formData
      };
      this.$parent.$refs.contractLeftDom.refreshTable(this.rowData.index)
      // this.signingTime = dateFormatBySeparator(formData.signingTime);
    },
    handleDialogClosed(dialogStatus) {
      this.dialogStatus = dialogStatus;
    },
    handleSignClick() {
      if(+this.contractRowInfo.contractState<2||this.contractRowInfo.contractState=="3"||this.contractRowInfo.contractState=="10"){
        return this.$showToast('合同审批后才可编辑！', 'warning')
      }
      this.dialogStatus = true;
    },
    getContractRowInfoById(rowData, target) {
      IContractBQueryById(
        {
          id: rowData.id
        },
        { showLoading: true }
      ).then(res => {
        this.setInitVersionData(res.data, target);
        // this.signingTime = dateFormatBySeparator(res.data.signingTime);
      });
    }
  }
};
</script>

<style lang='scss'>
.comp-right-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  //border-top: 3px solid #5595ff;
  //padding: 16px 20px 0;
  .can-edit{
    pointer-events: none;
  }
  #sign_time {
    display: inline-block;
    margin-left: 15px;
    border: 1px dashed #c1d5f7;
    line-height: 25px;
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 6px;
    color: #5b6377;
    cursor: pointer;
    background: #f7faff;
    font-size: 13px;
  }
  // .contract-form{
  //   display: inline-block;
  //   vertical-align: -28px;
  //   .contract-btn{
  //     margin-left:10px ;
  //   }
  //   .el-form-item>*{
  //     float: left;
  //   }
  //   &>*{
  //     float: left;
  //   }
  // }
  #sign_time img {
    width: 12px;
    height: 12px;
    border-bottom: 2px solid #3cd7ed;
  }
  .online-edit-panel {
    padding: 10px !important;
  }
  .no-data {
    padding-top: 20px;
    padding-left: 10px;
    .no-data-top {
      width: 134px;
      height: 160px;
      background: url("~@/assets/images/no-data-img.png") no-repeat center 0;
      margin: 0 auto;
    }
    .no-data-text {
      padding: 20px 0;
      text-align: center;
    }
  }
  .file-list {
    padding: 5px 10px;
    border-radius: 5px;
    background: #f1f2f3;
    li {
      line-height: 22px;
    }
    .btn {
      cursor: pointer;
      color: #5595ff;
      &:hover {
        text-decoration: underline;
      }
    }
    span:first-child {
      margin-right: 15px;
    }
  }
  .header {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: normal;
    line-height: 48px;
    height: 40px;
    //margin-top: 4px;
    &:before {
      content: "";
      border-left: 3px solid #5595ff;
      margin-right: 10px;
    }
  }

  .main-body {
    flex: 1;
    overflow-y: auto;
    padding-right: 7px;
  }
  .panel-table-create {
    padding: 0 10px 10px;
    border: 1px solid #ebf0fd;
    border-radius: 8px;
    box-shadow: rgba(201, 217, 248, 0.5) 0 0 10px;
    margin-bottom: 15px;
  }
  .panel {
    padding: 0 10px 10px;
    border: 1px solid #ebf0fd;
    border-radius: 8px;
    box-shadow: rgba(201, 217, 248, 0.5) 0 0 10px;
    margin-bottom: 15px;

    h4 {
      padding: 15px 0;
      color: #5b6377;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &>div>table {
      table-layout: fixed;
      width: 100%;
      border: 1px solid #eee;
      border-top: none;
      border-left: none;

      th {
        text-align: left;
        padding: 10px 5px;
        border-top: 1px solid #eee;
        border-left: 1px solid #eee;
        background: #f7f9fe;
        font-weight: normal;
      }
      &>tbody>tr>td {
        padding: 10px 5px;
        border-top: 1px solid #eee;
        border-left: 1px solid #eee;
      }
      &>tr>td {
        padding: 10px 5px;
        border-top: 1px solid #eee;
        border-left: 1px solid #eee;
      }
    }
  }
}
</style>
