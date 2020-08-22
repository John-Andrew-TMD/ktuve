<template>
  <div class="app-content tenant-mng-page">
    <div class="app-content-wrapper">
      <div class="btn-group sticky">
        <el-button
          type="primary"
          size="mini"
          @click="handleAddClick"
        >新增</el-button>
      </div>
      <div class="tree-lists">
        <el-tree
          :props="props"
          :data="tenantList"
          :empty-text="emptyText"
          node-key="id"
          default-expand-all
          highlight-current
          style="{margin-top: 15px;}"
          @node-click="handleNodeClick"
        >
          <div slot-scope="{ node, data }" class="custom-tree-node">
            <p>
              <i :class="node | treeIconFormat" />
              {{ node.label }}
            </p>
            <p v-if="node.isLeaf">
              <el-button type="text" size="mini" @click="handleTreeBtnClick('update', data)">编辑</el-button>
              <el-button type="text" size="mini" @click="handleTreeBtnClick('data', data)">数据源</el-button>
              <el-button type="text" size="mini" @click="handleTreeBtnClick('config', data)">配置</el-button>
              <el-button
                class="danger"
                type="text"
                size="mini"
                @click="handleTreeBtnClick('del', data)"
              >删除</el-button>
            </p>
          </div>
        </el-tree>
      </div>
      <dialog-tenant-add-or-update
        v-if="dialogStatus"
        :dialog-status.sync="dialogStatus"
        :tenant-id="tenantId"
        @confirm="handleDialogConfirm"
      />
      <dialog-tenant-data-source
        v-if="dialogDataSourceStatus"
        :dialog-status.sync="dialogDataSourceStatus"
        :tenant-id="tenantId"
      />
      <dialog-tenant-config
        v-if="dialogConfigStatus"
        :dialog-status.sync="dialogConfigStatus"
        :tenant-id="tenantId"
      />
    </div>
  </div>
</template>

<script>
import { tenantList, tenantDelete } from "api/user-mng.js";
import { generateTree } from "utils";
export default {
  name: "TenantMng",
  components: {
    DialogTenantAddOrUpdate: () =>
      import("./components/DialogTenantAddOrUpdate.vue"),
    DialogTenantDataSource: () =>
      import("./components/DialogTenantDataSource.vue"),
    DialogTenantConfig: () => import("./components/DialogTenantConfig.vue")
  },
  filters: {
    treeIconFormat(node) {
      if (!node) return "";
      if (!node.isLeaf) {
        if (node.expanded) return "iconfont icon-folder-open";
        return "iconfont icon-folder-close";
      } else {
        return "iconfont icon-user";
      }
    }
  },
  data() {
    return {
      tenantList: [],
      props: {
        label: "title",
        children: "children"
      },
      dialogStatus: false,
      dialogDataSourceStatus: false,
      dialogConfigStatus: false,
      tenantId: -1,
      emptyText: "loading..."
    };
  },
  created() {
    this.getDataLists();
  },
  methods: {
    getDataLists() {
      tenantList({})
        .then(res => {
          const data = res.data.records;
          if (Array.isArray(data) && data.length) {
            this.tenantList = generateTree(data, "0", "id", "pid");
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.emptyText = "暂无数据";
        });
    },
    handleAddClick() {
      this.tenantId = -1;
      this.dialogStatus = true;
    },
    handleDialogConfirm() {
      this.getDataLists();
    },
    handleTreeBtnClick(action, data) {
      switch (action) {
        case "update":
          this.tenantId = data.id;
          this.dialogStatus = true;
          break;
        case "data":
          this.tenantId = data.id;
          this.dialogDataSourceStatus = true;
          break;
        case "config":
          this.tenantId = data.id;
          this.dialogConfigStatus = true;
          break;
        case "del":
          this.$confirm(`确定删除吗？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              tenantDelete(
                {
                  ids: [data.id]
                },
                { showLoading: true }
              )
                .then(res => {
                  this.getDataLists();
                })
                .catch(() => {});
            })
            .catch(err => {
              console.log(err);
            });
          break;
      }
    }
  }
};
</script>
<style lang="scss">
.tenant-mng-page {
  .tree-lists {
    max-width: 600px;
    margin-top: 15px;

    .custom-tree-node {
      display: flex;
      align-items: center;
      flex: 1;
      justify-content: space-between;
      padding-right: 8px;
    }

    .iconfont {
      margin-right: 5px;
      color: #67A3F4;
    }

    .danger {
      color: #FF0000;
    }
  }
}

</style>>
