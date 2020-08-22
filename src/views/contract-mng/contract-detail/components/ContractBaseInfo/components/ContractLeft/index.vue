<template>
  <div class="comp-contract-list">
    <div v-if="!routeParams.approvalId" class="btn-area">
      <el-menu :default-active="activeIndex" mode="horizontal" style="margin-right: 10px;">
        <el-submenu index="1">
          <template slot="title">
            <el-button type="primary" size="mini">
              新增
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
          </template>
          <template v-for="(item,index,key) in dropMenu">
            <template v-if="item.children">
              <el-submenu :key="key" :index="`1-${index+1}`">
                <template slot="title">{{item.name}}</template>
                <el-menu-item
                  v-for="(itemChildren,indexChildren,keyChildren) in item.children"
                  :key="keyChildren"
                  :index="`1-${index+1}-${indexChildren+1}`"
                  @click.native="handleDropMenuClick(itemChildren)"
                >{{itemChildren.name}}</el-menu-item>
              </el-submenu>
            </template>
            <template v-else>
              <el-menu-item
                :key="key"
                :index="`1-${index+1}`"
                @click.native="handleDropMenuClick(item)"
              >{{item.name}}</el-menu-item>
            </template>
          </template>
        </el-submenu>
      </el-menu>
      <el-button
        v-if="showChangeBtn"
        type="primary"
        size="mini"
        :disabled="getChangeDisabled"
        @click="handleContractChange"
      >合同变更</el-button>
      <el-button
        v-else
        type="danger"
        size="mini"
        :disabled="cancelChangeStatus"
        @click="handleCancelChange"
      >撤销变更</el-button>
      <el-button
        type="danger"
        size="mini"
        :disabled="getDeleteDisabled"
        @click="handleDeleteClick"
      >删除</el-button>
      <div class="btn-group-flow">
        <el-button
          type="primary"
          size="mini"
          :disabled="isApproveDisabled"
          @click="handleApprovalClick"
        >发起审批</el-button>
      </div>
    </div>
    <table-create
      ref="tableDom"
      :row-class-name="tableRowClassName"
      :options="tableOptions"
      @current-change="handleCurrentChange"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    />
    <dialog-contract-approval
      v-if="dialogApprovalStatus"
      :dialog-status.sync="dialogApprovalStatus"
      :selected-rows="selectedRows"
      :route-params="routeParams"
    />
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate'
import {
  queryContractList,
  IConContractTableRemoveByIds,
  cancelContractChange,
  clickContractChange,
  judgeIrr
} from 'api/contract-module/api-contract-mng.js'
import DROP_MENUS from '../js/drop-menus.js'
import DialogContractApproval from './components/DialogContractApproval.vue'
export default {
  components: {
    TableCreate,
    DialogContractApproval
  },
  props: {
    routeParams: {
      type: Object,
      default: () => ({})
    }
  },
  inject: ['getContractInfoField', 'getEditStatus'],
  data() {
    return {
      tableOptions: {
        columns: [
          {
            attrs: {
              prop: 'contractNo',
              label: '合同编号',
              align: 'left',
              minWidth: '100',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              prop: 'contractType',
              label: '合同名称',
              minWidth: '100',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.contractType, '10053')
              }
            }
          },
          {
            attrs: {
              prop: 'contractState',
              label: '合同状态',
              minWidth: 86,
              formatter: row => {
                return Vue.filter('filterDictValue')(row.contractState, '10056')
              }
            }
          },
          {
            attrs: {
              prop: 'sysEtime',
              label: '更新时间',
              minWidth: 88,
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.sysEtime)
              }
            }
          }
        ],
        // approvalId 从流程传值
        requestParams: {
          url: queryContractList,
          data: {
            ...((this.routeParams.approvalId && {
              approvalId: this.routeParams.approvalId
            }) || {
              projectManagerId: this.getContractInfoField('projectManagerId')
            })
          }
        },
        tableBottomOffset: 22,
        showCheckbox: true,
        showLoading: true,
        showPagination: false,
        selectedRow: 0
      },
      selectedRows: [],
      cancelChangeStatus: false, // 撤销变更按钮状态
      dialogApprovalStatus: false
    }
  },
  computed: {
    canEdit() {
      return this.getEditStatus()
    },
    isApproveDisabled() {
      if (this.selectedRows.length) {
        const t1 = this.selectedRows.every(item => item.contractState == 0 || item.contractState == 4)
        const t2 = this.selectedRows.every(item => item.contractState == 0 || item.contractState == 4) //未提交,变更未提交
        if (t1 || t2) {
          return false
        }
      }
      return true
    },
    isApprove() {
      if (this.selectedRows.length) {
        const t1 = this.selectedRows.every(item => item.contractState == 0)
        const t2 = this.selectedRows.every(item => item.contractState == 4) //未提交,变更未提交
        if (t1 || t2) {
          return false
        }
      }
      return true
    },
    getChangeDisabled() {
      if (this.selectedRows.length) {
        return Boolean(this.selectedRows.filter(el => +el.contractState != 2).length)
      } else {
        return true
      }
    },
    getDeleteDisabled() {
      if (this.selectedRows.length) {
        return Boolean(this.selectedRows.filter(el => +el.contractState != 0).length)
      } else {
        return true
      }
    },
    dropMenu() {
      const businessType = this.getContractInfoField('businessType')
      const businessCategory = this.getContractInfoField('businessCategory')
      const dropMenu = DROP_MENUS.filter(item => {
        const isBusinessType = (item.businessType + '').split(',').includes(businessType)
        const isBusinessCategory = (item.businessCategory + '').split(',').includes(businessCategory)
        return isBusinessCategory && isBusinessType
      })
      return dropMenu
    },
    showChangeBtn() {
      if (this.selectedRows.length) {
        const flag = this.selectedRows.every(item => [4, 6].includes(+item.contractState))
        return !flag
      } else {
        return true
      }
    }
  },
  provide() {
    return {
      refreshTable: this.refreshTable
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },
    handleRowClick(row) {
      this.$emit('handleLeftClick', row)
    },
    // 合同变更
    async handleContractChange(text) {
      this.showConfirm('发起合同变更', () => {
        const recordIds = this.selectedRows.map(item => item.id)
        clickContractChange(
          {
            conManagerId: this.routeParams.id,
            recordIds
          },
          { showLoading: true }
        ).then(res => {
          this.refreshTable()
        })
      })
    },
    // 撤销变更
    handleCancelChange() {
      this.showConfirm('撤销变更', () => {
        const recordIds = this.selectedRows.map(item => item.id)
        cancelContractChange(
          {
            conManagerId: this.routeParams.id,
            recordIds
          },
          { showLoading: true }
        ).then(res => {
          this.refreshTable()
        })
      })
    },
    showConfirm(title, confirmCb) {
      this.$confirm(`确定${title}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(({ value }) => {
          confirmCb && confirmCb(value)
        })
        .catch(() => {})
    },
    handleApprovalClick() {
      if (this.isApprove && !this.isApproveDisabled) {
        return this.$showToast('不可以对“变更未提交”和“未提交”的合同同时发起审批', 'warning')
      }
      const recordIds = this.selectedRows.map(item => item.id)
      judgeIrr(
        {
          conManagerId: this.routeParams.id,
          recordIds
        },
        {
          showLoading: true
        }
      ).then(res => {
        const data = res.data || {}
        if (!data.id) {
          this.dialogApprovalStatus = true
          return
        }
        this.$showToast(data.id, 'warning')
      })
    },
    closeCurrentTag() {
      this.$store.commit('refresh/refreshContractList')
      setTimeout(() => {
        this.$store.dispatch('tagsView/closeCurrentTag', this.$route).then(() => {
          this.$router.push(this.$route.meta.from)
        })
      }, 2000)
    },
    handleCurrentChange(row) {
      this.$emit('handleLeftClick', row)
    },
    handleDropMenuClick(rowData) {
      this.$emit('menu-click', {
        ...rowData,
        action: 'A',
        contractEnName: rowData.contracTypeForm
      })
    },
    handleSelectionChange(row) {
      this.selectedRows = row
    },
    // 合同删除
    handleDeleteClick() {
      if (!this.selectedRows.length) return this.$showToast('未勾选任何行！', 'warning')
      const ids = this.selectedRows.map(item => item.id)
      let tipsText = '确定删除吗？'
      if (this.selectedRows.some(item => item.mainContract)) {
        tipsText = '删除主合同后，其关联的子合同也将一并删除，确认删除？'
      }
      this.$confirm(tipsText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          IConContractTableRemoveByIds(
            {
              ids
            },
            { showLoading: true }
          )
            .then(res => {
              this.$showToast('删除成功！', 'success')
              if (this.$refs.tableDom.tableData.length == ids.length) {
                this.$refs.tableDom.resetTableData()
              } else {
                this.$refs.tableDom.refreshTable(true)
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    refreshTable(selectedRow = 0) {
      this.$refs.tableDom.refreshTable(true, { selectedRow })
    }
  }
}
</script>

<style lang='scss' scoped>
.comp-contract-list /deep/ {
  padding: 10px 10px 0 10px;
  .tabel-create {
    margin-top: 0;
  }
  .el-dropdown {
    margin-right: 10px;
    .el-icon-arrow-down {
      vertical-align: top;
    }
  }
  .btn-area {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    align-items: center;
    .btn-group-flow {
      margin-left: auto;
    }
  }
  .el-submenu__title {
    padding: 0 !important;
    height: auto;
    line-height: normal;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: 0px;
  }
  .el-submenu__title i {
    color: #fff;
    font-size: 12px;
  }
  .el-submenu__title > .el-icon-arrow-down,
  .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
    border-bottom: none;
  }
  .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
    border-bottom: none;
  }
  .el-menu--horizontal > .el-submenu .el-submenu__title {
    height: auto;
    line-height: normal;
    border-bottom: none;
  }
  .el-menu--horizontal > .el-submenu .el-submenu__title > .el-button {
    padding: 4.75px 15px !important;
  }
  .el-submenu [class^='el-icon-'] {
    vertical-align: middle;
    margin-right: 0px;
    width: auto;
  }
  .el-submenu > .el-submenu__title > .el-icon-arrow-down {
    display: none;
  }
}
</style>
