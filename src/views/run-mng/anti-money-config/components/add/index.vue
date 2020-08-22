<template>
  <div class="anti-money-add">
    <el-dialog
      width="600px"
      :modal-append-to-body="false"
      title="编辑等级选项"
      :visible.sync="dialogVisible"
      @closed="handleDialogClosed"
    >
      <div class="app-content">
          <el-form ref="form" :model="formData" label-width="120px" :rules="rules">
            <el-form-item class="level-select" label="反洗钱风险等级">
                <el-select v-model="formData.levelId" placeholder="请选择" @change="getRiskLevelOptions">
                    <el-option
                        v-for="item in levelOptions"
                        :key="item.id"
                        :label="item.riskLevel"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <div class="table">
              <div class="levelContent" v-for="(item,index) in riskOptionTable" :key="index">
                <div class="row">
                  <span>({{item.number}})</span> 
                  <span class="riskRevel">{{item.content}}</span> 
                  <span class="savetime">({{item.saveTime}})</span>
                </div>
                <el-button type="text" @click="handleDelete(item)">删除</el-button>
               </div>
            </div>
            <el-form-item class="levelNum" label="反洗钱等级选项" v-show="isAdd" prop="content">
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
import { queryDictItems ,parseTime} from 'utils'
import { riskLevelList ,riskLevelAdd ,getRiskLevel} from 'api/run-module/anti-money-config.js'
export default {
  inheritAttrs: false,
  data() {
    return {
      isAdd:false,
      originList:[],
      addList:[],
      deleteList:[],
      formData:{
        content:'',
        levelId:'' 
      },
      levelOptions:[],
      dialogVisible: false,
      rules:{
        content: [
          { required: true, message: '请输入反洗钱等级选项', trigger: 'blur' },
        ],
      }
    }
  },
  computed: {
    riskOptionTable(){
      let list = [...this.originList,...this.addList];
      return list.map((item,index) => {
        item.number = index+1;
        item.levelId = this.formData.levelId;
        return item
      })
    }
  },
  created() {
    this.init();
  },
  mounted() {
    this.dialogVisible = true
  },
  methods: {
    init(){
      getRiskLevel({},{ showLoading: true }).then(res => {
        let {status,data} = res;
        this.levelOptions = data.records ? data.records : [];
        this.formData.levelId = this.levelOptions[0] ? this.levelOptions[0].id :'';
        this.getRiskLevelOptions();
      })
    },
    getRiskLevelOptions(){
       riskLevelList({levelId:this.formData.levelId},{ showLoading: true }).then(res => {
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
            flag:1,
            content:this.formData.content,
            createTime:new Date().getTime(),
            saveTime:parseTime(new Date())
          })
          this.formData.content = '';
          this.isAdd = false; 
        }
      })
    },
    // 确定
    handleDialogConfirm() {
        riskLevelAdd([...this.addList ,...this.deleteList], { showLoading: true }).then(res => {
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
    .table{
      display: table;
      .levelContent{
        display: table-row;
        border-collapse: collapse;
        .row{
          display: table-cell;
          .riskRevel{
            margin:0px 12px;
            max-width:240px;
            display: inline-block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            vertical-align: middle;
          }
        }
        .el-button{
          display: table-cell;
          margin-left:12px;
        }
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
