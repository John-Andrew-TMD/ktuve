<template>
  <div class="mortgage-collateral-comp">
    <div class="btn-group" v-if="routeParams.canEdit">
      <el-button type="primary" size="mini" @click="handleButtonClick('编辑押品类别')">编辑押品类别</el-button>
    </div>
    <template v-if="showArea">
      <!-- 金融质押品 -->
      <comp-finance-info v-if="financeDisable" :route-params="routeParams"/>
      <div class="divide-line" v-if="financeDisable"/>
      <!-- 应收账款 -->
      <comp-account-info v-if="accountDisable" :route-params="routeParams" />
      <div class="divide-line" v-if="accountDisable"/>
      <!-- 房地产类 -->
      <comp-estate-info v-if="estateDisable" :route-params="routeParams" />
      <div class="divide-line" v-if="estateDisable"/>
      <!-- 其他押品 -->
      <comp-others-info v-if="othersDisable" :route-params="routeParams" />
    </template>
    <el-dialog
      v-transfer-dom
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      width="400px"
      @closed="handleDialogClosed"
    >
      <form-create v-model="formApi" :rule="formRules" :option="option" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryDictItems } from 'utils'
import { queryPawnName, editPawnName } from 'api/project-module/api-project-mortgage-collateral.js'
import CompFinanceInfo from './components/CompFinanceInfo.vue'
import CompAccountInfo from './components/CompAccountInfo.vue'
import CompEstateInfo from './components/CompEstateInfo.vue'
import CompOthersInfo from './components/CompOthersInfo.vue'

export default {
  components: {
    CompFinanceInfo,
    CompAccountInfo,
    CompEstateInfo,
    CompOthersInfo,
  },
  props: {
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      formApi: {},
      formRules: [
        { type: 'hidden', title: 'ID', field: 'id' },
        {
          type: 'select',
          title: '押品类别',
          field: 'pawnType',
          options: queryDictItems('10023'),
          props: {
            multiple: 'true',
            clearable: 'true'
          },
          col: { span: 24 }
        },
      ],
      option: {
        form: { labelWidth: '100px' },
        submitBtn: { show: false }
      },
      showArea: false,
      pawnType: null,
      financeDisable: false,
      accountDisable: false,
      estateDisable: false,
      othersDisable: false
    }
  },
  created() {
    this.queryPawnNameCheck()
  },
  mounted() {
    setTimeout(() => {
      this.showArea = true
    }, 50)
  },
  methods: {
    queryPawnNameCheck() {
      this.financeDisable = false,
      this.accountDisable = false,
      this.estateDisable = false,
      this.othersDisable = false
      let data = { recordId: this.routeParams.id }
      queryPawnName(data, { showLoading: true }).then(res => {
        if(res.data){
          this.pawnType = res.data.typeIds
          if(this.pawnType != ''){
            this.pawnType = this.pawnType.split(',')
            this.pawnType.forEach(item => {
              if(item == '0'){
                this.financeDisable = true
              } else if (item == '1'){
                this.accountDisable = true
              } else if (item == '2'){
                this.estateDisable = true
              } else {
                this.othersDisable = true
              }
            });
          }
          console.log('pawnType',this.pawnType);
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleButtonClick(title){
      this.dialogTitle = title
      this.dialogVisible = true
      if(this.pawnType != ''){
        this.$nextTick(()=>{
          this.formApi.setValue('pawnType',this.pawnType)
        })
      }
    },
    handleDialogSubmit(){
      const data = this.formApi.formData()
      if(data.pawnType != ''){
        data.typeIds = data.pawnType.join(',')
        data.id = null
      }
      data.recordId = this.routeParams.id
      delete data.pawnType
      console.log('data',data);
      editPawnName(data, { showLoading: true }).then(res => {
        this.$showToast('修改押品类别成功！', 'success')
        this.dialogVisible = false
        this.queryPawnNameCheck()
      }).catch(err => {
        console.log(err)
      })
    },
    handleDialogClosed() {
      this.formApi.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.mortgage-collateral-comp {
  padding: 0 15px;
  .btn-group {
    border-top: none;
  }
  .content-body {
    box-sizing: border-box;
    padding: 0 0 10px;
  }
  .panel-header {
    padding: 0;
  }
  .panel-wrapper {
    position: relative;
    .panel-tools {
      position: absolute;
      top: 0;
      right: 0;
      line-height: 36px;
    }
  }
  .divide-line {
    height: 10px;
    border-bottom: 5px solid #FFFFFF;
    background: #F1F4F5;
  }
  .el-form {
    .el-select, .el-input, .el-cascader {
      width: 100%;
    }
  }
}

</style>
