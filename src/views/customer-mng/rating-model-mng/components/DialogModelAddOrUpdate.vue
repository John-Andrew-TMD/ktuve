<template>
  <el-dialog
    :title="dialogTitle"
    width="800px"
    :modal-append-to-body="false"
    :visible.sync="dialogVisible"
    @closed="handleDialogClosed"
  >
    <el-form ref="formDom" :model="formItems" :rules="formRules" label-width="100px">
      <el-form-item label="模型名称" prop="modelName">
        <el-input v-model="formItems.modelName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="适用行业" prop="applyIndustry" class="industry-container">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >全部行业</el-checkbox>
        <el-checkbox-group
          v-model="formItems.applyIndustry"
          class="industry-group"
          @change="handleCheckChange"
        >
          <el-checkbox
            v-for="(item,index) in industryData"
            :key="index"
            :label="item.value"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryDictItems, isEmptyObj } from 'utils'
import { modelAdd, modelUpdate } from 'api/customer-module/api-rating-model-mng.js'
import { log } from 'util'
export default {
  props: {
    modelInfo: {
      type: Object,
      default: () => ({})
    },
    dialogTitle: {
      type: String,
      default: '新增模型'
    }
  },
  data() {
    return {
      dialogVisible: false,
      formItems: {
        modelName: '',
        applyIndustry: []
      },
      formRules: {
        modelName: [{ required: true, message: '必填项不能为空！', trigger: 'blur' }],
        applyIndustry: [{ required: true, message: '必填项不能为空！', trigger: 'blur' }]
      },
      industryData: queryDictItems('10002'),
      checkAll: false,
      isIndeterminate: true
    }
  },
  mounted() {
    this.dialogVisible = true
  },
  created() {
    if (!isEmptyObj(this.modelInfo)) {
      this.formItems = {
        modelName: this.modelInfo.modelName,
        applyIndustry: this.modelInfo.applyIndustry.split(',')
      }
    }
  },
  methods: {
    handleDialogConfirm() {
      this.$refs.formDom.validate(valid => {
        if (!valid) return
        const params = { ...this.formItems }
        params.applyIndustry = params.applyIndustry.join(',')
        if (isEmptyObj(this.modelInfo)) {
          modelAdd(params, { showLoading: true })
            .then(res => {
              this.$showToast('新增成功！', 'success')
              this.dialogVisible = false
              this.$emit('dialog-confirm')
              this.$router.push({
                path: '/customer-mng/rating-model-setting',
                query: {
                  id: res.data.id
                }
              })
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          params.id = this.modelInfo.id
          modelUpdate(params, { showLoading: true })
            .then(res => {
              this.$showToast('修改成功！', 'success')
              this.dialogVisible = false
              this.$nextTick(() => {
                this.$emit('dialog-confirm', params)
              })
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    handleCheckAllChange(val) {
      const data = this.industryData.map(item => item.value)
      this.formItems.applyIndustry = val ? data : []
      this.isIndeterminate = false
    },
    handleCheckChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.industryData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.industryData.length
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.industry-container {
  & /deep/ .el-form-item__content {
    padding: 5px 10px;
    border: 1px dotted #D7E3F9;
    background: #F8FCFE;
  }
  .industry-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-checkbox {
      width: 43%;
    }
  }
}

</style>
