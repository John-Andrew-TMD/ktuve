<template>
  <div>
    <el-dialog
      width="500px"
      :modal-append-to-body="false"
      title="新增"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { projectList } from 'api/contract-module/api-contract-mng.js'
export default {
  inheritAttrs: false,
  data() {
    return {
      dialogVisible: false,
      formApi: null,
      formRules: [
        {
          type: 'el-custom-autocomplete',
          title: '客户名称：',
          style: { width: '300px' },
          field: 'custName',
          props: {
            params: {
              url: projectList,
              data: {},
              searchKey: 'custName',
              labelKey: 'custName',
              valueKey: 'custName',
              repeat: false
            }
          }
        },
        {
          type: 'el-custom-autocomplete',
          title: '流水编号：',
          style: { width: '300px' },
          validate: this.formValidate({ required: true }),
          field: 'flowNo',
          props: {
            params: {
              url: projectList,
              data: {},
              searchKey: 'flowNo',
              labelKey: 'flowNo',
              valueKey: 'flowNo',
              repeat: false
            }
          },
          on: {
            select: this.handleFlowNoSelectChange,
            clear: this.handleFlowNoClear,
            input: this.handleFlowNoInput
          },
        },
        {
          type: 'el-custom-autocomplete',
          title: '子流水编号：',
          style: { width: '300px' },
          field: 'childFlowNo',
          validate: this.formValidate({ required: true }),
          props: {
            params: {
              url: projectList,
              data: {},
              searchKey: 'childFlowNo',
              labelKey: 'childFlowNo',
              valueKey: 'childFlowNo',
              repeat: false
            }
          }
        },
        {
          type: 'el-custom-text',
          title: '付款人：',
          field: 'payer',
          style: {width: '300px'}
        },
        {
          type: 'el-custom-text',
          title: '付款账号：',
          field: 'payerAccount',
          style: {width: '300px'}
        },
        {
          type: 'el-custom-text',
          title: '流水金额：',
          field: 'payerAmont',
          style: {width: '300px'}
        },
        {
          type: 'el-custom-text',
          title: '交易日期：',
          field: 'payDate',
          style: {width: '300px'}
        },
        {
          type: 'input',
          title: '备注：',
          field: 'remarks',
          props: {
            type: 'textarea'
          },
          style: {width: '300px'}
        }
      ],
      formOptions: {
        form: { labelWidth: '110px'},
        submitBtn: { show: false }
      }
    }
  },
  mounted() {
    this.dialogVisible = true
  },
  created() {
    let data = {
      payer: 'zgq',
      payerAccount: 'xxxxx银行南山分行',
      payerAmont: '100000',
      payDate: '2020-07-22'
    }
    this.$nextTick(() => {
      this.formApi.setValue(data)
    })
  },
  methods: {
    // 保存
    handleDialogConfirm() {
      this.formApi.validate(async valid => {
        if (valid) {
          // TODO
        }
      })
    },
    handleFlowNoSelectChange(){},
    handleFlowNoClear(){},
    handleFlowNoInput(){},
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>
