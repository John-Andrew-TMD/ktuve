<template>
  <div class="comp-verification-info-left">
    <h3>应收款信息</h3>
      <div class="collection-mng-verification-container">
        <el-form
          ref="relatedInfoDom"
          label-suffix="："
          :model="formModels"
          :rules="rules"
          label-width="120px"
          @submit.native.prevent
        >
          <el-row>
            <el-col span="24">
              <el-form-item label="款项类型">{{formModels.collectionType | filterDictValue('10063')}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="24">
              <el-form-item label="计划收款日期">{{formModels.dateCollection | filterTimestamp('YYYY-MM-DD')}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="24">
              <el-form-item label="应收金额">{{formModels.amtCollection | filterToThousand}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="24">
              <el-form-item label="已收金额">{{formModels.amtCollectionVer | filterToThousand}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="24">
              <el-form-item label="剩余应收">{{formModels.amtCheck | filterToThousand}}</el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="!isBankFlow">
            <el-col span="24">
              <el-form-item label="本次核销金额" prop="amtCollectionNow">
                <number-input
                  v-model.trim="formModels.amtCollectionNow"
                  :min-decimal="2"
                  :max-decimal="2"
                  needFormat=true
                  text-direction="left"
                  style="width:220px"
                >
                  <template slot="append">元</template>
                </number-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="!isBankFlow">
            <el-col span="24">
              <el-form-item label="实际收款日期" prop="dateCheck">
                <el-date-picker
                  v-model="formModels.dateCheck"
                  type="date"
                  placeholder="选择日期"
                  value-format="timestamp"
                  style="width:220px"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
  </div>
</template>

<script>
export default {
  components: {
    InfoLeft: () => import('./CompVerificationInfoLeft.vue'),
    InfoRight: () => import('./CompVerificationInfoRight.vue')
  },
  props: {
    formModels: {
      type: Object,
      default: {}
    },
    isBankFlow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      rowData: null,
      formModels: {},
      rules: {
        amtCollectionNow: this.formValidate({ required: true }),
        dateCheck: this.formValidate({ required: true })
      },
    }
  },
  watch: {
    formModels: {
      handler(newVal) {
        this.$nextTick(() => {
          this.$refs.relatedInfoDom.clearValidate()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-verification-info-left{
  padding: 0 10px;
  h3 {
    background:#85adff;
    color: #ffffff;
    position: relative;
    margin-bottom: 10px;
    padding-left: 10px;
    font-size: 14px;
    font-weight: normal;
    line-height: 30px;
    text-align: left;
  }
}
</style>
