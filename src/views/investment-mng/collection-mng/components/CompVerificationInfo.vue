<template>
  <div class="comp-contract-base-info">
    <div class="contract-list-wrapper">
      <div class="left">
        <info-left
          ref="infoLeftDom"
          :form-models="formModels"
          :is-bank-flow="isBankFlow"
        />
      </div>
      <div class="right">
        <info-right
          ref="infoRightDom"
          :form-models="formModels"
          :is-bank-flow="isBankFlow"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { customerList } from 'api/customer-module/api-customer-mng.js'
import { queryDictValue } from 'utils'

export default {
  components: {
    InfoLeft: () => import('./CompVerificationInfoLeft.vue'),
    InfoRight: () => import('./CompVerificationInfoRight.vue')
  },
  props: {
    formModels: {
      type: Object,
      default: {}
    },
    isBankFlow: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {}
  },
  created() {},
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.comp-contract-base-info {
  position: relative;
  height: 100%;
  background: #FFFFFF;
  border-bottom: 1px solid #f6f6f6;
  .contract-list-wrapper {
    display: flex;
    height: 100%;
  }
  .left {
    overflow: auto;
    box-sizing: border-box;
    width: 354px;
    transition: width .3s;
    border-right: 1px solid #F1F4F5;
    &::-webkit-scrollbar-track-piece {
      background-color: #FFFFFF;
    }
  }
  .right {
    overflow-y: auto;
    flex: 1;
    box-sizing: border-box;
    margin-left: 7px;
    background: #FFFFFF;
    &::-webkit-scrollbar-track-piece {
      background-color: #FFFFFF;
    }
  }
}

</style>
