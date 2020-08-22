<template>
  <div class="content">
    <div class="content-body">
      <el-row>
        <el-col v-for="(item,index) in rules"  :key="item" :span = "item.col.span" >
          <div class = "">{{item.title}}</div>
          <div>{{index}}</div>
        </el-col>
      </el-row>
      <el-row type = "flex" align = "center">
       <el-button type="primary" round>评级打分详情</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    projectInfo:{
      type: Object,
      default: () => {}
    },
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formApi: null,
      rules: [
        {
              type: "input",
              field: "custName",
              title: "评定等级",
              props: { disabled: true },
              col: { span: 5 }
            },
            {
              type: "input",
              field: "areaName",
              title: "总得分",
              props: { disabled: true },
              col: { span: 5 }
            },
            {
              type: "input",
              field: "controlMan",
              title: "信用提示",
              props: { disabled: true },
              col: { span: 5 }
            },
            {
              type: "input",
              field: "controlMon",
              title: "定性指标得分",
              props: { disabled: true },
              col: { span: 5 }
            },
            {
              type: "input",
              field: "allmoney",
              title: "定量指标得分",
              props: { disabled: true },
              col: { span: 4 }
            }
      ],
      options: {
        form: { labelWidth: "200px", disabled: true },
        submitBtn: { show: false }
      },
      canEdit: false,
      bankData: [],
      originFormData: {}
    };
  },
  mounted() {
     this.initForm();
  },
  methods: {
     initForm() {
      this.formData = this.projectInfo;
      // this.setFormEditStatus(true)
      
      this.formApi.setValue(this.formData);
    }
  }
};
</script>

<style lang='scss'>
</style>
