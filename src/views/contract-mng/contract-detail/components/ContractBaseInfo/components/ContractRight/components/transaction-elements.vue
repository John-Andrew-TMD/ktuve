<!-- 标的物 -->
<template>
  <div id="transaction-elements">
    <h4>
      <span>交易要素</span>
    </h4>
    <div class="quota-wrapper">
      <div>
        <i class="el-icon-document icon" />
        {{ contractRowInfo && contractRowInfo.contractNo }} 合同报价方案
      </div>
      <div
        class="btn-time-width"
      >{{ contractRowInfo.conQuotationDto?contractRowInfo.conQuotationDto.sysEtime:''|filterTimestamp }}</div>
      <div class="btn-the-group">
        <el-button
          v-if="canEdit && isHistory"
          size="mini"
          :loading="showSyncLoading"
          type="warning"
          @click="handleSyncClick"
        >{{ showSyncLoading ? '同步中...' : '数据同步' }}</el-button>
        <el-button
          v-if="canEdit && isHistory"
          type="primary"
          size="mini"
          @click="handleEditClick(true)"
        >修改</el-button>
        <el-button v-else type="primary" size="mini" @click="handleEditClick(false)">详情</el-button>
      </div>
    </div>
    <table border="0" cellpadding="0" cellspacing="0">
      <tbody>
        <tr>
          <th width="150">租赁期限:</th>
          <td>{{ quotationLeaseTDto.leaseTerm }}月</td>
        </tr>
        <tr>
          <th width="150">起租日：</th>
          <td>{{ quotationLeaseTDto.anticipatedRentDate|filterTimestamp('YYYY-MM-DD') }}</td>
        </tr>
        <tr>
          <th>项目金额:</th>
          <td>{{ quotationLeaseTDto.quotationPrice | filterToThousand(2) }}元</td>
        </tr>
        <tr>
          <th>首付款：</th>
          <td>{{ quotationLeaseTDto.firstPriceRate | filterToThousand(2) }}% {{quotationLeaseTDto.firstPrice | filterToThousand}}元</td>
        </tr>
        <tr>
          <th>融资金额：</th>
          <td>{{ quotationLeaseTDto.leaseFinancing | filterToThousand(2) }}元</td>
        </tr>
        <tr>
          <th>租赁利率：</th>
          <td>
            <template
              v-if="quotationLeaseTDto.interestRateModel=='1'"
            >浮动利率，按{{ quotationLeaseTDto.benchmarkInterestRateName }}贷款基准利率【{{ quotationLeaseTDto.benchmarkInterestRateValue }}%】上浮【{{ quotationLeaseTDto.floatingPoint }}%】，即租赁利率为【{{ quotationLeaseTDto.annualInterestRate }}%】</template>
            <template
              v-else
            >固定利率，按{{ quotationLeaseTDto.benchmarkInterestRateName }}贷款基准利率【{{ quotationLeaseTDto.benchmarkInterestRateValue }}%】上浮【{{ quotationLeaseTDto.floatingPoint }}%】，即租赁利率为【{{ quotationLeaseTDto.annualInterestRate }}%】</template>
          </td>
        </tr>
        <tr>
          <th>利率调整方式：</th>
          <td>{{ quotationLeaseTDto.interestAdjustmentMode | filterDictValue('10035') }}</td>
        </tr>
        <tr>
          <th>租金支付方式：</th>
          <td>
            <template v-if="quotationLeaseTDto.calculateRentMethod=='2'">不规则还款</template>
            <template v-else>
              <template
                v-if="quotationLeaseTDto.calculateRentMethod&&quotationLeaseTDto.repaymentFrequency&&quotationLeaseTDto.paymentType"
              >{{ quotationLeaseTDto.calculateRentMethod | filterDictValue('10030') }},每{{ quotationLeaseTDto.repaymentFrequency | filterDictValue('10031') }}租金一次，{{ quotationLeaseTDto.paymentType | filterDictValue('10032') }}</template>
            </template>
          </td>
        </tr>
        <tr>
          <th>租金支付日：</th>
          <td>{{ quotationLeaseTDto.firstRentDay|filterTimestamp('YYYY-MM-DD') }}</td>
        </tr>
        <tr>
          <th>风险保证金：</th>
          <td>{{ quotationLeaseTDto.bond | filterToThousand(2) }}元</td>
        </tr>
        <tr>
          <th>风险保证金支付方式：</th>
          <td>
            <span>
              <template v-if="+contractRowInfo.conQuotationDto.bondWay==1">一次性支付</template>
              <template v-else-if="+contractRowInfo.conQuotationDto.bondWay==2">放款时抵扣</template>
              <template
                 v-else-if="+contractRowInfo.conQuotationDto.bondWay==3"
              >分3笔支付，第一笔：2,000.000.00元（起租日前支付），第二笔：2,000.000.00元（2019年8月3日前支付），第三笔：2,000.000.00元（2019年8月3日前支付）</template>
              <template v-else>
                暂无数据
              </template>
            </span>
          </td>
        </tr>
        <tr>
          <th>咨询服务费：</th>
          <td>{{ quotationLeaseTDto.service | filterToThousand(2) }}元</td>
        </tr>
        <tr>
          <th>留购价款：</th>
          <td>{{ quotationLeaseTDto.firmDiscount| filterToThousand(2) }}元</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ICommonContractBusinesSynProjectQuotation } from 'api/contract-module/api-contract-mng.js'
import { queryDictItems, isEmptyObj } from 'utils'
import ContractRightMixins from './mixins/ContractRightMixins'
export default {
  // mounted() {
  //   this.getQuotationData()
  // },
  components: {},
  mixins: [ContractRightMixins],
  props: {
    rowData: {
      type: Object,
      default: () => ({})
    },
    // routeParams: {
    //   type: Object,
    //   default: {}
    // },
    contractRowInfo: {
      type: Object,
      default: () => ({})
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showSyncLoading: false,
      quotationLeaseTDto: {},
      depositData: [],
      consultFeeData: [],
      otherFeeData: [],
      sumDepositData: 0,
      sumConsultFeeData: 0
    }
  },
  inject: ['getContractInfoField'],
  computed: {
    projectManagerId: function() {
      return this.getContractInfoField('projectManagerId')
    }
  },
  watch: {
    contractRowInfo: {
      handler(obj) {
        if (!isEmptyObj(obj)) {
          this.getQuotationData()
        }
      },
      immediate: true
    }
  },
  // mounted(){
  //   console.log(this.getContractInfoField)
  // },
  methods: {
    getUtils() {
      return queryDictItems('10035').map(item => {
        item.label
      })
    },
    getQuotationData() {
      // getQuotationRecordInfo(
      //   {
      //     id: this.contractRowInfo.id
      //   },
      //   { showLoading: true }
      // ).then(res => {
      //   if (!res.data) return;
      if (this.contractRowInfo.conQuotationDto) {
        this.setQuotation(this.contractRowInfo.conQuotationDto)
      }
      // this.setFeeData(chargeDetailTDtos)
      // });
    },
    setQuotation(quotationLeaseTDto) {
      this.$set(this.quotationLeaseTDto, quotationLeaseTDto)
      this.quotationLeaseTDto = quotationLeaseTDto
      // this.displayFeesData(chargeDetailTDtos);
    },
    displayFeesData(data) {
      this.depositData = []
      this.consultFeeData = []
      this.otherFeeData = []
      data.forEach(item => {
        switch (+item.dictOutlayType) {
          case 1: // 风险保证金
            this.sumDepositData += +item.outlayAmount
            this.depositData.push(item)
            break
          case 13: // 咨询服务费
            this.sumConsultFeeData += +item.outlayAmount
            this.consultFeeData.push(item)
            break
          case 4: // 其他款项
          case 5:
            this.otherFeeData.push(item)
            break
        }
      })
    },
    handleSyncClick() {
      this.showSyncLoading = true
      ICommonContractBusinesSynProjectQuotation({
        id: this.contractRowInfo.id,
        projectManagerId: this.projectManagerId
      })
        .then(res => {
          this.$emit('initUI', this.rowData)
          this.$showToast('同步成功！', 'success')
        })
        .finally(() => {
          this.showSyncLoading = false
        })
    },
    handleEditClick(canEdit = false) {
      this.$router.push({
        path: '/project-mng/quotation-edit',
        query: {
          quotation_id: this.quotationLeaseTDto.id,
          quotation_name: this.quotationLeaseTDto.quotationName,
          state: 1,
          project_name: this.getContractInfoField('projectName'),
          canEdit
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
#transaction-elements {
  .quota-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #e8f0ff;
    border-radius: 4px;
    i.icon {
      margin-right: 5px;
      font-size: 20px;
      vertical-align: middle;
      color: #409eff;
    }
  }
  .btn-the-group {
    display: flex;
    align-items: end;
    flex-direction: row;
    justify-content: center;
  }
  .quotationPanel {
    height: 55px;
    border: 1px solid #c2d3f8;
    border-radius: 10px;
  }
  .quotationTable {
    width: 100%;
    height: 100%;
  }
  .quotationIcon {
    width: 26px;
    height: 26px;
    vertical-align: -8px;
  }
  .quotationTable td {
    width: calc(108% / 3);
    border: none !important;
  }
  .quotationTable tr td:nth-child(1) {
    padding: 0px;
    padding-left: 28px;
  }
  .quotationTable tr td:nth-child(2) {
    text-align: center;
    color: #999999;
  }
  .quotationTable tr td:nth-child(3) {
    padding-right: 20px;
    text-align: right;
  }
  #quotationSyn {
    margin-right: 15px;
  }
  .importIcon,
  .refreshLeaseIcon,
  .refreshQuotationIcon {
    width: 18px;
    height: 18px;
    margin-right: 3px;
    margin-bottom: 1px;
    cursor: pointer;
  }
  .onlineEdit {
    padding: 6px 15px;
    color: #ffffff;
    border-radius: 4px;
    background: #6699cb;
  }
  #quotationDetail {
    width: 50px;
    margin-right: 10px;
    cursor: pointer;
    color: #5595ff;
  }
  .quotationIcon {
    width: 26px;
    height: 26px;
  }
  .onlineEdit,
  dd a {
    cursor: pointer;
  }
}
</style>
