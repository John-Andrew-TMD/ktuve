<!-- 抵质押物 -->
<template>
  <div>
    <h4>
      <span style="margin-right: auto">抵质押物清单</span>
      <el-button v-if="canEdit && isHistory" class="syncBtn" icon="el-icon-refresh" size="mini" @click="handleSynchronizeProject()">获取项目信息</el-button>
    </h4>
    <div class="contract-mortgage-collateral">
      <template>
        <!-- 地产类 -->
        <comp-land-info v-if="landDisable" ref="landDom" :route-params="routeParams" />
        <div v-if="landDisable" class="divide-line" />
        <!-- 房地产合一 -->
        <comp-estate-and-land v-if="estateAndLandDisable" ref="estateAndLandDom" :route-params="routeParams" />
        <div v-if="estateAndLandDisable" class="divide-line" />
        <!-- 房产类 -->
        <comp-estate-info v-if="estateDisable" ref="estateDom" :route-params="routeParams" />
        <div v-if="estateDisable" class="divide-line" />
        <!-- 其他押品 -->
        <comp-others-info v-if="othersDisable" ref="othersDom" :route-params="routeParams" />
      </template>
    </div>
  </div>
</template>

<script>
import CompEstateInfo from 'views/project-mng/project-detail/components/components/MortgageCollateral/components/CompEstateInfoForContract.vue'
import CompOthersInfo from 'views/project-mng/project-detail/components/components/MortgageCollateral/components/CompOthersInfoForContract.vue'
import CompLandInfo from 'views/project-mng/project-detail/components/components/MortgageCollateral/components/CompLandInfoForContract.vue'
import CompEstateAndLand from 'views/project-mng/project-detail/components/components/MortgageCollateral/components/CompEstateAndLandForContract.vue'
import { isEmptyObj } from 'utils'
import { synchronizeProject } from 'api/project-module/api-project-subject-matter.js'
import ContractRightMixins from './mixins/ContractRightMixins'
export default {
  components: {
    CompLandInfo,
    CompEstateAndLand,
    CompEstateInfo,
    CompOthersInfo
  },
  mixins: [ContractRightMixins],
  props: {
    contractRowInfo: {
      type: Object,
      default: () => ({})
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      landDisable: false,
      estateAndLandDisable: false,
      estateDisable: false,
      othersDisable: false,
      routeParams: {},
      type: '',
      dom: ''
    }
  },
  watch: {
    contractRowInfo: {
      handler(obj) {
        if (!isEmptyObj(obj)) {
          this.landDisable = false
          this.estateAndLandDisable = false
          this.estateDisable = false
          this.othersDisable = false
          this.$nextTick(() => {
            this.showTableData()
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    showTableData() {
      this.routeParams = {
        id: this.contractRowInfo.id,
        canEdit: !!this.isHistory && this.canEdit
      }
      if (['12', '13'].includes(this.contractRowInfo.contractType)) {
        this.othersDisable = true
        this.type = '4'
        this.dom = 'othersDom'
      } else if (['14', '15'].includes(this.contractRowInfo.contractType)) {
        this.estateDisable = true
        this.type = '2'
        this.dom = 'estateDom'
      } else if (['16', '17'].includes(this.contractRowInfo.contractType)) {
        this.landDisable = true
        this.type = '2'
        this.dom = 'landDom'
      } else if (['18', '19'].includes(this.contractRowInfo.contractType)) {
        this.estateAndLandDisable = true
        this.type = '2'
        this.dom = 'estateAndLandDom'
      } else {
        this.landDisable = false
        this.estateAndLandDisable = false
        this.estateDisable = false
        this.othersDisable = false
      }
    },
    handleSynchronizeProject() {
      const data = {
        contractId: this.contractRowInfo.id,
        managerId: this.contractRowInfo.projectManagerId,
        type: this.type
      }
      synchronizeProject(data, { showLoading: true }).then(res => {
        this.$showToast('同步项目信息成功!', 'success')
        this.$refs[this.dom].$refs.tableDom.resetTableData()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
h4 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  color: #5B6377;
}
/deep/ .contract-mortgage-collateral {
  padding: 0;
  .btn-group {
    border-top: none;
  }
  .content-body {
    box-sizing: border-box;
    padding: 0 0 10px;
  }
  .panel-header {
    padding: 0;
  }
  .panel-wrapper {
    position: relative;
    .panel-tools {
      position: absolute;
      top: 0;
      right: 0;
      line-height: 36px;
    }
  }
  .divide-line {
    height: 10px;
    border-bottom: 5px solid #FFFFFF;
    background: #F1F4F5;
  }
  .el-form {
    .el-select, .el-input, .el-cascader {
      width: 100%;
    }
  }
}

</style>
