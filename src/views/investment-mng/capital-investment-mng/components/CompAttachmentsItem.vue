<template>
  <div class="comp-attachments-item">
    <div class="header">
      <span>{{ title }}</span>
    </div>
    <el-checkbox-group v-model="checkList" @change="handleCheckChange">
      <div v-for="(item, index) in dataList" :key="index" class="item">
        <div class="item-left">
          <span :class="{required: item.isNecessary == '1'}">{{ item.dataContent }}</span>
          <el-button :disabled="!canEdit" type="primary" size="mini" @click="handleUploadClick(item)">上传</el-button>
        </div>
        <div class="item-right">
          <div v-for="(file, idx) in item.files" :key="idx">
            <div><el-checkbox :label="file.id">{{ file.name }}</el-checkbox></div>
            <div>
              <span>{{ file.sysEditorId | filterUserInfo }} {{ file.sysEtime | filterTimestamp }}</span>
              <span class="btn" @click="handleViewClick(file)">查看</span>
              <span class="btn" @click="handleDownloadClick(file)">下载</span>
              <span v-if="canEdit" class="btn" style="color: #F56C6C" @click="handleDeleteClick(file, item.files, idx)">删除</span>
            </div>
          </div>
        </div>
      </div>
    </el-checkbox-group>
  </div>
</template>
<script>
import { attachmentDownload, attachmentPreview } from 'api/file-system.js'
import { attachmentDeleteAById } from 'api/investment-mng/api-capital-investment-mng.js'
import { formSubmit } from 'utils'
export default {
  components: {
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    dataList: {
      type: Object,
      default: () => ([])
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      checkList: []
    }
  },
  methods: {
    // 上传按钮点击事件
    handleUploadClick(data) {
      this.$parent.showUploadDialog({
        dataType: data.dataType,
        enclosureId: data.enclosureId
      })
    },
    // 复选框change事件，调用父组件方法进行统一处理
    handleCheckChange() {
      this.$parent.handleChildCheckChange()
    },
    handleViewClick(file) {
      window.open(`${attachmentPreview}?id=${file.fileId}`)
    },
    handleDownloadClick(file) {
      formSubmit(
        attachmentDownload,
        {
          id: file.fileId
        },
        'post'
      )
    },
    handleDeleteClick(file, item, idx) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          attachmentDeleteAById({
            ids: [file.id]
          }, { showLoading: true }).then(res => {
            this.$showToast('删除成功！', 'success')
            item.splice(idx, 1)
          }).catch(err => {
            console.log(err)
          })
        })
        .catch(() => {})
    },
    // 获取复选框选中状态 0 未勾选任何项目 all 全选
    getCheckedStatus() {
      const checkedLength = this.checkList.length
      const dataLength = this.dataList.length
      if (checkedLength === 0) {
        return 0
      } else if (checkedLength === dataLength) {
        return 'all'
      } else {
        return checkedLength
      }
    },
    // 获取选中的值，父组件调用
    getCheckedList() {
      return this.checkList
    },
    // 设置复选框全选or清空勾选，父组件调用
    setAllOrEmpty(val) {
      if (!val) {
        this.checkList = []
      } else {
        this.checkList = []
        this.dataList.forEach(item => {
          item.files.forEach(file => {
            this.checkList.push(file.id)
          })
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.comp-attachments-item {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 43px;
    padding: 0px 10px;
    font-weight: bold;
    line-height: 42px;
    color: #303133;
    border-top: 1px solid #E3E8EE;
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #E3E8EE;
    & > div {
      height: auto;
      min-height: 43px;
      padding: 0px 10px;
      line-height: 42px;
    }
    .item-left {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      width: 33%;
      font-size: 14px;
      color: #303133;
      .el-button {
        margin-left: auto;
      }
    }
    .item-right {
      flex: 1;
      font-size: 14px;
      border-left: 1px solid #E3E8EE;
      & > div {
        display: flex;
        justify-content: space-between;
      }
    }
    .btn {
      margin-left: 10px;
      font-size: 12px;
      cursor: pointer;
      color: #409EFF;
      &:hover {
        opacity: .8;
      }
    }
    .required:before {
      margin-right: 4px;
      content: '*';
      color: #F56C6C;
    }
  }
}

</style>
