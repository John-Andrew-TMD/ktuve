<template>
  <el-dialog
    v-transfer-dom
    title="导入自定义计划错误日志"
    :modal-append-to-body="false"
    :visible.sync="showDialog"
    width="600px"
    @closed="handleDialogClosed"
  >
    <div class="dialog-body">
      <div class="logs-container">
        <h4>输出日志</h4>
        <div>
          <transition name="fade">
            <ul v-if="logList.length" class="log-list">
              <li>
                <i class="el-icon-check">开始上传文件</i>
              </li>
              <li v-for="(item, index) in logList" :key="index">
                <i
                  :class="{
                    'el-icon-check': item.code === '0',
                    'el-icon-warning-outline': item.code === '1',
                    'el-icon-close': item.code === '2'
                  }"
                >{{ item.msg }}</i>
              </li>
            </ul>
          </transition>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClose">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      showDialog: false
    };
  },
  props: {
    logList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  mounted() {
    this.showDialog = true;
  },
  methods: {
    handleDialogClose() {
      this.showDialog = false;
    },
    handleDialogClosed() {
      this.$emit("update:showLogsDialog", false);
    }
  }
};
</script>

<style lang='scss' scoped>
.logs-container {
  .log-list {
    padding: 10px;

    i {
      line-height: 20px;
    }
  }
  .el-icon-check {
    color: #67C23A;
  }
  .el-icon-warning-outline, .el-icon-close {
    color: #FF0000;
  }
}

</style>
