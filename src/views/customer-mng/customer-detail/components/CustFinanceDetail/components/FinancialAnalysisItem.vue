<template>
  <div class="kpi-list-item" style="width: 20%">
    <h3 :style="{color: color}"><span>{{ title }}</span></h3>
    <div>
      <p v-for="(item, index) of dataList" :key="index">
        <label>{{ item.label }}：</label>{{ item.value }}
      </p>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#fff'
    },
    dataList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style lang='scss' scoped>
.kpi-list-item {
  p{
    display: flex;
    // justify-content:center;
    label {
      width: 140px !important
    }
  }
}
</style>
