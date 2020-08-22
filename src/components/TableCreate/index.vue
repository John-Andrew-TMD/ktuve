<template>
  <div ref="tableContainer" v-loading="showLoading && tableOptions.showLoading" class="tabel-create">
    <el-table
      v-show="columns.length"
      :key="key"
      ref="tableDom"
      v-el-height-adaptive-table="tableBottomOffset"
      border
      stripe
      element-loading-text="正在拼命加载中..."
      highlight-current-row
      v-bind="$attrsAll"
      v-on="$listeners"
    >
      <el-table-column v-if="tableOptions.showCheckbox" type="selection" width="50" />
      <el-table-column
        v-if="tableOptions.showSerialNumber"
        type="index"
        label="序号"
        width="50"
        :fixed="tableOptions.fixedSerialNumber"
      />
      <table-columns v-for="(col, index) in columns" :key="index+100" :item="col">
        <template v-if="col.slot" #[col.attrs.prop]="{scope}">
          <slot :name="col.attrs.prop" :scope="scope" />
        </template>
        <template v-if="col.slotHeader" #[col.slotHeader]="{scope}">
          <slot :name="col.slotHeader" :scope="scope" />
        </template>
      </table-columns>
    </el-table>
    <div v-show="tableOptions.showPagination || tableOptions.showTools" class="el-table-footer">
      <table-tools
        v-show="tableOptions.showTools && tableData.length"
        :columns-data="tableOptions.columns"
        :request-data="requestData"
        :current-page="currentPage"
        :page-size="pageSize"
        :ignore-columns="ignoreColumns"
        :merger-columns="mergerColumns"
        :show-summary="$attrs['show-summary']"
        :table-options="tableOptions"
        @refresh="refreshTable(true)"
        @updateColumns="updateColumns"
      />
      <template v-if="tableOptions.showPagination">
        <el-pagination
          v-show="tableData.length"
          :page-sizes="[10, 20, 50]"
          :current-page="currentPage"
          :page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </template>
    </div>
  </div>
</template>

<script>
import paginationMixin from 'mixins/pagination'
import TableTools from './components/table-tools.vue'
import TableColumns from './components/table-columns.vue'
import { thousandSeparator, deepAssign, isEmptyObj } from 'utils'
import { requestPost } from 'utils/fetch.js'
export default {
  components: {
    TableTools,
    TableColumns
  },
  mixins: [paginationMixin],
  inheritAttrs: false,
  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    // 合计行忽略合计的字段或者列数
    ignoreColumns: {
      type: Array,
      default: () => []
    },
    // 合计行包含合计的字段或者列数
    mergerColumns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableOptions: {
        columns: [],
        showPagination: true, // 是否显示分页
        showTools: false, // 是否显示工具栏
        showCheckbox: false, // 是否显示多选
        showSerialNumber: false, // 是否显示序号
        fixedSerialNumber: false, // 是否固定序号
        requestImmediate: true, // 是否立刻请求
        showLoading: true, // 是否显示Loading
        selectedRow: -1, // 设置选中的行数
        requestParams: {}, // 请求参数
        colspanAttrs: [],
        tableName: ''
      },
      columns: [],
      requestData: null, // 请求参数
      tableData: [],
      spanValues: null,
      showLoading: true,
      tableBottomOffset: 0,
      storageKey: '', // 获取
      key: 0,
      mergeData: []
    }
  },
  computed: {
    $attrsAll() {
      return {
        data: this.tableData,
        ...this.$attrs,
        ...(Array.isArray(this.options.colspanAttrs) &&
          this.options.colspanAttrs.length && {
          'span-method': this.handleTableColspan
        }),
        ...(this.$attrs['show-summary'] && { 'summary-method': this.getSummaries })
      }
    }
  },
  watch: {
    options: {
      handler(obj) {
        if (!obj) return
        const _this = this
        function setAttrs(data, parent, level) {
          data.forEach(item => {
            item.id = item.attrs.prop
            item.level = level
            item.parent = parent
            if (!item.hasOwnProperty('show')) {
              _this.$set(item, 'show', true)
            }
            if (Array.isArray(item.children)) {
              setAttrs(item.children, item.attrs.prop, level + 1)
            }
          })
        }
        setAttrs(obj.columns, '', 1)
      },
      immediate: true
    }
  },
  created() {
    this.tableOptions = Object.assign(this.tableOptions, this.options)
    this.requestData = this.tableOptions.requestParams.data
    // this.requestCode = this.tableOptions.requestParams.code
    this.tableBottomOffset = { bottomOffset: this.tableOptions.tableBottomOffset || 0 }
    // 如果不显示页码
    !this.tableOptions.showPagination && (this.pageSize = 1000)
    if (this.tableOptions.requestImmediate) {
      this.getTableData()
    }
  },
  mounted() {
    this.$emit('input', this.$refs.tableDom)
  },
  methods: {
    // 初始化表格数据
    getTableData(showLoading = true) {
      this.showLoading = showLoading
      const url = this.tableOptions.requestParams.url
      const ext = this.tableOptions.requestParams.ext
      if (url.endsWith('koca')) {
        this.getKocaTableData(url)
        return
      }
      let data = {
        ...this.requestData,
        pageSize: this.pageSize,
        pageCurrent: this.currentPage
      }
      if (url.endsWith('/page')) {
        data = {
          dto: {
            ...this.requestData
          },
          ...!isEmptyObj(ext) && ext || {},
          pageSize: this.pageSize,
          pageCurrent: this.currentPage
        }
      }
      requestPost(url, data)
        .then(res => {
          if (!res.data) {
            this.tableData = []
            this.pageCount = 0
            return
          }
          let records = []
          if (this.tableOptions.dataCallbackFn) {
            records = this.tableOptions.dataCallbackFn(res.data)
          } else if (!Array.isArray(res.data.records) || !res.data.records.length) {
            this.tableData = []
            this.pageCount = 0
            return
          } else {
            records = res.data.records
          }
          this.tableOptions.colspanAttrs.length && this._computeSpanValues(records)
          this.tableData = Object.freeze(records)
          this.pageCount = res.data.total
          // 选中某行
          this.selectRow()
        })
        .catch(err => {
          console.log(err)
        })
        .finally(res => {
          this.showLoading = false
          this.$emit('request-complete', this.tableData)
        })
    },
    getKocaTableData(url) {
      const kocaUrl = url.slice(0, -4)
      const data = {
        ...this.requestData,
        pageSize: this.pageSize,
        pageNum: this.currentPage
      }
      requestPost(kocaUrl, data, {
        needDto: false
      })
        .then(res => {
          if (!res.body || !Array.isArray(res.body.data) || !res.body.data.length) {
            this.tableData = []
            this.pageCount = 0
            return
          }
          this.tableData = Object.freeze(res.body.data)
          this.pageCount = res.body.total
          // 选中某行
          this.selectRow()
        })
        .catch(err => {
          console.log(err)
        })
        .finally(res => {
          this.showLoading = false
          this.$emit('request-complete', this.tableData)
        })
    },
    // 搜索
    searchTableData(params) {
      this.currentPage = 1
      this.requestData = params
      this.getTableData()
    },
    setData(data = []) {
      data.map((item,index)=>{

      })
      this.tableData = Object.freeze(data)
      this.pageCount = this.tableData.length
      this.showLoading = false
      // 选中某行
      this.selectRow()
    },
    setMultipData(data) {
      this.tableData = Object.freeze(data)
      this.pageCount = this.tableData.length
      this.showLoading = false
      // 选中多行
      this.selectMultipleRow(data)
    },
    // 搜索重置
    resetTableData() {
      this.currentPage = 1
      this.requestData = this.options.requestParams.data
      this.getTableData()
    },
    // 表格刷新
    refreshTable(showLoading = false,options={selectedRow:0}) {
      // if (isEmptyObj(this.requestData) && !this.tableOptions.requestImmediate) return
      this.getTableData(showLoading)
      this.tableOptions.selectedRow = options.selectedRow
    },
    // 选中某行
    selectRow() {
      if (+this.tableOptions.selectedRow > -1) {
        this.$nextTick(() => {
          this.$refs.tableDom && this.$refs.tableDom.setCurrentRow(this.tableData[+this.tableOptions.selectedRow])
        })
      }
    },
    // 选中多行
    selectMultipleRow(data) {
      this.$nextTick(() => {
        data.forEach(item => {
          this.$refs.tableDom.toggleRowSelection(item, true)
        })
      })
    },
    // 强制表格重新渲染
    forceRedraw() {
      this.key = this.key + 1
    },
    // 列合并前参数计算
    _computeSpanValues(data) {
      const colspanAttrs = this.tableOptions.colspanAttrs
      const spanValues = {}
      const contactDot = {}
      colspanAttrs.forEach(key => {
        spanValues[key] = []
        contactDot[key] = 0
      })
      const primaryKey = colspanAttrs[0]
      data.forEach((item, index) => {
        if (index === 0) {
          colspanAttrs.forEach(key => {
            spanValues[key].push(1)
          })
        } else {
          colspanAttrs.forEach((key, i) => {
            if (item[key] === data[index - 1][key]) {
              if (key === primaryKey) {
                spanValues[key][contactDot[key]] += 1
                spanValues[key].push(0)
              } else {
                if (spanValues[primaryKey][index] > 0) {
                  spanValues[key].push(1)
                  contactDot[key] = index
                } else {
                  spanValues[key][contactDot[key]] += 1
                  spanValues[key].push(0)
                }
              }
            } else {
              spanValues[key].push(1)
              contactDot[key] = index
            }
          })
        }
      })
      this.spanValues = spanValues
    },
    // 列合并
    handleTableColspan({ row, column, rowIndex, columnIndex }) {
      if (this.tableOptions.colspanAttrs.includes(column.property)) {
        const _row = this.spanValues[column.property][rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 自定义合计方法
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const property = columns[index].property || ''
        if (this.ignoreColumns.includes(property) || this.ignoreColumns.includes(index)) {
          sums[index] = ''
          return
        }
        if (!this.mergerColumns.length || this.mergerColumns.includes(property) || this.mergerColumns.includes(index)) {
          const values = data.map(item => Number(item[column.property]))
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = thousandSeparator(sums[index])
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    updateColumns(data) {
      this.$nextTick(() => {
        this.$refs.tableContainer.style.height =
          this.$refs.tableContainer.clientHeight + 'px'
        // this.key++
        this.$nextTick(() => {
          this.$emit('input', this.$refs.tableDom)
          this.$refs.tableContainer.style.height = 'auto'
        })
      })
      function filterColumns(columns) {
        return columns.filter(item => {
          if (item.show && Array.isArray(item.children)) {
            return (item.children = filterColumns(item.children))
          }
          return item.show
        })
      }
      this.columns = filterColumns(deepAssign([], data))
    }
  }
}
</script>
<style lang="scss">
.tabel-create {
  margin-top: 12px;
}

</style>
