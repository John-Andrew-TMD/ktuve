import {
  thousandSeparator,
  queryDictValue,
  amountDisplayedByChinese,
  queryChinaRegionByIds,
  queryIndustryByIds,
  timestampFormat
} from 'utils'
function transformValueByMethod(method, val, rowIndex) {
  if (method === '') return val
  switch (method) {
    case 'serial':
      if(val === '合计') return val
      return rowIndex + 1 + ''
    case 'date':
      return timestampFormat(val, 'YYYY-MM-DD')
    case 'datetime':
      return timestampFormat(val)
    case 'address':
      return queryChinaRegionByIds(val)
    case 'amount':
      return thousandSeparator(val) + ''
    case 'amount_cn':
      return amountDisplayedByChinese(val)
    case 'industry':
      return queryIndustryByIds(val)
    default:
      if (method.startsWith('dict')) {
        const dictNo = method.split('_')[1] || ''
        if (dictNo === '') {
          return val
        } else {
          return queryDictValue(dictNo, val)
        }
      } else {
        return val
      }
  }
}

function getTotalData(data, column, methods) {
  const totalObj = {}
  column.forEach((col, index) => {
    if (index === 0) {
      totalObj[col] = '合计'
      return
    }
    let sum = 0
    data.forEach(item => {
      if (methods[index] === 'amount') {
        sum += parseFloat(item[col] || 0)
      } else {
        sum = ''
      }
    })
    totalObj[col] = sum + ''
  })
  return totalObj
}

export const getControlVals = (tags, data) => {
  const tempObj = {}
  const tempTableObj = {}
  try {
    tags.forEach((tag, index) => {
      if (tag !== '' && tag != null) {
        const [key, method = ''] = (tag + '').split('|')
        if (data[key] == null || data[key] === '') return

        if (key.startsWith('Table')) {
          tempTableObj[key] = {
            ...data[key],
            tag
          }
        } else {
          tempObj[tag] = transformValueByMethod(method, data[key], index)
        }
      }
    })
  } catch(err) {
    console.log(err)
  }

  return {
    tagsVals: tempObj,
    tableVals: tempTableObj
  }
}

export const getTableVals = data => {
  const { column = [], total = '0', value = [], tag } = data
  if (!column.length || !value.length) return {
    tableData: [],
    tableCellsData: [],
    tag
  }

  const columnValueMethods = (tag + '').split('|')
  columnValueMethods.shift()
  // 需要合计
  if (total == '1') {
    const totalData = getTotalData(value, column, columnValueMethods)
    value.push(totalData)
  }

  const tableContent = []
  value.forEach((item, rowIndex) => {
    column.forEach((col, colIndex) => {
      // const cellText = {
      //   tag,
      //   rowIndex: rowIndex + 1, // 单元格行号
      //   cellIndex: colIndex, // 单元格列
      //   text: this.transformValueByMethod(columnValueMethods[colIndex], (item[col] || '') + '', rowIndex) // 文本
      // }
      // _this.docEditor.setCellText(cellText)
      tableContent.push({
        rowIndex: rowIndex + 1, // 单元格行号
        cellIndex: colIndex, // 单元格列
        text: transformValueByMethod(columnValueMethods[colIndex], (item[col] || '') + '', rowIndex, item) // 文本
      })
    })
  })
  return {
    tableData: value,
    tableCellsData: tableContent,
    tag
  }
}
