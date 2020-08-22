<template>
  <div class="comp-process-dispose-detail">
    <el-timeline class="timeline">
      <el-timeline-item
        v-for="item in nodeData"
        :key="item.commentId"
        :icon="item.icon"
        :timestamp="getContent(item)"
        placement="top"
      >
        <el-card>
          <!-- <p>
            <label>处理人：</label>
            {{ item.assigneeName }}（{{ item.name }}）
          </p> -->
          <p>
            <label>处理操作：</label>
            {{ item.commentType }}
          </p>
          <p>
            <label>处理意见：</label>
            {{ item.commentMessage }}
          </p>
          <p>
            <label>处理时间：</label>
            <time>{{ item.endTime }}</time>
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { isEmptyObj } from 'utils'
import { getFlowApprovalNodesData } from 'api/workflow-module/index.js'
export default {
  inheritAttrs: false,
  props: {
    routeParams: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      nodeData: []
    }
  },
  watch: {
    routeParams: {
      handler(obj) {
        if (isEmptyObj(obj)) return
        this.getProcessDetail()
      },
      immediate: true
    }
  },
  methods: {
    getProcessDetail() {
      getFlowApprovalNodesData({
        processInstanceId: this.routeParams.processInstanceId
      }, { showLoading: true }).then(res => {
        if (Array.isArray(res.resultData) && res.resultData.length) {
          // res.resultData[0].icon = 'iconfont icon-wait'
          this.nodeData = Object.freeze(res.resultData.reverse())
        }
      })
    },
    getContent(data) {
      return `${data.assigneeName}（${data.name}）`
    }
  }
}
</script>

<style lang='scss' scoped>
.comp-process-dispose-detail {
  overflow-y: auto;
  box-sizing: border-box;
  height: 100%;
  padding: 10px 10px 0;
  .timeline /deep/  {
    box-shadow: none;
    .icon-wait {
      font-size: 20px;
      color: #0BBD87;
      background: #FFFFFF;
    }
    .is-top {
      color: #333333;
    }
    label {
      font-weight: normal;
      color: #999999;
    }
    p {
      line-height: 24px;
    }
    time {
      color: #999999;
    }
  }
}

</style>
