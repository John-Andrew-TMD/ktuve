<template>
  <el-dialog
    :title="dialogTitle"
    width="800px"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    @closed="handleDialogClosed"
  >
    <form-create v-model="formApi" :rule="formRules" :option="formOptions" />
    <h3 v-if="action=='Q'">详情列表</h3>
    <appraisal-report v-if="action=='Q'&&rowId" :rowId="rowId"/>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{this.action == 'Q'? '关 闭': '取 消'}}</el-button>
      <el-button v-if="action!='Q'" type="primary" @click="handleDialogSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { projectList } from 'api/project-module/api-project-mng.js'
import { queryMeetingNo, queryMeetingPeople, assessAdd, checkMeetingNo } from 'api/project-module/api-project-assess.js'
import { queryDictValue, timestampFormat } from 'utils/index'
import AppraisalReport from './AppraisalReport'

export default {
  components: {
    AppraisalReport
  },
  inject: ['refreshTable'],
  props: ['action', 'dialogTitle', 'rowData'],
  data() {
    return {
      dialogVisible: false,
      formApi: null,
      formRules: [
        { type: 'hidden', title: '评审会ID', field: 'id' },
        {
          type: 'input',
          title: '会议编号',
          field: 'meetingId',
          style: { width: '255px' },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'select',
          title: '参会人员',
          field: 'meetingPeople',
          options: [],
          props: {
            multiple: "true",
            clearable: true
          },
          style: { width: '255px' },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'input',
          title: '评审会秘书',
          field: 'reviewSecretary',
          style: { width: '255px' },
          col: { span: 12 },
          validate: this.formValidate({ required: true })
        },
        {
          type: 'el-date-picker',
          title: '会议日期',
          field: 'meetingDate',
          props: { valueFormat: 'timestamp' },
          style: { width: "255px" },
          col: { span: 12 },
          validate: [{ required: true, message: '请输入会议日期', trigger: 'blur' }]
        },
        {
          type: 'number-input',
          title: '参会项目数',
          field: 'projectNumber',
          style: { width: '255px' },
          col: { span: 12 },
          props: {
            'min-decimal': 0,
            'max-decimal': 0,
            'need-format': false
          },
          validate: this.formValidate({ required: true })
        },
        { type: 'input', title: '状态', field: 'meetingState' , style: { width: '255px' },col: { span: 12 }},
        {
          type: "el-custom-select",
          title: "参会项目",
          style: { width: '635px' },
          col: { span: 24 },
          field: "meetingProject",
          props: {
            multiple: "true",
            filterable: "true",
            params: {
              url: projectList,
              data: {},
              labelKey: "projectName",
              valueKey: "managerId"
            },
            clearable: true
          },
          validate: this.formValidate({ required: true }),
          on: {
            change: this.handleProjectChange
          },
        },
        { type: 'input', title: '创建人', field: 'sysCreatorId' , style: { width: '255px' },col: { span: 12 }},
        { type: 'input', title: '创建时间', field: 'sysCtime' , style: { width: '255px' },col: { span: 12 }}
      ],
      formOptions: {
        form: { labelWidth: '120px' },
        submitBtn: { show: false }
      },
      ids: null,
      names: null,
      rowId: null
    }
  },
  created() {
    if(this.rowData){
      this.rowId = this.rowData.id
    }
    this.queryAssessPeople()
    this.displayPage()
  },
  mounted() {
    this.dialogVisible = true
  },
  methods: {
    // 查询评审委员
    queryAssessPeople(){
      let data = { ids: ['评审会委员']}
      queryMeetingPeople(data,{ showLoading: true }).then(res => {
        let meetingOption = res.data.records.map(item => {
          return {
            value: item.employeeName,
            label: item.employeeName
          }
        })
        this.formApi.updateRule('meetingPeople',{
          options: meetingOption
        })
      }).catch(err => {
        console.log(err)
      })
    },
    displayPage() {
      this.$nextTick(() => {
        this.formApi.resetFields()
        this.formApi.updateOptions({
          form: { disabled: this.action == 'Q' }
        })
        if (this.action == 'Q') {
          this.formApi.hidden(false,['meetingState','sysCreatorId','sysCtime'])
        } else {
          this.formApi.hidden(true,['meetingState','sysCreatorId','sysCtime'])
        }
          let newData = this.action == 'A'?{}:{ ...this.rowData }
          if(newData.meetingProject){
            newData.meetingProject = newData.meetingProject.split(',')
          } else {
            newData.meetingProject = null
          }
          if(newData.meetingPeople){
            newData.meetingPeople = newData.meetingPeople.split(',')
          }
          newData.meetingState = queryDictValue('10043',newData.meetingState)
          newData.sysCtime = timestampFormat(newData.sysCtime)
          this.formApi.setValue(newData)
          if(this.action =='A'){
            queryMeetingNo({ showLoading: true }).then(res => {
              this.formApi.setValue('meetingId',res.data.id)
            }).catch(err => {
              console.log(err)
            })
          }
      })
    },
    handleProjectChange(item) {
      if(item.value){
        this.ids = item.value.join(',')
      }
      if(item.label){
        this.names = item.label.join(',')
      }
    },
    // 确定
    handleDialogSubmit() {
      const data = this.formApi.formData()
      this.formApi.validate(valid => {
        if (valid) {
          if(data.meetingPeople){
            data.meetingPeople = data.meetingPeople.join(',')
          }
          data.meetingProject = this.ids
          data.meetingProjectName = this.names
          delete data.sysCtime
          delete data.sysCreatorId
          console.log('data',data);
          if (this.action == 'U') {
            checkMeetingNo({id: data.id,meetingId: data.meetingId}, { showLoading: true }).then(res => {
              assessAdd(data, { showLoading: true }).then(res => {
                this.$showToast('修改成功！', 'success')
                this.dialogVisible = false
                this.refreshTable()
              }).catch(err => {
                console.log(err)
              })
            }).catch(err => {
              console.log(err)
            })
          } else {
            data.id = null
            data.meetingState = 0
            checkMeetingNo({meetingId: data.meetingId}, { showLoading: true }).then(res => {
              assessAdd(data, { showLoading: true }).then(res => {
                this.$showToast('新增成功！', 'success')
                this.dialogVisible = false
                this.refreshTable()
              }).catch(err => {
                console.log(err)
              })
            }).catch(err => {
              console.log(err)
            })
          }
        }
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang='scss' scoped>
  h3{
    position: relative;
    margin-bottom: 10px;
    padding-left: 10px;
    font-size: 14px;
    font-weight: bold;
    line-height: 40px;
    text-align: left;
    color: #5C6478;
    border-bottom: 1px solid #F6F6F6;
    &::before {
      position: absolute;
      top: 11px;
      left: 0;
      display: inline-block;
      width: 3px;
      height: 18px;
      content: '';
      background: #85ADFF;
    }
  }
</style>
