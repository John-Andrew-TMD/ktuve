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
        <el-button v-if="!showDeleteButton" type="primary" @click="handleDialogConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { tenantDataSourceAdd, tenantDataSourceUpdate, tenantDataSourceDelete, getTenantDataSourceById } from 'api/user-mng.js'
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
          title: '用户名',
          field: 'user',
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
          type: 'input',
          title: 'ip',
          field: 'ip',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'number-input',
          title: '端口',
          field: 'port',
          validate: this.formValidate({ required: true, min: 1, max: 65535 })
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
      tenantDataSourceId: null,
      dialogTitle: '租户数据源管理'
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
      getTenantDataSourceById(
        {
          id: this.tenantId
        },
        { showLoading: true }
      )
        .then(res => {
          if (!isEmptyObj(res.data)) {
            this.showDeleteButton = true
            this.fApi.updateRule('password', {
              validate: ''
            })
            this.$nextTick(() => {
              const {
                id,
                user,
                ip,
                port,
                status,
                sysVersion
              } = res.data
              this.sysVersion = sysVersion
              this.tenantDataSourceId = id
              this.fApi.setValue({
                user,
                ip,
                port,
                status
              })
            })
          }
        })
        .catch(err => { console.log(err) })
    },
    handleDialogConfirm() {
      this.fApi.validate(valid => {
        if (valid) {
          // 修改逻辑暂时去除
          // if (this.tenantDataSourceId !== null) {
          //   tenantDataSourceUpdate({
          //     id: this.tenantDataSourceId,
          //     sysVersion: this.sysVersion,
          //     ...this.fApi.formData()
          //   }, { showLoading: true })
          //     .then(res => {
          //       this.dialogShow = false
          //       this.$showToast('修改成功！', 'success')
          //     })
          //     .catch(err => {
          //       console.log(err)
          //     })
          // } else {
          tenantDataSourceAdd({
            sysTenantId: this.tenantId,
            ...this.fApi.formData()
          }, { showLoading: true })
            .then(res => {
              this.dialogShow = false
              this.$showToast('新增成功！', 'success')
            })
            .catch(err => {
              console.log(err)
            })
          // }
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
          tenantDataSourceDelete({
            ids: [this.tenantDataSourceId]
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
