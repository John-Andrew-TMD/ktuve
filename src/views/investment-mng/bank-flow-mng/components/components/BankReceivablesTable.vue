<template>
  <div id="BankReceivablesTable">
    <div class="btn-group">
      <div class="btn-flex">
        <h4>应收款项（列表中为所有未核销、部分核销应收款项，请选择目标行，点击匹配）</h4>
      </div>
    </div>
    <form-search collapse @search="handleSearch" @reset="handleSearchReset">
      <form-create v-model="searchForm" :rule="searchRules" :option="searchOptions" />
    </form-search>
    <table-create :options="tableOptions" class="mt-0 table-create" />
  </div>
</template>

<script>
import TableCreate from "components/TableCreate/index";
import FormSearch from "components/FormSearch";
import { queryApprovalDetail } from "api/contract-module/api-contract-mng.js";
export default {
  inheritAttrs: false,
  components: {
    TableCreate,
    FormSearch
  },
  data() {
    return {
      searchForm: null,
      searchRules: [
        {
          type: "el-custom-select",
          title: "流水单号",
          field: "enclosureId",
          props: {
            params: {
              url: queryApprovalDetail,
              data: {},
              labelKey: "dataContent",
              valueKey: "enclosureId"
            },
            clearable: true,
            filterable: "true"
          }
        }
      ],
      searchOptions: {
        form: { labelWidth: "120px", inline: true },
        submitBtn: { show: false }
      },
      tableOptions: {
        requestParams: {
          url: queryApprovalDetail,
          data: {}
        },
        tableBottomOffset: 75,
        showPagination: false,
        columns: [
          {
            attrs: {
              label: "发起人",
              prop: "sysCreatorId"
            },
            filter: {
              name: "user"
            }
          },

          {
            attrs: {
              label: "创建时间",
              prop: "sysCtime"
            },
            filter: {
              name: "timestamp"
            }
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    handleSearch() {
      const data = this.searchForm.formData();
      this.refreshTable(data);
    },
    handleSearchReset() {
      this.searchForm.resetFields();
      this.refreshTable();
    },
    handleCurrentChange(row, index) {
      if (!row) return;
      this.rowData = row;
    }
  }
};
</script>

<style lang="scss" scoped>
#BankReceivablesTable {
  .table-create /deep/ .el-table__body-wrapper{
      max-height: inherit!important;
  }
  .btn-group {
    border: none;
  }
  h4 {
    line-height: 28px;
  }
  .flex-btn {
    margin-left: auto;
  }
  .btn-flex {
    display: flex;
    // flex-direction: row;
    justify-content: flex-start;
    align-content: center;
  }
  .operation {
    font-size: 16px !important;
  }
}
</style>
