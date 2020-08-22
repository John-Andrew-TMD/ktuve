<template>
  <div class="app-content app-content--quote file-store-mng-page">
    <quote text="文件上传下载测试" icon="file-store" />
    <div class="app-content-wrapper">
      <table-create
        class="mt-0"
        ref="tableDom"
        :options="tableOptions"
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import Quote from 'components/Quote'
import TableCreate from 'components/TableCreate'
import { fileRecords } from 'api/file-system'
export default {
  components: {
    Quote,
    TableCreate
  },
  data() {
    return {
      tableOptions: {
        columns: [
          {
            attrs: {
              label: '文件名',
              prop: 'fileName'
            }
          },
          {
            attrs: {
              label: '文件原始名称',
              prop: 'originalName'
            }
          },
          {
            attrs: {
              label: '文件扩展名',
              prop: 'fileExt'
            }
          },
          {
            attrs: {
              label: '文件大小',
              prop: 'fileSize',
              formatter: (row, column) => {
                return (row.fileSize / 1024).toFixed(2) + 'KB'
              }
            }
          }
        ],
        requestParams: {
          url: fileRecords,
          data: {}
        }
      }
    }
  },
  methods: {

  }
}
</script>

<style lang='scss'>
.file-store-mng-page {
  .form-container {
    max-width: 600px;
    margin-top: 10px;
  }
  .form-btn {
    padding-left: 110px;
  }
}

</style>
