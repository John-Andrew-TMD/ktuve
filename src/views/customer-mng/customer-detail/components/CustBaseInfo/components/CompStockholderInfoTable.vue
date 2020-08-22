<template>
  <el-form
    ref="formDom"
    class="stockholder-info-table-comp"
    :show-message="false"
    :model="formItems"
    :disabled="action ==='V'"
    style="margin-top: 10px"
    @submit.native.prevent
  >
    <el-table :data="formItems.amountDetail" border style="width: 100%">
      <el-table-column :render-header="renderHeader" :label="prefix + '出资额'">
        <template slot-scope="scope">
          <template>
            <el-form-item :prop="`amountDetail.${scope.$index}.amount`" :rules="rules.amount">
              <el-input
                v-model.trim="scope.row.amount"
                size="mini"
              /></el-form-item>
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="prefix + '出资日期'">
        <template slot-scope="scope">
          <template>
            <el-form-item :prop="`amountDetail.${scope.$index}.amountDate`">
              <el-date-picker
                v-model="scope.row.amountDate"
                size="mini"
                value-format="timestamp"
                style="width: auto"
              />
            </el-form-item>
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="prefix + '出资方式'">
        <template slot-scope="scope">
          <template>
            <el-form-item :prop="`amountDetail.${scope.$index}.amountWay`">
              <el-input v-model="scope.row.amountWay" size="mini" />
            </el-form-item>
          </template>
        </template>
      </el-table-column>
      <el-table-column :label="prefix + '出资币种'">
        <template slot-scope="scope">
          <template>
            <el-form-item :prop="`amountDetail.${scope.$index}.amountCurrency`">
              <el-input v-model="scope.row.amountCurrency" />
            </el-form-item>
          </template>
        </template>
      </el-table-column>
      <el-table-column width="100px" label="操作">
        <template v-if="action !=='V'" slot-scope="scope">
          <el-button type="text" size="mini" @click="handleDeleteClick(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="action !=='V'" style="text-align: center;background: #f5f8fd;margin-top:5px;">
      <el-button size="mini" type="text" @click="handleAddClick">添加明细</el-button>
    </div>
  </el-form>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    amountType: {
      type: String,
      default: '0'
    },
    action: {
      type: String,
      default: 'A'
    },
    selectedData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formItems: {
        amountDetail: []
      },
      rules: {
        amount: this.formValidate({ required: true })
      }
    }
  },
  computed: {
    prefix() {
      return ['认缴', '实缴'][this.amountType]
    }
  },
  mounted() {
    if (this.action === 'A') return
    this.setTableData()
  },
  methods: {
    handleAddClick() {
      this.$refs.formDom.validate(async valid => {
        if (valid) {
          this.formItems.amountDetail.push({
            amountType: this.amountType,
            amount: '',
            amountDate: '',
            amountWay: '',
            amountCurrency: '人民币'
          })
        }
      })
    },
    handleDeleteClick(scope) {
      this.formItems.amountDetail.splice(scope.$index, 1)
    },
    setTableData() {
      if (Array.isArray(this.selectedData.detailList) && this.selectedData.detailList.length) {
        const ret = this.selectedData.detailList.filter(item => item.amountType === this.amountType)
        this.formItems.amountDetail = ret.map(item => {
          return {
            amount: item.amount,
            amountDate: item.amountDate,
            amountCurrency: item.amountCurrency || '人民币',
            amountWay: item.amountWay,
            amountType: item.amountType
          }
        })
      }
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs.formDom.validate(valid => {
          if (valid) {
            resolve(this.formItems.amountDetail)
            return this.formItems.amountDetail
          } else {
            resolve(false)
          }
        })
      })
    },
    renderHeader(h, { column }) {
      return (
        <span>
          <b style='color:#f56c6c'>*</b> {column.label}
        </span>
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.stockholder-info-table-comp /deep/  {
  .el-table .el-form-item {
    margin-bottom: 0;
  }
}

</style>
