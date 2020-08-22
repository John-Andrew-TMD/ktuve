<template>
  <div class="task-list">
    <nav class="nav-bar">
      <ul>
        <li :class="{active: switchFlag}" @click="handleSwitchTabList(true)">我参与的</li>
        <li :class="{active: !switchFlag}" @click="handleSwitchTabList(false)">我创建的</li>
      </ul>
      <span class="read-more" @click="handleViewMore">查看更多></span>
    </nav>
    <div class="content">
      <el-table
        :data="involvedList"
        style="width: 100%"
        :stripe="true"
        v-loading="showInvolvedLoading"
        :class="{translateHide: !switchFlag}"
        @row-click="handleRowClick"
      >
        <el-table-column label="类型" width="110" align="center">
          <template slot-scope="scope">
            <el-tag effect="dark">{{scope.row.flow_type}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="flow_desc" label="内容描述" :show-overflow-tooltip="true" min-width="150" align="left"></el-table-column>
        <el-table-column prop="flow_modal" width="100" label="业务模块"></el-table-column>
        <el-table-column prop="node_create_time" width="140" label="创建时间"></el-table-column>
      </el-table>
      <el-table
        :data="createdList"
        style="width: 100%"
        :stripe="true"
        v-loading="showCreatedLoading"
        class="created-list-table"
        :class="{translateShow: !switchFlag}"
        @row-click="handleRowClick"
      >
        <el-table-column label="类型" width="110">
          <template slot-scope="scope">
            <el-tag effect="dark">{{scope.row.flow_type}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="flow_desc" label="内容描述" :show-overflow-tooltip="true" min-width="150" align="left"></el-table-column>
        <el-table-column prop="flow_modal" width="130" label="业务模块"></el-table-column>
        <el-table-column prop="node_create_time" width="150" label="创建时间"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import packageUrlParams from "views/home/index/js/packageUrlParams.js";
export default {
  data() {
    return {
      showLoading: true,
      involvedList: [],
      createdList: [],
      showInvolvedLoading: true,
      showCreatedLoading: true,
      switchFlag: true // 默认显示我参与的
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this._getData()
    },
    _getData() {
      this.$promiseRequest([
        {
          code: '100644',
          ext: {
            record_offset: '0',
            record_count: '8'
          }
        },
        {
          code: '100644',
          data: {
            create_flag: true
          },
          ext: {
            record_offset: '0',
            record_count: '8'
          }
        }
      ]).then(res => {
        let data = res.data
        if(data.length) {
          let [involvedList = {}, createdList= {}] = data
          if(involvedList.record && involvedList.record.length) {
            this._dataParser(involvedList.record, 'involvedList')
          }
          if(createdList.record && createdList.record.length) {
            this._dataParser(createdList.record, 'createdList')
          }
        }
      }).catch(err => {}).finally(res => {
        this.showInvolvedLoading = false
        this.showCreatedLoading = false
      })
    },
    _dataParser(data, listName) {
      let flowDesc, flowInfo
      data = data.filter(item => !!item.descript)
      data.map(item => {
        flowDesc = item.descript
        flowInfo = flowDesc.split('*')
        item.flow_type = flowInfo[2]
        item.flow_desc = `${flowInfo[3]}${flowInfo[1]}`
        item.flow_modal = flowInfo[0]
      })
      this[listName] = data
    },
    handleRowClick(row) {
      packageUrlParams(row, 2).then(res => {
        if(!res) return this.$showToast('参数生成失败！')
        this.$router.push({
          name: "FlowBlock",
          params: {
            flow_id: res.flow_id,
            flow_name: res.flow_name,
            flow_version_id: res.flow_version_id,
            req_id: res.req_id,
            flow_no: res.flow_no,
            project_flag: res.project_flag,
            title: res.title
          }
        });
      })
    },
    handleViewMore() {
      this.$router.push({
        path: '/join-or-create',
        query: {
          workType: +this.switchFlag
        }
      })
    },
    handleSwitchTabList(val) {
      this.switchFlag = val;
    }
  }
};
</script>
<style lang="scss">
.home-page {
  .task-list {
    height: 100%;
    padding: 0 15px;
    .nav-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      border-bottom: 1px solid #E7F0FF;

      li {
        display: inline-block;
        margin-right: 15px;
        font-weight: 600;
        cursor: pointer;
        color: #999999;
      }
      .active {
        color: #333333;
      }

      .read-more {
        font-size: 12px;
        cursor: pointer;
        color: #1890FF;
      }
    }

    .content {
      position: relative;
      overflow: hidden;
      height: 375px;
      .el-tag {
        width: 90px;
        text-align: center;
      }
      .el-table {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        transition-duration: .3s;
        // th,
        // td {
        //   text-align: center;
        // }

        .el-table__row {
          cursor: pointer;
        }
      }
      .el-table--striped .el-table__body tr.el-table__row--striped td {
        background: #F1F5FF;
      }
      .created-list-table {
        transform: translateX(100%);
      }
      .translateHide {
        transform: translateX(-100%);
      }
      .translateShow {
        transform: translateX(0);
      }
    }
  }
}

</style>


