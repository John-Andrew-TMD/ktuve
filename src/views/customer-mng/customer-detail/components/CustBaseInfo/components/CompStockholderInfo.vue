<template>
  <div class="stockholder-info-comp">
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">股东信息</span>
        <div class="panel-tools">
          <el-button type="primary" :disabled="globalCanEdit" @click="handleBtnClick('添加股东信息','A')">新增</el-button>
          <el-button
            type="primary"
            :disabled="globalCanEdit || !selectedData || checkData.length"
            @click="handleBtnClick('修改股东信息','U')"
          >修改</el-button>
          <el-button
            type="primary"
            :disabled="globalCanEdit || !selectedData || checkData.length"
            @click="handleBtnClick('查看股东详情','V')"
          >详情</el-button>
          <el-button type="danger" :disabled="globalCanEdit || !checkData.length" @click="handleDelClick">删除</el-button>
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
    <div v-if="showDialog" v-transfer-dom>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        :modal-append-to-body="false"
        width="800px"
        @closed="handleDialogClosed"
      >
        <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
        <el-tabs v-model="tabName">
          <el-tab-pane label="认缴明细" name="subcribe">
            <amount-detail-table
              ref="subcribeDom"
              :selected-data="selectedData"
              :action="action"
              amount-type="0"
            />
          </el-tab-pane>
          <el-tab-pane label="实缴明细" name="paidIn">
            <amount-detail-table
              ref="paidInDom"
              :selected-data="selectedData"
              :action="action"
              amount-type="1"
            />
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <template v-if="action !== 'V'">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleDialogSubmit">确 定</el-button>
          </template>
          <el-button v-else type="primary" @click="dialogVisible = false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import TableCreate from 'components/TableCreate/index'
import AmountDetailTable from './CompStockholderInfoTable.vue'
import {
  customerShareholderList,
  customerShareholderAdd,
  customerShareholderUpdate,
  customerShareholderDelete
} from 'api/customer-module/api-customer-detail.js'

export default {
  components: {
    TableCreate,
    AmountDetailTable
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
      showDialog: false,
      dialogTitle: '',
      action: 'A',
      formApi: {},
      formRules: [
        { type: 'hidden', title: '客户ID', field: 'custId', value: this.routeParams.id },
        {
          type: 'input',
          title: '股东名称',
          field: 'shareholderName',
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '股东类型',
          field: 'shareholderType',
          col: { span: 12 }
        },
        {
          type: 'number-input',
          title: '实缴额',
          col: { span: 12 },
          field: 'actualAmount',
          props: {
            maxDecimal: 4,
            minDecimal: 2
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
          title: '持股比例',
          col: { span: 12 },
          field: 'ratio',
          props: {
            maxDecimal: 2
          },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['%']
            }
          ],
          validate: this.formValidate({
            required: true,
            max: 100,
            min: 0.01,
            message: '数值范围需在0（不含）-100之间'
          })
        },
        {
          type: 'number-input',
          title: '认缴额',
          col: { span: 12 },
          field: 'sureAmount',
          props: {
            maxDecimal: 4,
            minDecimal: 2
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
          type: 'input',
          title: '责任形式',
          field: 'wayOfInvestment',
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
      formOptions: {
        form: { labelWidth: '110px' },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: customerShareholderList,
          data: { custId: this.routeParams.id }
        },
        dataCallbackFn(data) {
          if (data && Array.isArray(data.newCrm)) {
            return data.newCrm
          } else {
            return []
          }
        },
        showPagination: false,
        showCheckbox: true,
        showSerialNumber: true,
        columns: [
          { attrs: { label: '股东名称', prop: 'shareholderName', 'show-overflow-tooltip': true }},
          { attrs: { label: '股东类型', prop: 'shareholderType' }},
          { attrs: { label: '实缴额（万元）', prop: 'actualAmount' }, filter: { name: 'toThousand' }},
          { attrs: { label: '持股比例（%）', prop: 'ratio' }, filter: { name: 'number' }},
          { attrs: { label: '认缴额（万元）', prop: 'sureAmount' }, filter: { name: 'toThousand' }},
          { attrs: { label: '责任形式', prop: 'wayOfInvestment' }},
          { attrs: { label: '备注', prop: 'remarks', 'show-overflow-tooltip': true }}
        ]
      },
      selectedData: null,
      checkData: [],
      tabName: 'subcribe'
    }
  },
  computed: {
    globalCanEdit() {
      return !this.routeParams.globalCanEdit
    }
  },
  methods: {
    handleCurrentChange(rowData) {
      this.selectedData = rowData
    },
    handleSelectionChange(data) {
      this.checkData = data
    },
    handleBtnClick(title, action) {
      this.dialogTitle = title
      this.showDialog = true
      this.dialogVisible = true
      this.action = action
      this.$nextTick(() => {
        this.formApi.setValue(action === 'A' ? {} : this.selectedData)
        this.formApi.updateOptions({
          form: {
            disabled: action === 'V'
          }
        })
      })
    },
    handleDelClick() {
      const ids = this.checkData.map(item => item.id)
      this.$confirm(`确定删除此信息？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          customerShareholderDelete({ ids }, { showLoading: true })
            .then(() => {
              this.refreshTable()
              this.$showToast('删除成功！', 'success')
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    handleDialogSubmit() {
      this.formApi.validate(async valid => {
        if (!valid) return
        const params = { ...this.formApi.formData() }
        const subcribeData = await this.$refs.subcribeDom.getData()
        const paidInData = await this.$refs.paidInDom.getData()
        if (!subcribeData) return
        if (!paidInData) {
          this.tabName = 'paidIn'
          return
        }
        params.detailList = [...subcribeData, ...paidInData]
        switch (this.action) {
          case 'A':
            this.shareholderAdd(params)
            break
          case 'U':
            params.id = this.selectedData.id
            params.detailList.forEach(item => {
              item.shareholderId = this.selectedData.id
            })
            this.shareholderUpdate(params)
            break
        }
      })
    },
    shareholderAdd(params) {
      customerShareholderAdd(params, { showLoading: true })
        .then(res => {
          this.refreshTable()
          this.dialogVisible = false
          this.$showToast('新增成功！', 'success')
          this.selectedData = null
        })
        .catch(err => {
          console.log(err)
        })
    },
    shareholderUpdate(params) {
      customerShareholderUpdate(params, { showLoading: true })
        .then(res => {
          this.refreshTable()
          this.dialogVisible = false
          this.$showToast('修改成功！', 'success')
        })
        .catch(err => {
          console.log(err)
        })
    },
    // handleDialogOpen() {
    //   this.showTab = true
    // },
    handleDialogClosed() {
      this.formApi.resetFields()
      // this.showTab = false
      this.tabName = 'subcribe'
      this.showDialog = false
    },
    refreshTable() {
      this.$refs.tableDom.refreshTable()
    }
  }
}
</script>
<style lang="scss" scoped>
.stockholder-info-comp /deep/  {
  .el-tabs {
    height: 40px;
    padding: 0 10px;
    .el-tabs__header {
      margin-bottom: 0px;
    }
    .el-tabs__content {
      display: block;
    }
  }
}

</style>
