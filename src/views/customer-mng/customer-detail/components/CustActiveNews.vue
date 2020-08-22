<template>
  <div class="history-wrap">
    <div class="btn-group">
      <el-button type="primary" @click="handleUpdateClick">动态信息同步(测试用)</el-button>
    </div>
    <table-create ref="tableDom" :options="tableOptions" @row-click="handleRowClick" />
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import { activeNewsList, activeNewsUpdate } from 'api/customer-module/api-customer-detail.js'

export default {
  components: {
    TableCreate
  },
  props: {
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableOptions: {
        requestParams: {
          url: activeNewsList,
          data: { custId: this.routeParams.id }
        },
        showSerialNumber: true,
        showPagination: true,
        columns: [
          { attrs: { label: '数据类型', prop: 'docType', width: '100px' }},
          { attrs: { label: '信息标题', prop: 'title' }},
          { attrs: { label: '信息网址', prop: 'url', 'class-name': 'link-type' }},
          { attrs: { label: '消息内容', prop: 'content', 'show-overflow-tooltip': true }},
          { attrs: { label: '风报入库时间', prop: 'createdAt', width: '200px' }}
        ]
      }
    }
  },
  methods: {
    handleRowClick(rowData, column) {
      if (column.property === 'url') {
        const url = rowData.url
        window.open(url, '_blank')
      }
    },
    handleUpdateClick() {
      activeNewsUpdate().then(res => {
        this.$refs.tableDom.resetTableData()
      }).catch(err => {
        console.log(err)
      }).finally(res => {
        this.$showToast('更新成功！', 'success')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.history-wrap {
  padding: 0 10px;
  .btn-group {
    padding-top: 0;
    border-top: none;
  }
}

</style>
