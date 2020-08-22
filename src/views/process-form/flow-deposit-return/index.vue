<!-- 保证金退还 -->
<template>
  <div class="flow-deposit-return app-content white-bg">
    <comp-deposit-return
      v-if="urlParams"
      ref="actionDom"
      :row-data="rowData"
      :flow-info="flowInfo"
      :route-params="urlParams"
    />
    <div v-if="showSave" class="btn-wrapper">
      <el-button type="primary" @click="handleSaveClick">保存</el-button>
    </div>
  </div>
</template>

<script>
import ClassFlow from 'utils/class-flow.js'
import CompDepositReturn from 'views/investment-mng/deposit-mng/components/components/CompDepositReturn.vue'
import { depositUpdate } from 'api/investment-mng/api-deposit-mng.js'
export default {
  components: {
    CompDepositReturn
  },
  inheritAttrs: false,
  props: {
    flowInfo: {
      type: Object,
      default: () => ({})
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    routeParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      urlParams: null,
      rowData: {}
    }
  },
  computed: {
    showSave() {
      return this.flowInfo.startFlag
    }
  },
  created() {
    this.initForm()
    this.generateInstance()
  },
  methods: {
    initForm() {
      this.rowData = Object.assign({}, this.formData.riskfeeDto, this.formData)
      this.urlParams = Object.assign({}, this.formData, {
        canEdit: this.flowInfo.startFlag
      })
    },
    async handleSaveClick() {
      const actionDom = this.$refs.actionDom
      const valid = await actionDom.validForm()
      if (!valid) return
      const formData = actionDom.formApi.formData()
      const addList = actionDom.fileList.filter(item => !item.loanId)
      const deleteIds = actionDom.deleteIds
      depositUpdate(
        {
          id: formData.id,
          riskfeeType: formData.riskfeeType,
          applyMatters: formData.applyMatters,
          approvalAmount: formData.approvalAmount,
          addList,
          deleteIds,
          planDate: formData.planDate,
          remarks: formData.remarks
        },
        { showLoading: true }
      )
        .then(res => {
          this.$showToast('保存成功', 'success')
        })
        .catch(err => {
          console.log(err)
        })
    },
    generateInstance() {
      const flowInstance = new ClassFlow(this.flowInfo, this)
      this.$emit('input', flowInstance)
    }
  }
}
</script>

<style lang='scss' scoped>
.flow-deposit-return {
  position: static;
  padding-bottom: 30px;
  .btn-wrapper {
    margin: 10px 0 0 120px;
  }
}
</style>
