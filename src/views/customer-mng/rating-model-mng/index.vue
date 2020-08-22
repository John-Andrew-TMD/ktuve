<template>
  <div class="app-content rating-model-page">
    <div class="app-content-wrapper">
      <form-search @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="formApi" :rule="rules" :option="options" />
      </form-search>
      <div class="btn-group">
        <el-button size="mini" type="primary" @click="handleAddClick">新增模型</el-button>
        <el-button size="mini" type="primary" @click="handleSettingClick">评级结果设置</el-button>
        <el-button size="mini" type="danger" :disabled="isDelDisabled" @click="handleDeleteClick">删除</el-button>
      </div>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
      >
        <template #modelStatus="{ scope }">
          <el-tag
            :type="scope.row.modelStatus == 1 ? 'success' : 'danger'"
            effect="dark"
          >{{ scope.row.modelStatus | filterDictValue('10013') }}</el-tag>
        </template>
      </table-create>
    </div>
    <component
      :is="componentName"
      v-if="dialogStatus"
      :dialog-status.sync="dialogStatus"
      @dialog-confirm="handleDialogConfirm"
    />
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import FormSearch from 'components/FormSearch'
import { setStore, queryDictItems } from 'utils'
import { modelList, modelDelete } from 'api/customer-module/api-rating-model-mng.js'

export default {
  components: {
    TableCreate,
    FormSearch,
    DialogAdd: () => import('./components/DialogModelAddOrUpdate.vue'),
    DialogModelResultSet: () => import('./components/DialogModelResultSet.vue')
  },
  data() {
    return {
      formApi: null,
      rules: [
        {
          type: 'input',
          title: '模型名称',
          style: { width: '220px' },
          field: 'modelName'
        },
        {
          type: 'select',
          title: '启用状态',
          style: { width: '220px' },
          field: 'modelStatus',
          options: queryDictItems('10013')
        },
        {
          type: 'input',
          title: '创建人',
          style: { width: '220px' },
          field: 'createName'
        },
        {
          type: 'el-date-picker',
          field: 'create_time',
          style: { width: '220px' },
          title: '创建时间',
          props: {
            valueFormat: 'timestamp',
            type: 'daterange'
          }
          // on:{
          //     change:(startTime,endTime)=>{
          //       console.log(this.create_time)
          //       endTime = endTime+24*60*60*1000-1
          //     }
          // }
        }
      ],
      options: {
        form: { labelWidth: '85px', inline: true },
        submitBtn: { show: false }
      },
      // 表格选项
      tableOptions: {
        columns: [
          {
            attrs: {
              label: '模型名称',
              prop: 'modelName',
              align: 'left',
              'class-name': 'link-type',
              'min-width': '130',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              label: '模板使用次数',
              prop: 'modelCount'
            }
          },
          {
            attrs: {
              label: '启用状态',
              prop: 'modelStatus',
              width: 100
            },
            slot: 'modelStatus'
          },
          {
            attrs: {
              label: '适用行业',
              prop: 'applyIndustry',
              showOverflowTooltip: true
            },
            filter: {
              name: 'dict',
              params: ['10002']
            }
          },
          {
            attrs: {
              label: '创建人',
              prop: 'createName'
            }
          },
          {
            attrs: {
              label: '创建时间',
              prop: 'sysCtime'
            },
            filter: { name: 'timestamp' }
          },
          {
            attrs: {
              label: '更新时间',
              prop: 'sysEtime'
            },
            filter: { name: 'timestamp' }
          }
        ],
        requestParams: {
          url: modelList,
          data: {}
        },
        showSerialNumber: true
      },
      selectedData: null,
      // 弹窗选项
      dialogStatus: false,
      componentName: ''
    }
  },
  computed: {
    isDelDisabled() {
      if (!this.selectedData) {
        return true
      } else {
        return this.selectedData.modelCount > 0
      }
    }
  },
  methods: {
    handleRowClick(rowData, column) {
      if (column.property === 'modelName') {
        this.$router.push({
          path: '/customer-mng/rating-model-setting',
          query: {
            id: rowData.id
          }
        })
        setStore('ratingModelQuery', rowData, 'sessionStorage')
      }
    },
    handleCurrentChange(rowData) {
      this.selectedData = rowData
    },
    // 新增
    handleAddClick() {
      this.componentName = 'DialogAdd'
      this.dialogStatus = true
    },
    // 评级结果设置
    handleSettingClick() {
      this.componentName = 'DialogModelResultSet'
      this.dialogStatus = true
    },
    // 删除
    handleDeleteClick() {
      if (this.selectedData.modelCount > 0) {
        this.$message.warning('当前模型已经被使用，无法删除，请重新选择！')
        return
      }
      this.$confirm(`是否从模型列表删除【<span class='g-blue'>${this.selectedData.modelName}</span>】?`, '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          modelDelete(
            {
              ids: [this.selectedData.id]
            },
            { showLoading: true }
          )
            .then(res => {
              this.$showToast('删除成功!', 'success')
              this.$refs.tableDom.refreshTable(true)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    handleSearch() {
      const data = this.formApi.formData()
      const time = data.create_time
      if (time) {
        data.startTime = time[0]
        data.endTime = time[1] + 24 * 60 * 60 * 1000 - 1
      }
      delete data.create_time
      this.$refs.tableDom.searchTableData(data)
    },
    handleSearchReset() {
      this.formApi.resetFields()
      this.$refs.tableDom.resetTableData()
    },
    handleDialogConfirm() {
      this.$refs.tableDom.refreshTable(true)
    }
  }
}
</script>

<style lang="scss" scope>
.rating-model-page {
  $h: 6px;
  .apply_industry {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .model-status {
    position: relative;
    display: inline-block;
    padding-left: 10px;
    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: $h;
      height: $h;
      content: '';
      transform: translateY(-50%);
      border-radius: $h;
      background: #DDDD;
    }
  }
  .model-open {
    &::before {
      background: #72F572;
    }
  }
}

</style>
