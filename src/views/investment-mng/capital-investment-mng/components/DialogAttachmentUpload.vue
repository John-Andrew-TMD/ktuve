<template>
  <div>
    <el-dialog
      width="500px"
      :modal-append-to-body="false"
      title="附件上传"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { attachmentUpload } from 'api/investment-mng/api-capital-investment-mng.js'
import { isEmptyObj } from 'utils'
export default {
  inheritAttrs: false,
  props: {
    uploadParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: false,
      formApi: null,
      formRules: [
        // {
        //   type: 'el-custom-select',
        //   title: '附件类型',
        //   field: 'enclosureId',
        //   validate: this.formValidate({ required: true }),
        //   props: {
        //     params: {
        //       url: pmmEnclosure,
        //       data: {

        //       },
        //       labelKey: 'dataContent',
        //       valueKey: 'enclosureId'
        //     }
        //   }
        // },
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
      }
    }
  },
  mounted() {
    this.dialogVisible = true
  },
  methods: {
    // 确定
    handleDialogConfirm() {
      if (isEmptyObj(this.uploadParams)) return this.$showToast('文件上传参数错误！')
      this.formApi.validate(async valid => {
        if (valid) {
          this.formApi.el('file').submitUpload()
        }
      })
    },
    handleAttachUploadComplete(data) {
      const { fileList, fileAddedIdList } = data
      if (!fileAddedIdList.length) return this.$showToast('文件Id不允许为空！')
      const params = {
        dataType: this.uploadParams.dataType,
        menuType: '0',
        enclosureId: this.uploadParams.enclosureId,
        addFileId: fileAddedIdList
      }
      const files = fileList.map(item => {
        const res = item.response
        return {
          dataType: this.uploadParams.dataType,
          id: res.id,
          fileId: res.fileId,
          enclosureId: this.uploadParams.enclosureId,
          name: res.fileName,
          sysEtime: res.sysEtime,
          sysEditorId: res.sysEditorId
        }
      })
      attachmentUpload(params)
        .then(res => {
          this.$showToast('上传成功！', 'success')
          this.dialogVisible = false
          this.$emit('dialog-confirm', files)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
