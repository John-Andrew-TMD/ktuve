<template>
  <el-dialog
    :title="dialogTitle"
    custom-class="dialog-finance-report-upload"
    :visible.sync="dialogShow"
    :modal-append-to-body="false"
    width="600px"
    @closed="handleDialogClosed"
  >
    <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogShow=false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { queryDictItems, queryDictValue, isEmptyObj } from 'utils'
import { getExcelData } from 'components/ElFileImport/js/import-excel.js'
import { custFinanceAdd, custFinanceUpdate } from 'api/customer-module/api-customer-detail.js'

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
    selectedData: {
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
        {
          type: 'select',
          title: '企业类型',
          field: 'companyType',
          options: [
            {
              value: '0',
              label: '企业'
            },
            {
              value: '4',
              label: '事业单位'
            }
          ],
          validate: this.formValidate({ required: true })
        },
        {
          type: 'select',
          title: '报表类型',
          field: 'reportType',
          options: queryDictItems('10020'),
          validate: this.formValidate({ required: true }),
          on: {
            change: this.generateFinancialTitle
          }
        },
        {
          type: 'select',
          title: '报表细分类型',
          field: 'reportDetailedType',
          options: queryDictItems('10021'),
          validate: this.formValidate({ required: true })
        },
        {
          type: 'el-date-picker',
          title: '报告日期',
          field: 'reportDate',
          props: { valueFormat: 'timestamp' },
          validate: this.formValidate({ required: true }),
          on: {
            change: this.generateFinancialTitle
          }
        },
        {
          type: 'input',
          title: '财报标题',
          field: 'finStatementHeadline',
          props: { disabled: true },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'radio',
          title: '是否已审计',
          value: '0',
          field: 'isAudit',
          options: queryDictItems('10004'),
          validate: this.formValidate({ required: true }),
          control: [
            {
              value: '1',
              rule: [
                {
                  type: 'input',
                  title: '审计事务所名称',
                  field: 'auditFirmName',
                  validate: this.formValidate({ required: true })
                },
                {
                  type: 'input',
                  title: '审计人员名称',
                  field: 'auditorsName',
                  validate: this.formValidate({ required: true })
                },
                {
                  type: 'el-date-picker',
                  title: '审计日期',
                  field: 'auditDate',
                  props: { valueFormat: 'timestamp' },
                  validate: this.formValidate({ required: true })
                }
              ]
            }
          ]
        },
        {
          type: 'el-custom-upload',
          title: '财务报表',
          field: 'report',
          props: {
            limit: 1
          },
          validate: this.formValidate({ required: true }),
          on: {
            change: this.handleReportFileChange,
            'upload-complete': this.handleReportUploadComplete
          }
        },
        {
          type: 'el-custom-upload',
          title: '财务报告附件',
          field: 'attachment',
          props: {
            autoUpload: false,
            accept: 'doc,docx,xls,xlsx,pdf'
          },
          on: {
            'upload-complete': this.handleAttachUploadComplete
          }
        }
      ],
      formOptions: {
        form: {
          labelWidth: '140px'
        },
        submitBtn: {
          show: false
        }
      },
      upExcel: null
    }
  },
  // inject: ['getCustInfoField'],
  mounted() {
    this.dialogShow = true
    this.$nextTick(() => {
      this.initUI()
    })
  },
  methods: {
    initUI() {
      // this.formApi.setValue('companyType', this.getCustInfoField('enterpriseType'))
      if (this.action === 'U' && !isEmptyObj(this.selectedData)) {
        this.formApi.updateRules({
          report: {
            props: {
              params: {
                businessId: this.selectedData.id,
                businessType: 0
              }
            }
          },
          attachment: {
            props: {
              params: {
                businessId: this.selectedData.id,
                businessType: 1
              }
            }
          }
        })
        this.formApi.setValue('report', 'report')
        this.formApi.setValue('isAudit', this.selectedData.isAudit)
        this.$nextTick(() => {
          this.formApi.setValue(this.selectedData)
        })
      }
    },
    // 文件发生变化解析数据
    async handleReportFileChange(file) {
      if (!file) {
        this.upExcel = null
        return
      }
      const excelObj = await getExcelData(file.raw)
      if (isEmptyObj(excelObj)) return
      const tempObj = {}
      const { dataSheets, dataBody } = excelObj
      if (Array.isArray(dataBody)) {
        dataBody.forEach((item, index) => {
          stringify(item)
          tempObj[dataSheets[index]] = item
        })
      }
      function stringify(data) {
        data.forEach(item => {
          for (let i = 0; i < item.length; i++) {
            item[i] = item[i] + ''
          }
        })
      }
      this.upExcel = Object.freeze(tempObj)
    },
    handleReportUploadComplete() {
      // this.requestParams.addFinFileId =
      // this.requestParams.addFinFileId = fileList[0].response.id
      this.isReportTableUploadSuccess = true
      this.addOrUpdateSubmit()
    },
    // 附件上传完毕
    handleAttachUploadComplete(fileList) {
      // const ids = fileList.map(item => item.response.id)
      // this.requestParams.addFileId = ids
      this.isAttachmentUploadSuccess = true
      this.addOrUpdateSubmit()
    },
    handleDialogConfirm() {
      this.formApi.validate(async valid => {
        if (valid) {
          const params = this.formApi.formData()
          params.upExcel = this.upExcel
          this.requestParams = params
          this.formApi.el('report').submitUpload()
          this.formApi.el('attachment').submitUpload()
        }
      })
    },
    addOrUpdateSubmit() {
      if (this.isReportTableUploadSuccess && this.isAttachmentUploadSuccess) {
        this.requestParams.custId = this.routeParams.id
        const reportDom = this.formApi.el('report')
        const upExcelDom = this.formApi.el('attachment')
        this.requestParams.addFinFileId = reportDom.fileAddedIdList.join(',')
        this.requestParams.addFileId = upExcelDom.fileAddedIdList
        if (this.action === 'A') {
          custFinanceAdd(this.requestParams, { showLoading: true })
            .then(res => {
              this.$showToast('新增成功！', 'success')
              this.dialogShow = false
              this.$emit('dialog-confirm')
            })
            .catch(err => {
              console.log(err)
            })
            .finally(() => {
              this.isReportTableUploadSuccess = false
              this.isAttachmentUploadSuccess = false
            })
        } else if (this.action === 'U') {
          this.requestParams.businessId = this.selectedData.id
          this.requestParams.id = this.selectedData.id
          this.requestParams.deleteFinFileId = reportDom.fileDeletedList.join(',')
          this.requestParams.deleteFileId = upExcelDom.fileDeletedList
          custFinanceUpdate(this.requestParams, { showLoading: true })
            .then(res => {
              this.$showToast('修改成功！', 'success')
              this.dialogShow = false
              this.$emit('dialog-confirm')
            })
            .catch(err => {
              console.log(err)
            })
            .finally(() => {
              this.isReportTableUploadSuccess = false
              this.isAttachmentUploadSuccess = false
            })
        }
      }
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    },
    // 生成财报标题(格式：年份 + 报告类型 + 报告)
    generateFinancialTitle() {
      let { reportType, reportDate } = this.formApi.formData()
      if (!reportType || !reportDate) return
      reportType = queryDictValue('10020', reportType)
      const reportYear = new Date(reportDate).getFullYear()
      this.formApi.setValue('finStatementHeadline', `${reportYear}年${reportType}报告`)
    }
  }
}
</script>

<style lang='scss'>
.dialog-finance-report-upload {
  .el-date-editor,
  .el-cascader,
  .el-select {
    width: 100%;
  }
}
</style>
