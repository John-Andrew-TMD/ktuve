<template>
  <el-form ref="formDom" :model="formItems" @submit.native.prevent>
    <table class="el-table-simple" cellspacing="0" cellpadding="0" border="0">
      <thead>
        <th>费用类型</th>
        <th>收取方式</th>
        <th width="300px">金额</th>
        <th>收取时间</th>
        <th width="75px;">操作</th>
      </thead>
      <tbody>
        <tr v-for="(item, index) in formItems.tableList" :key="index">
          <td>
            <span v-if="item.isDefault">{{ item.feesType }}</span>
            <el-select
              v-else
              v-model="item.feesType"
              style="width: 100%"
              size="mini"
            >
              <el-option
                v-for="o in feesTypeOptions"
                :key="o.value"
                :label="o.label"
                :value="o.value"
              />
            </el-select>
          </td>
          <td>
            <el-select
              v-model="item.chargeWay"
              style="width: 100%"
              size="mini"
            >
              <el-option
                v-for="o in chargeWayOptions"
                :key="o.value"
                :label="o.label"
                :value="o.value"
              />
            </el-select>
          </td>
          <td>
            <div style="display: flex; justify-content: center;">
              <number-input v-model="item.amountRate" style="width: 200px" size="mini" :need-format="false">
                <template slot="append">%</template>
              </number-input>
              <number-input v-model="item.amountNum" size="mini">
                <template slot="append">元</template>
              </number-input>
            </div>
          </td>
          <td>
            <el-date-picker
              v-model="item.date"
              size="mini"
              style="width: 100%"
              type="date"
            />
          </td>
          <td>
            <span class="btn-delete" @click="handleDeleteClick(index)">删除</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div style="text-align: center;">
      <el-button size="mini" type="text" @click="handleAddClick">添加</el-button>
    </div>
  </el-form>
</template>

<script>
import { queryDictItems } from 'utils'
export default {
  components: {
  },
  props: {},
  data() {
    return {
      formItems: {
        tableList: [
          {
            feesType: '首付款',
            chargeWay: '',
            amountRate: '',
            amountNum: '',
            date: '',
            isDefault: true
          },
          {
            feesType: '咨询服务费',
            chargeWay: '',
            amountRate: '',
            amountNum: '',
            date: '',
            isDefault: true
          },
          {
            feesType: '风险保证金',
            chargeWay: '',
            amountRate: '',
            amountNum: '',
            date: '',
            isDefault: true
          }
        ]
      },
      feesTypeOptions: queryDictItems('10059'),
      chargeWayOptions: queryDictItems('10036')
    }
  },
  methods: {
    handleAddClick() {
      this.formItems.tableList.push({
        feesType: '',
        chargeWay: '',
        amountRate: '',
        amountNum: '',
        date: ''
      })
    },
    handleDeleteClick(index) {
      this.formItems.tableList.splice(index, 1)
    }
  }
}
</script>

<style lang='scss' scoped>
.el-table-simple {
  color: #606266;
  tr td:last-child {
    text-align: center;
  }
}
.btn-delete {
  cursor: pointer;
  color: #F56C6C;
  &:hover {
    opacity: .7;
  }
}

</style>

