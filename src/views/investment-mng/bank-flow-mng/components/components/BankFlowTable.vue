<template>
  <div id="BankFlowTable">
    <div class="btn-group">
      <div class="btn-flex">
        <h4>流水单信息</h4>
      </div>
    </div>
    <table-create :data="tableData" :options="tableOptions" class="mt-0" />
  </div>
</template>

<script>
import TableCreate from "components/TableCreate/index";
export default {
  inheritAttrs: false,
  components: {
    TableCreate
  },
  props: {
    tableData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      tableOptions: {
        tableBottomOffset: 75,
        showPagination: false,
         requestImmediate: false,
          showLoading: false,
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
    handleCurrentChange(row, index) {
      if (!row) return;
      this.rowData = row;
    }
  }
};
</script>

<style lang="scss" scoped>
#BankFlowTable {
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
