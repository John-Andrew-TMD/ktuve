<template>
  <div class="app-content customer-finance-graph-page">
    <div>
      <div class="title-right">
        <el-popover
          v-model="popoverVisable"
          class="report-proper"
          placement="bottom"
          width="200"
          trigger="manual"
          @show="handleReportFilter"
        >
          <div class="report-form" size="mini">
            <el-row type="flex" align="middle">
              <el-col :span="16">注:选择2~6个</el-col>
              <el-col :span="8" class="txt-right">
                <el-button type="primary" size="mini" @click="handleSelectSubmit">确定</el-button>
              </el-col>
            </el-row>
            <el-checkbox-group v-model="checkedIds">
              <el-checkbox
                v-for="item in reportList"
                :key="item"
                :label="item.id"
              >{{ item.finStatementHeadline }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <el-button
            slot="reference"
            type="warning"
            round
            @click="popoverVisable = !popoverVisable"
          >报表筛选</el-button>
        </el-popover>
      </div>
      <finance-data :finance-ids="financeIds" />
    </div>
    <div class="white-bg">
      <div class="title">
        <i class="el-icon-s-data" />指标数据展示
      </div>
      <div class="content-wrap2">
        <el-row :gutter="10" type="flex" class="mb-10">
          <el-col :span="12">
            <dept-ability :data="deptData" />
          </el-col>
          <el-col :span="12">
            <profit-ability :finance-ids="financeIds" />
          </el-col>
        </el-row>
        <el-row :gutter="10" type="flex" class="mb-10">
          <el-col :span="12">
            <business-ability :finance-ids="financeIds" />
          </el-col>
          <el-col :span="12">
            <du-pont-analysis :data="deptData" />
          </el-col>
        </el-row>
        <!-- <el-row :gutter="10" type="flex" class="mb-10">
          <el-col :span="12">
            <growth-ability :finance-ids="financeIds" />
          </el-col>
        </el-row>-->
      </div>
    </div>
  </div>
</template>

<script>
import FinanceData from './components/FinanceData'
import BusinessAbility from './components/BusinessAbility'
import DeptAbility from './components/DeptAbility'
import GrowthAbility from './components/GrowthAbility'
import ProfitAbility from './components/ProfitAbility'
import DuPontAnalysis from './components/DuPontAnalysis'
import {} from 'utils'
import {
  getAllFinanceList,
  getDeptList,
  downloadExcel,
  downloadFilePath
} from 'api/customer-module/api-finance-contrast.js'
import { formSubmit, parseTime, timestampFormat, thousandSeparator } from 'utils'

export default {
  components: {
    FinanceData,
    DeptAbility,
    GrowthAbility,
    BusinessAbility,
    ProfitAbility,
    DuPontAnalysis
  },
  data() {
    return {
      popoverVisable: false,
      reportList: [],
      checkedIds: [],
      deptData: [],
      financeIds: this.$route.query.finance_ids.split(',')
    }
  },
  watch: {
    $route: function(to, from) {
      this.$store.dispatch('tagsView/refreshCurrentTag', this)
    }
  },
  created() {
    this.checkedIds = this.financeIds
    this.init(this.financeIds)
  },
  provide() {
    return {
      setDataFitChart: this.setDataFitChart,
      downloadCb: this.downloadCb
    }
  },
  methods: {
    init(financeIds) {
      this.getDeptAndDuPontData(financeIds)
    },
    // 偿债能力&杜邦分析
    getDeptAndDuPontData(ids) {
      getDeptList(
        {
          ids
        },
        { showLoading: false }
      ).then(res => {
        const data = res.data.records
        this.deptData = data
      })
    },
    // 报表筛选-确定
    handleSelectSubmit() {
      if (this.checkedIds.length < 2) {
        this.$showToast('至少选择2条记录！', 'warning')
        return
      } else if (this.checkedIds.length > 6) {
        this.$showToast('最多选择6条记录！', 'warning')
        return
      }
      this.financeIds = this.checkedIds
      this.popoverVisable = false
      this.init(this.checkedIds)
    },
    // 查询报表筛选列表
    handleReportFilter() {
      getAllFinanceList({
        dto: {
          custId: this.$route.query.cust_id,
          companyType: 0
        },
        pageCurrent: 1,
        pageSize: 10000
      }).then(res => {
        this.reportList = res.data.records
      })
    },
    /**
     * 处理数据适用于图表
     * @param data 要处理的数据
     * @param includesArray 要处理字段的集合，用于排除掉不需要的字段
     * @param decimal 保留的小数位
     */
    setDataFitChart(data, includesArray = [], decimal = 2) {
      const obj = {}
      data.forEach((item, i) => {
        for (const key in item) {
          if (!item.hasOwnProperty(key)) continue
          if (includesArray.length && !includesArray.includes(key)) continue
          let element = item[key]
          element = key.includes('reportDate') ? parseTime(element, '{y}-{m}-{d}') : Number(element).toFixed(decimal)
          if (i === 0) {
            obj[key] = []
          }
          obj[key].push(element)
        }
      })
      return obj
    },
    formatDownloadData(data, fieldMap, strFinance) {
      return data.map(item => {
        const obj = {}
        for (const key in item) {
          if (item.hasOwnProperty(key) && strFinance.includes(key)) {
            const element = item[key]
            if (typeof element === 'number') {
              item[key] = element + ''
            } else if (typeof element === 'object') {
              item[key] = ''
            }
            const tempObj = fieldMap.find(fItem => fItem.field === key)
            if (tempObj.type) {
              switch (tempObj.type) {
                case 'date':
                  obj[key] = timestampFormat(item[key], 'YYYY-MM-DD')
                  break
                case 'money':
                  obj[key] = thousandSeparator(item[key])
                  break
              }
            } else {
              obj[key] = item[key]
            }
          }
        }
        return obj
      })
    },
    downloadCb(data) {
      this.$confirm('确定下载文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const strFinance = []
          const title = []
          data.fieldMap.forEach(item => {
            strFinance.push(item.field)
            title.push(item.title)
          })
          const tableList = this.formatDownloadData(data.tableData, data.fieldMap, strFinance)
          downloadExcel({
            strFinance,
            fileName: data.name,
            tableList,
            title,
            baseString: data.baseString
          }).then(res => {
            formSubmit(downloadFilePath, { name: data.name, path: res.data }, 'get')
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="scss">
.customer-finance-graph-page {
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    font-size: 16px;
    font-weight: bold;
    line-height: 50px;
    text-align: center;
    color: #5595ff;
    box-shadow: 0 1px 5px 0 rgba(85, 149, 255, 0.2);
    i {
      margin-right: 5px;
      font-size: 18px;
    }
  }
  .title-right {
    height: 50px;
    margin-bottom: -50px;
    padding-right: 10px;
    line-height: 50px;
    text-align: right;
  }
  .content-wrap {
    padding: 10px 30px 30px;
  }
  .content-wrap2 {
    padding: 10px;
    .el-card {
      height: 100%;
    }
  }
}
.report-form {
  > .el-row {
    padding-bottom: 8px;
  }
  .el-checkbox-group {
    line-height: 28px;
  }
  .el-checkbox {
    width: 100%;
    margin-right: 0;
  }
  .el-checkbox__label {
    padding-left: 5px;
    font-size: 12px;
  }
}
</style>
