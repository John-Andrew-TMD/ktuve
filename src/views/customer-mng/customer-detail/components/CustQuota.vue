<template>
  <div class="quota-wrap">
    <template v-if="this.quotaInfo">
      <el-row :gutter="15" class="content1 mb-10" type="flex">
        <el-col :span="12">
          <el-card class="box-card">
            <div class="g-sub-title bd-bottom mb-20">
              <span class="text">融资额度</span>
            </div>
            <el-row>
              <el-col :span="16">
                <chart-pie :pie-data="creditPieData" />
              </el-col>
              <el-col :span="8">
                <el-form
                  ref="creditForm"
                  size="mini"
                  label-suffix="："
                  :model="creditForm"
                  label-width="100px"
                >
                  <el-form-item label="融资额度">
                    <span class="amt-total red">{{ quotaInfo.amtTotal | filterToThousand }}</span> 元
                  </el-form-item>
                  <el-form-item label="已用">
                    <span>{{ quotaInfo.amtUsed | filterToThousand }}</span> 元
                  </el-form-item>
                  <el-form-item label="可用">
                    <span>{{ quotaInfo.amtCan | filterToThousand }}</span> 元
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
      <el-row class="white-bg mb-10">
        <el-col :span="24">
          <el-card class="box-card">
            <div class="g-sub-title bd-bottom mb-20">
              <span class="text">额度信息</span>
            </div>
            <div class="content-inner">
              <table-create ref="quotaTableDom" :options="quotaTable">
                <template v-slot:creditStatus="slotScope">
                  <div
                    :class="{green:slotScope.scope.row.creditStatus!=1,red:slotScope.scope.row.creditStatus==1}"
                  >{{ slotScope.scope.row.creditStatus | filterDictValue('10050') }}</div>
                </template>
              </table-create>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row class="white-bg">
        <el-col :span="24">
          <el-card class="box-card">
            <div class="g-sub-title bd-bottom mb-20">
              <span class="text">额度明细</span>
            </div>
            <div class="content-inner">
              <table-create ref="detailedTableDom" :options="detailedTable">
                <template v-slot:contractNo="slotScope">
                  {{ slotScope.scope.row.contractNo? slotScope.scope.row.contractNo : '--' }}
                </template>
              </table-create>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>
    <div v-else class="no-data">
      <div class="no-data-top" />
      <p class="no-data-text">您还没有录入相关信息</p>
    </div>
  </div>
</template>

<script>
import TableCreate from 'components/TableCreate/index'
import { queryQuotaByCustId, quotaList, quotaDetail } from 'api/customer-module/api-customer-quota-mng.js'
import ChartPie from './components/chart-pie'

export default {
  components: {
    TableCreate,
    ChartPie
  },
  props: {
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      quotaTable: {
        requestImmediate: false,
        showLoading: false,
        showPagination: false,
        showSerialNumber: true,
        columns: [
          { attrs: { label: '授信类型', prop: 'creditType',formatter: row => {
            return Vue.filter('filterDictValue')(row.creditType, '10051')}}
          },
          { attrs: { label: '授信项目', prop: 'projectName','show-overflow-tooltip': true }},
          { attrs: { label: '授信协议编号', prop: 'creditNo','show-overflow-tooltip': true }},
          { attrs: { label: '客户名称', prop: 'custName','show-overflow-tooltip': true}},
          { attrs: { label: '融资额度 (元)', prop: 'amtHappen', formatter: row => {
            return Vue.filter('filterToThousand')(row.amtHappen)}}
          },
          { attrs: { label: '生效状态', prop: 'creditStatus' }, slot: true },
          { attrs: { label: '是否循环授信', prop: 'isRevolve',formatter: row => {
            return Vue.filter('filterDictValue')(row.isRevolve, '10004')}}
          },
          { attrs: { label: '起始日期', prop: 'timeHappen',formatter: (row, column) => {
            return Vue.filter('filterTimestamp')(row.timeHappen,'YYYY-MM-DD')}}
          },
          { attrs: { label: '到期日期', prop: 'overTime',formatter: (row, column) => {
            return Vue.filter('filterTimestamp')(row.overTime,'YYYY-MM-DD')}}
          }
        ]
      },
      detailedTable: {
        requestImmediate: false,
        showLoading: false,
        showPagination: false,
        showSerialNumber: true,
        columns: [
          { attrs: { label: '客户名称', prop: 'custName','show-overflow-tooltip': true }},
          { attrs: { label: '项目名称', prop: 'projectName','show-overflow-tooltip': true }},
          { attrs: { label: '融资合同编号', prop: 'contractNo' },slot: true},
          { attrs: { label: '记录类型', prop: 'recordType',formatter: row => {
            return Vue.filter('filterDictValue')(row.recordType, '10052')}}
          },
          { attrs: { label: '发生额度（元）', prop: 'amtHappen', formatter: row => {
            return Vue.filter('filterToThousand')(row.amtHappen)}}
          },
          { attrs: { label: '发生时间', prop: 'timeHappen',formatter: (row, column) => {
            return Vue.filter('filterTimestamp')(row.timeHappen)}}
          },
          { attrs: { label: '备注', prop: 'remarks','show-overflow-tooltip': true }}
        ]
      },
      creditPieData: [],
      creditForm: {
        labelWidth: 80,
        labelSuffix: '：',
        columns: [{ label: '融资额度', value: '--' }, { label: '已用', value: '--' }, { label: '可用', value: '--' }]
      },
      quotaInfo: {}
    }
  },
  async created() {
    const quotaList = await this.getQuotaList()
    this.quotaInfo = quotaList
    if(this.quotaInfo){
      this.creditPieData = [
        { value: this.quotaInfo.amtCan, name: '可用' },
        { value: this.quotaInfo.amtUsed, name: '已用' }
      ]
    }
    this.getQuotaTableData()
    this.getDetailTableData()
  },
  mounted() {},
  methods: {
    // 根据cust_id查询额度信息
    getQuotaList() {
      return new Promise((resolve, reject) => {
        queryQuotaByCustId({id: this.routeParams.id}, { showLoading: true }).then(res => {
          if (res) {
            resolve(res.data)
          }
        }).catch(err => {
          reject()
        })
      })
    },
    // 查询额度列表
    getQuotaTableData() {
      quotaList({id: this.routeParams.id}, { showLoading: true }).then(res => {
        if (res.data.records && res.data.records.length) {
          const data = res.data.records
          this.$nextTick(() => {
            this.$refs.quotaTableDom.setData(data)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 查询额度明细
    getDetailTableData() {
      quotaDetail({id: this.routeParams.id}, { showLoading: true }).then(res => {
        if (res.data.records && res.data.records.length) {
          const data = res.data.records
          this.$nextTick(() => {
            this.$refs.detailedTableDom.setData(data)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.quota-wrap {
  .no-data {
    padding-top: 100px;
    .no-data-top {
      height: 160px;
      background: url('~@/assets/images/no-data-img.png') no-repeat center 0;
    }
    .no-data-text {
      padding: 20px 0;
      text-align: center;
    }
  }
  .amt-total {
    font-size: 16px;
    font-weight: bold;
  }
  .green {
    color: #67C23A;
  }
  .red {
    color: #FF4949;
  }
  .content1 {
    > .el-col {
      > div {
        height: 100%;
        padding-bottom: 20px;
        background: #FFFFFF;
      }
      &:last-child {
        .form {
          padding-top: 85px;
        }
      }
    }
  }
  .content-inner {
    padding: 0 20px 20px;
  }
}

</style>
