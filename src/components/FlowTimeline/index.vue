<template>
  <el-timeline class="timeline">
    <el-timeline-item
      v-for="item in nodeData"
      :key="item.id"
      :timestamp="'流转到本节点时间：'+item.send_time"
      placement="top"
      :class="{ active: item.state == 3 }"
    >
      <el-card>
        <h4>{{ item.node_name }}</h4>
        <p v-if="item.dispose_action == 0">处理操作：{{ item.dispose_action | filterDictValue('20467') }}</p>
        <p>处理人：{{ item.rec_username }}</p>
        <p>接收时间：{{ item.rec_time }}</p>
        <p>处理时间：{{ item.dispose_time }}</p>
        <!-- 不通过 -->
        <p v-if="item.dispose_state == 0 && item.dispose_action != 1">通过标志：否</p>
        <!-- 通过 -->
        <p v-if="item.dispose_state == 1 && item.dispose_action != 1">通过标志：是</p>
        <p>处理意见：{{ item.dispose_suggestion }}</p>
        <p>通过耗时：{{ item.send_time | timeConsumingCalc(item.dispose_time) }}</p>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
import dayjs from 'dayjs'
export default {
  data() {
    return {};
  },
  filters: {
    timeConsumingCalc(send_time, dispose_time) {
      if (!dispose_time) return ''
      const sendTime = dayjs(send_time)
      const disposeTime = dayjs(dispose_time)
      const day = disposeTime.diff(sendTime, 'day')
      const hour = disposeTime.diff(sendTime, 'hour') % 24
      const minute = disposeTime.diff(sendTime, 'minute') % 60
      const second = disposeTime.diff(sendTime, 'second') % 60
      return `${day && (day + '天') || ''}${hour && (hour + '时') || ''}${minute && (minute + '分') || ''}${second && (second + '秒') || ''}`
    }
  },
  props: {
    nodeData: {
      type: Array,
      default() {
        return []
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.timeline {
  padding: 20px 10px 0px;
  border-radius: 3px;
  background: rgba(255, 255, 255, .95);
  box-shadow: 1px 1px 8px rgba(0, 0, 0, .3);
  .el-card__body {
    padding: 10px;
    h4 {
      margin-bottom: 4px;
      line-height: 22px;
    }
    p {
      line-height: 22px;
    }
  }
  .active {
    color: #27AA5A;
    .el-timeline-item__timestamp {
      color: inherit;
    }
    .el-card__body {
      color: #27AA5A;
    }
    .el-timeline-item__tail {
      border-color: inherit;
    }
    .el-timeline-item__node {
      background-color: #27AA5A;
    }
  }
}

</style>
