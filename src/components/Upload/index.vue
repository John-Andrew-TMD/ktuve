<template>
  <div class="upload-container">
    <el-upload
      ref="upload"
      name="file"
      :action="action"
      :file-list="fileList"
      multiple
      v-bind="$attrsAll"
      :disalbed="true"
      :on-change="handleFileChange"
      :on-error="handleFileUploadError"
      :on-success="handleFileUploadSuccess"
      :on-exceed="handleFileExceed"
      :on-remove="handleFileRemoved"
      v-on="$listeners"
    >
      <el-button slot="trigger" :disabled="disabled" size="mini" type="primary">上传</el-button>
      <div slot="tip" class="el-upload__tip" style="line-height: 32px">{{ tips }}</div>
      <el-button v-if="showLoading" slot="tip" :loading="true" type="text" disabled>请求中...</el-button>
    </el-upload>
  </div>
</template>

<script>
const DEFAULT_MAX_FILE_SIZE = '200MB'
import ElUpload from './src/index.vue'
import { attachmentUpload, attachmentList } from 'api/file-system.js'
export default {
  components: {
    ElUpload
  },
  inheritAttrs: false,
  props: {
    maxSize: {
      type: String,
      default: '200MB' // 单位接受KB, MB , 2GB
    },
    uploadComplete: Function,
    onSuccess: Function,
    params: {
      type: Object,
      default: null
    },
    autoUpload: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: attachmentUpload
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: [],
      fileAddedIdList: [],
      fileDeletedList: [],
      showLoading: false // 反显附件时显示
    }
  },
  computed: {
    maxFileSize() {
      if (this.maxSize.length === 2) return DEFAULT_MAX_FILE_SIZE
      const unit = this.maxSize
        .slice(-2)
        .toString()
        .toLowerCase()
      const value = +this.maxSize.slice(0, -2)
      if (!value) return DEFAULT_MAX_FILE_SIZE
      switch (unit) {
        case 'kb':
          return value * 1024
        case 'mb':
          return value * 1024 * 1024
        case 'gb':
          return value * 1024 * 1024 * 1024
        default:
          return DEFAULT_MAX_FILE_SIZE
      }
    },
    tips() {
      if (this.$attrs.accept) {
        return `只能上传${this.$attrs.accept.replace(/,/g, '/')}类型文件，且单个文件不超过${this.maxSize}`
      } else {
        return `可上传任意类型文件，且单个文件不超过${this.maxSize}`
      }
    },
    $attrsAll() {
      return {
        ...this.$attrs,
        'auto-upload': this.autoUpload,
        disabled: this.disabled
      }
    }
  },
  watch: {
    params(obj) {
      if (!obj) return
      this.getAttachments(obj)
    },
    disabled(val) {
      console.log(val)
    }
  },
  methods: {
    getAttachments(params) {
      this.showLoading = true
      attachmentList(params).then(res => {
        if (res.data && Array.isArray(res.data.records)) {
          this.fileList = res.data.records.map(item => {
            return {
              name: item.fileName,
              response: {
                fileName: item.fileName,
                fileId: item.fileId,
                id: item.id,
                businessId: item.id
              }
            }
          })
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.showLoading = false
      })
    },
    handleFileChange(file, fileList) {
      if (file.response) return
      const { name, size } = file
      const extName = name.split('.').pop()
      if (this.$attrs.accept && !this.$attrs.accept.includes(extName)) {
        fileList.pop()
        this.$showToast('文件格式错误！')
        return false
      }
      if (this.maxSize && size > this.maxFileSize) {
        fileList.pop()
        this.$showToast('文件大小超出限制！')
        return false
      }
      this.$emit('input', name)
      this.$emit('change', file, fileList)
    },
    handleFileRemoved(file, fileList) {
      if (file.response && file.response.id) {
        const id = file.response.id
        this.fileDeletedList.push(id)
        const index = this.fileAddedIdList.indexOf(id)
        if (index !== -1) {
          this.fileAddedIdList.splice(index, 1)
        }
      }
      if (!fileList.length) {
        this.$emit('input', '')
        // this.$emit('change')
      }
    },
    handleFileUploadSuccess(response, file, fileList) {
      if (response.data) {
        this.fileAddedIdList.push(response.data.id)
      }
      this.$emit('on-success', response, file, fileList)
      this.judgeUploadComplete(fileList)
    },
    handleFileUploadError(err, file, fileList) {
      // console.log(err)
      // this.$showToast(`文件“${file.name}”上传失败，请重新上传！`)
      this.$showToast(err)
      this.$store.commit('app/HIDE_LOADING')
      // this.judgeUploadComplete(fileList)
    },
    handleFileExceed() {
      this.$showToast(`最多可上传${this.$attrs.limit}个文件！`)
    },
    submitUpload() {
      const waitUploadList = this.$refs.upload.uploadFiles
        .filter(file => ['ready', 'fail'].includes(file.status))
      if (waitUploadList.length) {
        this.$store.commit('app/SHOW_LOADING')
        this.$refs.upload.submit()
      } else {
        this.$emit('upload-complete')
      }
    },
    judgeUploadComplete(fileList) {
      const res = fileList.every(item => !!item.response)
      if (res) {
        this.$store.commit('app/HIDE_LOADING')
        if (!fileList.length) return
        this.$emit('upload-complete', {
          fileList,
          fileAddedIdList: this.fileAddedIdList,
          fileDeletedList: this.fileDeletedList
        })
      }
    },
    setData(data = []) {
      this.fileList = data
    }
  }
}
</script>

<style lang="scss" scoped></style>
