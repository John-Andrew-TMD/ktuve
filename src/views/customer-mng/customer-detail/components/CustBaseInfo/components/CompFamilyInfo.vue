<template>
  <div class="content">
    <div class="panel-header">
      <span class="text">家庭成员</span>
    </div>
    <div class="content-body">
      <el-row>
        <el-button v-permission="200018001" type="primary" @click="handleBtnClick('添加家庭成员','A')">新增</el-button>
        <el-button
          v-permission="200018002"
          type="primary"
          :disabled="!selectData"
          @click="handleBtnClick('修改家庭成员','U', selectData)"
        >修改</el-button>
        <el-button
          v-permission="200018003"
          type="primary"
          :disabled="!checkData.length"
          @click="handleDel"
        >删除</el-button>
      </el-row>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        max-height="287"
        border
        highlight-current-row
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
      <form-create v-model="form" :rule="rule" :option="option" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TableCreate from 'components/TableCreate/index'
import { queryDictItems, isEmptyObj } from 'utils'

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
      form: {},
      rule: [
        { type: 'hidden', title: '客户ID', field: 'cust_id', value: this.routeParams.id },
        {
          type: 'input',
          title: '姓名',
          field: 'name',
          col: { span: 12 },
          validate: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
        },
        {
          type: 'select',
          title: '关系',
          field: 'relationship',
          options: queryDictItems('30811'),
          col: { span: 12 },
          validate: [{ required: true, message: '请选择关系', trigger: 'change' }]
        },
        {
          type: 'input',
          title: '身份证号',
          field: 'id_card',
          col: { span: 24 },
          validate: this.formValidate({ required: true, type: 'idCard' })
        },
        {
          type: 'china-region-cascade',
          field: 'domicile_address',
          title: '户籍地',
          props: { separator: '-' },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          field: 'domicile_address_detail',
          col: { span: 11, offset: 1 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'china-region-cascade',
          field: 'residence_address',
          title: '住所地',
          props: { separator: '-' },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          field: 'residence_address_detail',
          col: { span: 11, offset: 1 },
          validate: this.formValidate({ required: true })
        },
        { type: 'input', field: 'remake', title: '备注', props: { type: 'textarea' }}
      ],
      option: {
        form: { labelWidth: '150px' },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          code: '200154',
          data: { cust_id: this.routeParams.id }
        },
        showPagination: false,
        showCheckbox: true,
        showSerialNumber: true,
        requestImmediate: false,
        showLoading: false,
        columns: [
          { attrs: { label: '姓名', prop: 'name' }},
          { attrs: { label: '关系', prop: 'relationship' }, filter: { name: 'dict', params: '30811' }},
          { attrs: { label: '身份证号', prop: 'id_card' }},
          { attrs: { label: '户籍地', prop: 'domicile_address' }, filter: { name: 'address' }},
          { attrs: { label: '住所地', prop: 'residence_address' }, filter: { name: 'address' }},
          { attrs: { label: '备注', prop: 'remake' }}
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
      const newData = { ...data }
      if (!isEmptyObj(newData)) {
        // 户籍地
        const addr1 = newData.domicile_address.split(',')
        newData.domicile_address = addr1.slice(0, 3)
        newData.domicile_address_detail = addr1.pop()
        // 住所地
        const addr2 = newData.residence_address.split(',')
        newData.residence_address = addr2.slice(0, 3)
        newData.residence_address_detail = addr2.pop()
      }
      this.$nextTick(() => {
        this.form.setValue(newData)
      })
    },
    handleDel() {
      const custName = this.query.cust_name
      let names = []
      let ids = []
      this.checkData.forEach(item => {
        names.push(item.name)
        ids.push(item.id)
      })
      names = names.join('、')
      ids = ids.join(',')
      this.$confirm(`确定删除【${custName}】名下的家庭成员：${names}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$promiseRequest({
            code: '200155',
            data: { idList: ids, action: 'D' }
          }).then(res => {
            if (res.flag == 1) {
              this.refreshTable()
              this.$message.success(res.data.result.prompt)
            }
          })
        })
        .catch(() => {})
    },
    handleDialogSubmit() {
      this.form.validate(valid => {
        if (valid) {
          const data = this.form.formData()
          data.action = this.action
          data.id = this.action === 'U' ? this.selectData.id : ''
          data.domicile_address = data.domicile_address.join(',') + ',' + data.domicile_address_detail
          data.residence_address = data.residence_address.join(',') + ',' + data.residence_address_detail
          delete data.domicile_address_detail
          delete data.residence_address_detail
          this.$promiseRequest({
            code: '200155',
            data: data
          }).then(res => {
            if (res.flag == 1) {
              this.refreshTable()
              this.selectData = null
              this.dialogVisible = false
              this.$message.success(res.data.result.prompt)
            }
          })
        }
      })
    },
    handleDialogClosed() {
      this.form.resetFields()
    },
    refreshTable() {
      this.$refs.tableDom.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  .content-body {
    padding: 0 20px 10px;
  }
}

</style>
