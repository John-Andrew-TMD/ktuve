<template>
  <div class="appraisal-report">
    <table-create 
      ref="tableDom"
      :options="tableOptions"
    >
      <template v-slot:operation="slotScope">
        <div
          v-for="(item,index) in slotScope.scope.row.operation"
          class="file"
          :key="index"
        >
          <p class="file-name">{{item.dataContent}}</p>
          <div class="btn-file">
            <el-button @click="handleFileDownload(item)">下载</el-button>
          </div>
        </div>
          <!-- <el-button type="primary" size="mini" plain @click="preview(scope.row)">预览</el-button>
          <el-button type="primary" size="mini" plain @click="download(scope.row)">下载</el-button> -->
      </template>
    </table-create>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import { queryAssessDetail } from 'api/project-module/api-project-assess.js'
import { formSubmit } from 'utils'
import { attachmentDownload } from 'api/file-system.js'
export default {
  props: ['rowId'],
  data() {
    return {
      tableOptions: {
        requestParams: {
          url: queryAssessDetail,
          data: { id: this.rowId }
        },
        columns: [
          { attrs: { prop: 'projectName', label: '项目名称', showOverflowTooltip: true }},
          { attrs: { prop: 'result', label: '审议结果（同意/否决）' }},
          { attrs: { prop: 'operation', label: '操作' },slot: "operation"},
        ],
        showPagination: false,
        showSerialNumber: true
      },
    }
  },
  components: {
    TableCreate
  },
  created() {},
  mounted() {
    this.$emit('input', this.$refs.tableDom)
  },
  methods: {
    handleFileDownload(item) {
      formSubmit(
        attachmentDownload,
        {
          id: item.fileId
        },
        'post'
      )
    },
  }
}
</script>

<style lang='scss' scoped>
.appraisal-report{
  .el-table__row {
    .file {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      line-height: 30px;
      .file-name{
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .btn-file{
        float: right;
        margin-left: 5px;
      }
    }
  }
}
</style>