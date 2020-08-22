<template>
  <transition name="fade">
  <div class="comp-right-area" v-if="formItems.id">
    <header class="header">{{ formItems.accountingSubjectAbbreviation }}</header>
    <section class="main-body">
      <div class="panel">
        <div>
          <h4>
            <span>基本信息</span>
            <el-button
              type="primary"
              size="mini"
              @click="handleBaseInfoEdit"
            >修改</el-button>
          </h4>
          <table border="0" cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <th width="150">核算主体名称</th>
                <td>{{ formItems.accountingSubjectName }}</td>
              </tr>
              <tr>
                <th>核算主体简称</th>
                <td>{{ formItems.accountingSubjectAbbreviation }}</td>
              </tr>
              <tr>
                <th>法定代表人</th>
                <td>{{ formItems.legalRepresentative }}</td>
              </tr>
              <tr>
                <th>统一社会信用代码</th>
                <td>{{ formItems.unifiedSocialCreditCode }}</td>
              </tr>
            </tbody>
          </table>
          <h4>联系方式</h4>
          <table border="0" cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <th width="150">住所</th>
                <td>{{ formItems.address | filterChinaRegion }}</td>
              </tr>
              <tr>
                <th>通讯地址</th>
                <td>{{ formItems.businessPlace  | filterChinaRegion }}</td>
              </tr>
              <tr>
                <th>联系人</th>
                <td>{{ formItems.contactPerson }}</td>
              </tr>
              <tr>
                <th>电话</th>
                <td>{{ formItems.contactNumber }}</td>
              </tr>
              <tr>
                <th>传真</th>
                <td>{{ formItems.fax }}</td>
              </tr>
            </tbody>
          </table>
          <h4>开票信息</h4>
          <table border="0" cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <th width="150">单位名称</th>
                <td>{{ formItems.unitName }}</td>
              </tr>
              <tr>
                <th>纳税人识别号</th>
                <td>{{ formItems.taxpayerIdentificationNumber }}</td>
              </tr>
              <tr>
                <th>电话</th>
                <td>{{ formItems.telephone }}</td>
              </tr>
              <tr>
                <th>开户行</th>
                <td>{{ formItems.openingBank }}</td>
              </tr>
              <tr>
                <th>银行账号</th>
                <td>{{ formItems.bankAccount }}</td>
              </tr>
              <tr>
                <th>住所</th>
                <td>{{ formItems.registeredAddress | filterChinaRegion }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="panel">
        <h4>
          <span style="margin-right: auto">银行信息</span>
          <el-button
            type="primary"
            size="mini"
            @click="handleBankAddClick"
          >新增</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleBankAddEditClick"
            :disabled="!selectedRow"
          >修改</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleBankDeleteClick"
            :disabled="!selectedRow"
          >删除</el-button>
        </h4>
        <table-create ref="tableDom" class="mt-0" :options="tableOptions" @current-change="handleCurrentChange" />
      </div>
    </section>
    <component :is="componentName" v-if="dialogStatus" :dialog-status.sync="dialogStatus" :form-data="formData" :accountting-body-id="accounttingBodyId" @dialog-confirm="handleDialogConfirm" />
  </div>
  <p v-if="showNoData" class="no-data">暂无信息</p>
</transition>
</template>
<script>
import { queryDictItems } from "utils";
import TableCreate from "components/TableCreate";
import { getAccountingBodyById, accountingBodyUpdate, bankList, bankDelete } from 'api/run-module/accounting-body-setting.js'
export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  inject: ['refreshAccounttingBodyData'],
  data() {
    return {
      formItems: {},
      tableOptions: {
        columns: [{
            attrs: {
              prop: "bankAccountName",
              label: "银行户名",
              "min-width": "120",
              "show-overflow-tooltip": true
            }
          },
          {
            attrs: {
              prop: "bankAccount",
              label: "银行账号",
            }
          },
          {
            attrs: {
              prop: "openingBank",
              label: "开户行",
              "min-width": "120",
            }
          },
          {
            attrs: {
              prop: "bankCode",
              label: "银行行号",
            }
          },
          {
            attrs: {
              prop: "bankSubjectCode",
              label: "科目代码"
            }
          },
          {
            attrs: {
              prop: "remarks",
              label: "备注"
            }
          }
        ],
        requestParams: {
          url: bankList,
          data: {}
        },
        showPagination: true,
        requestImmediate: false,
        showSerialNumber: true
      },
      selectedRow: null,
      componentName: '',
      accounttingBodyId: '',
      dialogStatus: false,
      showNoData: false
    };
  },
  watch: {
    id(val) {
      if(val === 'noData') {
        this.showNoData = true
      } else if (val !== '') {
        this.getAccountingBodyById(val)
      }
    }
  },
  components: {
    TableCreate,
    DialogAccountingAddOrUpdate: () => import('./DialogAccountingAddOrUpdate.vue'),
    DialogBankAddOrUpdate: () => import('./DialogBankAddOrUpdate.vue'),
  },
  methods: {
    getAccountingBodyById(id) {
      getAccountingBodyById({
        id
      }, { showLoading: true }).then(res => {
        if (res.data) {
          this.formItems = Object.freeze(res.data)
          this.accounttingBodyId = this.formItems.id
          this.$nextTick(() => {
            this.getBankList()
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getBankList() {
      this.$refs.tableDom.searchTableData({
        accountingSubjectId: this.id
      })
    },
    handleBaseInfoEdit() {
      this.componentName = 'DialogAccountingAddOrUpdate'
      this.dialogStatus = true
      this.formData = this.formItems
    },
    handleBankAddClick() {
      this.componentName = 'DialogBankAddOrUpdate'
      this.dialogStatus = true
      this.formData = null
    },
    handleBankAddEditClick() {
      this.componentName = 'DialogBankAddOrUpdate'
      this.formData = this.selectedRow
      this.dialogStatus = true
    },
    handleBankDeleteClick() {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          bankDelete({
            ids: [this.selectedRow.id]
          }).then(res => {
            if (!res.status) {
              this.$showToast('删除成功！', "success")
              this.getBankList()
            }
          });
        })
        .catch(() => {});
    },
    handleCurrentChange(row) {
      this.selectedRow = row;
    },
    handleDialogConfirm(type) {
      if(type === 'bank') {
        this.getBankList()
      } else {
        this.refreshAccounttingBodyData()
      }
    }
  },
}

</script>
<style lang='scss' scoped>
.comp-right-area {
  display: flex;
  flex-direction: column;
  height: 100%;

  .header {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: normal;
    line-height: 28px;
    height: 28px;

    &:before {
      content: '';
      border-left: 3px solid #5595FF;
      margin-right: 10px;
    }
  }

  .main-body {
    flex: 1;
    overflow-y: auto;
    padding-right: 7px;
  }


  .panel {
    padding: 0 10px 10px;
    border: 1px solid #ebf0fd;
    border-radius: 8px;
    box-shadow: rgba(201, 217, 248, .5) 0 0 10px;
    margin-bottom: 15px;

    h4 {
      padding: 15px 0;
      color: #5B6377;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    table {
      cellpadding: 0;
      cellspacing: 0;
      table-layout: fixed;
      width: 100%;
      border: 1px solid #eee;
      border-top: none;
      border-left: none;

      th {
        text-align: left;
        padding: 10px 5px;
        border-top: 1px solid #eee;
        border-left: 1px solid #eee;
        background: #f7f9fe;
        font-weight: normal;
      }

      td {
        padding: 10px 5px;
        border-top: 1px solid #eee;
        border-left: 1px solid #eee;
      }
    }
  }
}
.no-data {
  line-height: 30px;
  text-align: center;
  color: #777;
}

</style>
