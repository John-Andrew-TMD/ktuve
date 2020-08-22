<template>
  <div>
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">金融质押品</span>
        <div class="panel-tools" v-if="routeParams.canEdit">
          <el-button type="primary" @click="handleBtnClick('新增金融质押品','A')">新增金融质押品</el-button>
          <el-button
            type="primary"
            :disabled="!selectData || checkData.length"
            @click="handleBtnClick('修改金融质押品','U', selectData)"
          >修改</el-button>
          <el-button type="danger" :disabled="!checkData.length" @click="handleDeleteClick">删除</el-button>
        </div>
      </div>
    </div>
    <div class="content-body">
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
        :show-summary="true"
        :ignore-columns="[1, 2, 3, 4, 5, 8, 9, 10,]"
      />
    </div>
    <el-dialog
      v-transfer-dom
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      width="800px"
      @closed="handleDialogClosed"
    >
      <form-create v-model="formApi" :rule="formRules" :option="option" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TableCreate from 'components/TableCreate/index'
import pawnData from './js/pawn-type.min'
import PAWN from './js/pawn-dict.min'
import { queryFinance, addFinance, updateFinance, deleteFinance } from 'api/project-module/api-project-mortgage-collateral.js'
import { agencyList } from 'api/customer-module/api-appraisal-agency-mng.js'
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
      dialogVisible: false,
      dialogTitle: '',
      action: 'A',
      formApi: {},
      formRules: [
        { type: 'hidden', title: '金融质押物ID', field: 'id' },
        {
          type: 'input',
          title: '质押物名称',
          field: 'pawnName',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'cascader',
          title: '押品类型',
          field: 'pawnType',
          col: { span: 12 },
          props:{
            options: this.formatData(),
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '质权人',
          field: 'owner',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'number-input',
          title: '质押物担保价值',
          field: 'guaranteeValue',
          col: { span: 12 },
          props: {
            'min-decimal': 2,
            'max-decimal': 2,
            'need-format': true
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['万元']
            }
          ]
        },
        {
          type: 'number-input',
          title: '认定价值',
          field: 'affirmValue',
          col: { span: 12 },
          props: {
            'min-decimal': 2,
            'max-decimal': 2,
            'need-format': true
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['万元']
            }
          ]
        },
        {
          type: 'number-input',
          title: '评估价值',
          field: 'evaluateValue',
          col: { span: 12 },
          props: {
            'min-decimal': 2,
            'max-decimal': 2,
            'need-format': true
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['万元']
            }
          ]
        },
        {
          type: 'el-date-picker',
          title: '评估日期',
          field: 'evaluateTime',
          props: { valueFormat: 'timestamp' },
          col: { span: 12 }
        },
        {
          type: 'el-custom-select',
          title: '评估机构',
          field: 'evaluateAgencyId',
          col: { span: 12 },
          props: {
            params: {
              url: agencyList,
              data: {},
              labelKey: "agencyName",
              valueKey: "id"
            }
          },
          on: {
            change: obj => {
              this.formApi.setValue('evaluateAgency', obj.data.agencyName)
            }
          }
        },
        { type: 'hidden', title: '评估机构名称', field: 'evaluateAgency' },
        {
          type: 'input',
          field: 'remarks',
          title: '备注',
          props: {
            type: 'textarea',
            maxlength: 500
          }
        }
      ],
      option: {
        form: { labelWidth: '140px' },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: queryFinance,
          data: { recordId: this.routeParams.id }
        },
        showTools: true,
        showPagination: false,
        showCheckbox: true,
        showSerialNumber: true,
        columns: [
          { attrs: { label: '质押物名称', prop: 'pawnName', 'show-overflow-tooltip': true  }},
          { attrs: { label: '押品类型', prop: 'pawnType', "min-width": "120",formatter: row => {
            return this.queryPawnTypeByIds(row.pawnType, '-')}, 'show-overflow-tooltip': true
          }},
          { attrs: { label: '质权人', prop: 'owner', 'show-overflow-tooltip': true  }},
          { attrs: { label: '质押物担保价值（万元）', prop: 'guaranteeValue',"min-width": "100", formatter: row => {
            return Vue.filter('filterToThousand')(row.guaranteeValue)}
          }},
          { attrs: { label: '认定价值（万元）', prop: 'affirmValue',"min-width": "60", formatter: row => {
            return Vue.filter('filterToThousand')(row.affirmValue)}
          }},
          { attrs: { label: '评估价值（万元）', prop: 'evaluateValue', "min-width": "60", formatter: row => {
            return Vue.filter('filterToThousand')(row.evaluateValue)}
          }},
          { attrs: { label: '评估日期', prop: 'evaluateTime', formatter: (row, column) => {
            return Vue.filter('filterTimestamp')(row.evaluateTime,'YYYY-MM-DD')}
          }},
          { attrs: { label: '评估机构', prop: 'evaluateAgency', 'show-overflow-tooltip': true }},
          { attrs: { label: '备注', prop: 'remarks', 'show-overflow-tooltip': true }}
        ]
      },
      selectData: null, //点击选中的行数据
      checkData: []   //勾选的行数据
    }
  },
  methods: {
    // 获取押品类型对应json
    formatData() {
      return Object.freeze(pawnData)
    },
    // 查询押品类型
    queryPawnTypeByIds(ids, separator = ''){
      if (!ids) return ''
      const idArr = (ids + '').split(',')
      const res = idArr.map((code, index) => {
        if (!code) return ''
        if (index === 0) return PAWN['All'][code]
        return PAWN[idArr[index - 1]][code]
      })
      return res.join(separator)
    },
    handleCurrentChange(rowData) {
      this.selectData = rowData
    },
    handleSelectionChange(data) {
      this.checkData = data
    },
    handleBtnClick(title, action, data = {}) {
      this.dialogTitle = title
      this.dialogVisible = true
      this.action = action
      const newData = { ...data } || {}
      if(newData.pawnType){
        newData.pawnType = newData.pawnType.split(',')
      } else {
        newData.pawnType = null
      }
      this.$nextTick(() => {
        this.formApi.setValue(newData)
      })
    },
    handleDeleteClick() {
      this.$confirm(`确定删除选中的金融质押品信息？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = []
          this.checkData.map(item => {
            ids.push(item.id)
          })
          deleteFinance({ ids: ids }, { showLoading: true }).then(res => {
            this.refreshTable()
            this.$showToast('删除成功！', 'success')
          })
        })
        .catch(err => {
          console.log(err)
        })
        .catch(() => {})
    },
    handleDialogSubmit() {
      const data = this.formApi.formData()
      if (data.pawnType) {
        data.pawnType = data.pawnType.join(',')
      }
      data.recordId = this.routeParams.id
      this.formApi.validate(valid => {
        if (!valid) return
        switch (this.action) {
          case 'A':
            data.id = null
            this.financeAdd(data)
            break
          case 'U':
            this.financeUpdate(data)
        }
      })
    },
    financeAdd(params) {
      addFinance(params, { showLoading: true })
        .then(res => {
          this.refreshTable()
          this.dialogVisible = false
          this.$showToast('新增成功！', 'success')
          this.selectData = null
        })
        .catch(err => {
          console.log(err)
        })
    },
    financeUpdate(params) {
      updateFinance(params, { showLoading: true })
        .then(res => {
          this.refreshTable()
          this.dialogVisible = false
          this.$showToast('修改成功！', 'success')
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDialogClosed() {
      this.formApi.resetFields()
    },
    refreshTable() {
      this.$refs.tableDom.getTableData()
    }
  }
}
</script>