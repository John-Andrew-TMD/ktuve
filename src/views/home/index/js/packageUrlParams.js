import { promiseRequest } from '@/utils/fetch-utils'
function _getUrlData(obj, obj_code, params) {
  return promiseRequest({
    code: obj_code,
    data: params
  }, {
    showLoading: true
  })
    .then(res => {
      if (res.data.record.length) {
        return Object.assign({}, obj, res.data.record[0])
      } else {
        return false
      }
    })
    .catch(() => { return false })
}
/**
 * 生成url跳转参数
 * @param {Object} data
 * @param {string|number} type 1:待办流程 2：参与流程 3：创建流程
 */
export default function(data, type = 1) {
  const newData = Object.assign({}, data)
  // 删除不需要的传参
  delete newData.form_page_url
  delete newData.flow_type
  delete newData.flow_title
  delete newData.flow_desc
  newData.line_id = data.id

  let obj_code, params
  const flowArr = data.descript.split('*')
  if (type != 1) {
    let project_flag = false
    if (data.flow_no === 'xiangmubiangeng' || data.flow_no === 'xiangmuxuyi') {
      project_flag = 'backup'
    }
    newData.project_flag = project_flag
    return Promise.resolve(newData)
  }
  switch (data.flow_type) {
    case '投放':
    case '直租放款':
      obj_code = '203001'
      params = {
        id: flowArr[7]
      }
      break
    case '业务归档':
    case '再次归档':
      obj_code = '211000'
      params = {
        file_type: '1',
        project_id: flowArr[4]
      }
      break
    case '评审归档':
      obj_code = '211000'
      params = {
        file_type: '2',
        project_id: flowArr[4]
      }
      break
    default:
      break
  }
  if (!obj_code) {
    return Promise.resolve(newData)
  } else {
    return _getUrlData(newData, obj_code, params)
  }
}
