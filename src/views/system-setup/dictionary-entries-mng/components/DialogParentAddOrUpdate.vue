<template>
  <el-dialog
    :title="dialogTitle"
    :modal-append-to-body="false"
    :visible.sync="dialogVisible"
    width="450px"
    @closed="handleDialogClosed"
  >
    <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible=false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { isEmptyObj } from 'utils'
import { parentDictAdd, parentDictUpdate } from 'api/system-setup.js'
export default {
  props: {
    rowData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '字典项新增',
      formApi: null,
      formRules: [
        {
          type: 'input',
          title: '字典代码',
          field: 'dictCode',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '字典名称',
          field: 'dictName',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'hidden',
          title: '字典类型',
          field: 'dictType',
          value: '0'
        },
        {
          type: 'select',
          title: '维护标志',
          field: 'maintainFlag',
          options: [
            {
              value: '1',
              label: '修改'
            },
            {
              value: '2',
              label: '删除'
            },
            {
              value: '3',
              label: '增加'
            },
            {
              value: '@',
              label: '全部'
            }
          ],
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '备注信息',
          field: 'remark',
          props: {
            type: 'textarea',
            row: 2
          }
        }
      ],
      formOptions: {
        form: { labelWidth: '85px' },
        submitBtn: { show: false }
      }
    }
  },
  mounted() {
    this.dialogVisible = true
    this.setFormData()
  },
  methods: {
    setFormData() {
      if (!isEmptyObj(this.rowData)) {
        this.dialogTitle = '字典项修改'
        this.$nextTick(() => {
          this.formApi.disabled(true, 'dictCode')
          this.formApi.setValue(this.rowData)
        })
      }
    },
    handleDialogConfirm() {
      this.formApi.validate(async valid => {
        if (valid) {
          let url = parentDictAdd
          if (!isEmptyObj(this.rowData)) {
            url = parentDictUpdate
          }
          const params = this.formApi.formData()
          this.$promiseRequest(url, params, {
            needDto: false,
            showLoading: true
          })
            .then(res => {
              this.$showToast(res.msg, 'success')
              this.dialogVisible = false
              this.$emit('dialog-confirm', 'parent')
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang='scss'>
</style>
