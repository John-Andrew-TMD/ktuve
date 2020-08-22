import { requestPost } from 'utils/fetch.js'

const gateway = process.env.VUE_APP_FILESERVER_GETEWAY
const rungateway = process.env.VUE_APP_RZZL_GETEWAY

/** ** 文件存储配置 ****/
// 获取文件列表
export function fileConfigList(data, options) {
  return requestPost(gateway + '/IFileConfigTable/page', data, options)
}

// 接口新增
export function fileConfigAdd(data, options) {
  return requestPost(gateway + '/IFileConfigTable/save', data, options)
}

// 接口修改
export function fileConfigUpdate(data, options) {
  return requestPost(gateway + '/IFileConfigTable/updateById', data, options)
}

// 接口删除
export function fileConfigDelete(data, options) {
  return requestPost(gateway + '/IFileConfigTable/removeById', data, options)
}

// 根据 ID 查询接口
export function getFileConfigById(data, options) {
  return requestPost(gateway + '/IFileConfigTable/getOne', data, options)
}

/** ** 文件管理 ****/
// 文件下载
export const fileDownload = gateway + '/IFileInfoBusiness/downloadFile'

// 下载临时文件
export const downloadTempFile = gateway + '/IFileInfoBusiness/downloadTempFile'

// 文件上传
export const fileUpload = gateway + '/IFileInfoBusiness/uploadFile'

// 文件记录
export const fileRecords = gateway + '/IFileInfoTable/page'

/** ** 附件管理管理 ****/
// 附件列表
export const attachmentListUrl = gateway + '/IFileDetailTable/page'

export function attachmentList(data, options) {
  return requestPost(gateway + '/IFileDetailTable/page', data, options)
}

// 附件下载
export const attachmentDownload = gateway + '/IFileDetailBusiness/downloadAttachment'

// 批量附件下载
export const bacthAttachmentDownload = gateway + '/IFileDetailBusiness/downloadAttachmentByIds'

// 附件上传
export const attachmentUpload = gateway + '/IFileDetailBusiness/uploadAttachment'

// 附件预览
export const attachmentPreview = gateway + '/IFileDetailBusiness/previewAttachment'

// 附件单个删除
export const attachmentDelete = gateway + '/IFileDetailBusiness/removeById'

// 附件批量删除
export const attachmentBatchDelete = gateway + '/IFileDetailBusiness/removeByIds'

// 更新附件businessid
export const attachmentBusinessIdUpdate = gateway + '/IFileDetailBusiness/updateBusinessId'

//附件模板下载
export const attachmentTempDownload = rungateway + '/ICommonReplaceDownloadTempFile/downTemp'

// 获取模板配置信息
export function getTemplateConfig(data, options) {
	return requestPost(gateway + '/onlineOffice/editConfig', data, options)
}

// 获取模板配置信息
export function getTemplateTags(data, options) {
	return requestPost(gateway + '/onlineOffice/documentTags', data, options)
}

// 生成文档
export function generateDocument(data, options) {
	return requestPost(gateway + '/onlineOffice/generateDocument', data, options)
}






