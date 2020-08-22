<template>
  <div class="anti-money-add">
    <el-dialog
      width="600px"
      :modal-append-to-body="false"
      title="反洗钱风险等级配置"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <div class="app-content">
          <el-form ref="form" :model="formData" :rules="rules" label-width="130px">
            <div class="levelContent" v-for="(item,index) in riskOptionTable" :key="index">
                <div class="row">
                   <span>{{item.riskLevel}}</span> 
                   <span class="savetime">({{item.saveTime}})</span>
                </div>
                <el-button type="text" @click="handleDelete(item)">删除</el-button>
            </div>
            <el-form-item class="levelNum" label="反洗钱风险等级" v-show="isAdd" prop="content">
                <el-input class="el-input-content" v-model="formData.content"></el-input>
                <el-button type="text" @click="handleSave">保存</el-button>
                <el-button type="text" @click="handleCancel">取消</el-button>
            </el-form-item>
            <el-button type="text" @click="handleClickAdd">新增</el-button>
          </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from 'utils'
import { getRiskLevel,riskLevelConfig } from 'api/run-module/anti-money-config.js'
export default {
  inheritAttrs: false,
  data() {
    return {
      isAdd:false,
      dialogVisible: false,
      originList:[],
      deleteList:[],
      addList:[],
      List:[],
      formData:{
        content:'',
      },
      rules:{
        content: [
          { required: true, message: '请输入反洗钱风险等级', trigger: 'blur' },
        ],
      }
    }
  },
  computed: {
    riskOptionTable(){
      let list = [...this.originList,...this.addList];
      return list.map((item,index) => {
        return item
      })
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.dialogVisible = true
  },
  methods: {
    init(){
      getRiskLevel({},{ showLoading: true }).then(res => {
        let {status,data} = res;
        this.originList = data.records ? data.records : [];
      })
    },
    handleDelete(data){
        if(data.id){
          data.flag = 2;
          this.deleteList.push(data)
          this.originList = this.originList.filter(item=>item.id !== data.id)
        }else{
          this.addList = this.addList.filter(item=>item.createTime !== data.createTime)
        }
    },
    handleCancel(){
      this.isAdd = false;  
    },
    handleClickAdd(){
      this.isAdd = true;
      this.$refs['form'].resetFields()
    },
    handleSave(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.addList.push({
            riskLevel:this.formData.content,
            flag:1,
            saveTime:parseTime(new Date())
          })
          this.formData.content = '';
          this.isAdd = false; 
        }
      })
    },
    // 确定
    handleDialogConfirm() {
        riskLevelConfig([...this.addList,...this.deleteList], { showLoading: true }).then(res => {
          this.$showToast('修改成功！', 'success')
          this.dialogVisible = false;
          this.$emit('dialog-confirm')
        }).catch(err => {
          console.log(err)
        })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    },
  }
}
</script>

<style lang="scss" scoped>
    .app-content{
        padding-left:50px;
        padding-right:20px;
        
    }
    .levelNum{
        margin-top:10px;
    }
    .el-form-item{
        margin-bottom:10px;
    }
    .el-input.el-input-content {
        width: 192px;
        margin-right:4%;
    }
    .levelContent{
      display: table-row;
      border-collapse: collapse;
      .row{
        display: table-cell;
        .savetime{
          margin-left:12px;
          margin-right:20px;
        }
      }
      .el-button{
        display: table-cell;
      }
    }
</style>
<style lang="scss">
    .anti-money-add{
        .level-select{
            .el-form-item__label,.el-input--mini .el-input__inner{
                font-weight: 700;
            }
        }
        .el-form-item__label{
            text-align: left;
        }
    }
</style>
