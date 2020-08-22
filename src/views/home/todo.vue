<template>
  <div class="app-content todo-page">
    <quote text="我的待办" icon="backlog" />
    <div class="content">
      <div v-loading="showLoading" class="backlog-list">
        <ul>
          <li v-for="item in backlogLlist" :key="item.id">
            <div class="left">
              <span class="tag">{{ item.tag }}</span>
            </div>
            <div class="right">
              <p class="top">
                <span class="title">
                  <b>{{ item.alias }}</b>
                  <b @click="handleItemClick(item)">{{ item.summary }}</b>
                </span>
                <time class="send-time">{{ item.send_time }}</time>
              </p>
              <p v-if="!!item.desc" class="center" v-html="item.desc" />
              <p class="bottom">
                <span>发起人：{{ item.req_username }}</span>
                <span>发起人部门：{{ item.req_dept_name }}</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
      <p v-if="showNoData" class="no-data">暂无数据</p>
      <el-pagination
        v-show="backlogLlist.length"
        :page-sizes="[10, 20, 50]"
        :current-page="currentPage"
        :page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageCount"
        style="margin-bottom: 10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import Quote from 'components/Quote'
import paginationMixin from 'mixins/pagination'
// import packageUrlParams from 'views/home/index/js/packageUrlParams.js'
export default {
  name: 'Todo',
  components: {
    Quote
  },
  mixins: [paginationMixin],
  data() {
    return {
      backlogLlist: [],
      showLoading: false,
      showNoData: false
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.showLoading = true
      this.$promiseRequest({
        code: '100643',
        data: {},
        ext: {
          record_offset: (this.currentPage - 1) * this.pageSize,
          record_count: this.pageSize
        }
      })
        .then(res => {
          if (res.data.record.length) {
            this.pageCount = res.data.result.alllength
            this._dataParser(res.data.record)
          } else {
            this.showNoData = true
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(err => {
          this.showLoading = false
        })
    },
    _dataParser(data) {
      data = data.filter(item => item.descript !== '')
      data.map(this._dataPackage)
      this.backlogLlist = Object.freeze(data)
    },
    _dataPackage(item) {
      const flowInfo = item.descript.split('*')
      item.tag = flowInfo[2]
      item.alias = flowInfo[1]
      item.summary = flowInfo[3]
      switch (flowInfo[2]) {
        case '立项':
        case '尽调':
        case '续议':
        case '结清':
        case '项目变更':
        case '合同审批':
        case '合同变更':
          item.desc = `<span>客户名称：${flowInfo[4]}</span><span>核算主体：${
            flowInfo[5]
          }</span><span>业务类型：${flowInfo[6]}</span>`
          break
        case '投放':
        case '直租放款':
        case '展期':
        case '租金计划变更':
        case '罚息减免':
        case '保证金':
        case '提前结清':
          item.desc = `<span>融资租赁合同编号：${
            flowInfo[4]
          }</span><span>客户名称：${flowInfo[5]}</span><span>核算主体：${
            flowInfo[6]
          }</span>`
          break
        case '利率':
          item.desc = `<span>客户名称：${flowInfo[4]}</span>`
        case '合同结清':
          item.desc = `<span>项目名称：${flowInfo[4]}</span><span>客户名称：${
            flowInfo[5]
          }</span><span>核算主体：${flowInfo[6]}</span>`
      }
    },
    handleItemClick(data) {
      packageUrlParams(data).then(res => {
        if (!res) return this.$showToast('参数生成失败！')
        this.$router.push({
          name: 'FlowBlock',
          params: {
            line_id: res.id,
            ...res
          }
        })
      })
    }
  }
}
</script>

<style lang='scss'>
.todo-page {
  .backlog-list li {
    display: flex;
    margin-bottom: 10px;
    padding: 15px 10px;
    transition-duration: .5s;
    background: #FFFFFF;

    &:hover {
      box-shadow: 0 0px 5px rgba(85, 149, 255, .8);
    }
    .left {
      width: 110px;
      .tag {
        display: inline-block;
        width: 96px;
        height: 26px;
        margin: 0 auto;
        line-height: 26px;
        text-align: center;
        color: #FFFFFF;
        border-radius: 3px;
        background: #5595FF;
      }
    }
    .right {
      overflow: hidden;
      flex: 1;
      .top {
        display: flex;
        justify-content: space-between;
        padding-bottom: 5px;
        line-height: 26px;
        border-bottom: 1px solid #EEEEEE;
        .title {
          overflow: hidden;
          flex: 1;
          white-space: nowrap;
          text-overflow: ellipsis;
          b:first-child {
            color: #5E6579;
          }
          b:last-child {
            margin-left: 50px;
            cursor: pointer;
            color: #5595FF;
          }
        }
        .send-time {
          width: 115px;
          font-size: 12px;
          text-align: right;
          color: #999999;
        }
      }
      .center, .bottom {
        overflow: hidden;
        margin-top: 7px;
        line-height: 26px;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #5E6579;
        span {
          margin-right: 25px;
        }
      }
    }
  }
  .no-data {
    padding: 15px;
    color: #777777;
    background: #FFFFFF;
  }
}

</style>
