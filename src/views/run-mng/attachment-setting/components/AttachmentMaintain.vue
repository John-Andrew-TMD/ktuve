<template>
  <div class="attachment-maintain-comp">
    <el-tabs v-model="activeName" class="tabs-inner" @tab-click="handleTabClick">
      <el-tab-pane
        v-for="(item,index) in tabsList"
        :key="index"
        :label="item.label"
        :name="item.name"
        :lazy="true"
      />
    </el-tabs>
    <div class="btn-group">
      <!-- <el-button size="mini" type="primary" @click="handleAddClick">新增</el-button> -->
      <el-button size="mini" type="primary" @click="handleEditClick">编辑</el-button>
      <el-button size="mini" :disabled="!selectedRow" type="danger" @click="handleDeleteClick">删除</el-button>
    </div>
    <table-create
      :key="tableIndex"
      ref="tableDom"
      :options="tableOptions"
      @current-change="handleCurrentChange"
    >
      <template v-slot:isNecessary="{scope}">
        <el-switch
          v-model="scope.row.isNecessary"
          size="mini"
          @change="val => handleNecessaryChange(val, scope.row)"
        />
      </template>
      <!-- <template v-slot:displayOrder="{scope}">
        <el-input
          v-model="scope.row.displayOrder"
          size="mini"
          width="100"
          :controls="false"
        />
      </template> -->
    </table-create>
    <component
      :is="dialogComponentName"
      v-if="dialogStatus"
      :selected-row="selectedRow"
      :table-data="tableData"
      :dialog-status.sync="dialogStatus"
      @dialog-confirm="handleDialogConfirm"
    />
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import {
  attachmentMaintainList,
  attachmentCustAttachUpdate,
  attachmentCustAttachDelete,
  attachmentProjectAttachUpdate,
  attachmentProjectAttachDelete,
  attachmentContractAttachUpdate,
  attachmentContractAttachDelete,
  attachmentLoanAttachUpdate,
  attachmentLoanAttachDelete
} from 'api/run-module/attachment-setting.js'
import { customerTableOptions, projectTableOptions, contractTableOptions, loanTableOptions } from '../config/tableOptions.js'
const TAB_LIST = [
  { label: '客户', name: 'Customer' },
  { label: '项目', name: 'Project' },
  { label: '合同', name: 'Contract' },
  { label: '投放', name: 'Loan' },
  { label: '租后', name: 'AfterRent' },
  { label: '归档', name: 'Pigeonhole' }
]
const TAB_DETAIL = {
  Customer: {
    dialogCompName: 'DialogCustomerUpdate',
    tableOptions: customerTableOptions,
    tableDataKey: 'custList',
    updateAction: attachmentCustAttachUpdate,
    deleteAction: attachmentCustAttachDelete
  },
  Project: {
    dialogCompName: 'DialogProjectUpdate',
    tableOptions: projectTableOptions,
    tableDataKey: 'pmmList',
    updateAction: attachmentProjectAttachUpdate,
    deleteAction: attachmentProjectAttachDelete
  },
  Contract: {
    dialogCompName: 'DialogContractUpdate',
    tableOptions: contractTableOptions,
    tableDataKey: 'conList',
    updateAction: attachmentContractAttachUpdate,
    deleteAction: attachmentContractAttachDelete
  },
  Loan: {
    dialogCompName: 'DialogLoanUpdate',
    tableOptions: loanTableOptions,
    tableDataKey: 'pdmList',
    updateAction: attachmentLoanAttachUpdate,
    deleteAction: attachmentLoanAttachDelete
  },
  AfterRent: {
    dialogCompName: 'DialogLoanUpdate',
    tableOptions: loanTableOptions,
    tableDataKey: 'pdmList',
    updateAction: attachmentLoanAttachUpdate,
    deleteAction: attachmentLoanAttachDelete
  },
  Pigeonhole: {
    dialogCompName: 'DialogPigeonholeAddOrUpdate',
    tableOptions: contractTableOptions
  }
}
import { deepAssign } from 'utils'
export default {
  components: {
    TableCreate,
    DialogCustomerUpdate: () => import('./DialogCustomerUpdate.vue'),
    DialogProjectUpdate: () => import('./DialogProjectUpdate.vue'),
    DialogContractUpdate: () => import('./DialogContractUpdate.vue'),
    DialogLoanUpdate: () => import('./DialogLoanUpdate.vue')
  },
  props: {},
  data() {
    return {
      selectedRow: null,
      tableData: [],
      activeName: 'Customer',
      tabsList: Object.freeze(TAB_LIST),
      tableOptions: {},
      dialogComponentName: '',
      dialogStatus: false,
      tableIndex: 0
    }
  },
  created() {
    this.initUI()
    this.getTableData()
  },
  methods: {
    initUI() {
      this.tableOptions = TAB_DETAIL[this.activeName].tableOptions
    },
    getTableData() {
      attachmentMaintainList({
        dto: {},
        pageSize: 1000,
        pageNum: 1
        // descs: ['displayOrder']
      }).then(res => {
        if (res.data) {
          const { custList, pmmList, conList, pdmList } = res.data
          this.formatCustListData(custList)
          this.formatProjectListData(pmmList)
          this.formatContractListData(conList)
          this.formatLoanListData(pdmList)
        }
        this.setTableData()
      }).catch(err => {
        console.log(err)
      })
    },
    formatCustListData(data = []) {
      if (!data.length) {
        this.custList = []
        return
      }
      const tempObj = {}
      data.forEach(item => {
        tempObj[item.custCategory] = tempObj[item.custCategory] || []
        tempObj[item.custCategory].push(item)
      })
      this.custList = Object.keys(tempObj).map(key => {
        return {
          custCategory: key,
          dataContent: tempObj[key].map(item => item.dataContent).join(' | '),
          sourceData: tempObj[key]
        }
      })
    },
    formatProjectListData(data = []) {
      if (!data.length) {
        this.pmmList = []
        return
      }
      const tempObj = {}
      data.forEach(item => {
        const key = item.businessType + item.dataType
        tempObj[key] = tempObj[key] || []
        tempObj[key].push(item)
      })
      this.pmmList = Object.keys(tempObj).map(key => {
        return {
          businessType: tempObj[key][0].businessType,
          dataType: tempObj[key][0].dataType,
          dataContent: tempObj[key].map(item => item.dataContent).join(' | '),
          sourceData: tempObj[key]
        }
      })
    },
    formatContractListData(data = []) {
      if (!data.length) {
        this.conList = []
        return
      }
      this.conList = [{
        dataContent: data.map(item => item.dataContent).join(' | '),
        sourceData: data
      }]
    },
    formatLoanListData(data = []) {
      if (!data.length) {
        this.pdmList = []
        return
      }
      const tempObj = {}
      data.forEach(item => {
        const key = item.menuType + item.dataType
        tempObj[key] = tempObj[key] || []
        tempObj[key].push(item)
      })
      this.pdmList = Object.keys(tempObj).map(key => {
        return {
          menuType: tempObj[key][0].menuType,
          dataType: tempObj[key][0].dataType,
          dataContent: tempObj[key].map(item => item.dataContent).join(' | '),
          sourceData: tempObj[key]
        }
      })
    },
    // handleAddClick() {
    //   this.action = 'A'
    //   this.dialogStatus = true
    //   this.dialogComponentName = TAB_DETAIL[this.activeName].dialogCompName
    // },
    handleEditClick() {
      // this.action = 'U'
      this.dialogStatus = true
      this.dialogComponentName = TAB_DETAIL[this.activeName].dialogCompName
    },
    handleNecessaryChange(val, row) {
      TAB_DETAIL[this.activeName].updateAction({
        id: row.id,
        isNecessary: +val
      }).then(res => {
        this.$showToast('修改成功', 'success')
        this.getTableData()
      })
    },
    handleDeleteClick() {
      this.$confirm(`确定删除${this.selectedRow.dataContent}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(TAB_DETAIL[this.activeName])
          TAB_DETAIL[this.activeName].deleteAction({
            ids: this.selectedRow.sourceData.map(item => item.id)
          }, { showLoading: true }).then(res => {
            this.$showToast('删除成功', 'success')
            this.getTableData()
          }).catch(err => {
            console.log(err)
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    updateTableItemOrder(order, row) {
      TAB_DETAIL[this.activeName].updateAction({
        id: row.id,
        displayOrder: order
      }).then(res => {
        // this.$showToast('修改成功', 'success')
        // this.getTableData()
      }).catch(err => {
        console.log(err)
      })
    },
    handleTabClick() {
      this.tableOptions = TAB_DETAIL[this.activeName].tableOptions
      this.tableIndex = this.tableIndex + 1
      this.selectedRow = null
      this.$nextTick(() => {
        this.setTableData()
      })
    },
    handleCurrentChange(row) {
      this.selectedRow = row
    },
    handleDialogConfirm() {
      this.$refs.tableDom.showLoading = true
      this.getTableData()
    },
    setTableData() {
      const tableData = this[TAB_DETAIL[this.activeName].tableDataKey]
      this.tableData = tableData
      this.$refs.tableDom.setData(deepAssign([], tableData))
    }
  }
}
</script>

<style lang='scss'>
.attachment-maintain-comp {
  .tabs-inner {
    height: 40px;
    .el-tabs__header {
      margin-bottom: 0px;
    }
    .el-tabs__content, .el-tabs__active-bar, .el-tabs__nav-wrap::after {
      display: none;
    }
    .el-tabs__item {
      padding: 0 5px;

      &:after {
        margin-left: 10px;
        content: '';
        border-left: 1px solid #CCCCCC;
      }

      &:last-child {
        &:after {
          display: none;
        }
      }
    }
  }
}

</style>
