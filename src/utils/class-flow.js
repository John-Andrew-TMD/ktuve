import {
  promiseRequest
} from '@/utils/fetch-utils'
import { setFlowNext, setFlowBack, setFlowReject, setFlowStop } from 'api/workflow-module/index.js'
import {
  deepAssign
} from 'utils'

/**
 * suggestion 在flow-block 页面 意见输入对话框确认后赋值
 * originParams 保存初始传参，在flow-block页面, 点击审批按钮时进行重置，
 * 防止某一个审批操作改变了参数，然后点击另一个审批操作，参数污染
 */
class ClassFlow {
  constructor(params, ctx) {
    this.params = params
    this.originParams = deepAssign({}, params)
    this.ctx = ctx
  }
  /**
   * 该类被子类继承实例化后，实例拥有以下全部方法，所有方法默认返回true，如果在某个方法中
   * 有逻辑处理，则在实例中重写此方法。
   */
  beforeShowSuggestDialog() {
    return Promise.resolve()
  }

  // 选择下一步接收人
  chooseUser() {
    return {
      needSelect: false
    }
  }

  // 返回到源页面
  back() {
    this.ctx.$showToast('操作成功！', 'success', true)
    setTimeout(() => {
      this.ctx.$store
        .dispatch('tagsView/closeCurrentTag', this.ctx.$route)
        .then(() => {
          this.ctx.$router.push(this.ctx.$route.meta.from)
        })
    }, 1000)
  }

  // 业务页面中流程下一步之前参数处理
  async actionFlowAgree() {
    let ret = true
    if(typeof this.ctx.beforeNext === 'function') {
      ret = await this.ctx.beforeNext()
    }
    // 请求失败
    if (!ret) return
    ret = await this.chooseUser()
    // 请求失败
    if (!ret) return
    // 无需选择下一步接受人
    if (!ret.needSelect) {
      return this._actionFlowAgreeSubmit()
    }
    this.ctx.showUserSelectDialog(ret.userList)
  }

  // 业务页面中流程下一步提交
  async _actionFlowAgreeSubmit() {
    this.flowAgree(() => {
      this.back()
    })
  }

  // 业务页面中流程退回
  async actionFlowBack() {
    this.flowBack(async() => {
      this.back()
    })
  }

  // 业务页面中流程驳回
  async actionFlowReject() {
    this.flowReject(async() => {
      this.back()
    })
  }

  // 业务页面中流程中止
  async actionFlowStop() {
    this.flowStop(async() => {
      this.back()
    })
  }

  // 业务页面中流程移交
  async actionFlowTransfer() {
    const ret = await this.chooseUser()
    // 请求失败
    if (!ret) return
    // 无需选择下一步接受人
    if (!ret.needSelect) {
      return this._actionFlowTransferSubmit()
    }
    this.ctx.showUserSelectDialog(ret.userList)
  }

  // 业务页面中流程移交提交
  async _actionFlowTransferSubmit() {
    if (!this.params.selectedAccepters) {
      return this.$showToast('被移交人不能为空')
    }
    this.flowTransfer(async() => {
      this.back()
    })
  }

  // 业务页面中流程续议
  async actionFlowReconsider() {
    this.flowReconsider(async() => {
      this.back()
    })
  }

  // 业务页面中行使一票否决
  async actionOneVoteVeto() {
    this.flowStop(async() => {
      this.back()
    })
  }

  // 业务页面中不行使一票否决
  async actionNotOneVoteVeto() {
    this.actionFlowAgree()
  }

  // 流程下一步(同意)
  flowAgree(cb) {
    setFlowNext({
      commentMessage: this.extraParams.suggestion,
      taskId: this.params.id,
      variable: this.extraParams
    }, { showLoading: true }).then(res => {
      cb && cb(res)
    }).catch(err => {
      console.log(err)
    })
  }

  // 流程上一步(退回)
  flowBack(cb) {
    setFlowBack({
      commentMessage: this.extraParams.suggestion,
      taskId: this.params.id,
      variable: this.extraParams
    }, { showLoading: true }).then(res => {
      cb && cb(res)
    }).catch(err => {
      console.log(err)
    })
  }

  // 流程驳回
  flowReject(cb) {
    setFlowReject({
      commentMessage: this.extraParams.suggestion,
      taskId: this.params.id,
      variable: this.extraParams
    }, { showLoading: true }).then(res => {
      cb && cb(res)
    }).catch(err => {
      console.log(err)
    })
  }

  // 流程中止
  flowStop(cb) {
    setFlowStop({
      commentMessage: this.extraParams.suggestion,
      taskId: this.params.id,
      variable: this.extraParams
    }, { showLoading: true }).then(res => {
      cb && cb(res)
    }).catch(err => {
      console.log(err)
    })
  }

  // 流程移交
  flowTransfer(cb) {
    promiseRequest({
      code: '100652',
      data: {
        line_id: this.ctx.routeParams.line_id,
        to_userid: this.params.to_userid,
        reason: this.suggestion
      }
    }, {
      showLoading: true
    }).then(res => {
      cb && cb(res)
    }).catch(err => {
      console.log(err)
    })
  }

  // 流程续议
  flowReconsider(cb) {
    promiseRequest({
      code: '100632',
      data: {
        req_id: this.ctx.routeParams.req_id,
        stop_reason: this.suggestion
      }
    }, {
      showLoading: true
    }).then(res => {
      this._prepareSendMessage('reconsider')
      cb && cb(res)
    }).catch(err => {
      console.log(err)
    })
  }

  // 流程协助
  flowAssist(cb) {
    promiseRequest({
      code: '100651',
      data: {
        line_id: this.ctx.routeParams.line_id,
        to_userid: this.params.to_userid
      }
    }, {
      showLoading: true
    }).then(res => {
      cb && cb(res)
    }).catch(err => {
      console.log(err)
    })
  }

  // 流程越级
  flowSkip(cb) {
    promiseRequest({
      code: '100650',
      data: {
        line_id: this.ctx.routeParams.line_id,
        content: JSON.stringify(this.params.content),
        suggestion: this.suggestion || ''
      }
    }, {
      showLoading: true
    }).then(res => {
      cb && cb(res)
    }).catch(err => {
      console.log(err)
    })
  }

  // 流程拒绝
  flowRefuse(cb) {
    promiseRequest({
      code: '100641',
      data: {
        line_id: this.ctx.routeParams.line_id,
        state: '0'
      }
    }, {
      showLoading: true
    }).then(res => {
      cb && cb(res)
    }).catch(err => {
      console.log(err)
    })
  }

  // 待处理流程状态释放
  flowRelease(cb) {
    promiseRequest({
      code: '100649',
      data: {
        line_id: this.ctx.routeParams.line_id
      }
    }, {
      showLoading: true
    }).then(res => {
      cb && cb(res)
    }).catch(err => {
      console.log(err)
    })
  }
}

export default ClassFlow
