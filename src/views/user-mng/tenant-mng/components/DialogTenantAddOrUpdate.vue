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
import { tenantAdd, tenantUpdate, getTenantById } from 'api/user-mng.js'
import { isEmptyObj } from 'utils'
export default {
  props: {
    tenantId: {
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
          title: '公司名称',
          field: 'name',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '公司地址',
          field: 'address'
        },
        {
          type: 'input',
          title: '公司法人',
          field: 'corporation'
        },
        {
          type: 'input',
          title: '联系方式',
          field: 'phone',
          validate: this.formValidate({ type: 'mobile' })
        },
        {
          type: 'input',
          title: '公司邮箱',
          field: 'email',
          validate: this.formValidate({ type: 'email' })
        },
        {
          type: 'select',
          title: '状态',
          field: 'status',
          value: 0,
          options: [
            {
              value: 0,
              label: '正常'
            },
            {
              value: 1,
              label: '停用'
            },
            {
              value: 2,
              label: '到期'
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
      dialogTitle: '租户新增'
    }
  },
  created() {
    this._getTenantById()
  },
  mounted() {
    this.dialogShow = true
  },
  methods: {
    _getTenantById() {
      if (this.tenantId === -1) return
      this.dialogTitle = '租户修改'
      getTenantById(
        {
          id: this.tenantId
        },
        { showLoading: true }
      )
        .then(res => {
          if (!isEmptyObj(res.data)) {
            this.$nextTick(() => {
              const {
                name,
                address,
                corporation,
                phone,
                email,
                status,
                sysVersion
              } = res.data
              this.sysVersion = sysVersion
              this.fApi.setValue({
                name,
                address,
                corporation,
                phone,
                email,
                status
              })
            })
          }
        })
        .catch(err => {})
    },
    handleDialogConfirm() {
      this.fApi.validate(valid => {
        if (valid) {
          if (this.tenantId !== -1) {
            tenantUpdate({
              id: this.tenantId,
              sysVersion: this.sysVersion,
              ...this.fApi.formData()
            }, { showLoading: true })
              .then(res => {
                this.dialogShow = false
                this.$showToast('修改成功！', 'success')
                this.$emit('confirm')
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            tenantAdd(this.fApi.formData(), { showLoading: true })
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
