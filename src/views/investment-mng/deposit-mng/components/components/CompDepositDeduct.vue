<template>
  <div class="comp-deposit-deduct">
    <form-create v-model="fBaseApi" :rule="fBaseRules" label-suffix="：" :option="formOptions" />
    <el-row class="rent-plan-wrapper">
      <el-col :span="24">
        <rent-plan-table ref="rentPlanDom" />
      </el-col>
    </el-row>
    <form-create v-model="fItemApi" :rule="fItemRules" :option="formOptions" />
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
import RentPlanTable from './CompRentPlanTable'
import DialogAttachment from './DialogAttachment.vue'
import CompAttachmentTable from './CompAttachmentTable.vue'
import { getAttachment } from 'api/investment-mng/api-deposit-mng.js'

export default {
  components: {
    RentPlanTable,
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
      fBaseApi: {},
      fBaseRules: [
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
          children: ['保证金信息'],
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
          title: '可抵金额',
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
          type: 'select',
          field: 'loan_id',
          title: '租金计划表',
          options: [],
          col: { span: 11 },
          style: { width: '100%' },
          validate: this.formValidate({ required: true }),
          on: {
            change: v => {}
          }
        }
      ],
      fItemApi: {},
      fItemRules: [
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
        this.fBaseApi.setValue(formData)
        this.fBaseApi.updateOptions({
          form: {
            disabled: !this.canEdit
          }
        })
      })
    },
    getCanUseAmount(formData) {
      // 可抵金额 = 保证金额余额-待退金额
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
    validateForm() {
      return new Promise((resolve, reject) => {
        this.fBaseApi.validate(async valid => {
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
.comp-deposit-deduct {
  max-width: 1200px;
  /deep/ .form-create {
    .el-form-title {
      font-weight: bold;
    }
  }
  .rent-plan-wrapper {
    margin-bottom: 20px;
  }
  .btn-groups {
    padding: 10px 10px 20px 0;
  }
}
</style>
