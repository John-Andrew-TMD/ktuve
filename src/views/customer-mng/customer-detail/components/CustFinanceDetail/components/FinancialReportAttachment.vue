<template>
  <table-create
    ref="tableDom"
    :options="tableOptions"
  >
    <template v-slot:operation="{ scope }">
      <el-button type="text" size="mini" @click="handleFilePreview(scope.row)">预览</el-button>
      <el-button type="text" size="mini" @click="handleFileDownload(scope.row)">下载</el-button>
    </template>
  </table-create>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import { attachmentListUrl, attachmentPreview, attachmentDownload } from 'api/file-system.js'
import { formSubmit } from 'utils'

export default {
  components: {
    TableCreate
  },
  props: {},
  data() {
    return {
      tableOptions: {
        requestParams: {
          url: attachmentListUrl,
          data: {
            businessId: this.$route.query.id,
            businessType: '1'
          }
        },
        showLoading: false,
        showSerialNumber: true,
        requestImmediate: true,
        columns: [
          {
            attrs: {
              label: '财务报告附件名称',
              prop: 'fileName',
              align: 'left'
            }
          },
          {
            attrs: {
              label: '操作',
              prop: 'operation',
              width: '150px'
            },
            slot: 'operation'
          }
        ]
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 下载
    handleFileDownload(data) {
      formSubmit(attachmentDownload, { id: data.id })
    },
    // 文件预览
    handleFilePreview(data) {
      formSubmit(attachmentPreview, { id: data.id }, 'get', '_blank')
    }
  }
}
</script>

<style lang='scss'>

</style>
