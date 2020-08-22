<template>
  <div class="app-content app-content--quote password-policy-page">
    <quote text="密码策略" icon="pwd"></quote>
    <div class="app-content-wrapper">
      <el-form
        label-width="250px"
        style="width:520px"
        v-show="showForm"
      >
        <el-form-item v-for="item in inputItems" :label="item.strategyName" :key="item.id">
          <el-input v-model="item.defaultValue"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-for="item in checkboxItems" v-model="item.requireCheck" :true-label="1" :false-label="0">{{ item.strategyName }}</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSaveClick">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Quote from "@/components/Quote";
import { passwordStrategyList, passwordStrategyAdd } from 'api/system-setup.js'
export default {
  data() {
    return {
      showForm: false,
      inputItems: [],
      checkboxItems: []
    };
  },
  components: {
    Quote
  },
  created() {
    this.getPasswordStrategyConfigs();
  },
  methods: {
    getPasswordStrategyConfigs() {
      passwordStrategyList({}, { showLoading: true }).then(res => {
        if(res.data && Array.isArray(res.data.records) && res.data.records.length) {
          const records = res.data.records
          this.inputItems = records.filter(item => item.strategeType === 0)
          this.checkboxItems = records.filter(item => item.strategeType === 1)
          this.showForm = true
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSaveClick() {
      passwordStrategyAdd([
        ...this.inputItems.map(item => {
          return {
            id: item.id,
            defaultValue: item.defaultValue
          }
        }),
        ...this.checkboxItems.map(item => {
          return {
            id: item.id,
            requireCheck: item.requireCheck
          }
        })
      ], { showLoading: true }).then(res => {
        this.$showToast('保存成功！', 'success')
      }).catch(err => {
        console.log(err)
      })
    }
  }
};
</script>
