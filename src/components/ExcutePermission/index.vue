<template>
  <div class="tree-lists">
    <div class="tips">
      请为{{ userOrRoleName }}分配操作权限，
      <i class="red">●</i>图标表示没有授权权限，
      <i class="yellow">●</i>图标表示还未审批，
      <i class="blue">●</i>图标表示角色权限，
      <i class="green">●</i>图标表示允许改变
    </div>
    <h3>{{ actionOptions.title }}</h3>

    <el-tree
      :props="props"
      :data="treeLists"
      node-key="menuid"
      show-checkbox
      :default-expanded-keys="expandedKeys"
      :default-checked-keys="showCheckedKeys"
      empty-text
      ref="treeDom"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <i :class="node | treeIconFormat"></i>
        {{ node.label }}
      </span>
    </el-tree>
  </div>
</template>

<script>
const RIGHT_TYPE_LIST = {
  ExcutePermission: 0,
  SetUsersPermission: 1,
  SetPriUserApprovalPermission: 2,
  SetSecUserApprovalPermission: 3,
  SetRolesPermission: 4,
  SetPriRolesApprovalPermission: 5,
  SetSecRolesApprovalPermission: 6
};
const CONFIG = {
  user: {
    getAccess: "100105",
    setAccess: "100106"
  },
  role: {
    getAccess: "100213",
    setAccess: "100207"
  }
};
export default {
  data() {
    return {
      props: {
        label: "menucaption",
        children: "children"
      },
      treeLists: [],
      checkedKeys: [], // 接口返回选中的menuid
      showCheckedKeys: [], // 需要显示在页面的menuid
      expandedKeys: [],
      userOrRoleName: "",
      type: ""
    };
  },
  props: {
    actionOptions: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    rightType() {
      return RIGHT_TYPE_LIST[this.actionOptions.type];
    }
  },
  filters: {
    treeIconFormat(node) {
      if (!node) return "";
      if (node.level === 1) {
        if (node.expanded) return "iconfont icon-folder-open";
        return "iconfont icon-folder-close";
      } else if (node.data.icon) {
        return `icon-circle ${node.data.icon}`;
      } else {
        return "";
      }
    }
  },
  created() {
    this._initUI();
    this._getUserAccesses();
  },
  methods: {
    _initUI() {
      let params = {};
      let { username = "", rolename = "" } = this.actionOptions.data;
      let { userid, roleid } = this.actionOptions.data;
      if (username) {
        this.userOrRoleName = `用户【${this.actionOptions.data.username}】`;
        params = { userid };
        this.type = "user";
      } else if (rolename) {
        this.userOrRoleName = `角色【${this.actionOptions.data.rolename}】`;
        params = { roleid };
        this.type = "role";
      }
      this.params = params;
    },
    handleDialogConfirm() {
      return new Promise((resolve, reject) => {
        if (!this.type) {
          this.$showToast("非法组件调用！");
          return reject();
        }
        // 获取选中和半选中的节点
        let changedKeys = this._getCheckedKeys();
        // 合并接口返回节点与当前选中的节点key
        let union = _.union(this.checkedKeys, changedKeys);
        // 筛选出新选中的节点
        let waitAddKeysList = _.difference(union, this.checkedKeys);
        // 筛选出需要删除的节点
        let waitDeleteKeysList = _.difference(union, changedKeys);

        if (!waitAddKeysList.length && !waitDeleteKeysList.length) {
          this.$showToast("权限设置未发生改变！", "warning");
          reject();
          return;
        }
        let confirmStr = [
          ...waitAddKeysList.map(item => `${item},A`),
          ...waitDeleteKeysList.map(item => `${item},D`)
        ].join("|");
        this.$promiseRequest({
          code: CONFIG[this.type].setAccess,
          data: {
            ...this.params,
            righttype: this.rightType + "",
            packet1: "data",
            packet2: "2",
            packet3: "menuid,action",
            packet4: ",|",
            menurights1: confirmStr
          },
          act: {
            menu_id: "101000000"
          }
        })
          .then(res => {
            this.$showToast(res.data.result.prompt, "success");
            resolve();
          })
          .catch(err => {
            console.log(err);
            reject();
          });
      });
    },
    _getCheckedKeys() {
      let checkedKeys = this.$refs.treeDom.getCheckedKeys();
      let halfCheckedKeys = this.$refs.treeDom.getHalfCheckedKeys();
      let fullCheckedKeys = [...halfCheckedKeys, ...checkedKeys];
      fullCheckedKeys = fullCheckedKeys.filter(item => item.length !== 1);
      return fullCheckedKeys;
    },
    _getUserAccesses() {
      if (!this.type) return this.$showToast("非法组件调用！");
      this.$promiseRequest({
        code: CONFIG[this.type].getAccess,
        data: {
          ...this.params,
          righttype: this.rightType
        }
      })
        .then(res => {
          this._dataParser(res.data.record);
        })
        .catch(err => {
          console.log(err);
        });
    },
    _dataParser(data) {
      if (!data.length) return;
      let topTreeNodes = [],
        topTreeNodeIds = [],
        selectedNodesIds = [];
      data.map(item => {
        // 寻找顶级节点
        this._findTopTreeNodes(item, topTreeNodes, topTreeNodeIds);
        // 设置节点颜色状态
        this._setTreeNodesStatus(item);

        item.rightstatus === "1" ? selectedNodesIds.push(item.menuid) : "";
      });
      let res = this.generateTree([...topTreeNodes, ...data], null);
      this.treeLists = Object.freeze(res);
      this.checkedKeys = selectedNodesIds;
      this.expandedKeys = topTreeNodeIds;
    },
    _findTopTreeNodes(data, topTreeNodes, topTreeNodeIds) {
      let [menuGroupId, menuGroupName] = data.menugroup.split("|");
      if (!topTreeNodeIds.includes(menuGroupId)) {
        topTreeNodeIds.push(menuGroupId);
        topTreeNodes.push({
          id: menuGroupId,
          menuid: menuGroupId,
          menucaption: menuGroupName,
          menupos: menuGroupId,
          rightstatus: "0"
        });
      }
      // 重新设置menupos
      this._resetMenuPos(data, menuGroupId);
    },
    _setTreeNodesStatus(data) {
      if (data.grantstatus === "0") {
        // 0表示没有授权权限
        data.icon = "red";
        data.disabled = true;
      } else if (data.checkstatus === "1") {
        // 1表示正在审核
        data.icon = "yellow";
        data.rightstatus = "1";
      } else if (data.rightstatus === "2") {
        // 0没有此权限 1用户权限 2角色权限
        data.icon = "blue";
      } else {
        data.icon = "green";
      }
    },
    _resetMenuPos(data, menuGroupId) {
      data.menupos = menuGroupId + data.menupos;
    },
    getParentNode(data, parentNode) {
      const newArry = [];
      let i = 0;
      let len = data.length;
      for (; i < len; i++) {
        if (!parentNode) {
          if (data[i].menupos.length === 1) {
            newArry.push(data[i]);
          }
        } else if (data[i].menupos.slice(0, -1) === parentNode.menupos) {
          if (data[i].menutype === "3" && parentNode.icon === "yellow") {
            data[i].icon = yellow;
          }
          newArry.push(data[i]);
          data.splice(i, 1);
          len--;
          i--;
        }
      }
      return newArry;
    },
    generateTree(data, parentNode) {
      const nodes = [];
      const childNodes = this.getParentNode(data, parentNode);
      if (childNodes.length) {
        nodes.push(...childNodes);
        childNodes.map(item => {
          const res = this.generateTree(data, item);
          if (res.length) {
            item.children = res;
          } else if (
            (this.type === "user" && item.rightstatus === "2") ||
            (this.type === "role" && item.rightstatus === "1")
          ) {
            this.showCheckedKeys.push(item.menuid);
          }
        });
      }
      return nodes;
    }
  }
};
</script>

<style lang='scss' scoped>
.tree-lists {
  min-height: 540px;

  h3 {
    font-size: 15px;
    margin-bottom: 10px;
  }

  .custom-tree-node {
    line-height: 27px;

    .iconfont {
      margin-right: 5px;
      color: #67a3f4;
    }

    .icon-circle {
      border-radius: 50%;
      display: inline-block;
      width: 12px;
      height: 12px;
      &.red {
        background: #f00;
      }
      &.yellow {
        background: #ff0;
      }
      &.blue {
        background: rgba(0, 0, 255, 0.61);
      }
      &.green {
        background: #00bf00;
      }
    }
  }
  .tips {
    line-height: 22px;
    margin-bottom: 10px;

    i {
      font-size: 24px;
      margin: 0 3px;
    }
    .red {
      color: #f00;
    }
    .yellow {
      color: #ff0;
    }
    .blue {
      color: rgba(0, 0, 255, 0.61);
    }
    .green {
      color: #00bf00;
    }
  }
}
</style>
