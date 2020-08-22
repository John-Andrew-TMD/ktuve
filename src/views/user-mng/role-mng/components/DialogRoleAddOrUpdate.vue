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
  roleAdd,
  roleUpdate,
  getRoleById
} from 'api/user-mng.js'
import { isEmptyObj } from 'utils'
export default {
  props: {
    roleId: {
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
          title: '角色名称',
          field: 'name',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'select',
          title: '状态',
          field: 'status',
          value: 1,
          options: [
            // {
            //   value: 0,
            //   label: '未知'
            // },
            {
              value: 1,
              label: '启用 '
            },
            {
              value: 2,
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
      dialogTitle: '角色新增'
    }
  },
  created() {
    this.getRoleData()
  },
  mounted() {
    this.dialogShow = true
  },
  methods: {
    getRoleData() {
      if (this.roleId !== -1) {
        this.dialogTitle = '角色修改'
        getRoleById(
          {
            id: this.roleId
          },
          { showLoading: true }
        ).then(res => {
          if (res && !isEmptyObj(res.data)) {
            const {
              name,
              status,
              sysVersion
            } = res.data
            this.sysVersion = sysVersion
            this.fApi.setValue({
              name,
              status
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    handleDialogConfirm() {
      this.fApi.validate(valid => {
        if (valid) {
          if (this.roleId !== -1) {
            roleUpdate(
              {
                id: this.roleId,
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
            roleAdd({
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
