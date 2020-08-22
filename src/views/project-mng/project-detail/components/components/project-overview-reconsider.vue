<!-- 项目概览-复议信息 -->
<template>
  <div class="panel-project-overview">
    <form-create v-model="formApi" :rule="formRules" :option="formOptions"></form-create>
    <el-row class="form-btn" style="margin-left:150px;" v-show="canEdit">
      <el-button type="primary" v-show="showEdit" @click="handleEdit">编辑</el-button>
      <el-button type="primary" v-show="!showEdit" @click="handleSave">保存</el-button>
      <el-button v-show="!showEdit" @click="handleCancel">取消</el-button>
    </el-row>
  </div>
</template>

<script>

export default {
  data() {
    return {
      formApi: {},
      formRules: [
        {
          type: 'input',
          field: 'not_pass_reason',
          title: '上一次评审会未通过原因',
          validate: this.formValidate({ required: true }),
          props: {
            type: 'textarea',
            size: 'large',
            maxlength: 1024
          },
          col: { span: 22 }
        },
        {
          type: 'input',
          field: 'rectification_describe',
          title: '整改措施阐述',
          validate: this.formValidate({ required: true }),
          props: {
            type: 'textarea',
            size: 'large',
            maxlength: 1024
          },
          col: { span: 22 }
        },
        {
          type: 'input',
          field: 'reconsider_reason',
          title: '申请复议理由',
          validate: this.formValidate({ required: true }),
          props: {
            type: 'textarea',
            size: 'large',
            maxlength: 1024
          },
          col: { span: 22 }
        }
      ],
      formOptions: {
        form: {
          labelWidth: '140px',
          disabled: true
        },
        submitBtn: { show: false }
      },
      showEdit: true,
      canEdit: false
    }
  },
  props: ['routeParams', 'formData'],
  created() {
    this.initForm()
  },
  methods: {
    initForm() {
      const { project_status } = this.routeParams
      this.canEdit = project_status == 9 || this.routeParams.node_no == 1
      this.$nextTick(() => {
        this.formApi.setValue(this.formData)
      })
    },
    handleEdit() {
      this.setFormStatus()
    },
    handleSave() {
      this.formApi.validate(valid => {
        if (valid) {
          const formData = this.formApi.formData()
          const params = Object.assign({}, this.formData, formData)
          this.$promiseRequest(
            {
              code: '201831',
              data: {
                ...params,
                project_id: this.routeParams.project_id,
                action: 'A'
              }
            },
            { showLoading: true }
          )
            .then(res => {
              this.$showToast(res.data.result.prompt, 'success')
              this.setFormStatus()
              this.$emit('update:formData', formData)
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    handleCancel() {
      this.setFormStatus()
      this.formApi.resetFields()
      this.formApi.setValue(this.formData)
    },
    setFormStatus() {
      this.showEdit = !this.showEdit
      this.formApi.updateOptions({
        form: { disabled: this.showEdit }
      })
    }
  }
}
</script>
