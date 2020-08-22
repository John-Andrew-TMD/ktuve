<template>
  <el-dialog
    :modal-append-to-body="false"
    title="发起评级"
    :visible.sync="dialogVisible"
    width="600px"
    @closed="handleDialogClosed"
  >
    <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getCustList, getModelList, modelLaunch } from 'api/customer-module/api-customer-rating-mng.js'

export default {
  data() {
    return {
      dialogVisible: true,
      formApi: null,
      formRules: [
        {
          type: 'el-custom-select',
          title: '客户名称',
          field: 'custId',
          style: { width: '80%' },
          validate: this.formValidate({ required: true }),
          props: {
            params: {
              url: getCustList,
              data: {},
              searchKey: 'custName',
              labelKey: 'custName',
              valueKey: 'id',
              repeat: false
            },
            filterable: 'true'
          },
          on: {
            change: valueArray => {
              this.custInfo = valueArray.data
              this.formApi.setValue('custName', valueArray.data.custName)
              this.formApi.setValue('custNo', valueArray.data.custNo)
            }
          }
        },
        { type: 'hidden', title: '客户名称', field: 'custName' },
        { type: 'hidden', title: '客户编号', field: 'custNo' },
        {
          type: 'el-custom-select',
          title: '模型名称',
          field: 'modelId',
          style: { width: '80%' },
          validate: this.formValidate({ required: true }),
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
            change: valueArray => {
              this.formApi.setValue('modelName', valueArray.data.modelName)
            }
          }
        },
        { type: 'hidden', title: '模型名称', field: 'modelName' }
      ],
      custInfo: {},
      formOptions: {
        form: { labelWidth: '140px' },
        submitBtn: { show: false }
      }
    }
  },
  methods: {
    handleDialogConfirm() {
      // 发起评级-确定
      this.formApi.validate(valid => {
        if (!valid) return
        const formData = this.formApi.formData()
        modelLaunch(formData, { showLoading: true })
          .then(res => {
            if (!res.data) return
            this.dialogVisible = false
            const queryParam = {
              id: res.data.evaluateId,
              cust_id: formData.custId,
              canEdit: true
            }
            if (!res.data.flag) {
              this.$confirm(
                '该评级模型需要用到客户的财务数据，您可以在“客户模块—财务情况”上传近三年财务报告（至少一年），否则定量指标数据将为0',
                '提示',
                {
                  cancelButtonText: '继续评级',
                  confirmButtonText: '去上传',
                  type: 'warning'
                }
              )
                .then(() => {
                  this.$router.push({
                    path: '/customer-mng/customer-detail',
                    query: {
                      id: formData.custId,
                      active_tab: 'CustFinance'
                    }
                  })
                })
                .catch(() => {
                  this.navigateToRatingScore(queryParam)
                })
              return
            }
            this.navigateToRatingScore(queryParam)
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    // 跳转到打分详情
    navigateToRatingScore(data) {
      this.$router.push({
        path: '/customer-mng/customer-rating-score',
        query: {
          id: data.id,
          cust_id: data.custId,
          canEdit: true
        }
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>
