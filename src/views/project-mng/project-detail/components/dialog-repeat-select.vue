<template>
  <el-dialog
    :visible.sync="dialogShow"
    title="请选择"
    width="500px"
    :modal-append-to-body="false"
    @closed="handleDialogClosed"
  >
    <el-form
      ref="formDom"
      :model="formItems"
      :rules="formRules"
      @submit.native.prevent
    >
      <el-form-item label="是否需要重报表决" prop="is_repeat_vote">
        <el-radio-group v-model="formItems.is_repeat_vote">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogShow=false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogShow: false,
      formItems: {
        is_repeat_vote: '',
      },
      formRules: {
        is_repeat_vote: this.formValidate({ required: true })
      },
    }
  },
  created() {
    this._initUI()
  },
  mounted() {
    this.dialogShow = true
  },
  methods: {
    _initUI() {},
    handleDialogConfirm() {
      this.$refs.formDom.validate(async valid => {
        if (valid) {
          this.dialogShow = false
          const tempObj = Object.assign({}, this.formItems)
          this.$emit('dialogConfirm', tempObj)
        }
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>
