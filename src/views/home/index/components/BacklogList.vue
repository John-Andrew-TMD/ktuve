<template>
  <div class="backlog-list" v-loading="showLoading">
    <nav class="nav-bar">
      <h3 class="title" :class="{active: backlogList.length}">我的待办 ({{ backlogNum }})</h3>
      <span class="read-more" v-show="backlogList.length" @click="handleViewMore">查看更多></span>
    </nav>
    <div>
      <transition name="fade">
        <div v-if="backlogList.length">
          <div v-for="(item, index) in backlogList" :key="index" class="backlog-list-item">
            <div class="type">
              <el-tag effect="dark">{{item.flow_type}}</el-tag>
            </div>
            <div class="meta">
              <p>
                <span @click="handleItemClick(item)" :title="item.flow_title">{{item.flow_title}}</span>
                <time
                  :class="{overdue: (+new Date() - (+new Date(item.req_time)) > 259200000)}"
                >{{item.send_time}}</time>
              </p>
              <p v-show="item.flow_desc">{{ item.flow_desc }}</p>
            </div>
          </div>
        </div>
      </transition>
      <p v-if="showNoData" class="no-data">暂无数据</p>
    </div>
  </div>
</template>
<script>
import packageUrlParams from "views/home/index/js/packageUrlParams.js";
export default {
  data() {
    return {
      backlogNum: "-",
      backlogList: [],
      showLoading: true,
      showNoData: false
    };
  },
  inject: ["setAretTopData"],
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this._getBacklogList();
    },
    _getBacklogList() {
      this.$promiseRequest([
        {
          code: "100643",
          ext: {
            record_offset: "0",
            record_count: "5"
          }
        },
        {
          code: "213004",
          data: {
            objcode: "213004"
          }
        }
      ])
        .then(res => {
          let data = res.data;
          if (!data.length) return;
          let [backlogList, contractData] = data;
          if (backlogList.record && backlogList.record.length) {
            this.backlogNum = backlogList.result.alllength;
            this.setAretTopData({
              backlog: this.backlogNum
            });
            this._dataParser(backlogList.record);
          } else {
            this.showNoData = true;
          }
          if (contractData.record && contractData.record.length) {
            this.setAretTopData({
              contractIncreasedThisMonth: contractData.record[0].month_num,
              contractAccountThisYear: contractData.record[0].year_num
            });
          }
        })
        .catch(err => {
          this.backlogNum = 0;
          this.setAretTopData({
            backlog: 0
          });
          this.showNoData = true;
        })
        .finally(res => {
          this.showLoading = false;
        });
    },
    _dataParser(data) {
      let flowDesc, flowInfo;
      data = data.filter(item => !!item.descript);
      data.map(item => {
        flowDesc = item.descript;
        flowInfo = flowDesc.split("*");
        item.flow_type = flowInfo[2];
        item.flow_title = flowInfo[3];
        item.flow_desc = this._joinFlowDesc(flowInfo[2], flowInfo) || "";
      });
      this.backlogList = data;
    },
    _joinFlowDesc(type, data) {
      switch (type) {
        case "立项":
        case "尽调":
        case "续议":
        case "结清":
        case "项目变更":
        case "合同审批":
        case "合同变更":
          return `客户名称：${data[4]} | 核算主体：${data[5]}`;
          break;
        case "直租放款":
        case "投放":
        case "展期":
        case "租金计划变更":
        case '提前结清':
        case '罚息减免':
        case '保证金':
          return `融资租赁合同编号：${data[4]} | 客户名称：${data[5]}`;
          break;
        case "利率":
          return `客户名称：${data[4]}`;
          break;
        case "合同结清":
          return `项目名称：${data[4]} | 客户名称：${data[5]}`;
          break;
        case "融资":
        case "融资方案变更":
          return `方案名称：${data[4]} | 银行名称：${data[5]} | 是否结清：${data[6]}`;
          break;
        default:
          return false;
          break;
      }
    },
    handleViewMore() {
      this.$router.push("/todo");
    },
    handleItemClick(data) {
      packageUrlParams(data).then(res => {
        if(!res) return this.$showToast('参数生成失败！')
        this.$router.push({
          name: "FlowBlock",
          params: {
            line_id: res.id,
            ...res
          }
        });
      })
    }
  }
};
</script>
<style lang="scss">
.home-page {
  .backlog-list {
    overflow: hidden;
    height: 100%;
    padding: 0 15px;
    .nav-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      border-bottom: 1px solid #E7F0FF;

      h3 {
        position: relative;
        font-size: 14px;
      }

      .active {
        &:after {
          position: absolute;
          top: 0;
          width: 8px;
          height: 8px;
          content: '';
          border-radius: 50%;
          background: #FF0000;
        }
      }

      .read-more {
        font-size: 12px;
        cursor: pointer;
        color: #1890FF;
      }
    }

    .backlog-list-item {
      display: flex;
      overflow: hidden;
      box-sizing: border-box;
      height: 74px;
      padding-top: 10px;

      .type {
        .el-tag {
          width: 90px;
          text-align: center;
        }
      }
      .meta {
        overflow: hidden;
        flex: 1;
        margin-left: 30px;
        border-bottom: 1px solid #E7F0FE;

        p {
          line-height: 20px;
          span {
            overflow: hidden;
            flex: 1;
            cursor: pointer;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #4AA1FF;
          }
          time {
            width: 115px;
            font-size: 12px;
            color: #999999;
          }

          &:first-child {
            display: flex;
            justify-content: space-between;
          }

          &:last-child {
            overflow: hidden;
            margin-top: 5px;
            padding: 7px 0;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .overdue {
          color: #FF9933;
        }
      }

      // &:last-child {
      //   .meta {
      //     border-bottom: none;
      //   }
      // }
    }
    .no-data {
      font-size: 12px;
      line-height: 59px;
      text-align: center;
      color: #909399;
      border-bottom: 1px solid #EBEEF5;
    }
  }
}

</style>


