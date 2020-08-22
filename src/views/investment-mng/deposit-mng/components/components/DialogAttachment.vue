<template>
  <div class="inline-dialog">
    <el-dialog
      title="上传附件"
      :visible.sync="dialogVisible"
      :modal="false"
      width="500px"
      class="comp-dialog-attachement"
      @closed="handleDialogClosed"
    >
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
  data() {
    return {
      dialogVisible: true,
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
              this.formApi.setValue('dataContent', oData.data.dataContent)
            }
          }
        },
        {
          type: 'hidden',
          field: 'dataContent',
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
      fileList: []
    }
  },
  methods: {
    handleAttachUploadComplete({ fileList }) {
      const formData = this.formApi.formData()
      const files = fileList.map(item => {
        return {
          ...item.response,
          enclosureId: formData.enclosureId,
          menuType: MENU_TYPE,
          dataContent: formData.dataContent,
          fileId: item.response.id
        }
      })
      this.fileList = files.concat(this.fileList || [])
      this.$emit('upload-complete', this.fileList)
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
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-dialog-attachement {
  /deep/ .el-dialog > .el-dialog__body {
    position: relative;
  }
}
</style>
