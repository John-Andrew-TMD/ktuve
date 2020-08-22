<template>
  <div class="app-content blacklist-mng-page">
    <div class="app-content-wrapper">
      <form-search @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <el-button size="mini" type="primary" @click="handleAddClick">新增</el-button>
        <import-btn
          @change="handleImportClick"
          size="mini"
          text="导入"
          :fieldMap="fieldMap"
        ></import-btn>
        <el-button size="mini" type="primary" @click="handleTempDownload">模板下载</el-button>
        <el-button size="mini" type="danger" @click="handleDeleteClick">删除</el-button>
      </div>
      <table-create
        ref="tableDom"
        :options="tableOptions"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
      >
      </table-create>
    </div>
    <component
      :is="componentName"
      v-if="dialogStatus"
      :row-data="rowData"
      :dialog-status.sync="dialogStatus"
    />
  </div>
</template>

<script>
import TableCreate from "components/TableCreate/index";
import FormSearch from "components/FormSearch";
import ImportBtn from "components/ElFileImport/index";
import { queryDictItems, formSubmit, queryDictKey, queryIndustryByIds } from "utils";
import { blackList, blacklistAddBatch, blacklistDelete } from 'api/customer-module/api-customer-blacklist-mng.js'
import { templateDownloadUrl } from 'api/customer-module/api-customer-mng.js'
import { validateIdCard, validateTaiWanIdCard, validateGangAoIdCard, validteSocialCreditCode } from 'utils/validate'

export default {
  components: {
    TableCreate,
    FormSearch,
    ImportBtn,
    DialogAdd: () => import("./components/DialogAdd.vue")
  },
  data() {
    return {
      // 搜索框选项
      searchForm: null,
      searchRules: [
        {
          type: "el-custom-autocomplete",
          title: "客户名称",
          field: "custName",
          props: {
            params: {
              url: blackList,
              data: {},
              searchKey: 'custName',
              labelKey: 'custName',
              valueKey: 'custName',
              repeat: false
            }
          }
        },
        {
          type: "select",
          title: "客户类别",
          field: "custCategory",
          options: queryDictItems("10008"),
          props: {
            clearable: true
          }
        },
        {
          type: "select",
          title: "名单类型",
          field: "listType",
          options: queryDictItems("10015"),
          props: {
            clearable: true
          }
        },
        {
          type: "select",
          title: "行业类别",
          field: "industry",
          options: queryDictItems("10002"),
          props: {
            clearable: true
          }
        }
      ],
      searchOptions: {
        form: { labelWidth: "85px", inline: true },
        submitBtn: { show: false }
      },
      // 表格选项
      tableOptions: {
        requestParams: {
          url: blackList,
          data: {}
        },
        showCheckbox: true,
        showSerialNumber: true,
        selectedRow: 0,
        showTools: true,
        columns: [
          {
            attrs: {
              label: "客户名称",
              prop: "custName",
              "min-width": "100",
              "show-overflow-tooltip": true
            }
          },
          {
            attrs: {
              label: "客户类别",
              prop: "custCategory",
              width: '100px',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.custCategory, '10008')
              }
            }
          },
          {
            attrs: {
              label: "证件号码",
              prop: "idCode",
              width: '150px'
            }
          },
          {
            attrs: {
              label: "客户编号",
              prop: "custNo"
            }
          },
          {
            attrs: {
              label: "名单类型",
              prop: "listType",
              width: '100px',
              formatter: row => {
                return Vue.filter('filterDictValue')(row.listType, '10015')
              }
            }
          },
          {
            attrs: {
              label: "发布机构",
              prop: "issuedBy",
              width: '120px'
            }
          },
          {
            attrs: {
              label: "行业类别",
              prop: "industry",
              'show-overflow-tooltip': true,
              formatter: row => {
                return queryIndustryByIds(row.industry, '-')
              }
            }
          },
          {
            attrs: {
              label: "备注",
              prop: "remarks",
              'show-overflow-tooltip': true
            }
          }
        ]
      },
      rowData: null,
      selectedRows: [],
      componentName: 'DialogAdd',
      dialogStatus: false,
      fieldMap: [
        { field: 'custName', title: '客户名称（必输）'},
        { field: 'custCategory', title: '客户类别（必输）'},
        { field: 'idType', title: '证件类型'},
        { field: 'idCode', title: '证件号码（必输）'},
        { field: 'listType', title: '名单类型'},
        { field: 'issuedBy', title: '发布机构'}
      ],
    };
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
    handleSelectionChange(row) {
      this.selectedRows = row
    },
    handleAddClick() {
      this.dialogStatus = true
    },
    async handleImportClick(data) {
      console.log("-----excel导入的数据----", data);
      let flag = true
      let required = true
      let row = 0
      data.forEach(item => {
        item.custNo = '--'
        item.custCategory = queryDictKey('10008',item.custCategory)
        item.listType = queryDictKey('10015',item.listType)
        if(item.custName == '' || item.custCategory == '' || item.idType == '' || item.idCode == ''){
          required = false
        }
      });
      try {
        data.forEach((item,index) => {
          if(item.idType == '身份证'){
            if(!validateIdCard(item.idCode+'')){
              flag = false
              row = index
              throw new Error('校验不通过')
            }
          } else if (item.idType == '台胞证'){
            if(!validateTaiWanIdCard(item.idCode+'')){
              flag = false
              row = index
              throw new Error('校验不通过')
            }
          } else if (item.idType == '港澳居民来往内地通行证') {
            if(!validateGangAoIdCard(item.idCode+'')){
              flag = false
              row = index
              throw new Error('校验不通过')
            }
          } else if (item.idType == '统一社会信用代码') {
            if(!validteSocialCreditCode(item.idCode+'')){
              flag = false
              row = index
              throw new Error('校验不通过')
            }
          } else {
            return
          }
        });
        console.log("-----转换后的数据的数据----", data);
        if(!required) {
          this.$showToast(`必填项不能为空!`);
        } else {
          blacklistAddBatch(data, { showLoading: true }).then(res => {
            this.$showToast("导入成功!", "success");
            this.$refs.tableDom.refreshTable(true)
          }).catch(err => {
            console.log(err)
          })
        }
      } catch {
        if(!flag){
          this.$showToast(`第${row+1}行数据的证件号码校验不通过!`);
          return
        }
      }
    },
    handleTempDownload(){
      formSubmit(
        templateDownloadUrl,
        {
          modelType: '1'
        },
        'get'
      )
    },
    handleDeleteClick() {
      if (!this.selectedRows.length) {
        return this.$showToast('未勾选任何行！')
      }
      this.$confirm(`确认从黑名单中删除选中内容吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          let ids = []
          this.selectedRows.map(item => {
            ids.push(item.id)
          })
          blacklistDelete({
            ids: ids
          }, { showLoading: true }).then(res => {
            this.$showToast('删除成功！', 'success')
            this.$refs.tableDom.refreshTable(true)
          }).catch(err => {
            console.log(err)
          })
        })
        .catch(() => {})
    },
    handleSearch() {
      const data = this.searchForm.formData();
      this.refreshTable(data);
    },
    handleSearchReset() {
      this.searchForm.resetFields();
      this.refreshTable();
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data);
    }
  }
};
</script>
