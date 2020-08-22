<template>
  <div class="inline-dialog">
    <el-dialog
      class="comp-dialog-contract-end-list"
      title="合同结束"
      :visible.sync="dialogShow"
      width="1085px"
      :modal="false"
      @closed="handleDialogClosed"
    >
      <p class="tips">
        <i class="el-icon-warning" style="color:red;"></i>当前尚有条件未满足，不能申请合同结束
      </p>
      <table border="0" cellpadding="0" cellspacing="0" class="el-table-simple">
        <thead>
          <tr>
            <th width="50px">序号</th>
            <th width="300px">判断条件</th>
            <th>完成情况</th>
            <th width="200px">是否满足结束条件</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>合同投放：</td>
            <td>
              <p>项目金额：{{xixi}}</p>
              <p>首付款：{{xixi}}</p>
              <p>融资金额：{{xixi}}</p>
              <p>已投放金额：{{xixi}}</p>
              <p>待投放金额：{{xixi}}</p>
            </td>
            <td><i class="el-icon-error" style="color:#E6A23C;"></i></td>
          </tr>
          <tr>
            <td>2</td>
            <td>租金计划：</td>
            <td>
              <p>租金计划状态：{{xixi}}</p>
              <p>起租日：{{xixi}}</p>
              <p>第一期租金收取时间：{{xixi}}</p>
              <p>最后一期租金收取时间：{{xixi}}</p>
              <p>应收租金：{{xixi}}</p>
              <p>其中本金：{{xixi}}</p>
              <p>其中利息：{{xixi}}</p>
            </td>
            <td><i class="el-icon-error" style="color:#E6A23C;"></i></td>
          </tr>
          <tr>
            <td>3</td>
            <td>咨询服务费：</td>
            <td>
              <p>应收金额：{{xixi}}</p>
              <p>已收金额：{{xixi}}</p>
              <p>剩余应收：{{xixi}}</p>
              <p>收款时间：{{xixi}}</p>
            </td>
            <td><i class="el-icon-error" style="color:#E6A23C;"></i></td>
          </tr>
          <tr>
            <td>4</td>
            <td>留购价款：</td>
            <td>
              <p>应收金额：{{xixi}}</p>
              <p>已收金额：{{xixi}}</p>
              <p>剩余应收：{{xixi}}</p>
              <p>收款时间：{{xixi}}</p>
            </td>
            <td><i class="el-icon-error" style="color:#E6A23C;"></i></td>
          </tr>
          <tr>
            <td>5</td>
            <td>风险保证金：</td>
            <td>
              <p>合同约定保证金：{{xixi}}</p>
              <p>已收金额：{{xixi}}</p>
              <p>已抵金额：{{xixi}}</p>
              <p>已退金额：{{xixi}}</p>
              <p>待退金额：{{xixi}}</p>
              <p>待收金额：{{xixi}}</p>
              <p>风险保证金余额：{{xixi}}</p>
            </td>
            <td><i class="el-icon-error" style="color:#E6A23C;"></i></td>
          </tr>
          <tr>
            <td>6</td>
            <td>其他收费：</td>
            <td>
              <p>应收金额：{{xixi}}</p>
              <p>已收金额：{{xixi}}</p>
              <p>剩余应收：{{xixi}}</p>
              <p>收款时间：{{xixi}}</p>
            </td>
            <td><i class="el-icon-error" style="color:#E6A23C;"></i></td>
          </tr>
          <tr>
            <td>7</td>
            <td>罚息：</td>
            <td>
              <p>逾期款项笔数：{{xixi}}</p>
              <p>罚息应收总计：{{xixi}}</p>
              <p>罚息减免总计：{{xixi}}</p>
              <p>罚息已收总计：{{xixi}}</p>
              <p>罚息剩余应收：{{xixi}}</p>
            </td>
            <td><i class="el-icon-error" style="color:#E6A23C;"></i></td>
          </tr>
        </tbody>
        
      </table>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogShow=false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button> -->
        <el-button type="primary" @click="dialogShow=false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { projectList, addNewContract } from 'api/contract-module/api-contract-mng.js'
export default {
  data() {
    return {
      dialogShow: false,
      xixi: '数据正在火星漫游',
      rowData: null
    }
  },
  mounted() {
    this.dialogShow = true
  },
  methods: {
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    },
    handleDialogConfirm() {
      if (!this.rowData) return this.$showToast('请选择一个项目！')
      let params = {
        businessCooperation: this.rowData.viceBusinessManagerName,
        businessCooperationId: this.rowData.viceBusinessManagerId,
        businessManage: this.rowData.businessManagerName,
        businessManagerId: this.rowData.businessManagerId,
        custId: this.rowData.businessCategory == '2' ? this.rowData.transferorId : this.rowData.lesseeId,
        projectManagerId: this.rowData.managerId
      }
      addNewContract(
        {
          dto: params
        },
        { showLoading: true }
      )
        .then(res => {
          this.$showToast('成功！', 'success')
          this.dialogShow = false
          this.$router.push({
            path: '/contract-mng/contract-detail',
            query: {
              id: res.data.id
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleCurrentChange(row) {
      this.rowData = row
    },
    refreshTable(data = {}) {
      this.$refs.tableDom.searchTableData(data)
    }
  },
}
</script>

<style lang='scss' scoped>
.comp-dialog-contract-end-list {
  .tips {
    font-size: 14px;
    padding: 5px;
    margin-bottom: 20px;
    i {
      margin-right: 5px;
    }
  }
  .el-table-simple {
    margin-bottom: 20px;
    tr td {
      text-align: center;
    }
  }
}
</style>