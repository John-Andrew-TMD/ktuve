<template>
  <div ref="container" class="app-content app-content--quote rating-model-setting-page">
    <quote text="评级模型设置" icon="contract">
      <quote-header v-if="!!modelInfo" :model-info="modelInfo" />
    </quote>
    <div class="app-content-wrapper">
      <el-row type="flex" align="middle" justify="end" class="mb-15 content-top">
        <el-tooltip class="item" effect="dark" content="在发起评级时，只能选用已启用的评级模型" placement="top">
          <i class="el-icon-info" />
        </el-tooltip>
        <el-switch
          v-model="modelStatus"
          active-color="#409EFF"
          inactive-color="#ccc"
          :width="35"
          inactive-text="启用评级模型"
        />
        <el-button type="primary" plain :disabled="modelCount>0" @click="handleSettingClick">定性参数设置</el-button>
        <el-button type="success" :disabled="modelCount>0" @click="handleSaveClick">保存</el-button>
      </el-row>
      <div class="content-inner">
        <table-qualitative
          ref="qualitativeDom"
          v-model="newQualitativeTable"
          :model-count="modelCount"
          :status-data="statusData"
          :model-flag.sync="modelFlag"
          :table-data="qualitativeTable"
          @ratio-change="handleRatioChange"
        />
        <table-quantify
          ref="quantifyDom"
          :model-count="modelCount"
          :status-data="statusData"
          :model-flag.sync="modelFlag"
          :table-data="quantifyTable"
          @ratio-change="handleRatioChange"
        />
      </div>
    </div>
    <action-update
      v-if="dialogUpdateStatus"
      :dialog-status.sync="dialogUpdateStatus"
      :model-info="modelInfo"
      dialog-title="修改模型信息"
      @dialog-confirm="handleUpdateDialogConfirm"
    />
    <action-param-setting
      v-if="dialogParamStatus"
      :dialog-status.sync="dialogParamStatus"
      :table-data="newQualitativeTable"
      @dialog-confirm="handleSettingDialogConfirm"
    />
  </div>
</template>

<script>
import Quote from 'components/Quote/index'
import QuoteHeader from './components/QuoteHeader.vue'
import TableQualitative from './components/TableQualitative.vue'
import TableQuantify from './components/TableQuantify.vue'
import { getModelById, modelDataUpdate } from 'api/customer-module/api-rating-model-mng.js'
import { isEmptyObj } from 'utils'
export default {
  components: {
    Quote,
    TableQualitative,
    TableQuantify,
    QuoteHeader,
    ActionUpdate: () => import('./components/DialogModelAddOrUpdate.vue'),
    ActionParamSetting: () => import('./components/DialogModelParamsSet.vue')
  },
  data() {
    return {
      modelStatus: false,
      dialogUpdateStatus: false,
      dialogParamStatus: false,
      qualitativeTable: null,
      newQualitativeTable: null,
      quantifyTable: null,
      statusData: null, // 定性|定量指标占比及启用状态
      modelInfo: null,
      modelFlag: 0 // 用来控制至少启用一个模型（0 全部启用；1 定性不启用,定量启用置灰；2 定量不启用，定性启用置灰）
    }
  },
  provide() {
    return {
      showUpdateDialog: this.showUpdateDialog
    }
  },
  computed: {
    modelId() {
      return this.$route.query.id
    },
    modelCount() {
      return (this.modelInfo && this.modelInfo.modelCount) || ''
    }
  },
  watch: {
    '$route': function(to, from) {
      this.$store.dispatch('tagsView/refreshCurrentTag', this)
    }
  },
  created() {
    this.getModelData()
  },
  methods: {
    getModelData() {
      getModelById({
        modelId: this.modelId
      })
        .then(res => {
          if (!isEmptyObj(res.data)) {
            const { changeInfoList, modelList, quotaList, regularInfoList } = res.data
            this.modelInfo = modelList[0] || {}
            this.modelStatus = this.modelInfo.modelStatus == 1
            // 设置定性，定量指标状态和指标值
            this.statusData = quotaList
            this.qualitativeTable = changeInfoList
            this.quantifyTable = regularInfoList
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSaveClick() {
      const qualitativeData = this.$refs.qualitativeDom.validateData()
      if (!qualitativeData) return
      const quantifyData = this.$refs.quantifyDom.validateData()
      if (!quantifyData) return

      modelDataUpdate(
        {
          changeInfoList: qualitativeData.tableData,
          modelList: [
            {
              id: this.modelId,
              modelStatus: this.modelStatus ? 1 : 2
            }
          ],
          quotaList: [qualitativeData.metaData, quantifyData.metaData],
          regularInfoList: quantifyData.tableData
        },
        { showLoading: true }
      )
        .then(res => {
          this.$showToast('修改成功！', 'success')
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 启用评级模型事件
    // handleModelChange(val) {
    //   if (!this.modelInfo) return this.$showToast('初始数据请求失败，请刷新页签重试！')
    //   modelDataUpdate({
    //     changeInfoList: [{}],
    //     modelList: [{
    //       id: this.modelInfo.id,
    //       modelStatus: val ? 1 : 2
    //     }],
    //     quotaList: [{}],
    //     regularInfoList: [{}]
    //   }).then(res => {
    //     this.$showToast('修改成功！', 'success')
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // },
    showUpdateDialog() {
      this.dialogUpdateStatus = true
    },
    handleSettingClick() {
      this.dialogParamStatus = true
    },
    handleUpdateDialogConfirm(obj) {
      const { modelName, applyIndustry } = obj
      this.modelInfo.modelName = modelName
      this.modelInfo.applyIndustry = applyIndustry
      this.modelInfo = { ...this.modelInfo }
    },
    handleSettingDialogConfirm(data) {
      this.$nextTick(() => {
        this.$refs.qualitativeDom.displayTableData(data)
      })
    },
    // 定性|定量指标比例发生改变
    handleRatioChange({ field, value }) {
      if (field === 'qualitative') {
        this.$refs.quantifyDom.ratio = 100 - value
      } else {
        this.$refs.qualitativeDom.ratio = 100 - value
      }
    }
    // 定性|定量启用状态发生改变
    // handleStatusChange({ id, type, value }) {
    //   if (!this.modelInfo) return this.$showToast('初始数据请求失败，请刷新页签重试！')
    //   modelDataUpdate({
    //     changeInfoList: [{}],
    //     modelList: [{}],
    //     quotaList: [{
    //       id,
    //       quotaName: type,
    //       quotaValidFlag: value ? 1 : 2
    //     }],
    //     regularInfoList: [{}]
    //   }).then(res => {
    //     this.$showToast('修改成功！', 'success')
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // }
  }
}
</script>

<style lang="scss">
.rating-model-setting-page {
  overflow: hidden;
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
      color: #CCCCCC;
    }
  }
  .content-top {
    .el-switch {
      margin-right: 20px;
    }
  }
  .content-inner {
    padding: 10px 20px;
    box-shadow: rgba(85, 149, 255, .4) 0px 1px 8px;
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
          color: #66CCCC;
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
      color: #409EFF;
    }
    .el-input-number--mini {
      width: auto;
      min-width: 80px;
    }
    .el-input-number.error input {
      border-color: #F56C6C;
    }
  }
}

</style>
