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
  departmentAdd,
  departmentUpdate,
  departmentTree,
  getDepartmentById
} from 'api/user-mng.js'
import { isEmptyObj, generateTree } from 'utils'
export default {
  props: {
    departmentId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      fApi: null,
      formRules: [
        {
          type: 'el-cascader',
          title: '父部门',
          field: 'parentId',
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
          type: 'input',
          title: '部门编码',
          field: 'code',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '部门名称',
          field: 'name',
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
        },
        {
          type: 'number-input',
          title: '排序',
          field: 'sortNo'
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
    this.getDepartmentData()
  },
  mounted() {
    this.dialogShow = true
  },
  methods: {
    getDepartmentData() {
      const reqs = [departmentTree({})]
      if (this.departmentId !== -1) {
        this.dialogTitle = '部门修改'
        reqs.push(
          getDepartmentById(
            {
              id: this.departmentId
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
          if (this.departmentId !== -1) {
            treeData = treeData.filter(item => item.id != this.departmentId)
          }
          const tree = generateTree(treeData, '-1', 'id', 'pid')
          this.fApi.updateRule('parentId', {
            props: {
              options: tree
            }
          })
        } else {
          return
        }
        if (currentData && !isEmptyObj(currentData.data)) {
          this.$nextTick(() => {
            const {
              parentId,
              name,
              code,
              status,
              sortNo,
              sysVersion
            } = currentData.data
            const parentIds = [parentId]
            let currentId = parentId
            while (currentId !== '-1') {
              const pid = treeData.filter(item => item.id == currentId)[0].pid
              if (pid !== '-1') {
                parentIds.unshift(pid)
              }
              currentId = pid
            }
            this.sysVersion = sysVersion
            this.fApi.setValue({
              parentId: parentIds,
              name,
              code,
              sortNo,
              status
            })
          })
        }
      }).catch(err => { console.log(err) })
    },
    handleDialogConfirm() {
      this.fApi.validate(valid => {
        if (valid) {
          if (this.departmentId !== -1) {
            departmentUpdate(
              {
                id: this.departmentId,
                sysVersion: this.sysVersion,
                sys_tenant_id: 1,
                ...this.fApi.formData(),
                parentId: this.fApi.getValue('parentId').pop()
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
            departmentAdd({
              ...this.fApi.formData(),
              parentId: this.fApi.getValue('parentId').pop(),
              sys_tenant_id: 1
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
