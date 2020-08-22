<!-- 标的物 -->
<template>
  <div class="panel-subject-matter-info">
    <div v-if="routeParams.canEdit" class="btn-group mt-0">
      <el-button type="primary" size="mini" @click="handleButtonClick('add')">新增</el-button>
      <el-button
        type="primary"
        size="mini"
        :disabled="!rowData || checkData.length"
        @click="handleButtonClick('update')"
      >修改</el-button>
      <el-button
        type="danger"
        size="mini"
        :disabled="!checkData.length"
        @click="handleDeleteClick"
      >删除</el-button>
      <import-btn
        size="mini"
        text="导入"
        :field-map="fieldMap"
        @change="handleImportClick"
      />
      <el-button size="mini" type="primary" @click="handleTempDownload">模板下载</el-button>
    </div>
    <table-create
      ref="tableDom"
      :options="tableOptions"
      :show-summary="true"
      :ignore-columns="[1, 2, 3, 4, 5, 6, 7, 9, 11]"
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
    />
    <el-dialog
      v-transfer-dom
      :title="dialogTitle[action]"
      :visible.sync="dialogShow"
      :modal-append-to-body="false"
      width="800px"
      @closed="handleDialogClosed"
    >
      <div class="dialog-body">
        <form-create v-model="fApi" :rule="formRules" :option="options" />
      </div>
      <span slot="footer" class="dialog-footer">
        <template>
          <el-button @click="dialogShow=false">取 消</el-button>
          <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate'
import ImportBtn from 'components/ElFileImport/index'
import LEASE from './js/lease-dict.min'
import dayjs from 'dayjs'
import { getTableColumns, getFormItem } from './js/subject-matter.js'
import { deepAssign, formSubmit } from 'utils'
import { querySubjectMatter, addSubjectMatter, updateSubjectMatter, deleteSubjectMatter, saveBatch } from 'api/project-module/api-project-subject-matter.js'
import { templateFilePath } from 'api/project-module/api-quotation.js'

export default {
  components: {
    TableCreate,
    ImportBtn
  },
  props: ['routeParams', 'requestParams', 'canEdit'],
  data() {
    return {
      rowData: null,
      tableOptions: {
        requestParams: {
          url: querySubjectMatter,
          data: { recordId: this.routeParams.id },
          ext: { descs: ['sysCtime'] }
        },
        showTools: true,
        showCheckbox: true,
        showSerialNumber: true,
        selectedRow: 0,
        columns: getTableColumns(this, 1)
      },
      dialogTitle: {
        add: '新增租赁物',
        update: '修改租赁物'
      },
      dialogShow: false,
      action: '',
      fApi: null,
      formRules: getFormItem(this, 1),
      options: {
        form: {
          labelWidth: '170px'
        },
        submitBtn: {
          show: false
        }
      },
      fieldMap: [
        { field: 'name', title: '租赁物分项名称（必输）' },
        { field: 'leaseType1', title: '租赁物分类一级' },
        { field: 'leaseType2', title: '租赁物分类二级' },
        { field: 'leaseType3', title: '租赁物分类三级' },
        { field: 'model', title: '规格型号' },
        { field: 'num', title: '数量' },
        { field: 'unit', title: '单位' },
        { field: 'buildDate', title: '购置/建造年月', type: 'date' },
        { field: 'sourceValue', title: '原值（万元）', type: 'money' },
        { field: 'elevateValue', title: '净/估值（万元）', type: 'money' },
        { field: 'newRate', title: '成新率' },
        { field: 'remarks', title: '备注（描述位置、厂家）' }
      ],
      head: null, // 三级父级key
      checkData: []
    }
  },
  created() {
  },
  methods: {
    handleButtonClick(action) {
      this.action = action
      this.dialogShow = true
      this.$nextTick(() => {
        if (action === 'update') {
          const data = { ...this.rowData }
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const value = data[key]
              if (key.endsWith('_date') && value == 0) {
                data[key] = ''
              }
            }
          }
          if (data.leaseType) {
            data.leaseType = data.leaseType.split(',')
          } else {
            data.leaseType = null
          }
          this.fApi.setValue(data)
        } else {
          this.fApi.setValue('leaseType', null)
        }
      })
    },
    handleDeleteClick() {
      this.$confirm(`确定删除选中的租赁物信息吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          const ids = []
          this.checkData.map(item => {
            ids.push(item.id)
          })
          deleteSubjectMatter({ ids: ids }, { showLoading: true }).then(res => {
            this.$showToast('删除成功！', 'success')
            this.refreshTable()
          }).catch(err => {
            console.log(err)
          })
        })
        .catch(() => {})
    },
    async handleImportClick(data) {
      console.log('-----excel导入的数据----', data)
      data.forEach(item => {
        item.recordId = this.routeParams.id
        item.leaseType = item.leaseType1
        if (item.leaseType2) {
          item.leaseType += ',' + item.leaseType2
          if (item.leaseType3) {
            item.leaseType += ',' + item.leaseType3
          }
        }
        item.leaseType = this.queryleaseTypeByIds(item.leaseType, ',')
        delete item.leaseType1
        delete item.leaseType2
        delete item.leaseType3
      })
      console.log('-----转换后的数据-----', data)
      this.$confirm(`确定上传后，数据将被覆盖？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          saveBatch(data, { showLoading: true }).then(res => {
            this.$showToast('导入成功!', 'success')
            this.$refs.tableDom.resetTableData()
          }).catch(err => {
            console.log(err)
          })
        })
        .catch(() => {})
    },
    queryleaseTypeByIds(names, separator = '') {
      if (!names) return ''
      const nameArr = (names + '').split(',')
      const res = nameArr.map((code, index) => {
        if (!code) return ''
        if (index === 0) {
          this.head = this.findKey(code, 'All')
          return this.head
        }
        this.head = this.findKey(code, this.head)
        return this.head
      })
      return res.join(separator)
    },
    findKey(value, type, compare = (a, b) => a === b) {
      return Object.keys(LEASE[type]).find(k => compare(LEASE[type][k], value))
    },
    handleTempDownload() {
      formSubmit(templateFilePath, { type: 2 }, 'get')
    },
    handleDialogClosed() {
      this.resetFields()
      this.dialogShow = false
    },
    resetFields() {
      this.fApi.resetFields()
      this.fApi.updateRule('upload', {
        props: {
          id: ''
        }
      })
    },
    handleDialogConfirm() {
      let formData = this.fApi.formData()
      if (formData.leaseType) {
        formData.leaseType = formData.leaseType.join(',')
      }
      this.fApi.validate(valid => {
        if (valid) {
          if (this.action === 'update') {
            formData = Object.assign({}, { recordId: this.routeParams.id }, formData)
            if (!formData.buildDate) {
              formData.buildDate = ''
            }
            if (!formData.sourceValue) {
              formData.sourceValue = 0
            }
            if (!formData.elevateValue) {
              formData.elevateValue = 0
            }
            updateSubjectMatter(formData, { showLoading: true })
              .then(res => {
                this.refreshTable()
                this.dialogShow = false
                this.$showToast('更新成功！', 'success')
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            formData.id = null
            formData = Object.assign({}, { recordId: this.routeParams.id }, formData)
            addSubjectMatter(formData, { showLoading: true })
              .then(res => {
                this.refreshTable()
                this.dialogShow = false
                this.$showToast('新增成功！', 'success')
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      })
    },
    handleCurrentChange(row) {
      this.rowData = row
    },
    handleSelectionChange(data) {
      this.checkData = data
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.resetTableData()
    }
  }
}
</script>

<style lang='scss'>
.panel-subject-matter-info {
  padding: 0 15px;

  .btn-group {
    border-top: none;
  }
}

</style>
