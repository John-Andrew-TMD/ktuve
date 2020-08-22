<template>
  <div class="mortgage-collateral-page mb-30">
    <div class="btn-group mt-0">
      <el-button
        type="primary"
        size="mini"
        @click="handleBtnClick('新增抵质押物','A')"
        v-if="routeParams.canEdit"
      >新增</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="handleBtnClick('修改抵质押物','U', selectData)"
        :disabled="isEditDisabled"
        v-if="routeParams.canEdit"
      >修改</el-button>
      <el-button
        type="danger"
        size="mini"
        @click="handleDel"
        :disabled="isEditDisabled"
        v-if="routeParams.canEdit"
      >删除</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="handleBtnClick('抵质押物详情','Q', selectData)"
        :disabled="isEditDisabled"
      >详情</el-button>
    </div>
    <table-create
      class="tabel"
      ref="tableDom"
      :options="table"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
    ></table-create>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      v-transfer-dom
      :modal-append-to-body="false"
      @closed="handleDialogClosed"
      width="860px"
    >
      <form-create v-model="form" :rule="rule" :option="option"></form-create>
      <span slot="footer" class="dialog-footer">
        <template v-if="this.action !== 'Q'">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDialogSubmit">确 定</el-button>
        </template>
        <el-button type="primary" @click="dialogVisible = false" v-else>关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import { queryDictItems, isEmptyObj } from 'utils'
export default {
  data() {
    return {
      table: {
        requestParams: {
          code: '201855',
          data: { project_id: this.routeParams.project_id }
        },
        showTools: true,
        showCheckbox: false,
        showSerialNumber: true,
        fixedSerialNumber: true,
        selectedRow: 0,
        columns: [
          {
            attrs: {
              prop: 'mortgage_or_pledge',
              label: '抵押或质押',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.mortgage_or_pledge, '31915')
              }
            }
          },
          { attrs: { prop: 'type', label: '抵质押物类型', 'show-overflow-tooltip': true } },
          { attrs: { prop: 'name', label: '抵质押物名称', 'show-overflow-tooltip': true } },
          { attrs: { prop: 'debtor', label: '债务人', 'show-overflow-tooltip': true } },
          { attrs: { prop: 'creditor', label: '债权人', 'show-overflow-tooltip': true } },
          {
            attrs: {
              prop: 'current_total_value',
              label: '抵质押物当前总价值（元）',
              formatter: (row, column) => {
                return Vue.filter('filterToThousand')(row.current_total_value)
              }
            }
          },
          {
            attrs: {
              prop: 'mortgage_amount',
              label: '抵押金额（元）',
              formatter: (row, column) => {
                return Vue.filter('filterToThousand')(row.mortgage_amount)
              }
            }
          },
          {
            attrs: {
              prop: 'pledge_amount',
              label: '质押物担保金额（元）',
              formatter: (row, column) => {
                return Vue.filter('filterToThousand')(row.pledge_amount)
              }
            }
          },
          { attrs: { prop: 'remark', label: '备注', 'show-overflow-tooltip': true } }
        ]
      },
      selectData: {},
      checkData: [],
      form: {},
      rule: [
        {
          type: 'select',
          field: 'mortgage_or_pledge',
          title: '抵押或质押',
          col: { span: 12 },
          options: queryDictItems('31915'),
          style: { width: '100%' },
          // value: '1',
          validate: this.formValidate({ required: true }),
          on: {
            change: v => {
              // v 1-质押 2-抵押
              if (v === '1') {
                this.form.updateRules({
                  mortgage_amount: {
                    className: ''
                  },
                  pledge_amount: {
                    className: 'hidden',
                    value: ''
                  }
                })
              } else {
                this.form.updateRules({
                  mortgage_amount: {
                    className: 'hidden',
                    value: ''
                  },
                  pledge_amount: {
                    className: ''
                  }
                })
              }
            }
          }
        },
        {
          type: 'input',
          field: 'type',
          title: '抵质押物类型',
          col: { span: 12 }
        },
        {
          type: 'input',
          field: 'name',
          title: '抵质押物名称',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          field: 'debtor',
          title: '债务人',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          field: 'creditor',
          title: '债权人',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'number-input',
          field: 'current_total_value',
          title: '抵质押物当前总价值（元）',
          props: {
            needFormat: true
          },
          col: { span: 12 },
          validate: this.formValidate({ max: 999999999999.999 })
        },
        {
          type: 'number-input',
          field: 'mortgage_amount',
          title: '抵押金额（元）',
          props: {
            needFormat: true
          },
          col: { span: 12 },
          className: 'hidden',
          validate: this.formValidate({ max: 999999999999.999 })
        },
        {
          type: 'number-input',
          field: 'pledge_amount',
          title: '质押物担保金额（元）',
          props: {
            needFormat: true
          },
          col: { span: 12 },
          className: 'hidden',
          validate: this.formValidate({ max: 999999999999.999 })
        },
        { type: 'input', field: 'remark', title: '备注', props: { type: 'textarea', maxlength: 500 } }
      ],
      option: {
        form: {
          labelWidth: '190px'
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
    handleSelectionChange(val) {
      this.checkData = val
    },
    handleBtnClick(title, action, data = {}) {
      this.dialogVisible = true
      this.dialogTitle = title
      this.action = action
      this.$nextTick(() => {
        this.form.setValue(data)
        if (data.mortgage_or_pledge) {
          if (data.mortgage_or_pledge === '1') {
            this.form.updateRules({
              mortgage_amount: {
                className: ''
              },
              pledge_amount: {
                className: 'hidden',
                value: ''
              }
            })
          } else {
            this.form.updateRules({
              mortgage_amount: {
                className: 'hidden',
                value: ''
              },
              pledge_amount: {
                className: ''
              }
            })
          }
        } else {
          this.form.updateRules({
            mortgage_amount: {
              className: 'hidden',
              value: ''
            },
            pledge_amount: {
              className: 'hidden',
              value: ''
            }
          })
        }
        this.form.updateOptions({
          form: { disabled: action === 'Q' }
        })
      })
    },
    handleDel() {
      if (!this.selectData) {
        this.$showToast('请选择一条数据', 'warning')
        return
      }
      this.$confirm('确定从抵质押物信息中删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$promiseRequest({
            code: '201859',
            data: {
              id: this.selectData.id
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
          let data = Object.assign({}, this.selectData, this.form.formData())
          let code = ''
          if (this.action == 'A') {
            data.id = ''
            code = '201857'
          } else {
            code = '201858'
          }
          this.$promiseRequest({
            code: code,
            data: {
              project_id: this.routeParams.project_id,
              ...data
            }
          }).then(res => {
            if (res.flag == 1) {
              this.$showToast(res.data.result.prompt, 'success')
              this.dialogVisible = false
              this.refreshTable()
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
    isEditDisabled() {
      return isEmptyObj(this.selectData) || this.checkData.length
    }
  },
  components: {
    TableCreate
  }
}
</script>

<style lang="scss">
.mortgage-collateral-page {
  padding: 0 15px;

  .btn-group {
    border-top: none;
  }
}
</style>
