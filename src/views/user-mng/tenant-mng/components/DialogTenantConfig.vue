<template>
  <div v-transfer-dom class="inline-dialog">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogShow"
      width="600px"
      :modal-append-to-body="false"
      :modal="false"
      @closed="handleDialogClosed"
    >
      <form-create v-model="fApi" :rule="formRules" :option="formOptions" />
      <span slot="footer" class="dialog-footer">
        <el-button v-if="showDeleteButton" type="danger" @click="handleDataSourceDelete">删除</el-button>
        <el-button @click="dialogShow=false">取消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { tenantAdminAdd, tenantAdminUpdate, userDelete, getTenantAdminById, getRootAdminRoleConfig } from 'api/user-mng.js'
import { isEmptyObj } from 'utils'
import md5 from 'js-md5'
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
          title: '用户名',
          field: 'name',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '密码',
          field: 'password',
          props: {
            type: 'password'
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'select',
          title: '角色',
          field: 'roleId',
          options: [],
          style: { width: '220px' },
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
      showDeleteButton: false,
      tenantAdminId: null,
      dialogTitle: '根管理员配置'
    }
  },
  created() {
    this._getTenantDataSourceById()
  },
  mounted() {
    this.dialogShow = true
  },
  methods: {
    _getTenantDataSourceById() {
      if (this.tenantId === -1) return
      Promise.all([
        getTenantAdminById({
          id: this.tenantId
        }, { showLoading: true }),
        getRootAdminRoleConfig({})
      ]).then(res => {
        const [adminData, configData] = res
        if (adminData && !isEmptyObj(adminData.data)) {
          this.showDeleteButton = true
          this.fApi.updateRule('password', {
            validate: ''
          })
          this.$nextTick(() => {
            const {
              id,
              name,
              roleId,
              status,
              sysVersion
            } = adminData.data
            this.sysVersion = sysVersion
            this.tenantAdminId = id
            this.fApi.setValue({
              name,
              roleId,
              status
            })
          })
        }
        if (configData.data && Array.isArray(configData.data.records)) {
          this.fApi.updateRule('roleId', {
            options: configData.data.records.map(item => {
              return {
                value: item.id,
                label: item.name
              }
            })
          })
        }
      }).catch(err => { console.log(err) })
    },
    handleDialogConfirm() {
      this.fApi.validate(valid => {
        if (valid) {
          const params = this.fApi.formData()
          params.password = md5(params.password)
          if (this.tenantAdminId != null) {
            tenantAdminUpdate({
              id: this.tenantAdminId,
              sysVersion: this.sysVersion,
              ...params
            }, { showLoading: true })
              .then(res => {
                this.dialogShow = false
                this.$showToast('修改成功！', 'success')
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            tenantAdminAdd({
              sysTenantId: this.tenantId,
              ...params
            }, { showLoading: true })
              .then(res => {
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
    handleDataSourceDelete() {
      this.$confirm(`确定删除吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          userDelete({
            ids: [this.tenantAdminId]
          }, { showLoading: true }).then(res => {
            this.dialogShow = false
            this.$showToast('删除成功！', 'success')
          }).catch(() => {})
        })
        .catch(err => { console.log(err) })
    },
    handleDialogClosed() {
      this.$emit('update:dialog-status', false)
    }
  }
}
</script>

<style lang='scss'>
</style>
