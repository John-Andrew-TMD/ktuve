<template>
  <div>
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">其他押品</span>
        <div class="panel-tools" v-if="routeParams.canEdit">
          <el-button type="primary" @click="handleBtnClick('新增其他押品','A')">新增其他押品</el-button>
          <el-button
            type="primary"
            :disabled="!selectData || checkData.length"
            @click="handleBtnClick('修改其他押品','U', selectData)"
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
import othersData from './js/others-type.min'
import OTHERS from './js/others-dict.min'
import { queryDictItems } from 'utils/index'
import { queryOthers, addOthers, updateOthers, deleteOthers } from 'api/project-module/api-project-mortgage-collateral.js'
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
        { type: 'hidden', title: '其他押品ID', field: 'id' },
        {
          type: 'input',
          title: '名称',
          field: 'name',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'cascader',
          title: '其他押品类型',
          field: 'otherType',
          style: { width: "100%" }, 
          props:{
            options: this.formatData(),
          },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '规格型号',
          field: 'model',
          col: { span: 12 }
        },
        {
          type: 'input',
          title: '序列号',
          field: 'serialNumber',
          col: { span: 12 }
        },
        {
          type: 'number-input',
          title: '数量',
          field: 'num',
          col: { span: 12 },
          props: {
            'min-decimal': 0,
            'max-decimal': 0,
            'need-format': false
          },
        },
        {
          type: 'input',
          title: '安置地',
          field: 'placementArea',
          col: { span: 12 }
        },
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
          url: queryOthers,
          data: { recordId: this.routeParams.id }
        },
        showTools: true,
        showPagination: false,
        showCheckbox: true,
        showSerialNumber: true,
        columns: [
          { attrs: { label: '名称', prop: 'name', "min-width": "100",'show-overflow-tooltip': true }},
          { attrs: { label: '其他押品类型', prop: 'otherType', formatter: row => {
            return this.queryOthersTypeByIds(row.otherType, '-')}, 'show-overflow-tooltip': true}},
          { attrs: { label: '规格型号', prop: 'model'}},
          { attrs: { label: '序列号', prop: 'serialNumber', 'show-overflow-tooltip': true }},
          { attrs: { label: '数量', prop: 'num'}},
          { attrs: { label: '安置地', prop: 'placementArea', 'show-overflow-tooltip': true }},
          { attrs: { label: '备注', prop: 'remarks', 'show-overflow-tooltip': true }}
        ]
      },
      selectData: null,
      checkData: []
    }
  },
  methods: {
    // 获取其他押品类型对应json
    formatData() {
      return Object.freeze(othersData)
    },
    // 查询押品类型
    queryOthersTypeByIds(ids, separator = ''){
      if (!ids) return ''
      const idArr = (ids + '').split(',')
      const res = idArr.map((code, index) => {
        if (!code) return ''
        if (index === 0) return OTHERS['All'][code]
        return OTHERS[idArr[index - 1]][code]
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
      if(newData.otherType){
        newData.otherType = newData.otherType.split(',')
      } else {
        newData.otherType = null
      }
      this.$nextTick(() => {
        this.formApi.setValue(newData)
      })
    },
    handleDeleteClick() {
      this.$confirm(`确定删除选中的其他押品信息？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let ids = []
          this.checkData.map(item => {
            ids.push(item.id)
          })
          deleteOthers({ ids: ids }, { showLoading: true }).then(res => {
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
      if (data.otherType) {
        data.otherType = data.otherType.join(',')
      }
      data.recordId = this.routeParams.id
      this.formApi.validate(valid => {
        if (!valid) return
        switch (this.action) {
          case 'A':
            data.id = null
            this.othersAdd(data)
            break
          case 'U':
            this.othersUpdate(data)
        }
      })
    },
    othersAdd(params) {
      addOthers(params, { showLoading: true })
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
    othersUpdate(params) {
      updateOthers(params, { showLoading: true })
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