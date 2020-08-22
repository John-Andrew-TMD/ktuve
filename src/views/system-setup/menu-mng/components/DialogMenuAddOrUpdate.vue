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
import { menuAdd, menuUpdate, getMenuById, menuList } from 'api/system-setup.js'
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
          title: '父菜单',
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
          title: '菜单名称',
          field: 'name',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '英文名称',
          field: 'nameEn',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '菜单URL',
          field: 'url',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '菜单路径',
          field: 'path',
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '菜单图标',
          field: 'icon',
          props: {
            suffixIcon: ''
          },
          on: {
            change: () => {
              this.fApi.updateRule('icon', {
                props: {
                  suffixIcon: `iconfont icon-${(this.fApi.getValue('icon') + '').trim()}`
                }
              })
            }
          }
        },
        {
          type: 'input',
          title: '重定向',
          field: 'redirect'
        },
        {
          type: 'el-radio-group',
          title: '菜单类型',
          field: 'type',
          value: '2',
          children: [
            {
              type: 'el-radio-button',
              props: {
                label: '2'
              },
              children: ['菜单']
            },
            {
              type: 'el-radio-button',
              props: {
                label: '3'
              },
              children: ['页面元素']
            }
          ],
          on: {
            change: this.handleMenuTypeChange
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'el-radio-group',
          title: '是否显示',
          field: 'showFlag',
          value: '1',
          children: [
            {
              type: 'el-radio-button',
              props: {
                label: '1'
              },
              children: ['显示']
            },
            {
              type: 'el-radio-button',
              props: {
                label: '0'
              },
              children: ['不显示']
            }
          ],
          validate: this.formValidate({ required: true })
        },
        {
          type: 'el-radio-group',
          title: '是否缓存',
          field: 'cacheFlag',
          value: '1',
          children: [
            {
              type: 'el-radio-button',
              props: {
                label: '1'
              },
              children: ['缓存']
            },
            {
              type: 'el-radio-button',
              props: {
                label: '0'
              },
              children: ['不缓存']
            }
          ],
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
          field: 'sortNo',
          props: {
            'max-decimal': 0
          },
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
      dialogTitle: '菜单新增'
    }
  },
  created() {
    this.getMenuData()
  },
  mounted() {
    this.dialogShow = true
    if (this.rowData) {
      this.$nextTick(() => {
        this.handleMenuTypeChange(this.rowData.type)
      })
    }
  },
  methods: {
    async getMenuData() {
      const reqs = [menuList({})]
      if (this.rowData) {
        this.dialogTitle = '菜单修改'
        reqs.push(
          getMenuById(
            {
              id: this.rowData.id
            },
            { showLoading: true }
          )
        )
      }
      Promise.all(reqs).then(([treeData, currentData]) => {
        // eslint-disable-next-line prefer-const
        treeData = treeData.data.records || []
        if (Array.isArray(treeData) && treeData.length) {
          treeData = treeData.filter(item => item.type !== 3)
          if (this.rowData) {
            treeData = treeData.filter(item => item.id !== this.rowData.id)
          }
          this.treeData = treeData
          const tree = generateTree(treeData, '0', 'id', 'parentId', 'sortNo')
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
              nameEn,
              url,
              path,
              showFlag,
              cacheFlag,
              icon,
              redirect,
              type,
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
              nameEn,
              url,
              path,
              showFlag,
              cacheFlag,
              icon,
              redirect,
              type,
              status,
              sortNo,
              sysVersion
            })
            this.fApi.updateRule('icon', {
              props: {
                suffixIcon: `iconfont icon-${icon}`
              }
            })
          })
        }
      }).catch(err => { console.log(err) })
    },
    handleDialogConfirm() {
      this.fApi.validate(valid => {
        if (valid) {
          if (this.rowData) {
            menuUpdate(
              {
                id: this.rowData.id,
                sysVersion: this.sysVersion,
                ...this.fApi.formData(),
                parentId: Array.isArray(this.fApi.getValue('parentId')) && this.fApi.getValue('parentId').pop() || '',
                moduleId: this.findModuleId()
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
            menuAdd({
              ...this.fApi.formData(),
              parentId: Array.isArray(this.fApi.getValue('parentId')) && this.fApi.getValue('parentId').pop() || '',
              moduleId: this.findModuleId()
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
    findModuleId() {
      const parentIds = this.fApi.getValue('parentId')
      if (!parentIds) return 0
      const ret = parentIds.reverse().filter(id => this.treeData.some(item => item.type === 3 && item.id === id))
      return ret.shift() || 0
    },
    handleDialogClosed() {
      this.$emit('update:dialog-status', false)
    },
    handleMenuTypeChange(val) {
      if (val == 3) {
        this.fApi.hidden(true, ['icon', 'redirect', 'showFlag', 'cacheFlag'])
        this.fApi.updateRules({
          url: {
            validate: this.formValidate({ required: false })
          },
          path: {
            validate: this.formValidate({ required: false })
          },
          showFlag: {
            validate: this.formValidate({ required: false })
          },
          cacheFlag: {
            validate: this.formValidate({ required: false })
          }
        }, true)
      } else {
        this.fApi.hidden(false, ['url', 'path', 'icon', 'redirect', 'showFlag', 'cacheFlag'])
        this.fApi.updateRules({
          url: {
            validate: this.formValidate({ required: true })
          },
          path: {
            validate: this.formValidate({ required: true })
          },
          showFlag: {
            validate: this.formValidate({ required: true })
          },
          cacheFlag: {
            validate: this.formValidate({ required: true })
          }
        }, true)
      }
    }
  }
}
</script>
