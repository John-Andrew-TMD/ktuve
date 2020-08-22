<template>
  <div class="comp-collapse">
    <template v-if="collapse">
      <el-collapse-transition>
        <div v-show="isActive">
          <slot />
        </div>
      </el-collapse-transition>
      <div class="btn-collapse" @click="handleClick">
        {{ isActive ? '收起' : '展开' }}
        <i :class="isActive ? 'el-icon-arrow-up': 'el-icon-arrow-down'" />
      </div>
    </template>
    <template v-else><slot /></template>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      isActive: true
    };
  },
  props: {
    collapse: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClick() {
      this.isActive = !this.isActive;
    }
  }
};
</script>

<style lang='scss' scoped>
.comp-collapse {
  .btn-collapse {
    position: relative;
    z-index: 1;
    width: 50px;
    margin: -10px auto 0;
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
