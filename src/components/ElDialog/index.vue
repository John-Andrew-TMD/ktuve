<template>
  <div :class="{'inline-dialog': inline}" v-transfer-dom>
    <el-dialog
      :visible.sync="dialogShow"
      :modal-append-to-body="false"
      :modal="!inline"
      v-bind="$attrs"
      v-on="$listeners"
      @closed="handleDialogClosed"
    >
      <slot></slot>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow=false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogShow: false
    };
  },
  inheritAttrs: false,
  props: {
    inline: {
      type: Boolean,
      default: false
    },
    dialogConfirm: {
      type: Function
    }
  },
  mounted() {
    this.dialogShow = true;
  },
  methods: {
    handleDialogClosed() {
      this.$emit('closed')
      this.$emit("update:dialogStatus", false);
    },
    handleDialogConfirm() {
      new Promise((resolve, reject) => {
        this.dialogConfirm && this.dialogConfirm(resolve, reject);
      })
        .then(res => {
          this.dialogShow = false;
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang='scss'>
</style>
