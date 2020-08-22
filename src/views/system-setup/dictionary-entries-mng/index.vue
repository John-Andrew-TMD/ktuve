<template>
  <div class="app-content dictionary-entries-page">
    <div class="app-content-wrapper">
      <div class="table-container">
        <div class="table-item">
          <form-create v-model="paretnFormApi" :rule="paretnFormRules" :option="formOptions" />
          <div class="btn-group">
            <el-button type="primary" size="mini" @click="handleBtnClick('add', 'parent')">新增</el-button>
          </div>
          <table-create
            ref="parentTableDom"
            :options="parentTableOptions"
            @row-click="handleParentTableRowClick"
            @current-change="handleParentDataChange"
          >
            <template #operation="{ scope }">
              <el-button type="text" size="mini" @click.stop="handleBtnClick('edit', 'parent', scope.row)">编辑</el-button>
              <el-button type="text" size="mini" @click.stop="handleBtnClick('delete', 'parent', scope.row)">删除</el-button>
            </template>
          </table-create>
        </div>
        <div class="table-item">
          <form-create v-model="childFormApi" :rule="childFormRules" :option="formOptions" />
          <div class="btn-group">
            <el-button
              type="primary"
              size="mini"
              :disabled="!parentRowData"
              @click="handleBtnClick('add', 'children')"
            >新增</el-button>
            <el-button
              type="primary"
              size="mini"
              :disabled="!childRowData"
              @click="handleBtnClick('edit', 'children')"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              :disabled="!childRowData"
              @click="handleBtnClick('delete', 'children')"
            >删除</el-button>
          </div>
          <table-create
            ref="childTableDom"
            :options="childTableOptions"
            @row-click="handleChildTableRowClick"
            @current-change="handleChildDataChange"
          />
        </div>
      </div>
    </div>
    <component
      :is="componentName"
      v-if="dialogStatus"
      :row-data="rowData"
      :dialog-status.sync="dialogStatus"
      @dialog-confirm="handleDialogConfirm"
    />
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate'
import { dictList, dictItemList, parentDictDelete, childDictDelete } from 'api/system-setup.js'
export default {
  components: {
    TableCreate,
    DialogParentAddOrUpdate: () => import('./components/DialogParentAddOrUpdate.vue'),
    DialogChildAddOrUpdate: () => import('./components/DialogChildAddOrUpdate.vue')
  },
  data() {
    return {
      paretnFormApi: null,
      childFormApi: null,
      paretnFormRules: [
        {
          type: 'input',
          title: '字典代码',
          field: 'dictCode'
        },
        {
          type: 'input',
          title: '字典名称',
          field: 'dictName'
        },
        {
          type: 'el-button',
          props: { type: 'primary' },
          children: ['搜索'],
          on: {
            click: this.handleParentSearch
          }
        },
        {
          type: 'el-button',
          props: { type: 'info' },
          domProps: { type: 'reset' },
          children: ['重置'],
          on: {
            click: this.handleParentSearchReset
          }
        }
      ],
      childFormRules: [
        {
          type: 'input',
          title: '子项名称',
          field: 'dictItemName',
          style: { width: '105px' }
        },
        {
          type: 'input',
          title: '子项取值',
          field: 'dictItem',
          style: { width: '105px' }
        },
        {
          type: 'el-button',
          props: { type: 'primary' },
          children: ['搜索'],
          on: {
            click: this.handleChildSearch
          }
        },
        {
          type: 'el-button',
          props: { type: 'info' },
          domProps: { type: 'reset' },
          children: ['重置'],
          on: {
            click: this.handleChildSearchReset
          }
        }
      ],
      formOptions: {
        form: { labelWidth: 'auto', inline: true },
        submitBtn: { show: false }
      },
      parentTableOptions: {
        columns: [
          {
            attrs: {
              prop: 'dictCode',
              label: '字典编号',
              align: 'left'
            }
          },
          {
            attrs: {
              prop: 'dictName',
              label: '字典名称'
            }
          },
          {
            attrs: {
              label: '操作',
              prop: 'operation',
              width: '100px'
            },
            slot: 'operation'
          }
        ],
        requestParams: {
          url: dictList + 'koca',
          data: {}
        },
        tableBottomOffset: 75,
        selectedRow: 0
      },
      childTableOptions: {
        columns: [
          {
            attrs: {
              prop: 'dictItem',
              label: '子项取值'
            }
          },
          {
            attrs: {
              prop: 'dictItemName',
              label: '子项名称',
              align: 'left'
            }
          },
          {
            attrs: {
              prop: 'dictOrd',
              label: '排序'
            }
          }
        ],
        requestParams: {
          url: dictItemList + 'koca',
          data: {}
        },
        tableBottomOffset: 20,
        requestImmediate: false
      },
      dialogStatus: false,
      rowData: null,
      parentRowData: null,
      childRowData: null,
      componentName: '',
      showChildTableLoading: false
    }
  },
  methods: {
    handleParentSearch() {
      const params = this.paretnFormApi.formData()
      this.$refs.parentTableDom.searchTableData(params)
    },
    handleParentSearchReset() {
      this.paretnFormApi.resetFields()
      this.$refs.parentTableDom.resetTableData()
    },
    handleChildSearch() {
      const params = this.childFormApi.formData()
      params.dictCode = this.parentRowData.dictCode
      this.$refs.childTableDom.searchTableData(params)
    },
    handleChildSearchReset() {
      this.childFormApi.resetFields()
      this.$refs.childTableDom.searchTableData({
        dictCode: this.parentRowData.dictCode
      })
    },
    handleDialogClose() {
      this.showDialog = false
    },
    handleBtnClick(action, type, rowData) {
      switch (action) {
        case 'add':
          if (type === 'parent') {
            this.rowData = null
            this.componentName = 'DialogParentAddOrUpdate'
          } else {
            this.rowData = {
              dictCode: this.parentRowData.dictCode
            }
            this.componentName = 'DialogChildAddOrUpdate'
          }
          this.$nextTick(() => {
            this.dialogStatus = true
          })
          break
        case 'edit':
          if (type === 'parent') {
            this.rowData = rowData
            this.componentName = 'DialogParentAddOrUpdate'
          } else {
            this.rowData = {
              ...this.childRowData,
              dictCode: this.parentRowData.dictCode
            }
            this.componentName = 'DialogChildAddOrUpdate'
          }
          this.$nextTick(() => {
            this.dialogStatus = true
          })
          break
        case 'delete':
          if (type === 'parent') {
            this.handleParentDictDelete(rowData)
          } else {
            this.handleChildDictDelete()
          }
          break
      }
    },
    handleParentDictDelete(rowData) {
      if (!rowData) return this.$showToast('未选中任何行！')
      this.$confirm(`确定要删除字典项【${rowData.dictCode}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$promiseRequest(parentDictDelete, rowData, {
            needDto: false
          })
            .then(res => {
              this.$showToast(res.msg, 'success')
              this.$refs.parentTableDom.refreshTable()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    handleChildDictDelete() {
      if (!this.childRowData) return this.$showToast('未选中任何行！')
      this.$confirm(`确定要删除字典项【${this.childRowData.dictItemName}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$promiseRequest(childDictDelete, this.childRowData, {
            needDto: false
          })
            .then(res => {
              this.$showToast(res.msg, 'success')
              this.$refs.childTableDom.refreshTable()
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    handleParentTableRowClick(row) {
      this.parentRowData = row
      this.$refs.childTableDom.searchTableData({
        dictCode: row.dictCode
      })
    },
    handleParentDataChange(row) {
      if (!row) return
      this.parentRowData = row
      this.$refs.childTableDom.searchTableData({
        dictCode: row.dictCode
      })
    },
    handleChildTableRowClick(row) {
      this.childRowData = row
    },
    handleChildDataChange() {
      this.childRowData = null
    },
    handleDialogConfirm(type) {
      if (type === 'parent') {
        this.$refs.parentTableDom.refreshTable()
      } else {
        this.$refs.childTableDom.refreshTable()
      }
    }
  }
}
</script>

<style lang='scss'>
.dictionary-entries-page {
  .form-container {
    .el-form-item {
      margin-bottom: 12px;
    }
  }
  .table-container {
    display: flex;
    justify-content: space-between;
    padding-top: 12px;

    .table-item {
      &:first-child {
        overflow: hidden;
        flex: 1;
      }
      &:last-child {
        width: 500px;
        margin-left: 25px;
      }
    }
  }
}

</style>
