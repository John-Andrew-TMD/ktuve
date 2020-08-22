<template>
  <transition-group
    tag="ul"
    :class="[
      'el-upload-list',
      'el-upload-list--' + listType,
      { 'is-disabled': disabled,
        'el-upload-custom-style': !!files.length
      }
    ]"
    name="el-list"
  >
    <li
      v-for="file in files"
      :class="['el-upload-list__item', 'is-' + file.status, focusing ? 'focusing' : '']"
      :key="file.uid"
      tabindex="0"
      @keydown.delete="!disabled && $emit('remove', file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false"
    >
      <slot :file="file">
        <img
          class="el-upload-list__item-thumbnail"
          v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
          :src="file.url"
          alt
        />
        <a class="el-upload-list__item-name" @click="handleClick(file)">
          <i class="el-icon-document"></i>
          {{file.name}}
        </a>
        <div class="tools-list" v-if="file.status === 'success'">
          <span @click="handleFilePreview(file)">在线预览</span>
          <span @click="handleFileDownload(file)" v-if="file.response.file_abs_path">下载</span>
          <span @click="handleFileDelete(file)" v-if="!disabled">删除</span>
        </div>

        <label class="el-upload-list__item-status-label" v-if="file.status === 'ready'">
          <i
            :class="{
            'el-icon-upload-success': true,
            'el-icon-circle-check': listType === 'text',
            'el-icon-check': ['picture-card', 'picture'].indexOf(listType) > -1
          }"
          ></i>
        </label>
        <i
          class="el-icon-close"
          v-if="!disabled && file.status === 'ready'"
          @click="$emit('remove', file)"
        ></i>
        <!-- <i class="el-icon-close-tip" v-if="!disabled">{{ t('el.upload.deleteTip') }}</i> 因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上 -->
        <el-progress
          v-if="file.status === 'uploading'"
          :type="listType === 'picture-card' ? 'circle' : 'line'"
          :stroke-width="listType === 'picture-card' ? 6 : 2"
          :percentage="parsePercentage(file.percentage)"
        ></el-progress>
        <span class="el-upload-list__item-actions" v-if="listType === 'picture-card'">
          <span
            class="el-upload-list__item-preview"
            v-if="handlePreview && listType === 'picture-card'"
            @click="handlePreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="$emit('remove', file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </slot>
    </li>
  </transition-group>
</template>
<script>
import Locale from 'element-ui/src/mixins/locale'
import ElProgress from 'element-ui/packages/progress'
import { formSubmit } from 'utils'

export default {
  name: 'ElUploadList',

  mixins: [Locale],

  data() {
    return {
      focusing: false
    }
  },
  components: { ElProgress },
  props: {
    files: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    handlePreview: Function,
    listType: String,
    autoUpload: Boolean
  },
  methods: {
    parsePercentage(val) {
      return parseInt(val, 10)
    },
    handleClick(file) {
      this.handlePreview && this.handlePreview(file)
    },
    handleFilePreview(file) {
      window.open(`/onlineView.do?file=${file.response.rela_path}`)
    },
    handleFileDownload(file) {
      let { file_name, file_format, file_abs_path } = file.response
      formSubmit(
        '/down.do',
        {
          file_name,
          file_format,
          file_path: file_abs_path
        },
        'get'
      )
    },
    handleFileDelete(file) {
      this.$confirm(`确定删除文件“${file.response.original_name}”? 删除后文件将无法还原！`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$promiseRequest({
            code: '100962',
            data: {
              file_id: file.response.file_id
            }
          }).then(res => {
            if (res.flag == 1) {
              this.$message.success('删除成功!')
              this.$emit('remove', file)
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss">
.el-upload-list {
  &.el-upload-custom-style {
    padding: 1px 7px 11px;
    border-radius: 3px;
    background: #f1f2f3;
  }
  .el-upload-list__item-name {
    margin-right: 130px;
  }
  .tools-list {
    position: absolute;
    top: 0;
    right: 0;
    height: 25px;
    font-size: 0;
    line-height: 25px;
    color: #1890ff;
    span {
      margin-left: 7px;
      font-size: 12px;
      cursor: pointer;
      transition: opacity 0.3s;
      opacity: 0.5;
      &:last-child {
        color: #ff0000;
      }
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
