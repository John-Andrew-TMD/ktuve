<template>
  <div class="table-wrap" v-if="modelInfo">
    <el-row class="header" type="flex" justify="space-between">
      <el-col :span="16">
        <span class="title">一、定性指标</span>
        <b>（共100分，占比{{ quotaRate }}%）</b>
      </el-col>
      <el-col :span="8" class="text-right">
        <span>定性指标得分：</span>
        <b>{{ totalScore | formatText}}</b>
      </el-col>
    </el-row>
    <el-table :data="qualitativeTable" border class="full-w">
      <el-table-column width="50">
        <template slot-scope="scope">
          <div :class="{'tb-title':scope.row.level === 1}">{{ scope.row.serialNumber }}</div>
        </template>
      </el-table-column>
      <el-table-column label="指标项" min-width="120">
        <template slot-scope="scope">
          <div :class="{'tb-title':scope.row.level === 1, 'tb-left':true}">{{ scope.row.itemName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="满分">
        <template slot-scope="scope">
          <span :class="{score:scope.row.level === 1}">{{ scope.row.maxScore }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(item,index) in qualitativeThs" :key="index">
        <template #header>
          <span>{{ item }}</span>
        </template>
        <template slot-scope="scope" v-if="scope.row.level !== 1">
          <span>{{ scope.row.scores[index]}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120">
        <template #header>
          公司等级
          <span class="green">(请选择)</span>
        </template>
        <template slot-scope="scope" v-if="scope.row.level !== 1">
          <el-select
            v-if="isEdit"
            v-model="scope.row.evaluateScore"
            @change="handleGradeChange(scope.row)"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in qualitativeThs"
              :key="index"
              :label="item"
              :value="+scope.row.scores[index]"
            />
          </el-select>
          <div v-else>{{ scope.row.evaluateLevel }}</div>
        </template>
      </el-table-column>
      <el-table-column min-width="130" show-overflow-tooltip>
        <template #header>
          打分说明
          <span class="green">(非必填)</span>
        </template>
        <template slot-scope="scope" v-if="scope.row.level !== 1">
          <el-input v-if="isEdit" v-model="scope.row.scoreDetail" placeholder="请输入内容" />
          <template v-else>{{ scope.row.scoreDetail }}</template>
        </template>
      </el-table-column>
      <el-table-column prop="evaluateScore" label="得分" />
    </el-table>
  </div>
</template>
<script>
import { generateTree } from 'utils'

export default {
  data() {
    return {
      qualitativeTable: [],
      qualitativeThs: []
    }
  },
  props: {
    // 指标数据
    tableQuotaData: {
      type: Object,
      default: null
    },
    // 等级打分数据
    tableData: {
      type: Array,
      default: null
    },
    quotaRate: {
      type: Number,
      default: 0
    },
    modelInfo: {
      type: Object,
      default: () => {}
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData(data) {
      const arr = data || this.tableQuotaData
      if (!Array.isArray(arr) || !arr.length) return
      const trees = generateTree(arr, '0', 'id', 'parentId')
      this.displayTableData(trees)
    },
    // 展示定性表格数据
    displayTableData(data) {
      let tempArr = []
      let qualitativeThs = null
      function flatArray(nodes, parentIndex) {
        nodes = nodes.sort((a, b) => a.itemOrder - b.itemOrder)
        if (nodes[0].level > 2) return
        nodes.forEach((item, index) => {
          item.serialNumber = (item.level > 1 ? `${parentIndex}.` : '') + (index + 1)
          if (item.level !== 1) {
            item.scores = item.scores || (item.maxScore + '').split(',')
            item.maxScore = +item.scores[0]
            qualitativeThs = qualitativeThs || (item.threeName + '').split(',') || []
          } else {
            item.maxScore = +item.maxScore
          }
          tempArr.push(item)
          if (Array.isArray(item.children) && item.children.length) {
            flatArray(item.children, index + 1)
            if (item.level > 1) return
            delete item.children
          }
        })
      }
      flatArray(data)
      this.qualitativeThs = qualitativeThs
      tempArr = this.formatTableData(tempArr)
      this.qualitativeTable = tempArr
    },
    // 拼接等级、打分等数据到表格
    formatTableData(data) {
      let count = 0
      const isChangeModel = this.modelInfo.isChangeModel
      return data.map((item, index) => {
        if (item.level !== 1 && this.tableData.length) {
          item.id = this.tableData[count].id
          if (isChangeModel) {
            item.evaluateScore = +item.scores[0]
          } else {
            const evaluateScore = this.tableData[count].evaluateScore
            const evaluateLevel = this.tableData[count].evaluateLevel
            item.evaluateScore = evaluateScore || evaluateScore === 0 ? +evaluateScore : +item.scores[0]
            item.scoreDetail = this.tableData[count].scoreDetail
            if (evaluateLevel) {
              // 公司等级存在
              item.evaluateLevel = evaluateLevel
            } else {
              // 公司等级不存在，设置默认值
              this.handleGradeChange(item)
            }
          }
          count++
        }
        return item
      })
    },
    // 改变公司等级
    handleGradeChange(rowData) {
      const idx = rowData.scores.findIndex(fItem => fItem == rowData.evaluateScore)
      rowData.evaluateLevel = this.qualitativeThs[idx]
      this.$emit('update:isRated', false)
    }
  },
  watch: {
    tableQuotaData(arr) {
      this.initData(arr)
    }
  },
  computed: {
    // 定性指标得分
    totalScore() {
      let total = 0
      this.qualitativeTable.forEach(item => {
        if (item.level !== 1 && item.evaluateScore) {
          total += Number(item.evaluateScore)
        }
      })
      total = (this.quotaRate * total) / 100
      this.$emit('update:totalScore', total)
      return total
    }
  },
  filters: {
    formatText(val, rowData = {}) {
      if (rowData.level === 1) return
      return !val && val !== 0 ? '--' : val
    }
  }
}
</script>
