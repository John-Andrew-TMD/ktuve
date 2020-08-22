<template>
  <el-dialog
    title="接口菜单权限设置"
    :visible.sync="dialogShow"
    width="600px"
    :modal-append-to-body="false"
    @closed="handleDialogClosed"
  >
    <div class="menu-tree">
      <el-tree
        ref="treeDom"
        :props="props"
        :data="menuTreeData"
        :empty-text="emptyText"
        :default-checked-keys="checkedKeys"
        node-key="id"
        default-expand-all
        highlight-current
        show-checkbox
        check-strictly
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogShow=false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getInterfaceById,
  getMenuTree,
  bindMenu
} from 'api/system-setup.js'
import { isEmptyObj, generateTree } from 'utils'
export default {
  props: {
    interfaceId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      dialogShow: false,
      menuTreeData: [],
      emptyText: 'loading...',
      props: {
        label: 'name',
        children: 'children'
      },
      checkedKeys: []
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
        getInterfaceById({
          id: this.interfaceId
        }),
        getMenuTree({})
      ]).then(res => {
        const [interfaceData, menuTreeData] = res
        if (interfaceData && !isEmptyObj(interfaceData.data)) {
          const { menus } = interfaceData.data
          this.checkedKeys = menus.map(item => item.id)
        } else {
          return
        }
        if (menuTreeData.data && Array.isArray(menuTreeData.data.records)) {
          this.menuTreeData = generateTree(menuTreeData.data.records, '0', 'id', 'pid')
        }
      }).catch(err => { console.log(err) })
        .finally(() => {
          this.emptyText = '暂无数据'
        })
    },
    handleDialogConfirm() {
      const params = this.$refs.treeDom.getCheckedKeys().map(key => {
        return {
          interfaceId: this.interfaceId,
          menuId: key
        }
      })
      bindMenu(params, { showLoading: true }).then(res => {
        this.$showToast('设置成功！', 'success')
        this.handleDialogClosed()
      }).catch(() => {})
    },
    handleDialogClosed() {
      this.$emit('update:dialog-status', false)
    }
  }
}
</script>

<style lang='scss' scoped>
.menu-tree {
  min-height: 500px;
}

</style>
