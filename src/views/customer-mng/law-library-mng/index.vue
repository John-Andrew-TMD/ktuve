<template>
  <div class='app-content law-library-page'>
    <div class='app-content-wrapper'>
      <form-search @search="handleSearch" @reset="handleSearchReset">
        <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
      </form-search>
      <div class="btn-group">
        <el-button type="primary" @click="handleBtnClick('新增','A')">新增</el-button>
        <el-button
          :disabled= !rowData
          type="primary"
          @click="handleBtnClick('编辑','U',rowData)"
        >编辑</el-button>
        <import-btn
          @change="handleImportClick"
          size="mini"
          text="导入"
          :fieldMap="fieldMap"
        ></import-btn>
        <el-button size="mini" type="primary" @click="handleTempDownload">模板下载</el-button>
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
    <dialog-law-library
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
import ImportBtn from "components/ElFileImport/index";
import { queryChinaRegionByIds, formSubmit } from "utils";
import { lawLibrary, lawLibraryAddBatch, lawLibraryDelete } from 'api/customer-module/api-law-library-mng.js'
import { templateDownloadUrl, } from 'api/customer-module/api-customer-mng.js'
import { validteSocialCreditCode } from 'utils/validate'

export default {
  components: {
    TableCreate,
    FormSearch,
    ImportBtn,
    DialogLawLibrary: () => import("./components/DialogLawLibrary.vue")
  },
  props: {},
  data () {
    return {
      // 搜索框选项
      searchForm: {},
      searchRules: [
        { 
          type: "el-custom-autocomplete",
          title: "律师名称", 
          field: "lawyerName",
          props: {
            params: {
              url: lawLibrary,
              data: {},
              searchKey: 'lawyerName',
              labelKey: 'lawyerName',
              valueKey: 'lawyerName',
              repeat: false
            }
          },
        },
        { 
          type: "el-custom-autocomplete",
          title: "律所名称", 
          field: "organizationName",
          props: {
            params: {
              url: lawLibrary,
              data: {},
              searchKey: 'organizationName',
              labelKey: 'organizationName',
              valueKey: 'organizationName',
              repeat: false
            }
          },
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
        form: { labelWidth: "85px", inline: true },
        submitBtn: { show: false }
      },
      // 表格选项
      tableOptions: {
        requestParams: {
          url: lawLibrary,
          data: {}
        },
        showSerialNumber: true,
        selectedRow: 0,
        showTools: true,
        columns: [
          {
            attrs: {
              label: "律师名称",
              prop: "lawyerName"
            }
          },
          {
            attrs: {
              label: "律师执业证号",
              prop: "professionNo"
            }
          },
          {
            attrs: {
              label: "电话",
              prop: "phoneNumber"
            }
          },
          {
            attrs: {
              label: "律所名称",
              prop: "organizationName"
            }
          },
          {
            attrs: {
              label: "律所执照",
              prop: "organizationLicence"
            }
          },
          {
            attrs: {
              label: "律所执业证号",
              prop: "organizationProfessionNo"
            }
          },
          {
            attrs: {
              label: "统一社会信用代码",
              prop: "creditCode"
            }
          },
          {
            attrs: {
              label: "法人代表",
              prop: "legalPerson"
            }
          },
          {
            attrs: {
              label: "开户行",
              prop: "bankName"
            }
          },
          {
            attrs: {
              label: "账户",
              prop: "bankAccount"
            }
          },
          {
            attrs: {
              label: "注册地址",
              prop: "registeredAddress",
              'show-overflow-tooltip': true
            },
            filter: { name: 'address' }
          },
          {
            attrs: {
              label: "办公地址",
              prop: "officeAddress",
              'show-overflow-tooltip': true
            },
            filter: { name: 'address' }
          },
          {
            attrs: {
              label: "创建时间",
              prop: "sysCtime",
              'show-overflow-tooltip': true
            },
            filter: {
              name: 'timestamp'
            }
          }
        ]
      },
      dialogStatus: false,
      dialogTitle: '',
      rowData: null,
      fieldMap: [
        { field: 'lawyerName', title: '律师名称（必输）'},
        { field: 'professionNo', title: '律师执业证号（必输）'},
        { field: 'phoneNumber', title: '电话'},
        { field: 'organizationName', title: '律所名称'},
        { field: 'organizationLicence', title: '律所执照'},
        { field: 'organizationProfessionNo', title: '律所执业证号'},
        { field: 'creditCode', title: '统一社会信用代码'},
        { field: 'legalPerson', title: '法人代表'},
        { field: 'bankName', title: '开户行'},
        { field: 'bankAccount', title: '账户'}
      ]
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
      if(data.createTime){
        data.startTime = data.createTime[0]
        data.endTime = data.createTime[1] + 24*60*60*1000
        delete data.createTime
      }
      this.refreshTable(data);
    },
    handleSearchReset() {
      this.searchForm.resetFields();
      this.refreshTable();
    },
    async handleImportClick(data) {
      console.log("-----excel导入的数据----", data);
      let flag = true
      let row = 0
      data.forEach((item,index) => {
        if(item.creditCode){
          if(!validteSocialCreditCode(item.creditCode)){
            flag = false
            row = index
          }
        }
      });
      if(!flag){
        this.$showToast(`第${row+1}行数据的统一社会信用代码校验不通过!`);
      } else {
        lawLibraryAddBatch(data, { showLoading: true }).then(res => {
          this.$showToast("导入成功!", "success");
          this.$refs.tableDom.refreshTable(true)
        }).catch(err => {
          console.log(err)
        })
      }
    },
    handleTempDownload(){
      formSubmit(
        templateDownloadUrl,
        {
          modelType: '2'
        },
        'get'
      )
    },
    handleDeleteClick() {
      if (!this.rowData) {
        return this.$showToast('未选中任何行！')
      }
      this.$confirm(`确定删除选中的律师记录吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除记录
          lawLibraryDelete({
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
