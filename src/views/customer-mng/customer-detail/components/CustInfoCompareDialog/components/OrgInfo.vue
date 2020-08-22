<template>
  <div v-loading="showLoading" class="comp-org-info">
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
import { getCustomerById } from 'api/customer-module/api-customer-detail.js'
import { isEmptyObj, queryIndustryByIds, queryEnterpriseTypeByIds } from 'utils'
const FILTER_NAMES = {
  dict: 'filterDictValue',
  date: 'filterDateSeparate',
  timestamp: 'filterTimestamp',
  toThousand: 'filterToThousand',
  address: 'filterChinaAddress',
  custAttribute: 'filterCustomerNature'
}
export default {
  filters: {
    filterHandler(val, filterOptions) {
      if (!filterOptions) return val
      const { name, params } = filterOptions
      if (FILTER_NAMES[name]) {
        return Vue.filter(FILTER_NAMES[name])(val, params)
      } else if (name === 'industry') {
        return queryIndustryByIds(val, '-')
      } else if (name === 'enterpriseType') {
        return queryEnterpriseTypeByIds(val, '-')
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
    this.getOrgBaseInfo()
  },
  methods: {
    getOrgBaseInfo() {
      getCustomerById(
        {
          id: this.routeParams.id
        },
        { showLoading: true }
      ).then(res => {
        if (res.data) {
          this.compareNewAndOldData(res.data.newCrm, res.data.oldCrm)
        } else {
          this.$showToast('基本信息数据异常！')
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
          label: '客户名称'
        },
        {
          key: 'custNo',
          label: '客户编号'
        },
        {
          key: 'custAttribute',
          label: '客户性质',
          filter: {
            name: 'custAttribute'
          }
        },
        {
          key: 'custLevel',
          label: '客户层级',
          filter: {
            name: 'dict',
            params: '10055'
          }
        },
        {
          key: 'businessCooperation',
          label: '业务协办经理'
        },
        {
          key: 'idCode',
          label: '统一社会信用代码'
        },
        {
          key: 'relatedCompany',
          label: '是否为上市公司',
          filter: {
            name: 'dict',
            params: '10004'
          }
        },
        {
          key: 'isGroupCustomer',
          label: '是否集团客户',
          filter: {
            name: 'dict',
            params: '10004'
          }
        },
        {
          key: 'groupCustomeName',
          label: '集团名称'
        },
        {
          key: 'partyCompany',
          label: '是否上市及其公司关联方',
          filter: {
            name: 'dict',
            params: '10004'
          }
        },
        {
          key: 'shareholderCompany',
          label: '是否我公司股东及其关联方',
          filter: {
            name: 'dict',
            params: '10004'
          }
        },
        {
          key: 'businessIncome',
          label: '营业收入',
          filter: {
            name: 'toThousand'
          }
        },
        {
          key: 'totalAssets',
          label: '资产总额',
          filter: {
            name: 'toThousand'
          }
        },
        {
          key: 'employeesNumber',
          label: '从业人员'
        },
        {
          key: 'enterpriseScale',
          label: '企业规模'
        },
        {
          key: 'industry',
          label: '行业类别',
          filter: {
            name: 'industry'
          }
        },
        {
          key: 'enterpriseType',
          label: '企业类型',
          filter: {
            name: 'enterpriseType'
          }
        },
        {
          key: 'enterpriseNature',
          label: '企业性质',
          filter: {
            name: 'dict',
            params: '10006'
          }
        },
        {
          key: 'fundingTime',
          label: '成立时间',
          filter: {
            name: 'timestamp'
          }
        },
        {
          key: 'registeredCapital',
          label: '注册资本',
          filter: {
            name: 'toThousand'
          }
        },
        {
          key: 'legalPerson',
          label: '法人代表'
        },
        {
          key: 'capitalPaid',
          label: '实收资本',
          filter: {
            name: 'toThousand'
          }
        },
        {
          key: 'businessTerm',
          label: '营业期限'
        },
        {
          key: 'actualController',
          label: '实际控制人'
        },
        {
          key: 'contactPeople',
          label: '联系人'
        },
        {
          key: 'website',
          label: '网址'
        },
        {
          key: 'contactNumber',
          label: '联系电话'
        },
        {
          key: 'email',
          label: '邮箱'
        },
        {
          key: 'zipCode',
          label: '邮编'
        },
        {
          key: 'fax',
          label: '传真'
        },
        {
          key: 'greenLoan',
          label: '是否绿色贷款',
          filter: {
            name: 'dict',
            params: '10004'
          }
        },
        {
          key: 'greenPurpose',
          label: '绿色贷款用途'
        },
        {
          key: 'registerAddress',
          label: '注册地址',
          filter: {
            name: 'address'
          }
        },
        {
          key: 'officeAddress',
          label: '办公地址',
          filter: {
            name: 'address'
          }
        },
        {
          key: 'businessScope',
          label: '经营范围'
        },
        {
          key: 'majorBusiness',
          label: '主营业务'
        },
        {
          key: 'creditInformation',
          label: '资信情况'
        },
        {
          key: 'litigation',
          label: '诉讼情况'
        },
        {
          key: 'issueBonds',
          label: '发行债券'
        },
        {
          key: 'remarks',
          label: '备注'
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
