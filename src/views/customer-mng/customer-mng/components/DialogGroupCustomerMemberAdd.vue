<template>
  <div>
    <el-dialog
      width="1100px"
      :modal-append-to-body="false"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <group-customer-member-action ref="actionDom" :selected-row="selectedRow" :action="action" :from="from" />
      <div slot="footer" class="dialog-footer">
        <template v-if="action==='A'">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDialogConfirm">发起审批</el-button>
        </template>
        <el-button v-else @click="dialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { groupMemberApprove } from 'api/customer-module/api-customer-mng.js'
import GroupCustomerMemberAction from './common-components/GroupCustomerMemberAction.vue'
export default {
  components: {
    GroupCustomerMemberAction
  },
  inheritAttrs: false,
  props: {
    selectedRow: {
      type: Object,
      default: null
    },
    action: {
      type: String,
      default: 'A'
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '集团成员维护'
    }
  },
  computed: {
    from() {
      return this.action === 'A' ? 'add' : 'detail'
    }
  },
  mounted() {
    if (this.action === 'V') {
      this.dialogTitle = '集团详情'
    }
    this.dialogVisible = true
  },
  methods: {
    // 确定
    async handleDialogConfirm() {
      const ret = await this.$refs.actionDom.validateForm()
      if(!ret) return
      const { commentMessage = '', fileAddedIdList = [] } = ret
      groupMemberApprove({
        id: this.selectedRow.id,
        commentMessage,
        fileIds: fileAddedIdList
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
