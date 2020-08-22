<template>
  <div class="form-search-container">
    <el-custom-collapse :collapse="collapse">
      <div class="form-search-wrapper">
        <slot />
        <div class="btn-groups">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="info" @click="handleReset">重置</el-button>
        </div>
      </div>
    </el-custom-collapse>
  </div>
</template>

<script>
import ElCustomCollapse from 'components/ElCollapse'
export default {
  components: {
    ElCustomCollapse
  },
  props: {
    collapse: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search')
    },
    handleReset() {
      try {
        const slot = this.$slots.default[0]
        const slotTag = slot.tag
        if (slotTag.endsWith('FormCreate')) {
          slot.componentInstance.$f.resetFields()
        } else if (slotTag.endsWith('ElForm')) {
          slot.componentInstance.resetFields()
        }
      } catch (e) { console.log(e) }
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss" scoped>
.form-search-container /deep/  {
  .form-search-wrapper {
    display: flex;
    .btn-groups {
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
    .el-form-item__content > div {
      width: 200px;
    }
  }
}

</style>
