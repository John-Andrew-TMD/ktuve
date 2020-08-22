<!-- 项目概览-供应商信息 -->
<template>
  <div class="project-overview-supplier-page">
    <div class="table-wrapper">
      <el-row class="mt-10" v-if="routeParams.canEdit">
        <el-button type="primary" size="mini" @click="handleBtnClick('新增供应商','A')">新增</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="handleBtnClick('修改供应商','U',selectData)"
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
      >
        <template v-slot:cust_name="slotScope">
          <el-link
            type="primary"
            :underline="false"
            @click="handleDetailClick(slotScope.scope.row)"
          >{{slotScope.scope.row.cust_name}}</el-link>
        </template>
      </table-create>
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
import { isEmptyObj, objToUrl } from 'utils'
export default {
  data() {
    return {
      table: {
        requestParams: {
          code: '201820',
          data: {
            project_id: this.routeParams.project_id,
            action: 'Q'
          }
        },
        showPagination: false,
        showSerialNumber: true,
        fixedSerialNumber: true,
        selectedRow: 0,
        columns: [
          { attrs: { label: '供应商信息', prop: 'cust_name' }, slot: true },
          { attrs: { label: '说明', prop: 'remark' } }
        ]
      },
      selectData: {},
      checkData: [],
      form: {},
      rule: [
        { type: 'hidden', title: '项目ID', field: 'project_id', value: this.routeParams.project_id },
        { type: 'hidden', title: '供应商id', field: 'id' },
        { type: 'hidden', title: '客户id', field: 'cust_id' },
        {
          type: 'select',
          title: '供应商',
          field: 'cust_name',
          validate: this.formValidate({ required: true }),
          style: { width: '100%' },
          props: {
            filterable: true
          },
          on: {
            change: v => {
              this.form.setValue('cust_id', v)
              const data = this.supplierData.filter(item => item.value === v)[0]
              this.form.setValue('cust_name', data.label)
            }
          }
        },
        {
          type: 'input',
          title: '说明',
          field: 'remark',
          col: { span: 24 },
          props: { type: 'textarea', maxlength: 500 }
        }
      ],
      option: {
        form: {
          labelWidth: '80px'
        },
        submitBtn: {
          show: false
        }
      },
      supplierData: [],
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
    handleDetailClick(rowData) {
      const params = {
        id: rowData.cust_id,
        actionType: 'VIEW',
        cust_category: rowData.cust_category,
        cust_name: rowData.cust_name,
        cust_no: rowData.cust_no,
        title: rowData.cust_name
      }
      this.$jrosUtils.navigateTo(
        `/page/customerManage/htm/crm_forward_center.html?${objToUrl(params)}`,
        rowData.cust_name,
        true
      )
    },
    async handleBtnClick(title, action, data = {}) {
      const supplierOptions = await this.getSupplierInfo()
      this.dialogVisible = true
      this.dialogTitle = title
      this.action = action
      this.$nextTick(() => {
        if (action !== 'A') {
          this.form.setValue(data)
        }
        this.form.updateRule(
          'cust_name',
          {
            options: supplierOptions
          },
          true
        )
      })
    },
    getSupplierInfo() {
      return this.$promiseRequest({
        code: '201102',
        data: {
          cust_attribute: '2',
          cust_state: '1',
          project_id: this.routeParams.project_id
        }
      }).then(res => {
        if (res.flag == 1 && res.data.record && res.data.record.length) {
          const data = res.data.record
          const options = []
          data.forEach(item => {
            options.push({
              value: item.cust_id,
              label: item.cust_name
            })
          })
          this.supplierData = options
          return options
        } else {
          return []
        }
      })
    },
    handleDel() {
      this.$confirm('确定删除该供应商吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$promiseRequest({
            code: '201820',
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
          const data = this.form.formData()
          data.action = this.action
          if (this.action == 'A') {
            data.id = ''
          }
          this.$promiseRequest({
            code: '201820',
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

<style lang="scss">
.project-overview-supplier-page {
}
</style>
