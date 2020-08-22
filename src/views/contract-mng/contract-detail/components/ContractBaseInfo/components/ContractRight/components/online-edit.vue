<template>
  <div v-loading="showLoading" class="online-doc-container">
    <h6>合同文档</h6>
    <!-- <el-button
            type="primary"
            size="mini"
            v-if="showEdit"
            @click="handleAttachmentClick(null, 'upload', '1')"
            v-permission="200301013"
      >上传</el-button> -->

    <div v-for="(item, index) in docAttachmentList" :key="index" class="online-doc-list">
      <div>
        <img src="@/assets/images/online-doc.png">
      </div>
      <div class="online-doc-meta">
        <p>
          {{ item.contractDocName }}
          <time>{{ item.modifyTime | filterTimestamp }}</time>
        </p>
        <p style="min-height:30px;">
          <span @click="handleView(item,index)">查看</span>
          <span @click="handleDownload(item,index)">下载</span>
          <span v-if="canEdit" @click="handleEdit(item,index)">
            <template v-if="(contractRowInfo.conHistoryVersionDtos!==null)&&isHistory">
              <template v-if="item.contractId">
                在线编辑
              </template>
            </template>
          </span>
        </p>
      </div>
    </div>
    <div v-if="!docAttachmentList.length">
      暂无数据
    </div>
  </div>
</template>

<script>
import { formSubmit, openNewWindow, isEmptyObj, queryDictValue } from 'utils'
import { getContractDocList } from 'api/contract-module/api-contract-attachment.js'
import { getContractTemplateData } from 'api/contract-module/api-contract-mng.js'
import { attachmentPreview, attachmentDownload, getTemplateTags, generateDocument, downloadTempFile } from 'api/file-system.js'
import ContractRightMixins from './mixins/ContractRightMixins'
import { getControlVals, getTableVals } from 'views/contract-mng/contract-online-edit/js/utils.js'
export default {
  mixins: [ContractRightMixins],
  props: {
    contractRowInfo: {
      type: Object,
      default: () => ({})
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  inject: ['getContractInfoField'],
  data() {
    return {
      docAttachmentList: [],
      showLoading: true
    }
  },
  watch: {
    contractRowInfo: {
      handler(obj) {
        if (!isEmptyObj(obj)) {
          this.getContractDoc()
        }
      },
      immediate: true
    }
  },
  methods: {
    getContractDoc() {
      this.showLoading = true
      getContractDocList({
        contractId: this.contractRowInfo.id,
        contractType: this.contractRowInfo.contractType
      })
        .then(res => {
          if (res.data && Array.isArray(res.data.records) && res.data.records.length) {
            this.docAttachmentList = res.data.records
          }
        })
        .catch(err => {
          console.log(err)
        }).finally(() => {
          this.showLoading = false
        })
    },
    handleEdit(data, index) {
      openNewWindow('/contract-mng/contract-online-edit', {
        businessType: data.contractType,
        businessId: data.contractId,
        contractType: data.contractType
      })
    },
    handleView(data) {
      if(data.fileId && !data.contractId){
        formSubmit(attachmentPreview, { id: data.fileId }, 'get', '_blank')
        return
        // return this.$showToast('请去在线编辑', 'warning')
      }
      this.combineTemplateData(data, 'view')
    },
    handleDownload(data) {
      if(data.fileId && !data.contractId){
        formSubmit(attachmentDownload, { id: data.fileId })
        return
        // return this.$showToast('请去在线编辑', 'warning')
      }
      this.combineTemplateData(data, 'download')
    },
    combineTemplateData(data, type) {
      const { contractId, contractType } = data
      const fileName = queryDictValue('10053', contractType)
      Promise.all([
        getTemplateTags({
          businessId: contractId,
          businessType: contractType,
          moduleName: 'con',
          fileName: `${fileName}.doc`
        }, { showLoading: true }),
        getContractTemplateData({
          businessId: contractId,
          businessType: contractType,
          fileName: `${fileName}.doc`
        })
      ]).then(res => {
        let [tagsData, templateData] = res
        if(tagsData.data && Array.isArray(tagsData.data.records) && tagsData.data.records.length) {
          tagsData = tagsData.data.records
        } else {
          return this.$showToast('模板内容控件为空！')
        }
        if (!templateData.data || !templateData.data.templateData) {
          return this.$showToast('合同数据获取失败！')
        } else {
          templateData = templateData.data.templateData
        }
        const { tagsVals, tableVals } = getControlVals(tagsData, templateData)
        const tempArr = []
        if(!isEmptyObj(tableVals)) {
          Object.keys(tableVals).forEach(key => {
            const ret = getTableVals(tableVals[key])
            const { tableData, tableCellsData, tag } = ret
            tempArr.push({
              tag,
              rows: tableData.length,
              cellValues: tableCellsData
            })
          })
        }
        this.generateFile({
          contentControlValues: tagsVals,
          editConfigDto: {
            businessId: contractId,
            businessType: contractType,
            moduleName: 'con',
            fileName: `${fileName}.doc`
          },
          tableValues: tempArr
        }, type, fileName)
      }).catch(err => {
        console.log(err)
      })
    },
    generateFile(params, type, fileName) {
      generateDocument(params, { showLoading: true }).then(res => {
        if(res.data) {
          if(type === 'view') {
            window.open(process.env.VUE_APP_FILESERVER_GETEWAY + res.data)
          } else {
            formSubmit(downloadTempFile, {
              path: res.data,
              fileName
            })
          }
        } else {
          this.$showToast('文件生成失败！')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.online-doc-container {
  h6 {
    margin-bottom: 10px;
  }
  .online-doc-list {
    display: flex;
    align-items: center;
    .online-doc-meta {
      margin-left: 30px;
      p {
        line-height: 30px;
      }
      time {
        margin-left: 50px;
        color: #777777;
      }
      span {
        display: inline-block;
        margin-right: 20px;
        cursor: pointer;
        color: #1890FF;
      }
    }
  }
}

</style>
