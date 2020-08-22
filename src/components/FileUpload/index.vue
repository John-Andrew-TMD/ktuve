<template>
  <div class="upload-container">
    <el-upload
      ref="upload"
      name="file"
      action="/upload.do"
      :data="{
        file_code: '',
        func_code: '',
        backup_type: '',
        business_id
      }"
      :file-list="fileList"
      multiple
      v-bind="$attrsAll"
      :on-change="handleFileChange"
      :on-error="handleFileUploadError"
      :on-success="handleFileUploadSuccess"
      :on-exceed="handleFileExceed"
      :on-remove="handleFileRemoved"
      v-on="$listeners"
    >
      <el-button slot="trigger" size="small" type="primary" :disabled="isDisabled || disabled">选择文件</el-button>
      <div slot="tip" class="el-upload__tip" style="line-height: 32px">{{ tips }}</div>
    </el-upload>
  </div>
</template>

<script>
const DEFAULT_MAX_FILE_SIZE = '5MB'
import ElUpload from './src/index.vue'
export default {
  components: {
    ElUpload
  },
  inheritAttrs: false,
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean, // 接收一个false/true, 用来控制按钮是否置灰
      default: false
    },
    maxSize: {
      type: String,
      default: '50MB' // 单位接受KB, MB , GB
    },
    uploadComplete: Function,
    onSuccess: Function,
    params: {
      type: Object,
      default() {
        return {}
      }
    },
    fileType: {
      type: String,
      default: 'pmm_leases_up'
    },
    id: {
      type: String,
      default: ''
    },
    businessId: {
      type: [String, Number],
      default: ''
    },
    autoUpload: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      business_id: +new Date(),
      fileList: [],
      waitUploadListLength: 0
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
          break
        case 'mb':
          return value * 1024 * 1024
          break
        case 'gb':
          return value * 1024 * 1024 * 1024
          break
        default:
          return DEFAULT_MAX_FILE_SIZE
          break
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
        'disabled': this.disabled
      }
    }
  },
  watch: {
    id: {
      handler(val) {
        if (!val) return
        this._getAttachmentsById()
      }
    }
  },
  created() {
    if (this.id) {
      this._getAttachmentsById()
    }
    if (this.businessId !== '') {
      this.business_id = this.businessId
    }
  },
  methods: {
    _getAttachmentsById() {
      this.$promiseRequest(
        {
          code: '209208',
          data: {
            file_type: this.fileType,
            business_id: this.id
          }
        },
        { showLoading: false }
      )
        .then(res => {
          if (res.data.record.length) {
            this.$emit('input', res.data.record[0].system_buniness_id)
            this.business_id = res.data.record[0].system_buniness_id
            this.fileList = res.data.record.map(item => {
              return {
                name: item.original_name,
                response: {
                  original_name: item.original_name,
                  file_name: item.file_name,
                  file_id: item.file_id,
                  file_format: item.file_format,
                  rela_path: item.rela_path,
                  file_abs_path: item.abs_path
                }
              }
            })
          }
        })
        .catch(err => {
          this.$showToast('buniness_id获取失败，请关闭弹框重新获取！')
        })
    },
    handleFileChange(file, fileList) {
      this.waitUploadListLength = fileList.length
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
      this.$emit('remove', file, fileList)
      if (!fileList.length) {
        this.$emit('input', '')
        this.$emit('change', file, fileList)
      }
    },
    handleFileUploadSuccess(response, file, fileList) {
      this.$emit('on-success', response, file, fileList)
      this.$nextTick(() => {
        this.judgeUploadComplete(fileList)
      })
    },
    handleFileUploadError(err, file, fileList) {
      this.$showToast(`文件“${file.name}”上传失败，请重新上传！`)
      this.$nextTick(() => {
        this.judgeUploadComplete(fileList)
      })
    },
    handleFileExceed() {
      this.$showToast(`最多可上传${this.$attrs.limit}个文件！`)
    },
    submitUpload() {
      if (this.waitUploadListLength) {
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
        this.$emit('upload-complete')
      }
    },
    setData(data = []) {
      this.fileList = data
    }
  }
}
</script>

<style lang="scss" scoped></style>
