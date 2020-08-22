<template>
  <div class="attachment-list-comp">
    <div class="btn-group">
      <el-button size="mini" type="primary" @click="handleAddClick">新增</el-button>
      <el-button size="mini" type="danger" :disabled="!checkedRows.length" @click="handleDeleteClick">删除</el-button>
    </div>
    <table-create
      ref="tableDom"
      :options="tableOptions"
      @selection-change="handleSelectionChange"
    />
    <el-dialog
      title="附件内容新增"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      width="450px"
      @closed="handleDialogClosed"
    >
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import { attachmentList, attachmentAdd, attachmentDelete } from 'api/run-module/attachment-setting.js'
export default {
  components: {
    TableCreate
  },
  props: {},
  data() {
    return {
      formApi: null,
      formRules: [
        {
          type: 'input',
          title: '资料内容',
          field: 'dataContent',
          style: { width: '300px' },
          validate: this.formValidate({ required: true })
        }
      ],
      formOptions: {
        form: {
          labelWidth: '85px',
          inline: true
        },
        submitBtn: {
          show: false
        }
      },
      tableOptions: {
        requestParams: {
          url: attachmentList,
          data: {}
        },
        showSerialNumber: true,
        showCheckbox: true,
        columns: [
          {
            attrs: {
              label: '资料内容',
              prop: 'dataContent',
              align: 'left'
            }
          },
          {
            attrs: {
              label: '系统固定',
              prop: 'systemFixation',
              width: '100px',
              formatter: row => {
                return row.systemFixation === '1' ? '是' : '否'
              }
            }
          },
          {
            attrs: {
              label: '更新时间',
              prop: 'sysEtime'
            },
            filter: {
              name: 'timestamp'
            }
          }
        ]
      },
      checkedRows: [],
      dialogVisible: false
    }
  },
  mounted() {},
  methods: {
    handleAddClick() {
      this.dialogVisible = true
    },
    handleDeleteClick() {
      if (!this.checkedRows.length) {
        return this.$showToast('未选中任何行！')
      }
      // 筛选出包含系统固定项目
      const ret = this.checkedRows.some(item => item.systemFixation === '1')
      if (ret) {
        return this.$showToast('系统固定项无法删除！')
      }
      this.$confirm(`确定删除吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          attachmentDelete({
            ids: this.checkedRows.map(item => item.id)
          }, { showLoading: true }).then(res => {
            this.$showToast('删除成功！', 'success')
            this.$refs.tableDom.refreshTable()
          }).catch(err => {
            console.log(err)
          })
        })
    },
    handleSelectionChange(rows) {
      this.checkedRows = rows
    },
    handleDialogConfirm() {
      this.formApi.validate(valid => {
        if (!valid) return
        const params = this.formApi.formData()
        attachmentAdd(params).then(res => {
          this.$showToast('新增成功！', 'success')
          this.$refs.tableDom.refreshTable()
          this.dialogVisible = false
        }).catch(err => {
          console.log(err)
        })
      })
    },
    handleDialogClosed() {
      this.formApi.resetFields()
    }
  }
}
</script>

<style lang='scss'>

</style>
