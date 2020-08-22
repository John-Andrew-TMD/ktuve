<template>
  <el-dialog
    title="选择关联报价方案"
    :visible.sync="dialogShow"
    width="90%"
    append-to-body
    custom-class="quotation-select-dialog"
    @closed="handleDialogClosed"
  >
    <div class="dialog-body" style="height: 550px">
      <el-form ref="formDom" :inline="true" :model="formItems" class="search-form">
        <el-form-item label="方案名称" prop="quotationName">
          <el-custom-autocomplete
            clearable
            v-model="formItems.quotationName"
            :params="autocompleteParams"
            placeholder="请输入方案名称"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="handleSearchReset">清空</el-button>
        </el-form-item>
      </el-form>
      <div>
        以下为“
        <b>{{projectInfo.projectName}}</b> ”的所有可选方案：
      </div>
      <table-create
        ref="tableDom"
        empty-text="暂无数据"
        :options="tableOptions"
        @row-click="handleRowClick"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogShow = false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import TableCreate from 'components/TableCreate'
import { quotationList } from 'api/project-module/api-quotation.js'

export default {
  components: {
    TableCreate
  },
  props: {
    projectInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogShow: false,
      formItems: {
        quotationName: ''
      },
      tableOptions: {
        requestParams: {
          url: quotationList,
          data: {
            thisManager: true,
            state: 0
          }
        },
        showSerialNumber: true,
        showPagination: true,
        tableBottomOffset: 135,
        columns: [
          {
            attrs: {
              prop: 'quotationName',
              label: '方案名称',
              align: 'left',
              'show-overflow-tooltip': true
            }
          },
          {
            attrs: {
              prop: 'quotationNo',
              label: '方案编号'
            }
          },
          {
            attrs: {
              prop: 'quotationPrice',
              label: '租赁融资额（元）',
              'min-width': '100'
            },
            filter: {
              name: 'toThousand'
            }
          },
          {
            attrs: {
              prop: 'annualInterestRate',
              label: '年利率（%）',
              'min-width': '150',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.annualInterestRate)
              }
            }
          },
          {
            attrs: {
              prop: 'irr',
              label: '项目IRR（%）',
              formatter: row => {
                return Vue.filter('filterToThousand')(row.irr * 100, 4)
              }
            }
          }
        ]
      },
      autocompleteParams: {
        url: quotationList,
        data: {
          thisManager: true,
          state: 0
        },
        searchKey: 'quotationName',
        labelKey: 'quotationName',
        valueKey: 'quotationName',
        repeat: false
      }
    }
  },
  mounted() {
    this.dialogShow = true
    // if (!isEmptyObj(this.projectInfo)) {
    //   this.$nextTick(() => {
    //     this.$refs.tableDom.searchTableData({
    //       quotation_location: "1",
    //       business_type: this.projectInfo.business_type,
    //       cust_id: this.projectInfo.cust_id
    //     });
    //   });
    //   this.custName = this.projectInfo.cust_name;
    //   this.bussinessType = this.projectInfo.business_type;
    // } else {
    //   this.$showToast("参数错误！");
    // }
  },
  methods: {
    handleDialogConfirm() {
      if (!this.row) {
        this.$showToast('未选中任何行！')
      } else {
        this.$emit('selectComplete', Object.freeze(this.row))
        this.dialogShow = false
      }
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    },
    handleRowClick(row) {
      this.row = row
    },
    handleSearch() {
      this.$refs.tableDom.searchTableData(this.formItems)
    },
    handleSearchReset() {
      this.$refs.formDom.resetFields()
    }
  }
}
</script>
<style lang="scss">
.quotation-select-dialog {
  max-width: 900px;
}
</style>
