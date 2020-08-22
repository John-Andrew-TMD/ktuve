<template>
  <el-dialog
    title="定性参数设置"
    :modal-append-to-body="false"
    :visible.sync="dialogVisible"
    @closed="handleDialogClosed"
  >
    <el-tabs v-model="activeName" class="action-param-wrap">
      <el-tab-pane label="定性指标设置" name="tab1">
        <div v-for="(item, index) in qualitativeIndex" :key="index" class="quota-list">
          <el-row class="quota-item-header" :gutter="20" type="flex" align="middle">
            <el-col :span="6">
              <div v-if="!item.canEdit" class="text">{{ item.itemName }}</div>
              <el-input v-else v-model.trim="item.itemName" size="mini" />
            </el-col>
            <el-col :span="18" class="text-right">
              <el-button
                v-if="qualitativeIndex.length > 3"
                type="danger"
                size="mini"
                @click="handleCategoryDelete(item, index)"
              >删除</el-button>
              <el-button
                v-if="!item.canEdit"
                type="primary"
                size="mini"
                @click="handleCategoryEdit(item, index)"
              >编辑</el-button>
              <el-button
                v-else
                type="primary"
                size="mini"
                @click="handleCategorySave(item, index)"
              >保存</el-button>
            </el-col>
          </el-row>
          <el-row class="quota-item-body" type="flex" :gutter="20">
            <el-col v-for="(child, childIndex) in item.children" :key="childIndex" :span="6">
              <div v-if="!item.canEdit" class="text">{{ child.itemName }}</div>
              <el-input v-else v-model.trim="child.itemName" size="mini" />
            </el-col>
            <el-col v-if="item.canEdit" :span="6">
              <el-button type="text" icon="el-icon-plus" @click="handleQuotaAdd(item, index)" />
              <el-button
                type="text"
                icon="el-icon-minus"
                :disabled="item.children.length === 1"
                @click="handleQuotaDel(item,index)"
              />
            </el-col>
          </el-row>
        </div>
        <el-button type="primary" size="mini" @click="handleCategoryAdd">添加分类</el-button>
      </el-tab-pane>
      <el-tab-pane label="定性等级设置" name="tab2">
        <div v-for="(item, index) in qualitativeGrade" :key="index" class="grade-list">
          <el-input v-model="item.itemName" size="mini" />
        </div>
        <div class="grade-list">
          <el-button
            type="text"
            icon="el-icon-plus"
            :disabled="qualitativeGrade.length >= 5"
            @click="handleGradeAdd"
          />
          <el-button
            type="text"
            icon="el-icon-minus"
            :disabled="qualitativeGrade.length <= 3"
            @click="handleGradeDel"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { generateTree, deepAssign, isEmptyObj } from 'utils'
export default {
  props: {
    tableData: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      dialogVisible: false,
      activeName: 'tab1',
      qualitativeIndex: [],
      qualitativeGrade: [],
      indexDeletedIds: []
    }
  },
  mounted() {
    this.dialogVisible = true
    this.initUI()
  },
  methods: {
    initUI() {
      if (!this.tableData.length) return
      const trees = generateTree(this.tableData, '0', 'id', 'parentId')
      // console.log(trees)
      this.qualitativeIndex = trees.map(item => {
        return {
          id: item.id,
          itemOrder: item.itemOrder,
          itemName: item.itemName,
          canEdit: false,
          children:
            (Array.isArray(item.children) &&
              item.children.map(child => {
                return {
                  id: child.id,
                  scores: child.scores,
                  itemOrder: child.itemOrder,
                  itemName: child.itemName,
                  canEdit: false
                }
              })) ||
            []
        }
      })
      try {
        this.qualitativeGrade = trees[0].children[0].threeName.split(',').map((item, index) => {
          return {
            itemName: item
          }
        })
      } catch (err) {
        this.$showToast('定性等级数据错误！')
        console.log(err)
      }
    },
    handleGradeAdd() {
      this.qualitativeGrade.push({
        itemName: ''
      })
    },
    handleGradeDel() {
      this.qualitativeGrade.pop()
    },
    // 添加分类
    handleCategoryAdd() {
      // 检查一级指标是否重复
      let ret = this.checkRepeat(this.qualitativeIndex)
      if (ret) {
        return this.$showToast('定性指标一级标题存在重复项！', 'warning')
      }
      // 检查一级指标和二级指标是否为空&二级指标是否重复
      ret = this.qualitativeIndex.every(item => this.validateInitem(item))
      if (!ret) return
      this.qualitativeIndex.push({
        id: '',
        itemName: '',
        canEdit: true,
        level: 1,
        maxScore: 0,
        children: [{ id: '', itemName: '', canEdit: true, level: 2 }]
      })
    },
    // 删除分类
    handleCategoryDelete(item, index) {
      let deletedItem = this.qualitativeIndex.splice(index, 1)
      deletedItem = deletedItem[0]
      // 删除大类则记录大类id及子类id
      if (!isEmptyObj(deletedItem) && deletedItem.id !== '') {
        this.indexDeletedIds.push(deletedItem.id)
        if (Array.isArray(deletedItem.children)) {
          deletedItem.children.forEach(item => {
            item.id !== '' && this.indexDeletedIds.push(item.id)
          })
        }
      }
    },
    // 编辑分类
    handleCategoryEdit(item, index) {
      item.canEdit = true
    },
    // 保存分类
    handleCategorySave(item) {
      const ret = this.validateInitem(item)
      if (ret) {
        item.canEdit = false
      }
    },
    validateInitem(data) {
      if (data.itemName) {
        const ret = data.children.some(child => child.itemName === '')
        if (ret) {
          this.$showToast('定性指标存在未填项！', 'warning')
          return false
        }
        if (this.checkRepeat(data.children)) {
          this.$showToast('定性指标二级标题存在重复项！', 'warning')
          return false
        }
        return true
      }
      this.$showToast('定性指标存在未填项！', 'warning')
      return false
    },
    handleQuotaAdd(item, index) {
      item.children.push({ id: '', itemName: '', level: 2 })
    },
    handleQuotaDel(item, index) {
      const deletedItem = item.children.pop()
      if (deletedItem.id !== '') {
        this.indexDeletedIds.push(deletedItem.id)
      }
    },
    checkRepeat(arr) {
      if (Array.isArray(arr) && !arr.length) return false
      return new Set(arr.map(item => item.itemName)).size !== arr.length
    },
    handleDialogConfirm() {
      // 检查一级指标是否重复
      let ret = this.checkRepeat(this.qualitativeIndex)
      if (ret) {
        return this.$showToast('定性指标一级标题存在重复项！', 'warning')
      }
      // 检查一级指标和二级指标是否存在空值&二级指标是否重复
      ret = this.qualitativeIndex.every(item => this.validateInitem(item))
      if (!ret) return
      // 检查定性等级是否重复
      ret = this.checkRepeat(this.qualitativeGrade)
      if (ret) {
        return this.$showToast('定性等级存在重复项！', 'warning')
      }
      // 检查定性等级是否存在空值
      ret = this.qualitativeGrade.some(item => item.itemName === '')
      if (ret) {
        return this.$showToast('定性等级存在未填项！', 'warning')
      }
      this.mergeTableData()
    },
    mergeTableData() {
      // 过滤删除的指标和等级
      const newTableData = this.tableData.filter(item => {
        return !this.indexDeletedIds.includes(item.id)
      })
      let tableDataTrees = generateTree(newTableData, '0', 'id', 'parentId')
      const qualitativeIndexCopy = deepAssign([], this.qualitativeIndex)
      qualitativeIndexCopy.forEach((item, index) => {
        if (item.id === '') {
          item.id = this.uuid()
          item.maxScore = 0
          item.itemOrder = index === 0 ? 1 : qualitativeIndexCopy[index - 1].itemOrder + 1
          item.itemType = 2
          item.parentId = '0'
          item.modelId = this.$route.query.id
        }
        if (Array.isArray(item.children)) {
          item.children.forEach((child, childIndex) => {
            child.threeName = this.qualitativeGrade.map(item => item.itemName).join(',')
            if (child.id === '') {
              child.id = this.uuid()
              child.itemOrder = childIndex === 0 ? 1 : item.children[childIndex - 1].itemOrder + 1
              child.itemType = 2
              child.parentId = item.id
              child.modelId = this.$route.query.id
              child.scores = Array.from({ length: this.qualitativeGrade.length }, () => 0)
            } else {
              if (child.scores.length > this.qualitativeGrade.length) {
                child.scores.slice(0, this.qualitativeGrade.length)
              } else if (child.scores.length < this.qualitativeGrade.length) {
                child.scores.push(...Array.from({ length: this.qualitativeGrade.length - child.scores.length }, () => 0))
              }
            }
          })
        }
      })
      tableDataTrees = deepAssign(tableDataTrees, qualitativeIndexCopy)
      this.$emit('dialog-confirm', tableDataTrees)
      this.dialogVisible = false
    },
    flatArray(data) {
      const tempArr = []
      while (data.length) {
        const node = data.shift()
        if (Array.isArray(node.children) && node.children.length) {
          tempArr.push(...node.children)
        }
        delete node.children
        tempArr.push(node)
      }
      return tempArr
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    },
    uuid() {
      return +new Date() + '' + parseInt(Math.random() * 1000000)
    }
  }
}
</script>
<style lang="scss" scoped>
.action-param-wrap {
  .quota-list {
    padding-bottom: 20px;
    .quota-item-header {
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 1px solid #E4E4E4;
    }
    .quota-item-body {
      flex-wrap: wrap;
      .el-col {
        padding-bottom: 10px;
      }
    }
    .el-input {
      font-size: 14px;
    }
    .text {
      line-height: 28px;
    }
  }
  .quota-item-body, .grade-list {
    .el-button {
      margin-top: 5px;
      padding-top: 0;
      padding-bottom: 0;
      font-size: 16px;
    }
  }
  .grade-list {
    width: 25%;
    margin-bottom: 10px;
    padding-right: 20px;
  }
  .el-tab-pane {
    min-height: 412px;
  }
}

</style>
