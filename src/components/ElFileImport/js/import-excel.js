import XLSX from 'xlsx'
import dayjs from 'dayjs'

function _clearLine(str) {
  if (typeof str === 'string') {
    return str.replace(/[\r\n]/g, '')
  } else {
    return str
  }
}

// 检查模板是否匹配
export function checkTemplate(data, listHead = [], fieldMap) {
  if (!data) return
  if (listHead.length) {
    for (let i = 0; i < listHead.length; i++) {
      const item = listHead[i]
      if (item.length !== data[i].length) {
        return
      }
      for (let j = 0; j < item.length; j++) {
        if (item[j].trim() != data[i][j].trim()) {
          return
        }
      }
    }
  } else {
    const fields = fieldMap.map(item => item.title)
    const titleKeys = data[0].filter(item => item)
    if (titleKeys.length !== fields.length) return
    // 校验表头字段和顺序是否一致
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].trim() !== titleKeys[i].trim()) {
        // console.log(fields[i].trim(), titleKeys[i].trim())
        return
      }
    }
  }
  return true
}

function formatDate(number, format = '-') {
  if (!Number(number)) return
  const time = new Date((number - 1) * 24 * 3600000 + 1)
  time.setYear(time.getFullYear() - 70)
  const year = time.getFullYear() + ''
  const month = time.getMonth() + 1 + ''
  const date = time.getDate() - 1 + ''
  return dayjs(year + format + month + format + date).valueOf()
}

// excel数据转带字段名的json格式
export function transferData(ctx, data, listHead, fieldMap) {
  const newData = []
  const fieldObj = {}
  fieldMap.forEach(item => {
    fieldObj[item.title] = item.field
  })
  let valid = true
  const startIndex = listHead.length || 1
  const tempData = data.slice(startIndex)
  for (let i = 0; i < tempData.length; i++) {
    const item = tempData[i]
    let isEmpty = true
    const obj = {}
    for (let j = 0; j < fieldMap.length; j++) {
      let value = item[j]
      if (value) {
        isEmpty = false
      }
      const tempObj = fieldMap[j]
      if (tempObj.type && value !== '') {
        switch (tempObj.type) {
          case 'date':
            value = formatDate(value)
            if (!value) {
              valid = false
            }
            break
          case 'money':
            if (typeof value !== 'number') {
              valid = false
            }
            break
        }
        if (!valid) return ctx.$showToast(`${tempObj.title}格式不正确！`, 'warning')
      }
      obj[_clearLine(tempObj.field)] = value
    }
    // 过滤空数据
    if (!isEmpty) {
      newData.push(obj)
    }
  }
  if (!newData.length) {
    return ctx.$showToast('导入失败，导入数据不能为空！', 'warning')
  }
  return newData
}

// 获取excel的数据
export function getExcelData(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    const dataSheets = []
    const dataBody = []
    fileReader.onload = (ev) => {
      try {
        const data = ev.target.result
        const workbook = XLSX.read(data, {
          type: 'array'
        })
        // const workbook = XLSX.read(data, {
        //   type: 'binary'
        // }) // 以二进制流方式读取得到整份excel表格对象
        const sheetNames = workbook.SheetNames // 获取表名
        sheetNames.forEach(name => {
          const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[name], {
            header: 1,
            defval: ''
          })
          dataSheets.push(name)
          dataBody.push(sheet)
        })
      } catch (e) {
        console.log(e)
      }
    }
    fileReader.readAsArrayBuffer(file)
    fileReader.onloadend = () => {
      resolve({
        dataSheets,
        dataBody
      })
    }
  })
}
