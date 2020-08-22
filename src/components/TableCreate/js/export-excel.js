import fileSaver from 'file-saver'
import {
  deepAssign
} from 'utils'
import XLSX from 'xlsx/dist/xlsx.core.min.js'
// import XLSX from 'xlsx-style'

function datenum(v, date1904) {
  if (date1904) v += 1462
  var epoch = Date.parse(v)
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000)
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
  return buf
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook()
  this.SheetNames = []
  this.Sheets = {}
}

function sheetFromArrayOfArrays(data, opts) {
  var ws = {}
  var range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  }
  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R
      if (range.s.c > C) range.s.c = C
      if (range.e.r < R) range.e.r = R
      if (range.e.c < C) range.e.c = C
      var cell = {
        v: data[R][C]
      }
      if (cell.v == null) continue
      var cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R
      })

      if (typeof cell.v === 'number') cell.t = 'n'
      else if (typeof cell.v === 'boolean') cell.t = 'b'
      else if (cell.v instanceof Date) {
        cell.t = 'n'
        cell.z = XLSX.SSF._table[14]
        cell.v = datenum(cell.v)
      } else cell.t = 's'

      ws[cell_ref] = cell
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range)
  return ws
}

function exportData({
  multiHeader = [],
  header,
  data,
  filename,
  merges = [],
  autoWidth = true,
  setStyle,
  bookType = 'xlsx'
} = {}) {
  /* original data */
  filename = filename || 'excel-list'
  data = [...data]
  data.unshift(header)

  for (let k = multiHeader.length - 1; k > -1; k--) {
    data.unshift(multiHeader[k])
  }

  var ws_name = 'SheetJS'
  var wb = new Workbook()
  var ws = sheetFromArrayOfArrays(data)

  if (merges.length > 0) {
    if (!ws['!merges']) ws['!merges'] = []
    merges.forEach(item => {
      ws['!merges'].push(XLSX.utils.decode_range(item))
    })
  }

  if (autoWidth) {
    /* 设置worksheet每列的最大宽度*/
    const colWidth = data.map(row => row.map(val => {
      /* 先判断是否为null/undefined*/
      if (val == null) {
        return {
          'wch': 10
        }
      }
      /* 再判断是否为中文*/
      else if (val.toString().charCodeAt(0) > 255) {
        return {
          'wch': val.toString().length * 2
        }
      } else {
        return {
          'wch': val.toString().length
        }
      }
    }))
    /* 设置初始值*/
    let result = null
    if (multiHeader.length && multiHeader[0].length === 1) {
      result = colWidth[1]
    } else {
      result = colWidth[0]
    }
    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (result[j] == null) break
        if (result[j]['wch'] < colWidth[i][j]['wch']) {
          result[j]['wch'] = colWidth[i][j]['wch']
        }
      }
    }
    ws['!cols'] = result
  }

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name)
  wb.Sheets[ws_name] = ws
  // if (setStyle) {
  //   const dataInfo = wb.Sheets[wb.SheetNames[0]]

  //   // 单元格外侧框线
  //   const borderAll = {
  //     top: {
  //       style: 'thin'
  //     },
  //     bottom: {
  //       style: 'thin'
  //     },
  //     left: {
  //       style: 'thin'
  //     },
  //     right: {
  //       style: 'thin'
  //     }
  //   }
  //   // 给所以单元格加上边框
  //   for (var i in dataInfo) {
  //     if (i == '!ref' || i == '!merges' || i == '!cols' || i == 'A1') {

  //     } else {
  //       dataInfo[i + ''].s = {
  //         border: borderAll
  //       }
  //     }
  //   }

  //   dataInfo['A1'].s = {
  //     alignment: {
  //       horizontal: 'center',
  //       vertical: 'center'
  //     }
  //   }
  // }

  var wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: 'binary'
  })
  fileSaver(new Blob([s2ab(wbout)], {
    type: 'application/octet-stream'
  }), `${filename}.${bookType}`)
}

export function exportJson2Excel(data, columns, tableOptions, extraData = [], extraMerges = [], setStyle = false) {
  const tableName = typeof tableOptions === 'object' ? tableOptions.tableName : tableOptions
  const newColumns = setColumns(columns, tableOptions)
  const newData = setData(data, tableOptions)
  const ret = formatJson(newColumns, newData)
  const {
    multiHeader = [], tHeader = [], merges = []
  } = convertToRows(newColumns)
  multiHeader.unshift(...extraData)
  merges.unshift(...extraMerges)
  exportData({
    multiHeader,
    header: tHeader,
    merges,
    data: ret,
    filename: tableName || '导出表',
    autoWidth: true,
    setStyle,
    bookType: 'xlsx'
  })
}

function setData(data, tableOptions) {
  let tempData = []
  if (typeof tableOptions === 'object' && tableOptions.showSerialNumber) {
    data.forEach((item, i) => {
      let obj = {}
      if (item.serial_number) {
        obj = deepAssign({}, item)
      } else {
        obj = deepAssign({}, item, {
          serial_number: `${i + 1}`
        })
      }
      tempData.push(obj)
    })
  } else {
    tempData = data
  }
  return tempData
}

function setColumns(columns, tableOptions) {
  let newColumns = columns.filter(col => col.show && col.attrs.prop !== 'operation')
  newColumns = deepAssign([], newColumns)
  if (typeof tableOptions === 'object' && tableOptions.showSerialNumber) {
    newColumns.unshift({
      attrs: {
        prop: 'serial_number',
        label: '序号'
      }
    })
  }
  return newColumns
}

function convertToRows(originColumns) {
  const hasChildrenCols = originColumns.some(item =>
    Array.isArray(item.children)
  )
  // 无多级表头
  if (!hasChildrenCols) {
    return {
      tHeader: originColumns.map(col => col.attrs.label),
      multiHeader: []
    }
  }
  let maxLevel = 1
  const traverse = (column, parent) => {
    if (parent) {
      column.level = parent.level + 1
      if (maxLevel < column.level) {
        maxLevel = column.level
      }
    }
    if (column.children) {
      let colSpan = 0
      column.children.forEach(subColumn => {
        traverse(subColumn, column)
        colSpan += subColumn.colSpan
      })
      column.colSpan = colSpan
    } else {
      column.colSpan = 1
    }
  }
  // 计算列跨度值
  originColumns.forEach(column => {
    column.level = 1
    traverse(column)
  })

  const rows = []
  for (let i = 0; i < maxLevel; i++) {
    rows.push([])
  }

  const allColumns = getAllColumns(originColumns)
  // 计算行跨度值
  allColumns.forEach(column => {
    if (!column.children) {
      column.rowSpan = maxLevel - column.level + 1
    } else {
      column.rowSpan = 1
    }
    rows[column.level - 1].push(column)
  })
  const headers = Array.from({
    length: rows.length
  }, () => [])
  const merges = []
  // 计算出符合xlsx行列及合并列头数组
  rows.forEach((row, index) => {
    row.forEach((r, i) => {
      let pointer = 0
      while (headers[index][pointer] != null) {
        pointer++
      }
      const alphabet = numToString(pointer + 1)
      headers[index][pointer] = r.attrs.label
      if (r.rowSpan > 1) {
        merges.push(`${alphabet}${index + 1}:${alphabet}${r.rowSpan + index}`)
        for (let j = 1, len = r.rowSpan; j < len; j++) {
          headers[index + j][pointer] = ''
        }
      } else if (r.colSpan > 1) {
        merges.push(`${alphabet}${index + 1}:${numToString(r.colSpan + pointer)}${index + 1}`)
        for (let j = 1, len = r.colSpan; j < len; j++) {
          headers[index][pointer + j] = ''
        }
      }
    })
  })
  return {
    tHeader: headers.pop(),
    multiHeader: headers,
    merges
  }
}

function getAllColumns(columns) {
  const result = []
  columns.forEach(column => {
    if (column.children) {
      result.push(column)
      result.push.apply(result, getAllColumns(column.children))
    } else {
      result.push(column)
    }
  })
  return result
}

function numToString(numm) {
  const stringArray = []
  const numToStringAction = nnum => {
    const num = nnum - 1
    const a = parseInt(num / 26)
    const b = num % 26
    stringArray.push(String.fromCharCode(64 + parseInt(b + 1)))
    if (a > 0) {
      numToStringAction(a)
    }
  }
  numToStringAction(numm)
  return stringArray.reverse().join('')
}

function formatJson(columns, jsonData) {
  function getChildColumns(columns) {
    const result = []
    columns.forEach(column => {
      if (column.children) {
        result.push.apply(result, getChildColumns(column.children))
      } else {
        result.push(column)
      }
    })
    return result
  }
  const newColumns = getChildColumns(columns)
  return jsonData.map(v =>
    newColumns.map(col => {
      if (typeof col.attrs.formatter === 'function') {
        return col.attrs.formatter(v)
      } else {
        return v[col.attrs.prop]
      }
    })
  )
}

