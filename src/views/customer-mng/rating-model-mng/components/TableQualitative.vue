<!--定性指标-->
<template>
  <div class="table-wrap">
    <el-row class="header">
      <el-col :span="24">
        <span class="title">一、定性指标</span>
        <b>（共100分，占比</b>
        <el-input-number
          v-model="ratio"
          size="mini"
          :min="0"
          :max="100"
          :controls="false"
          :disabled="modelCount > 0"
          @change="handleRatioChange"
        />
        <b>%）</b>
        <el-switch
          v-model="isEnabled"
          active-color="#409EFF"
          inactive-color="#ccc"
          :width="35"
          :disabled="modelCount > 0 || modelFlag === 2"
          inactive-text="启用"
          @change="handleEnabledChange"
        />
      </el-col>
    </el-row>
    <el-table ref="qualitativeTable" :data="qualitativeTable" border>
      <el-table-column width="50">
        <template slot-scope="scope">
          <span :class="{blod: scope.row.level === 1 }">{{ scope.row.serialNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指标项" align="left">
        <template slot-scope="scope">
          <span :class="{blod: scope.row.level === 1 }">{{ scope.row.itemName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="满分">
        <template slot-scope="scope">
          <span :class="{blod: scope.row.level === 1 }" class="bold">{{ +scope.row.maxScore }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(item,index) in qualitativeThs" :key="item">
        <template #header>
          {{ item }}
          <span class="plz-input">(请输入)</span>
        </template>
        <template slot-scope="scope">
          <number-input
            v-if="scope.row.level !== 1 && modelCount <= 0"
            v-model.trim="scope.row.scores[index]"
            :controls="false"
            :min-value="0"
            :max-value="100"
            :max-decimal="2"
            size="mini"
            @focus="() => handleInputFocus(scope.row.scores[index])"
            @change="val => handleInputChange(val, scope.row, index)"
          />
          <template v-else-if="scope.row.level === 1" />
          <span v-else>{{ scope.row.scores[index] || '' }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { generateTree } from 'utils'
export default {
  components: {},
  props: {
    tableData: {
      type: Object,
      default: null
    },
    statusData: {
      type: Object,
      default: null
    },
    modelCount: {
      type: Number,
      default: 0
    },
    modelFlag: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      ratio: '',
      isEnabled: false,
      qualitativeTable: [],
      qualitativeThs: [],
      oldScore: 0, // 表格输入框输入之前记录值，以便输入不合法回退
      metaId: null // 顶部占比和状态数据项Id
    }
  },
  watch: {
    tableData(arr) {
      if (!Array.isArray(arr) || !arr.length) return
      const trees = generateTree(arr, '0', 'id', 'parentId')
      this.displayTableData(trees)
    },
    statusData(arr) {
      if (!Array.isArray(arr) || !arr.length) return
      this.setStatus(arr)
    }
  },
  methods: {
    // 展示定性表格数据
    displayTableData(data) {
      const tempArr = []
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
      this.qualitativeTable = tempArr
      this.$emit('input', this.qualitativeTable)
      this.$nextTick(() => {
        data.forEach(item => {
          this.recalculateRootScore(item.id)
        })
      })
    },
    setStatus(data) {
      if (Array.isArray(data) && data.length) {
        data.forEach(item => {
          if (item.quotaName === 'CHANGEABLE') {
            this.metaId = item.id
            this.ratio = item.quotaRate
            this.isEnabled = item.quotaValidFlag == 1
            this.handleEnabledChange(this.isEnabled)
          }
        })
      }
    },
    handleInputFocus(score) {
      this.oldScore = score
    },
    handleInputChange(val, row, index) {
      const scores = row.scores
      if (val == null || val === '') {
        this.$nextTick(() => {
          this.$set(scores, index, this.oldScore)
        })
        return
      }
      if (index < scores.length - 1 && +val <= +scores[index + 1]) {
        // 左边 < 右边，还原修改之前的值
        this.$nextTick(() => {
          this.$set(scores, index, this.oldScore)
          // scores[index] = this.oldScore
          this.$showToast('请保证分值左边>右边')
        })
      } else if (index === 0) {
        // 修改满分为第一项的值并重新计算一级指标分值，判断一级指标总分是否大于100
        this.$nextTick(() => {
          row.maxScore = val
          // 重新计算一级指标分值
          this.recalculateRootScore(row.parentId)
          this.$nextTick(() => {
            this.validateScoreSum()
          })
        })
      } else if (+val >= +scores[index - 1]) {
        this.$nextTick(() => {
          this.$set(scores, index, scores[index - 1] - 1)
          // scores[index] = scores[index - 1] - 1
        })
      }
    },
    handleRatioChange(val) {
      this.ratio = Number.isInteger(val) ? val : (+val).toFixed(2)
      this.$emit('ratio-change', {
        field: 'qualitative',
        value: this.ratio
      })
    },
    // 切换是否启用
    handleEnabledChange(val) {
      this.$emit('update:modelFlag', !val ? 1 : 0)
    },
    recalculateRootScore(id) {
      const rootItem = this.qualitativeTable.filter(item => item.id === id)[0]
      const childrenItems = this.qualitativeTable.filter(item => item.parentId === id)
      if (!rootItem) return
      rootItem.maxScore = childrenItems.reduce((prev, current) => {
        return prev + +current.maxScore
      }, 0)
    },
    validateData() {
      let ret = this.validateScoreSum()
      if (!ret) return
      // 校验子项数据填写是否非法（右边的数据不能大于左边）
      ret = this.validateSubItem()
      if (!ret) return
      // 返回格式化数据，保存使用
      return this.formatRequestData()
    },
    // 计算满分
    validateScoreSum() {
      const ret = this.qualitativeTable.reduce((prev, cur) => {
        return cur.level === 1 ? prev + +cur.maxScore : prev
      }, 0)
      if (ret > 100) {
        this.$showToast('当前定性指标分数超过100分，请保证分值填写合理')
        return false
      } else if (ret < 100) {
        this.$showToast('当前定性指标分数小于100分，请保证分值填写合理')
        return false
      }
      return true
    },
    validateSubItem() {
      const subItem = this.qualitativeTable.filter(item => item.level !== 1)
      const res = subItem.every(item => {
        if (Array.isArray(item.scores) && item.scores.length) {
          return item.scores.every((score, index) => {
            if (index === 0) {
              if (+score === +item.maxScore) {
                return true
              }
              return false
            } else if (+score < +item.scores[index - 1]) {
              return true
            } else {
              return false
            }
          })
        } else {
          return true
        }
      })
      if (!res) {
        this.$showToast('定性指标数据填写有误，请检查！')
        return false
      }
      return true
    },
    formatRequestData() {
      // const data = this.qualitativeTable.filter(item => item.level !== 1)
      const items = ['id', 'itemName', 'itemOrder', 'itemType', 'level', 'maxScore', 'parentId', 'threeName']
      const tempArr = this.qualitativeTable.map(item => {
        const tempObj = {}
        items.forEach(key => {
          tempObj[key] = item[key]
          tempObj.modelId = this.$route.query.id
          if (item.level !== 1) {
            tempObj.maxScore = item.scores.join(',')
          }
        })
        return tempObj
      })
      return {
        tableData: tempArr,
        metaData: {
          id: this.metaId,
          quotaName: 'CHANGEABLE',
          quotaRate: this.ratio,
          quotaValidFlag: this.isEnabled ? 1 : 2
        }
      }
    }
    // handleStatusChange(val) {
    //   this.$emit('status-change', {
    //     id: this.metaId,
    //     type: 'CHANGEABLE',
    //     value: val
    //   })
    // }
  }
}
</script>

<style lang='scss'>
</style>
