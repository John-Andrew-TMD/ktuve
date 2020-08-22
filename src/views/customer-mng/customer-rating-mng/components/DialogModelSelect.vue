<template>
  <el-dialog
    class="dialog-model-select"
    title="选择评级模型"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="600px"
    @close="handleDialogClose"
  >
    <form-create ref="formDom" v-model="formModel" :rule="formRules" :option="formOptions"></form-create>
    <el-form :model="form" :rules="rules" label-width="80px">
      <el-form-item>
        <div class="model-tips">
          <div class="title">适合行业：</div>
          <div>
            <span>{{ form.applyIndustry | filterDictValue('10002') }}</span>
          </div>
        </div>
        <div class="warning-tips">
          <i class="el-message__icon el-icon-warning" />重新选择评级模型，将重置当前打分情况
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleDialogSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getModelList } from 'api/customer-module/api-customer-rating-mng.js'
export default {
  data() {
    return {
      formModel: {},
      formRules: [
        {
          type: 'el-custom-select',
          title: '评级模型',
          field: 'modelId',
          validate: this.formValidate({ required: true }),
          options: [],
          style: { width: '50%' },
          props: {
            params: {
              url: getModelList,
              data: {},
              searchKey: 'modelName',
              labelKey: 'modelName',
              valueKey: 'id',
              repeat: false
            },
            filterable: 'true'
          },
          on: {
            change: o => {
              console.log(o)

              this.form = {
                modelId: o.data.id,
                applyIndustry: o.data.applyIndustry,
                modelName: o.data.modelName
              }
            }
          }
        }
      ],
      formOptions: {
        form: {
          labelWidth: '80px'
        },
        submitBtn: {
          show: false
        }
      },
      form: {
        applyIndustry: ''
      },
      dialogVisible: true
    }
  },
  props: {
    modelInfo: {
      type: Object,
      default: null
    }
  },
  inject: ['getModelData'],
  created() {
    this.init()
  },
  methods: {
    init() {
      this.form = {
        modelId: this.modelInfo.modelId,
        modelName: this.modelInfo.modelName,
        applyIndustry: this.modelInfo.applyIndustry
      }
      this.$nextTick(() => {
        this.formModel.setValue('modelId', this.modelInfo.modelId)
      })
    },
    handleDialogClose() {
      this.$emit('update:dialogStatus', false)
    },
    // 重选模型-确定
    handleDialogSubmit() {
      const modelInfo = Object.assign({}, this.modelInfo, this.form, {
        isChangeModel: true
      })
      this.getModelData(this.form.modelId)
      this.$emit('update:modelInfo', modelInfo)
      this.$emit('update:isRated', false)
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-model-select {
  .model-tips {
    padding: 10px;
    font-size: 12px;
    line-height: 1.6;
    color: #cc9966;
    background: #fbfbfb;
    .title {
      position: relative;
      margin-bottom: 5px;
      padding-left: 8px;
      &::before {
        position: absolute;
        top: 50%;
        left: 0;
        width: 4px;
        height: 4px;
        content: '';
        transform: translateY(-50%);
        border-radius: 4px;
        background: #cc9966;
      }
    }
  }
  .warning-tips {
    padding: 10px 0;
    i {
      color: #e6a23c;
    }
  }
}
</style>
