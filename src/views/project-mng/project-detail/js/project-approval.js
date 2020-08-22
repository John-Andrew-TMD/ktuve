import { queryDictValue , queryChinaRegionByIds} from 'utils'

import jrosUtils from 'utils/jros-bridge.js'
import ClassFlow from 'utils/class-flow.js'
// 发起立项公共方法
let ctx = null
let projectInfo = null
let userInfo = null
let estimate_budget_principal = 0
const needBack = false
const approveType = ['立项审批','项目审查','项目复议','项目变更']
const canOperateFileNodes = {
  'xiangmulixiang': [1],
  'xiangmushencha': [1, 3, 16, 18],
  'xiangmufuyi': [1, 3, 16],
  'xiangmubiangeng': [1, 3, 16]
}

function _judgeQuotationIsRelated() {
  return ctx.$promiseRequest({
    code: '201651',
    data: {
      project_id: projectInfo.id
    }
  }).then(res => {
    if (res.data.record.length) {
      estimate_budget_principal =
        res.data.record[0].estimate_budget_principal
      return true
    } else {
      ctx.$showToast('报价方案未关联！')
      return Promise.reject()
    }
  })
}

function _judgeAttachmentIsFilled() {
  return ctx.$promiseRequest({
    code: '209200',
    data: {
      business_id: projectInfo.id,
      business_type: 'PMM_A'
    }
  }).then(res => {
    if (res.data.record.length) {
      const arr_file = [
        'PMM_APPROVAL_1',
        'PMM_APPROVAL_2',
        'PMM_APPROVAL_3',
        'PMM_APPROVAL_5'
      ]
      res.data.record.forEach(item => {
        const idx = arr_file.indexOf(item.file_type)
        idx > -1 && arr_file.splice(idx, 1)
      })
      if (!arr_file.length) {
        return true
      }
    }
    ctx.$showToast('资料附件存在未上传项！')
    return Promise.reject()
  })
}

function _judgeCustIsTransfering() {
  return ctx.$promiseRequest({
    code: '200002',
    data: {
      cust_id: projectInfo.cust_id
    }
  }).then(async res => {
    if (res.data.record.length) {
      const data = res.data.record[0]
      if (data.hand_over_status === '审批中') {
        ctx.$showToast('客户处于移交审批流程中，不能发起立项流程！')
        return Promise.reject()
      }
      // 获取授信额度
      const ret = await _getCreditLine()

      if (ret === false) {
        ctx.$showToast('授信额度获取失败！')
        return Promise.reject()
      }
      if (Number(ret) < Number(estimate_budget_principal)) {
        _showWarningConfirmDialog()
      } else {
        _startProjectApproval()
      }
    } else {
      ctx.$showToast('当前项目无客户信息！')
      return Promise.reject()
    }
  })
}

function _getCreditLine() {
  return ctx.$promiseRequest({
    code: '201052',
    data: {
      project_id: projectInfo.id,
      cust_id: projectInfo.cust_id
    }
  })
    .then(res => {
      if (res.data.record.length) {
        return res.data.record[0].amt_can
      } else {
        return false
      }
    })
    .catch(err => {
      console.log(err)
      return false
    })
}

function _showWarningConfirmDialog() {
  ctx.$confirm(`授信额度的可用额度不能小于融资额度！`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      _startProjectApproval()
    })
    .catch(() => {})
}


function _updateProjectStatus() {
  return ctx.$promiseRequest(
    {
      code: '201650',
      data: {
        id: projectInfo.id
      }
    },
    { showLoading: true }
  ).then(res => {
    return true
  })
}


function _createFlowInstance(params) {
  if (ctx.flowInstance) return ctx.flowInstance
  class FlowSubClass extends ClassFlow {
    constructor(params, ctx) {
      super()
      this.params = params
      this.ctx = ctx
    }
  }
  ctx.flowInstance = new FlowSubClass(params, ctx)
  return ctx.flowInstance
}

//项目立项
async function _submitProjectApproval() {
  const business_type_name = queryDictValue('31100', projectInfo.business_type)
  const project_name = projectInfo.project_name
  const flow_module = '项目管理'
  const flow_type = '项目立项'
  const flow_title = '项目名称：' + project_name
  //业务类型、发起人、融资金额
  const flow_desc = `业务类型：${business_type_name} | 发起人：${userInfo.userName} | 融资金额：${Vue.filter('filterToThousand')(projectInfo.lease_financing)}元`
  const title = project_name + '-' + flow_type
  const descript = `${flow_module}*${flow_desc}*${flow_type}*${flow_title}**`
  const params = {
    id: projectInfo.id,
    cust_id: projectInfo.cust_id,
    flow_no: 'xiangmulixiang',
    project_id: projectInfo.id,
    title: title,
    descript: descript,
    content: JSON.stringify({
      id: projectInfo.id,
      cust_id: projectInfo.cust_id,
      project_id: projectInfo.id,
      title: title,
      project_name: project_name,
      business_type: projectInfo.business_type,
      can_operate_file_nodes: canOperateFileNodes['xiangmulixiang'],//可操作附件的节点
    })
  }
  const flowInstance = _createFlowInstance(params)
  flowInstance.flowLaunch(needBack)
}

//项目审查
async function _submitProjectInquire() {
  const business_type_name = queryDictValue('31100', projectInfo.business_type)
  const project_name = projectInfo.project_name
  const flow_module = '项目管理'
  const flow_type = '项目审查'
  const flow_title = '项目名称：' + project_name
  //业务类型、发起人、融资金额
  const flow_desc = `业务类型：${business_type_name} | 发起人：${userInfo.userName} | 融资金额：${Vue.filter('filterToThousand')(projectInfo.lease_financing)}元`
  const title = project_name + '-' + flow_type
  const descript = `${flow_module}*${flow_desc}*${flow_type}*${flow_title}**`

  const flow_no = 'xiangmushencha'
  const params = {
    id: projectInfo.id,
    cust_id: projectInfo.cust_id,
    flow_no: flow_no,
    project_id: projectInfo.id,
    title: title,
    descript: descript,
    content: JSON.stringify({
      id: projectInfo.id,
      cust_id: projectInfo.cust_id,
      project_id: projectInfo.id,
      title: title,
      project_name: projectInfo.project_name,
      business_type: projectInfo.business_type,
      can_operate_file_nodes: canOperateFileNodes[flow_no],//可操作附件的节点
    })
  }
  const flowInstance = _createFlowInstance(params)
  flowInstance.flowLaunch(needBack)
}

//项目复议
async function _submitProjectReconsider() {
  const business_type_name = queryDictValue('31100', projectInfo.business_type)
  const project_name = projectInfo.project_name
  const flow_module = '项目管理'
  const flow_type = '项目复议'
  const flow_title = '项目名称：' + project_name
  //业务类型、发起人、融资金额
  const flow_desc = `业务类型：${business_type_name} | 发起人：${userInfo.userName} | 融资金额：${Vue.filter('filterToThousand')(projectInfo.lease_financing)}元`
  const title = project_name + '-' + flow_type
  const descript = `${flow_module}*${flow_desc}*${flow_type}*${flow_title}**`

  const flow_no = 'xiangmufuyi'
  const params = {
    id: projectInfo.id,
    cust_id: projectInfo.cust_id,
    flow_no: flow_no,
    project_id: projectInfo.id,
    title: projectInfo.project_name + '-项目复议流程',
    descript: descript,
    content: JSON.stringify({
      id: projectInfo.id,
      cust_id: projectInfo.cust_id,
      project_id: projectInfo.id,
      title: projectInfo.project_name + '-项目复议流程',
      project_name: projectInfo.project_name,
      business_type: projectInfo.business_type,
      can_operate_file_nodes: canOperateFileNodes[flow_no],//可操作附件的节点
    })
  }
  const flowInstance = _createFlowInstance(params)
  flowInstance.flowLaunch(needBack)
}
//项目变更
async function _submitProjectChange(is_repeat_vote) {
  const business_type_name = queryDictValue('31100', projectInfo.business_type)
  const project_name = projectInfo.project_name
  const flow_module = '项目管理'
  const flow_type = '项目复议'
  const flow_title = '项目名称：' + project_name
  //业务类型、发起人、融资金额
  const flow_desc = `业务类型：${business_type_name} | 发起人：${userInfo.userName} | 融资金额：${Vue.filter('filterToThousand')(projectInfo.lease_financing)}元`
  const title = project_name + '-' + flow_type
  const descript = `${flow_module}*${flow_desc}*${flow_type}*${flow_title}**`

  const flow_no = 'xiangmubiangeng'
  const params = {
    id: projectInfo.id,
    cust_id: projectInfo.cust_id,
    flow_no: flow_no,
    project_id: projectInfo.id,
    title: projectInfo.project_name + '-项目变更流程',
    descript: descript,
    content: JSON.stringify({
      id: projectInfo.id,
      cust_id: projectInfo.cust_id,
      project_id: projectInfo.id,
      is_repeat_vote,
      title: projectInfo.project_name + '-项目变更流程',
      project_name: projectInfo.project_name,
      business_type: projectInfo.business_type,
      can_operate_file_nodes: canOperateFileNodes[flow_no],//可操作附件的节点
    })
  }
  const flowInstance = _createFlowInstance(params)
  flowInstance.flowLaunch(needBack)
}


//发起审批前置校验
function approvePreCheck(approve_type){
  return ctx.$promiseRequest({
    code: '201825',
    data: {
      project_id: projectInfo.id,
      approve_type: approve_type
    }
  }).then(res => {
    if (res.data.record[0].can_launch === '1') {
      return true
    } else {
      ctx.$showToast(res.data.record[0].msg)
      return Promise.reject()
    }
  })
}

//发起审批后置处理
function approvePostHandle(approve_type, needCreateFile){
  //修改项目状态等
  ctx.$promiseRequest(
    {
      code: '201826',
      data: {
        project_id: projectInfo.id,
        approve_type: approve_type
      }
    },
    { showLoading: true }
  ).then(res => {
  })
  if(needCreateFile){
    if(approve_type === 1){
      ctx.$promiseRequest(
        {
          code: '201822',
          data: {
            project_id: projectInfo.id,
            action: 'Q'
          }
        },
        { showLoading: true }
      ).then(res => {
        let custInfo = res.data.record[0]
        let address = {}
        address.register_address_dict = queryChinaRegionByIds(custInfo.register_address)
        address.office_address_dict = queryChinaRegionByIds(custInfo.office_address)
        generateApproveFile(approve_type, address)
      })
    }else{
      generateApproveFile(approve_type)
    }
  }
}

function generateApproveFile(approve_type, address){
  let data = {
    project_id: projectInfo.id,
    approveType: approve_type,
    obj_code: 201832,
    action: 'A',
    param: JSON.stringify({
      project_id: projectInfo.id,
      approve_type: approve_type
    })
  }
  if(address){
    data.register_address_dict = address.register_address_dict
    data.office_address_dict =address.office_address_dict
  }
  ctx.$promiseRequest(
    {
      url: '/generateApproveFile.do',
      data: data
    },
    { showLoading: false }, true
  ).then(res => {
  })
}

function _startProjectApproval(approve_type) {
  ctx.$confirm(`确定发起${approveType[approve_type - 1]}流程？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
  }).then(() => {
    switch (approve_type){
      case 1:
        _submitProjectApproval()
        approvePostHandle(approve_type, true)
        break;
      case 2:
        _submitProjectInquire()
        approvePostHandle(approve_type, false)
        break;
      case 3:
        _submitProjectReconsider()
        approvePostHandle(approve_type, true)
        break;
      case 4:
        ctx.repeatDialogStatus = true
        break;
    }
  }).catch(() => {

  })
}

function getNewestProjectInfo(ctx, project_id){
  //获取最新的项目信息
  return ctx.$promiseRequest({
    code: '201101',
    data: {
      id: project_id,
    }
  }, { showLoading: true }).then(res => {
    return res.data.record[0];
  }).catch(err => {
    console.log(err)
  })
}

async function projectApproval(context, data, approve_type, is_change_submit, tempObj) {
  ctx = context
  projectInfo = await getNewestProjectInfo(ctx, data.id)
  userInfo = await jrosUtils.getUserInfo()
  ctx.$store.commit('app/SHOW_LOADING')
  if(!is_change_submit){
    approvePreCheck(approve_type).then(res => {
      return _startProjectApproval(approve_type)
    }).catch(err => {
      console.log(err)
    }).finally(res => {
      ctx.$store.commit('app/HIDE_LOADING')
    })
  }else{
    _submitProjectChange(tempObj.is_repeat_vote)
    approvePostHandle(4, tempObj.is_repeat_vote === '0')
  }
}

export default projectApproval
