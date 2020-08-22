<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogShow"
    width="600px"
    :modal-append-to-body="false"
    @closed="handleDialogClosed"
  >
    <form-create v-model="fApi" :rule="formRules" :option="formOptions" />
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShow=false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { moduleAdd, moduleUpdate, getModuleById, menuList } from 'api/system-setup.js'
import { generateTree, isEmptyObj } from 'utils'
export default {
  props: {
    rowData: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      fApi: null,
      formRules: [
        {
          type: 'el-cascader',
          title: '父模块',
          field: 'parentId',
          props: {
            options: [],
            props: {
              value: 'id',
              label: 'name',
              checkStrictly: true
            },
            clearable: true
          },
          style: { width: '100%' }
        },
        {
          type: 'input',
          title: '模块名称',
          field: 'name',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'el-radio-group',
          title: '状态',
          field: 'status',
          value: '0',
          children: [
            {
              type: 'el-radio-button',
              props: {
                label: '0'
              },
              children: ['启用']
            },
            {
              type: 'el-radio-button',
              props: {
                label: '1'
              },
              children: ['禁用']
            }
          ],
          validate: this.formValidate({ required: true })
        },
        {
          type: 'number-input',
          title: '排序',
          props: {
            'max-decimal': 0
          },
          validate: this.formValidate({ required: true }),
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
      dialogTitle: '菜单新增'
    }
  },
  created() {
    this.getMenuData()
  },
  mounted() {
    this.dialogShow = true
  },
  methods: {
    async getMenuData() {
      const reqs = [menuList({})]
      if (this.rowData) {
        this.dialogTitle = '模块修改'
        reqs.push(
          getModuleById(
            {
              id: this.rowData.id
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
          treeData = treeData.filter(item => item.type === 1)
          if (this.rowData) {
            treeData = treeData.filter(item => item.id !== this.rowData.id)
          }
          const tree = generateTree(treeData, '0', 'id', 'parentId')
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
              status,
              sortNo,
              sysVersion
            } = currentData.data
            const parentIds = [parentId]
            let currentId = parentId
            while (currentId !== '0') {
              const pid = treeData.filter(item => item.id == currentId)[0].parentId
              if (pid !== '0') {
                parentIds.unshift(pid)
              }
              currentId = pid
            }
            this.sysVersion = sysVersion
            this.fApi.setValue({
              parentId: parentIds,
              name,
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
          if (this.rowData) {
            moduleUpdate(
              {
                id: this.rowData.id,
                sysVersion: this.sysVersion,
                ...this.fApi.formData(),
                parentId: Array.isArray(this.fApi.getValue('parentId')) && this.fApi.getValue('parentId').pop() || ''
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
            moduleAdd({
              ...this.fApi.formData(),
              parentId: Array.isArray(this.fApi.getValue('parentId')) && this.fApi.getValue('parentId').pop() || '',
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
