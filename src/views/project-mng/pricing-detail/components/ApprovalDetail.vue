<template>
  <div class="table-wrap">
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">利率优惠详情</span>
      </div>
    </div>
    <div class="content-body">
      <table-create ref="tableDom" :options="tableOptions" />
    </div>
  </div>
</template>

<script>
import { queryDictItems } from "utils";
import { PriceBusinessPage } from "api/project-module/api-project-pricing";
import TableCreate from "components/TableCreate/index";
export default {
  inheritAttrs: false,
  components: {
    TableCreate
  },
  data() {
    return {
      tableOptions: {
        requestParams: {
          url: PriceBusinessPage,
          data: {}
        },
        showPagination: false,
        requestImmediate: false,
        showLoading: false,
        showTools: false,
        tableBottomOffset: 75,
        columns: [
          {
            attrs: {
              label: "流程标题",
              prop: "title",
              align: "center",
              "class-name": "link-type",
              "min-width": "150",
              "show-overflow-tooltip": true
            }
          },
          {
            attrs: {
              label: "报价方案",
              prop: "quotationName"
            }
          },
         {
            attrs: {
              label: "项目IRR",
              prop: "irr",
              formatter: row => {
                if (!row.irr && typeof row.irr === "object") return;
                return (parseFloat(row.irr) ).toFixed(4);
              }
            }
          },
          {
            attrs: {
              label: "测算IRR",
              prop: "measureIrr",
               formatter: row => {
                if (!row.measureIrr && typeof row.measureIrr === "object") return;
                return (parseFloat(row.measureIrr)).toFixed(4);
              }
            }
          },
          {
            attrs: {
              label: "优惠幅度BP",
              prop: "bp"
            }
          },
          {
            attrs: {
              label: "审批要件",
              prop: "discountIrr",
              formatter: row => {
                if (!row.discountIrr && typeof row.discountIrr === "object") return;
                return (parseFloat(row.discountIrr)).toFixed(4);
              }
            }
          },
          {
            attrs: {
              label: "审批状态",
              prop: "state",
              minWidth: 90
            },
            filter: {
              name: "dict",
              params: "10016"
            }
          },
          {
            attrs: {
              label: "发起人",
              prop: "sysCreatorId",
              formatter: row => {
                return Vue.filter("filterUserInfo")(row.sysCreatorId);
              }
            }
          },
          {
            attrs: { label: "审批结束时间", prop: "total_score" },
            filter: { name: "timestamp" }
          },
          {
            attrs: {
              label: "创建时间",
              prop: "sysCtime",
              formatter: row => {
                return Vue.filter("filterDateSeparate")(row.sysCtime);
              }
            }
          }
        ]
      }
    };
  },
  props: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
