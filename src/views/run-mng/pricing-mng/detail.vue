<template>
  <div
    ref="container"
    id="princing-model"
    class="app-content app-content--quote rating-model-setting-page"
  >
    <quote text="定价模型" icon="project">
      <template #left>
        <div v-if="!!modelInfo" class="text">
          <el-form :show-message="false" ref="formDom" :model="modelInfo" @submit.native.prevent>
            <el-form-item
              prop="modelName"
              :rules="formValidate({ required: true })"
              style="display:inline-block;margin-bottom:0px"
            >
              （模型名称:
              <span v-if="!canEdit" class="the-span the-span1">{{modelInfo.modelName}}</span>
              <el-input v-else style="width:150px;" v-model="modelInfo.modelName"></el-input>）
            </el-form-item>
            <span class="status">（模型编号: {{ modelInfo.modelNo }})</span>
          </el-form>
        </div>
      </template>
      <div class="quota-inner-wrapper">
        <el-row v-if="!!modelInfo" type="flex" align="middle" justify="end" class="content-top">
          <el-switch
            v-model="modelInfo.enableStatus"
            active-color="#409EFF"
            inactive-color="#ccc"
            :width="35"
            @change="handleChangenableStatus"
            inactive-text="启用状态"
          ></el-switch>
          <el-button type="success" v-if="canEdit" @click="handleSaveClick">保存模型</el-button>
          <el-button type="success" v-if="canEdit" @click="handleCancelClick">取消</el-button>
          <el-button type="primary" v-if="!canEdit" plain @click="handleEditClick">编辑已有参数</el-button>
          <el-button type="primary" plain @click="handleAddClick">新增参数</el-button>
        </el-row>
      </div>
    </quote>
    <div class="app-content-wrapper princing-detail-wrapper">
      <div class="content-inner">
        <table-qualitative :canEdit="canEdit" :table-data="quantifyData" ref="qualitativeDom" />
      </div>
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
import Quote from "components/Quote/index";
import QuoteHeader from "./components/QuoteHeader.vue";
import TableCreate from "components/TableCreate/index";
import FormSearch from "components/FormSearch";
import {  deepAssign } from "utils";
import {
  ISomPricingModelBusinessGetById,
  ISomPricingModelTableUpdateById,
  ISomPricingModelBusinessMaintainModel
} from "api/project-module/api-project-pricing";
import TableQualitative from "./components/TableQualitative.vue";
export default {
  components: {
    DialogAdd: () => import("./components/DialogValueAdd.vue"),
    Quote,
    QuoteHeader,
    TableCreate,
    FormSearch,
    TableQualitative
  },
  data() {
    return {
      oldModelInfo: null,
      modelInfo: null,
      dialogStatus: false,
      quantifyData: [],
      canEdit: false
    };
  },
  watch: {
    $route: function(to, from) {
      if (to.name !== "PricingDetail" || this.fullPath === to.fullPath) return;
      this.$store.dispatch("tagsView/refreshCurrentTag", this);
    },
    "modelInfo.modelName": function() {
      const route = Object.assign({}, this.$route, {
        title: this.modelInfo.modelName
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    }
  },
  created() {
    this.handleGetbyId();
  },
  methods: {
    handleChangenableStatus(val) {
      const params = deepAssign(this.modelInfo);
      delete params.modelName;
      params.enableStatus = (params.enableStatus===true)?'1':'0'
      this.handleISomPricingModelTableUpdateById(params);
    },
    handleEditClick() {
      this.canEdit = true;
      this.oldModelInfo = deepAssign(this.modelInfo);
    },
    handleGetbyId() {
      this.routeParams = Object.assign({}, this.$route.query);
      return ISomPricingModelBusinessGetById(
        {
          id: this.routeParams.id
        },
        { showLoading: true }
      )
        .then(res => {
          if (!res.status) {
            const oData = res.data;
            if (oData) {
              const route = Object.assign({}, this.$route, {
                title: oData.modelName
              });
              this.$store.dispatch("tagsView/updateVisitedView", route);
            }
          }
          res.data.enableStatus =(res.data.enableStatus=='1')?true:false
          this.quantifyData = res.data.firstList;
          this.modelInfo = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleISomPricingModelTableUpdateById(params) {
      return new Promise(resolve => {
        ISomPricingModelTableUpdateById(params, { showLoading: true })
          .then(res => {
            resolve();
          })
          .catch(err => {
            resolve(err);
          });
      });
    },
    handleISomPricingModelBusinessMaintainModel() {
      return new Promise(resolve => {
        const params = this.$refs.qualitativeDom.formItems.tableData;
        ISomPricingModelBusinessMaintainModel(params, { showLoading: true })
          .then(res => {
            this.canEdit = false;
          })
          .catch(err => {
            resolve(err);
          });
      });
    },
    validateFrom(formDom) {
      return new Promise(resolve => {
        if (formDom) {
          // if (typeof fApi != 'object') {
          //   fApi = this.$refs[formDom][0][fApi]
          // }
          formDom.validate(valid => {
            const result = {}
            result[formDom] = formDom
            if (valid) {
              resolve({
                pass: true,
                data: result
              })
            } else {
              resolve({
                pass: false,
                data: result
              })
            }
          })
        }
      })
    },
    handleSaveClick() {
      // console.log(this.$refs.qualitativeDom.formItems.valid())
      const p1 = this.validateFrom(this.$refs.formDom)
      const p2 = this.validateFrom(this.$refs.qualitativeDom.$refs.formDom)
      Promise.all([p1,p2]).then(result => {
        const valid = result.every(item => item.pass)
        if (!valid) return
         const params = deepAssign(this.modelInfo);
          delete params.enableStatus;
          const ISomPricingModelTableUpdateById = this.handleISomPricingModelTableUpdateById(
            params
          );
          const ISomPricingModelBusinessMaintainModel = this.handleISomPricingModelBusinessMaintainModel();
          Promise.all([
            ISomPricingModelTableUpdateById,
            ISomPricingModelBusinessMaintainModel
          ]).then(result => {});
      })
      // this.$refs.formDom.validate(async valid => {
      //   if (valid) {
         
      //   }
      // });
    },
    handleCancelClick() {
      this.canEdit = false;
      this.quantifyData = this.oldModelInfo.firstList;
      this.modelInfo = this.oldModelInfo;
      // this.$refs.qualitativeDom.formItems.resetFields();
    },
    handleAddClick() {
      this.dialogStatus = true;
    }
  }
};
</script>

<style lang="scss">
#princing-model {
   overflow: hidden;
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
  .princing-detail-wrapper {
    .el-form-item {
      margin-bottom: 0 !important;
    }
  }
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
