<!-- 项目概览-承租人基本信息 -->
<template>
  <div id="project-overview-enterprise">
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">承租人基本信息</span>
        <div v-if="routeParams.canEdit" class="panel-tools">
          <el-button v-if="!canEdit" size="mini" type="primary" @click="handleEditClick(true)">修改</el-button>
          <template v-else>
            <el-button size="mini" @click="handleEditClick(false,true)">取消</el-button>
            <el-button size="mini" type="primary" @click="handleSaveClick">保存</el-button>
          </template>
        </div>
      </div>
    </div>
    <el-row v-if="ratingData">
      <el-col :span="11">
        <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      </el-col>
      <el-col class="rating-style" :span="12">
        <div v-if="ratingData.evaluateLevel" style="padding-left:10px">
          <div class="section-top">
            <div class="item">
              <div class="content-body text-center">
                <el-row class="level-wrap" type="flex" justify="center">
                  <el-col :span="5">
                    <p>评定等级</p>
                    <b>{{ ratingData.evaluateLevel | formatText }}</b>
                  </el-col>
                  <el-col :span="5">
                    <p>总得分</p>
                    <b>{{ ratingData.totalScore | formatText }}</b>
                  </el-col>
                  <el-col :span="5">
                    <p>信用提示</p>
                    <b>{{ ratingData.creditSuggest | formatText }}</b>
                  </el-col>
                  <el-col :span="5">
                    <p>定性指标得分</p>
                    <b>{{ ratingData.changeScore | formatText }}</b>
                  </el-col>
                  <el-col :span="5">
                    <p>定量指标得分</p>
                    <b>{{ ratingData.regularScore | formatText }}</b>
                  </el-col>
                </el-row>
                <div class="info-wrap">
                  <span>评分人：{{ ratingData.creatorName | formatText }}</span>
                  <span>评分时间：{{ ratingData.sysCtime | filterTimestamp }}</span>
                </div>
                <div class="btns-wrap">
                  <el-button type="success" round size="medium" @click="handleRankClick()">评分详情描述</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          <div class="no-data-top" />
          <p class="no-data-text">暂无评分</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  queryDictItems,
  queryDictValue,
  queryChinaRegionByIds,
  transObject
} from 'utils'
import { getRatingDetail } from 'api/customer-module/api-customer-rating-mng.js'
import { getUpdateById } from 'api/project-module/api-project-mng.js'
// Vue.filter("filterDictValue")(parseInt(this.projectInfo.businessCategory), "10045")
export default {
  props: ['routeParams', 'projectInfo'],
  data() {
    return {
      formApi: {},
      canEdit: false,
      formRules: [
        {
          type: 'input',
          field: 'lesseeName',
          title: '承租人/转让方名称',
          props: { disabled: true }
        },
        {
          type: 'china-region-cascade',
          field: 'projectArea',
          title: '所属区域',
          props: { disabled: 'true', separator: '-' }
        },
        {
          type: 'input',
          field: 'actualController',
          title: '实际控制人',
          props: { disabled: true },
          col: { span: 12 }
        },
        {
          type: 'number-input',
          field: 'capitalPaid',
          title: '实收资本',
          value: '--',
          props: { disabled: true },
          col: { span: 12 },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['万元']
            }
          ]
        },
        {
          type: 'number-input',
          field: 'totalAssets',
          title: '总资产',
          props: { disabled: true, 'max-decimal': 4 },
          col: { span: 12 },
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['万元']
            }
          ]
        },
        {
          type: 'number-input',
          field: 'fixedAsset',
          title: '固定资产',
          col: { span: 12 },
          props: {
            'max-decimal': 4
          },
          validate: this.formValidate({ required: true }),
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['万元']
            }
          ]
        },
        {
          type: 'number-input',
          field: 'leaseAsset',
          title: '租赁物资产',
          col: { span: 12 },
          validate: this.formValidate({ required: true }),
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['万元']
            }
          ]
        },
        {
          type: 'number-input',
          field: 'externalFinance',
          title: '对外融资',
          col: { span: 12 },
          validate: this.formValidate({ required: true }),
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['万元']
            }
          ]
        },
        {
          type: 'number-input',
          field: 'externalGuarantee',
          title: '对外担保',
          col: { span: 12 },
          validate: this.formValidate({ required: true }),
          children: [
            {
              type: 'span',
              slot: 'append',
              children: ['万元']
            }
          ]
        },
        {
          type: 'select',
          field: 'greenLoan',
          title: '是否绿色贷款',
          options: queryDictItems('10004'),
          props: { disabled: true },
          col: { span: 12 }
        },
        {
          type: 'input',
          field: 'majorBusiness',
          title: '主营业务',
          props: { disabled: true },
          col: { span: 12 }
        }
      ],
      formOptions: {
        form: {
          labelWidth: '140px',
          disabled: true
        },
        submitBtn: {
          show: false
        }
      },
      rules: [
        {
          field: 'evaluateLevel',
          title: '评定等级',
          col: { span: 5 }
        },
        {
          field: 'totalScore',
          title: '总得分',
          col: { span: 5 }
        },
        {
          field: 'creditSuggest',
          title: '信用提示',
          col: { span: 5 }
        },
        {
          field: 'changeScore',
          title: '定性指标得分',
          col: { span: 5 }
        },
        {
          field: 'regularScore',
          title: '定量指标得分',
          col: { span: 4 }
        }
      ],
      formData: {}, // 用来存放查询到的数据
      showEdit: true,
      ratingData: {},
      numberArrays: [
        'approvalTime',
        'capitalPaid',
        'externalFinance',
        'externalGuarantee',
        'inquireTime',
        'fixedAsset',
        'isChange',
        'projectStatus',
        'sysOverTime',
        'sysVersion',
        'leaseAsset',
        'totalAssets'
      ]
    }
  },

  watch: {
    projectInfo: {
      handler(newName, oldName) {
        // console.log(newName, oldName)
      },
      immediate: true
    }
  },
  mounted() {
    this.initForm()
  },
  methods: {
    initForm() {
      getRatingDetail({ id: this.projectInfo.lesseeId }).then(res => {
        if (!res.data) {
          return
        }
        this.ratingData = { ...res.data, ...this.projectInfo }
        this.rules.map((item, index) => {
          item.value = res.data[item.field]
        })
      })
      this.formData = this.projectInfo
      // if (!this.formData.capitalPaid) {
      //   this.formData.capitalPaid = '--'
      // }else{
      //   this.formApi.updateRule("capitalPaid", {
      //     type: "number-input"
      //   });
      // }
      //  for (let [key, value] of Object.entries(this.formData)) {
      //    if(this.numberArrays.includes(key)){
      //      if(typeof value=="number"){
      //       this.$set(this.formData,key,value/10000)
      //      }
      //    }
      //   }

      //   this.formApi.setValue({...this.formData,"projectArea":
      //     this.formData.projectArea
      //       ? (
      //           this.formData.projectArea &&
      //           (this.formData.projectArea + "").split(",")
      //         ).slice(0, 3) || ""
      //       : ""});
      this.formApi.setValue(this.formData)
      this.formApi.setValue(
        'projectArea',
        this.formData.projectArea
          ? (
            this.formData.projectArea &&
              (this.formData.projectArea + '').split(',')
          ).slice(0, 3) || ''
          : ''
      )
    },
    handleEditClick(state, isCancel) {
      this.setFormEditStatus(state, isCancel)
    },
    setFormEditStatus(status = false, isCancel = false) {
      this.canEdit = status
      this.formApi.updateOptions({
        form: { disabled: !status }
      })
      if (!status) {
        if (isCancel) {
          this.formApi.resetFields()
        }
        this.formApi.setValue(this.formData)
      }
    },
    handleSaveClick() {
      this.formApi.validate(async valid => {
        if (valid) {
          let params = Object.assign({}, this.formApi.formData())
          if (!this.routeParams.id) return this.$showToast('客户id不允许为空')
          params.id = this.routeParams.id
          //   params.projectName = params.projectDisplayName;
          params.projectArea = params.projectArea + ''
          params = transObject(params, this.numberArrays, 'Float')
          getUpdateById(params, { showLoading: true })
            .then(res => {
              this.$showToast('保存成功', 'success')
              // this.changeParentPageHeadInfo(params);
              this.formData = Object.assign({}, this.formApi.formData())
              this.setFormEditStatus(false)
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    handleRankClick() {
      this.$router.push({
        path: '/customer-mng/customer-rating-detail',
        query: {
          id: this.ratingData.custId,
          name: this.ratingData.custName
        }
      })
    }
  }
}
</script>
<style lang="scss">
#project-overview-enterprise {
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .content-body {
    text-align: center;
  }
  .project-none-data {
    display: table;
    margin: 0px auto;
    margin-top: 20%;
    font-size: 16px;
    color: gray;
  }
  .rating-style {
    .no-data {
      padding-top: 20px;
      padding-left: 10px;
      .no-data-top {
        height: 160px;
        background: url('~@/assets/images/no-data-img.png') no-repeat center 0;
      }
      .no-data-text {
        padding: 20px 0;
        text-align: center;
      }
    }
    .text {
      display: inline-block;
      padding-left: 10px;
      line-height: 1.4;
      border-left: 3px solid #5595FF;
      &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 20px;
        content: '';
        border-left: 3px solid #5595FF;
      }
    }
    .section-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      border-bottom: 1px solid #F2F2F2;
      .item {
        width: 100%;
        padding: 10px;
        background: #FFFFFF;
        &:first-child {
          .level-wrap {
            border-bottom: 1px solid #F1F4F5;
          }
          .el-col {
            padding-bottom: 20px;
            line-height: 2;
            p {
              padding-bottom: 10px;
              font-size: 13px;
              color: #A1A1A1;
            }
            b {
              font-size: 28px;
              font-weight: normal;
              color: #FF9933;
              text-shadow: 0px 0px 3px rgba(161, 161, 161, .6);
            }
          }
          .info-wrap {
            padding: 30px 0 40px;
            span {
              margin: 0 22px;
              color: #5B6377;
            }
          }
          .btns-wrap {
            padding-bottom: 30px;
            .el-button {
              padding: 15px 40px;
              border-radius: 50px;
            }
          }
        }
      }
    }
    .section-bottom {
      padding: 10px;
      background: #FFFFFF;
    }
  }
}

</style>
