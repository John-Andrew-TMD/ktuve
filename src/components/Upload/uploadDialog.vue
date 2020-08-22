<template>
    <el-dialog
      v-transfer-dom
      title="文件上传"
      :visible.sync="dialogShow"
      width="600px"
      @closed="handleDialogClosed"
      :modal-append-to-body="false"
    >
      <div class="dialog-body" style="min-height: 300px">
        <el-upload
          ref="upload"
          v-bind="$attrs"
           v-on="$listeners"
          @upload-complete="handleUploadComplete"
        ></el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow=false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
import ElUpload from "./index.vue";
export default {
  data() {
    return {
      dialogShow: false,
      fileList: []
    };
  },
  props: {
    dialogStatus: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: true
    }
  },
  inheritAttrs: false,
  components: {
    ElUpload
  },
  mounted() {
    this.dialogShow = true;
  },
  methods: {
    handleUploadComplete() {
      setTimeout(() => {
        this.dialogShow = false;
      }, 500)
    },
    handleDialogClosed() {
      this.$emit("update:dialogStatus", false);
    },
    handleDialogConfirm() {
      this.$refs.upload.submitUpload();
    }
  }
};
</script>
