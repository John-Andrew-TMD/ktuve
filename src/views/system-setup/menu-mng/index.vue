<template>
  <div class="app-content menu-mng-page">
    <div class="app-content-wrapper">
      <div class="btn-group sticky">
        <el-button type="primary" size="mini" @click="handleMenuAdd">新增菜单</el-button>
        <el-button type="primary" size="mini" @click="handleModuleAdd">新增模块</el-button>
        <el-button :disabled="!rowData" type="primary" size="mini" @click="handleTableClick('update')">编辑</el-button>
        <el-button :disabled="!rowData" type="danger" size="mini" @click="handleTableClick('delete')">删除</el-button>
      </div>
      <table-create ref="tableDom" :options="tableOptions" row-key="id" @current-change="handleCurrentChange">
        <template #name="{ scope }">
          <i class="iconfont" :class="scope.row.type | menuTypeFormat" />
          {{ scope.row.name }}
        </template>
        <template #icon="{ scope }">
          <i :class="'iconfont icon-' + scope.row.icon" />
        </template>
        <template #status="{ scope }">
          <el-tag
            effect="dark"
            :type="statusStyle[scope.row.status]"
          >{{ scope.row.status | filterStatus }}</el-tag>
        </template>
        <!-- <template #operation="{ scope }">
          <el-button type="primary" size="mini" @click="handleTableClick('update', scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleTableClick('delete', scope.row)">删除</el-button>
        </template> -->
      </table-create>
    </div>
    <dialog-menu-add-or-update
      v-if="dialogStatus"
      :dialog-status.sync="dialogStatus"
      :row-data="rowData"
      @confirm="handleDialogConfirm"
    />
    <dialog-module-add-or-update
      v-if="dialogModuleStatus"
      :dialog-status.sync="dialogModuleStatus"
      :row-data="rowData"
      @confirm="handleDialogConfirm"
    />
  </div>
</template>

<script>
import { menuList, menuDelete, moduleDelete } from 'api/system-setup.js'
import TableCreate from 'components/TableCreate'
import DialogMenuAddOrUpdate from './components/DialogMenuAddOrUpdate'
import DialogModuleAddOrUpdate from './components/DialogModuleAddOrUpdate'
import { generateTree } from 'utils'
export default {
  filters: {
    iconFormat(val) {
      if (!val) return ''
      return `iconfont ${val}`
    },
    menuTypeFormat(val) {
      return ['', 'icon-block', 'icon-menu', 'icon-element'][val] || val
    },
    filterStatus(val) {
      return ['启用', '禁用'][val] || '未知'
    }
  },
  components: {
    TableCreate,
    DialogMenuAddOrUpdate,
    DialogModuleAddOrUpdate
  },
  data() {
    return {
      tableOptions: {
        columns: [
          {
            attrs: {
              label: '菜单名称',
              prop: 'name',
              align: 'left',
              'min-width': '170px'
            },
            slot: true
          },
          {
            attrs: {
              label: '英文名称',
              prop: 'nameEn',
              'min-width': '150px'
            }
          },
          {
            attrs: {
              label: '菜单URL',
              prop: 'url',
              'min-width': '150px'
            }
          },
          {
            attrs: {
              label: '菜单路径',
              prop: 'path',
              'min-width': '150px'
            }
          },
          {
            attrs: {
              label: '菜单图标',
              prop: 'icon'
            },
            slot: true
          },
          {
            attrs: {
              label: 'permissionId',
              prop: 'menuCode',
              'min-width': '150px'
            }
          },
          {
            attrs: {
              label: '是否显示',
              prop: 'showFlag',
              formatter: row => {
                return ['否', '是'][row.showFlag] || ''
              }
            }
          },
          {
            attrs: {
              label: '是否缓存',
              prop: 'cacheFlag',
              formatter: row => {
                return ['否', '是'][row.cacheFlag] || ''
              }
            }
          },
          {
            attrs: {
              label: '状态',
              prop: 'status',
              width: '100',
              formatter: row => {
                return ['启用', '禁用'][row.status] || ''
              }
            },
            slot: true
          }
          // {
          //   attrs: {
          //     label: '操作',
          //     prop: 'operation',
          //     width: '150'
          //   },
          //   slot: true
          // }
        ],
        requestParams: {
          url: menuList,
          data: {}
        },
        showTools: false,
        showPagination: false,
        requestImmediate: false,
        tableBottomOffset: 10
      },
      dialogStatus: false,
      dialogModuleStatus: false,
      rowData: null,
      statusStyle: ['success', 'danger']
    }
  },
  created() {
    this.getMenuData()
  },
  methods: {
    getMenuData() {
      menuList({}).then(res => {
        const data = res.data.records || []
        if (Array.isArray(data) && data.length) {
          const ret = generateTree(data, '0', 'id', 'parentId', 'sortNo')
          this.$refs.tableDom.setData(ret)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleDialogConfirm() {
      this.getMenuData()
    },
    handleMenuAdd() {
      this.rowData = null
      this.dialogStatus = true
    },
    handleModuleAdd() {
      this.rowData = null
      this.dialogModuleStatus = true
    },
    handleCurrentChange(row) {
      this.rowData = row
    },
    handleTableClick(action) {
      const data = this.rowData
      if (!data) return this.$showToast('未选中任何行！')
      if (action === 'update') {
        if (data.type === 1) {
          this.dialogModuleStatus = true
        } else {
          this.dialogStatus = true
        }
      } else if (action === 'delete') {
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            if (data.type === 3) {
              moduleDelete({
                ids: [data.id]
              })
                .then(res => {
                  this.getMenuData()
                })
                .catch(() => {})
            } else {
              menuDelete({
                ids: [data.id]
              })
                .then(res => {
                  this.getMenuData()
                })
                .catch(() => {})
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
}
</script>
<style lang="scss">
.menu-mng-page {
  .el-table__body {
    .iconfont {
      margin-right: 1px;
      font-size: 16px;
      vertical-align: -1px;
    }
  }
}

</style>
