<template>
  <div>
    <el-dialog
      width="600px"
      :modal-append-to-body="false"
      title="新增客户"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryDictItems } from 'utils'
import { customerAdd, searchCompany, getDepartmentUser } from 'api/customer-module/api-customer-mng.js'
export default {
  inheritAttrs: false,
  data() {
    return {
      dialogVisible: false,
      formApi: null,
      formRules: [
        // {
        //   type: 'input',
        //   title: '客户名称',
        //   field: 'custName',
        //   validate: this.formValidate({ required: true })
        // },
        {
          type: 'el-custom-autocomplete',
          title: '客户名称',
          field: 'custName',
          props: {
            params: {
              url: searchCompany,
              data: {},
              searchKey: 'keyword',
              labelKey: 'custName',
              valueKey: 'custName',
              canEmpty: false
            },
            clearable: true
          },
          on: {
            select: this.handleCustSelectChange
          },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'select',
          title: '客户类别',
          field: 'custCategory',
          value: '1',
          options: queryDictItems('10008'),
          validate: this.formValidate({ required: true, trigger: 'change' }),
          on: {
            change: this.handleCategoryChange
          },
          control: [
            {
              value: '1',
              rule: [
                {
                  type: 'input',
                  title: '统一社会信用代码',
                  field: 'idCode',
                  validate: this.formValidate({ required: true, type: 'creditCode' })
                }
              ]
            },
            {
              value: '2',
              rule: [
                {
                  type: 'select',
                  title: '证件类型',
                  field: 'idType',
                  options: queryDictItems('10009'),
                  validate: this.formValidate({ required: true }),
                  on: {
                    change: this.handleIdTypeChange
                  }
                },
                {
                  type: 'input',
                  title: '证件号码',
                  field: 'idCode',
                  validate: this.formValidate({ required: true })
                }
              ]
            }
          ]
        },
        {
          type: 'el-custom-select',
          title: '业务协办经理',
          field: 'businessCooperationId',
          props: {
            params: {
              url: getDepartmentUser,
              data: {
              },
              labelKey: 'employeeName',
              valueKey: 'userId',
              canEmpty: false
            },
            clearable: true
          },
          on: {
            change: this.handlesCooperationChange
          },
          validate: this.formValidate({ required: true })
        }
      ],
      formOptions: {
        form: { labelWidth: '140px' },
        submitBtn: { show: false }
      }
    }
  },
  mounted() {
    this.dialogVisible = true
  },
  methods: {
    // 确定
    handleDialogConfirm() {
      this.formApi.validate(async valid => {
        if (valid) {
          const params = this.formApi.formData()
          params.businessCooperation = this.businessCooperation
          customerAdd(params, { showLoading: true }).then(res => {
            this.$showToast('新增成功！', 'success')
            this.dialogVisible = false
            const { id } = res.data
            this.$emit('dialog-confirm', {
              id,
              custCategory: params.custCategory
            })
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    },
    handleCustSelectChange(obj) {
      if (!obj) return
      this.formApi.setValue('idCode', obj.data.idCode)
    },
    handleCategoryChange(val) {
      this.formApi.updateRule('custName', {
        props: {
          params: {
            disabled: val != 1
          }
        }
      })
    },
    handlesCooperationChange(obj) {
      if (!obj) return
      this.businessCooperation = obj.data.employeeName
    },
    handleIdTypeChange(val) { // 切换验证
      const validateType = ['idCard', 'taiWanIdCard', 'gangAoIdCard'][val] || ''
      this.formApi.updateRule('idCode', {
        validate: this.formValidate({ required: true, type: validateType })
      }, true)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  .el-autocomplete, .el-select {
    width: 100%;
  }
}

</style>
