import ClassFlow from 'utils/class-flow.js'
// 发起立项公共方法
let ctx = null
let projectInfo = null

function _judgeQuotationIsRelated() {
  return ctx.$promiseRequest({
    code: '201651',
    data: {
      project_id: projectInfo.id
    }
  }).then(async res => {
    if (res.data.record.length) {
      const estimate_budget_principal =
        res.data.record[0].estimate_budget_principal

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
      return true
    } else {
      ctx.$showToast('报价方案未关联！')
      return Promise.reject()
    }
  })
}

function _judgeAttachmentIsFilled() {
  return ctx.$promiseRequest({
    code: '201403',
    data: {
      id: projectInfo.id
    }
  }).then(res => {
    if (res.data.record.length) {
      const data = res.data.record[0]
      let msg = ''
      if (data.flag_edit == 0) {
        msg += '请填写项目信息中的必填项！'
      }
      if (+data.report_upload < 2) {
        msg += '请完善相关附件！'
      }
      if (!msg) {
        return true
      } else {
        ctx.$showToast(msg)
        return Promise.reject()
      }
    }
    ctx.$showToast('项目数据不存在！')
    return Promise.reject()
  })
}

function _judgeCustIsTransfering() {
  return ctx.$promiseRequest({
    code: '200002',
    data: {
      cust_id: projectInfo.cust_id,
      has_power: '1'
    }
  }).then(res => {
    if (res.data.record.length) {
      const data = res.data.record[0]
      if (data.hand_over_status === '审批中') {
        ctx.$showToast('客户处于移交审批流程中，不能发起立项流程！')
        return Promise.reject()
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

function _startProjectApproval() {
  ctx.$confirm(`确定发起立项申请？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      if (ctx.routeParams.reconsider_flag !== 'reconsider') {
        // 获取项目尽调信息
        _getProjectInquireInfo()
          .then(res => {
            _submitProjectInquire(res)
          })
          .catch(err => { console.log(err) })
      } else {
        if (projectInfo.project_status != 4) {
          return this.$showToast('项目状态不为尽调不通过，无法发起复议！')
        }
        // 更新项目状态
        _getProjectReconsideInfo()
          .then(res => {
            _submitProjectReconsider(res)
          })
          .catch(err => { console.log(err) })
      }
    })
    .catch(() => {})
}

function _getProjectInquireInfo() {
  return ctx.$promiseRequest(
    {
      code: '201404',
      data: {
        id: projectInfo.id
      }
    },
    { showLoading: true }
  ).then(res => {
    return res.data.record
  })
}

function _getProjectReconsideInfo() {
  return ctx.$promiseRequest(
    {
      code: '201405',
      data: {
        id: projectInfo.id,
        rs_id: 0
      }
    },
    { showLoading: true }
  ).then(res => {
    return res.data.record
  })
}

async function _submitProjectInquire(data) {
  if (!data.length) return this.$showToast('发起失败！')
  const financing_quota = data[0].financing_quota
  const business_type_name = projectInfo.business_type_name
  const descript = `项目管理*项目尽调*尽调*${projectInfo.project_name}*${projectInfo.cust_name}*${projectInfo.accounting_entity}*${business_type_name}`
  const params = {
    id: projectInfo.id,
    cust_id: projectInfo.cust_id,
    flow_no: 'xiangmujindiao',
    project_id: projectInfo.id,
    title: projectInfo.project_name + '-项目尽调流程',
    descript: descript,
    financing_quota: +financing_quota || '',
    content: JSON.stringify({
      id: projectInfo.id,
      cust_id: projectInfo.cust_id,
      project_id: projectInfo.id,
      user_id: this.$userId,
      title: projectInfo.project_name + '-项目尽调流程',
      project_name: projectInfo.project_name,
      financing_quota: +financing_quota || ''
    })
  }
  const userId = await ctx.$store.dispatch(
    'common/getDepartmentLeader',
    ctx.$userId
  )
  params.accepters = JSON.stringify([userId || ''])
  const flowInstance = _createFlowInstance(params)
  flowInstance.flowLaunch()
}

async function _submitProjectReconsider(data) {
  if (!data.length) return this.$showToast('发起失败！')
  const financing_quota = data[0].financing_quota
  const business_type_name = projectInfo.business_type_name
  const descript = `项目管理*项目复议*复议*${projectInfo.project_name}*${projectInfo.cust_name}*${projectInfo.accounting_entity}*${business_type_name}`
  const params = {
    id: projectInfo.id,
    cust_id: projectInfo.cust_id,
    flow_no: 'xiangmufuyi',
    project_id: projectInfo.id,
    title: projectInfo.project_name + '-项目复议流程',
    descript: descript,
    content: JSON.stringify({
      id: projectInfo.id,
      cust_id: projectInfo.cust_id,
      project_id: projectInfo.id,
      user_id: this.$userId,
      title: projectInfo.project_name + '-项目复议流程',
      project_name: projectInfo.project_name,
      financing_quota: +financing_quota || ''
    })
  }
  const userId = await ctx.$store.dispatch(
    'common/getDepartmentLeader',
    ctx.$userId
  )
  params.accepters = JSON.stringify([userId || ''])
  const flowInstance = _createFlowInstance(params)
  flowInstance.flowLaunch()
}

function _createFlowInstance(params) {
  class FlowSubClass extends ClassFlow {
    constructor(params, ctx) {
      super()
      this.params = params
      this.ctx = ctx
    }
  }
  const flowInstance = new FlowSubClass(params, ctx)
  return flowInstance
}

function projectInquire(context, data) {
  ctx = context
  projectInfo = data

  ctx.$store.commit('app/SHOW_LOADING')
  // 判断客户是否出移交审批中
  _judgeCustIsTransfering()
    .then(res => {
      // 判断附件是否上传完整
      return _judgeAttachmentIsFilled()
    })
    .then(res => {
      // 判断报价方案是否关联
      return _judgeQuotationIsRelated()
    })
    .catch(err => { console.log(err) })
    .finally(res => {
      ctx.$store.commit('app/HIDE_LOADING')
    })
}

export default projectInquire
