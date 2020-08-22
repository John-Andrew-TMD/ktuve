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
      :key="file.uid"
      :class="['el-upload-list__item', 'is-' + file.status, focusing ? 'focusing' : '']"
      tabindex="0"
      @keydown.delete="!disabled && $emit('remove', file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false"
    >
      <slot :file="file">
        <img
          v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          alt
        >
        <a class="el-upload-list__item-name" @click="handleClick(file)">
          <i class="el-icon-document" />
          {{ file.name }}
        </a>
        <div v-if="file.status === 'success'" class="tools-list">
          <span @click="handleFilePreview(file)">预览</span>
          <span v-if="file.response.id" @click="handleFileDownload(file)">下载</span>
          <span v-if="!disabled" @click="handleFileDelete(file)">删除</span>
        </div>

        <label v-if="file.status === 'ready'" class="el-upload-list__item-status-label">
          <i
            :class="{
              'el-icon-upload-success': true,
              'el-icon-circle-check': listType === 'text',
              'el-icon-check': ['picture-card', 'picture'].indexOf(listType) > -1
            }"
          />
        </label>
        <i
          v-if="!disabled && file.status === 'ready'"
          class="el-icon-close"
          @click="$emit('remove', file)"
        />
        <!-- <i class="el-icon-close-tip" v-if="!disabled">{{ t('el.upload.deleteTip') }}</i> 因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上 -->
        <el-progress
          v-if="file.status === 'uploading'"
          :type="listType === 'picture-card' ? 'circle' : 'line'"
          :stroke-width="listType === 'picture-card' ? 6 : 2"
          :percentage="parsePercentage(file.percentage)"
        />
        <span v-if="listType === 'picture-card'" class="el-upload-list__item-actions">
          <span
            v-if="handlePreview && listType === 'picture-card'"
            class="el-upload-list__item-preview"
            @click="handlePreview(file)"
          >
            <i class="el-icon-zoom-in" />
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="$emit('remove', file)">
            <i class="el-icon-delete" />
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
import { attachmentDownload, attachmentPreview } from 'api/file-system.js'

export default {
  name: 'ElUploadList',
  components: { ElProgress },

  mixins: [Locale],

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
    listType: String
  },

  data() {
    return {
      focusing: false
    }
  },
  methods: {
    parsePercentage(val) {
      return parseInt(val, 10)
    },
    handleClick(file) {
      this.handlePreview && this.handlePreview(file)
    },
    handleFilePreview(file) {
      window.open(`${attachmentPreview}?id=${file.response.id}`)
      // formSubmit(
      //   attachmentPreview,
      //   {
      //     id: file.response.businessId
      //   },
      //   'get'
      // )
    },
    handleFileDownload(file) {
      formSubmit(
        attachmentDownload,
        {
          id: file.response.id
        },
        'post'
      )
    },
    handleFileDelete(file) {
      this.$emit('remove', file)
    //   this.$confirm(
    //     `确定删除文件“${file.response.original_name}”? 删除后文件将无法还原！`,
    //     '提示',
    //     {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }
    //   )
    //     .then(() => {
    //       this.$promiseRequest({
    //         code: '200085',
    //         data: {
    //           file_id: file.response.file_id
    //         }
    //       }).then(res => {
    //         if (res.flag == 1) {
    //           this.$message.success('删除成功!')
    //           this.$emit('remove', file)
    //         }
    //       })
    //     })
    //     .catch(() => {})
    }
  }
}
</script>
<style lang="scss">
.el-upload-list {
  &.el-upload-custom-style {
    padding: 1px 7px 11px;
    border-radius: 3px;
    background: #F1F2F3;
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
    color: #1890FF;
    span {
      margin-left: 7px;
      font-size: 12px;
      cursor: pointer;
      transition: opacity .3s;
      opacity: .5;
      &:last-child {
        color: #FF0000;
      }
      &:hover {
        opacity: 1;
      }
    }
  }
}

</style>
