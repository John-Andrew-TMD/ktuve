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
  fieldAdd,
  fieldUpdate,
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
          type: 'input',
          title: '业务名词',
          field: 'name',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '表字段',
          field: 'field',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '类型',
          field: 'fieldType',
          props: {
            placeholder: 'varchar(32)'
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '字段描述',
          field: 'des'
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
      dialogTitle: '业务名词新增'
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
      this.dialogTitle = '业务名词修改'
      getFieldById(
        {
          id: this.fieldId
        },
        { showLoading: true }
      ).then(res => {
        if (res && !isEmptyObj(res.data)) {
          const {
            name,
            field,
            fieldType,
            des,
            sysVersion
          } = res.data
          this.sysVersion = sysVersion
          this.fApi.setValue({
            name,
            field,
            fieldType,
            des
          })
        }
      }).catch(err => { console.log(err) })
    },
    handleDialogConfirm() {
      this.fApi.validate(valid => {
        if (valid) {
          if (this.fieldId !== -1) {
            fieldUpdate(
              {
                id: this.fieldId,
                sysVersion: this.sysVersion,
                ...this.fApi.formData()
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
          } else {
            fieldAdd(this.fApi.formData(), { showLoading: true })
              .then(res => {
                this.dialogShow = false
                this.$showToast('新增成功！', 'success')
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
