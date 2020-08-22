<template>
  <el-dialog
    title="角色权限设置"
    :visible.sync="dialogShow"
    width="600px"
    :modal-append-to-body="false"
    @closed="handleDialogClosed"
  >
    <div class="menu-tree">
      <transition-group name="fade" mode="out-in">
        <el-tree
          v-show="!showUserPermissionPanel"
          key="menuTree"
          ref="menuTreeDom"
          :props="props"
          :data="menuTreeData"
          :empty-text="emptyText"
          :default-checked-keys="menuCheckedKeys"
          check-on-click-node
          node-key="id"
          default-expand-all
          highlight-current
          show-checkbox
        >
          <div slot-scope="{ node, data }" class="custom-tree-node">
            <p>
              {{ node.label }}
            </p>
            <p>
              <!-- <p v-if="data.isRoot"> -->
              <el-button type="text" size="mini" @click.stop="handleTreeBtnClick(data)">数据权限</el-button>
            </p>
          </div>
        </el-tree>
        <div v-if="showUserPermissionPanel" key="userPanel" class="user-permission-panel">
          <el-form ref="formDom" :model="formItem" label-width="90px" :rules="formRules">
            <div class="panel-header">
              <el-form-item label="用户权限" prop="userPermissionType">
                <el-select v-model="formItem.userPermissionType" placeholder="请选择" @change="handlePermissionChange">
                  <el-option
                    v-for="item in userPermissionTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <span class="btn-back" @click="handleBackClick">返回</span>
            </div>
          </el-form>
          <el-tree
            v-if="userPermissionSelectedKey === '2' || userPermissionSelectedKey === '6'"
            ref="departTreeDom"
            :key="departTreeKey"
            :props="props"
            :data="departTreeData"
            :empty-text="emptyText"
            :default-checked-keys="departCheckedKeys"
            node-key="id"
            default-expand-all
            highlight-current
            show-checkbox
            check-strictly
            :filter-node-method="handleDepartmentTreeFilter"
          />
        </div>
      </transition-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogShow=false">取消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getRoleById,
  getAuthConfig,
  roleUpdatePermission,
  getPermissionByMenuId
} from 'api/user-mng.js'
import { isEmptyObj, generateTree } from 'utils'
export default {
  props: {
    roleId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      dialogShow: false,
      menuTreeData: [],
      departTreeData: [],
      departmentData: [],
      emptyText: 'loading...',
      props: {
        label: 'name',
        children: 'children'
      },
      menuCheckedKeys: [],
      departCheckedKeys: [],
      showUserPermissionPanel: false, // 是否显示用户权限设置面板
      formItem: {
        userPermissionType: ''
      },
      formRules: {
        userPermissionType: [{ required: true }]
      },
      userPermissionTypeOptions: [
        {
          label: '全部数据',
          value: '1'
        },
        {
          label: '自定义部门',
          value: '2'
        },
        {
          label: '仅当前部门',
          value: '3'
        },
        {
          label: '部门及以下',
          value: '4'
        },
        {
          label: '仅本人',
          value: '5'
        },
        {
          label: '自定义用户',
          value: '6'
        }
      ],
      userPermissionSelectedKey: '',
      selectedMenuId: '',
      departTreeKey: 0, // 强制数据权限树渲染
      isDepartmentDisabled: false
    }
  },
  created() {
    this.getPermissionData()
  },
  mounted() {
    this.dialogShow = true
  },
  methods: {
    getPermissionData() {
      Promise.all([
        getRoleById({
          id: this.roleId
        }),
        getAuthConfig({})
      ]).then(res => {
        const [roleData, configData] = res
        if (roleData && !isEmptyObj(roleData.data)) {
          const { permissions } = roleData.data
          // 筛选选中的菜单
          this.menuCheckedKeys = permissions.filter(item => item.type === 1).map(item => item.permissionId)
        }
        if (!isEmptyObj(configData.data)) {
          const { sysMenuTableEntityDtos, sysDepartmentTableEntityDtos } = configData.data
          this.menuTreeData = generateTree(sysMenuTableEntityDtos, '0', 'id', 'parentId')
          let tempArr = []
          this.findHasChildrenNodeKeys(this.menuTreeData, tempArr)
          this.menuCheckedKeys = this.menuCheckedKeys.length && this.menuCheckedKeys.filter(key => !tempArr.includes(key))
          tempArr = null
          this.departmentData = sysDepartmentTableEntityDtos
        }
      }).catch(err => { console.log(err) })
        .finally(() => {
          this.emptyText = '暂无数据'
        })
    },
    handleDialogConfirm() {
      if (this.showUserPermissionPanel) {
        this.updateRoleDataPermission()
      } else {
        this.updateRoleMenuPermission()
      }
    },
    // 更新数据权限
    updateRoleDataPermission() {
      this.$refs.formDom.validate(valid => {
        const params = {
          roleId: this.roleId,
          menuId: this.selectedMenuId,
          type: 2
        }
        let permissions = [{
          type: 2,
          menuId: this.selectedMenuId,
          rule: this.userPermissionSelectedKey,
          permissionId: 0
        }]
        if (['2', '6'].includes(this.userPermissionSelectedKey)) {
          permissions = this.$refs.departTreeDom.getCheckedKeys().map(id => {
            return {
              type: 2,
              rule: this.userPermissionSelectedKey,
              menuId: this.selectedMenuId,
              permissionId: id
            }
          })
        }
        params.permissions = permissions
        roleUpdatePermission(params, { showLoading: true }).then(res => {
          this.$showToast('修改成功！', 'success')
          this.handleBackClick()
        }).catch(err => {
          console.log(err)
        })
      })
    },
    // 更新菜单权限
    updateRoleMenuPermission() {
      const menuCheckedKeys = [...this.$refs.menuTreeDom.getCheckedKeys(), ...this.$refs.menuTreeDom.getHalfCheckedKeys()]
      const params = {
        roleId: this.roleId,
        menuId: '',
        type: 1,
        permissions: menuCheckedKeys.map(id => {
          return {
            type: 1,
            rule: '',
            permissionId: id
          }
        })
      }
      roleUpdatePermission(params, { showLoading: true }).then(res => {
        this.dialogShow = false
        this.$showToast('修改成功！', 'success')
      }).catch(err => {
        console.log(err)
      })
    },
    handlePermissionChange(val) {
      this.userPermissionSelectedKey = val
      this.departCheckedKeys = []
      // 2 部门 6 个人
      // eslint-disable-next-line eqeqeq
      if (val === '2' || val === '6') {
        this.departTreeKey += 1
        val === '2' ? this.isDepartmentDisabled = false : this.isDepartmentDisabled = true
        if (!this.departTreeData.length) {
          const ret = generateTree(this.departmentData, '0', 'id', 'parentId')
          this.departTreeData = this.handleDepartmentTreeUser(ret)
        } else {
          this.departTreeData = this.handleDepartmentTreeUser(this.departTreeData, false)
        }
        this.$nextTick(() => {
          this.$refs.departTreeDom.filter()
        })
      }
    },
    handleDepartmentTreeUser(ret, transferData = true) {
      ret.forEach(item => {
        !item.hasOwnProperty('loginName') ? item.disabled = this.isDepartmentDisabled : ''
        if (Array.isArray(item.children)) {
          this.handleDepartmentTreeUser(item.children, transferData)
          if (transferData) {
            item.sysEmployeeTableEntityDtos ? item.children.push(...item.sysEmployeeTableEntityDtos) : ''
          }
        } else {
          if (transferData) {
            item.sysEmployeeTableEntityDtos ? item.children = item.sysEmployeeTableEntityDtos : ''
          }
        }
      })
      return ret
    },
    handleTreeBtnClick(data) {
      this.selectedMenuId = data.id
      this.showUserPermissionPanel = true
      this.getMenuDataPermissionById(data.id)
    },
    getMenuDataPermissionById(menuId) {
      getPermissionByMenuId({
        roleId: this.roleId,
        menuId: menuId
      }, { showLoading: true }).then(({ data }) => {
        if (data && Array.isArray(data.records) && data.records.length) {
          const rule = data.records[0].rule
          this.formItem.userPermissionType = rule
          this.userPermissionSelectedKey = rule
          this.handlePermissionChange(rule)
          if (['2', '6'].includes(rule)) {
            this.departCheckedKeys = data.records.map(item => item.permissionId)
          }
        }
      })
    },
    findHasChildrenNodeKeys(nodes, keyArr) {
      nodes.forEach(item => {
        if(Array.isArray(item.children) && item.children.length) {
          keyArr.push(item.id)
          this.findHasChildrenNodeKeys(item.children, keyArr)
        }
      })
    },
    handleBackClick() {
      this.showUserPermissionPanel = false
      this.userPermissionSelectedKey = ''
      this.departCheckedKeys = []
      this.departTreeData = []
      this.formItem.userPermissionType = ''
    },
    handleDialogClosed() {
      this.$emit('update:dialog-status', false)
    },
    handleDepartmentTreeFilter(value, data, node) {
      if (this.userPermissionSelectedKey === '2' && data.hasOwnProperty('loginName')) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.menu-tree {
  position: relative;
  min-height: 500px;
}
.custom-tree-node {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-between;
  padding-right: 8px;
}
.user-permission-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .el-form-item {
    margin: 0;
  }
  .btn-back {
    display: inline-block;
    padding: 5px 0;
    cursor: pointer;
    color: #409EFF;
  }
}

</style>
