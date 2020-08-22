<template>
  <div>
    <div class="panel-header">
      <div class="panel-wrapper">
        <span class="text">{{ isOrg ? '机构' : '个人' }}信息</span>
        <div class="panel-tools">
          <el-button v-if="!canEdit" :disabled="globalCanEdit" size="mini" type="primary" @click="handleEditClick">修改</el-button>
          <template v-else>
            <el-button size="mini" @click="handleCancelClick">取消</el-button>
            <el-button size="mini" type="primary" @click="handleSaveClick">保存</el-button>
          </template>
          <el-button
            v-if="isOrg"
            size="mini"
            :disabled="globalCanEdit"
            :loading="showSyncLoading"
            type="warning"
            @click="handleSyncClick"
          >{{ showSyncLoading ? '同步中...' : '数据同步' }}</el-button>
        </div>
      </div>
    </div>
    <div class="content-body">
      <comp-org-info v-if="isOrg" ref="formDom" @on-ready="handleChildReady" />
      <comp-person-info v-else ref="formDom" @on-ready="handleChildReady" />
    </div>
  </div>
</template>

<script>
// import CompOrgInfo from './CompOrgInfo.vue'
// import CompPersonInfo from './CompPersonInfo.vue'
import { customerUpdate, customerInfoSync } from 'api/customer-module/api-customer-detail.js'
import { isEmptyObj } from 'utils'
export default {
  components: {
    // CompOrgInfo,
    // CompPersonInfo
    CompOrgInfo: () => import('./CompOrgInfo.vue'),
    CompPersonInfo: () => import('./CompPersonInfo.vue')
  },
  inject: ['setTagsViewTitleAndHeaderInfo', 'getCustInfoField'],
  props: {
    routeParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      canEdit: false,
      showSyncLoading: false,
      compareDialogStatus: false,
      newFormData: null
    }
  },
  computed: {
    // 是否是机构客户
    isOrg() {
      return this.routeParams.custCategory == 1
    },
    globalCanEdit() {
      return !this.routeParams.globalCanEdit
    }
  },
  // watch: {
  //   routeParams(obj) {
  //     this.getFormData()
  //   }
  // },
  methods: {
    // 展示表单数据
    displayDataToFormList() {
      let data = Object.assign({}, this.getCustInfoField('ALL'))
      if (isEmptyObj(data)) return
      data = this.convertData(data)
      this.newFormData = Object.freeze(Object.assign({}, data))
      this.formApi.setValue(data)
      this.formApi.updateRules({
        businessIncome: {
          tipContent: `上传最近财报值为${+data.reportBusinessIncome || '--'}万元`
        },
        totalAssets: {
          tipContent: `上传最近财报值为${+data.reportTotalAssets || '--'}万元`
        }
      })
      setTimeout(() => {
        // 单独设置 因为"是否绿色贷款"如果未赋值，该字段在页面不显示，需要重新set值
        this.formApi.setValue({
          greenPurpose: data.greenPurpose,
          groupCustomeName: data.groupCustomeName
        })
        this.formApi.clearValidateState()
      }, 100)
    },
    convertData(data) {
      let tempArr = ''
      // 办公地址
      if (data.officeAddress) {
        tempArr = data.officeAddress.split(',')
        if (tempArr.length < 3 || !tempArr.slice(0, 3).every(key => Number.isInteger(+key))) {
          data.officeAddressDetail = data.officeAddress
        } else {
          data.officeAddressDetail = tempArr.pop()
          data.officeAddress = tempArr
        }
      } else {
        delete data.officeAddressDetail
      }
      // 注册地址
      if (data.registerAddress) {
        tempArr = data.registerAddress.split(',')
        if (tempArr.length < 3 || !tempArr.slice(0, 3).every(key => Number.isInteger(+key))) {
          data.registerAddressDetail = data.registerAddress
        } else {
          data.registerAddressDetail = tempArr.pop()
          data.registerAddress = tempArr
        }
      } else {
        delete data.registerAddressDetail
      }
      // 贷款行业投向
      if (data.industry_first1) {
        data.industry_first1 = data.industry_first1.split(',')
      }
      // 绿色贷款用途
      if (data.greenPurpose) {
        data.greenPurpose = data.greenPurpose.split(',')
      }
      // 身份证住址
      if (data.idAddress) {
        tempArr = data.idAddress.split(',')
        data.idAddressDetail = tempArr.pop()
        data.idAddress = tempArr
      } else {
        delete data.idAddressDetail
      }
      // 联系住址
      if (data.homeAddress) {
        tempArr = data.homeAddress.split(',')
        data.homeAddressDetail = tempArr.pop()
        data.homeAddress = tempArr
      } else {
        delete data.homeAddressDetail
      }
      // 行业类别
      if (data.industry) {
        data.industry = data.industry.split(',')
      }
      // 企业类型
      if (Array.isArray(data.enterpriseType)) {
        data.enterpriseType = data.enterpriseType.pop()
      }
      // 客户性质
      if (data.custAttribute) {
        data.custAttribute = data.custAttribute.split(',')
      } else {
        data.custAttribute = []
      }
      return data
    },
    handleEditClick() {
      this.setFormEditStatus(true)
    },
    handleCancelClick() {
      this.formApi.clearValidateState()
      this.setFormEditStatus(false)
    },
    handleSaveClick() {
      this.formApi.validate(async valid => {
        if (valid) {
          const params = Object.assign({}, this.formApi.formData())
          if (!this.routeParams.id) return this.$showToast('客户id不允许为空')
          params.id = this.routeParams.id
          if (Array.isArray(params.industry)) {
            params.industry = params.industry.join(',')
          }
          if (Array.isArray(params.industry_first1)) {
            params.industry_first1 = params.industry_first1.join(',')
          }
          if (Array.isArray(params.officeAddress)) {
            params.officeAddress = `${params.officeAddress.join(',')},${params.officeAddressDetail || ''}`
          }
          if (Array.isArray(params.registerAddress)) {
            params.registerAddress = `${params.registerAddress.join(',')},${params.registerAddressDetail || ''}`
          }
          if (Array.isArray(params.idAddress)) {
            params.idAddress = `${params.idAddress.join(',')},${params.idAddressDetail || ''}`
          }
          if (Array.isArray(params.homeAddress)) {
            params.homeAddress = `${params.homeAddress.join(',')},${params.homeAddressDetail || ''}`
          }
          if (Array.isArray(params.greenPurpose)) {
            params.greenPurpose = params.greenPurpose.join(',')
          }
          if (Array.isArray(params.enterpriseType)) {
            params.enterpriseType = params.enterpriseType.pop()
          }
          if (params.custAttribute) {
            params.custAttribute = params.custAttribute.join(',')
          }
          delete params.officeAddressDetail
          delete params.registerAddressDetail
          delete params.idAddressDetail
          delete params.homeAddressDetail

          customerUpdate(params, { showLoading: true })
            .then(res => {
              this.$showToast('保存成功', 'success')
              this.changeParentPageHeadInfo(params)
              this.newFormData = Object.freeze(Object.assign({}, this.formApi.formData()))
              this.setFormEditStatus(false)
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    setFormEditStatus(status = false) {
      this.canEdit = status
      this.formApi.updateOptions({
        form: { disabled: !status }
      })
      if (!status) {
        this.formApi.setValue(this.newFormData)
      }
    },
    changeParentPageHeadInfo(data) {
      this.setTagsViewTitleAndHeaderInfo &&
        this.setTagsViewTitleAndHeaderInfo({
          custName: data.custName,
          enterpriseType: data.enterpriseType
        }, true)
    },
    handleSyncClick(event, forceUpdate = '') {
      this.showSyncLoading = true
      customerInfoSync({
        id: this.routeParams.id,
        flag: forceUpdate
      }, { captureError: true })
        .then(res => {
          if(res.status !== 0) {
            if(res.status === 70008) {
              this.showSyncConfirmDialog(res.msg)
            } else {
              this.$showToast(res.msg)
            }
            return
          }
          let data = res.data
          if (data && !data.oldCrm) {
            return this.$showToast('同步成功，无客户信息变更！', 'success')
          }
          if (data && !isEmptyObj(data.newCrm)) {
            data = data.newCrm
            // 筛选出值不为空或null的key
            data = Object.entries(data).filter(([key, value]) => value != null && value !== '')
            let newData = {}
            data.forEach(([key, value]) => {
              newData[key] = value
            })
            newData = { ...(this.newFormData || {}), ...newData }
            this.displayDataToFormList(newData)
            this.$emit('stockholder-info-change')
            this.$showToast('同步成功！', 'success')
          } else {
            this.$showToast('同步成功，无客户信息变更！', 'success')
          }
        })
        .finally(res => {
          this.showSyncLoading = false
        })
    },
    showSyncConfirmDialog(msg) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        })
        .then(() => {
          this.handleSyncClick('', '1')
        })
        .catch(() => {})
    },
    handleChildReady() {
      this.$nextTick(() => {
        this.formApi = this.$refs.formDom.formApi
        this.displayDataToFormList()
        if (this.routeParams.action === 'add') {
          this.setFormEditStatus(true)
        }
      })
    }
  }
}
</script>

<style lang='scss'>
</style>
