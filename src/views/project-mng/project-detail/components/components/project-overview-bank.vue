<!-- 项目概览-银行信息 -->
<template>
  <div>
    <div class="table-wrapper">
      <el-row class="mt-10" v-if="routeParams.canEdit">
        <el-button type="primary" size="mini" @click="handleBtnClick('新增银行信息','A')">新增</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="handleBtnClick('修改银行信息','U',selectData)"
          :disabled="isDisabled"
        >修改</el-button>
        <el-button type="danger" size="mini" @click="handleDel" :disabled="isDisabled">删除</el-button>
      </el-row>
      <table-create
        class="tabel"
        ref="tableDom"
        :options="table"
        border
        highlight-current-row
        @current-change="handleCurrentChange"
      ></table-create>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      @closed="handleDialogClosed"
      width="500px"
    >
      <form-create v-model="form" :rule="rule" :option="option"></form-create>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import { isEmptyObj } from 'utils'
export default {
  data() {
    return {
      table: {
        requestParams: {
          code: '201821',
          data: {
            project_id: this.routeParams.project_id,
            action: 'Q'
          }
        },
        showPagination: false,
        showSerialNumber: true,
        fixedSerialNumber: true,
        selectedRow: 0,
        columns: [{ attrs: { label: '银行', prop: 'bank' } }, { attrs: { label: '说明', prop: 'remark' } }]
      },
      selectData: {},
      checkData: [],
      form: {},
      rule: [
        { type: 'hidden', title: '项目ID', field: 'project_id', value: this.routeParams.project_id },
        { type: 'hidden', title: '银行id', field: 'id' },
        { type: 'input', title: '银行', field: 'bank', validate: this.formValidate({ required: true }) },
        { type: 'input', title: '说明', field: 'remark', col: { span: 24 }, props: { type: 'textarea' } }
      ],
      option: {
        form: {
          labelWidth: '80px'
        },
        submitBtn: {
          show: false
        }
      },
      dialogVisible: false,
      dialogTitle: '',
      action: 'A'
    }
  },
  props: ['routeParams'],
  methods: {
    handleCurrentChange(val) {
      this.selectData = val
    },
    handleBtnClick(title, action, data = {}) {
      this.dialogVisible = true
      this.dialogTitle = title
      this.action = action
      this.$nextTick(() => {
        this.form.setValue(data)
      })
    },
    handleDel() {
      this.$confirm('确定删除该银行信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$promiseRequest({
            code: '201821',
            data: {
              id: this.selectData.id,
              action: 'D'
            }
          }).then(res => {
            if (res.flag == 1) {
              this.$showToast(res.data.result.prompt, 'success')
              this.refreshTable()
            }
          })
        })
        .catch(() => {})
    },
    handleDialogSubmit() {
      this.form.validate(async valid => {
        if (valid) {
          let data = this.form.formData()
          data.action = this.action
          if (this.action == 'A') {
            data.id = ''
          }
          console.log(data)
          this.$promiseRequest({
            code: '201821',
            data: data
          }).then(res => {
            if (res.flag == 1) {
              this.$showToast(res.data.result.prompt, 'success')
              this.dialogVisible = false
              this.$refs.tableDom.resetTableData()
            }
          })
        }
      })
    },
    handleDialogClosed() {
      this.form.resetFields()
    },
    refreshTable() {
      this.$refs.tableDom.resetTableData()
    }
  },
  computed: {
    isDisabled() {
      return isEmptyObj(this.selectData)
    }
  },
  components: {
    TableCreate
  }
}
</script>
