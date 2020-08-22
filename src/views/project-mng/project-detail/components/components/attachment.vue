<template>
  <div id="project-detail-attachment-page" class="project-detail-attachment-page">
    <div class="file-wrapper">
      <el-row class="header">
        <el-col :span="10">资料类型</el-col>
        <el-col :span="14">
          <el-checkbox
            v-model="checkedAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckedAll"
          ></el-checkbox>资料附件
          <el-button
            style="right:100px;"
            type="danger"
            size="mini"
            plain
            @click="handleBatchDelete"
          >批量删除</el-button>
          <el-button type="primary" size="mini" plain @click="handleBatchDownload">批量下载</el-button>
        </el-col>
      </el-row>
      <div class="body">
        <el-row v-for="(item,index) in fileList" :key="index">
          <template v-if="item.fileType==isApprove">
            <el-row :span="24" class="attachment-title file-left">
              <div class="file-title">{{item.fileName}}</div>
            </el-row>
            <el-row v-for="(file,idx) in item.fileList" :key="idx" :span="24">
              <el-col :span="10" class="file-left">
                <div class="sfile-title">{{file.dataContent}}</div>
                <div>
                  <el-button
                    v-if="file.showDownTemp!='0'"
                    type="primary"
                    size="mini"
                    plain
                    @click="handleTempDownload(idx)"
                  >下载模板</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    plain
                    v-if="file.showupload=='1'"
                    @click="handleUpload(item.fileType,file)"
                  >上传</el-button>
                </div>
              </el-col>
              <el-col :span="14" class="file-right">
                <div v-for="(attach,enclosureIndex) in file.enclosureList" :key="enclosureIndex">
                  <div class="file-name">
                    <el-checkbox-group v-model="checked" @change="handleChecked">
                      <el-checkbox :label="attach" :value="attach" :key="attach"></el-checkbox>
                    </el-checkbox-group>
                    {{attach.fileName}}
                  </div>
                  <div
                    class="file-time"
                  >{{attach.sysCreatorId |filterUserInfo}} {{attach.sysCtime|filterTimestamp}}</div>
                  <div class="file-btns">
                    <template>
                      <el-button
                        size="mini"
                        v-if="attach.showView!='0'"
                        type="text"
                        @click="handleView(attach)"
                      >查看</el-button>
                      <el-button
                        size="mini"
                        v-if="attach.showDown!='0'"
                        type="text"
                        @click="handleDownload(attach)"
                      >下载</el-button>
                      <el-button
                        size="mini"
                        v-if="attach.showDelete!='0'"
                        type="text"
                        @click="handleDel(attach)"
                      >删除</el-button>
                    </template>
                  </div>
                </div>
              </el-col>
            </el-row>
          </template>
          <template v-else>
            <el-row :span="24" class="attachment-title file-left">
              <div class="file-title">{{item.fileName}}</div>
              <div>
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  v-if="item.showupload!='0'"
                  @click="handleUpload(item.fileType,item)"
                >上传</el-button>
              </div>
            </el-row>
            <el-row
              :span="24"
              v-for="(attach,enclosureIndex) in item.fileList"
              :key="enclosureIndex"
            >
              <el-col :span="10" class="file-left">
                <div class="sfile-title">{{attach.dataContent}}</div>
              </el-col>
              <el-col :span="14" class="file-right">
                <div>
                  <div class="file-name">
                    <el-checkbox-group v-model="checked" @change="handleChecked">
                      <el-checkbox :label="attach" :value="attach" :key="attach"></el-checkbox>
                    </el-checkbox-group>
                    {{attach.fileName}}
                  </div>
                  <div
                    class="file-time"
                  >{{attach.sysCreatorId | filterUserInfo }} {{attach.sysCtime|filterTimestamp}}</div>
                  <div class="file-btns">
                    <template>
                      <el-button
                        size="mini"
                        v-if="attach.showView!='0'"
                        type="text"
                        @click="handleView(attach)"
                      >查看</el-button>
                      <el-button
                        size="mini"
                        v-if="attach.showDown!='0'"
                        type="text"
                        @click="handleDownload(attach)"
                      >下载</el-button>
                      <el-button
                        size="mini"
                        v-if="attach.showDelete!='0'"
                        type="text"
                        @click="handleDel(attach)"
                      >删除</el-button>
                    </template>
                  </div>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-row>
      </div>
    </div>
    <attachment-diaLog
      v-if="dialogStatus"
      ref="attachmentDialog"
      :key="key"
      :isApprove="isApprove"
      :dialogStatus="dialogStatus"
      @iniFileData="iniFileData"
      @handleDialogClosed="handleDialogClosed"
      :route-params="routeParams"
      :project-info="projectInfo"
      :file_info="file_info"
      :file_type="file_type"
      :process-instance-id="flowInfo.processInstanceId"
    ></attachment-diaLog>
  </div>
</template>

<script>
import UploadDialog from "components/Upload/uploadDialog";
import attachmentDiaLog from "./attachmentDiaLog.vue";
import {
  attachmentPreview,
  attachmentDownload,
  bacthAttachmentDownload,
  attachmentTempDownload
} from "api/file-system.js";
import { timestampFormat, isEmptyObj, formSubmit } from "utils";
import {
  getPage,
  pmmEnclosure,
  getPageImportant,
  getRemoveByIds,
  getIPmmEnclosureBusinessSave,
  getIPmmEnclosureQueryAll
} from "api/project-module/api-project-attachment.js";
// 文件类型
const FILE_TYPE = {
  approve_require: "5", // 审批要件
  lessee: "1", // 承租人资料
  bail: "2", //转让方资料
  project_file: "0", // 项目资料
  guarantor_file: "3", //担保人资料
  other: "4" // 其它资料
};
export default {
  data() {
    return {
      isApprove: FILE_TYPE.approve_require,
      checkedAll: false,
      isIndeterminate: true,
      checked: [],
      // pmmList: [],
      key: 1,
      fileList: [
        {
          fileName: "审批要件（根据审批结论系统自动生成）",
          fileType: FILE_TYPE.approve_require,
          fileList: []
        },
        {
          fileName: "项目资料",
          fileType: FILE_TYPE.project_file,
          fileList: []
        },
        { fileName: "承租人资料", fileType: FILE_TYPE.lessee, fileList: [] },
        {
          fileName: "转让方资料",
          fileType: FILE_TYPE.bail,
          fileList: []
        },
        {
          fileName: "担保人资料",
          fileType: FILE_TYPE.guarantor_file,
          fileList: []
        },
        { fileName: "其它资料", fileType: FILE_TYPE.other, fileList: [] }
      ],
      dialogStatus: false,
      file_type: "", // 文件类型
      // fileLimit: 1, // 一次可上传的文件数量
      file_info: {},
      files: [],
      // fileIds: [] // 文件id集合
    };
  },
  props:{
    routeParams:{
      type:Object,
      default:{}
    },
    projectInfo:{
       type:Object,
      default:{}
    },
    flowInfo:{
       type:Object,
      default:{}
    }
  },
  async created() {
    this.iniFileData();
  },
  methods: {
    iniFileData() {
      this.checked = [];
      this.getAttachmentList();
      // this.getPageImportant();
    },
    // getPageImportant() {
    //   getPageImportant(
    //     { recordId: this.projectInfo.recordId },
    //     { showloading: true }
    //   ).then(res => {
    //     if (res.data) {
    //       let { records } = res.data || [];
    //       records.forEach(item => {
    //         item.enclosureList.forEach(file => {
    //           this.files.push(file);
    //         });
    //       });
    //       this.fileList[0].fileList = res.data.records;
    //     }
    //   });
    // },
    // 获取附件列表
    async getAttachmentList() {
      let newfileList =
        this.fileList && this.fileList.slice(-parseInt(this.isApprove));
      let params = {};
      let { businessType = "", recordId = "" } = this.projectInfo || {};
      params = { ...params, businessType, recordId };
      getIPmmEnclosureQueryAll(params, { showloading: true }).then(res => {
        let pageData = res.data.pageData;
        let importantData = res.data.importantData;
        pageData.forEach((item, index) => {
          let fileListItem =  this.fileList.filter(el=>el.fileType==item.dataType)[0]
           fileListItem.showupload = item.showupload
           fileListItem.fileList = item.fileList
           fileListItem.fileList.map(el=>{
            this.files.push(el)
           })
        });
        importantData.forEach((item, index) => {
          if(item.enclosureList.length){
            item.enclosureList.forEach(file => {
              this.files.push(file);
            });
          }
        })
         this.fileList[0].fileList = importantData;
      });
      // const filePromises = newfileList&&newfileList.map((item,index) => {
      //   return getPage({...params,'dataType':_.get(newfileList[index],'fileType')},{showloading:true})
      // });
      // const results = await Promise.all(filePromises)
      // results.forEach((res,index) => {
      //   if (res.data) {
      //       res.data&&res.data.records.forEach(item => {
      //         this.files.push(item);
      //       });
      //       this.$set(this.fileList,index+1,Object.assign(this.fileList[index + 1],{'fileList':res.data.records}))
      //     }
      // })
    },
    // 上传
    handleUpload(type, file_info) {
      this.file_info = {
        ...file_info,
        ...{ dataType: type },
        ...this.projectInfo
      };
      this.file_type = type;
      this.dialogStatus = true;
    },
    // 查看
    handleView(data) {
      formSubmit(attachmentPreview, { id: data.fileId }, "get", "_blank");
    },
    // 下载
    handleDownload(data) {
      formSubmit(attachmentDownload, { id: data.fileId });
    },
    handleTempDownload(idx) {
      formSubmit(attachmentTempDownload, {
        recordId: this.projectInfo.recordId,
        type: idx + 1
      });
    },
    // 批量下载
    handleBatchDownload() {
      if (!this.checked.length) {
        this.$showToast("请选择需要下载的文件", "warning");
        return;
      }
      const ids = this.checked.map(item => item.fileId);
      formSubmit(bacthAttachmentDownload, { ids });
    },
    handleBatchDelete() {
      if (!this.checked.length) {
        return this.$showToast("请选择需要删除的文件", "warning");
      }
      const ids = this.checked.map(item => item.id);
      const showDelete = this.checked.map(item => item.showDelete);
      if (showDelete.includes("0")) {
        return this.$showToast("存在不可删除的文件", "warning");
      }
      this.$confirm(`确定删除这些文件吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          getRemoveByIds({
            ids
          }).then(res => {
            if (!res.status) {
              this.iniFileData();
              this.$showToast(res.msg, "success");
            }
          });
        })
        .catch(() => {});
    },
    // 删除
    handleDialogClosed(dialogStatus) {
      this.key += 1;
      this.dialogStatus = dialogStatus;
    },
    handleDel(data) {
      const { id } = data;
      this.$confirm(`确定删除${data.fileName}文件吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          getRemoveByIds({
            ids: [data.id]
          }).then(res => {
            if (!res.status) {
              this.iniFileData();
              this.$showToast(res.msg, "success");
            }
          });
        })
        .catch(() => {});
    },
    // 全选
    handleCheckedAll(val) {
      this.checked = val ? this.files : [];
      this.isIndeterminate = false;
    },
    // 单个选择
    handleChecked(value) {
      const idsLength = this.files.length;
      const checkedCount = value.length;
      this.checkedAll = checkedCount === idsLength;
      this.isIndeterminate = checkedCount > 0 && checkedCount < idsLength;
    }
  },
  components: {
    UploadDialog,
    attachmentDiaLog
  }
};
</script>

<style lang="scss">
#project-detail-attachment-page {
  .file-title {
    position: relative;
    padding-left: 40px;
    &::before {
      display: inline-block;
      content: "";
      width: 30px;
      height: 20px;
      position: absolute;
      top: 2px;
      left: -1px;
      background: url("~@/assets/images/big-file.jpg") no-repeat center 0;
    }
  }
  .sfile-title {
    position: relative;
    padding-left: 30px;
    &::before {
      display: inline-block;
      content: "";
      width: 24px;
      height: 24px;
      position: absolute;
      top: 2px;
      left: -1px;
      background: url("~@/assets/images/small-file.jpg") no-repeat center 0;
    }
  }

  .body {
    .attachment-title {
      min-height: 48px;
      padding: 10px;
      line-height: 28px;
    }
    .el-row {
      width: 100%;
    }
  }
}
.project-detail-attachment-page {
  overflow: hidden;
  box-sizing: border-box;
  height: 100%;
  padding: 5px 15px 10px;

  $bdc: #eeeeee;
  .file-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    .el-row {
      > .el-col {
        min-height: 48px;
        padding: 10px;
        line-height: 28px;
        &:last-child {
          border-left: 1px solid $bdc;
        }
        .el-checkbox {
          margin-right: 15px;
        }
      }
    }
  }
  .header {
    position: relative;
    line-height: 28px;
    border: 1px solid #d4e3ff;
    background: #d4e3ff;
    .el-button {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    }
  }
  .body {
    overflow-y: auto;
    flex: 1;
    .el-row {
      border: 1px solid $bdc;
      border-top: 0;
      > .el-col:last-child {
        padding-top: 10px;
      }
    }
    .file-left {
      display: flex;
      justify-content: space-around;
      > div {
        &:first-child {
          flex: 1;
        }
      }
    }
    .file-right > div {
      display: flex;
      justify-content: space-around;
      .el-checkbox-group {
        display: inline-block;
      }
      .el-checkbox__label {
        display: none;
      }
      .file-name {
        overflow: hidden;
        flex: 1;
        margin-right: 30px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .file-time {
        margin-right: 30px;
      }
      .file-btns {
        min-width: 98px;
      }
    }
  }
}
</style>
