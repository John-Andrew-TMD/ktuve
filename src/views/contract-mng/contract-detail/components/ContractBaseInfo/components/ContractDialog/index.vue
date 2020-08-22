<template>
  <el-dialog
    ref="attachmentChangeDom"
    class="comp-dialog-contract-action-form"
    width="1000px"
    height="450px"
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    modal-append-to-body
    append-to-body
    @closed="handleDialogClosed"
  >
    <div v-if="showLoading" class="el-loading-mask">
      <div class="el-loading-spinner">
        <i class="el-icon-loading" />
        <p class="el-loading-text">Loading</p>
      </div>
    </div>
    <div v-if="showContract" class="element-wrapper">
      <el-row :class="!personList.length && !hasOtherForm?'':'form-split-line'">
        <el-col :span="24">
          <main-form-field
            ref="mainFormDom"
            :contract-item="contractItem"
            :contract-data="contractPrepareData"
            form-type="mainForm"
            @change="handleMainChange"
          />
        </el-col>
      </el-row>
      <div v-if="personList.length">
        <el-row
          v-for="(item,index) in personList"
          :key="index"
          class="form-split-line relation-wrapper"
        >
          <el-col :span="24">
            <role-form-field
              :ref="'roleFormDom'+item.roleType"
              :contract-item="contractItem"
              :contract-en-name="contractEnName"
              :role-type="item.roleType"
              :role-item="item"
              :data-list="contractPrepareData[item.roleOrder+'PersonDTOList']"
              :data-info="contractPrepareData[item.roleOrder+'PersonDTO']"
              @role-change="handleRoleChange"
            />
          </el-col>
        </el-row>
      </div>
      <el-row v-if="hasOtherForm">
        <el-col :span="24">
          <main-form-field
            ref="otherFormDom"
            :contract-item="contractItem"
            :contract-data="contractPrepareData"
            form-type="otherForm"
          />
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { queryDictValue, deepAssign } from 'utils'
import { getContractBycommand, formatFormData } from '../js/contract-field.config.js'
import { prepareContract, prepareUpdateContract, saveContract } from 'api/contract-module/api-contract-mng.js'

export default {
  components: {
    RoleFormField: () => import('./components/RoleFormField'),
    MainFormField: () => import('./components/MainFormField')
  },
  props: {
    contractItem: {
      type: Object,
      default: () => {}
    },
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showContract: false,
      dialogVisible: false,
      personList: [],
      contractPrepareData: {},
      hasOtherForm: false,
      showLoading: true
    }
  },
  provide() {
    return {
      formatContentData: this.formatContentData
    }
  },
  inject: ['refreshContractLeft', 'getContractInfoField'],
  computed: {
    dialogTitle() {
      return `${{ A: '新增', U: '修改' }[this.contractItem.action]}${this.contractItem.name}`
    },
    contractEnName() {
      return this.contractItem.contracTypeForm
    },
    contractType() {
      return this.contractItem.contractType
    }
  },
  created() {
    this._initForm()
  },
  methods: {
    // 初始化页面表单
    async _initForm() {
      this.contractCommand = getContractBycommand(this.contractEnName)
      this.hasOtherForm = this.contractCommand.otherForm
      if (!this.contractCommand) {
        this.handleDialogClosed()
        return this.$showToast('未添加该合同未配置项')
      }
      const { roleForm = [], roleTypes = [], roleOrder = [] } = this.contractCommand
      this.personList = roleForm.map((item, index) => {
        return Object.assign({}, item, { roleType: roleTypes[index], roleOrder: roleOrder[index] })
      })
      if (this.contractItem.action === 'U') {
        this.getPrepareUpdateContract()
      } else {
        this.getPrepareContract()
      }
      this.dialogVisible = true
    },
    // 新增查询数据
    getPrepareContract() {
      prepareContract({
        contractType: this.contractType + '',
        projectManagerId: this.getContractInfoField('projectManagerId'),
        contractManagerId: this.routeParams.id
      })
        .then(res => {
          if (!res.data) return
          this.contractPrepareData = res.data
          this.showContract = true
          this.showLoading = false
        })
        .catch(() => {
          this.showLoading = false
        })
    },
    // 修改查询数据
    getPrepareUpdateContract() {
      prepareUpdateContract({
        contractType: this.contractType + '',
        projectManagerId: this.getContractInfoField('projectManagerId'),
        contractManagerId: this.routeParams.id,
        parentId: this.contractItem.parentId,
        contractId: this.contractItem.contractId
      })
        .then(res => {
          if (!res.data) return
          this.contractPrepareData = res.data
          this.showContract = true
          this.showLoading = false
        })
        .catch(() => {
          this.showLoading = false
        })
    },
    // 校验表单
    validateFrom(formDom) {
      return new Promise(resolve => {
        if (this.$refs[formDom]) {
          let fApi = this.$refs[formDom].fApi
          if (typeof fApi != 'object') {
            fApi = this.$refs[formDom][0].fApi
          }
          fApi.validate(valid => {
            const result = fApi.formData()
            if (valid) {
              resolve({
                pass: true,
                data: result
              })
            } else {
              resolve({
                pass: false,
                data: result
              })
            }
          })
        } else {
          return resolve({ pass: true, data: {} })
        }
      })
    },
    handleDialogConfirm() {
      const p1 = this.validateFrom(`mainFormDom`)
      const p2 = this.validateFrom(`otherFormDom`)
      const roleValidate = this.personList.map(item => {
        return this.validateFrom(`roleFormDom${item.roleType}`)
      })
      Promise.all([p1, p2].concat(roleValidate)).then(result => {
        const valid = result.every(item => item.pass)
        if (!valid) return
        const tempMainData = result.shift().data
        const tempOtherData = result.shift().data
        const guaranteeData = tempOtherData.guarantee
        delete tempOtherData.guarantee
        const roleFormData = result.map(item => formatFormData(this, item.data))
        const otherFormData = formatFormData(this, tempOtherData)
        const mainFormData = formatFormData(this, tempMainData)
        // 指定账户
        if (otherFormData.designatedBankInfo) {
          const tempArr = otherFormData.designatedBankInfo.split(',')
          otherFormData.designatedAccountName = tempArr[0]
          otherFormData.designatedAccount = tempArr[1]
          otherFormData.designatedDepositBank = tempArr[2]
        }
        const params = {
          ...mainFormData,
          ...otherFormData,
          contractName: queryDictValue('10053', this.contractType),
          contractManagerId: this.routeParams.id,
          contractType: this.contractType,
          parentId: mainFormData.relatedContractId,
          projectManagerId: this.getContractInfoField('projectManagerId'),
          conContractPersonTableEntityDtos: roleFormData, // 人员信息
          conGuaranteeInfoTableEntityDtos: guaranteeData || [], // 担保信息
          content: JSON.stringify({ ...mainFormData, ...otherFormData })
        }
        params.id = this.contractItem.action === 'U' ? this.contractItem.contractId : ''
        this.showLoading = true
        saveContract(params)
          .then(res => {
            this.$showToast('保存成功', 'success')
            this.dialogVisible = false
            this.refreshContractLeft()
          })
          .catch(() => {
            this.showLoading = false
          })
      })
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    },
    // 表单change事件
    handleMainChange(key, data) {
      switch (key) {
        case 'transferContractName':
        case 'transferContractNo':
          this._relateTransferInfo(key, data)
          break
        case 'relatedContractId':
          this._renderContractInfo(key, data)
          break
      }
    },
    // 被转让合同名称和编号关联
    _relateTransferInfo(key, val) {
      const otherDom = this.$refs.otherFormDom
      if (!otherDom) return
      otherDom.formRules.forEach(item => {
        if (item.props && item.props.beRelated) {
          const value = {}
          value[key] = val
          otherDom.fApi.setValue(item.field, value)
        }
      })
    },
    // 主合同编号切换
    _renderContractInfo(key, data) {
      const _setFormValue = formDom => {
        const dom = this.$refs[formDom]
        if (!dom) return
        const rules = dom.formRules
        let formData = this._mergeFormData(data)
        formData = this.formatContentData(formData, rules, true)
        dom.fApi.setValue(formData)
      }
      _setFormValue('mainFormDom')
      _setFormValue('otherFormDom')
    },
    _mergeFormData(data = {}) {
      const conQuotationDto = data.conQuotationDto || {}
      const formData = deepAssign({}, data, conQuotationDto)
      formData.contractNo = data.subContractNo
      delete formData.conQuotationDto
      return formData
    },
    // 格式化组件数据格式
    formatContentData(data, rules, flag) {
      const tempData = Object.assign({}, data)
      rules.forEach(item => {
        if (flag && item.fieldMap && typeof item.fieldMap === 'string') {
          const value = tempData[item.fieldMap]
          if (value || value == 0) {
            tempData[item.field] = value
          }
        }
        if (item.type.startsWith('custom-')) {
          let tempObj = {}
          if (item.fieldMap && Array.isArray(item.fieldMap)) {
            item.fieldMap.forEach(fItem => {
              const key = item.field
              if (!tempData[key]) {
                tempData[key] = {}
              }
              tempObj = tempData[key]
              const value = tempData[fItem]
              if (value || value == 0) {
                tempObj[fItem] = value
              }
            })
          } else {
            for (const key in tempData) {
              if (tempData.hasOwnProperty(key) && key.startsWith(`${item.field}_`)) {
                const value = tempData[key]
                if (!tempData[item.field]) {
                  tempData[item.field] = {}
                }
                tempObj = tempData[item.field]
                tempObj[key] = value
                delete tempData[key]
              }
            }
          }
        }
        // 地址
        if (item.children && item.children[0].type === 'china-region-cascade') {
          const child = item.children[0]
          const key = child.field
          if (tempData[key]) {
            const arr = tempData[key].split(',')
            const detail = arr.pop()
            if (detail) {
              tempData[key + 'Detail'] = detail
            }
            tempData[key] = arr
          }
        }
      })
      return tempData
    },
    // 人员类型切换
    handleRoleChange(data, roleType) {
      const otherDom = this.$refs.otherFormDom
      const { thirdPersonDTOList = [] } = this.contractPrepareData
      const type = +this.contractType
      if (type === 8) {
        // 购买合同
        const account1 = data.accountingBankList || []
        const account2 = thirdPersonDTOList.length ? thirdPersonDTOList[0].accountingBankList : []
        const designatedAccount = account1.concat(account2)
        const bankList = designatedAccount.reduce((arr, item) => {
          if (!arr.length || !arr.some(sItem => sItem.bankId === item.bankId)) {
            arr.push({
              ...item,
              label: item.bankInfo,
              value: item.bankId
            })
          }
          return arr
        }, [])
        const defaultBank = bankList.find(item => +item.isDefault === 1)
        const designatedBankId = otherDom.fApi.rule.find(item => item.field === 'designatedBankId')
        const designatedBankInfo = otherDom.fApi.rule.find(item => item.field === 'designatedBankInfo')
        if (!designatedBankId || !designatedBankInfo) return
        otherDom.fApi.set(designatedBankId.props.params, 'options', bankList)
        if (defaultBank) {
          otherDom.fApi.set(designatedBankId, 'value', defaultBank.bankId)
          otherDom.fApi.set(designatedBankInfo, 'value', defaultBank.bankInfo)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.comp-dialog-contract-action-form {
  .el-loading-mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 33;
    background: rgba(0, 0, 0, 0);
  }
  .el-dialog__body {
    min-height: 500px;
  }
  .form-split-line {
    border-bottom: 1px dashed #c6e2ff;
    margin-bottom: 20px;
  }
  .txt-right {
    text-align: right;
  }
  .el-dialog__title {
    margin-bottom: 10px;
    display: block;
  }
  .el-steps--simple {
    padding-top: 10px;
    padding-bottom: 10px;
    .el-step__title {
      font-size: 14px;
    }
  }
  .el-dialog__body .element-wrapper > div {
    &:last-child {
      .form-split-line {
        border-bottom: 0;
      }
    }
  }
  .form-groups {
    margin-bottom: 0;
    .el-row--flex.is-align-middle {
      align-items: flex-start;
      padding: 0 !important;
      background: none !important;
      margin-bottom: 0 !important;
      margin-top: 18px;
      &:last-child {
        border-bottom: 0;
      }
      &:first-child {
        margin-top: 0;
      }
      form.form-create {
        margin-left: 25px;
      }
      > div {
        > .el-form-item {
          margin-bottom: 0;
        }
      }
    }
  }
  .tabel-create {
    margin-top: 0;
  }
  .form-groups-disabled {
    .el-icon-circle-plus-outline {
      display: none;
    }
  }
  .el-input,
  .el-select {
    max-width: 250px;
  }

  .el-select,
  .el-date-editor,
  .el-cascader {
    width: 100%;
  }
  .el-col-9 .el-form-item__content {
    width: auto;
  }
  .el-row .el-col:last-child.el-col-23 {
    .el-form-item__content {
      width: auto;
    }
  }
}
</style>
