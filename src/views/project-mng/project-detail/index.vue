<template>
  <div class="app-content app-content--quote project-detail-page">
    <quote :text="`项目详情（项目名称: ${projectName}）`" icon="project" v-if="projectInfo">
      <template #left>
        {{(projectInfo.projectType=='1')?'':'0' | filterDictValue('10049')}}
        <span class="status">{{ projectStatus | filterDictValue('10024') }}</span>
      </template>
      <div class="quota-inner-wrapper">
        <div>
          <template v-if="foundBtn">
            <el-button size="mini" type="primary" @click="handleFlowClick('projectFound','发起立项审批')">发起立项审批</el-button>
          </template>
          <template v-if="approvalBtn">
            <el-button size="mini" type="primary" @click="handleFlowClick('projectApproval','发起项目审批')">发起项目审批</el-button>
          </template>
          <template v-if="changeBtn">
            <el-button size="mini" type="primary" @click="handleFlowClick('projectChangeSubmit','发起项目变更')">发起项目变更</el-button>
          </template>
          <template v-if="changeBtn">
            <el-button size="mini" type="primary" @click="handleChangeCancelClick">撤销变更</el-button>
          </template>
          <template v-if="endBtn">
            <el-button size="mini" type="danger" @click="handleFlowClick('projectChange','项目完结')">项目完结</el-button>
          </template>
        </div>
      </div>
    </quote>
    <project-detail-comp :project-data.sync="projectInfo" :route-params="routeParams" />
    <dialog-repeat-select v-if="repeatDialogStatus" :dialog-status.sync="repeatDialogStatus" @dialogConfirm="handleRepeatDialogConfirm" />
  </div>
</template>
<script>
import Quote from "components/Quote";
import ProjectDetailComp from "./components/project-detail.vue";
import DialogRepeatSelect from "./components/dialog-repeat-select.vue";
import {} from "util";
import {
  projectFound,
  projectApproval,
  projectChangeSubmit,
  projectChangeCancel
} from "api/project-module/api-project-mng.js";
const projectMng = {
  projectFound,
  projectApproval,
  projectChangeSubmit
}
export default {
  name: "ProjectDetail",
  components: {
    Quote,
    ProjectDetailComp,
    DialogRepeatSelect
  },
  data() {
    return {
      projectInfo: null,
      repeatDialogStatus: false,
      routeParams: null,
      approveType: ["立项审批", "项目审查", "项目复议", "项目变更"],
      fullPath: "",
      needBack: true // 提交成功后返回上一页
    };
  },
  watch: {
    $route: function(to, from) {
      if (to.name !== "ProjectDetail" || this.fullPath === to.fullPath) return;
      this.$store.dispatch("tagsView/refreshCurrentTag", this);
    },
    "projectInfo.projectName": function() {
      const route = Object.assign({}, this.$route, {
        title: this.projectInfo.projectName
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    }
  },
  created() {
    this.routeParams = Object.assign({}, this.$route.query);
    this.fullPath = this.$route.fullPath;
  },
  methods: {
    // refreshPage() {
    //   this.$store.dispatch('tagsView/refreshCurrentTag', this)
    //   // const path = this.$route.path;
    //   // const query = Object.assign({}, this.$route.query, {
    //   //   t: new Date().getTime()
    //   // });
    //   // this.$router.push({ path, query });
    // },
    handleFlowClick(funName, text) {
      this.showConfirm(text, val => {
        projectMng[funName]({
            id: this.projectInfo.recordId,
            commentMessage: val || ''
          }, { showLoading: true })
          .then(res => {
            this.$showToast("发起成功", "success");
            this.$store.commit('refresh/REFRESH_PROJECT_LIST')
            setTimeout(() => {
              this.$store
                .dispatch('tagsView/closeCurrentTag', this.$route)
                .then(() => {
                  this.$router.push(this.$route.meta.from)
                })
            }, 2000)
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    showConfirm(title, confirmCb) {
      this.$prompt(`确定${title}？`, "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'textarea',
          inputPlaceholder: '请输入发起意见',
          // inputPattern: /[^\s*]/,
          // inputErrorMessage: '发起意见不允许为空',
          type: 'warning'
        })
        .then(({ value }) => {
          confirmCb && confirmCb(value);
        })
        .catch(() => {});
    },
    handleChangeCancelClick() {
      this.$confirm('确定撤销变更？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async () => {
          projectChangeCancel({
              id: this.projectInfo.recordId
            }, { showLoading: true })
            .then(res => {
              this.$showToast("撤销成功", "success");
              this.$store.commit('refresh/REFRESH_PROJECT_LIST')
              setTimeout(() => {
                this.$store
                  .dispatch('tagsView/closeCurrentTag', this.$route)
                  .then(() => {
                    this.$router.push(this.$route.meta.from)
                  })
              }, 2000)
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {})
    },
    // 发起审批
    handleSubmitClick(approve_type) {},
    handleRepeatDialogConfirm(tempObj) {}
  },
  computed: {
    foundBtn() {
      return +this.projectStatus === 0;
    },
    approvalBtn() {
      return +this.projectStatus === 3;
    },
    changeBtn() {
      return +this.projectStatus === 7;
    },
    endBtn() {
      return +this.projectStatus === 12;
    },
    projectName() {
      if (!this.projectInfo) return "";
      return this.projectInfo.projectName;
    },
    projectStatus() {
      if (!this.projectInfo) return 0;
      return this.projectInfo.projectStatus;
    }
  }
};

</script>
<style lang="scss">
.project-detail-page {
  overflow: hidden;

  .status {
    display: inline-block;
    padding: 0 10px;
    font-size: 12px;
    line-height: 22px;
    color: #3399cc !important;
    border: 1px dashed #99cce6;
    border-radius: 3px;
    background: #f1fcfc;
  }
}

</style>
