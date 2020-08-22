<template>
  <el-dialog
    :title="dialogTitle"
    custom-class="dialog-finance-report-upload"
    :visible.sync="dialogShow"
    :modal-append-to-body="false"
    width="750px"
    @closed="handleDialogClosed"
  >
    <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogShow=false">取 消</el-button>
      <el-button v-if="action!='Q'" type="primary" @click="handleDialogSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { queryDictItems, queryDictValue, isEmptyObj } from 'utils'
import { custFollowUpAdd, custFollowUpUpdate } from 'api/customer-module/api-customer-detail.js'

export default {
  props: {
    action: {
      type: String,
      default: 'A'
    },
    dialogTitle: {
      type: String,
      default: ''
    },
    rowData: {
      type: Object,
      default: () => {}
    },
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogShow: false,
      formApi: null,
      formRules: [
        { type: 'hidden', title: '客户ID', field: 'custId', value: this.routeParams.id },
        { type: 'hidden', title: '客户跟进ID', field: 'id' },
        {
          type: 'select',
          title: '跟进事项',
          field: 'followUpMatter',
          options: queryDictItems('10017'),
          style: { width: "200px" },
          col: { span: 12 },
          validate: [{ required: true, message: '请选择跟进事项', trigger: 'blur' }]
        },
        {
          type: 'input',
          title: '跟进人员',
          field: 'followUpStaff',
          style: { width: "200px" },
          col: { span: 12 },
          validate: [{ required: true, message: '请输入跟进人员', trigger: 'blur' }]
        },
        {
          type: 'el-date-picker',
          title: '跟进日期',
          field: 'followUpTime',
          props: { valueFormat: 'timestamp' },
          style: { width: "200px" },
          col: { span: 12 },
          validate: [{ required: true, message: '请输入跟进时间', trigger: 'blur' }]
        },
        {
          type: 'input',
          title: '跟进对象',
          field: 'followUpPeople',
          style: { width: "200px" },
          col: { span: 12 }
        },
        {
          type: 'select',
          title: '跟进方式',
          field: 'followUpManner',
          options: queryDictItems('10018'),
          style: { width: "200px" },
          col: { span: 12 },
        },
        {
          type: 'input',
          title: '跟进对象职务',
          field: 'followUpPeoplePosition',
          style: { width: "200px" },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          field: 'visitAdress',
          title: '拜访地点',
          style: { width: "200px" },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        { 
          type: 'input',
          title: '陪同人员',
          field: 'accompanyPerson',
          style: { width: "200px" },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '描述',
          field: 'remark',
          style: { width: "560px" },
          props: {
            type: 'textarea',
            rows: "1"
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'el-custom-upload',
          field: 'attachment',
          title: '附件',
          col: { span: 24 },
          props: {
            disabled:true,
            autoUpload: false
          },
          on: {
            'upload-complete': this.handleAttachUploadComplete
          }
        }
      ],
      formOptions: {
        form: { labelWidth: '120px' },
        submitBtn: { show: false }
      },
    }
  },
  mounted() {
    this.dialogShow = true
    this.$nextTick(() => {
      this.initUI()
    })
  },
  methods: {
    initUI() {
      if(this.action != 'A' && !isEmptyObj(this.rowData)){
				this.formApi.updateRules({
					attachment: {
						props: {
							params: {
								businessId: this.rowData.id,
								businessType: 0
							}
						}
					}
				},true)
				this.formApi.updateOptions({
					form: { disabled: this.action == 'Q' }
				})
				const newData = { ...this.rowData }
				this.formApi.setValue(newData)
			}
    },
    handleAttachUploadComplete() {
      this.isAttachmentUploadSuccess = true
      this.addOrUpdateSubmit()
    },
    //确定按钮
    handleDialogSubmit() {
      this.formApi.validate(valid => {
        if (valid) {
          const data = this.formApi.formData()
          data.custId = this.routeParams.id
          this.requestParams = data
          this.formApi.el('attachment').submitUpload()
        }
      })
    },
    //附件上传成功后新增或修改
    addOrUpdateSubmit() {
      if (this.isAttachmentUploadSuccess) {
        const fileDom = this.formApi.el('attachment')
        this.requestParams.addFileId = fileDom.fileAddedIdList
        if(this.action == 'U') {
          this.requestParams.deleteFileId = fileDom.fileDeletedList
          custFollowUpUpdate(this.requestParams, { showLoading: true }).then(res => {
            this.$showToast('修改成功！', 'success')
            this.dialogShow = false
            this.$emit('dialog-confirm')
          }).catch(err => {
            console.log(err)
          })
        } else {
          custFollowUpAdd(this.requestParams, { showLoading: true }).then(res => {
            this.$showToast('新增成功！', 'success')
            this.dialogShow = false
            this.$emit('dialog-confirm')
          }).catch(err => {
            console.log(err)
          })
        }
      }
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang='scss'>
.dialog-finance-report-upload {
  .el-date-editor, .el-cascader, .el-select {
    width: 100%;
  }
}

</style>
