<template>
  <div id="dialogHook" class="app-content app-content--quote rating-score-page">
    <quote v-if="modelInfo" text="客户评级打分" icon="customer">
      <template v-slot:left>
        <div class="quote-left">
          客户名称：{{modelInfo.custName}}
          <el-tag
            :type="tagType"
            effect="dark"
            v-if="!urlParams.isFlow"
          >{{modelInfo.evaluateStatus | filterDictValue('10022')}}</el-tag>
        </div>
      </template>
      <div class="text-right">
        <span v-if="!isEdit">评分人：{{ modelInfo.creatorName }}</span>
        <span v-if="!isEdit" class="ml-10">评分时间：{{ modelInfo.sysCtime|filterTimestamp }}</span>
        <span class="ml-10">评级模型：{{ modelInfo.modelName }}</span>
        <el-button
          v-if="canSave"
          type="success"
          plain
          size="mini"
          class="ml-10"
          @click="chooseModel"
        >重选模型</el-button>
      </div>
    </quote>
    <div v-if="modelInfo" class="app-content app-content-wrapper">
      <div v-if="modelInfo.isFirstFlag == 1" class="warning-tips">
        <i class="el-message__icon el-icon-warning" />当前客户为首次评级，请保存此次评分结果。
      </div>
      <el-row class="result-wrap">
        <el-col :span="16">
          <span>
            总得分：
            <b>{{ totalScore | formatText }}</b>
          </span>
          <span>
            评定等级：
            <b>{{ evaluateLevel | formatText }}</b>
          </span>
          <span>
            信用提示：
            <b>{{ creditSuggest | formatText }}</b>
          </span>
        </el-col>
        <el-col :span="8" class="text-right">
          <div>
            <el-button v-if="showCancelBtn" type="danger" @click="handleCancelChange">撤销变更</el-button>
            <el-button v-if="showApprovalBtn" type="primary" @click="handleApproval">发起审批</el-button>
            <el-button v-if="canSave" type="success" @click="handleSave">保存</el-button>
          </div>
        </el-col>
      </el-row>
      <div class="tips">评定等级说明: {{ evaluateExplain | formatText }}</div>
      <div class="content-inner">
        <table-qualitative
          v-if="showQualitative"
          ref="qualitativeDom"
          :table-quota-data="qualitativeTable"
          :table-data="qualitativeData"
          :model-info="modelInfo"
          :quota-rate="qualitativeRate"
          :total-score.sync="qualitativeScore"
          :is-edit="canSave"
          :is-rated.sync="isRated"
        />
        <table-quantify
          v-if="showQuantify"
          ref="quantifyDom"
          :table-quota-data="quantifyTable"
          :table-data="quantifyData"
          :quota-rate="quantifyRate"
          :total-score.sync="quantifyScore"
          :model-info="modelInfo"
        />
      </div>
    </div>
    <dialog-model-select
      v-if="dialogStatus"
      :model-info.sync="modelInfo"
      :dialog-status.sync="dialogStatus"
      :is-rated.sync="isRated"
    />
  </div>
</template>

<script>
import Quote from 'components/Quote/index'
import TableQualitative from './components/TableQualitative.vue'
import TableQuantify from './components/TableQuantify.vue'
import DialogModelSelect from './components/DialogModelSelect.vue'
import { isEmptyObj } from 'utils'
import {
  getScoreList,
  getModelInfoById,
  getModelById,
  ratingResultList,
  scoreModelSave,
  modelNumberUpdate,
  scoreModelSaveAndApproval,
  scoreModelCancelChange
} from 'api/customer-module/api-customer-rating-mng.js'

export default {
  components: {
    Quote,
    TableQualitative,
    TableQuantify,
    DialogModelSelect
  },
  filters: {
    formatText(val) {
      return !val && val !== 0 ? '--' : val
    }
  },
  data() {
    return {
      dialogStatus: false,
      modelInfo: null,
      ratingList: [],
      oldModelId: null,
      isRated: false, // 是否已打分
      // 定性
      showQualitative: false,
      qualitativeTable: [],
      qualitativeData: [],
      qualitativeScore: 0,
      qualitativeRate: 0,
      // 定量
      showQuantify: false,
      quantifyTable: [],
      quantifyData: [],
      quantifyScore: 0,
      quantifyRate: 0
    }
  },
  props: {
    routeParams: {
      type: Object,
      default: null
    }
  },
  provide() {
    return {
      getModelData: this.getModelData
    }
  },
  computed: {
    // 总得分
    totalScore() {
      return (Number(this.qualitativeScore) + Number(this.quantifyScore)).toFixed(2)
    },
    // 评定信息
    ratingInfo() {
      if (this.isRated) {
        return Object.assign({}, this.modelInfo, { creditPrompt: this.modelInfo.creditSuggest })
      } else {
        return (
          this.ratingList.find(item => {
            if (this.totalScore == 100) {
              return this.totalScore == item.maxScore
            }
            return this.totalScore < item.maxScore && this.totalScore >= item.minScore
          }) || {}
        )
      }
    },
    // 评定等级
    evaluateLevel() {
      return this.ratingInfo.evaluateLevel
    },
    // 信用提示
    creditSuggest() {
      return this.ratingInfo.creditPrompt
    },
    // 评定等级说明
    evaluateExplain() {
      return this.ratingInfo.evaluateExplain
    },
    urlParams() {
      return this.routeParams || this.$route.query || {}
    },
    isEdit() {
      return this.urlParams.canEdit
    },
    canSave() {
      return this.urlParams.isFlow ? this.isEdit : this.showApprovalBtn
    },
    showCancelBtn() {
      // 评级状态 0.待审批 1. 审批中 2. 审批通过 3. 审批不通过 4. 变更评级中 5.变更审批中 6. 变更审批通过
      return this.isEdit && +this.modelInfo.evaluateStatus === 4
    },
    showApprovalBtn() {
      return this.isEdit && [0, 4].includes(+this.modelInfo.evaluateStatus)
    },
    tagType() {
      const state = +this.modelInfo.evaluateStatus
      if ([2, 6].includes(state)) {
        return 'success'
      } else if ([1, 5].includes(state)) {
        return 'warning'
      } else {
        return 'info'
      }
    }
  },
  watch: {
    $route: function(to, from) {
      this.$store.dispatch('tagsView/refreshCurrentTag', this)
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.getModelInfo()
      this.getRatingResultList()
    },
    getRatingResultList() {
      ratingResultList({}).then(res => {
        this.ratingList = res.data.records
      })
    },
    // 评级数据
    getModelInfo() {
      getScoreList(
        {
          id: this.urlParams.id,
          custId: this.urlParams.cust_id || ''
        },
        {
          showLoading: true
        }
      )
        .then(res => {
          if (!res.data) return
          this.getDataByModelId(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDataByModelId(data) {
      const { changeInfoList, detailList, evaluateList } = data
      this.quantifyData = detailList
      this.qualitativeData = changeInfoList
      this.oldModelId = evaluateList.modelId
      this.getModelData(evaluateList.modelId)
      // 根据模型id查询他的行业信息
      getModelInfoById(
        {
          id: evaluateList.modelId
        },
        {
          showLoading: true
        }
      )
        .then(ret => {
          const applyIndustry = (ret.data && ret.data.applyIndustry) || ''
          this.modelInfo = Object.assign({}, evaluateList, {
            applyIndustry
          })
          this.isRated = evaluateList.isHadGrade === 2 // 1未打分 2已经打分
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 模型数据
    getModelData(modelId) {
      getModelById({
        modelId
      })
        .then(res => {
          if (!isEmptyObj(res.data)) {
            const { changeInfoList, quotaList, regularInfoList } = res.data
            quotaList.forEach(item => {
              if (item.quotaName === 'CHANGEABLE') {
                // 定性
                this.qualitativeRate = item.quotaRate
                this.showQualitative = item.quotaValidFlag === 1
              } else if (item.quotaName === 'REGULAR') {
                // 定量
                this.quantifyRate = item.quotaRate
                this.showQuantify = item.quotaValidFlag === 1
              }
            })
            this.qualitativeTable = changeInfoList
            this.quantifyTable = regularInfoList
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 保存时获取定性数据
    getQualitativeParams() {
      if (!this.showQualitative) return []
      const qualitativeTable = this.$refs.qualitativeDom.qualitativeTable
      const newData = []
      const creditCustId = this.urlParams.id
      qualitativeTable.forEach(item => {
        if (item.level !== 1) {
          const obj = {
            id: item.id,
            creditCustId,
            evaluateScore: item.evaluateScore + '',
            evaluateLevel: item.evaluateLevel || '',
            itemOrder: item.itemOrder,
            itemType: item.itemType,
            scoreDetail: item.scoreDetail || ''
          }
          newData.push(obj)
        }
      })
      return newData
    },
    // 保存时获取定量数据
    getquantifyParams() {
      if (!this.showQuantify) return []
      const quantifyTable = this.$refs.quantifyDom.quantifyTable
      const newData = []
      quantifyTable.forEach(item => {
        if (item.level !== 1) {
          const obj = {
            itemFirst: item.itemFirst,
            itemSecond: item.itemSecond,
            itemThird: item.itemThird,
            evaluateScore: item.evaluateScore,
            id: item.id
          }
          newData.push(obj)
        }
      })
      return newData
    },
    // 保存
    handleSave() {
      this.$confirm('是否确认保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const changeInfoList = this.getQualitativeParams() // 定性数据F
          const detailList = this.getquantifyParams() // 定量数据
          const modelInfo = this.modelInfo
          this.updateModelUseNumber()
          // 保存
          scoreModelSave(
            {
              changeInfoList,
              detailList,
              evaluateList: {
                id: modelInfo.id,
                creditSuggest: this.creditSuggest,
                custId: modelInfo.custId,
                custNo: modelInfo.custNo,
                custName: modelInfo.custName,
                evaluateExplain: this.evaluateExplain,
                evaluateLevel: this.evaluateLevel,
                modelId: modelInfo.modelId,
                modelName: modelInfo.modelName,
                regularScore: this.quantifyScore,
                changeScore: this.qualitativeScore,
                totalScore: this.totalScore,
                evaluateStatus: modelInfo.evaluateStatus
              }
            },
            { showLoading: true }
          )
            .then(res => {
              this.oldModelId = this.modelInfo.modelId
              this.$showToast('保存评级结果成功', 'success')
            })
            .catch(err => {
              console.log(err)
              this.$showToast('保存评级结果失败', 'warning')
            })
        })
        .catch(() => {})
    },
    // 更新模型使用的次数
    updateModelUseNumber() {
      if (this.oldModelId !== this.modelInfo.modelId) {
        modelNumberUpdate({
          newModelId: this.modelInfo.modelId,
          oldModelId: this.oldModelId
        }).catch(err => {
          console.log(err)
        })
      }
    },
    // 撤销变更
    handleCancelChange() {
      scoreModelCancelChange({
        id: this.modelInfo.id,
        changeId: this.modelInfo.changeId
      }).then(res => {
        if (!res.data) return
        const { path, query } = this.$route
        const newQuery = Object.assign({}, query, {
          id: res.data.id
        })
        this.$router.push({ path, query: newQuery })
      })
    },
    // 保存并发起审批
    handleApproval() {
      this.$confirm('是否确定发起审批?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const changeInfoList = this.getQualitativeParams() // 定性数据
          const detailList = this.getquantifyParams() // 定量数据
          const modelInfo = this.modelInfo
          scoreModelSaveAndApproval(
            {
              changeInfoList,
              detailList,
              evaluateList: {
                id: modelInfo.id,
                creditSuggest: this.creditSuggest,
                custId: modelInfo.custId,
                custNo: modelInfo.custNo,
                custName: modelInfo.custName,
                evaluateExplain: this.evaluateExplain,
                evaluateLevel: this.evaluateLevel,
                modelId: modelInfo.modelId,
                modelName: modelInfo.modelName,
                regularScore: this.quantifyScore,
                changeScore: this.qualitativeScore,
                totalScore: this.totalScore,
                evaluateStatus: modelInfo.evaluateStatus
              }
            },
            { showLoading: true }
          )
            .then(res => {
              this.oldModelId = this.modelInfo.modelId
              this.updateModelUseNumber()
              this.initData()
              this.$showToast('发起审批成功', 'success')
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {})
    },
    chooseModel() {
      this.dialogStatus = true
    },
    // 计算得分
    calculateScore(item) {
      const maxScore = Number(item.max_score)
      const standardScore = Number(item.standard_score)
      const minScore = Number(item.min_score)
      const avgScore = Number(item.average)
      let calcScore = 0
      if (avgScore >= standardScore) {
        calcScore = maxScore
      } else if (avgScore > minScore) {
        calcScore = ((maxScore * (avgScore - minScore)) / (standardScore - minScore)).toFixed(2)
      } else {
        calcScore = 0
      }
      return calcScore
    }
  }
}
</script>

<style lang="scss">
.rating-score-page {
  .white-bg {
    background: #ffffff;
  }
  .quote-left {
    font-size: 14px;
    margin-left: 10px;
  }
  .app-content-wrapper {
    .result-wrap {
      padding-bottom: 20px;
      color: #868686;
      .el-col:first-child {
        span {
          margin-right: 56px;
          line-height: 32px;
          b {
            font-size: 16px;
            color: #5f97ff;
          }
        }
      }
    }
    .tips {
      margin-bottom: 20px;
      padding: 10px 15px;
      line-height: 1.6;
      color: #5b6377;
      background: #fbfbfb;
    }
    .warning-tips {
      margin-bottom: 12px;
      padding: 10px 20px;
      color: #666666;
      border: 1px solid #ffe58f;
      background: #fffbe6;
      i {
        color: #e6a23c;
      }
    }
    .content-inner {
      margin-bottom: 10px;
      padding: 10px 20px;
      box-shadow: rgba(85, 149, 255, 0.4) 0px 1px 8px;
    }
  }
  .table-wrap {
    margin-bottom: 20px;
    .header {
      padding: 20px 0;
      .el-col {
        &:first-child {
          .title {
            font-size: 18px;
            font-weight: bold;
          }
          b {
            font-weight: normal;
            color: #66cccc;
          }
        }
        &:last-child {
          span {
            color: #868686;
          }
          b {
            font-size: 16px;
            color: #5f97ff;
          }
        }
      }
    }
    .score {
      font-size: 16px;
      font-weight: bold;
    }
    .tb-left {
      text-align: left;
    }
    .tb-title {
      font-size: 13px;
      font-weight: bold;
    }
  }
  .green {
    color: #00cccc;
  }
}
</style>
