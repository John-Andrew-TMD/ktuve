<template>
  <div
    ref="container"
    id="princing-detail"
    class="app-content app-content--quote rating-model-setting-page"
  >
    <quote text="定价测算" icon="project">
      <template #left>
        <div v-if="!!priceInfo" class="text">
          （项目名称:
          <span class="the-span the-span1">{{priceInfo.projectName}}</span>
          ）
        </div>
      </template>

      <div class="quota-inner-wrapper">
        <el-row v-if="!!priceInfo" type="flex" align="middle" justify="end" class="content-top">
          <el-button
            v-if="routeParamsDetail.action=='rate'"
            type="primary"
            @click="handleApprClick"
          >发起审批</el-button>
          <el-button
            v-else-if="routeParamsDetail.action!='detail'||(priceInfo.state=='0')"
            type="primary"
            @click="handleSaveClick"
          >保存</el-button>
        </el-row>
      </div>
    </quote>
    <div class="app-content-wrapper cust-baseinfo-comp princing-detail-wrapper">
      <project-base-info
        v-if="!!priceInfo.id"
        :canEdit="canEdit"
        :routeParams="routeParamsDetail"
        :flowContent="flowContent"
        :priceInfo="priceInfo"
        ref="projectInfoDom"
      ></project-base-info>
      <table-qualitative
        v-if="!!priceInfo.id"
        :canEdit="canEdit"
        :table-data="quantifyData"
        :priceInfo="priceInfo"
        ref="qualitativeDom"
      />
      <approval-detail v-if="routeParamsDetail.action=='detail'" :canEdit="canEdit"></approval-detail>
    </div>
    <dialog-add
      @handleGetbyId="handleGetbyId"
      :table-data="quantifyData"
      v-if="dialogStatus"
      :dialog-status.sync="dialogStatus"
    ></dialog-add>
  </div>
</template>

<script>
import { deepAssign } from "utils";
import {
  ISomPricingModelBusinessGetById,
  PriceBusinessUpdatePriceDetailed,
  getPriceBusinesSavePrimeRate
} from "api/project-module/api-project-pricing";
import { mapGetters } from "vuex";
export default {
  components: {
    ProjectBaseInfo: () => import("./components/ProjectBaseInfo.vue"),
    ApprovalDetail: () => import("./components/ApprovalDetail.vue"),
    Quote: () => import("components/Quote/index"),
    QuoteHeader: () => import("./components/QuoteHeader.vue"),
    TableCreate: () => import("components/TableCreate/index"),
    FormSearch: () => import("components/FormSearch"),
    TableQualitative: () => import("./components/TableQualitative.vue")
  },
  data() {
    return {
      canEdit: false,
      dialogStatus: false,
      quantifyData: [],
      routeParamsDetail: {}
    };
  },
  props: {
    priceInfo: {
      type: Object,
      default: {}
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    flowContent: {
      type: Object,
      default: () => {}
    },
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    if (!this.routeParams) {
      this.routeParamsDetail = Object.assign({}, this.$route.query);
    } else {
      this.routeParamsDetail = Object.assign(
        {
          modelId: this.formData.primeRateInfoDto.modelId,
          projectId: this.formData.primeRateInfoDto.projectId,
          action: "detail"
        },
        this.routeParams
      );
    }
    this.canEdit = this.getCanEdit(this.priceInfo);
    this.handleGetbyId();
  },
  methods: {
    getCanEdit(priceInfo) {
      if (this.routeParamsDetail.action == "add") {
        return true;
      } else {
        if (
          _.get(priceInfo, "state") == "0" &&
          this.routeParamsDetail.action == "detail"
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    refreshPage() {
      const path = this.$route.path;
      const query = Object.assign({}, this.routeParamsDetail, {
        t: new Date().getTime()
      });
      this.$router.push({ path, query });
    },
    showConfirm(title, confirmCb) {
      this.$confirm(`确定${title}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          confirmCb && confirmCb();
        })
        .catch(() => {});
    },
    handleApprClick() {
      this.$refs.projectInfoDom.formApi.validate(async valid => {
        if (valid) {
          let params = deepAssign(this.$refs.projectInfoDom.formApi.formData());
          params.priceId = this.routeParamsDetail.id;
          params.projectId = this.routeParamsDetail.projectId;
          params.irr = +params.irr;
          params.measureIrr = +params.measureIrr;
          this.showConfirm("发起审批", () => {
            getPriceBusinesSavePrimeRate(params, { showLoading: true })
              .then(res => {
                this.refreshPage();
                this.$showToast("发起成功", "success");
                this.closeSelectedTag(this.$route);
                this.$router.push({
                  name: "pricingCalculation"
                });
              })
              .catch(err => {
                console.log(err);
              });
          });
        }
      });
    },
    closeSelectedTag(view) {
      this.$store
        .dispatch("tagsView/delView", view)
        .then(({ visitedViews }) => {
          if (this.isActive(view)) {
            this.toLastView(visitedViews, view);
          }
        });
    },
    handleGetbyId() {
      return ISomPricingModelBusinessGetById(
        {
          id: this.routeParamsDetail.modelId
            ? this.routeParamsDetail.modelId
            : this.formData.primeRateInfoDto.modelId
        },
        { showLoading: true }
      )
        .then(res => {
          this.quantifyData = res.data.firstList;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSaveClick() {
      const params = this.$refs.qualitativeDom.formApi;
      PriceBusinessUpdatePriceDetailed(params, { showLoading: true })
        .then(res => {
          this.$showToast("保存成功", "success");
        })
        .catch(err => {
          resolve(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped >
#princing-detail {
  .cust-baseinfo-comp {
    .content-body {
      box-sizing: border-box;
      max-width: 1020px;
      padding: 0 10px 10px;
    }
  }
  .enableStatus {
    display: inline-block;
    margin-bottom: 0px;
    // position: absolute;
    // right: 294px;
    // top: 6px;
  }
  .el-input input {
    vertical-align: 1px;
  }
  .app-content-wrapper {
    overflow-y: auto;
    flex: 1;
    padding-top: 10px;
  }
}

.rating-model-setting-page {
  overflow: hidden;
  .quota-inner-wrapper {
    position: absolute;
    right: 35px;
  }
  .comp-quote .quote-wrapper {
    justify-content: start;
  }
  .app-content-wrapper {
    overflow-y: auto;
    margin: 0;
  }
  .el-switch.is-checked .el-switch__core::after {
    margin-left: -14px;
  }
  .el-switch {
    margin-left: 10px;
    .el-switch__core {
      height: 16px;
      &::after {
        width: 12px;
        height: 12px;
      }
    }
    .el-switch__label {
      color: #697289;
    }
    .el-switch__label.is-active {
      color: #cccccc;
    }
  }
  .content-top {
    .el-switch {
      margin-right: 20px;
    }
  }
  .content-inner {
    padding: 10px 20px;
    box-shadow: rgba(85, 149, 255, 0.4) 0px 1px 8px;
    .header {
      padding: 20px 0;
      .el-col {
        display: flex;
        align-items: center;
        .el-input-number {
          width: 66px;
          margin: 0 3px;
          text-align: center;
        }
        .title {
          font-size: 18px;
          font-weight: bold;
        }
        b {
          font-weight: normal;
          color: #66cccc;
        }
      }
    }
    .table-wrap {
      margin-bottom: 20px;
    }
  }
  .el-table {
    .blod {
      font-weight: 600;
    }
    .plz-input {
      color: #409eff;
    }
    .el-input-number--mini {
      width: auto;
      min-width: 80px;
    }
    .el-input-number.error input {
      border-color: #f56c6c;
    }
  }
}
</style>
