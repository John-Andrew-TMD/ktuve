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
import { userAdd, userUpdate, getUserById, departmentTree } from 'api/user-mng.js'
import { isEmptyObj, generateTree } from 'utils'
import md5 from 'js-md5'
export default {
  props: {
    userId: {
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
          title: '员工名称',
          field: 'name',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '员工编号',
          field: 'code',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '登录名',
          field: 'loginName',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '登录密码',
          field: 'password',
          props: {
            type: 'password'
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '再次输入',
          field: 'passwordRepeat',
          props: {
            type: 'password'
          },
          validate: this.formValidate({ required: true, validator: {
            fn: this.passwordCompare
          }})
        },
        // {
        //   type: 'input',
        //   title: '员工级别',
        //   field: 'levelId',
        //   validate: this.formValidate({ required: true })
        // },
        // {
        //   type: 'select',
        //   title: '员工职务',
        //   field: 'positionId',
        //   validate: this.formValidate({ required: true })
        // },
        {
          type: 'el-cascader',
          title: '所属部门',
          field: 'departmentId',
          props: {
            options: [],
            props: {
              value: 'id',
              label: 'name',
              checkStrictly: true
            }
          },
          style: { width: '100%' },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'radio',
          title: '性别',
          field: 'sex',
          value: 1,
          options: [
            { value: 1, label: '男' },
            { value: 2, label: '女' }
          ],
          validate: this.formValidate({ required: true })
        },
        {
          type: 'el-date-picker',
          title: '生日',
          field: 'birthday',
          props: { valueFormat: 'timestamp' }
        },
        {
          type: 'input',
          title: '办公电话',
          field: 'contactNumber',
          validate: this.formValidate({ type: 'telOrMobile' })
        },
        {
          type: 'input',
          title: '传真',
          field: 'fax',
          validate: this.formValidate({ type: 'fax' })
        },
        {
          type: 'input',
          title: '邮编',
          field: 'zipCode',
          validate: this.formValidate({ type: 'post' })
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
              label: '冻结'
            },
            {
              value: 2,
              label: '过期'
            },
            {
              value: 3,
              label: '离职'
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
      dialogTitle: '用户新增'
    }
  },
  created() {
    this.getUserData()
  },
  mounted() {
    this.dialogShow = true
  },
  methods: {
    getUserData() {
      const reqs = [departmentTree({})]
      if (this.userId !== -1) {
        this.dialogTitle = '用户修改'
        this.$nextTick(() => {
          this.fApi.removeField('password')
          this.fApi.removeField('passwordRepeat')
        })
        reqs.push(
          getUserById(
            {
              id: this.userId
            },
            { showLoading: true }
          )
        )
      }
      Promise.all(reqs).then(res => {
        // eslint-disable-next-line prefer-const
        let [treeData, currentData] = res
        treeData = treeData.data.records || []
        if (Array.isArray(treeData) && treeData.length) {
          const tree = generateTree(treeData, '-1', 'id', 'pid')
          this.fApi.updateRule('departmentId', {
            props: {
              options: tree
            }
          })
        } else {
          return
        }
        if (currentData && !isEmptyObj(currentData.data)) {
          const {
            id,
            name,
            code,
            loginName,
            departmentId,
            sex,
            birthday,
            contactNumber,
            fax,
            zipCode,
            status,
            sysVersion
          } = currentData.data
          const departmentIds = [departmentId]
          let currentId = departmentId
          while (currentId !== '-1') {
            const pid = treeData.filter(item => item.id == currentId)[0].pid
            if (pid !== '-1') {
              departmentIds.unshift(pid)
            }
            currentId = pid
          }
          this.sysVersion = sysVersion
          this.id = id
          this.fApi.setValue({
            name,
            code,
            loginName,
            departmentId: departmentIds,
            sex,
            birthday,
            contactNumber,
            fax,
            zipCode,
            status
          })
        }
      }).catch(err => { console.log(err) })
    },
    handleDialogConfirm() {
      this.fApi.validate(valid => {
        if (valid) {
          const params = this.fApi.formData()
          if (this.userId !== -1) {
            userUpdate(
              {
                id: this.id,
                sysVersion: this.sysVersion,
                ...params,
                departmentId: this.fApi.getValue('departmentId').pop()
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
            params.password = md5(params.password)
            userAdd({
              ...params,
              departmentId: this.fApi.getValue('departmentId').pop()
            },
            { showLoading: true }
            )
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
    },
    passwordCompare(rule, value, callback) {
      if (!value.length) {
        callback(new Error('请再次输入密码！'))
      } else if (value !== this.fApi.getValue('password')) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang='scss'>
</style>
