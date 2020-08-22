<template>
  <div class="comp-form-collapse">
    <el-collapse-transition>
      <div v-show="isActive">
        <slot></slot>
      </div>
    </el-collapse-transition>
    <div @click="handleClick" class="btn-collapse">
      {{isActive ? '收起' : '展开'}} <i :class="isActive ? 'el-icon-arrow-up': 'el-icon-arrow-down'"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: true
    };
  },
  methods: {
    handleClick() {
      this.isActive = !this.isActive;
    }
  },
  components: {}
};
</script>

<style lang='scss' scoped>
.comp-form-collapse {
  .btn-collapse {
    position: relative;
    z-index: 1;
    width: 50px;
    margin: -15px auto 0;
    line-height: 30px;
    cursor: pointer;
    transition-duration: .3s;
    text-align: center;
    color: rgba(24, 144, 255, .5);

    &:hover {
      color: rgba(24, 144, 255, 1);
    }
  }
}

</style>
