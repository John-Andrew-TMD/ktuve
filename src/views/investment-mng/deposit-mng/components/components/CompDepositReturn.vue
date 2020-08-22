<template>
  <div class="comp-deposit-return">
    <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    <comp-attachment-table :file-list.sync="fileList" :can-edit="canEdit" />
    <transition>
      <dialog-attachment
        v-if="dialogStatus"
        :dialog-status.sync="dialogStatus"
        @upload-complete="handleUploadComplete"
      />
    </transition>
  </div>
</template>

<script>
import DialogAttachment from './DialogAttachment.vue'
import CompAttachmentTable from './CompAttachmentTable.vue'
import { getAttachment } from 'api/investment-mng/api-deposit-mng.js'
export default {
  components: {
    DialogAttachment,
    CompAttachmentTable
  },
  props: {
    rowData: {
      type: Object,
      default: () => ({})
    },
    routeParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogStatus: false,
      fileList: [],
      formApi: {},
      formRules: [
        {
          type: 'i-button',
          children: ['项目信息'],
          className: 'el-form-title'
        },
        {
          type: 'hidden',
          field: 'id',
          title: 'ID'
        },
        {
          type: 'el-custom-text',
          field: 'projectName',
          title: '项目名称',
          col: { span: 11 }
        },
        {
          type: 'el-custom-text',
          title: '租赁类别',
          field: 'businessCategory',
          col: { span: 11 },
          props: {
            type: 'dict',
            dictNo: '10027'
          }
        },
        {
          type: 'el-custom-text',
          title: '租赁类型',
          field: 'businessType',
          col: { span: 11 },
          props: {
            type: 'dict',
            dictNo: '10026'
          }
        },
        {
          type: 'el-custom-text',
          field: 'custName',
          title: '客户名称',
          col: { span: 11 },
          props: {
            disabled: true
          }
        },
        {
          type: 'i-button',
          children: ['保证金退还信息'],
          className: 'el-form-title'
        },
        {
          type: 'el-custom-text',
          field: 'contractNo',
          title: '合同编号',
          col: { span: 11 }
        },
        {
          type: 'el-custom-text',
          field: 'riskfeeType',
          title: '保证金类型',
          props: {
            type: 'dict',
            dictNo: '10062'
          },
          col: { span: 11 }
        },
        {
          type: 'el-custom-text',
          field: 'contractAmount',
          title: '合同约定金额',
          props: {
            type: 'number'
          },
          col: { span: 11 },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['元']
            }
          ]
        },
        {
          type: 'el-custom-text',
          field: 'additionalAmount',
          title: '追加金额',
          props: {
            type: 'number'
          },
          col: { span: 11 },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['元']
            }
          ]
        },
        {
          type: 'el-custom-text',
          field: 'receivedAmount',
          title: '已收金额',
          props: {
            type: 'number'
          },
          col: { span: 11 },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['元']
            }
          ]
        },
        {
          type: 'el-custom-text',
          field: 'deductionedAmount',
          title: '已抵金额',
          props: {
            type: 'number'
          },
          col: { span: 11 },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['元']
            }
          ]
        },
        {
          type: 'el-custom-text',
          field: 'refundedAmount',
          title: '已退金额',
          props: {
            type: 'number'
          },
          col: { span: 11 },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['元']
            }
          ]
        },
        {
          type: 'el-custom-text',
          field: 'riskfeeBalance',
          title: '保证金余额',
          props: {
            type: 'number'
          },
          col: { span: 11 },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['元']
            }
          ]
        },
        {
          type: 'el-custom-text',
          field: 'canUseAmount',
          title: '可退金额',
          props: {
            type: 'number'
          },
          col: { span: 22 },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['元']
            }
          ]
        },
        {
          type: 'number-input',
          field: 'approvalAmount',
          title: '退还金额',
          props: {
            needFormat: true
          },
          col: { span: 11 },
          validate: this.formValidate({ required: true }),
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['元']
            }
          ]
        },
        {
          type: 'el-date-picker',
          field: 'planDate',
          title: '计划退还日期',
          props: {
            valueFormat: 'timestamp'
          },
          col: { span: 11 },
          style: { width: '100%' },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          field: 'applyMatters',
          title: '申请事项',
          col: { span: 22 },
          props: {
            type: 'textarea',
            maxlength: 500
          }
        },
        {
          type: 'input',
          title: '备注',
          field: 'remarks',
          col: { span: 22 },
          props: {
            type: 'textarea',
            maxlength: 500
          }
        },
        {
          type: 'el-button',
          title: '附件',
          props: {
            type: 'primary'
          },
          children: ['上传'],
          on: {
            click: () => {
              this.dialogStatus = true
            }
          }
        }
      ],
      formOptions: {
        form: {
          labelWidth: '120px'
        },
        submitBtn: { show: false }
      }
    }
  },
  computed: {
    canEdit() {
      return !this.routeParams.hasOwnProperty('canEdit') ? true : this.routeParams.canEdit
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      if (this.rowData && this.rowData.flowId) {
        this.getAttachmentData()
      }
      const formData = Object.assign({}, this.rowData)
      formData.canUseAmount = this.getCanUseAmount(formData)
      this.$nextTick(() => {
        this.formApi.updateRule('approvalAmount', {
          validate: this.formValidate({
            required: true,
            max: formData.canUseAmount,
            min: 0.01,
            message: '须大于0且小于等于可退金额'
          })
        })
        this.formApi.setValue(formData)
        this.formApi.updateOptions({
          form: {
            disabled: !this.canEdit
          }
        })
      })
    },
    getCanUseAmount(formData) {
      // 可退金额 = 保证金额余额-待退金额
      const riskfeeBalance = formData.riskfeeBalance ? Number(formData.riskfeeBalance) : 0
      const refundAmount = formData.refundAmount ? Number(formData.refundAmount) : 0
      return riskfeeBalance - refundAmount
    },
    getAttachmentData() {
      getAttachment(
        {
          loanId: this.rowData.id
        },
        { showLoading: true }
      ).then(res => {
        if (!res || !res.data) return
        this.fileList = res.data.records
      })
    },
    handleUploadComplete(files) {
      this.fileList = files.concat(this.fileList)
    },
    // 表单校验
    validForm() {
      return new Promise((resolve, reject) => {
        this.formApi.validate(valid => {
          if (valid) {
            resolve(true)
          }
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.comp-deposit-return {
  max-width: 1200px;
  /deep/ .form-create {
    .el-form-title {
      font-weight: bold;
    }
  }
  .table-wrapper {
    padding-left: 130px;
  }
  .btn-groups {
    padding: 10px 10px 20px 0;
  }
}
</style>
