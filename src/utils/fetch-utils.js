import {
  isEmpty
} from 'utils'
import {
  commonRequest,
  generalRequest
} from 'service'
/**
 * @description xss替换
 * @param {String} str
 */
const replaceChar = str => {
  const xssChar = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    '\n': '&#10;'
  }
  return (str + '').replace(/<|>|&|"|\n/g, v => {
    return xssChar[v]
  })
}

const _addParam2str = (tag, data) => {
  let str = `<${tag} `
  const rec = []
  let currentVal
  if (data) {
    Object.keys(data).map(item => {
      currentVal = data[item]
      if (Array.isArray(currentVal)) {
        rec.push({
          prop: item,
          val: currentVal
        })
      } else {
        currentVal = !isEmpty(currentVal) && replaceChar(currentVal) || ''
        str += `${item}="${currentVal}" `
      }
    })
  }
  if (!rec.length) {
    str += `/>`
  } else {
    str += `>`
    rec.map(item => {
      item.val.map(item1 => {
        str += `<${item.prop}`
        Object.keys(item1).map(item2 => {
          str += ` ${item2}="${!isEmpty(item1[item2]) && replaceChar(item1[item2]) || ''}"`
        })
        str += ` />`
      })
    })
    str += `</tag>`
  }
  return str
}

export const json2XML = obj => {
  let xmlStr = `<?xml version="1.0" encoding="UTF-8"?><request>`
  !Array.isArray(obj) && (obj = [obj])
  obj.map(item => {
    item.param || (item.param = {})
    xmlStr += `<object obj_code="${item.obj_code}" obj_method="${(item.obj_method || 'bexData')}">`
    xmlStr += _addParam2str('param', item.param)
    xmlStr += _addParam2str('param_ext', item.param_ext)
    xmlStr += _addParam2str('param_act', item.param_act || {
      menu_id: ''
    })
    xmlStr += `</object>`
  })
  xmlStr += `</request>`
  return xmlStr
}

const xssChar = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;'
}

const _xssEscape = obj => {
  const str = JSON.stringify(obj).replace(/<|>|&/g, v => xssChar[v])
  return JSON.parse(str)
}

/**
 * @description 公共请求
 * @param {Object} params 请求参数
 * @param {Object} options 额外控制参数
 * @param {Boolean} isGeneralRequest 一般请求，即不通过功能号请求
 */
export const promiseRequest = (params, options = {}, isGeneralRequest = false) => {
  if (isGeneralRequest) {
    const {
      url,
      method = 'post',
      data = {}
    } = params
    const defaultOptions = {
      paramsType: 'urlencoded',
      captureError: true,
      notStandard: true
    }
    options = Object.assign(defaultOptions, options)
    return generalRequest(url, method, data, options)
  } else {
    const paramsArr = Array.isArray(params) ? params : [params]
    const requestParams = []
    paramsArr.map(item => {
      const {
        code,
        data = {},
        ext = {},
        act = {}
      } = item
      requestParams.push({
        obj_code: code,
        param: data,
        param_ext: ext,
        param_act: act
      })
    })
    return commonRequest(requestParams, options)
  }
}
