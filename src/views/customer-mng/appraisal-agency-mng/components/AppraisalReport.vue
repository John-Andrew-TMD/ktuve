<template>
  <table-create 
    ref="tableDom"
    :options="tableOptions"
  >
    <template v-slot:operation="{ scope }">
        <el-button type="primary" size="mini" plain @click="preview(scope.row)">预览</el-button>
        <el-button type="primary" size="mini" plain @click="download(scope.row)">下载</el-button>
    </template>
  </table-create>
</template>

<script>
import TableCreate from 'components/TableCreate/index'

export default {
  data() {
    return {
      tableOptions: {
        columns: [
          { attrs: { prop: 'reportName', label: '报告名称' }},
          { attrs: { prop: 'appraisalName', label: '评估物品名称' }},
          { attrs: { prop: 'price', label: '评估价值' }},
          { attrs: { prop: 'use', label: '物品用途' }},
          { attrs: { prop: 'project', label: '关联项目' }},
          { attrs: { prop: 'operation', label: '操作' },slot: "operation"},
        ],
        showPagination: false,
        showLoading: false,
        requestImmediate: false,
        showSerialNumber: false
      },
    }
  },
  components: {
    TableCreate
  },
  mounted() {
    this.$emit('input', this.$refs.tableDom)
  },
  methods: {
    //TODO:ZHUANG GUANG QIAN
    preview(){},
    download(){}
  }
}
</script>

<style lang='scss'>
</style>