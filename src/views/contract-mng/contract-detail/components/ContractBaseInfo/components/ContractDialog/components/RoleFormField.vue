<template>
  <div>
    <form-create ref="formDom" v-model="fApi" :rule="formRules" :option="formOptions" />
  </div>
</template>

<script>
import { isEmptyObj } from 'utils'
import { getFormRules, setRoleInfo } from '../../js/contract-field.config.js'
export default {
  data() {
    return {
      fApi: null,
      formRules: [],
      formOptions: {
        form: {
          labelWidth: '220px'
        },
        submitBtn: {
          show: false
        }
      }
    }
  },
  props: {
    contractItem: {
      type: Object,
      default: () => ({})
    },
    // 人员信息
    dataInfo: {
      type: Object,
      default: () => ({})
    },
    // 人员类型
    roleType: {
      type: String,
      default: ''
    },
    // 人员下拉选项数据
    dataList: {
      type: Array,
      default: () => []
    },
    // 人员表单配置项
    roleItem: {
      type: Object,
      default: () => ({})
    }
  },
  created() {
    this.iniForm()
  },
  methods: {
    iniForm() {
      const rules = this.getRules()
      const formData = this.getFormData()
      this.$nextTick(() => {
        this.fApi.reload(rules)
        setRoleInfo(this, formData)
      })
    },
    getRules() {
      const rules = getFormRules(this, this.roleType, this.contractEnName)
      if (this.isSelect) {
        const roleNameObj = rules.find(item => item.field === 'roleId')
        if (roleNameObj.type === 'el-custom-select') {
          roleNameObj.props.params.options = this.dataList
        }
      }
      return rules
    },
    getFormData() {
      let formData = {}
      if (!isEmptyObj(this.dataInfo)) {
        formData = this.dataInfo
      } else {
        formData = this.isSelect ? {} : this.dataList.length ? this.dataList[0] : {}
      }
      return formData
    },
    handleRoleChange(data) {
      this.$emit('role-change', data)
    }
  },
  computed: {
    // 人员是否是下拉框
    isSelect() {
      const formItem = this.roleItem.formItem
      const field = 'selectRoleId'
      for (let i = 0; i < formItem.length - 1; i++) {
        const item = formItem[i]
        if (typeof item === 'string') {
          return item === field
        } else if (typeof item === 'object') {
          return Object.keys(item)[0] === field
        }
      }
      return false
    },
    // 合同自定义英文名称
    contractEnName() {
      return this.contractItem.contracTypeForm
    }
  }
}
</script>
