<template>
  <el-row style="margin-left:120px">
    <el-col :span="22">
      <el-table :data="fileList" border>
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="dataContent" label="附件类型" width="200" show-overflow-tooltip />
        <el-table-column prop="fileName" label="文件名" align="left" show-overflow-tooltip />
        <el-table-column v-if="canEdit" label="操作" width="80">
          <template slot-scope="scope">
            <el-link type="danger" size="mini" @click="handleDelete(scope)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    fileList: {
      type: Array,
      default: () => []
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    deleteIds: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleDelete({ row, $index }) {
      if (row.loanId) {
        this.deleteIds.push(row.id)
      }
      this.fileList.splice($index, 1)
    }
  }
}
</script>
