<template>
  <div class="app-content contract-online-edit-page">
    <div class="app-content-wrapper pd-0">
      <div id="iframeEditor" style="height: 100%;" />
    </div>
  </div>
</template>
<script>
import DocsAPI from './js/officeApi.js'
import { getControlVals, getTableVals } from './js/utils.js'
import { getContractTemplateData } from 'api/contract-module/api-contract-mng.js'
import { getTemplateConfig } from 'api/file-system.js'
import {
  isEmptyObj,
  queryDictValue,
} from 'utils'
export default {
  // name: 'ContractOnlineEdit',
  data() {
    return {}
  },
  created() {
    document.body.classList.add('fullscreen')
    this.getTemplateConfigsAndData()
  },
  methods: {
    getTemplateConfigsAndData() {
      const { businessType, businessId } = this.$route.query
      if (!businessType || !businessId) return this.$showToast('非法参数！')
      Promise.all([
        getTemplateConfig({
          businessId,
          businessType,
          moduleName: 'con',
          fileName: queryDictValue('10053', businessType) + '.doc'
        }),
        getContractTemplateData(
          {
            businessId,
            businessType,
            fileName: 'string'
          },
          { showLoading: true }
        )
      ])
        .then(res => {
          let [config, templateData] = res
          if (isEmptyObj(config.data)) {
            return this.$showToast('合同配置信息获取失败！')
          }
          if (!templateData.data || !templateData.data.templateData) {
            this.$showToast('合同数据获取失败！')
            templateData = null
          } else {
            templateData = templateData.data.templateData
          }
          this.initEditor(config.data, templateData)
        })
        .catch(err => {
          console.log(err)
        })
    },
    initEditor(config, data) {
      const _this = this
      config.events = {
        onDocumentReady() {
          _this.readyTimer && clearTimeout(this.readyTimer)
          window.onlyoffice = _this.docEditor
          _this.readyTimer = setTimeout(() => {
            _this.docEditor.getAllTags()
          }, 100)
        },
        onInfo(events) {
          const { type, tags = [] } = events.data
          if (type === 'pagesChange') {
            const { protocol, host } = window.location
            const watermarkProps = {
              ImageUrl: `${protocol}//${host}${process.env.VUE_APP_FILESERVER_GETEWAY}/statics/files/watermark_diagonal.png`,
              IsDiagonal: false
            }
            if (process.env.NODE_ENV !== 'production') {
              watermarkProps.ImageUrl = 'http://10.220.1.176/ktfcp-fileserver-dev/statics/files/watermark_diagonal.png'
            }
            _this.docEditor.setWatermark(watermarkProps)
          }
          if (type === 'SetCellsTextEnd') {
            _this.docEditor.setTrackRevisions(true)
          }
          if (type === 'getAllTags') {
            _this.setDataToDoc(tags, data)
          }
          if (type === 'SaveStart') {
            _this.$store.commit('app/SHOW_LOADING', { text: '保存中...' })
          } else if (type === 'SaveEnd') {
            console.log(1111)
            _this.$showToast('保存成功！', 'success')
            _this.$store.commit('app/HIDE_LOADING')
          }
        }
      }
      config.documentType = 'text'
      config.document.permissions.trackRevision = false
      config.document.title = data && queryDictValue('10053', data.contractType)
      this.docEditor = new DocsAPI.DocEditor('iframeEditor', config)
    },
    setDataToDoc(tags, data) {
      if (!tags.length || !data) return
      const { tagsVals, tableVals } = getControlVals(tags, data)
      this.docEditor.setContentControlTexts({
        initData: true,
        clearNonEditContent: false,
        canEditControlTags: [],
        content: tagsVals
      })
      // tempTableObj = {
      //   rentPlanData: {
      //     ...data.rentPlanData,
      //     tag: 'rentPlanData||date|amount|amount|amount|amount'
      //   }
      // }
      // 表格值反显
      if (!isEmptyObj(tableVals)) {
        this.$nextTick(() => {
          this.displayTableData(tableVals)
        })
      } else {
        this.docEditor.setTrackRevisions(true)
      }
    },
    displayTableData(obj) {
      const _this = this
      Object.keys(obj).forEach(key => {
        const ret = getTableVals(obj[key])

        if (!ret) return
        const { tableData, tableCellsData, tag } = ret
        // 删除表格 防止重复添加
        const delData = {
            tag, // 表格所在内容控件的tag
            rowIndex: 1,  // 要删除的行
            bToEnd: true // 是否删除该行后面的所有行
        };
        _this.docEditor.removeTableRow(delData);

        tableData.forEach((item, index) => {
          _this.docEditor.addRowBelow({
            tag,
            rowIndex: index
          })
        })
        _this.$nextTick(() => {
          _this.docEditor.setCellsText({
            tag,
            content: tableCellsData
          })
        })
      })
    }
  }
}
// const config = {
//   "document": {
//     // "fileType": "doc",
//     "key": "42_1593741383",
//     "permissions": {
//       "comment": true,
//       "download": true,
//       "edit": true,
//       "fillForms": true,
//       "modifyContentControl": true,
//       "modifyFilter": true,
//       "print": false,
//       "review": true
//     },
//     // "title": "word文档.doc",
//     "url": 'http://10.220.1.176:8080/ktfcp-fileserver-dev//IFileDetailBusiness/getAttachment?id=1280851249222156289'
//   },
//   "documentType": "text",
//   "editorConfig": {
//     "callbackUrl": "http://10.220.1.176:8080/ktfcp-fileserver-dev//onlineOffice/callback",
//     "customization": {
//       "autosave": false,
//       "chat": true,
//       "commentAuthorOnly": false,
//       "comments": true,
//       "compactHeader": false,
//       "compactToolbar": false,
//       "forcesave": false,
//       "help": false,
//       "hideRightMenu": false,
//       "mentionShare": false,
//       "showReviewChanges": false,
//       "spellcheck": false,
//       "toolbarNoTabs": false,
//       "zoom": 0
//     },
//     "lang": "zh",
//     "user": {
//       "id": "1",
//       "name": "admin"
//     }
//   },
//   "type": "desktop",
//   "events": {
//     onDocumentReady() {
//     }
//   }
// }
// this.docEditor = new DocsAPI.DocEditor("iframeEditor", config);
</script>
<style ltaang='scss'>
.contract-online-edit-page {
  padding: 0;
}

</style>
