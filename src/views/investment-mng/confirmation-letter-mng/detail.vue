<template>
  <div class="app-content confirmation-letter-detail-page">
    <quote icon="customer" text="XXX询证函" />
    <div class="app-content-wrapper">
      <el-form
        ref="form"
        label-suffix="："
        :model="formModel"
        label-width="160px"
        class="static-form"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-link type="primary">{{formModel.test}}</el-link>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首次起租时间">{{formModel.test}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同数">{{formModel.test}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租金合计">{{formModel.test}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余租金">{{formModel.test}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余本金">{{formModel.test}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余利息">{{formModel.test}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余风险保证金金">{{formModel.test}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余续保风险金">{{formModel.test}}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <h3 class="form-title">询证函</h3>
      <el-form
        ref="form"
        label-suffix="："
        :model="formModel"
        label-width="160px"
        class="static-form"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="询证函编号">{{formModel.test}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据截止到（时间）">{{formModel.test}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="询证函">{{formModel.test}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统生成时间">{{formModel.test}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="询证函（回传）">{{formModel.test}}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import Quote from 'components/Quote/index'
import { queryDictItems, queryDictValue } from 'utils'
export default {
  components: {
    TableCreate,
    Quote
  },
  data() {
    return {
      formModel: {
        test: '士大夫艰苦撒旦发货'
      },
      fApi: null,
      formRules: [
        {
          type: 'input',
          field: 'custName',
          title: '客户名称',
          props: {
            disabled: true
          },
          col: { span: 11 }
        },
        {
          type: 'number-input',
          field: 'werwerew',
          title: '合同数',
          props: {
            disabled: true,
            needFormat: true
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
          type: 'number-input',
          field: 'rwerwerwe',
          title: '租金合计',
          props: {
            disabled: true,
            needFormat: true
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
          type: 'number-input',
          field: 'werasdasdwer',
          title: '剩余租金',
          props: {
            disabled: true,
            needFormat: true
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
          type: 'number-input',
          field: 'deductible_amounsdsdt',
          title: '剩余本金',
          props: {
            disabled: true,
            needFormat: true
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
          type: 'number-input',
          field: 'deductiblesdsd_amount',
          title: '剩余利息',
          props: {
            disabled: true,
            needFormat: true
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
          type: 'number-input',
          field: 'dedusdsdctible_amount',
          title: '剩余风险保证金金',
          props: {
            disabled: true,
            needFormat: true
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
          type: 'number-input',
          field: 'dedusdswewdctible_amount',
          title: '剩余续保风险金',
          props: {
            disabled: true,
            needFormat: true
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
          name: 'dialog_form_title',
          children: ['询证函'],
          className: 'el-form-title border-bottom'
        },
        {
          type: 'input',
          field: 'contractNo',
          title: '合同编号',
          props: {
            disabled: true
          },
          col: { span: 11 },
          style: { display: 'block' }
        },
        {
          type: 'select',
          field: 'bond_type',
          title: '保证金类型',
          options: queryDictItems('31904'),
          props: {
            disabled: true
          },
          col: { span: 11 },
          style: { width: '100%' }
        },
        {
          type: 'number-input',
          field: 'receivable_amount',
          title: '追加金额',
          props: {
            disabled: true,
            needFormat: true
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
          type: 'number-input',
          field: 'received_amount',
          title: '已收金额',
          props: {
            disabled: true,
            needFormat: true
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
          type: 'number-input',
          field: 'deductible_amount',
          title: '已抵金额',
          props: {
            disabled: true,
            needFormat: true
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
          type: 'number-input',
          field: 'deductible_amount232',
          title: '已退金额',
          props: {
            disabled: true,
            needFormat: true
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
          type: 'number-input',
          field: 'bond_balance',
          title: '保证金余额',
          props: {
            disabled: true,
            needFormat: true
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
          type: 'number-input',
          field: 'can_use_amount',
          title: '剩余补足金额',
          props: {
            disabled: true,
            needFormat: true
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
          type: 'number-input',
          field: 'complement_amount',
          title: '补足金额',
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
          field: 'complement_date',
          title: '计划收款日期',
          props: {
            valueFormat: 'timestamp'
          },
          col: { span: 11 },
          style: { width: '100%' },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          field: 'projectNamewe',
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
          field: 'remark',
          col: { span: 22 },
          props: {
            type: 'textarea',
            maxlength: 500
          }
        },
        {
          type: 'el-custom-upload',
          title: '附件',
          field: 'report_attach',
          col: { span: 22 },
          props: {
            autoUpload: true,
            id: `400300000`,
            fileType: '2'
          },
          on: {
            'on-success': this.handleAttachSucess
          }
        }
      ],
      formOptions: {
        form: { labelWidth: '150px' },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: '',
          data: {}
        },
        showTools: true,
        selectedRow: 0,
        showSerialNumber: true,
        colspanAttrs: ['projectName', 'custName', 'contractNo', 'accounting_entity'],
        tableBottomOffset: 85,
        requestImmediate: false,
        showLoading: false,
        columns: [
          {
            attrs: {
              prop: 'custName',
              label: '合同编号',
              minWidth: 140,
              showOverflowTooltip: true
            }
          },
          {
            attrs: {
              prop: 'contractNo',
              label: '项目编号',
              minWidth: 140,
              showOverflowTooltip: true
            }
          },
          {
            attrs: {
              prop: 'contractNo',
              label: '租赁起始日期',
              minWidth: 140,
              showOverflowTooltip: true
            }
          },
          {
            attrs: {
              prop: 'receivable_amount',
              label: '租赁到期日',
              minWidth: 130
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'receivable_amount',
              label: '合计租金',
              minWidth: 130
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'received_amount',
              label: '剩余租金（元）',
              minWidth: 130
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'deductible_amount',
              label: '剩余利息（元）',
              minWidth: 130
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'returned_amount',
              label: '剩余本金（元）',
              minWidth: 130
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'completed_amount',
              label: '剩余风险保证金金（元）',
              minWidth: 130
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'bond_balance',
              label: '剩余续保保证金金（元）',
              minWidth: 130
            },
            filter: {
              name: 'toThousand'
            }
          }
        ]
      },
      rowData: null,
      selectedRows: [],
      componentName: '',
      dialogStatus: false
    }
  },
  created() {
    this.initForm()
  },
  methods: {
    initForm() {},
    handleRowClick(rowData, column) {
      if (column.property === 'demo') {
        // TODO 页面调整
      }
    },
    handleCurrentChange(row) {
      this.rowData = row
    },
    handleSelectionChange(row) {},
    handleSearch() {
      const data = this.fApi.formData()
      this.refreshTable(data)
    },
    handleSearchReset() {
      this.fApi.resetFields()
      this.refreshTable()
    },
    handleButtonClick(name) {
      this.componentName = `DialogCreateLetter`
      this.dialogStatus = true
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data)
    },
    // 新增成功后，返回新增后的信息，用于页面跳转
    handleDialogConfirm(customerInfo) {}
  }
}
</script>

<style lang="scss">
.confirmation-letter-detail-page {
  .form-title {
    position: relative;
    font-size: 14px;
    padding-left: 10px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f1f4f5;
    margin-bottom: 4px;
    &::before {
      content: '';
      width: 3px;
      height: 18px;
      position: absolute;
      top: 50%;
      left: 0;
      background: #409eff;
      transform: translateY(-50%);
    }
  }
  .static-form {
    max-width: 1020px;
    .el-form-item {
      margin-bottom: 8px;
    }
    .el-link {
      vertical-align: inherit;
    }
  }
}
</style>
