<template>
  <div v-loading="showLoading" class="message-list">
    <nav class="nav-bar">
      <div class="nav-bar-content">
        <span>系统消息<b class="num">（{{ msgNum }}）</b></span>
        <span class="read-more" @click="handleViewMore">查看更多></span>
      </div>
    </nav>
    <div class="message-content">
      <ul>
        <li v-for="item in meessageList" :key="item.id">
          <el-tag effect="dark" class="tag">{{ item.message_classify | filterDictValue('40003') }}</el-tag>
          <span class="desc">{{ item.content }}</span>
          <span class="time">{{ item.time_add }}</span>
        </li>
      </ul>
      <p v-if="showNoData" class="no-data">暂无数据</p>
    </div>
  </div>
</template>
<script>
// import packageUrlParams from 'views/home/index/js/packageUrlParams.js'
// import { mapGetters } from "vuex";
export default {
  data() {
    return {
      showLoading: false,
      showNoData: false,
      msgNum: '-',
      meessageList: []
    }
  },
  // computed: {
  //   ...mapGetters(["refreshPageData"])
  // },
  // watch: {
  //   refreshPageData() {
  //     this.getDataList();
  //   }
  // },
  created() {
    // this.getDataList();
  },
  methods: {
    getDataList() {
      this.showLoading = true
      this.$promiseRequest({
        code: '209630',
        data: {
          receiver_id: this.$userId,
          range_flag: 'A',
          limit_num: 7
        }
      })
        .then(res => {
          const msgNum = 0
          if (res.data && Array.isArray(res.data.record) && res.data.record.length) {
            this.msgNum = res.data.result.alllength
            this.meessageList = res.data.record
          } else {
            this.msgNum = 0
            this.meessageList = []
            this.showNoData = true
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(res => {
          this.showLoading = false
        })
    },
    handleViewMore() {
      this.$jrosUtils.navigateTo(
        '/message-list',
        '系统消息',
        true
      )
    }
  }
}
</script>
<style lang="scss" scoped>
  .message-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 15px;
    .nav-bar {
      height: 45px;

      .nav-bar-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #E4E7ED;
      }

      .num {
        font-size: 12px;
        font-weight: normal;
        color: rgba(255,153,0,.8);
      }

      .read-more {
        font-size: 12px;
        cursor: pointer;
        color: #1890FF;
      }
    }

    .message-content {
      overflow: hidden;
      flex: 1;
      li {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 6px 0 5px;
        border-bottom: 1px solid #EEEEEE;

        &:last-child {
          border: none;
        }
        .tag {
          width: 70px;
        }
        .desc {
          display: -webkit-box;
          overflow: hidden;
          flex: 1;
          -webkit-box-orient: vertical;
          padding: 3px 5px 0 7px;
          font-size: 13px;
          line-height: 18px;
          text-overflow: ellipsis;
          word-break: break-all;
          color: #606266;

          -webkit-line-clamp: 2;
        }
        .time {
          width: 115px;
          text-align: right;
          color: rgba(102,102,102,.55);
          font-size: 12px;
          line-height: 18px;
          margin-top: 3px;
        }
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

