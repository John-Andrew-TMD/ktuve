<template>
  <div v-loading="showLoading" class="comp-bank-info">
    <h4 class="title">修改前</h4>
    <table border="0" cellpadding="0" cellspacing="0" class="el-table-simple">
      <thead>
        <tr>
          <th width="50px">序号</th>
          <th>客户类别</th>
          <th>关联人名称</th>
          <th>关联人证件名称及号码</th>
          <th>关联人编号</th>
          <th>关联关系类型(人行)</th>
          <th>关系类型(east)</th>
          <th>关联关系状态</th>
          <th>地址(注册/住址)</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="oldDataList.length">
          <tr v-for="(data, index) in oldDataList" :key="index">
            <td>{{ index + 1 }}</td>
            <td v-for="(item, idx) in data" :key="idx">{{ item.value | filterHandler(item.filter) }}</td>
          </tr>
        </template>
        <template v-else>
          <tr><td colspan="10">暂无数据</td></tr>
        </template>
      </tbody>
    </table>
    <h4 class="title">修改后</h4>
    <table border="0" cellpadding="0" cellspacing="0" class="el-table-simple">
      <thead>
        <tr>
          <th width="50px">序号</th>
          <th>客户类别</th>
          <th>关联人名称</th>
          <th>关联人证件名称及号码</th>
          <th>关联人编号</th>
          <th>关联关系类型(人行)</th>
          <th>关系类型(east)</th>
          <th>关联关系状态</th>
          <th>地址(注册/住址)</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in newDataList" :key="index">
          <td>{{ index + 1 }}</td>
          <td v-for="(item, idx) in data" :key="idx">
            <span :class="item.className">{{ item.value | filterHandler(item.filter) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getCustAssociationList } from 'api/customer-module/api-customer-detail.js'
const FILTER_NAMES = {
  dict: 'filterDictValue',
  address: 'filterChinaAddress'
}
export default {
  filters: {
    filterHandler(val, filterOptions) {
      if (!filterOptions) return val
      const { name, params } = filterOptions
      if (FILTER_NAMES[name]) {
        return Vue.filter(FILTER_NAMES[name])(val, params)
      } else if (name === 'associationStatus') {
        return ['有效', '失效'][val]
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
      oldDataList: [],
      newDataList: [],
      showLoading: true
    }
  },
  created() {
    this.getBankInfo()
  },
  methods: {
    getBankInfo() {
      getCustAssociationList(
        {
          custId: this.routeParams.id
        }
      ).then(res => {
        if (res.data) {
          this.compareNewAndOldData(res.data.newCrm, res.data.oldCrm)
        } else {
          this.$showToast('关联人关系数据异常！')
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.showLoading = false
      })
    },
    compareNewAndOldData(newData, oldData) {
      if (!Array.isArray(newData) || !Array.isArray(oldData)) { return this.$showToast('关联人关系数据异常！') }
      if (!newData.length && !oldData.length) return
      const compareItems = [
        {
          key: 'custCategory',
          filter: {
            name: 'dict',
            params: '10008'
          }
        },
        {
          key: 'custName'
        },
        {
          key: 'idCode'
        },
        {
          key: 'custNo'
        },
        {
          key: 'relationshipTypeBank',
          filter: {
            name: 'dict',
            params: '10046'
          }
        },
        {
          key: 'relationshipType',
          filter: {
            name: 'dict',
            params: '10014'
          }
        },
        {
          key: 'associationStatus',
          filter: {
            name: 'associationStatus'
          }
        },
        {
          key: 'address',
          filter: {
            name: 'address'
          }
        },
        {
          key: 'remarks'
        }
      ]
      const tempOldArr = []
      const tempNewArr = []
      if (oldData.length === 0) {
        newData.forEach(data => {
          const temp = []
          compareItems.forEach(item => {
            const { key, filter } = item
            temp.push({
              value: data[key],
              filter,
              className: 'add'
            })
          })
          tempNewArr.push(temp)
        })
        this.newDataList = Object.freeze(tempNewArr)
      } else if (newData.length === 0) {
        oldData.forEach(data => {
          const tempOld = []
          const tempNew = []
          compareItems.forEach(item => {
            const { key, filter } = item
            tempOld.push({
              value: data[key],
              filter
            })
            tempNew.push({
              value: data[key],
              filter,
              className: 'delete'
            })
          })
          tempOldArr.push(tempOld)
          tempNewArr.push(tempNew)
        })
        this.oldDataList = Object.freeze(tempOldArr)
        this.newDataList = Object.freeze(tempNewArr)
      } else {
        oldData.forEach(data => {
          const compareId = data.compareId
          const newDataIndex = newData.findIndex(item => item.compareId === compareId)
          const newDataItem = newData[newDataIndex]
          const tempOld = []
          const tempNew = []
          if (newDataItem) {
            const ret = this.compareDataItem(data, newDataItem, compareItems)
            if (ret) {
              newData.splice(newDataIndex, 1)
              return
            }
          }
          compareItems.forEach(item => {
            const { key, filter } = item
            tempOld.push({
              value: data[key],
              filter
            })
            if (!newDataItem) {
              tempNew.push({
                value: data[key],
                filter,
                className: 'delete'
              })
            } else {
              tempNew.push({
                value: newDataItem[key] || data[key] || '',
                filter,
                className: data[key] !== newDataItem[key] ? (newDataItem[key] ? 'add' : 'delete') : ''
              })
            }
          })
          tempOldArr.push(tempOld)
          tempNewArr.push(tempNew)
          newData.splice(newDataIndex, 1)
        })
        if (newData.length) {
          newData.forEach(data => {
            const temp = []
            compareItems.forEach(item => {
              const { key, filter } = item
              temp.push({
                value: data[key],
                filter,
                className: 'add'
              })
            })
            tempNewArr.push(temp)
          })
        }
        this.oldDataList = Object.freeze(tempOldArr)
        this.newDataList = Object.freeze(tempNewArr)
      }
    },
    compareDataItem(oldData, newData, compareItems) {
      const ret = compareItems.every(item => oldData[item.key] === newData[item.key])
      return ret
    }
  }
}
</script>

<style lang='scss' scoped>
.comp-bank-info {
  .el-table-simple {
    margin-bottom: 20px;
    tr td:first-child {
      text-align: center;
    }
  }
  .title {
    margin-bottom: 10px;
  }
  .add {
    color: #FF0000;
  }
  .delete {
    text-decoration: line-through;
    color: #FF0000;
  }
}

</style>
