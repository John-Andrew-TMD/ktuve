<template>
  <div class="model-meta-comp">
    <p class="meta">
      <b>模型名称：</b>
      <span class="model-name">{{ modelInfo.modelName }} | </span>
      <b>适用行业：</b>
      <span>{{ industryStr }}</span>
      <el-tooltip v-if="showMore" effect="dark" placement="bottom-end">
        <template #content>
          <ul class="rating-industry-tooltip">
            <li v-for="(item,index) in industryList" :key="index">{{ item }}</li>
          </ul>
        </template>
        <b class="number">{{ industryList.length }}个</b>
      </el-tooltip>
      <span v-if="showMore">行业</span>
    </p>
    <el-button
      type="primary"
      plain
      size="mini"
      icon="el-icon-edit-outline"
      :disabled="modelInfo.modelCount > 0"
      @click="handleEditClick"
    >编辑</el-button>
  </div>
</template>

<script>
import { filterDictValue } from '@/filters'
import { isEmptyObj } from 'utils'
export default {
  props: {
    modelInfo: {
      type: Object,
      default: () => ({})
    }
  },
  inject: ['showUpdateDialog'],
  data() {
    return {
      industryList: [],
      industryStr: '',
      showMore: false
    }
  },
  watch: {
    modelInfo(obj) {
      this.initUI()
    }
  },
  created() {
    this.initUI()
  },
  methods: {
    initUI() {
      if (isEmptyObj(this.modelInfo)) return
      const industry = filterDictValue(this.modelInfo.applyIndustry, '10002')
      this.industryList = industry && industry.split('，') || []
      this.industryStr = industry
      if (industry.length > 60) {
        this.industryStr = `${industry.substring(0, 60)}等`
        this.showMore = true
      } else {
        this.showMore = false
      }
    },
    handleEditClick() {
      this.showUpdateDialog()
    }
  }
}
</script>

<style lang='scss' scoped>
  .model-meta-comp {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: space-between;
    font-size: 12px;
    .meta {
      overflow: hidden;
      flex: 1;
      width: 0;
      padding: 0 15px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    b {
      font-weight: normal;
      color: #409EFF;
    }
    .number {
      font-weight: bold;
      cursor: default;
      text-decoration: underline;
    }
    .el-button {
      border-style: dashed;
    }
    .rating-industry-tooltip {
      padding: 5px;
      line-height: 2.2;
    }
  }

</style>
