
/**
 *  预览之前先判断是否是可预览的文件
 * @param {String} fileType 文件的类型
 */
export const isPreviewFile = (fileType) => {
  switch (fileType) {
    case 'xls':
    case 'xlsx':
    case 'doc':
    case 'docx':
    case 'jpg':
    case 'gif':
    case 'png':
    case 'bmp':
    case 'txt':
    case 'log':
    case 'pdf':
    case 'ppt':
    case 'pptx':
    case 'jpeg':
      return true
      // 这个break不可省略,因为很多编译器不标准,虽然有return 所以还是需要写标准的写法
      break; 
    default:
      return false
      break;
  }
}

