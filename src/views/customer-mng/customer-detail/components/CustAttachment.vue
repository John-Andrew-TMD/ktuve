<template>
  <div class="cust-attachment-comp">
    <div class="btn-group">
      <el-button :disabled="globalCanEdit" type="primary" @click="handleUploadClick">上传附件</el-button>
      <el-button
        type="primary"
        :disabled="!selectData || checkData.length"
        @click="handleFilePreview"
      >预览</el-button>
      <el-button type="primary" :disabled="!checkData.length" @click="handleFileDownload">下载</el-button>
      <el-button type="danger" :disabled="globalCanEdit || !checkData.length" @click="handleFileDelete">删除</el-button>
    </div>
    <table-create
      ref="tableDom"
      :options="table"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      title="上传附件"
      :visible.sync="dialogStatus"
      :modal-append-to-body="false"
      width="500px"
      @open="handleDialogOpen"
      @opened="handleDialogOpened"
      @closed="handleDialogClosed"
    >
      <form-create v-if="showForm" v-model="formApi" :rule="formRules" :option="formOptions" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogStatus = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import { formSubmit } from 'utils'

import {
  getAttachmentList,
  getAttachmentType,
  attachmentSave,
  attachmentDelete
} from 'api/customer-module/api-customer-detail.js'
import { attachmentPreview, attachmentDownload, bacthAttachmentDownload } from 'api/file-system.js'
export default {
  components: {
    TableCreate
  },
  props: {
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showForm: true,
      table: {
        requestParams: {
          url: getAttachmentList,
          data: {
            id: this.routeParams.id
          }
        },
        requestImmediate: true,
        showSerialNumber: true,
        showCheckbox: true,
        columns: [
          {
            attrs: {
              label: '附件类型',
              prop: 'dataContent'
            }
          },
          {
            attrs: {
              label: '文件名',
              prop: 'fileName'
            }
          },
          {
            attrs: {
              label: '上传时间',
              prop: 'sysEtime',
              formatter: row => {
                return Vue.filter('filterTimestamp')(row.sysEtime)
              }
            },
            filter: {
              name: 'timestamp'
            }
          },
          {
            attrs: {
              label: '上传人',
              prop: 'sysEditorId'
            },
            filter: { name: 'user' }
          },
          {
            attrs: {
              label: '备注',
              prop: 'remark'
            }
          }
        ]
      },
      formApi: null,
      formRules: [
        {
          type: 'select',
          title: '附件类型',
          field: 'enclosureId',
          validate: this.formValidate({ required: true, trigger: 'change' }),
          options: []
        },
        {
          type: 'el-custom-upload',
          title: '附件',
          field: 'file',
          validate: this.formValidate({ required: true }),
          on: {
            'upload-complete': this.handleAttachUploadComplete
          }
        },
        {
          type: 'input',
          title: '备注',
          field: 'remark',
          props: { type: 'textarea' }
        }
      ],
      formOptions: {
        form: { labelWidth: '85px' },
        submitBtn: { show: false }
      },
      checkData: [],
      selectData: null,
      dialogStatus: false,
      attachmentTypeOptions: []
    }
  },
  computed: {
    globalCanEdit() {
      return !this.routeParams.globalCanEdit
    }
  },
  created() {
    this.getAttachmentType()
  },
  methods: {
    getAttachmentType() {
      getAttachmentType({
        custCategory: this.routeParams.custCategory
      }).then(res => {
        if (res.data && Array.isArray(res.data.records)) {
          const ret = res.data.records.map(item => {
            return {
              dataContent: item.dataContent,
              enclosureId: item.enclosureId
            }
          })
          this.attachmentTypeOptions = ret
        }
      })
    },
    handleUploadClick() {
      this.dialogStatus = true
    },
    // 下载
    handleFileDownload() {
      const ids = this.checkData.map(item => item.fileId)
      if (ids.length === 1) {
        formSubmit(attachmentDownload, { id: ids[0] })
      } else {
        formSubmit(bacthAttachmentDownload, { ids })
      }
    },
    // 文件预览
    handleFilePreview() {
      formSubmit(attachmentPreview, { id: this.selectData.id }, 'get', '_blank')
    },
    // 文件删除
    handleFileDelete() {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const ids = this.checkData.map(item => item.id)
          attachmentDelete({ ids })
            .then(res => {
              this.$showToast('删除成功', 'success')
              this.$refs.tableDom.searchTableData({ id: this.routeParams.id })
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    handleCurrentChange(data) {
      this.selectData = data
    },
    handleSelectionChange(data) {
      this.checkData = data
    },
    handleDialogConfirm() {
      this.formApi.validate(valid => {
        if (valid) {
          this.formApi.el('file').submitUpload()
        }
      })
    },
    handleAttachUploadComplete() {
      const { enclosureId, remark } = this.formApi.formData()
      const fileAddedIdList = this.formApi.el('file').fileAddedIdList
      if (!fileAddedIdList.length) return this.$showToast('文件Id不允许为空！')
      const params = {
        custId: this.routeParams.id,
        enclosureId: enclosureId,
        addFileId: fileAddedIdList,
        remark
      }
      attachmentSave(params)
        .then(res => {
          this.$showToast('新增成功！', 'success')
          this.$refs.tableDom.refreshTable(true)
          this.dialogStatus = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDialogOpen() {
      this.showForm = true
    },
    handleDialogOpened() {
      this.formApi.updateRule(
        'enclosureId',
        {
          options: this.attachmentTypeOptions.map(item => {
            return {
              value: item.enclosureId,
              label: item.dataContent
            }
          })
        },
        true
      )
    },
    handleDialogClosed() {
      this.formApi.resetFields()
      this.showForm = false
    }
  }
}
</script>

<style lang="scss" scoped>
.cust-attachment-comp {
  padding: 0 10px;
  .btn-group {
    padding-top: 0;
    border-top: none;
  }
}

</style>
