<template>
  <el-dialog
    title="评级结果设置"
    width="900px"
    :modal-append-to-body="false"
    :visible.sync="dialogVisible"
    @closed="handleDialogClosed"
  >
    <div class="action-rating-results">
      <el-table v-loading="showLoading" :data="tableData" border style="width: 100%">
        <el-table-column width="200" :render-header="renderHeader" label="得分区间" prop="maxScore">
          <template slot-scope="scope">
            <el-row type="flex" align="middle">
              <el-col :span="11">
                <el-input v-model="scope.row.maxScore" size="mini" disabled />
              </el-col>
              <el-col :span="2">-</el-col>
              <el-col :span="11">
                <el-input-number
                  v-model="scope.row.minScore"
                  size="mini"
                  width="100"
                  :controls="false"
                  :min="0"
                  :max="scope.row.maxScore - 1"
                  @change="handleChange(scope.row,scope.$index)"
                />
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column width="120" :render-header="renderHeader" label="评定等级">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.evaluateLevel" size="mini" />
          </template>
        </el-table-column>
        <el-table-column width="120" :render-header="renderHeader" label="信用提示">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.creditPrompt" size="mini" />
          </template>
        </el-table-column>
        <el-table-column min-width="280" :render-header="renderHeader" label="评定等级说明">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.evaluateExplain" size="mini" />
          </template>
        </el-table-column>
        <el-table-column width="80" class-name="operation">
          <template slot-scope="scope">
            <el-button
              type="text"
              :disabled="delBtnDisabled"
              icon="el-icon-remove-outline"
              @click="handleDeleteClick(scope.row,scope.$index)"
            />
            <el-button
              type="text"
              :disabled="addBtnDisabled"
              icon="el-icon-circle-plus-outline"
              @click="handleAddClick(scope.row,scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="tips">说明：评级结果设置针对所有评级模型，修改后对客户已有的评级结果不产生变化。</div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  ratingResultList,
  ratingResultDeleteById,
  ratingResultUpdate
} from 'api/customer-module/api-rating-model-mng.js'
import { log } from 'util'
export default {
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      showLoading: true,
      delIsDisable: false,
      waitDeleteIds: []
    }
  },
  computed: {
    addBtnDisabled() {
      return this.tableData.length === 11
    },
    delBtnDisabled() {
      return this.tableData.length === 5
    }
  },
  created() {
    this.getTableData()
  },
  mounted() {
    this.dialogVisible = true
  },
  methods: {
    getTableData() {
      ratingResultList()
        .then(res => {
          if (res.data && Array.isArray(res.data.records)) {
            this.tableData = res.data.records.sort((a, b) => b.maxScore - a.maxScore)
            this.sysVersion = res.data.records[0].sysVersion
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.showLoading = false
        })
    },
    handleChange(rowData, index) {
      const len = this.tableData.length
      if (index !== len - 1) {
        this.tableData[index + 1].maxScore = rowData.minScore ? rowData.minScore : rowData.minScore
      }
    },
    handleDeleteClick(rowData, index) {
      rowData.id && this.waitDeleteIds.push(rowData.id)
      // const len = this.tableData.length
      // if (index === len - 1) {
      //   this.tableData[index - 1].minScore = 0
      // } else {
      //   this.tableData[index + 1].maxScore = rowData.maxScore
      // }
      this.tableData.splice(index, 1)
    },
    handleAddClick(rowData, index) {
      if (rowData.minScore == 0) {
        this.$showToast('当前最小值为0，不允许新增！')
        return
      }
      this.tableData.splice(index + 1, 0, {
        creditPrompt: '',
        evaluateExplain: '',
        evaluateLevel: '',
        maxScore: rowData.minScore - 1,
        minScore: rowData.minScore - 2
      })
      // this.tableData[index + 2].maxScore = rowData.minScore - 3
    },
    handleDialogConfirm() {
      const params = this.tableData.map((item, i) => {
        const minScore = item.minScore
        return {
          id: item.id || '',
          creditPrompt: item.creditPrompt,
          evaluateExplain: item.evaluateExplain,
          evaluateLevel: item.evaluateLevel || '',
          maxScore: item.maxScore,
          minScore: !minScore && minScore != 0 ? '' : minScore,
          modelId: item.modelId || '0',
          resultFlag: item.resultFlag || 'MODEL_RESULT',
          itemOrder: i + 1
        }
      })
      const ret = this.validateData(params)
      if (!ret) return
      const reqs = [ratingResultUpdate(params, { showLoading: true })]
      if (this.waitDeleteIds.length) {
        reqs.push(
          ratingResultDeleteById({
            ids: this.waitDeleteIds
          })
        )
      }
      Promise.all(reqs)
        .then(res => {
          this.$showToast('设置成功！', 'success')
          this.dialogVisible = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    // validateData(data) {
    //   for (let i = 0; i < data.length; i++) {
    //     debugger
    //     const item = data[i]
    //     const jugde1 = item.maxScore <= item.minScore
    //     const jugde2 = i < data.length - 1 && item.minScore < data[i + 1].maxScore
    //     if (item.minScore === '') {
    //       return this.$showToast('得分区间存在未填项！', 'warning')
    //     }
    //     if (item.evaluateLevel === '') {
    //       return this.$showToast('评定等级存在未填项！', 'warning')
    //     }
    //     if (item.creditPrompt === '') {
    //       return this.$showToast('信用提示存在未填项！', 'warning')
    //     }
    //     if (item.evaluateExplain === '') {
    //       return this.$showToast('评定等级说明存在未填项！', 'warning')
    //     }
    //     if (jugde1 || jugde2) {
    //       return this.$showToast('得分区间存在重叠！', 'warning')
    //     }
    //     if (i === data.length - 1 && +item.minScore !== 0) {
    //       return this.$showToast('评级结果最小值应该为0', 'warning')
    //     }
    //   }
    //   return true
    // },
    validateData(data) {
      if(data[data.length - 1].minScore != 0) {
        this.$showToast('评级结果最小值应该为0！', 'warning')
        return false
      }
      return data.every((item, index, arr) => {
        if(item.maxScore <= item.minScore || (index < arr.length - 1 && item.minScore < arr[index + 1].maxScore)) {
          this.$showToast('得分区间存在重叠！', 'warning')
          return false
        } 
        if (item.minScore === '') {
          this.$showToast('得分区间存在未填项！', 'warning')
          return false
        }
        if (item.evaluateLevel === '') {
          this.$showToast('评定等级存在未填项！', 'warning')
          return false
        }
        if (item.creditPrompt === '') {
          this.$showToast('信用提示存在未填项！', 'warning')
          return false
        }
        if (item.evaluateExplain === '') {
          this.$showToast('评定等级说明存在未填项！', 'warning')
          return false
        }
        return true
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    },
    renderHeader(h, { column }) {
      return (
        <span>
          <b style="color:#f56c6c">*</b> {column.label}
        </span>
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.action-rating-results {
  min-height: 500px;
  & /deep/ .el-table {
    .el-input-number--mini {
      width: 80px;
    }
    .operation {
      .el-button {
        margin-top: 3px;
        padding-top: 0;
        padding-bottom: 0;
        font-size: 18px !important;
      }
    }
  }
  .tips {
    margin-top: 15px;
  }
}
</style>
