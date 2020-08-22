<template>
  <div class="comp-process-dispose-detail">
    <el-timeline class="timeline">
      <el-timeline-item
        v-for="item in nodeData"
        :key="item.id"
        :timestamp="item.rec_username+'-审核'"
        placement="top"
        :color="item.dispose_action != 0 ? '#0bbd87' : ''"
      >
        <el-card>
          <p>
            <label>处理操作：</label>
            {{ item.dispose_action | filterDictValue('20467') }}
          </p>
          <p>
            <label>处理意见：</label>
            {{ item.dispose_suggestion }}
          </p>
          <ul class="file-list" v-if="item.fileList && item.fileList.length">
            <li>
              <label>附件：</label>
            </li>
            <li v-for="(file, index) in item.fileList" :key="index">
              <span>{{ file.original_name }}</span>
              <span class="btn" @click="handleFilePreview(file)">预览</span>
              <span class="btn" @click="handleFileDownload(file)">下载</span>
            </li>
          </ul>
          <p>
            <label>处理时间：</label>
            <time>{{ item.dispose_time }}</time>
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { formSubmit, isEmptyObj } from "utils";
export default {
  data() {
    return {
      nodeData: [],
      needJudgeNodeList: {}
    };
  },
  props: {
    flowInfoObj: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    flowInfoObj(val) {
      if (!val) return;
      this._getProcessDetail();
    }
  },
  methods: {
    _getProcessDetail() {
      this.$promiseRequest(
        [
          {
            code: "100648",
            data: {
              req_id: this.flowInfoObj.req_id
            }
          },
          {
            code: "209208",
            data: {
              business_id: this.$route.query.project_id,
              dflag: 0,
              cust_id: this.flowInfoObj.cust_id
            }
          }
        ],
        { showLoading: true }
      ).then(res => {
        if (res.data.length) {
          //项目流程保密设置
          this._changeProcessDetialAttrs(res.data[0]);
          this._disposeAttachment(res.data);
        }
      });
    },
    _changeProcessDetialAttrs(data) {
      if (data.record.length) {
        if (
          true ||
          ["xiangmujindiao", "xiangmubiangeng", "xiangmuxuyi"].includes(
            this.flowInfoObj.flow_no
          )
        ) {
          data.record.forEach(item => {
            if ((item.node_no == 6 || item.node_no == 10) && item.rec_userid != this.$userId) {
              this.needJudgeNodeList[item.id] = item.node_no;
              item.suggestion_bak = item.dispose_suggestion
              item.dispose_suggestion = "--";
            }
          });
        }
      }
      // 改变操作动作名称，例如 强制跳转-> 退回
      this._changeActionName();
    },
    _changeActionName() {
      // TODO
    },
    _disposeAttachment([nodeData, fileData] = data) {
      if (!fileData.record.length || !nodeData.record.length) return;
      // 过滤判断节点
      nodeData = nodeData.record.filter(item =>
        [0, 1, 2].includes(+item.node_type)
      );
      let inquireArr = [
        "PMM_INQUIRE_1",
        "PMM_INQUIRE_2",
        "PMM_INQUIRE_3",
        "PMM_INQUIRE_4",
        "PMM_INQUIRE_5",
        "PMM_INQUIRE_6"
      ];
      let changeArr = [
        "PMM_CHANGE_1",
        "PMM_CHANGE_2",
        "PMM_CHANGE_3",
        "PMM_CHANGE_4",
        "PMM_CHANGE_5",
        "PMM_CHANGE_6"
      ];
      let fileNameArr = [
        "尽调报告",
        "风控意见书",
        "决策会决议",
        "董事会决议",
        "会议纪要(决策会)",
        "会议纪要(董事会)"
      ];
      nodeData.forEach(item => {
        let fileList = [];
        fileData.record.forEach(file => {
          if (file.wf_run_line_id == item.id) {
            if (inquireArr.includes(file.file_type)) {
              this._changeFileAttrs(file, inquireArr, fileNameArr);
            } else if (changeArr.includes(file.file_type)) {
              this._changeFileAttrs(file, changeArr, fileNameArr);
            }
            fileList.push(file);
          }
        });
        item.fileList = _.cloneDeep(fileList);
      });
      this.nodeData = nodeData.reverse();
      // 根据当前角色判断是否显示处理意见
      this._judgeRole();
    },
    _changeFileAttrs(file, arr, fileNameArr) {
      let idx = arr.indexOf(file.file_type);
      file.file_name = fileNameArr[idx];
      file.original_name = fileNameArr[idx];
      if (idx == "2" || idx == "3") {
        file.onlineview = true;
      }
    },
    handleFilePreview(file) {
      if (file.onlineview) {
        this._filePreviewOnline(file, 1);
      } else {
        window.open(`/onlineView.do?file=${file.rela_path}`);
      }
    },
    handleFileDownload(file) {
      if (file.onlineview) {
        this._fileDownloadOnline(file, 1);
      } else {
        formSubmit(
          "/down.do",
          {
            file_name: file.file_name,
            file_format: file.file_format,
            file_path: file.abs_path
          },
          "get"
        );
      }
    },
    _filePreviewOnline(file, type) {
      let rowData = this._getDueFilesData(file.id, file.file_type);
      this._generateFile(rowData, type, "preview");
    },
    _fileDownloadOnline(file, type) {
      let rowData = this._getDueFilesData(file.id, file.file_type);
      this._generateFile(rowData, type, "download");
    },
    async _generateFile(rowData, type, action) {
      let templateData = await this._queryPmmTemplateData(
        rowData.file_type,
        type
      );
      if (!templateData) {
        return this.$showToast("请求模板内容失败，请重试！");
      }
      this.$promiseRequest(
        {
          url: "/saveFile.do",
          data: {
            obj_code: rowData.obj_code,
            param: rowData,
            file_name: rowData.file_name.slice(0, -4),
            file_path: rowData.file_path,
            json_data: templateData
          }
        },
        { showLoading: true },
        true
      )
        .then(res => {
          if (!res.fileId) {
            return this.$showToast("文件id为空，无法查看!");
          }
          this._getGeneratedFileInfo(res.fileId, action);
        })
        .catch(err => {});
    },
    _getGeneratedFileInfo(fileId, action) {
      this.$promiseRequest(
        {
          code: "209204",
          data: {
            id: fileId
          }
        },
        { showLoading: true }
      )
        .then(res => {
          let data = res.data.record;
          if (!data.length) {
            return this.$showToast("获取文件信息失败!");
          }
          if (action === "preview") {
            window.open(`/onlineView.do?file=${data[0].rela_path}`);
          } else if (action === "download") {
            formSubmit(
              "/down.do",
              {
                file_name: data[0].file_name,
                file_format: data[0].file_format,
                file_path: data[0].abs_path
              },
              "get"
            );
          }
        })
        .catch(err => {});
    },
    _queryPmmTemplateData(file_type, type = "") {
      let code = "";
      if (["PMM_INQUIRE_3", "PMM_CHANGE_3"].includes(file_type)) {
        code = "201054";
      } else {
        code = "201056";
      }
      return this.$promiseRequest({
        code,
        data: {
          project_id: this.$route.query.project_id,
          state: type
        }
      })
        .then(res => {
          if (res.data.record.length) {
            return JSON.stringify(res.data.record[0]);
          } else {
            return false;
          }
        })
        .catch(err => {
          return false;
        });
    },
    _getDueFilesData(template_id, template_type) {
      let flowFileData = {
        obj_code: "",
        file_path: "files\\projectTemp\\pmmBoardResolution.ftl",
        flow_file_url: "",
        flow_file: "",
        file_name: "董事会决议.pdf",
        file_type: template_type,
        template_id: template_id,
        template_type,
        uploader_id: "",
        upload_time: ""
      };
      if (["PMM_INQUIRE_3", "PMM_CHANGE_3"].includes(template_type)) {
        flowFileData.file_path = "files\\projectTemp\\pmmReviewResolution.ftl";
        flowFileData.file_name = "决议会决议.pdf";
      }
      return flowFileData;
    },
    _judgeRole() {
      if (isEmptyObj(this.needJudgeNodeList)) return;
      let currentUserId = this.$userId;
      this.$promiseRequest([
        {
          code: "100210",
          data: {
            roleid: "10015"
          }
        },
        {
          code: "100210",
          data: {
            roleid: "10016"
          }
        }
      ]).then(res => {
        if(!res.data.length) return
        let [boardMember ={}, decisionMember = {}] = res.data
        boardMember = boardMember.record || []
        decisionMember = decisionMember.record || []
        let NodeList = this.needJudgeNodeList
        Object.keys(NodeList).forEach(id => {
          let nodeNo = NodeList[id]
          let ret = []
          if(nodeNo == 10) {
            let ret = boardMember.filter(item => item.userid == currentUserId )

          } else if(nodeNo == 6) {
            let ret = decisionMember.filter(item => item.userid == currentUserId )
          }
          NodeList[id] = !!ret.length
        })
        this.nodeData.forEach(item => {
          // 如果当前用户为董事会成员或决策会成员则显示处理意见
          if(NodeList.hasOwnProperty(item.id) && NodeList[item.id]) {
            item.dispose_suggestion = item.suggestion_bak
          }
        })
        this.needJudgeNodeList = {}
      }).catch(err => {})
    }
  }
};
</script>

<style lang='scss' scoped>
.comp-process-dispose-detail {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  padding: 0 15px;
  .timeline /deep/  {
    box-shadow: none;
    .is-top {
      color: #333333;
    }
    label {
      font-weight: normal;
      color: #999999;
    }
    time {
      color: #999999;
    }
    p {
      line-height: 24px;
    }
    .file-list {
      padding: 5px 10px;
      border-radius: 5px;
      background: #F1F2F3;
      li {
        line-height: 22px;
      }
      .btn {
        cursor: pointer;
        color: #5595FF;
        &:hover {
          text-decoration: underline;
        }
      }
      span:first-child {
        margin-right: 15px;
      }
    }
  }
}

</style>
