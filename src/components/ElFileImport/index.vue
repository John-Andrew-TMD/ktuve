<template>
  <el-button type="primary" class="import-btn" v-bind="$attrs">
    {{ text }}
    <input v-if="!$attrs.disabled" ref="fileInput" type="file" @change="changeFile" />
  </el-button>
</template>

<script>
import { getExcelData, transferData, checkTemplate } from './js/import-excel.js'

export default {
  props: {
    text: {
      type: String,
      default: '导入'
    },
    /**
     * 格式 [{ field: '字段名', title: '标题', type: 'money' }]
     * fieldMap的type类型有：
     * date 日期，如2020/1/2
     * money 金额
     */
    fieldMap: {
      type: Array,
      default: () => []
    },
    listHead: {
      type: Array,
      default: () => []
    },
    mustCheck: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  methods: {
    async changeFile(e) {
      const file = e.target.files[0]
      if (
        file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
        file.type !== 'application/vnd.ms-excel'
      ) {
        this.clearValue(e)
        return this.$showToast('导入失败，导入文件类型不正确！', 'warning')
      }
      const data = await getExcelData(file)
      this.clearValue(e)
      if (this.fieldMap.length) {
        if (this.mustCheck) {
          const check = checkTemplate(data.dataBody[0], this.listHead, this.fieldMap)
          if (!check) {
            return this.$showToast('导入失败,请使用系统提供的模板导入', 'warning')
          }
        }
        const newData = transferData(this, data.dataBody[0], this.listHead, this.fieldMap)
        if (!newData) return
        this.$emit('change', newData)
      } else {
        this.$emit('change', data)
      }
    },
    clearValue(e) {
      e.target.value = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.import-btn {
  position: relative;
  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
</style>
