<template>
  <el-dialog
    custom-class="cust-association-dialog-comp"
    :modal-append-to-body="false"
    :title="dialogTitle"
    width="650px"
    :visible.sync="dialogVisible"
    @closed="handleDialogClosed"
  >
    <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryDictItems } from 'utils'
import { customerList } from 'api/customer-module/api-customer-mng.js'
import { custAssociationAdd, custAssociationUpdate } from 'api/customer-module/api-customer-detail.js'
export default {
  inheritAttrs: false,
  props: {
    routeParams: {
      type: Object,
      default: () => ({})
    },
    selectedRow: {
      type: Object,
      default: null
    },
    action: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      dialogVisible: false,
      formApi: null,
      custCategory: 1,
      formRules: [
        {
          type: 'select',
          title: '客户类别',
          field: 'custCategory',
          value: '1',
          options: queryDictItems('10008'),
          // on: {
          //   change: this.handleCustCategroyChange
          // },
          validate: this.formValidate({ required: true, trigger: 'change' }),
          control: [
            {
              value: '1',
              rule: [
                {
                  type: 'el-custom-autocomplete',
                  title: '关联人名称',
                  field: 'custName',
                  props: {
                    params: {
                      url: customerList,
                      data: {
                        queryFlag: 1,
                        custCategory: '1'
                      },
                      searchKey: 'custName',
                      labelKey: 'custName',
                      valueKey: 'custName',
                      repeat: false
                    },
                    clearable: 'true'
                  },
                  on: {
                    select: this.handleCustNameChange
                  },
                  validate: this.formValidate({ required: true })
                },
                {
                  type: 'input',
                  title: '关联人证件名称及号码',
                  field: 'idCode',
                  props: {
                    placeholder: '请输入统一社会信用代码'
                  },
                  validate: this.formValidate({ required: true, type: 'creditCode' })
                }
              ]
            },
            {
              value: '2',
              rule: [
                {
                  type: 'el-custom-autocomplete',
                  title: '关联人名称',
                  field: 'custName',
                  props: {
                    params: {
                      url: customerList,
                      data: {
                        queryFlag: 1,
                        custCategory: '2'
                      },
                      searchKey: 'custName',
                      labelKey: 'custName',
                      valueKey: 'custName',
                      repeat: false
                    },
                    clearable: 'true'
                  },
                  on: {
                    select: this.handleCustNameChange
                  },
                  validate: this.formValidate({ required: true })
                },
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
                  title: '关联人证件名称及号码',
                  field: 'idCode',
                  validate: this.formValidate({ required: true })
                }
              ]
            }
          ]
        },
        {
          type: 'input',
          title: '关联人编号',
          field: 'custNo',
          value: '--',
          props: {
            disabled: true
          }
        },
        {
          type: 'select',
          title: '关联关系类型(人行)',
          field: 'relationshipTypeBank',
          value: '',
          validate: this.formValidate({ required: true }),
          options: queryDictItems('10046'),
        },
        {
          type: 'select',
          title: '关系类型(east)',
          options: queryDictItems('10014'),
          field: 'relationshipType',
          validate: this.formValidate({ required: true })
        },
        // {
        //   type: 'input',
        //   title: '关联人证件号码',
        //   field: 'idCode',
        //   validate: this.formValidate({ required: true, type: 'creditCode' })
        // },
        {
          type: 'radio',
          title: '关联关系状态',
          field: 'associationStatus',
          value: '0',
          options: [
            {
              value: '0',
              label: '有效'
            },
            {
              value: '1',
              label: '失效'
            }
          ],
          validate: this.formValidate({ required: true })
        },
        {
          type: 'el-col',
          native: true,
          col: { span: 24 },
          children: [
            {
              type: 'china-region-cascade',
              field: 'address',
              title: '地址（注册/住址）',
              props: { separator: '-' },
              col: { span: 15 }
            },
            {
              type: 'input',
              field: 'addressDetail',
              col: { span: 9 }
            }
          ]
        },
        {
          type: 'input',
          field: 'remarks',
          title: '备注',
          props: { type: 'textarea', maxlength: 500, 'show-word-limit': true, rows: 3 }
        }
      ],
      formOptions: {
        form: { labelWidth: '170px' },
        submitBtn: { show: false }
      },
      dialogTitle: '新增关联关系'
    }
  },
  mounted() {
    this.dialogVisible = true
    this.initUI()
  },
  methods: {
    initUI() {
      if (this.action === 'update') {
        this.dialogTitle = '修改关联关系'
        this.$nextTick(() => {
          const data = { ...this.selectedRow }
          if (data.address) {
            const tempArr = data.address.split(',')
            data.addressDetail = tempArr.pop()
            data.address = tempArr
          }
          // this.formApi.disabled(true, ['custCategory', 'custNo'])
          this.formApi.setValue(data)
          setTimeout(() => {
            this.formApi.setValue({
              custName: data.custName,
              idType: data.idType,
              idCode: data.idCode
            })
            this.formApi.disabled(true, ['custCategory', 'custNo', 'idType', 'idCode'])
            this.formApi.updateRule('custName', {
              props: {
                disabled: 'true'
              }
            })
          }, 100)
        })
      }
    },
    // 确定
    handleDialogConfirm() {
      this.formApi.validate(async valid => {
        if (valid) {
          const params = Object.assign({}, this.formApi.formData())
          params.custId = this.routeParams.id
          if (params.address) {
            params.address = params.address.join(',') + ',' + params.addressDetail
          }
          delete params.addressDetail
          if (this.action === 'update') {
            params.id = this.selectedRow.id
            custAssociationUpdate(params, { showLoading: true }).then(res => {
              this.$showToast('修改成功！', 'success')
              this.dialogVisible = false
              this.$emit('dialog-confirm')
            }).catch(err => {
              console.log(err)
            })
          } else {
            custAssociationAdd(params, { showLoading: true }).then(res => {
              this.$showToast('新增成功！', 'success')
              this.dialogVisible = false
              this.$emit('dialog-confirm')
            }).catch(err => {
              console.log(err)
            })
          }
        }
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    },
    handleIdTypeChange(val) { // 切换验证
      const validateType = ['idCard', 'taiWanIdCard', 'gangAoIdCard'][val] || ''
      this.formApi.updateRule('idCode', {
        validate: this.formValidate({ required: true, type: validateType })
      }, true)
    },
    handleCustNameChange(obj) {
      const { custNo, idCode, registerAddress, homeAddress, idType } = obj.data
      let address = ''
      let addressDetail = ''
      if (registerAddress) {
        const tempArr = registerAddress.split(',')
        addressDetail = tempArr.pop()
        address = tempArr
      } else if (homeAddress) {
        const tempArr = homeAddress.split(',')
        addressDetail = tempArr.pop()
        address = tempArr
      }
      this.formApi.setValue({
        custNo,
        idType,
        idCode,
        address,
        addressDetail
      })
      this.formApi.clearValidateState()
      if(idType !== '4') {
        this.handleIdTypeChange(idType)
      }
    }
  }
}
</script>

<style lang="scss">
.cust-association-dialog-comp {
  .el-autocomplete, .el-select, .el-cascader {
    width: 100%;
  }
}

</style>
