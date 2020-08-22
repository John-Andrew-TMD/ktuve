<template>
  <div>
    <el-dialog
      width="1000px"
      :modal-append-to-body="false"
      title="编辑合同附件资料"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <el-customer-transfer
        ref="transferDom"
        v-model="selectedAttach"
        title="资料内容"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入关键字"
        :data="attachmentData"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { attachmentContractAttachAdd, attachmentList } from 'api/run-module/attachment-setting.js'
import ElCustomerTransfer from './transfer/index.vue'
import { requestPost } from 'utils/fetch.js'
export default {
  components: {
    ElCustomerTransfer
  },
  props: {
    selectedRow: {
      type: Object,
      default: null
    },
    tableData: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      dialogVisible: false,
      attachmentData: [],
      selectedAttach: []
    }
  },
  created() {
    this.getAttachmentTypeList()
  },
  mounted() {
    this.dialogVisible = true
    this.$nextTick(() => {
      this.initUI()
    })
  },
  methods: {
    getAttachmentTypeList() {
      requestPost(attachmentList, {
        dto: {},
        pageCurrent: 1,
        pageSize: 10000
      }).then(res => {
        if (res.data && Array.isArray(res.data.records)) {
          // 排除系统固定附件内容
          const ret = res.data.records.filter(item => item.systemFixation !== '1')
          this.attachmentData = ret.map(item => {
            return {
              enclosureId: item.id,
              dataContent: item.dataContent
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    initUI() {
      if (!this.selectedRow) return
      this.selectedAttach = this.selectedRow.sourceData.map(item => item.enclosureId)
      this.$refs.transferDom.setTableData(this.selectedRow.sourceData)
    },
    handleDialogConfirm() {
      const tableData = this.$refs.transferDom.getTableData()
      if (!tableData.length) return this.$showToast('资料内容选择数量不允许为空！')
      const params = tableData.map((item, index) => {
        return {
          enclosureId: item.enclosureId,
          dataContent: item.dataContent,
          displayOrder: index,
          isNecessary: item.isNecessary !== '1' ? '0' : '1'
        }
      })
      attachmentContractAttachAdd(params, { showLoading: true }).then(res => {
        this.$showToast('编辑成功！', 'success')
        this.dialogVisible = false
        this.$emit('dialog-confirm')
      }).catch(err => {
        console.log(err)
      })
    },
    filterMethod(query, item) {
      return item.dataContent.indexOf(query) > -1
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .el-dialog {
  .el-checkbox {
    display: block;
  }
}

</style>
