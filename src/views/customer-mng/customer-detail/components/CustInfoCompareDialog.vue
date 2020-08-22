<template>
  <el-dialog
    width="80%"
    modal-append-to-body
    append-to-body
    title="新旧数据对比"
    :visible.sync="dialogVisible"
    @closed="handleDialogClosed"
  >
    <table border="0" cellpadding="0" cellspacing="0">
      <tbody>
        <tr>
          <th width="150" style="text-align:center">字段名</th>
          <th style="text-align:center">修改前</th>
          <th style="text-align:center">修改后</th>
        </tr>
        <tr>
          <th>客户名称</th>
          <td>中山市联山喷雾泵有限公司</td>
          <td>中山市联山喷<b style="color: #f00">汽</b>泵有限公司</td>
        </tr>
        <tr>
          <th>客户性质</th>
          <td>承租人</td>
          <td><b style="color: #f00">人租承</b></td>
        </tr>
        <tr>
          <th>联系人</th>
          <td>哈哈哈</td>
          <td><b style="text-decoration: line-through;color: #f00">哈哈哈</b></td>
        </tr>
      </tbody>
    </table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible=false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { isEmptyObj } from 'utils'
export default {
  data() {
    return {
      dialogVisible: false,
    }
  },
  mounted() {
    this.dialogVisible = true
    this.initUI()
  },
  methods: {
    initUI() {
      // if(isEmptyObj(this.newData) || isEmptyObj(this.oldData)) return
      // const changedKeys = Object.keys(this.newData).filter(key => this.newData[key] !== this.oldData )
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-dialog {
    table {
      table-layout: fixed;
      width: 100%;
      border: 1px solid #eee;
      border-top: none;
      border-left: none;
      th {
        padding: 7px 5px;
        border-top: 1px solid #eee;
        border-left: 1px solid #eee;
      }
      td {
        padding: 7px 5px;
        border-top: 1px solid #eee;
        border-left: 1px solid #eee;
      }
    }
  }
</style>