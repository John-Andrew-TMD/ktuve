<template>
  <table-create 
    ref="tableDom"
    :options="tableOptions"
  >
  </table-create>
</template>

<script>
import TableCreate from 'components/TableCreate/index'

export default {
  data() {
    return {
      tableOptions: {
        columns: [
          { attrs: { prop: 'projectName', label: '项目名称' }},
          { attrs: { prop: 'projectNo', label: '项目编号' }},
          { attrs: { prop: 'projectNo', label: '租赁类别' }},
          { attrs: { prop: 'projectNo', label: '租赁类型' }},
          { attrs: { prop: 'projectNo', label: '项目金额' }},
          { attrs: { prop: 'projectNo', label: '项目状态' }},
          { attrs: { prop: 'projectNo', label: '业务经理' }},
          { attrs: { prop: 'projectNo', label: '业务协办经理' }},
          { attrs: { prop: 'price', label: '客户名称' }},
          { attrs: { prop: 'use', label: '客户编号' }},
        ],
        showPagination: false,
        showLoading: false,
        requestImmediate: false,
        showSerialNumber: false
      },
    }
  },
  components: {
    TableCreate
  },
  mounted() {
    this.$emit('input', this.$refs.tableDom)
  },
  methods: {
    //TODO:ZHUANG GUANG QIAN
    preview(){},
    download(){}
  }
}
</script>

<style lang='scss'>
</style>