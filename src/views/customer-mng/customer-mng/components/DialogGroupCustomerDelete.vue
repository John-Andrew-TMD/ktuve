<template>
  <el-dialog
    custom-class="dialog-group-customer-add-comp"
    width="750px"
    :modal-append-to-body="false"
    title="确认删除下面表格的集团客户吗？"
    :visible.sync="dialogVisible"
    @closed="handleDialogClosed"
  >
    <group-customer-delete-action :table-data="checkedRows" />
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">发起审批</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { groupCustomerDelete } from 'api/customer-module/api-customer-mng.js'
import GroupCustomerDeleteAction from './common-components/GroupCustomerDeleteAction.vue'
export default {
  components: {
    GroupCustomerDeleteAction
  },
  inheritAttrs: false,
  props: {
    checkedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
    }
  },
  mounted() {
    this.dialogVisible = true
  },
  methods: {
    // 确定
    handleDialogConfirm() {
      if (!this.checkedRows.length) return this.$showToast('未选中任何行！')
      groupCustomerDelete({
        ids: this.checkedRows.map(item => item.id)
      }, { showLoading: true }).then(res => {
        this.$showToast('发起成功！', 'success')
        this.dialogVisible = false
        this.$emit('dialog-confirm')
      }).catch(err => {
        console.log(err)
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>