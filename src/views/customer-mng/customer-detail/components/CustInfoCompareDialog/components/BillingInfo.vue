<template>
  <div v-loading="showLoading" class="comp-billing-info">
    <table border="0" cellpadding="0" cellspacing="0" class="el-table-simple">
      <thead>
        <tr>
          <th width="150" style="text-align:center">字段名</th>
          <th style="text-align:center">修改前 {{ beforeUpdateDate | filterTimestamp }}</th>
          <th style="text-align:center">修改后 {{ afterUpdateDate | filterTimestamp }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="tableList.length">
          <tr v-for="(item, index) in tableList" :key="index">
            <th>{{ item.label }}</th>
            <td>{{ item.oldVal | filterHandler(item.filter) }}</td>
            <td>{{ item.newVal | filterHandler(item.filter) }}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <th />
            <td>无数据变化</td>
            <td>无数据变化</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
<script>
import { getBillInfoById } from 'api/customer-module/api-customer-detail.js'
import { isEmptyObj } from 'utils'
const FILTER_NAMES = {
  dict: 'filterDictValue',
  date: 'filterDateSeparate',
  timestamp: 'filterTimestamp',
  toThousand: 'filterToThousand',
  address: 'filterChinaAddress'
}
export default {
  filters: {
    filterHandler(val, filterOptions) {
      if (!filterOptions) return val
      const { name, params } = filterOptions
      if (FILTER_NAMES[name]) {
        return Vue.filter(FILTER_NAMES[name])(val, params)
      } else {
        return val
      }
    }
  },
  props: {
    routeParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tableList: [],
      beforeUpdateDate: '',
      afterUpdateDate: '',
      showLoading: true
    }
  },
  created() {
    this.getBillingInfo()
  },
  methods: {
    getBillingInfo() {
      getBillInfoById(
        {
          custId: this.routeParams.id
        }
      ).then(res => {
        if (res.data) {
          this.compareNewAndOldData(res.data.newCrm, res.data.oldCrm)
        } else {
          this.$showToast('开票信息数据异常！')
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.showLoading = false
      })
    },
    compareNewAndOldData(newData, oldData) {
      if (isEmptyObj(newData) || isEmptyObj(oldData)) { return this.$showToast('基本信息数据异常！') }
      const compareItems = [
        {
          key: 'custName',
          label: '单位名称'
        },
        {
          key: 'isTaxPeople',
          label: '是否一般纳税人',
          filter: {
            name: 'dict',
            params: '10004'
          }
        },
        {
          key: 'taxNo',
          label: '纳税人识别号'
        },
        {
          key: 'phoneNumber',
          label: '联系电话'
        },
        {
          key: 'depositBank',
          label: '开户行'
        },
        {
          key: 'bankAccount',
          label: '银行账号'
        },
        {
          key: 'registerAddress',
          label: '住所（注册地址）',
          filter: {
            name: 'address'
          }
        }
      ]

      const tempArr = []
      compareItems.forEach(item => {
        const { key, label, filter } = item
        if (newData[key] === oldData[key]) { return }
        tempArr.push({
          oldVal: oldData[key],
          newVal: newData[key],
          label,
          filter
        })
      })
      this.tableList = Object.freeze(tempArr)
      if (this.tableList.length) {
        this.beforeUpdateDate = oldData.sysEtime
        this.afterUpdateDate = newData.sysEtime
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-table-simple {
  tr td:last-child {
    color: #FF0000;
  }
}

</style>
