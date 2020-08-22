<template>
  <div class="comp-form-create-attachment">
    <el-button type="primary" class="btn-upload" @click="handleUploadClick">上传</el-button>
    <el-table :data="value" border>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="fileTypeName" label="附件类型" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="fileName" label="文件名" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDelete(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="上传附件"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"

      :modal="false"
      width="500px"
      class="comp-dialog-attachement"
      @open="handleDialogOpen"
      @opened="handleDialogOpened"
      @closed="handleDialogClosed"
    >
      <div
        class="el-loading-mask"
        style="background-color: rgba(0, 0, 0, 0.15);"
        v-show="showLoading"
      >
        <div class="el-loading-spinner">
          <svg viewBox="25 25 50 50" class="circular">
            <circle cx="50" cy="50" r="20" fill="none" class="path" />
          </svg>
          <p class="el-loading-text">上传中...</p>
        </div>
      </div>
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAttachmentTypeList } from 'api/investment-mng/api-deposit-mng.js'
const MENU_TYPE = '4'
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      showLoading: false,
      formApi: null,
      formRules: [
        {
          type: 'el-custom-select',
          title: '附件类型',
          field: 'enclosureId',
          validate: this.formValidate({ required: true, trigger: 'change' }),
          props: {
            params: {
              url: getAttachmentTypeList,
              data: {
                menuType: MENU_TYPE
              },
              labelKey: 'dataContent',
              valueKey: 'enclosureId'
            }
          },
          on: {
            change: oData => {
              this.formApi.setValue('fileTypeName', oData.data.dataContent)
            }
          }
        },
        {
          type: 'hidden',
          field: 'fileTypeName',
          title: '附件类型'
        },
        {
          type: 'el-custom-upload',
          title: '附件',
          field: 'file',
          validate: this.formValidate({ required: true }),
          on: {
            'upload-complete': this.handleAttachUploadComplete
          }
        }
      ],
      formOptions: {
        form: { labelWidth: '85px' },
        submitBtn: { show: false }
      },
      fileList: [],
      attachOptions: [],
      menuType: '4'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.fileList = this.value || []
    },
    handleUploadClick() {
      this.dialogVisible = true
    },
    handleAttachUploadComplete({ fileList }) {
      const formData = this.formApi.formData()
      const files = fileList.map(item => {
        return {
          ...item.response,
          enclosureId: formData.enclosureId,
          menuType: MENU_TYPE,
          fileTypeName: formData.fileTypeName
        }
      })
      this.fileList = files.concat(this.fileList || [])
      this.$emit('input', this.fileList)
      this.showLoading = false
      this.dialogVisible = false
    },
    handleDialogConfirm() {
      this.formApi.validate(valid => {
        if (valid) {
          this.showLoading = true
          this.formApi.el('file').submitUpload()
        }
      })
    },
    handleDelete(index) {
      this.fileList.splice(index, 1)
      this.$emit('input', this.fileList)
    },
    handleDialogOpened() {
      debugger
      console.log('opened')
      this.formApi.setValue('enclosureId', '')
    },
    handleDialogClosed() {
      console.log('colsed')
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-dialog-attachement {
  .el-loading-mask {
    position: fixed;
    top: 0;
    left: 0;
  }
}
.comp-form-create-attachment {
  .btn-upload {
    margin-bottom: 10px;
  }
}
</style>
