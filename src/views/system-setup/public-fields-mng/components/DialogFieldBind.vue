<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogShow"
    width="600px"
    :modal-append-to-body="false"
    @closed="handleDialogClosed"
  >
    <form-create v-model="fApi" :rule="formRules" :option="formOptions" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogShow=false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getDBTableList,
  fieldBind,
  getFieldById
} from 'api/system-setup.js'
import { isEmptyObj } from 'utils'
export default {
  props: {
    fieldId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      fApi: null,
      formRules: [
        {
          type: 'checkbox',
          title: '数据库表',
          field: 'tableIds',
          options: [],
          validate: this.formValidate({ required: true })
        }
      ],
      formOptions: {
        form: {
          labelWidth: '90px'
        },
        submitBtn: {
          show: false
        }
      },
      dialogShow: false,
      dialogTitle: '业务词库绑定'
    }
  },
  created() {
    this.getFildData()
  },
  mounted() {
    this.dialogShow = true
  },
  methods: {
    getFildData() {
      if (this.fieldId === -1) return
      Promise.all([
        getFieldById(
          {
            id: this.fieldId
          },
          { showLoading: true }
        ),
        getDBTableList({})
      ]).then(res => {
        const [bindTables, DBTables] = res
        if (bindTables && !isEmptyObj(bindTables.data)) {
          const {
            tables,
            sysVersion
          } = bindTables.data
          this.sysVersion = sysVersion
          if (Array.isArray(tables)) {
            this.fApi.setValue('tableIds', tables.map(item => item.id))
          }
        }
        if (DBTables.data && Array.isArray(DBTables.data.records)) {
          this.DBTablesOptions = DBTables.data.records.map(item => {
            return {
              value: item.id,
              label: item.tableName
            }
          })
          this.fApi.updateRule('tableIds', {
            options: this.DBTablesOptions
          })
        }
      }).catch(err => { console.log(err) })
    },
    handleDialogConfirm() {
      this.fApi.validate(valid => {
        if (valid) {
          if (this.fieldId !== -1) {
            const selectedTables = this.fApi.getValue('tableIds').map(id => {
              return {
                id,
                tableName: this.DBTablesOptions.filter(item => item.value === id)[0].label
              }
            })
            fieldBind(
              {
                id: this.fieldId,
                sysVersion: this.sysVersion,
                ...this.fApi.formData(),
                tables: selectedTables
              },
              { showLoading: true }
            )
              .then(res => {
                this.dialogShow = false
                this.$showToast('修改成功！', 'success')
                this.$emit('confirm')
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialog-status', false)
    }
  }
}
</script>

<style lang='scss'>
</style>
