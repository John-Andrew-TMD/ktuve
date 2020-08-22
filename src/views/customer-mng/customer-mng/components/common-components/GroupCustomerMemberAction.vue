<template>
  <div class="group-customer-member-action">
    <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    <table-create ref="tableDom" :options="tableOptions">
      <template #custName="{ scope }">
        <el-custom-select v-if="!scope.row.blocId" v-model="scope.row.custName" :params="custNameParams" size="mini" filterable @change="obj => handleBlocNameChange(obj, scope)" />
        <span v-else>{{ scope.row.custName }}</span>
      </template>
      <template v-if="action === 'A'" #operation="{ scope }">
        <el-button v-if="scope.row.blocId && scope.row.editType != 2" type="text" size="mini" @click="handleDeleteClick(scope.row, scope.$index)">删除</el-button>
        <el-button v-if="!scope.row.blocId" :disabled="!scope.row.id" type="text" size="mini" @click="handleSaveClick(scope.row, scope.$index)">保存</el-button>
        <el-button v-if="scope.row.editType == 2" type="text" size="mini" @click="handleRevocationClick(scope.row, scope.$index)">撤回</el-button>
      </template>
    </table-create>
    <div v-if="action === 'A'" style="text-align: center;margin-top: 7px">
      <el-button size="mini" type="text" @click="handleAddClick">添加集团成员</el-button>
    </div>
    <template v-if="from !== 'add'">
      <h4 style="margin-top: 12px;">变更详情</h4>
      <table-create :options="tableChangesOptions" @row-click="handleChangeTableRowClick" />
    </template>
  </div>
</template>
<script>
import { getGroupCustList, groupMemberAdd, groupMemberDelete, groupMemberRevoke, getgGroupCustomerById } from 'api/customer-module/api-customer-mng.js'
import { getModuleFlowHistoryList } from 'api/workflow-module/index.js'
import TableCreate from 'components/TableCreate/index'
import { queryDictItems, queryIndustryByIds, deepAssign, isEmptyObj } from 'utils'
// 说明与附件这两个字段显示状态: 1.集团维护显示并且可操作; 2. 在集团详情中不显示; 3.集团维护审批流程中显示, 第一个节点可操作。
export default {
  components: {
    TableCreate
  },
  props: {
    selectedRow: {
      type: Object,
      default: null
    },
    action: {
      type: String,
      default: 'A' // 操作类型: A 可操作, V 只可查看
    },
    from: {
      type: String,
      default: 'add' // 页面来源: 集团维护(add), 集团详情(detail), 审批流程表单(flow)
    },
    flowInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formApi: null,
      formRules: [{
        type: 'input',
        title: '集团名称',
        field: 'blocName',
        col: { span: 12 }
      },
      {
        type: 'input',
        title: '集团编号',
        field: 'blocNo',
        col: { span: 12 }
      },
      {
        type: 'input',
        title: '客户编号',
        field: 'custNo',
        col: { span: 12 }
      },
      {
        type: 'input',
        title: '统一社会信用代码',
        field: 'idCode',
        col: { span: 12 }
      },
      {
        type: 'select',
        title: '客户状态',
        field: 'blacklistState',
        options: queryDictItems('10005'),
        col: { span: 12 }
      },
      {
        type: 'industry-cascade',
        field: 'industry',
        title: '行业类别',
        col: { span: 24 },
        props: {
          disabled: true
        }
      },
      {
        type: 'input',
        field: 'majorBusiness',
        title: '主营业务',
        props: {
          type: 'textarea'
        }
      },
      {
        type: 'number-input',
        title: '授信总额',
        field: 'creditPosition',
        col: { span: 12 }
      },
      {
        type: 'number-input',
        title: '授信余额',
        field: 'creditBalance',
        col: { span: 12 }
      },
      {
        type: 'input',
        title: '集团成员总数',
        field: 'memberSize',
        col: { span: 12 }
      },
      {
        type: 'input',
        title: '业务经理',
        field: 'businessManage',
        col: { span: 12 }
      },
      {
        type: 'select',
        title: '审批状态',
        field: 'checkStatus',
        options: queryDictItems('10016'),
        col: { span: 12 }
      },
      {
        type: 'input',
        field: 'commentMessage',
        title: '说明',
        props: {
          type: 'textarea'
        }
      },
      {
        type: 'el-custom-upload',
        title: '附件',
        field: 'file',
        // validate: this.formValidate({ required: true }),
        on: {
          'upload-complete': this.handleAttachUploadComplete
        }
      }
      ],
      formOptions: {
        form: { labelWidth: '140px', disabled: false },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: '',
          data: {}
        },
        showPagination: false,
        requestImmediate: false,
        columns: [{
          attrs: {
            label: '客户名称',
            prop: 'custName',
            align: 'left',
            width: '200px'
          },
          slot: 'custName'
        },
        {
          attrs: {
            label: '客户编号',
            prop: 'custNo'
          }
        },
        {
          attrs: {
            label: '统一社会信用代码',
            width: '130px',
            prop: 'idCode'
          }
        },
        {
          attrs: {
            label: '业务经理',
            prop: 'businessManage'
          }
        },
        {
          attrs: {
            label: '行业类别',
            prop: 'industry',
            align: 'left',
            'show-overflow-tooltip': true,
            formatter: row => {
              return queryIndustryByIds(row.industry, '-')
            }
          }
        },
        {
          attrs: {
            label: '主营业务',
            prop: 'majorBusiness',
            'show-overflow-tooltip': true
          }
        },
        {
          attrs: {
            label: '授信金额',
            prop: 'creditPosition',
            formatter: row => {
              return Vue.filter('filterToThousand')(row.creditPosition)
            }
          }
        },
        {
          attrs: {
            label: '授信余额',
            prop: 'creditBalance',
            formatter: row => {
              return Vue.filter('filterToThousand')(row.creditPosition)
            }
          }
        },
        {
          attrs: {
            label: '审批状态',
            prop: 'checkStatus',
            formatter: row => {
              return Vue.filter('filterDictValue')(row.checkStatus, '10016')
            }
          }
        },
        {
          attrs: {
            label: '操作',
            prop: 'operation',
            width: '70px'
          },
          slot: 'operation'
        }
        ]
      },
      tableChangesOptions: {
        requestParams: {
          url: getModuleFlowHistoryList,
          data: {
            businessId: this.selectedRow.id
          }
        },
        showPagination: false,
        requestImmediate: true,
        dataCallbackFn(data) {
          try {
            data = data.records
            if (Array.isArray(data) && data.length) {
              data.forEach(item => {
                item.blockMemberNumber = JSON.parse(item.flowParam).blockMemberNumber || 0
              })
              data = data.filter(item => ['2', '3'].includes(item.checkStatus))
              return data
            } else {
              return []
            }
          } catch (err) {
            console.log(data)
            return data
          }
        },
        columns: [{
          attrs: {
            label: '流程标题',
            prop: 'flowTitle',
            'class-name': 'link-type',
            align: 'left',
            'min-width': '150px',
            'show-overflow-tooltip': true
          }
        },
        {
          attrs: {
            label: '集团成员数',
            prop: 'blockMemberNumber'
          }
        },
        {
          attrs: {
            label: '审批状态',
            prop: 'checkStatus',
            width: '130px',
            formatter: row => {
              return ['', '审批中', '审批通过', '审批不通过'][row.checkStatus]
            }
          }
        },
        {
          attrs: {
            label: '发起人',
            prop: 'startUser'
          }
        },
        {
          attrs: {
            label: '审批结束时间',
            prop: 'endTime',
            width: '150px',
            formatter: row => {
              return Vue.filter('filterTimestamp')(row.endTime)
            }
          }
        },
        {
          attrs: {
            label: '创建时间',
            prop: 'sysCtime',
            width: '150px'
          },
          filter: {
            name: 'timestamp'
          }
        }
        ]
      },
      custNameParams: {
        url: getGroupCustList,
        data: {},
        seachKey: 'custName',
        labelKey: 'custName',
        valueKey: 'custName',
        dataCallback(data) {
          data.forEach(item => {
            item.blacklistState === '0' && (item.custName = `${item.custName}(黑名单)`)
          })
          return data
        }
      },
      tableData: []
    }
  },
  created() {
    if (this.from === 'detail') {
      this.formRules.pop()
      this.formRules.pop()
    }
    if (this.action === 'V') {
      this.tableOptions.columns.pop()
    }
  },
  mounted() {
    console.log(this.selectedRow)
    this.initUI()
  },
  methods: {
    initUI() {
      if (this.selectedRow) {
        const rowData = { ...this.selectedRow }
        if (rowData.industry) {
          rowData.industry = rowData.industry.split(',')
        }
        this.$nextTick(() => {
          this.formApi.setValue(rowData)
          this.formApi.disabled(true)
          if (this.action === 'A') {
            this.formApi.disabled(false, ['commentMessage', 'file'])
          }
          if (!isEmptyObj(this.flowInfo)) {
            this.formApi.updateRule('file', {
              props: {
                params: {
                  businessId: this.flowInfo.processInstanceId
                }
              }
            })
          }
        })
        if (Array.isArray(rowData.members)) {
          this.tableData = rowData.members
          const tempArr = deepAssign([], this.tableData)
          this.$refs.tableDom.setData(tempArr)
        } else {
          this.getgGroupMembers()
        }
      }
    },
    getgGroupMembers() {
      getgGroupCustomerById({
        id: this.selectedRow.id
      }).then(res => {
        if (res.data && Array.isArray(res.data.members)) {
          this.tableData = res.data.members
          const tempArr = deepAssign([], this.tableData)
          this.$refs.tableDom.setData(tempArr)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 保存
    handleSaveClick(row, index) {
      groupMemberAdd({
        custId: row.id,
        blocId: this.selectedRow.id
      }, { showLoading: true }).then(res => {
        this.$showToast('保存成功！', 'success')
        this.getgGroupMembers()
      }).catch(err => {
        console.log(err)
      })
    },
    // 删除
    handleDeleteClick(row, index) {
      groupMemberDelete({
        ids: [row.id]
      }, { showLoading: true }).then(res => {
        this.$showToast('删除成功！', 'success')
        this.getgGroupMembers()
      }).catch(err => {
        console.log(err)
      })
    },
    // 撤回
    handleRevocationClick(row, index) {
      groupMemberRevoke({
        id: row.id
      }, { showLoading: true }).then(res => {
        this.$showToast('撤销成功！', 'success')
        this.getgGroupMembers()
      }).catch(err => {
        console.log(err)
      })
    },
    handleBlocNameChange(obj, scope) {
    	if (obj.data.blacklistState === '0') {
    		this.$showToast('该客户为黑名单客户，不可新增！', 'warning')
    		this.tableData.splice(scope.$index, 1, {})
    	} else {
    		this.tableData.splice(scope.$index, 1, obj.data)
    	}
      this.setTableData()
    },
    handleAddClick() {
      if (this.chackHasUnSaveData()) return
      this.tableData.push({
        custName: ''
      })
      this.setTableData()
    },
    handleChangeTableRowClick(row, column) {
      if (column.property === 'flowTitle') {
        this.$router.push({
          path: '/process/process-approval',
          query: {
            taskId: row.processInstanceId
          }
        })
      }
    },
    setTableData() {
      const tempArr = deepAssign([], this.tableData)
      this.$refs.tableDom.setData(tempArr)
    },
    chackHasUnSaveData() {
      if (this.tableData.some(item => item.blocId == null)) {
        this.$showToast('存在未保存的数据, 请先保存！', 'warning')
        return true
      }
      return false
    },
    validateForm() {
      return new Promise((resolve, reject) => {
        if (this.chackHasUnSaveData()) return resolve(false)
        this.completeResolve = resolve
        this.formApi.el('file').submitUpload()
      })
    },
    handleAttachUploadComplete() {
      const { commentMessage } = this.formApi.formData()
      const { fileAddedIdList, fileDeletedList } = this.formApi.el('file')
      this.completeResolve && this.completeResolve({
        commentMessage,
        fileAddedIdList,
        fileDeletedList
      })
      this.completeResolve = null
    }
  }
}

</script>
<style lang="scss" scoped>
.group-customer-member-action /deep/  {
  .el-cascader, .el-autocomplete, .el-select {
    width: 100%;
  }

  .el-form-item {
    margin-bottom: 7px;
  }

  // .el-select .is-disabled .el-input__suffix {
  //   display: none;
  // }
  // .el-select .is-disabled .el-input__inner {
  //   padding-right: 10px;
  // }
}

</style>
