<template>
  <div class="el-transfer" style="display: flex;align-items: center">
    <transfer-panel
      ref="leftPanel"
      v-bind="$props"
      :data="sourceData"
      :title="title"
      :default-checked="leftDefaultChecked"
      :placeholder="filterPlaceholder"
      @checked-change="onSourceCheckedChange"
    >
      <slot name="left-footer" />
    </transfer-panel>
    <div class="el-transfer__buttons">
      <el-button
        style="margin-bottom: 0"
        size="mini"
        type="primary"
        :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        :disabled="rightChecked.length === 0"
        @click.native="addToLeft"
      >
        <i class="el-icon-arrow-left" />
        <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
      </el-button>
      <el-button
        type="primary"
        size="mini"
        :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        :disabled="leftChecked.length === 0"
        @click.native="addToRight"
      >
        <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
        <i class="el-icon-arrow-right" />
      </el-button>
    </div>
    <el-table
      ref="tableDom"
      v-el-height-adaptive-table="{
        bottomOffset: 50
      }"
      :data="tableData"
      style="align-self: flex-start"
      border
      stripe
      highlight-current-row
      @selection-change="onTargetCheckedChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        prop="dataContent"
        label="资料名称"
        align="left"
      />
      <el-table-column v-if="from === 'projectModule'" label="立项必传" width="100">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.approvalFlag"
            active-value="1"
            inactive-value="0"
            size="mini"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="from === 'projectModule'" label="尽调必传" width="100">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.responsibleFlag"
            active-value="1"
            inactive-value="0"
            size="mini"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="from !== 'projectModule'" label="是否必传" width="100">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.isNecessary"
            active-value="1"
            inactive-value="0"
            size="mini"
          />
        </template>
      </el-table-column>
      <el-table-column label="排序" width="50">
        <template>
          <i class="iconfont icon-sort sortable-drag" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import TransferPanel from './transfer-panel.vue'
import Sortable from 'sortablejs'
export default {
  name: 'ElTransfer',

  components: {
    TransferPanel
  },

  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    from: {
      type: String,
      default: 'custModule'
    },
    title: {
      type: String,
      default: ''
    },
    buttonTexts: {
      type: Array,
      default() {
        return []
      }
    },
    filterPlaceholder: {
      type: String,
      default: ''
    },
    filterMethod: Function,
    leftDefaultChecked: {
      type: Array,
      default() {
        return []
      }
    },
    rightDefaultChecked: {
      type: Array,
      default() {
        return []
      }
    },
    renderContent: Function,
    value: {
      type: Array,
      default() {
        return []
      }
    },
    format: {
      type: Object,
      default() {
        return {}
      }
    },
    filterable: Boolean,
    props: {
      type: Object,
      default() {
        return {
          label: 'dataContent',
          key: 'enclosureId',
          disabled: 'disabled'
        }
      }
    },
    targetOrder: {
      type: String,
      default: 'original'
    }
  },

  data() {
    return {
      leftChecked: [],
      rightChecked: [],
      tableData: []
    }
  },
  computed: {
    dataObj() {
      const key = this.props.key
      return this.data.reduce((o, cur) => (o[cur[key]] = cur) && o, {})
    },

    sourceData() {
      return this.data.filter(item => this.value.indexOf(item[this.props.key]) === -1)
    },

    // targetData() {
    //   if (this.targetOrder === 'original') {
    //     return this.data.filter(item => this.value.indexOf(item[this.props.key]) > -1)
    //   } else {
    //     return this.value.reduce((arr, cur) => {
    //       const val = this.dataObj[cur]
    //       if (val) {
    //         arr.push(val)
    //       }
    //       return arr
    //     }, [])
    //   }
    // },

    hasButtonTexts() {
      return this.buttonTexts.length === 2
    }
  },
  // watch: {
  //   targetData(arr) {
  //     this.tableData = arr
  //   }
  // },
  mounted() {
    this.initSort()
  },
  destroyed() {
    this.sortable && this.sortable.destroy()
  },
  methods: {

    onSourceCheckedChange(val, movedKeys) {
      this.leftChecked = val
      if (movedKeys === undefined) return
      this.$emit('left-check-change', val, movedKeys)
    },

    onTargetCheckedChange(val, movedKeys) {
      this.rightChecked = val
      if (movedKeys === undefined) return
      this.$emit('right-check-change', val, movedKeys)
    },

    addToLeft() {
      const currentValue = this.value.slice()
      const key = this.props.key
      this.rightChecked.forEach(item => {
        const index = currentValue.indexOf(item[key])
        if (index > -1) {
          currentValue.splice(index, 1)
          this.tableData.splice(index, 1)
        }
      })

      this.$emit('input', currentValue)
      this.$emit('change', this.targetData, 'left', this.rightChecked)
    },

    addToRight() {
      let currentValue = this.value.slice()
      const itemsToBeMoved = []
      const key = this.props.key
      this.data.forEach(item => {
        const itemKey = item[key]
        if (
          this.leftChecked.indexOf(itemKey) > -1 &&
            this.value.indexOf(itemKey) === -1
        ) {
          itemsToBeMoved.push(itemKey)
          this.tableData.push(item)
        }
      })
      currentValue = this.targetOrder === 'unshift'
        ? itemsToBeMoved.concat(currentValue)
        : currentValue.concat(itemsToBeMoved)
      this.$emit('input', currentValue)
      this.$emit('change', currentValue, 'right', this.leftChecked)
    },

    clearQuery(which) {
      if (which === 'left') {
        this.$refs.leftPanel.query = ''
      } else if (which === 'right') {
        this.$refs.rightPanel.query = ''
      }
    },

    initSort() {
      const el = this.$refs.tableDom.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable && this.sortable.destroy()
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        handle: '.sortable-drag',
        onEnd: ({ oldIndex, newIndex }) => {
          if (oldIndex === newIndex) return
          const tableData = this.tableData
          const targetRow = tableData.splice(oldIndex, 1)[0]
          tableData.splice(newIndex, 0, targetRow)
          this.tableData = []
          this.$nextTick(() => {
            this.tableData = tableData
          })
        }
      })
    },

    getTableData() {
      return this.tableData
    },

    setTableData(data = []) {
      this.tableData = data
      this.$emit('input', data.map(item => item.enclosureId))
    }
  }
}
</script>
<style lang="scss" scoped>
  .sortable-ghost {
    opacity: 1;
    color: #FFFFFF!important;
    background: #EAF1FB!important;
  }
</style>
