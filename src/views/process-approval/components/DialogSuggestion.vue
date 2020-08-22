<template>
  <div>
    <el-dialog :visible.sync="dialogShow" title="审批意见" width="500px" :modal-append-to-body="false" @closed="handleDialogClosed">
      <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow=false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { queryDictItems, isEmptyObj } from 'utils'
export default {
  props: {
    formConfigs: {
      type: {
        type: Object,
        default: () => ({})
      }
    },
    action: {
      type: {
        type: String,
        default: ''
      }
    }
  },
  data() {
    return {
      dialogShow: false,
      formApi: null,
      formRules: [{
        type: 'input',
        title: '',
        field: 'suggestion',
        props: {
          type: 'textarea',
          rows: 5,
          maxlength: 500,
          'show-word-limit': 'true'
        },
        validate: this.formValidate({ required: true })
      }],
      formOptions: {
        form: { labelWidth: "85px" },
        submitBtn: { show: false }
      }
    }
  },
  mounted() {
    this.dialogShow = true
    this.initUI()
  },
  methods: {
    initUI() {
      // let configs = [{
      //     "componentKey": "meetingNo",
      //     "componentName": "会议编号",
      //     "sort": 1,
      //     "componentType": "select",
      //     "getValueType": "interface",
      //     "dictNo": "10008",
      //     "interfaceUrl": "/ICrmCustTransferBusiness/getSourceDepartmentUser",
      //     "interfaceParam": {},
      //     "lableKey": "employeeName",
      //     "valueKey": "userId",
      //     "defaultValue": "",
      //     "onchange": "true",
      //     "affectKey": [{
      //       "sourceKey": "employeeName",
      //       "targetKey": "meetingName"
      //     }]
      //   },
      //   {
      //     "componentKey": "meetingName",
      //     "componentName": "会议名称",
      //     "sort": 2,
      //     "componentType": "input",
      //     "readOnly": "true",
      //     "defaultValue": "XXXXX",
      //   },
      //   {
      //     "componentKey": "meetingResult",
      //     "componentName": "审议结果",
      //     "sort": 3,
      //     "componentType": "group",
      //     "children": [{
      //         "componentKey": "agree",
      //         "componentName": "票同意 ",
      //         "sort": 1,
      //         "componentType": "input",
      //         "readOnly": "false",
      //         "defaultValue": "XXXXX"
      //       },
      //       {
      //         "componentKey": "veto",
      //         "componentName": "票否决",
      //         "sort": 2,
      //         "componentType": "input",
      //         "readOnly": "fale",
      //         "defaultValue": "XXXXX"
      //       }
      //     ]
      //   },
      //   {
      //     "componentKey": "meetingOption",
      //     "componentName": "审议意见",
      //     "sort": 4,
      //     "componentType": "textarea",
      //     "defaultValue": "XXXXX"
      //   }
      // ]
      if(this.action !== 'actionFlowNext') return
      const { componentsValue = {}, components = [] } = this.formConfigs
      if(!components.length) return
      if(components.length === 1) {
        this.$nextTick(() => {
          this.formApi.updateOptions({
            form: { labelWidth: "auto" },
          })
        })
      }
      const configs = components.sort((a, b) => (+a.sort || 0) - (+b.sort || 0))
      const rules = configs.map(config => this.generateFormRule(config))
      const tasks = []
      rules.forEach((rule, index) => {
        tasks.push(new Promise((resolve, reject) => {
          this.$nextTick(() => {
            this.formApi.append(rule)
            resolve()
          })
        }))
      })
      Promise.all(tasks).then(() => {
        if(isEmptyObj(componentsValue)) return
        this.$nextTick(() => {
          this.formApi.setValue(componentsValue)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    generateFormRule(config) {
      if (!config.componentName) return
      const _this = this
      switch (config.componentType) {
        case 'input':
          return {
            type: 'input',
            title: config.componentName,
            field: config.componentKey,
            value: config.value || '',
            props: {
              readonly: config.readOnly || false
            },
            validate: this.formValidate({ required: !config.required })
          }
        case 'mumber':
          return {
            type: 'number-input',
            title: config.componentName,
            field: config.componentKey,
            value: config.value || '',
            props: {
              readonly: config.readOnly || false
            },
            validate: this.formValidate({ required: !config.required })
          }
        case 'date':
          return {
            type: 'el-date-picker',
            title: config.componentName,
            field: config.componentKey,
            value: config.value || '',
            props: {
              type: 'datetime',
              'value-format': 'timestamp',
              readonly: config.readOnly || false
            },
            validate: this.formValidate({ required: !config.required })
          }
        case 'select':
          return {
            type: "el-custom-select",
            title: config.componentName,
            field: config.componentKey,
            value: config.value || '',
            props: {
              params: {
                url: config.getValueType === 'interface' ? `/${config.interfaceUrl}` : '',
                data: config.interfaceParam || {},
                options: config.getValueType === 'dict' ? queryDictItems(+config.dictNo || 0) : [],
                labelKey: config.lableKey,
                valueKey: config.valueKey
              }
            },
            validate: this.formValidate({ required: !config.required }),
            on: {
              ...config.onchange === 'true' && {
                change(obj) {
                  let affectKeys = Array.isArray(config.affectKey) && config.affectKey || []
                  if (!affectKeys.length) return
                  const tempObj = {}
                  affectKeys.forEach(item => {
                    tempObj[item.targetKey] = obj.data[item.sourceKey] || ''
                  })
                  _this.formApi.setValue(tempObj)
                }
              } || {}
            }
          }
        case 'textarea':
          return {
            type: 'input',
            title: config.componentName,
            field: config.componentKey,
            value: config.value || '',
            props: {
              type: 'textarea',
              rows: 3,
              maxlength: 200,
              readonly: config.readOnly || false
            },
            validate: this.formValidate({ required: !config.required })
          }
        case 'radio':
          return {
            type: 'radio',
            title: config.componentName,
            field: config.componentKey,
            value: config.value || '',
            options: queryDictItems(+config.dictNo || 0),
            validate: this.formValidate({ required: !config.required })
          }
        case 'group':
          let children = config.children || []
          if (!children.length) return
          children = children.map((item, index) => {
            return {
              type: item.componentType,
              title: index === 0 ? config.componentName : '',
              field: item.componentKey,
              value: item.value || '',
              col: { span: 24 / children.length - (index && 4 || 0) },
              children: [{
                type: 'i-button',
                slot: 'append',
                children: [item.componentName]
              }],
              validate: this.formValidate({ required: true })
            }
          })
          return {
            type: 'el-col',
            native: true,
            field: config.componentKey,
            col: {
              span: 24
            },
            children
          }
      }
    },
    handleDialogConfirm() {
      this.formApi.validate(valid => {
        if (!valid) return
        let params = this.formApi.formData()
        this.$emit('dialogConfirm', params)
        this.dialogShow = false
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}

</script>

<style lang="scss">
div /deep/ .el-dialog {
  .form-create {
    .el-select {
      width: 100%;
    }
    .el-radio {
      margin-right: 20px;
    }
  }
}
</style>
