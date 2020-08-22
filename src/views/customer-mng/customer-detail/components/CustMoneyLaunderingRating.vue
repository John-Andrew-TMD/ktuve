<template>
  <div class="money-laundering-rating-wrap">
    <div class="content">
      <table-create :options="tableOptions" class="mt-0">
        <template v-slot:fileId="slotScope">
          <p class="file-name" @click="handleFilePreview(slotScope.scope.row.fileId)">客户洗钱风险等级划分表</p>
        </template>
        <!-- <template v-slot:optionId="slotScope">
          {{ getBreakWord(slotScope.scope.row.optionId) }}
        </template> -->
      </table-create>
    </div>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import { formSubmit } from 'utils'
import { custMoneyLaunderingRatingList } from 'api/customer-module/api-customer-detail.js'
import { attachmentDownload } from 'api/file-system.js'

export default {
  props: {
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableOptions: {
        requestParams: {
          url: custMoneyLaunderingRatingList,
          data: { custId: this.routeParams.id }
        },
        showSerialNumber: true,
        showPagination: true,
        columns: [
          { attrs: { label: '评定等级', prop: 'levelId','show-overflow-tooltip': true } },
          { attrs: { label: '评级选项', prop: 'optionId', 'show-overflow-tooltip': true } },
          { attrs: { label: '评级项目', prop: 'projectName', 'show-overflow-tooltip': true } },
          { attrs: { label: '评级项目状态', prop: 'projectState' } },
          { attrs: { label: '评级人', prop: 'rater' } },
          { attrs: { label: '评级日期', prop: 'ratingDate' } },
          { attrs: { label: '附件', prop: 'fileId' }, slot: true },
        ]
      }
    }
  },
  components: {
    TableCreate
  },
  methods: {
    handleFilePreview(id){
      formSubmit(attachmentDownload, { id: id })
    },
    // getBreakWord(val){
    //   console.log('br',val)
    //   let text= val
    //   let reg = /[;；]/g
    //   text = text.replace(reg,";<br>")
    //   console.log('text',text);
    //   return val
    // }
  }
}
</script>

<style lang="scss" scoped>
.money-laundering-rating-wrap {
  padding: 0 10px;
  .file-name{
    color: #5595ff;
  }
}
</style>
