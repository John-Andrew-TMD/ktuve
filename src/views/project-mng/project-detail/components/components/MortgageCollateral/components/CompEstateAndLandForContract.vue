<template>
  <div>
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">房地产类</span>
        <div class="panel-tools" v-if="routeParams.canEdit">
          <el-button type="primary" @click="handleBtnClick('新增房地产','A')">新增房地产</el-button>
          <el-button
            type="primary"
            :disabled="!selectData || checkData.length"
            @click="handleBtnClick('修改房地产','U', selectData)"
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
      />
    </div>
    <el-dialog
      v-transfer-dom
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      width="900px"
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
import { queryDictItems } from 'utils/index'
import { queryEstate, addEstate, updateEstate, deleteEstate } from 'api/project-module/api-project-mortgage-collateral.js'
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
        { type: 'hidden', title: '房地产ID', field: 'id' },
        {
          type: 'input',
          title: '抵/质押物名称',
          field: 'name',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'select',
          title: '房地产类型',
          field: 'estateType',
          style: { width: "100%" }, 
          options: queryDictItems('10042'),
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '不动产权证号',
          field: 'idNo',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'number-input',
          title: '建筑面积',
          field: 'constructionArea',
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
              children: ['平方米']
            }
          ]
        },
        {
          type: 'input',
          title: '所有权人',
          field: 'owner',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '房屋坐落',
          field: 'address',
          col: { span: 12 }
        },
        {
          type: 'input',
          title: '地号',
          field: 'territoryNo',
          col: { span: 12 },
        },
        {
          type: 'input',
          title: '土地使用证号',
          field: 'territoryUseNo',
          col: { span: 12 },
        },
        {
          type: 'number-input',
          title: '土地使用面积',
          field: 'landArea',
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
              children: ['平方米']
            }
          ]
        },
        {
          type: 'input',
          title: '使用权人',
          field: 'territoryOwner',
          col: { span: 12 }
        },
        {
          type: 'number-input',
          title: '期限',
          field: 'deadline',
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
              children: [' 年']
            }
          ]
        },
        {
          type: 'input',
          title: '土地坐落',
          field: 'territoryAddress',
          col: { span: 12 }
        },
        {
          type: 'input',
          title: '用途',
          field: 'usefor',
          col: { span: 12 }
        }
      ],
      option: {
        form: { labelWidth: '140px' },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: queryEstate,
          data: { recordId: this.routeParams.id }
        },
        showTools: true,
        showPagination: false,
        showCheckbox: true,
        showSerialNumber: true,
        columns: [
          { attrs: { label: '抵/质押物名称', prop: 'name', "min-width": "100",'show-overflow-tooltip': true }},
          { attrs: { label: '房地产类型', prop: 'estateType',"min-width": "90", 'show-overflow-tooltip': true, formatter: row => {
            return Vue.filter('filterDictValue')(row.estateType, '10042')}
          }},
          { attrs: { label: '不动产权证号', prop: 'idNo',  'show-overflow-tooltip': true}},
          { attrs: { label: '建筑面积（平方米）', prop: 'constructionArea', "min-width": "90", formatter: row => {
            return Vue.filter('filterToThousand')(row.constructionArea)}
          }},
          { attrs: { label: '所有权人', prop: 'owner'}},
          { attrs: { label: '房屋坐落', prop: 'address', 'show-overflow-tooltip': true }},
          { attrs: { label: '地号', prop: 'territoryNo', 'show-overflow-tooltip': true }},
          { attrs: { label: '土地使用证号', prop: 'territoryUseNo', 'show-overflow-tooltip': true }},
          { attrs: { label: '土地使用面积（平方米）', prop: 'landArea', "min-width": "100", formatter: row => {
            return Vue.filter('filterToThousand')(row.landArea)}
          }},
          { attrs: { label: '使用权人', prop: 'territoryOwner'}},
          { attrs: { label: '期限（年）', prop: 'deadline'}},
          { attrs: { label: '土地坐落', prop: 'territoryAddress', 'show-overflow-tooltip': true }},
          { attrs: { label: '用途', prop: 'usefor', 'show-overflow-tooltip': true }}
        ]
      },
      selectData: null,
      checkData: []
    }
  },
  methods: {
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
      this.$nextTick(() => {
        this.formApi.setValue(data)
      })
    },
    handleDeleteClick() {
      this.$confirm(`确定删除选中的房地产信息？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = []
          this.checkData.map(item => {
            ids.push(item.id)
          })
          deleteEstate({ ids: ids }, { showLoading: true }).then(res => {
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
      this.formApi.validate(valid => {
        if (!valid) return
        const data = this.formApi.formData()
        data.recordId = this.routeParams.id
        switch (this.action) {
          case 'A':
            data.id = null
            this.estateAdd(data)
            break
          case 'U':
            this.estateUpdate(data)
        }
      })
    },
    estateAdd(params) {
      addEstate(params, { showLoading: true })
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
    estateUpdate(params) {
      updateEstate(params, { showLoading: true })
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
