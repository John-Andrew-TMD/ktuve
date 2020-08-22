<template>
  <div class="comp-contract-attachment">
    <form-search @search="handleSearch" @reset="handleSearchReset">
      <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
    </form-search>
    <div style="margin-left:10px" class="btn-group ">
      <el-button type="primary" size="mini" @click="handleBatchDownload">下载</el-button>
    </div>
    <table-create
      ref="tableDom"
      :options="tableOptions"
      @selection-change="handleSelectionChange"
    >
      <template #operation="{ scope }">
        <el-button type="text" size="mini" @click.stop="handleView(scope.row)">查看</el-button>
        <el-button type="text" size="mini" @click.stop="handleDownload(scope.row)">下载</el-button>
      </template>
    </table-create>
  </div>
</template>

<script>
import {
  attachmentPreview,
  attachmentDownload,
  bacthAttachmentDownload,
  attachmentTempDownload
} from 'api/file-system.js'
import TableCreate from 'components/TableCreate/index'
import FormSearch from 'components/FormSearch'
import { queryDictItems, formSubmit } from 'utils'
import {
  IConEnclosureBusinessPage,
  getEnclosureSummary,
  getConEnclosureList
} from 'api/contract-module/api-contract-attachment'
import { queryContractList } from 'api/contract-module/api-contract-mng.js'
// 文件类型
const FILE_TYPE = {
  project_file: '1', // 项目资料
  contract_item: '0' // 合同要件
}
export default {
  components: {
    TableCreate,
    FormSearch
  },
  props: {
    routeParams: {
      type: Object,
      default: {}
    },
    contractInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      checked: [],
      selectedRows: [],
      searchForm: null,
      searchOptions: {
        form: { labelWidth: '80px', inline: true },
        submitBtn: { show: false }
      },
      searchRules: [
        {
          type: 'el-custom-select',
          title: '附件类型',
          field: 'enclosureId',
          props: {
            params: {
              url: getConEnclosureList,
              data: {
              },
              searchKey: 'dataContent',
              labelKey: 'dataContent',
              valueKey: 'enclosureId',
              repeat: false
            },
            clearable: true
          }
        },
        {
          type: 'el-custom-select',
          title: '所属合同',
          field: 'recordId',
          props: {
            params: {
              url: queryContractList,
              data: {
                projectManagerId: this.contractInfo.projectManagerId
              },
              searchKey: 'id',
              labelKey: function(row, column) {
                return Vue.filter('filterDictValue')(row.contractType, '10053') + row.contractNo
              },
              valueKey: 'id'
            },
            filterable: 'true',
            clearable: 'true'
          }
        }
      ],
      tableOptions: {
        requestParams: {
          url: getEnclosureSummary,
          data: {
            conManagerId: this.routeParams.id
          }
        },
        showSerialNumber: true,
        showTools: false,
        showCheckbox: true,
        tableBottomOffset: 75,
        columns: [
          {
            attrs: {
              label: '附件类型',
              prop: 'dataContent'
            }
          },
          {
            attrs: {
              label: '附件名称',
              prop: 'fileName'
            }
          },
          {
            attrs: {
              label: '所属合同',
              prop: 'bolongContract'
            }
          },
          {
            attrs: {
              label: '上传时间',
              prop: 'sysCtime',
              formatter: row => {
                return Vue.filter('filterTimestamp')(row.sysCtime, 'YYYY-MM-DD HH:mm')
              }
            }
          },
          {
            attrs: {
              label: '上传人',
              prop: 'sysCreatorId'
            },
            filter: { name: 'user' }
          },
          {
            attrs: {
              label: '备注',
              prop: 'remark',
              minWidth: 86,
              formatter: row => {
                return Vue.filter('filterDictValue')(
                  row.remark,
                  '10056'
                )
              }
            }
          },
          {
            attrs: {
              label: '操作',
              prop: 'operation',
              width: '100px'
            },
            slot: 'operation'
          }
        ]
      }
    }
  },
  methods: {
    handleSelectionChange(row) {
      this.selectedRows = row
    },
    handleBatchDownload() {
      if (!this.selectedRows.length) {
        this.$showToast('请选择需要下载的文件', 'warning')
        return
      }
      const ids = this.selectedRows.map(item => item.fileId)
      formSubmit(bacthAttachmentDownload, { ids })
    },
    // 查看
    handleView(data) {
      formSubmit(attachmentPreview, { id: data.fileId }, 'get', '_blank')
    },
    // 下载
    handleDownload(data) {
      formSubmit(attachmentDownload, { id: data.fileId })
    },
    handleSearch() {
      const data = this.searchForm.formData()
      this.refreshTable(data)
    },
    handleSearchReset() {
      this.searchForm.resetFields()
      this.refreshTable()
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData({ ...data, conManagerId: this.routeParams.id })
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-contract-attachment {
  padding: 10px 10px 0;
}

</style>
