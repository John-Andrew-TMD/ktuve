<template>
  <div class="app-content rating-mng-page">
    <div class="app-content-wrapper">
      <div>
        <el-button size="mini" type="primary" @click="handleBtnClick('新增','A')">新增</el-button>
        <!-- <el-button
          size="mini"
          type="primary"
          :disabled="!rowData || !canEdit || checkData.length"
          @click="handleBtnClick('修改','U')"
        >修改</el-button> -->
        <el-button
          size="mini"
          type="danger"
          :disabled="!rowData || !canEdit "
          @click="handleDeleteClick"
        >删除</el-button>
      </div>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
      >
        <template v-slot:display="{ scope }">
          <template v-if="scope.row.display == 2">系统固定</template>
          <el-switch
            v-else
            v-model="scope.row.display"
            active-color="#13ce66"
            inactive-value="0"
            active-value="1"
            @change="handleSwitchChange(scope.row)"
          />
        </template>
      </table-create>
    </div>
    <el-dialog
      :modal-append-to-body="false"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
      @closed="handleDialogClosed"
    >
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import { queryDictItems } from 'utils'
import {
  custNatureList,
  custNatureAdd,
  custNatureUpdate,
  custNatureDelete
} from 'api/run-module/customer-type-setting.js'

export default {
  components: {
    TableCreate
  },
  data() {
    return {
      formApi: null,
      formRules: [
        {
          type: 'radio',
          title: '客户类型',
          field: 'custCategory',
          value: '1',
          options: queryDictItems('10008'),
          validate: this.formValidate({ required: true, trigger: 'change' })
        },
        {
          type: 'input',
          title: '客户性质',
          field: 'custNature',
          validate: this.formValidate({ required: true, trigger: 'change' })
        },
        {
          type: 'input',
          title: '备注',
          field: 'remark',
          props: {
            type: 'textarea',
            maxlength: 500
          }
        }
      ],
      formOptions: {
        form: { labelWidth: '80px' },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: custNatureList,
          data: {}
        },
        showSerialNumber: true,
        // showCheckbox: true,
        columns: [
          {
            attrs: {
              label: '客户类型',
              prop: 'custCategory',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.custCategory, '10008')
              }
            }
          },
          {
            attrs: {
              label: '客户性质',
              prop: 'custNature'
            }
          },
          {
            attrs: {
              label: '是否显示',
              prop: 'display'
            },
            slot: 'display'
          },
          {
            attrs: {
              label: '备注',
              prop: 'remark'
            }
          }
        ]
      },
      rowData: null,
      checkData: [],
      dialogVisible: false,
      dialogTitle: '',
      action: 'A',
      canEdit: false
    }
  },
  methods: {
    handleSelectionChange(data) {
      this.checkData = data
    },
    handleCurrentChange(rowData) {
      this.rowData = rowData
      this.canEdit = rowData && rowData.display != 2 || false
    },
    handleSwitchChange(data) {
      this.handleEditSubmit(data)
    },
    // 删除
    handleDeleteClick() {
      this.$confirm(`是否确定删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // const ids = this.checkData.map(item => item.id)
          const ids = [this.rowData.id]
          custNatureDelete({ ids }, { showLoading: true })
            .then(res => {
              this.$showToast('删除成功！', 'success')
              this.refreshTable()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    // 新增&修改
    handleBtnClick(title, action) {
      this.dialogTitle = `${title}客户性质`
      this.dialogVisible = true
      this.action = action
      this.$nextTick(() => {
        if (action === 'A') {
          this.formApi.resetFields()
        } else {
          this.formApi.setValue(this.rowData)
        }
      })
    },
    // 确定
    handleDialogConfirm() {
      this.formApi.validate(async valid => {
        if (valid) {
          const params = this.formApi.formData()
          if (this.action === 'U') {
            this.handleEditSubmit(params)
          } else {
            this.handleAddSubmit(params)
          }
          console.log(params)
        }
      })
    },
    handleAddSubmit(params) {
      params.display = 0
      custNatureAdd(params, { showLoading: true })
        .then(res => {
          this.$showToast('新增成功！', 'success')
          this.dialogVisible = false
          this.refreshTable()
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleEditSubmit(params) {
      params.id = params.id || this.rowData.id
      custNatureUpdate(params, { showLoading: true })
        .then(res => {
          this.$showToast('修改成功！', 'success')
          this.dialogVisible = false
          this.refreshTable()
        })
        .catch(err => {
          console.log(err)
        })
    },
    refreshTable() {
      this.$refs.tableDom.resetTableData()
    }
  }
}
</script>

<style lang="scss"></style>
