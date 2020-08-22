// 流程图
function ProcessImage(parentNodeId, id, processImgData, areaHotData = [], width = null, height = null, isShowHotArea = false) {
  // 参数说明：渲染流程图的父节点id，渲染的流程图节点id, 流程图数据，流程图宽度，流程图高度，区域热点数据,是否显示区域热点
  this.parentNode = document.getElementById(parentNodeId)
  this.processImgData = processImgData
  this.areaHotData = filterSameData(areaHotData)
  this.id = id
  this.isShowHotArea = isShowHotArea
  this.width = width
  this.height = height

  // 生成流程图节点
  this.getNodes = function(item, parentSvg, contentNode) {
    var baseInfo = item.graphicInfo // 节点位置坐标和大小
    if (!baseInfo || !item.type) return null // 没有位置坐标和大小信息，直接返回

    switch (item.type.toLowerCase()) {
      case 'startevent': // 开始节点
        new StartNode(parentSvg, item).generate()
        break

      case 'endevent': // 结束节点
        new EndNode(parentSvg, item).generate()
        break

      case 'usertask': // 用户任务
      case 'servicetask': // 服务任务
      case 'receivetask': // 接收任务
        new Task(parentSvg, item, this.areaHotData, contentNode, this.isShowHotArea).generate()
        break

      case 'exclusivegateway': // 单一网关
      case 'parallelgateway': // 并行网关
      case 'eventgateway': // 事件网关
      case 'inclusivegateway': // 排他网关
        new GateWay(parentSvg, item).generate()
        break

      case 'subprocess': // 子流程
      case 'eventsubprocess': // 子流程的事件
      case 'callactivity': // 调用活动
        new SubProcess(parentSvg, item).generate()
        break

      case 'catchsignalevent': // 信号中间捕获事件
      case 'catchtimerevent': // 定时器中间捕获事件
      case 'catchmessageevent': // 消息中间捕获事件
      case 'throwsignalevent': // 信号中间抛出事件
      case 'thrownoneevent': // 无触发中间抛出事件

      case 'boundarytimerevent': // 边界定时事件
      case 'boundaryerrorevent': // 边界出错事件
      case 'boundarysignalevent': // 边界信号事件
      case 'boundarymessageevent': // 边界消息事件
      case 'boundarycancelevent': // 边界取消事件
      case 'boundarycompensationevent': // 边界修正事件
        new MiddleAndBoundaryEvent(parentSvg, item).generate()
        break
    }
  }

  // 生成流程图箭头
  this.getArrows = function(item, parentSvg) {
    var baseInfo = item.graphicInfos // 箭头位置坐标
    if (!baseInfo || !baseInfo.length) return // 没有位置坐标，直接返回
    new Arrow(parentSvg, item).generate()
  }

  // 生成文本关联节点
  this.getTextAnnotation = function(item, parentSvg) {
    var baseInfo = item.graphicInfo // 位置坐标
    if (!baseInfo) return // 没有位置坐标，直接返回
    new TextAnnotation(parentSvg, item).generate()
  }

  // 生成为元素关联文本说明的虚线
  this.getTextAnnotationLine = function(item, parentSvg) {
    var baseInfo = item.graphicInfos // 位置坐标
    if (!baseInfo) return // 没有位置坐标，直接返回
    new TextAnnotationLine(parentSvg, item).generate()
  }

  // 生成流程图
  this.generateImage = function() {
    // 没有父元素直接返回
    if (!this.parentNode) return null

    var data = this.processImgData.processGraphicVos
    if (!data || !data.length) return null

    // 节点数据
    var nodeData = data[0].activityGraphicVos ? data[0].activityGraphicVos : []
    // 箭头数据
    var arrowData = data[0].flowGraphicVos ? data[0].flowGraphicVos : []
    // 文本关联数据
    var textAnnotationData = data[0].textAnnotationGraphicVos ? data[0].textAnnotationGraphicVos : []
    // 文本关联虚线数据
    var textAnnotationLineData = data[0].associationGraphicVos ? data[0].associationGraphicVos : []

    // 画布大小
    var imageContentSize = this.processImgData.canvasSize ? this.processImgData.canvasSize : {}

    // 创建content元素
    var height = document.body.clientHeight - 97 + 'px' // 计算流程图区域高度
    var contentNode = createElement('div', this.parentNode,
      { style: `overflow-y: auto; height: ${height}`, id: this.id })

    // 创建父svg元素
    // 流程图宽度如果小于屏幕宽度，则使用屏幕宽度
    // var width = document.body.clientWidth;
    // var svgWidth = width < imageContentSize.x ? imageContentSize.x : width;
    var attr = {
      width: this.width || imageContentSize.x,
      height: this.height || imageContentSize.y
    }
    var parentSvg = createElement('svg', contentNode, attr, true)

    nodeData.forEach(item => {
      this.getNodes(item, parentSvg, contentNode)
    })
    arrowData.forEach(item => {
      this.getArrows(item, parentSvg)
    })
    textAnnotationData.forEach(item => {
      this.getTextAnnotation(item, parentSvg)
    })
    textAnnotationLineData.forEach(item => {
      this.getTextAnnotationLine(item, parentSvg)
    })
  }
}

// 箭头
function Arrow(parentNode, data) {
  // 参数说明：父节点，数据
  this.parentNode = parentNode
  this.data = data

  this.generate = function() {
    var baseInfo = this.data.graphicInfos // 箭头位置坐标
    var start = baseInfo[0]
    var color = this.data.pass === 'passed' ? '#67C23A' : '#ECECEE' // 填充颜色

    // 计算箭头路径轨迹
    let path = ''
    baseInfo.map((item) => {
      path += `${item.x},${item.y} `
    })

    // 计算文字旋转角度（按第一条线的角度旋转）
    let angle = 0
    let anchor = 'start' // 文字定位坐标默认为start
    let anchorX = start.x + 5
    if (this.data.name) {
      var second = baseInfo[1]
      // 计算直角三角形的斜边
      var xie = Math.sqrt(Math.pow(start.x - second.x, 2) + Math.pow(start.y - second.y, 2))
      // 计算第一条线的旋转角度
      angle = Math.atan((second.y - start.y) / (second.x - start.x)) / (Math.PI / 180)
      var angleSin = Math.asin((second.x - start.x) / xie) / (Math.PI / 180)

      // 如果angleSin>90或<-90,需要调整旋转角度和文字定位坐标
      if (angleSin < 0) {
        anchor = 'end'
        anchorX -= 8
      }
    }

    // 箭头前面的三角形
    var defs = createElement('defs', this.parentNode, {}, true)
    var markerAttr = {
      id: this.data.id,
      markerWidth: 10,
      markerHeight: 10,
      refX: 4,
      refY: 2,
      orient: 'auto',
      markerUnits: 'strokeWidth'
    }
    var marker = createElement('marker', defs, markerAttr, true)
    var pathAttr = {
      d: 'M0,0 L0,4 L4,2 Z',
      fill: this.data.pass === 'passed' ? '#67C23A' : '#ECECEE'
    }
    createElement('path', marker, pathAttr, true)

    // 箭头的线
    var polylineAttr = {
      points: path,
      stroke: color,
      fill: 'none',
      'stroke-width': 2,
      'marker-end': `url(#${this.data.id})`
    }
    createElement('polyline', this.parentNode, polylineAttr, true)

    // 箭头上的文本
    if (this.data.name) {
      var textAttr = {
        x: anchorX,
        y: start.y - 5,
        'font-size': 12,
        'text-anchor': anchor,
        transform: `rotate(${angle},${start.x},${start.y})`
      }
      var text = createElement('text', this.parentNode, textAttr, true)
      text.innerHTML = this.data.name
    }
  }
}

// 结束节点
function EndNode(parentNode, data) {
  // 参数说明：父节点，数据
  this.parentNode = parentNode
  this.data = data

  this.generate = function() {
    var baseInfo = this.data.graphicInfo // 节点位置坐标和大小
    var centerX = baseInfo.x + baseInfo.width / 2 // 节点中心X坐标
    var centerY = baseInfo.y + baseInfo.height / 2 // 节点中心Y坐标
    var strokeColor = this.data.pass === 'passed' ? '#67C23A' : this.data.pass === 'passing' ? '#FF3D71' : '#EDEDEF'

    var ellipseAttr = {
      cx: centerX,
      cy: centerY,
      rx: baseInfo.width / 2,
      ry: baseInfo.height / 2,
      stroke: strokeColor,
      'stroke-width': 4,
      fill: 'none'
    }
    createElement('ellipse', this.parentNode, ellipseAttr, true)
  }
}

// 网关节点
function GateWay(parentNode, data) {
  // 参数说明：父节点，数据
  this.parentNode = parentNode
  this.data = data

  // 网关图标
  this.getIcon = function(parentNode) {
    switch (this.data.type.toLowerCase()) {
      case 'parallelgateway': { // 并行网关
        var pathAttr = {
          d: 'M11.25 20.5 L30.25 20.5 M20.5 11.25 L20.5 30.25',
          fill: 'none',
          stroke: '#000',
          'stroke-width': 3
        }
        createElement('path', parentNode, pathAttr, true)
        break
      }
      case 'eventgateway': { // 事件网关
        var circleAttr = {
          cx: 20.5,
          cy: 20.5,
          r: 12,
          stroke: '#000',
          fill: 'none',
          'stroke-width': 1
        }
        createElement('circle', parentNode, circleAttr, true)
        var pathAttr = {
          d: 'M11.25 18.5  L11.25 22.5  L18.5 22.5  L18.5 29.25  L22.5 29.25  L22.5 22.5  L29.25 22.5  L29.25 18.5  L22.5 18.5  L22.5 11.25  L18.5 11.25  L18.5 18.5  z',
          fill: 'none',
          stroke: '#000',
          'stroke-width': 1
        }
        createElement('path', parentNode, pathAttr, true)
        break
      }
      case 'inclusivegateway': { // 包含网关
        var circleAttr = {
          cx: 20.5,
          cy: 20.5,
          r: 9.75,
          stroke: '#000',
          fill: 'none',
          'stroke-width': 2.5
        }
        createElement('circle', parentNode, circleAttr, true)
        break
      }
      case 'exclusivegateway': // 单一网关
      default:
        return null
    }
  }

  this.generate = function() {
    var baseInfo = this.data.graphicInfo // 位置坐标
    var color = this.data.pass === 'passed' ? '#67C23A' : '#F4E4CB' // 边框颜色

    // 菱形轨迹
    var x = baseInfo.x; var y = baseInfo.y; var w = baseInfo.width; var h = baseInfo.height
    var points = `${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}`

    var polygonAttr = {
      points: points,
      fill: 'none',
      stroke: color,
      'stroke-width': 2
    }
    createElement('polygon', this.parentNode, polygonAttr, true)
    var svgAttr = { x, y }
    var svg = createElement('svg', this.parentNode, svgAttr, true)
    this.getIcon(svg)
  }
}

// 中间事件、边界事件
function MiddleAndBoundaryEvent(parentNode, data) {
  // 参数说明：父节点，数据
  this.parentNode = parentNode
  this.data = data

  // 获取图标
  this.getIcon = function(parentNode) {
    switch (this.data.type.toLowerCase()) {
      case 'catchsignalevent': // 信号中间捕获事件
      case 'boundarysignalevent': { // 边界信号事件
        var pathAttr = {
          d: ' M7.7124971 20.247342  L22.333334 20.247342  L15.022915000000001 7.575951200000001  L7.7124971 20.247342  z',
          stroke: '#585858',
          fill: 'none',
          'stroke-width': 1.4,
          'stroke-miterlimit': 4
        }
        createElement('path', parentNode, pathAttr, true)
        break
      }
      case 'catchtimerevent': // 定时器中间捕获事件
      case 'boundarytimerevent': { // 边界定时事件
        var pathAttr = {
          d: 'M 10 0 C 4.4771525 0 0 4.4771525 0 10 C 0 15.522847 4.4771525 20 10 20 C 15.522847 20 20 15.522847 20 10 C 20 4.4771525 15.522847 1.1842379e-15 10 0 z M 9.09375 1.03125 C 9.2292164 1.0174926 9.362825 1.0389311 9.5 1.03125 L 9.5 3.5 L 10.5 3.5 L 10.5 1.03125 C 15.063526 1.2867831 18.713217 4.9364738 18.96875 9.5 L 16.5 9.5 L 16.5 10.5 L 18.96875 10.5 C 18.713217 15.063526 15.063526 18.713217 10.5 18.96875 L 10.5 16.5 L 9.5 16.5 L 9.5 18.96875 C 4.9364738 18.713217 1.2867831 15.063526 1.03125 10.5 L 3.5 10.5 L 3.5 9.5 L 1.03125 9.5 C 1.279102 5.0736488 4.7225326 1.4751713 9.09375 1.03125 z M 9.5 5 L 9.5 8.0625 C 8.6373007 8.2844627 8 9.0680195 8 10 C 8 11.104569 8.8954305 12 10 12 C 10.931981 12 11.715537 11.362699 11.9375 10.5 L 14 10.5 L 14 9.5 L 11.9375 9.5 C 11.756642 8.7970599 11.20294 8.2433585 10.5 8.0625 L 10.5 5 L 9.5 5 z',
          stroke: '#585858',
          fill: 'none',
          transform: 'translate(5.5,5.5)'
        }
        createElement('path', parentNode, pathAttr, true)
        break
      }
      case 'catchmessageevent': // 消息中间捕获事件
      case 'boundarymessageevent': { // 边界消息事件
        var pathAttr = {
          d: 'M0 2  L8 10  L16 2  L0 2  z M0 4  L0 12  L4 8  L0 4  z M16 4  L12 8  L16 12  L16 4  z M5 9  L0 14  L16 14  L11 9  L8 12  L5 9  z',
          stroke: 'none',
          fill: '#585858',
          transform: 'translate(7,7)',
          'stroke-width': 1
        }
        createElement('path', parentNode, pathAttr, true)
        break
      }
      case 'throwsignalevent': { // 信号中间抛出事件
        var pathAttr = {
          d: 'M7.7124971 20.247342  L22.333334 20.247342  L15.022915000000001 7.575951200000001  L7.7124971 20.247342  z',
          stroke: '#585858',
          fill: '#585858',
          'stroke-miterlimit': 4,
          'stroke-width': 1.4
        }
        createElement('path', parentNode, pathAttr, true)
        break
      }
      case 'boundaryerrorevent': { // 边界出错事件
        var pathAttr = {
          d: 'M21.820839 10.171502  L18.36734 23.58992  L12.541380000000002 13.281818999999999  L8.338651200000001 19.071607  L12.048949000000002 5.832305699999999  L17.996148000000005 15.132659  L21.820839 10.171502 z',
          stroke: '#585858',
          fill: '#fff',
          'stroke-width': 1.5,
          'stroke-linecap': 'butt',
          'stroke-linejoin': 'miter',
          'stroke-miterlimit': 10
        }
        createElement('path', parentNode, pathAttr, true)
        break
      }
      case 'boundarycancelevent': { // 边界取消事件
        var pathAttr = {
          d: 'M6.283910500000001 9.27369  L9.151395 6.4062062  L14.886362000000002 12.141174  L20.621331 6.4062056  L23.488814 9.273689  L17.753846 15.008657  L23.488815 20.743626  L20.621331 23.611111  L14.886362000000002 17.876142  L9.151394 23.611109  L6.283911000000001 20.743625  L12.018878 15.008658  L6.283910500000001 9.27369  z',
          stroke: '#585858',
          fill: '#fff',
          'stroke-width': 1.7
        }
        createElement('path', parentNode, pathAttr, true)
        break
      }
      case 'boundarycompensationevent': { // 边界修正事件
        var polygonAttr1 = {
          stroke: '#585858',
          fill: '#fff',
          'stroke-width': 1.4,
          points: '14 8 14 22 7 15',
          'stroke-linecap': 'butt',
          'stroke-linejoin': 'miter',
          'stroke-miterlimit': 10
        }
        createElement('polygon', parentNode, polygonAttr1, true)
        var polygonAttr2 = {
          stroke: '#585858',
          fill: '#fff',
          'stroke-width': 1.4,
          points: '21 8 21 22 14 15',
          'stroke-linecap': 'butt',
          'stroke-linejoin': 'miter',
          'stroke-miterlimit': 10
        }
        createElement('polygon', parentNode, polygonAttr2, true)
        break
      }
      case 'thrownoneevent': // 无触发中间抛出事件
      default:
        return null
    }
  }

  this.generate = function() {
    var baseInfo = this.data.graphicInfo // 节点位置坐标和大小
    var centerX = baseInfo.x + baseInfo.width / 2 // 节点中心X坐标
    var centerY = baseInfo.y + baseInfo.height / 2 // 节点中心Y坐标
    var strokeColor = this.data.pass === 'passed' ? '#67C23A' : this.data.pass === 'passing' ? '#FF3D71' : '#F4E4CB'

    var circleAttr1 = {
      cx: centerX,
      cy: centerY,
      r: baseInfo.width / 2,
      stroke: strokeColor,
      'stroke-width': 2,
      fill: '#fff'
    }
    createElement('circle', this.parentNode, circleAttr1, true)
    var circleAttr2 = {
      cx: centerX,
      cy: centerY,
      r: baseInfo.width / 2 - 3,
      stroke: '#585858',
      'stroke-width': 1,
      fill: '#fff'
    }
    createElement('circle', this.parentNode, circleAttr2, true)
    var svgAttr = { x: baseInfo.x, y: baseInfo.y }
    var svg = createElement('svg', this.parentNode, svgAttr, true)
    this.getIcon(svg)
  }
}

// 开始节点
function StartNode(parentNode, data) {
  // 参数说明：父节点，数据
  this.parentNode = parentNode
  this.data = data

  this.generate = function() {
    var baseInfo = this.data.graphicInfo // 节点位置坐标和大小
    var centerX = baseInfo.x + baseInfo.width / 2 // 节点中心X坐标
    var centerY = baseInfo.y + baseInfo.height / 2 // 节点中心Y坐标
    var fillColor = this.data.pass === 'passed' ? '#67C23A' : this.data.pass === 'passing' ? '#FFEFF3' : '#FFF4DF'
    var strokeColor = this.data.pass === 'passed' ? '#67C23A' : this.data.pass === 'passing' ? '#FF3D71' : '#F4E4CB'
    var textColor = this.data.pass === 'passed' ? '#fff' : '#000'

    var ellipseAttr = {
      cx: centerX,
      cy: centerY,
      rx: baseInfo.width / 2,
      ry: baseInfo.height / 2,
      stroke: strokeColor,
      'stroke-width': 2,
      fill: fillColor
    }
    createElement('ellipse', this.parentNode, ellipseAttr, true)
    var textAttr = {
      x: centerX,
      y: centerY,
      fill: textColor,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      'font-size': 12
    }
    var text = createElement('text', this.parentNode, textAttr, true)
    text.innerHTML = '开始'
  }
}

// 子流程、子流程的事件、调用活动
function SubProcess(parentNode, data) {
  // 参数说明：父节点，数据
  this.parentNode = parentNode
  this.data = data

  this.generate = function() {
    var baseInfo = this.data.graphicInfo // 位置坐标
    var strokeColor = this.data.pass === 'passed' ? '#67C23A' : this.data.pass === 'passing' ? '#FF3D71' : '#F4E4CB'
    var fillColor = this.data.pass === 'passed' ? '#F2F9EC' : this.data.pass === 'passing' ? '#FFEFF3' : '#FFF4DF'

    var isEvent = this.data.type.toLowerCase() === 'eventsubprocess' // 是子流程的事件
    var isCallActivity = this.data.type.toLowerCase() === 'callactivity' // 是调用活动

    var rectAttr = {
      x: baseInfo.x,
      y: baseInfo.y,
      width: baseInfo.width,
      height: baseInfo.height,
      stroke: strokeColor,
      rx: 15,
      ry: 15,
      'stroke-dasharray': isEvent ? '2 2' : '',
      'stroke-width': isCallActivity ? 4 : 2,
      fill: isCallActivity ? fillColor : 'none'
    }
    createElement('rect', this.parentNode, rectAttr, true)

    if (isCallActivity) {
      var textAttr = {
        x: baseInfo.x + baseInfo.width / 2,
        y: baseInfo.y + baseInfo.height / 2,
        fill: '#000',
        'text-anchor': 'middle',
        'font-size': 12
      }
      var text = createElement('text', this.parentNode, textAttr, true)
      text.innerHTML = this.data.name
    } else {
      var textAttr = {
        x: baseInfo.x + 5,
        y: baseInfo.y + 18,
        fill: '#000',
        'font-size': 12
      }
      var text = createElement('text', this.parentNode, textAttr, true)
      text.innerHTML = this.data.name
    }
  }
}

// 人工任务、服务任务、接收任务
function Task(parentNode, data, hotAreaData, hotAreaParentNode, isShowHotArea) {
  // 参数说明：父节点， 数据，区域热点数据，区域热点父节点， 是否显示区域热点
  this.parentNode = parentNode
  this.data = data
  this.hotAreaData = hotAreaData
  this.hotAreaParentNode = hotAreaParentNode
  this.isShowHotArea = isShowHotArea
  this.baseInfo = this.data.graphicInfo // 节点位置坐标和大小
  this.centerX = this.baseInfo.x + this.baseInfo.width / 2 // 节点中心X坐标
  this.centerY = this.baseInfo.y + this.baseInfo.height / 2 // 节点中心Y坐标
  this.fillColor = this.data.pass === 'passed' ? '#F2F9EC' : this.data.pass === 'passing' ? '#FFEFF3' : '#FFF4DF'
  this.strokeColor = this.data.pass === 'passed' ? '#67C23A' : this.data.pass === 'passing' ? '#FF3D71' : '#F4E4CB'

  // 获取任务图标
  this.getIcon = function(parentNode) {
    switch (this.data.type.toLowerCase()) {
      case 'usertask': { // 人工任务
        var svgAttr = {
          x: this.centerX - 7,
          y: this.centerY - 27
        }
        var svg = createElement('svg', parentNode, svgAttr, true)
        var gAttr = {
          transform: 'translate(-273.000000, -353.000000)',
          fill: '#000000'
        }
        var g = createElement('g', svg, gAttr, true)
        var pathAttr = {
          d: 'M280.51676,363.909091 C277.85169,363.924937 275.561041,362.032431 275.087709,359.423577 C274.614377,356.814723 276.095454,354.245133 278.598001,353.333411 C281.100547,352.421688 283.899739,353.431898 285.232346,355.727703 C285.731339,356.551005 285.996631,357.493458 286,358.454799 C286,361.467066 283.54507,363.909091 280.51676,363.909091 Z M284.027691,365.934126 C286.149539,366.672281 287.676765,368.52747 287.983088,370.73892 C288.005637,370.996277 288.005637,371.255091 287.983088,371.512448 C287.983088,371.906971 287.825236,372.285336 287.544259,372.564306 C287.263281,372.843276 286.882194,373 286.484831,373 L274.49878,373 C273.671316,373 273.000524,372.334 273.000524,371.512448 C272.979273,369.915444 273.605556,368.377004 274.738501,367.243172 C275.508072,366.513049 276.459614,365.999601 277.495293,365.75562 C277.983519,365.623757 278.487593,365.558695 278.993549,365.562238 L281.990062,365.562238 C282.496099,365.557369 283.000355,365.622454 283.488319,365.75562 C283.67183,365.803407 283.852003,365.863036 284.027691,365.934126 Z'
        }
        createElement('path', g, pathAttr, true)
        break
      }
      case 'servicetask': { // 服务任务
        var svgAttr = {
          x: this.centerX - 9,
          y: this.centerY - 23
        }
        var svg = createElement('svg', parentNode, svgAttr, true)
        var pathAttr = {
          d: 'M 8,1 7.5,2.875 c 0,0 -0.02438,0.250763 -0.40625,0.4375 C 7.05724,3.330353 7.04387,3.358818 7,3.375 6.6676654,3.4929791 6.3336971,3.6092802 6.03125,3.78125 6.02349,3.78566 6.007733,3.77681 6,3.78125 5.8811373,3.761018 5.8125,3.71875 5.8125,3.71875 l -1.6875,-1 -1.40625,1.4375 0.96875,1.65625 c 0,0 0.065705,0.068637 0.09375,0.1875 0.002,0.00849 -0.00169,0.022138 0,0.03125 C 3.6092802,6.3336971 3.4929791,6.6676654 3.375,7 3.3629836,7.0338489 3.3239228,7.0596246 3.3125,7.09375 3.125763,7.4756184 2.875,7.5 2.875,7.5 L 1,8 l 0,2 1.875,0.5 c 0,0 0.250763,0.02438 0.4375,0.40625 0.017853,0.03651 0.046318,0.04988 0.0625,0.09375 0.1129372,0.318132 0.2124732,0.646641 0.375,0.9375 -0.00302,0.215512 -0.09375,0.34375 -0.09375,0.34375 L 2.6875,13.9375 4.09375,15.34375 5.78125,14.375 c 0,0 0.1229911,-0.09744 0.34375,-0.09375 0.2720511,0.147787 0.5795915,0.23888 0.875,0.34375 0.033849,0.01202 0.059625,0.05108 0.09375,0.0625 C 7.4756199,14.874237 7.5,15.125 7.5,15.125 L 8,17 l 2,0 0.5,-1.875 c 0,0 0.02438,-0.250763 0.40625,-0.4375 0.03651,-0.01785 0.04988,-0.04632 0.09375,-0.0625 0.332335,-0.117979 0.666303,-0.23428 0.96875,-0.40625 0.177303,0.0173 0.28125,0.09375 0.28125,0.09375 l 1.65625,0.96875 1.40625,-1.40625 -0.96875,-1.65625 c 0,0 -0.07645,-0.103947 -0.09375,-0.28125 0.162527,-0.290859 0.262063,-0.619368 0.375,-0.9375 0.01618,-0.04387 0.04465,-0.05724 0.0625,-0.09375 C 14.874237,10.52438 15.125,10.5 15.125,10.5 L 17,10 17,8 15.125,7.5 c 0,0 -0.250763,-0.024382 -0.4375,-0.40625 C 14.669647,7.0572406 14.641181,7.0438697 14.625,7 14.55912,6.8144282 14.520616,6.6141566 14.4375,6.4375 c -0.224363,-0.4866 0,-0.71875 0,-0.71875 L 15.40625,4.0625 14,2.625 l -1.65625,1 c 0,0 -0.253337,0.1695664 -0.71875,-0.03125 l -0.03125,0 C 11.405359,3.5035185 11.198648,3.4455201 11,3.375 10.95613,3.3588185 10.942759,3.3303534 10.90625,3.3125 10.524382,3.125763 10.5,2.875 10.5,2.875 L 10,1 8,1 z m 1,5 c 1.656854,0 3,1.3431458 3,3 0,1.656854 -1.343146,3 -3,3 C 7.3431458,12 6,10.656854 6,9 6,7.3431458 7.3431458,6 9,6 z',
          fill: '#72a7d0'
        }
        createElement('path', svg, pathAttr, true)
        break
      }
      case 'receivetask': { // 接收任务
        var svgAttr = {
          x: this.centerX - 9,
          y: this.centerY - 23
        }
        var svg = createElement('svg', parentNode, svgAttr, true)
        var pathAttr = {
          d: 'm 0.5,2.5 0,13 17,0 0,-13 z M 2,4 6.5,8.5 2,13 z M 4,4 14,4 9,9 z m 12,0 0,9 -4.5,-4.5 z M 7.5,9.5 9,11 10.5,9.5 15,14 3,14 z',
          fill: '#16964d'
        }
        createElement('path', svg, pathAttr, true)
        break
      }
      default:
        return null
    }
  }

  // 创建区域热点
  this.showHotArea = function(event, info) {
    var style =
      `z-index: 1000;
      position: fixed;
      line-height: normal;
      top: ${event.clientY + 15}px;
      left: ${event.clientX + 5}px;
      max-width: 250px;
      background: #ECECEE;
      border: 1px solid rgb(218, 211, 211);
      padding: 4px;
      font-size: 12px`
    var hotArea = createElement('div', this.hotAreaParentNode, { style, id: 'hotArea' })

    if (info.handlers && info.handlers.length) {
      var span = createElement('span', hotArea)
      span.innerHTML = `处理人：${info.handlers.join('，')}`
    }
    createElement('br', hotArea)
    if (info.ccUsers && info.ccUsers.length) {
      var span = createElement('span', hotArea)
      span.innerHTML = `抄送人：${info.ccUsers.join('，')}`
    }
  }

  // 删除区域热点
  this.deleteHotArea = function() {
    var hotArea = document.getElementById('hotArea')
    if (hotArea) {
      hotArea.parentNode.removeChild(hotArea)
    }
  }

  // 显示区域热点
  this.onMouseOver = function(event) {
    if (this.isShowHotArea) return // 查看流程图不显示区域热点

    var info = this.hotAreaData[this.data.id]
    // 只处理用户任务节点
    if (!this.data.type || this.data.type.toLowerCase() !== 'usertask' || !info) return

    var hasHandler = info.handlers && info.handlers.length
    var hasCcUser = info.ccUsers && info.ccUsers.length
    // 当处理人和抄送人都没有时不显示区域热点
    if (!hasHandler && !hasCcUser) return

    this.showHotArea(event, info)
    this.changeMouseStyle(true)
  }

  // 不显示区域热点图
  this.onMouseOut = function() {
    this.deleteHotArea()
    this.changeMouseStyle(false)
  }

  // 更改鼠标样式
  this.changeMouseStyle = function(mouseOver) {
    var taskArea = document.getElementById(this.data.id)
    if (taskArea) {
      taskArea.style.cursor = mouseOver ? 'pointer' : ''
    }
  }

  this.generate = function() {
    var gAttr = { id: this.data.id }
    var g = createElement('g', this.parentNode, gAttr, true)
    g.addEventListener('mouseover', this.onMouseOver.bind(this))
    g.addEventListener('mouseout', this.onMouseOut.bind(this))

    var rectAttr = {
      x: this.baseInfo.x,
      y: this.baseInfo.y,
      width: this.baseInfo.width,
      height: this.baseInfo.height,
      'stroke-width': 2,
      stroke: this.strokeColor,
      fill: this.fillColor,
      rx: 15,
      ry: 15
    }
    createElement('rect', g, rectAttr, true)

    // 任务图标
    this.getIcon(g)

    // 任务说明
    var foreignObjectAttr = {
      width: this.baseInfo.width,
      height: this.baseInfo.height / 2,
      x: this.baseInfo.x,
      y: this.centerY
    }
    var foreignObject = createElement('foreignObject', g, foreignObjectAttr, true)
    var pAttr = {
      style: 'font-size: 12px; margin: 0; text-align: center'
    }
    var p = createElement('p', foreignObject, pAttr)
    p.innerHTML = this.data.name

    // 多实例图标
    if (this.data.multiInstance === 'parallel') {
      var parallelSvgAttr = {
        x: this.centerX - 3,
        y: this.baseInfo.y + this.baseInfo.height - 10
      }
      var parallelSvg = createElement('svg', g, parallelSvgAttr, true)
      var parallelPathAttr = {
        d: 'M1 0 v8 M5 0 v8 M9 0 v8',
        'stroke-width': 2,
        fill: 'none',
        stroke: this.strokeColor
      }
      createElement('path', parallelSvg, parallelPathAttr, true)
    }

    if (this.data.multiInstance === 'sequential') {
      var sequentialSvgAttr = {
        x: this.centerX - 4,
        y: this.baseInfo.y + this.baseInfo.height - 12
      }
      var sequentialSvg = createElement('svg', g, sequentialSvgAttr, true)
      var sequentialPathAttr = {
        d: 'M0 1 h10 M0 5 h10 M0 9 h10',
        'stroke-width': 2,
        fill: 'none',
        stroke: this.strokeColor
      }
      createElement('path', sequentialSvg, sequentialPathAttr, true)
    }
  }
}

// 文本关联
function TextAnnotation() {
  // 参数说明：父节点，数据
  this.parentNode = parentNode
  this.data = data

  this.generate = function() {
    var baseInfo = this.data.graphicInfo // 位置坐标
    // 文本关联框轨迹
    var x = baseInfo.x; var y = baseInfo.y; var w = baseInfo.width; var h = baseInfo.height
    var path = `M${x + 19},${y} ${x},${y} ${x},${y + h} ${x + 19},${y + h}`

    var pathAttr = {
      d: path,
      stroke: '#585858',
      fill: 'none',
      'stroke-width': 2
    }
    createElement('path', this.parentNode, pathAttr, true)

    var foreignObjectAttr = { width: w, height: h, x: x + 5, y }
    var foreignObject = createElement('foreignObject', this.parentNode, foreignObjectAttr, true)
    var divAttr = { style: `font-size: 12px; height: ${h}px; word-break:break-all;
      word-wrap: break-word; display: flex; align-items: center` }
    var div = createElement('div', foreignObject, divAttr)
    div.innerHTML = this.data.text
  }
}

// 文本关联虚线
function TextAnnotationLine(parentNode, data) {
  // 参数说明：父节点，数据
  this.parentNode = parentNode
  this.data = data

  this.generate = function() {
    var baseInfo = this.data.graphicInfos // 位置坐标
    var color = this.data.pass === 'passed' ? '#67C23A' : '#ECECEE' // 填充颜色
    var path = ''
    baseInfo.map((item) => {
      path += `${item.x},${item.y} `
    })

    var polylineAttr = {
      points: path,
      stroke: color,
      fill: 'none',
      'stroke-width': 2,
      'stroke-dasharray': '4 4'
    }
    createElement('polyline', this.parentNode, polylineAttr, true)
  }
}

// 创建子元素
// 参数说明：元素类型，父节点，元素属性，是否是svg节点
function createElement(type, parentNode, attr = {}, isSvg = false) {
  var element = null
  if (isSvg) {
    element = document.createElementNS('http://www.w3.org/2000/svg', type)
  } else {
    element = document.createElement(type)
  }

  // 设置属性
  Object.keys(attr).forEach(function(key) {
    element.setAttribute(key, attr[key])
  })

  parentNode.appendChild(element)
  return element
}

// 去掉区域热点数据中的重复数据
function filterSameData(arr) {
  var obj = {}
  arr.forEach(function(item) {
    obj[item.flowNodeId] = item
  })
  return obj
}

export default ProcessImage

