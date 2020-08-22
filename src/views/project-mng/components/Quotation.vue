<template>
  <div class="app-content app-content--quote quotation-page">
    <quote text="报价方案" icon="calculator">
      <template v-slot:left>
        <div class="quote-left">
          <template v-if="quotationName">方案名称：{{quotationName}}</template>
          <template v-if="urlParams.project_name && urlParams.project_name!=='--'">
            <b class="space"></b>
            | 关联项目：{{urlParams.project_name}}
          </template>
          <el-tag
            v-if="state"
            :type="state == 1 ?'success':'info'"
            style="color:#fff;"
            effect="dark"
          >{{state | filterDictValue('10039')}}</el-tag>
        </div>
      </template>
    </quote>
    <quotation-form class="app-content-wrapper" :url-params="urlParams" />
  </div>
</template>

<script>
import QuotationForm from 'components/QuotationForm'
import Quote from 'components/Quote'
import { isEmptyObj } from 'utils'
export default {
  components: {
    QuotationForm,
    Quote
  },
  data() {
    return {
      urlParams: null,
      quotationName: '',
      selected: false,
      state: ''
    }
  },
  props: {
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  provide() {
    return {
      setQuotationNameAndState: this.setQuotationNameAndState
    }
  },
  created() {
    this.urlParams = Object.assign({}, this.routeParams)
    if (!this.urlParams.canEdit) {
      this.urlParams.canEdit = +this.urlParams.state !== 1
    }
    if (!isEmptyObj(this.urlParams)) {
      this.state = this.urlParams.state
      this.quotationName = decodeURIComponent(this.urlParams.quotation_name || '')
    }
  },
  methods: {
    // 设置报价方案名称和选用状态
    setQuotationNameAndState(name, state = '') {
      this.quotationName = name
      this.state = state
    }
  }
}
</script>
<style lang="scss">
.quotation-page {
  overflow: hidden;
  .quote-left {
    font-size: 14px;
    margin-left: 10px;
    .space {
      margin-left: 2px;
    }
  }
  .el-tag {
    margin-left: 4px;
  }
}
</style>
