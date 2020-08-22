<template>
  <div class='app-content project-assess-page'>
    <div class='app-content-wrapper'>
      <form-search @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <el-button type="primary" @click="handleBtnClick('新增','A')">新增</el-button>
        <el-button
          :disabled= !rowData
          type="primary"
          @click="handleBtnClick('修改','U',rowData)"
        >修改</el-button>
        <el-button
          :disabled= !rowData
          type="primary"
          @click="handleBtnClick('详情','Q',rowData)"
        >详情</el-button>
        <el-button  :disabled= !rowData type="danger" @click="handleDeleteClick">删除</el-button>
      </div>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @current-change="handleCurrentChange"
      >
      </table-create>
    </div>
    <dialog-project-assess
      :action="action"
      :dialogTitle="dialogTitle"
      v-if="dialogStatus"
      :dialog-status.sync="dialogStatus"
      :rowData="rowData"
    />
  </div>
</template>

<script>
import TableCreate from "components/TableCreate/index";
import FormSearch from "components/FormSearch";
import { queryAssess, assessdelete } from 'api/project-module/api-project-assess.js'

export default {
  components: {
    TableCreate,
    FormSearch,
    DialogProjectAssess: () => import("./components/DialogProjectAssess.vue")
  },
  data () {
    return {
      // 搜索框选项
      searchForm: {},
      searchRules: [
        { 
          type: "el-custom-autocomplete",
          title: "会议编号",
          style: { width: "220px" }, 
          field: "meetingId",
          props: {
            params: {
              url: queryAssess,
              data: {},
              searchKey: 'meetingId',
              labelKey: 'meetingId',
              valueKey: 'meetingId',
              repeat: false
            },
            clearable: true
          },
        },
        {
          type: "el-date-picker",
          field: "meetingDate",
          title: "会议日期",
          style: { width: "220px" },
          props: {
            type: "daterange",
            format: "yyyy-MM-dd",
            valueFormat: "timestamp",
            rangeSeparator: '-',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        },
        {
          type: "el-date-picker",
          field: "createTime",
          title: "创建时间",
          style: { width: "220px" },
          props: {
            type: "daterange",
            format: "yyyy-MM-dd",
            valueFormat: "timestamp",
            rangeSeparator: '-',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        }
      ],
      searchOptions: {
        form: { labelWidth: "100px", inline: true },
        submitBtn: { show: false }
      },
      // 表格选项
      tableOptions: {
        requestParams: {
          url: queryAssess,
          data: {}
        },
        selectedRow: 0,
        showTools: true,
        showSerialNumber: true,
        columns: [
          {
            attrs: {
              label: "会议编号",
              prop: "meetingId"
            }
          },
          {
            attrs: {
              label: "参会人员",
              prop: "meetingPeople",
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              label: "评审会秘书",
              prop: "reviewSecretary"
            }
          },
          {
            attrs: {
              label: "参会项目数",
              prop: "projectNumber"
            }
          },
          {
            attrs: {
              label: "参会项目",
              prop: "meetingProjectName",
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              label: "会议日期",
              prop: "meetingDate",
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.meetingDate,'YYYY-MM-DD')
              }
            }
          },
          {
            attrs: {
              label: "状态",
              prop: "meetingState",
            },
            filter: { name: 'dict', params: '10043' }
          },
          {
            attrs: {
              label: "创建人",
              prop: "sysCreatorId"
            },
            filter: { name: 'user' }
          },
          {
            attrs: {
              label: "创建时间",
              prop: "sysCtime",
              'show-overflow-tooltip': true,
              formatter: (row, column) => {
                return Vue.filter('filterTimestamp')(row.sysCtime)
              }
            }
          }
        ]
      },
      dialogStatus: false,
      dialogTitle: '',
      rowData: null
    }
  },
  provide(){
    return {
      refreshTable: this.refreshTable
    }
  },
  methods: {
    handleCurrentChange(rowData) {
      this.rowData = rowData;
    },
    handleBtnClick(title, type, data = {}) {
      this.action = type
      this.dialogTitle = title
      this.dialogStatus = true
    },
    handleSearch() {
      const data = this.searchForm.formData();
      if(data.meetingDate){
        data.meetingStartTime = data.meetingDate[0]
        data.meetingEndTime = data.meetingDate[1] + 24*60*60*1000 - 1
        delete data.meetingDate
      }
      if(data.createTime){
        data.startTime = data.createTime[0]
        data.endTime = data.createTime[1] + 24*60*60*1000 - 1
        delete data.createTime
      }
      console.log('data',data);
      this.refreshTable(data);
    },
    handleSearchReset() {
      this.searchForm.resetFields();
      this.refreshTable();
    },
    handleDeleteClick() {
      if (!this.rowData) {
        return this.$showToast('未选中任何行！')
      }
      this.$confirm(`确定删除选中的评审会信息吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除记录
          assessdelete({
            ids: [this.rowData.id]
          }, { showLoading: true }).then(res => {
            this.$showToast('删除成功！', 'success')
            this.$refs.tableDom.refreshTable(true)
          }).catch(err => {
            console.log(err)
          })
        })
        .catch(() => {})
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data);
    }
  }
}
</script>

<style lang='scss'>


</style>
