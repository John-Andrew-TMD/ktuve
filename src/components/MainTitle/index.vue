<template>
  <el-row class="g-title-wrap" type="flex" justify="center" :class="{'border-bottom':border}">
    <el-col :span="colspan[0]" class="g-title-left">
      <div class="icon-wrap" v-if="icon">
        <div class="icon-inner" :style="{backgroundColor:iconBgColor}">
          <i
            class="icon"
            :class="icon"
            :style="{color:iconColor, width:iconSize+'px',height:iconSize+'px',lineHeight:iconSize+'px', fontSize:iconSize+'px'}"
          ></i>
        </div>
      </div>
      <div class="title-text" v-html="title"></div>
      <div class="subtitle-text" v-html="subtitle" :style="{color:subtitleColor}" v-if="subtitle"></div>
      <slot name="left"></slot>
    </el-col>
    <el-col :span="colspan[1]" class="g-title-right" v-if="colspan[1]">
      <slot name="right"></slot>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    colspan: {
      type: Array,
      default: () => [24, 0]
    },
    title: {
      type: String,
      default: '--'
    },
    subtitle: {
      type: String,
      default: ''
    },
    subtitleColor: {
      type: String,
      default: '#565e70'
    },
    iconBgColor: {
      type: String,
      default: '#e8f0ff'
    },
    icon: {
      type: String,
      default: ''
    },
    iconSize: {
      type: Number,
      default: 18
    },
    iconColor: {
      type: String,
      default: '#5595ff'
    },
    border: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.g-title-wrap {
  background: #fff;
  padding: 10px 20px;
  .el-col {
    display: flex;
    align-items: center;
  }
  .g-title-left {
    justify-content: flex-start;
    color: #565e70;
    .icon-wrap {
      margin-right: 15px;
      .icon-inner {
        $h: 30px;
        width: $h;
        height: $h;
        border-radius: $h;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .icon {
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100%;
        text-align: center;
        vertical-align: middle;
      }
      .icon-title-car {
        background-image: url('~@/assets/images/car.png');
      }
    }
    .title-text {
      font-size: 16px;
      margin-right: 15px;
    }
    .subtitle-text {
      margin-right: 15px;
    }
  }
  .g-title-right {
    justify-content: flex-end;
  }
}
.border-bottom {
  border-bottom: 1px solid #e4effa;
}
</style>