<template>
  <div class="app-content app-content--quote comp-common-investment-detail">
    <quote icon="financing" text="新增资金投放" v-if="!$attrs['flow-info']">
      <template #left>
        <!-- <div v-if="!!custInfo" class="text">
          <span>（编号: {{ custInfo.custNo }}</span>
          <span class="ml-10">业务经理: {{ custInfo.businessManage }}）</span>
          <span class="status">{{ custInfo.custCategory | filterDictValue('10008') }}</span>
        </div> -->
      </template>
      <div v-if="$attrs.from === 'add'">
        <el-button v-if="active !== 1" size="mini" type="primary" @click="handlePrevClick">上一步</el-button>
        <el-button v-if="active !== 3" size="mini" type="primary" @click="handleNextClick">下一步</el-button>
        <el-button v-if="active" size="mini" type="primary" @click="handleApproveClick">发起审批</el-button>
      </div>
    </quote>
    <div class="app-content-wrapper">
      <el-steps size="mini" :active="active" simple>
        <el-step title="投放信息" icon="el-icon-edit" @click.native="handleStepClick(1, $event)" />
        <el-step title="款项信息" icon="el-icon-s-order" @click.native="handleStepClick(2, $event)" />
        <el-step title="资料附件" icon="el-icon-upload" @click.native="handleStepClick(3, $event)" />
      </el-steps>
      <div class="app-content-body">
        <transition name="fade" mode="out-in">
          <keep-alive :include="cachedCompName">
            <component v-if="showComponent" :is="componentName" ref="compInstance" v-bind="$attrs" />
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import CompInvestmentInfo from './CompInvestmentInfo.vue'
import Quote from 'components/Quote/index'
import { saveLoanInfo, queryLoanDetail } from 'api/investment-mng/api-capital-investment-mng.js'
import { isEmptyObj } from 'utils'
export default {
  components: {
    Quote,
    CompInvestmentInfo,
    CompFundsInfo: () => import('./CompFundsInfo.vue'),
    CompAttachments: () => import('./CompAttachments.vue')
  },
  provide() {
    return {
      getTransferData: this.getTransferData,
      getDataFromPublicData: this.getDataFromPublicData
    }
  },
  data() {
    return {
      active: 1,
      transferData: {}, // 用来保存tab组件返回的数据
      showComponent: false
    }
  },
  computed: {
    componentName() {
      return ['', 'CompInvestmentInfo', 'CompFundsInfo', 'CompAttachments'][this.active]
    },
    cachedCompName() {
      return this.active === 1 ? 'CompInvestmentInfo,CompAttachments' : 'CompInvestmentInfo,CompFundsInfo,CompAttachments'
    }
  },
  created() {
    if (this.$attrs['route-params'] && this.$attrs['route-params'].loanId) {
      this.getLoanDetialById()
    } else {
      this.showComponent = true
    }
  },
  methods: {
    getLoanDetialById() {
      queryLoanDetail({
        id: this.$attrs['route-params'].loanId
      }).then(res => {
        if (res.data) {
          const data = res.data
          this.publicData = data
          this.showComponent = true
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handlePrevClick() {
      this.active--
    },
    async handleNextClick() {
      const ret = await this.validateForm()
      if (!ret) return
      this.active++
    },
    handleStepClick(index, e) {
      if (this.$attrs.from === 'add') return
      if (e.target.classList.contains('el-step__title')) {
        this.active = index
      }
    },
    getTransferData() {
      return this.transferData
    },
    getDataFromPublicData(field) {
      if(field === 'all') {
        return this.publicData || {}
      }
      return this.publicData && this.publicData(field) || null
    },
    async handleApproveClick() {
      const res = this.validateAllForm()
      if(!res) return
      saveLoanInfo({
        pdmLoanTableEntityDto: loanData,
        pdmProjectPlacementTableEntityDto: {
          projectManagerId,
          projectRecordId,
          conBundleId
        },
        pdmEnclosureList: attachment.fileLists
      }, { showLoading: true }).then(res => {
        this.$showToast('发起成功！', 'success')
        this.$store
          .dispatch('tagsView/closeCurrentTag', this.$route)
          .then(() => {
            this.$router.push(this.$route.meta.from)
          })
      }).catch(err => {
        console.log(err)
      })
    },
    async validateForm() {
      const ret = await this.$refs.compInstance.validateForm()
      if (!ret) {
        this.$showToast('参数校验不通过！', 'warning')
        return false
      }
      this.transferData = { ...this.transferData, ...ret }
      return true
    },
    async validateAllForm() {
      const ret = await this.validateForm()
      // if (!ret) return false
      const { projectManagerId, projectRecordId, conBundleId, loanData, attachment } = this.transferData
      if (!projectRecordId || !conBundleId) {
        this.$showToast('投放信息填写不完整！', 'warning')
        return false
      }
      if (!loanData) {
        this.$showToast('款项信息页签未查看！', 'warning')
        return false
      }
      if(isEmptyObj(loanData)) {
        this.$showToast('款项信息填写不完整！', 'warning')
        return false
      }
      if (!attachment) {
        this.$showToast('资料附件页签未查看！', 'warning')
        return false
      }
      if (attachment.hasNecessary) {
        this.$showToast('资料附件必填项不允许为空！', 'warning')
        return false
      }
      return true
    }
  }
}
</script>

<style lang='scss' scoped>
.comp-common-investment-detail /deep/  {
  overflow: hidden;
  .el-steps {
    padding: 7px 8%;
    .el-step.is-simple .el-step__title {
      font-size: 14px;
      cursor: pointer;
      user-select: none;
    }
  }
  .app-content-wrapper {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    padding: 5px 5px 0;
    .app-content-body {
      overflow-y: auto;
      flex: 1;
    }
  }
}

</style>
