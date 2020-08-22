<template>
  <div class="table-wrap" v-if="modelInfo">
    <el-row class="header" type="flex" justify="space-between" v-if="modelInfo">
      <el-col :span="16">
        <span class="title">二、定量指标</span>
        <b>（共100分，占比{{ quotaRate }}%）</b>
      </el-col>
      <el-col :span="8" class="text-right">
        <span>定量指标得分：</span>
        <b>{{totalScore | formatText }}</b>
      </el-col>
    </el-row>
    <div class="tips">说明：定量指标数据来自于“客户模块-财务情况”中所上传的近三年财务报表，系统获取后自动计算定量指标得分。</div>
    <el-table :data="quantifyTable" border class="full-w">
      <el-table-column label width="50">
        <template slot-scope="scope">
          <div :class="{'tb-title':scope.row.level === 1}">{{ scope.row.serialNumber }}</div>
        </template>
      </el-table-column>
      <el-table-column label="指标项" min-width="150">
        <template slot-scope="scope">
          <div :class="{'tb-title':scope.row.level === 1, 'tb-left':true}">{{ scope.row.itemName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="最大分值">
        <template slot-scope="scope">
          <div :class="{score:scope.row.level === 1}">{{ scope.row.maxScore | filterDigitDecimals }}</div>
        </template>
      </el-table-column>
      <el-table-column label="标准值">
        <template slot-scope="scope">{{ scope.row.standardScore | formatText(scope.row) }}</template>
      </el-table-column>
      <el-table-column label="最低值">
        <template slot-scope="scope">{{ scope.row.minScore | formatText(scope.row) }}</template>
      </el-table-column>
      <el-table-column v-for="(item,index) in threeYears" :key="index" :label="item.year+'年'">
        <template slot-scope="scope">
          <div>{{ scope.row[item.field] | formatText(scope.row) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="平均">
        <template slot-scope="scope">{{ average(scope.row) | formatText(scope.row) }}</template>
      </el-table-column>
      <el-table-column label="得分">
        <template slot-scope="scope">{{ amountScore(scope.row) | formatText(scope.row) }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { generateTree } from 'utils'
export default {
  data() {
    return {
      quantifyTable: [],
      qualitativeKPIThs: []
    }
  },
  props: {
    // 指标数据
    tableQuotaData: {
      type: Object,
      default: null
    },
    // 最近三年财务数据
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
      default: null
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
      this.displayTableData(arr)
    },
    // 展示定量表格数据
    displayTableData(data) {
      const trees = generateTree(data, '0', 'id', 'parentId')
      let tempArr = []
      let tempIndex = 0
      function flatArray(nodes, parentIndex) {
        nodes = nodes.sort((a, b) => a.itemOrder - b.itemOrder)
        nodes.forEach((item, index) => {
          if (item.level === 1) {
            tempIndex = index + 1
            item.serialNumber = tempIndex
          } else {
            item.serialNumber = `${tempIndex}.${index + 1}`
          }
          tempArr.push(item)
          if (Array.isArray(item.children) && item.children.length) {
            flatArray(item.children, index + 1)
            delete item.children
          }
        })
      }
      flatArray(trees)
      tempArr = this.formatTableData(tempArr)
      this.quantifyTable = tempArr
    },
    // 近三年财务数据到表格
    formatTableData(data) {
      let count = 0
      return data.map((item, index) => {
        if (item.level !== 1) {
          if (!this.tableData[count]) return item
          item.id = this.tableData[count].id
          item.itemFirst = this.tableData[count].itemFirst
          item.itemSecond = this.tableData[count].itemSecond
          item.itemThird = this.tableData[count].itemThird
          count++
        }
        return item
      })
    },
    // 计算平均值
    calculateAverage(rowData) {
      const arr = [rowData.itemFirst, rowData.itemSecond, rowData.itemThird]
      let sum = 0
      let count = 0
      arr.forEach(item => {
        if (item || item === 0) {
          count++
          sum += item
        }
      })
      if (!count) return ''
      return (sum / count).toFixed(2)
    },
    // 计算得分
    calculateScore(item) {
      const maxScore = Number(item.maxScore)
      const standardScore = Number(item.standardScore)
      const minScore = Number(item.minScore)
      const avgScore = Number(this.calculateAverage(item))
      let calcScore = 0
      if (!avgScore) {
        return calcScore
      } else if (avgScore >= standardScore) {
        calcScore = maxScore
      } else if (avgScore > minScore) {
        calcScore = ((maxScore * (avgScore - minScore)) / (standardScore - minScore)).toFixed(2)
      }
      return calcScore
    }
  },
  watch: {
    tableQuotaData(arr) {
      this.initData(arr)
    }
    // totalScore(newVal) {
    //   this.$emit('update:totalScore', newVal)
    // }
  },
  computed: {
    // 表格平均分
    average() {
      return rowData => {
        if (rowData.level === 1) return ''
        const avg = this.calculateAverage(rowData)
        rowData.average = avg
        return avg
      }
    },
    threeYears() {
      const date = new Date()
      const year = date.getFullYear()
      return [
        { year: year - 3, field: 'itemFirst' },
        { year: year - 2, field: 'itemSecond' },
        { year: year - 1, field: 'itemThird' }
      ]
    },
    // 表格得分
    amountScore() {
      return rowData => {
        if (rowData.level === 1) return
        const evaluateScore = this.calculateScore(rowData)
        rowData.evaluateScore = evaluateScore
        return evaluateScore
      }
    },
    // 定量指标得分
    totalScore() {
      let total = 0
      this.quantifyTable.forEach(item => {
        if (item.level !== 1) {
          total += Number(this.calculateScore(item))
        }
      })
      total = ((total * Number(this.quotaRate)) / 100).toFixed(2)
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
