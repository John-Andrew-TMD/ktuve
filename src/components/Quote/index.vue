<template>
  <div class="comp-quote">
    <div class="quote-wrapper">
      <div class="meta">
        <i v-if="icon" :class="'iconfont icon-'+icon" />
        {{ text }}
        <span>{{ subText }}</span>
        <slot name="left" />
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Quote',
  props: {
    icon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    subText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.comp-quote {
  position: relative;
  z-index: 1;
  height: 44px;
  padding: 0 15px;
  line-height: 44px;
  border-bottom: 1px solid #EEEEEE;
  background-color: #FFFFFF;
  flex-shrink: 0;

  .quote-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }

  .meta {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    font-size: 15px;
    color: #565E70;

    .iconfont {
      display: inline-block;
      width: 30px;
      height: 30px;
      margin-right: 7px;
      font-size: 20px;
      line-height: 30px;
      text-align: center;
      vertical-align: middle;
      color: #5595FF;
      border-radius: 50%;
      background: #E8F0FF;
    }

    >span {
      color: #5595FF;
    }
  }
}

</style>
