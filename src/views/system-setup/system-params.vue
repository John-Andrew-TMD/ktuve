<template>
  <div class="app-content system-params-page">
    <quote text="密码策略" icon="pwd" />
    <div class="content">
      <el-form
        ref="formDom"
        :model="formItems"
        label-width="260px"
        :rules="formRules"
        style="width:520px"
      >
        <el-form-item label="新增用户默认密码">
          <el-input v-model="formItems['10101']" />
        </el-form-item>
        <el-form-item label="n次密码错误后进行锁定" prop="10102">
          <number-input v-model="formItems['10102']" :min-value="1" :max-decimal="0" />
        </el-form-item>
        <el-form-item label="自动锁定时间(分)">
          <number-input v-model="formItems['10119']" :min-value="1" :max-decimal="0" />
        </el-form-item>
        <el-form-item label="操作员密码过期提醒的剩余天数">
          <number-input v-model="formItems['10103']" :min-value="1" :max-decimal="0" />
        </el-form-item>
        <el-form-item label="操作员密码最小长度">
          <number-input v-model="formItems['10105']" :min-value="1" :max-decimal="0" />
        </el-form-item>
        <el-form-item label="操作员密码最大长度">
          <number-input v-model="formItems['10106']" :min-value="1" :max-decimal="0" />
        </el-form-item>
        <el-form-item label="密码不能与历史N次内重复">
          <number-input v-model="formItems['10107']" :min-value="1" :max-decimal="0" />
        </el-form-item>
        <el-form-item>
          <el-checkbox-group v-model="formItems.passwordStrategy">
            <el-checkbox label="10108">密码必须包含数字</el-checkbox>
            <el-checkbox label="10109">密码必须包含小写字母</el-checkbox>
            <el-checkbox label="10110">密码必须包含大写字母</el-checkbox>
            <el-checkbox label="10111">密码必须包含个性字符</el-checkbox>
            <el-checkbox label="10112">密码不能与用户名相同</el-checkbox>
            <el-checkbox label="10113">密码不能为连续/倒序的数字或字母</el-checkbox>
            <el-checkbox label="10114">密码相邻两位不能为同一个字符</el-checkbox>
            <el-checkbox label="10115">密码不能出现相同的字符</el-checkbox>
            <el-checkbox label="10117">新用户首次登录需修改密码</el-checkbox>
            <el-checkbox label="10118">用户密码重置后首次登陆需修改密码</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSaveClick">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Quote from '@/components/Quote'
const SYSTEM_PARAM_KEYS = [
  '10101',
  '10102',
  '10103',
  '10105',
  '10106',
  '10107',
  '10119'
]
export default {
  components: {
    Quote
  },
  data() {
    return {
      formItems: {
        passwordStrategy: [],
        10101: '',
        10102: '',
        10103: '',
        10105: '',
        10106: '',
        10107: '',
        10119: ''
      },
      formRules: {
        '10102': this.formValidate({ min: 1 }),
        '10103': this.formValidate({ min: 1 }),
        '10105': this.formValidate({ min: 1 }),
        '10106': this.formValidate({ min: 1 }),
        '10107': this.formValidate({ min: 1 }),
        '10109': this.formValidate({ min: 1 })
      }
    }
  },
  created() {
    this._getSystemConfigs()
  },
  methods: {
    _getSystemConfigs() {
      this.$promiseRequest({
        code: '100311',
        data: {}
      })
        .then(res => {
          const data = res.data.record
          if (data) {
            data.forEach(item => {
              if (SYSTEM_PARAM_KEYS.includes(item.paramid)) {
                this.formItems[item.paramid] = item.paramvalue
              } else if (item.paramvalue === '1') {
                this.formItems.passwordStrategy.push(item.paramid)
              }
            })
            this.originData = _.cloneDeep(this.formItems)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSaveClick() {
      this.$refs.formDom.validate(async valid => {
        if (valid) {
          this._submitConfigs()
        }
      })
    },
    _submitConfigs() {
      if (_.isEqual(this.formItems, this.originData)) {
        return this.$showToast('数据未发生改变', 'warning')
      }
      const params = this._getParams()
      this.$promiseRequest({
        code: '100310',
        data: {
          packet1: 'data',
          packet2: '6',
          packet3: 'sysid,paramcode,paramid,paramvalue,checksno,checkoperdate',
          packet4: ',|',
          parampack: params
        }
      })
        .then(res => {
          this.$showToast(res.data.result.prompt, 'success')
          this._getSystemConfigs()
        })
        .catch(err => {
          console.log(err)
        })
    },
    _getParams() {
      // 筛选出复选框新增或者删除项
      // 以原始数据为基准，找出删除项
      const deletedKeys = _.difference(
        this.originData.passwordStrategy,
        this.formItems.passwordStrategy
      )
      // 以新数据为基准，找出新增项
      const addedKeys = _.difference(
        this.formItems.passwordStrategy,
        this.originData.passwordStrategy
      )
      const changedKeys = []
      SYSTEM_PARAM_KEYS.map(key => {
        if (this.formItems[key] !== this.originData[key]) {
          changedKeys.push(key)
        }
      })
      const parmas = []
      deletedKeys.forEach(key => {
        parmas.push(`1,0,${key},0,,`)
      })
      addedKeys.forEach(key => {
        parmas.push(`1,0,${key},1,,`)
      })
      changedKeys.forEach(key => {
        parmas.push(`1,0,${key},${this.formItems[key]},,`)
      })
      return parmas.join('|')
    }
  }
}
</script>
