<template>
  <div class="app-content join-or-create-page common-page">
    <div v-loading="showLoading" element-loading-text="正在拼命加载中...">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="我参与的" name="1" />
        <el-tab-pane label="我创建的" name="0" />
      </el-tabs>
      <el-table :data="tableData" border stripe @row-click="handleRowClick">
        <el-table-column
          prop="desc"
          label="内容描述"
          :show-overflow-tooltip="true"
          min-width="180"
          align="left"
        />
        <el-table-column prop="module" label="业务模块" />
        <el-table-column prop="node_current_name" label="任务节点" />
        <el-table-column prop="node_dispose_time" label="最近处理时间" width="140" />
        <el-table-column prop="node_create_time" label="创建时间" width="140" />
        <el-table-column prop="req_username" label="发起人" />
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <el-tag effect="dark">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="tableData.length"
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
import paginationMixin from 'mixins/pagination'
// import packageUrlParams from 'views/home/index/js/packageUrlParams.js'
export default {
  mixins: [paginationMixin],
  data() {
    return {
      tableData: [],
      activeName: '',
      showLoading: true
    }
  },
  created() {
    this.activeName = this.$route.query.workType + ''
    if (![0, 1].includes(+this.activeName)) return
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.showLoading = true
      this.$promiseRequest({
        code: '100644',
        data: {
          ...(this.activeName == 1 && { create_flag: true })
        },
        ext: {
          record_offset: (this.currentPage - 1) * this.pageSize,
          record_count: this.pageSize
        }
      })
        .then(res => {
          if (res.data.record.length) {
            this.pageCount = res.data.result.alllength
            this._dataParser(res.data.record)
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(res => {
          this.showLoading = false
        })
    },
    _dataParser(data) {
      data = data.filter(item => item.descript !== '')
      data.map(this._dataPackage)
      this.tableData = Object.freeze(data)
    },
    _dataPackage(item) {
      const flowInfo = item.descript.split('*')
      item.desc = flowInfo[3] + flowInfo[1]
      item.node_current_name = item.node_current_name || '--'
      item.module = flowInfo[0]
      item.type = flowInfo[2]
    },
    handleTabClick() {
      this.currentPage = 1
      this.getTableData()
    },
    handleRowClick(row) {
      packageUrlParams(row, 2).then(res => {
        if (!res) return this.$showToast('参数生成失败！')
        this.$router.push({
          name: 'FlowBlock',
          params: {
            flow_id: res.flow_id,
            flow_name: res.flow_name,
            flow_version_id: res.flow_version_id,
            req_id: res.req_id,
            flow_no: res.flow_no,
            project_flag: res.project_flag,
            title: res.title
          }
        })
      })
    }
  }
}
</script>

<style lang='scss'>
.join-or-create-page {
  padding: 5px 15px;
  .el-tag {
    min-width: 90px;
  }
  .el-table__row {
    cursor: pointer;
  }
}

</style>
