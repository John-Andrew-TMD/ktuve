
<template>
  <div class="table-wrap">
    <el-row class="header">
      <el-col :span="24">
        <span class="title">二、定量指标</span>
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
          :disabled="modelCount > 0 || modelFlag === 1"
          inactive-text="启用"
          @change="handleEnabledChange"
        />
      </el-col>
    </el-row>
    <el-table :data="quantifyTable" border width="100%">
      <el-table-column width="50">
        <template slot-scope="scope">
          <span :class="{blod: scope.row.level === 1}">{{ scope.row.serialNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指标项" width="170px" align="left">
        <template slot-scope="{ row }">
          <span :class="{blod: row.level === 1}">{{ row.itemName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px">
        <template #header>
          满分
          <span class="plz-input">(请输入)</span>
        </template>
        <template slot-scope="scope">
          <number-input
            v-if="scope.row.level !== 1 && modelCount <= 0"
            v-model="scope.row.maxScore"
            :min-value="0"
            :max-value="100"
            :max-decimal="2"
            size="mini"
            @focus="() => handleInputFocus(scope.row.maxScore)"
            @change="val => handleInputChange(scope.row)"
          />
          <template v-else>{{ scope.row.maxScore | filterDigitDecimals }}</template>
        </template>
      </el-table-column>
      <el-table-column width="150px">
        <template #header>
          标准值
          <span class="plz-input">(请输入)</span>
        </template>
        <template slot-scope="scope">
          <number-input
            v-if="scope.row.level !== 1 && modelCount <= 0"
            v-model="scope.row.standardScore"
            :max-decimal="2"
            size="mini"
          />
          <template v-else-if="scope.row.level === 1" />
          <template v-else>{{ scope.row.standardScore }}</template>
        </template>
      </el-table-column>
      <el-table-column width="150px">
        <template #header>
          最小值
          <span class="plz-input">(请输入)</span>
        </template>
        <template slot-scope="scope">
          <number-input
            v-if="scope.row.level !== 1 && modelCount <= 0"
            v-model="scope.row.minScore"
            :max-decimal="2"
            size="mini"
          />
          <template v-else-if="scope.row.level === 1" />
          <template v-else>{{ scope.row.minScore }}</template>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="left">
        <template slot-scope="scope">
          <div v-if="scope.row.level !== 1">≥ 标准值，满分；＜标准值， 得分=满分*（实际值-最小值）/（标准值-最小值）；≤最小值，0分</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { generateTree } from 'utils'
export default {
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
      quantifyTable: [],
      oldScore: 0, // 表格输入框输入之前记录值，以便输入不合法回退
      metaId: null // 顶部占比和状态数据项Id
    }
  },
  watch: {
    tableData(arr) {
      if (!Array.isArray(arr) || !arr.length) return
      this.displayTableData(arr)
    },
    statusData(arr) {
      if (!Array.isArray(arr) || !arr.length) return
      this.setStatus(arr)
    }
  },
  methods: {
    displayTableData(data) {
      const trees = generateTree(data, '0', 'id', 'parentId')
      const tempArr = []
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
      this.quantifyTable = tempArr
    },
    setStatus(data) {
      if (Array.isArray(data) && data.length) {
        data.forEach(item => {
          if (item.quotaName === 'REGULAR') {
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
    handleInputChange(row) {
      // const total = this.getScoreSum()
      // if (total > 100) {
      //   this.$nextTick(() => {
      //     row.maxScore = this.oldScore
      //   })
      //   return this.$showToast('当前分数超过100分，请保证分值填写合理！')
      // }
      const parent = this.quantifyTable.filter(item => item.id === row.parentId)[0]
      this.$nextTick(() => {
        parent.maxScore = this.getScoreSum(row.parentId)
      })
    },
    // 切换是否启用
    handleEnabledChange(val) {
      this.$emit('update:modelFlag', !val ? 2 : 0)
    },
    // 计算满分
    getScoreSum(parentId) {
      let sum = 0
      this.quantifyTable.forEach(item => {
        if (parentId) {
          if (item.parentId === parentId) {
            sum += +item.maxScore
          }
        } else if (item.parentId !== '0') {
          sum += +item.maxScore
        }
      })
      return sum
    },
    validateData() {
      const total = this.getScoreSum()
      if (total > 100) {
        this.$showToast('当前定量分数超过100分，请保证分值填写合理！')
        return false
      } else if (total < 100) {
        this.$showToast('当前定量分数小于100分，请保证分值填写合理！')
        return false
      }
      // 返回格式化数据，保存使用
      return this.formatRequestData()
    },
    formatRequestData() {
      const items = [
        'id',
        'itemName',
        'itemOrder',
        'itemType',
        'level',
        'maxScore',
        'minScore',
        'standardScore',
        'modelId',
        'parentId',
        'threeName'
      ]
      const tempArr = this.quantifyTable.map(item => {
        const tempObj = {}
        items.forEach(key => {
          tempObj[key] = item[key]
          tempObj.modelId = this.$route.query.id
        })
        return tempObj
      })
      return {
        tableData: tempArr,
        metaData: {
          id: this.metaId,
          quotaName: 'REGULAR',
          quotaRate: this.ratio,
          quotaValidFlag: this.isEnabled ? 1 : 2
        }
      }
    },
    handleRatioChange(val) {
      this.ratio = Number.isInteger(val) ? val : (+val).toFixed(2)
      this.$emit('ratio-change', {
        field: 'quantify',
        value: this.ratio
      })
    }
    // handleStatusChange(val) {
    //   this.$emit('status-change', {
    //     id: this.metaId,
    //     type: 'REGULAR',
    //     value: val
    //   })
    // }
  }
}
</script>
<style lang='scss'>
</style>

