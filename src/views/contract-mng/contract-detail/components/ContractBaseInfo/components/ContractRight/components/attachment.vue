<!-- 标的物 -->
<template>
  <div>
    <h4>
      <span>附件</span>
      <el-button v-if="isHistory && canEdit" type="primary" size="mini" @click="handleUpload()">上传</el-button>
    </h4>
    <table-create
      ref="tableDom"
      :options="tableOptions"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @current-change="handleCurrentChange"
    >
      <template #operation="{ scope }">
        <el-button type="text" size="mini" @click.stop="handleView(scope.row)">查看</el-button>
        <el-button type="text" size="mini" @click.stop="handleDownload(scope.row)">下载</el-button>
        <el-button v-if="isHistory && canEdit" type="text" size="mini" @click.stop="handleDel(scope.row)">删除</el-button>
      </template>
    </table-create>
    <attachment-diaLog
      v-if="dialogStatus"
      ref="attachmentDialog"
      :key="key"
      :contract-row-info="contractRowInfo"
      :dialog-status="dialogStatus"
      :route-params="routeParams"
      @refreshTable="refreshTable"
      @handleDialogClosed="handleDialogClosed"
    />
  </div>
</template>

<script>
import {
  attachmentPreview,
  attachmentDownload
} from 'api/file-system.js'
import TableCreate from 'components/TableCreate/index'
import { formSubmit, isEmptyObj } from 'utils'
import {
  IConEnclosureBusinessPage,
  IConEnclosureBusinessRemoveByIds
} from 'api/contract-module/api-contract-attachment'
import attachmentDiaLog from './attachmentDiaLog.vue'
import ContractRightMixins from './mixins/ContractRightMixins'
export default {
  components: {
    TableCreate,
    attachmentDiaLog
  },
  mixins: [ContractRightMixins],
  props: {
    routeParams: {
      type: Object,
      default: () => ({})
    },
    contractRowInfo: {
      type: Object,
      default: () => ({})
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      key: 0,
      dialogStatus: false,
      tableOptions: {
        requestParams: {
          url: IConEnclosureBusinessPage,
          data: {
            recordId: this.contractRowInfo.id
          }
        },
        showPagination: false, // 是否显示分
        // showCheckbox: true,
        showSerialNumber: false,
        // showTools: true,
        // tableBottomOffset: 75
        columns: [
          {
            attrs: {
              label: '附件名称',
              prop: 'fileName'
            }
          },
          {
            attrs: {
              label: '附件类型',
              prop: 'dataContent'
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
  watch: {
    contractRowInfo(obj) {
      if (!isEmptyObj(obj)) {
        this.refreshTable()
      }
    }
  },
  // mounted() {
  //   this.refreshTable()
  // },
  methods: {
    handleDialogClosed(dialogStatus) {
      this.key += 1
      this.dialogStatus = dialogStatus
    },
    handleUpload() {
      this.dialogStatus = true
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData({ ...data, recordId: this.contractRowInfo.id })
      //  console.log(this.contractRowInfo.conHistoryVersionDtos===null)
    },
    // 查看
    handleView(data) {
      formSubmit(attachmentPreview, { id: data.fileId }, 'get', '_blank')
    },
    // 下载
    handleDownload(data) {
      formSubmit(attachmentDownload, { id: data.fileId })
    },
    // 删除
    handleDel(data) {
      const { id } = data
      this.$confirm(`确定删除${data.fileName}文件吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          IConEnclosureBusinessRemoveByIds({
            ids: [data.id]
          }).then(res => {
            if (!res.status) {
              this.refreshTable()
              this.$showToast(res.msg, 'success')
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
h4 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  color: #5B6377;
}

</style>
