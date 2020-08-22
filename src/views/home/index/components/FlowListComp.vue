<template>
  <div v-loading="showLoading" class="flow-list">
    <div v-if="tableList.length">
      <div v-for="(item, index) in tableList" :key="index" class="list-item">
        <div class="type">
          <el-tag effect="dark">{{ item.taskDefinitionKey }}</el-tag>
        </div>
        <div class="meta">
          <p>
            <span :title="item.processInstanceName" @click="handleItemClick(item)">{{ item.processInstanceName }}</span>
            <time
              :class="{overdue: calcIsOverdue(item)}"
            >{{ item.createTime }}</time>
          </p>
          <p v-show="item.processInstanceName">{{ item.processInstanceName }}</p>
        </div>
      </div>
    </div>
    <p v-if="showNoData" class="no-data">暂无数据</p>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import settings from '@/settings.js'
import { mapState } from 'vuex'
import { getFlowTodoTaskData, getFlowDoneTaskData, getFlowMineStartedTaskData } from 'api/workflow-module/index.js'
export default {
  props: {
    flowType: {
      type: String,
      default: 'await'
    }
  },
  data() {
    return {
      tableList: [],
      showLoading: false,
      showNoData: false
    }
  },
  computed: {
    ...mapState({
      refreshHomePage: state => state.refresh.refreshHomePage
    })
  },
  watch: {
    refreshHomePage() {
      this.getDataList(false)
    }
  },
  inject: ['setAretTopData'],
  created() {
    this.getDataList()
  },
  methods: {
    getDataList(showLoading = true) {
      this.showNoData = false
      this.showLoading = showLoading
      this.tableList = []
      const taskRequestMap = {
        await: getFlowTodoTaskData,
        involved: getFlowDoneTaskData,
        created: getFlowMineStartedTaskData
      }
      taskRequestMap[this.flowType]({
        pageSize: 5,
        pageNum: 1
      }, { needDto: false }).then(res => {

        if (res.resultData && Array.isArray(res.resultData.dataList) && res.resultData.dataList.length) {
          this.tableList = res.resultData.dataList
          if(this.flowType !== 'await') return 
          const backlogNum = res.resultData.total
          this.setAretTopData({
            backlog: backlogNum
          })
        } else {
          this.showNoData = true
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.showLoading = false
      })
    },
    handleItemClick(data) {
      let params = this.flowType === 'await' ? { id: data.id } : { taskId: data.processInstanceId }
      this.$router.push({
        path: '/process/process-approval',
        query: params
      })
    },
    calcIsOverdue(data) {
      // return (+new Date() - (+new Date(data.req_time))) > (settings.flowOverdueDays | 3) * 86400000
    }
  }
}
</script>

<style lang='scss' scoped>
.flow-list {
  height: 100%;
  .list-item {
    display: flex;
    overflow: hidden;
    box-sizing: border-box;
    height: 74px;
    padding-top: 10px;

    .type {
      .el-tag {
        width: 120px;
        text-align: center;
      }
    }
    .meta {
      overflow: hidden;
      flex: 1;
      margin-left: 15px;
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
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          margin-top: 4px;
          font-size: 12px;
          line-height: 18px;
          text-overflow: ellipsis;
          color: #666666;

          -webkit-line-clamp: 2;
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

</style>
