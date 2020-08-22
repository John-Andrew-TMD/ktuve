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
import { interfaceAdd, interfaceUpdate, getInterfaceById } from 'api/system-setup.js'
import { isEmptyObj } from 'utils'
export default {
  props: {
    interfaceId: {
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
          title: '接口名称',
          field: 'name',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '请求路径',
          field: 'url',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'select',
          title: '状态',
          field: 'status',
          value: 0,
          options: [
            {
              value: 0,
              label: '启用'
            },
            {
              value: 1,
              label: '禁用'
            }
          ],
          style: { width: '220px' },
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
      dialogTitle: '部门新增'
    }
  },
  created() {
    this.getInterfaceData()
  },
  mounted() {
    this.dialogShow = true
  },
  methods: {
    getInterfaceData() {
      if (this.interfaceId !== -1) {
        this.dialogTitle = '角色修改'
        getInterfaceById(
          {
            id: this.interfaceId
          },
          { showLoading: true }
        ).then(res => {
          if (res && !isEmptyObj(res.data)) {
            const {
              name,
              url,
              status,
              sysVersion
            } = res.data
            this.sysVersion = sysVersion
            this.fApi.setValue({
              name,
              url,
              status
            })
          }
        })
      }
    },
    handleDialogConfirm() {
      this.fApi.validate(valid => {
        if (valid) {
          if (this.interfaceId !== -1) {
            interfaceUpdate(
              {
                id: this.interfaceId,
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
            interfaceAdd({
              ...this.fApi.formData()
            }, { showLoading: true })
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
