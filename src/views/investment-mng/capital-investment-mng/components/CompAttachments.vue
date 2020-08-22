<template>
  <div class="comp-attachments-info">
    <header class="attachments-header attachments-item">
      <div class="text-center">资料类型</div>
      <div>
        <el-checkbox :disabled="!canEdit" v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">资料附件</el-checkbox>
      </div>
      <div>
        <el-button :disabled="!canEdit" type="primary" size="mini" @click="handleBatchDownload">批量下载</el-button>
        <el-button :disabled="!canEdit" type="primary" size="mini" @click="handleBatchDelete">批量删除</el-button>
      </div>
    </header>
    <div class="attachments-body">
      <comp-attachments-item v-for="(item, index) in attachConfigs" ref="attachmentItems" :key="index" :title="item.label" :data-list="item.attachmentList" :can-edit="canEdit" />
    </div>
    <div style="height: 10px;" />
    <dialog-attachment-upload v-if="dialogStatus" :dialog-status.sync="dialogStatus" :upload-params="uploadParams" @dialog-confirm="handleDialogConfirm" />
  </div>
</template>

<script>
import CompAttachmentsItem from './CompAttachmentsItem.vue'
import DialogAttachmentUpload from './DialogAttachmentUpload.vue'
import { attachmentList, attachmentDeleteAById } from 'api/investment-mng/api-capital-investment-mng.js'
import { attachmentMaintainList } from 'api/run-module/attachment-setting.js'
import { queryDictItems, formSubmit } from 'utils'
import { bacthAttachmentDownload } from 'api/file-system.js'

export default {
  components: {
    CompAttachmentsItem,
    DialogAttachmentUpload
  },
  props: {
    routeParams: {
      type: Object,
      default: () => ({})
    },
    flowInfo: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    canEdit() {
      return this.routeParams.hasOwnProperty('canEdit') ? this.routeParams.canEdit : true
    }
  },
  data() {
    return {
      checkAll: false,
      attachConfigs: [],
      dialogStatus: false,
      isIndeterminate: false,
      uploadParams: null
    }
  },
  created() {
    this.getAttachmentList()
  },
  deactivated() {
    this.$parent.validateForm()
  },
  methods: {
    getAttachmentList() {
      let reqs = [
        attachmentMaintainList({
          dto: {},
          pageSize: 1000,
          pageNum: 1
        })
      ]
      if(this.routeParams.loanId) {
        reqs.push(attachmentList({
          loanId: this.routeParams.loanId
        }))
      }
      let attachmentData = [
        {dataType: "0", fileList: []},
        {dataType: "1", fileList: []},
        {dataType: "2", fileList: []},
        {dataType: "3", fileList: []},
        {dataType: "4", fileList: []},
        {dataType: "5", fileList: []}
      ]
      Promise.all(reqs).then(res => {
        let [attachmentTypes] = res
        if(res.length > 1) {
          const tempAttachmentData = res[1]
          if (tempAttachmentData.data && Array.isArray(tempAttachmentData.data.records) && tempAttachmentData.data.records.length) {
            attachmentData = tempAttachmentData.data.records
          }
        }
        if (attachmentTypes.data && Array.isArray(attachmentTypes.data.pdmList)) {
          attachmentTypes = attachmentTypes.data.pdmList
        }

        const loanAttachmentArr = queryDictItems('10060')
        const loanAttachmentObj = {}
        loanAttachmentArr.forEach(item => {
          loanAttachmentObj[item.value] = item.label
        })
        attachmentData.forEach(item => {
          item.label = loanAttachmentObj[item.dataType] || (item.dataType === '5' ? '审批要件（根据审批结论系统自动生成）' : '')
          item.attachmentList = attachmentTypes.filter(o => o.menuType === '0' && o.dataType === item.dataType)
          item.attachmentList.forEach(o => {
            o.files = item.fileList.filter(file => file.fileType === o.enclosureId).map(i => {
              return {
                name: i.fileName,
                id: i.id,
                fileId: i.fileId,
                sysEtime: i.sysEtime,
                sysEditorId: i.sysEditorId
              }
            })
          })
          delete item.fileList
        })
        const lastItem = attachmentData.pop()
        attachmentData.unshift(lastItem)
        this.attachConfigs = attachmentData
      }).catch(err => {
        console.log(err)
      })
    },
    // 显示附件上传弹框
    showUploadDialog(params) {
      this.uploadParams = params
      this.dialogStatus = true
    },
    // 全选or清空勾选
    handleCheckAllChange(val) {
      this.$refs.attachmentItems.map(compInstance => {
        compInstance.setAllOrEmpty(val)
      })
    },
    // 复选框change事件
    handleChildCheckChange() {
      const isCheckedAll = this.$refs.attachmentItems.every(compInstance => compInstance.getCheckedStatus() === 'all')
      if (isCheckedAll) {
        this.checkAll = true
        this.isIndeterminate = false
        return
      }
      const isCheckedEmpty = this.$refs.attachmentItems.every(compInstance => compInstance.getCheckedStatus() === 0)
      if (isCheckedEmpty) {
        this.checkAll = false
        this.isIndeterminate = false
      } else {
        this.isIndeterminate = true
      }
    },
    // 批量下载
    handleBatchDownload() {
      const ids = this.getCheckedList()
      if (!ids.length) return this.$showToast('请选择需要下载的文件！', 'warning')
      formSubmit(bacthAttachmentDownload, { ids })
    },
    // 批量删除
    handleBatchDelete() {
      const ids = this.getCheckedList()
      if (!ids.length) return this.$showToast('请选择需要删除的文件！', 'warning')
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          attachmentDeleteAById({
            ids
          }, { showLoading: true }).then(res => {
            this.$showToast('删除成功！', 'success')
            this.deleteFilefromPage(ids)
          }).catch(err => {
            console.log(err)
          })
        })
        .catch(() => {})
    },
    // 从页面移除已删除的文件
    deleteFilefromPage(ids) {
      this.attachConfigs.forEach(item => {
        item.attachmentList.forEach(attach => {
          const idxArr = []
          attach.files.forEach((file, index) => {
            if (ids.includes(file.id)) {
              idxArr.push(index)
            }
          })
          idxArr.forEach(idx => {
            attach.files.splice(idx, 1)
          })
        })
      })
    },
    // 获取选中项
    getCheckedList() {
      const tempArr = []
      this.$refs.attachmentItems.forEach(compInstance => {
        tempArr.push(...compInstance.getCheckedList())
      })
      return tempArr
    },
    // 附件上传完成回调
    handleDialogConfirm(files) {
      if (files) {
        files.forEach(file => {
          let target = this.attachConfigs.filter(item => item.dataType === file.dataType)[0]
          target = target.attachmentList.filter(item => item.enclosureId === file.enclosureId)[0]
          if (target) {
            target.files.push({
              name: file.name,
              id: file.id,
              fileId: file.fileId,
              sysEtime: file.sysEtime,
              sysEditorId: file.sysEditorId
            })
          }
        })
      }
    },
    validateForm() {
      return new Promise((resolve, reject) => {
        const ret = this.judgeNecessaryAttachmentIfUpload()
        if (!ret) {
          return resolve({
            attachment: {
              hasNecessary: true
            }
          })
        }
        const fileLists = []
        this.attachConfigs.forEach(item => {
          item.attachmentList.forEach(attach => {
            attach.files.forEach((file, index) => {
              fileLists.push({
                fileId: file.id,
                dataType: attach.dataType,
                enclosureId: attach.enclosureId,
                menuType: attach.menuType
              })
            })
          })
        })
        return resolve({
          attachment: {
            hasNecessary: false,
            fileLists
          }
        })
      })
    },
    // 判断必须附件类型是否上传了附件
    judgeNecessaryAttachmentIfUpload() {
      return this.attachConfigs.every(item => {
        return item.attachmentList.every(attach => {
          if (attach.isNecessary === '1') {
            if (attach.files.length) {
              return true
            }
            return false
          }
          return true
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.comp-attachments-info {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 10px;
  color: #606266;
  .attachments-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #E3E8EE;
    background: #EEF1F6;
    & > div {
      width: 33.333%;
      padding: 0px 10px;
      line-height: 42px;
      border-left: 1px solid #E3E8EE;
      &:last-child {
        text-align: right;
        border-right: 1px solid #E3E8EE;
      }
    }
  }
  .attachments-body {
    overflow-y: auto;
    max-height: 100%;
    border: 1px solid #E3E8EE;
    border-top: none;
  }
}

</style>
