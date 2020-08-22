<template>
  <div class="tools-list">
    <el-popover
      ref="tableColumnDom"
      placement="top"
      transition="el-zoom-in-bottom"
      popper-class="table-column-popover"
      trigger="click"
    >
      <h4>列显示/隐藏</h4>
      <el-tree
        ref="treeDom"
        :data="columnsDataClone"
        show-checkbox
        default-expand-all
        draggable
        node-key="id"
        :allow-drop="handleTreeItemDrop"
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :props="defaultProps"
        :default-checked-keys="defaultCheckedKeys"
        @node-drag-over="handleDragOver"
        @node-drag-start="handleDragStart"
        @node-drop="handleDragComplete"
        @check="handleTreeCheck"
      />
      <i slot="reference" class="iconfont icon-table-show" title="表头设置" />
    </el-popover>
    <el-popover
      v-model="exportPopoverVisible"
      placement="top"
      transition="el-zoom-in-bottom"
      width="220"
      popper-class="table-export-popover"
      @hide="handleExportPopoverHide"
    >
      <h4>导出Excel</h4>
      <div>
        <el-radio-group v-model="exportSelect">
          <el-radio label="0">导出全部</el-radio>
          <el-radio label="1">导出当前页</el-radio>
          <el-radio label="2">
            导出从
            <number-input
              v-model.number="pageStart"
              size="mini"
              :max-decimal="0"
              text-direction="center"
              @focus="handleInputFocus"
              @blur="handleInputBlur"
            />-
            <number-input
              v-model.number="pageEnd"
              size="mini"
              :max-decimal="0"
              text-direction="center"
              @focus="handleInputFocus"
              @blur="handleInputBlur"
            />页
          </el-radio>
        </el-radio-group>
      </div>
      <div class="table-export-footer">
        <el-button type="text" size="mini" @click="exportPopoverVisible = false">取消</el-button>
        <el-button type="text" size="mini" @click="handleExportConfirm">确定</el-button>
      </div>
      <i slot="reference" class="iconfont icon-export" title="导出" />
    </el-popover>
    <i class="iconfont icon-refresh" title="刷新" @click="handleRefreshClick" />
  </div>
</template>

<script>
import { deepAssign, isEmptyObj } from 'utils'
import { exportJson2Excel } from '../js/export-excel.js'
import { requestPost } from 'utils/fetch.js'
let checkedKeys = [] // 用于记录拖拽前选中的节点，ree组件有拖拽时取消选中的BUG，官方目前没解决
export default {
  components: {},
  props: {
    columnsData: {
      type: Array,
      default: () => []
    },
    requestData: {
      type: Object,
      default: () => {}
    },
    currentPage: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 0
    },
    tableOptions: {
      type: Object,
      default: () => {}
    },
    ignoreColumns: {
      type: Array,
      default: () => []
    },
    mergerColumns: {
      type: Array,
      default: () => []
    },
    showSummary: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      exportPopoverVisible: false,
      exportSelect: '0',
      pageStart: '',
      pageEnd: '',
      columnsDataClone: [],
      defaultCheckedKeys: [],
      defaultProps: {
        label: (data, row) => {
          return data.attrs.label
        },
        children: 'children'
      }
    }
  },
  watch: {
    columnsDataClone: {
      handler(val) {
        if (!val) return
        this.$nextTick(() => {
          this.$emit('updateColumns', val)
        })
      },
      deep: true
    }
  },
  created() {
    this.initTableHeadStatus()
  },
  methods: {
    handleExportConfirm() {
      // if (!this.tableOptions.requestParams.code) {
      //   return this.$showToast('请求参数错误!')
      // }
      this.exportPopoverVisible = false
      // 表格被动传值则直接导出
      if (!this.tableOptions.requestImmediate || this.exportSelect === '1') {
        const mergeData = this.getMergeData(this.$parent.tableData)
        let newData = this.$parent.tableData
        if (mergeData) {
          newData = this.$parent.tableData.concat([mergeData])
        }
        exportJson2Excel(newData, this.columnsDataClone, this.tableOptions)
        return
      }
      let pageCurrent = this.currentPage
      let pageSize = this.pageSize
      if (this.exportSelect === '0') {
        pageCurrent = 1
        pageSize = 10000
      } else if (this.exportSelect === '2') {
        pageCurrent = this.pageStart || 1
        pageSize = ((this.pageEnd || 1) - (this.pageStart || 0)) * this.pageSize
      }
      const url = this.tableOptions.requestParams.url
      const ext = this.tableOptions.requestParams.ext
      let params = {
        ...this.requestData,
        pageSize,
        pageCurrent
      }
      if (url.endsWith('/page')) {
        params = {
          dto: {
            ...this.requestData
          },
          ...!isEmptyObj(ext) && ext || {},
          pageSize,
          pageCurrent
        }
      }
      requestPost(url, params)
        .then(res => {
          const data = res.data && res.data.records || []
          if (!data.length) return this.$showToast('数据为空,无法导出!')
          const mergeData = this.getMergeData(data)
          let newData = data
          if (mergeData) {
            newData = data.concat([mergeData])
          }
          exportJson2Excel(newData, this.columnsDataClone, this.tableOptions, [], [], true)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getMergeData(data) {
      if (!this.showSummary) return
      const { showSerialNumber } = this.tableOptions
      const checkedNodes = this.$refs.treeDom.getCheckedNodes(false, true)
      const newData = {}
      checkedNodes.forEach((item, index) => {
        if (showSerialNumber) {
          newData.serial_number = '合计'
        } else if (index === 0) {
          newData[item.id] = '合计'
          return
        }
        newData[item.id] = 0
      })
      data.forEach(oItem => {
        for (const key in oItem) {
          if (oItem.hasOwnProperty(key)) {
            const element = oItem[key]
            if (+element) {
              if (this.ignoreColumns.length && this.ignoreColumns.includes(key)) {
                newData[key] = 0
                return
              }
              if (!this.mergerColumns.length || (this.mergerColumns.length && this.mergerColumns.includes(key))) {
                newData[key] += parseFloat(element)
              }
            }
          }
        }
      })
      for (const key in newData) {
        if (newData.hasOwnProperty(key)) {
          const t1 = this.ignoreColumns.length && this.ignoreColumns.includes(key)
          const t2 = this.mergerColumns.length && !this.mergerColumns.includes(key)
          if (key !== 'serial_number' && (t1 || t2)) {
            newData[key] = ''
          }
        }
      }
      return newData
    },
    handleRefreshClick() {
      this.$emit('refresh')
    },
    async initTableHeadStatus() {
      const columnsData = this.columnsData
      if (!columnsData.length) return
      this.storageKey = `${this.$route.path}${this.tableOptions.requestParams.url}`
      // const userFavColumns = await this.$lf.getItem(this.storageKey)
      const userFavColumns = null
      // getStore(this.storageKey, true);
      // 无表头状态记录
      if (!userFavColumns) {
        this.defaultCheckedKeys = this.getCheckedNodesId(columnsData)
        this.columnsDataClone = deepAssign([], columnsData)
      } else {
        const originColumnsKeys = this.getColumnId(columnsData)
        const userFavColumnKeys = this.getColumnId(userFavColumns)
        // 新增列
        const addColumns = _.difference(originColumnsKeys, userFavColumnKeys)
        // 从保存的排序对象中删除原始数据中已删除的列
        this.delNodeFromUserFavColsById(originColumnsKeys, userFavColumns)
        addColumns.length && this.addNewNodeIntoUserFavColumns(addColumns, userFavColumns)
        this.defaultCheckedKeys = this.getCheckedNodesId(userFavColumns)
        this.getNewColumnsData(columnsData, userFavColumns)
        this.columnsDataClone = userFavColumns
        this.$nextTick(() => {
          this.saveColumnConfig()
        })
      }
    },
    // 获取结构树中的id
    getColumnId(data) {
      const flatData = this.flatArray(data)
      return flatData.map(item => item.id)
    },
    delNodeFromUserFavColsById(keys, columns) {
      for (let i = 0; i < columns.length; i++) {
        const item = columns[i]
        if (!keys.includes(item.id)) {
          columns.splice(i, 1)
          i--
        } else if (Array.isArray(item.children)) {
          this.delNodeFromUserFavColsById(keys, item.children)
        }
      }
    },
    addNewNodeIntoUserFavColumns(nodeKeys, columns) {
      const flatData = this.flatArray(this.columnsData)
      const nodes = flatData.filter(item => nodeKeys.includes(item.id))

      const levle1Nodes = nodes.filter(item => item.level === 1)
      columns.push(...levle1Nodes)

      const ohterLevelNodes = nodes.filter(item => item.level !== 1).sort((a, b) => a.level - b.level)
      if (!ohterLevelNodes.length) return

      function addNewChildNode(cols, nodes) {
        if (!nodes.length) return
        cols.forEach(item => {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].parent === item.id) {
              item.children = item.children || []
              item.children.push(nodes[i])
              nodes.splice(i, 1)
              i--
              addNewChildNode(item.children, nodes)
            } else if (Array.isArray(item.children)) {
              addNewChildNode(item.children, nodes)
            }
          }
        })
      }
      addNewChildNode(columns, ohterLevelNodes)
    },
    getCheckedNodesId(data) {
      const flatData = this.flatArray(data)
      return flatData.filter(item => item.show && !item.children).map(item => item.id)
    },
    getNewColumnsData(columnsData, userFavColumns) {
      const flatData = this.flatArray(this.columnsData)

      function updateUserFavColumns(columns) {
        if (!flatData.length) return
        columns.forEach(col => {
          for (let i = 0; i < flatData.length; i++) {
            const item = flatData[i]
            if (item.id === col.id) {
              const status = col.show
              col.attrs = item.attrs
              col.show = status
              item.filter && (col.filter = item.filter)
              item.slot && (col.slot = item.slot)
              break
            }
          }
          if (Array.isArray(col.children)) {
            updateUserFavColumns(col.children)
          }
        })
      }
      updateUserFavColumns(userFavColumns)
    },
    flatArray(data) {
      return data.reduce((prev, cur) => {
        return prev.concat(cur, Array.isArray(cur.children) ? this.flatArray(cur.children) : [])
      }, [])
    },
    handleExportPopoverHide() {
      this.exportSelect = '0'
      this.pageStart = ''
      this.pageEnd = ''
    },
    handleTreeCheck() {
      const treeDom = this.$refs.treeDom
      const checkedNodes = treeDom.getCheckedNodes(false, true)
      checkedNodes.forEach(item => item.show == true)
      const checkedKeys = checkedNodes.map(item => item.id)
      const allKeys = this.flatArray(this.columnsData).map(item => item.id)
      const unCheckedKeys = _.difference(allKeys, checkedKeys)
      unCheckedKeys.forEach(key => {
        treeDom.getNode(key).data.show = false
      })
      checkedKeys.forEach(key => {
        treeDom.getNode(key).data.show = true
      })
      this.$nextTick(() => {
        this.saveColumnConfig()
      })
    },
    handleInputFocus() {
      this.exportSelect = '2'
    },
    handleInputBlur() {
      if (this.pageStart && this.pageEnd && +this.pageStart > +this.pageEnd) {
        [this.pageStart, this.pageEnd] = [this.pageEnd, this.pageStart]
      }
    },
    handleTreeItemDrop(draggingNode, dropNode, type) {
      if (type === 'inner' || draggingNode.parent.id !== dropNode.parent.id) {
        return false
      }
      return true
    },
    handleDragOver(draggingNode, dropNode, event) {
      if (draggingNode.parent.id === dropNode.parent.id) {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.dropEffect = 'move'
      }
    },
    handleDragStart() {
      checkedKeys = this.$refs.treeDom.getCheckedKeys(true)
    },
    handleDragComplete(before, after, inner, event) {
      checkedKeys.length && this.$refs.treeDom.setCheckedKeys(checkedKeys, true)
      checkedKeys.length = 0
      this.saveColumnConfig()
    },
    saveColumnConfig() {
      const checkedNodes = this.$refs.treeDom.getCheckedNodes(false, true)
      const checkedKeys = checkedNodes.map(item => item.id)
      function getConfigData(data) {
        return data.map(item => {
          return {
            id: item.id,
            level: item.level,
            parent: item.parent,
            show: checkedKeys.includes(item.id),
            ...(item.children && { children: getConfigData(item.children) })
          }
        })
      }
      const res = getConfigData(this.columnsDataClone)
      this.$lf.setItem(this.storageKey, res)
      // setStore(this.storageKey, res);
    }
  }
}
</script>

<style lang='scss' scoped>
.tools-list {
  margin-right: 5px;
  user-select: none;
  .iconfont {
    margin-right: 3px;
    cursor: pointer;
    transition: color .3s;
    color: #606266;
    &:hover {
      color: #1890FF;
    }
  }
}
.table-column-popover .el-checkbox, .table-export-popover .el-radio {
  display: block;
  margin: 0 0 8px 0;
  &:last-child {
    margin-bottom: 0;
  }
}
.table-export-popover .el-radio:last-child {
  height: 20px;
}
.table-column-popover h4, .table-export-popover h4 {
  height: 35px;
  margin: -12px -12px 8px -12px;
  padding-left: 12px;
  font-weight: normal;
  line-height: 35px;
  border-bottom: 1px solid #EBEEF5;
}
.table-export-popover .el-input /deep/  {
  width: 40px;
  margin: 0 5px;
  transform: translateY(-7px);
  .el-input__inner {
    height: 24px;
    line-height: 24px;
  }
}
.el-tree /deep/  {
  margin-left: -3px;
  .el-tree-node__expand-icon {
    visibility: hidden;
    padding: 6px 0;
    transform: rotate(0deg);
  }
}

.table-export-popover .table-export-footer {
  height: 35px;
  margin: 8px -12px -12px -12px;
  padding-right: 12px;
  line-height: 30px;
  text-align: right;
  border-top: 1px solid #EBEEF5;
  .el-button:first-child {
    color: #777777;
  }
}

</style>
