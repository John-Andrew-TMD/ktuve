<!-- 报价方案&租金计划 -->
<template>
  <div class="panel-quotation-wrapper">
    <div class="panel-quotation-info">
      <div v-if="showNoneSelect" key="select" class="none-select">
        <i class="iconfont icon-file-select" />
        <template v-if="showNoData">
          <p class="title">未关联报价方案</p>
        </template>
        <template v-else>
          <p class="title">请选择报价方案</p>
          <el-button type="primary" size="mini" @click="dialogStatus=true">关联报价</el-button>
          <br />
          <br />
          <el-button type="text" size="mini" @click="handleCreateClick">创建报价方案</el-button>
        </template>
      </div>

      <template v-if="showQuotationForm">
        <div class="btn-reselect" v-show="showReselect">
          <el-tooltip
            v-if="showTooltip"
            placement="top"
            :content="quotationName"
            style="padding-left: 5px;margin-right: 10px"
          >
            <i class="iconfont icon-quotation-name" style="color: #409EFF" />
          </el-tooltip>
          <p v-else class="quotation-name" :title="quotationName">{{ quotationName }}</p>
          <el-button
            v-if="urlParams.canEdit"
            type="primary"
            plain
            size="mini"
            @click="dialogStatus=true"
          >关联报价</el-button>
        </div>
        <quotation-form
          :url-params="urlParams"
          @submit-save="handleSubmitSave"
          @click-arrow="handleToggle"
        />
      </template>
    </div>
    <quotation-select
      v-if="dialogStatus"
      :dialog-status.sync="dialogStatus"
      :project-info="projectInfo"
      @selectComplete="handleSelectComplete"
    />
  </div>
</template>

<script>
import QuotationSelect from './quotation-select'
import QuotationForm from 'components/QuotationForm'
import { quotationRelation, getQuotationInfoById } from 'api/project-module/api-project-quotation.js'
import { isEmptyObj } from 'utils'

export default {
  components: {
    QuotationSelect,
    QuotationForm
  },
  props: ['routeParams', 'projectInfo'],
  data() {
    return {
      dialogStatus: false,
      showNoneSelect: false,
      showQuotationForm: false,
      quotationName: '',
      showNoData: false, // 从流程进入报价方案页签，未关联报价方案标志
      urlParams: {},
      showReselect: true
    }
  },
  inject: ['refreshProjectData'],
  created() {
    this.urlParams = Object.assign({}, this.routeParams)
    this.getQuotationByProjectId()
  },
  methods: {
    getQuotationByProjectId() {
      getQuotationInfoById({
        id: this.urlParams.id
      })
        .then(res => {
          if (res.data && !isEmptyObj(res.data.quotationLeaseTDto)) {
            const data = res.data.quotationLeaseTDto
            this.urlParams.quotation_id = data.id
            this.quotationName = `方案名称：${data.quotationName}`
            this.showQuotationForm = true
          } else {
            this.showNoneSelect = true
            if (!isNaN(this.urlParams.node_no)) {
              this.showNoData = true
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSelectComplete(row) {
      this.urlParams.addQuotationFromProject = false
      this.showNoneSelect = false
      this.urlParams.quotation_id = row.quotationId
      if (this.showQuotationForm) {
        this.showQuotationForm = false
      }
      this.$nextTick(() => {
        this._relateQuotationProject(row)
      })
    },
    _relateQuotationProject(row, showToast = true) {
      console.log(this.urlParams, row)
      quotationRelation({
        projectId: this.urlParams.project_id,
        recordId: this.urlParams.id,
        quotationId: row.quotationId
      })
        .then(res => {
          if (showToast) {
            this.$showToast('关联成功已带入报价信息！', 'success')
          }
          this.quotationName = `方案名称：${row.quotationName}`
          this.showQuotationForm = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleCreateClick() {
      this.urlParams.addQuotationFromProject = true
      this.showNoneSelect = false
      this.showQuotationForm = true
    },
    // 新增保存并关联报价方案
    handleSubmitSave(oData) {
      const params = Object.assign({}, oData, {
        quotationId: oData.id
      })
      this._relateQuotationProject(params, false)
    },
    handleToggle(flag) {
      this.showReselect = !flag
    }
  },
  computed: {
    showTooltip() {
      return this.urlParams.canEdit && !!this.quotationName && this.showReselect
    }
  }
}
</script>

<style lang='scss'>
.panel-quotation-wrapper {
  height: 100%;
  position: relative;
  .panel-quotation-info {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #f1f4f5;
    .none-select {
      height: 100%;
      padding-top: 20px;
      text-align: center;
      background: #ffffff;
      .icon-file-select {
        font-size: 150px;
        color: #d4d4d4;
      }
      .title {
        margin: 20px 0;
        font-weight: bold;
        color: #666666;
      }
      .desc {
        margin: 20px 0;
        color: #aaaaaa;
      }
    }
  }
  .btn-reselect {
    position: absolute;
    top: 0;
    left: 10px;
    width: 400px;
    z-index: 2;
    .quotation-name {
      overflow: hidden;
      width: 600px;
      line-height: 26px;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #697289;
      background: #fff;
      margin-top: -10px;
      min-height: 10px;
    }
  }
}
</style>
