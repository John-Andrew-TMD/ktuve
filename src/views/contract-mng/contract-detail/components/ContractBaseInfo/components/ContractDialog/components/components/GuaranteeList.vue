<template>
  <!-- 担保 -->
  <el-table border :empty-text="emptyText" :data="value" style="width: 100%">
    <el-table-column prop="contractName" label="合同名称" width="180"></el-table-column>
    <el-table-column prop="contractNo" label="合同编号" width="180"></el-table-column>
    <el-table-column prop="guarantee" label="担保方"></el-table-column>
    <el-table-column prop="collateral" label="抵/质押物">
      <template slot-scope="scope">
        <el-input size="mini" v-model="scope.row.collateral" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      emptyText: '新增担保、抵押、质押后详情页反显'
    }
  }
}
</script>
