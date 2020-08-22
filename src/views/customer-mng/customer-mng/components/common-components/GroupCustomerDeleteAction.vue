<template>
  <table-create
    ref="tableDom"
    :options="tableOptions"
  />
</template>
<script>
import TableCreate from 'components/TableCreate/index'
export default {
  components: {
    TableCreate
  },
  props: {
    tableData: {
      type: Object,
      default: () => ([])
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableOptions: {
        requestParams: {
          url: '',
          data: {}
        },
        requestImmediate: false,
        showPagination: false,
        columns: [{
          attrs: {
            label: '集团名称',
            prop: 'blocName',
            align: 'left',
            'min-width': '150',
            'show-overflow-tooltip': true
          }
        },
        {
          attrs: {
            label: '客户编号',
            prop: 'custNo',
            'min-width': '130'
          }
        },
        {
          attrs: {
            label: '集团编号',
            prop: 'blocNo'
          }
        },
        {
          attrs: {
            label: '集团成员总数',
            prop: 'memberSize'
          }
        },
        {
          attrs: {
            label: '客户状态',
            prop: 'blacklistState',
            formatter: row => {
              return Vue.filter('filterDictValue')(row.blacklistState, '10005')
            }
          }
        },
        {
          attrs: {
            label: '主办经理',
            prop: 'businessManage'
          }
        }
        ]
      }
    }
  },
  mounted() {
    this.$refs.tableDom.setData(this.tableData)
  }
}

</script>
<style lang="scss" scoped>
.table-create /deep/  {
  .el-cascader, .el-autocomplete, .el-select {
    width: 100%;
  }
}

</style>
