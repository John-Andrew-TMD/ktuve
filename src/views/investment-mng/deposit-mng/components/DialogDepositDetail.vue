<template>
  <el-dialog
    title="保证金详情"
    class="dialog-deposit-detail"
    :visible.sync="dialogShow"
    width="980px"
    :modal-append-to-body="false"
    @closed="handleDialogClosed"
  >
    <div class="comp-deposit-detail">
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      <table-create ref="tableDom" :options="tableOptions" @row-click="handleRowClick">
        <template v-slot:fileId="{scope}">
          <template v-if="!scope.row.fileId">--</template>
          <template v-else>
            <el-link
              type="primary"
              style="margin-right:10px;"
              @click="handleFileView(scope.row.fileId)"
            >查看</el-link>
            <el-link type="primary" @click="handleFileDownload(scope.row.fileId)">下载</el-link>
          </template>
        </template>
      </table-create>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClosed">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import { depositChangeList } from 'api/investment-mng/api-deposit-mng.js'
import { attachmentPreview, attachmentDownload } from 'api/file-system.js'
import { formSubmit } from 'utils'

export default {
  components: {
    TableCreate
  },
  props: {
    rowData: {
      type: Object,
      default: () => ({})
    },
    deductNumber: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      formApi: {},
      formRules: [
        {
          type: 'i-button',
          children: ['项目信息'],
          className: 'el-form-title'
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
          type: 'i-button',
          children: ['保证金变更记录'],
          className: 'el-form-title'
        }
      ],
      formOptions: {
        form: {
          labelWidth: '130px'
        },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: depositChangeList,
          data: {
            riskfeeId: this.rowData.id
          }
        },
        showSerialNumber: true,
        showPagination: false,
        columns: [
          {
            attrs: {
              prop: 'flowType',
              label: '流程名称',
              minWidth: 120,
              'class-name': 'link-type',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              prop: 'riskfeeType',
              label: '类型',
              minWidth: 85
            },
            filter: {
              name: 'dict',
              params: ['10062']
            }
          },
          {
            attrs: {
              prop: 'approvalAmount',
              label: '金额',
              minWidth: 110
            },
            filter: { name: 'toThousand' }
          },
          {
            attrs: {
              prop: 'planDate',
              label: '金额变动时间',
              minWidth: 135
            },
            filter: {
              name: 'timestamp'
            }
          },
          {
            attrs: {
              prop: 'approvalState',
              label: '状态',
              minWidth: 90
            },
            filter: {
              name: 'dict',
              params: ['10064']
            }
          },
          {
            attrs: {
              prop: 'sysCreatorId',
              label: '申请人员'
            },
            filter: {
              name: 'user'
            }
          },
          {
            attrs: {
              prop: 'sysCtime',
              label: '申请日期',
              minWidth: 135
            },
            filter: {
              name: 'timestamp'
            }
          },
          {
            attrs: {
              prop: 'fileId',
              label: '审批要件',
              minWidth: 110
            },
            slot: true
          }
        ]
      },
      dialogShow: false
    }
  },
  mounted() {
    this.dialogShow = true
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.formApi.setValue(this.rowData)
      })
    },
    // 下载
    handleFileDownload(fileId) {
      formSubmit(attachmentDownload, { id: fileId })
    },
    // 查看
    handleFileView(fileId) {
      formSubmit(attachmentPreview, { id: fileId }, 'get', '_blank')
    },
    handleRowClick(rowData, column) {
      if (column.property === 'flowType') {
        this.$router.push({
          path: '/process/process-approval',
          query: {
            taskId: rowData.flowId
          }
        })
      }
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang='scss' scoped>
.dialog-deposit-detail {
  .comp-deposit-detail {
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
}
</style>
