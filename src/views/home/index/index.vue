<template>
  <div class="app-content home-page">
    <div class="app-content-wrapper">
      <area-meta />
      <area-top :area-top-data="areaTopData" />
      <area-center />
      <!-- <area-bottom/> -->
    </div>
  </div>
</template>

<script>
import AreaMeta from './components/AreaMeta'
import AreaTop from './components/AreaTop'
import AreaCenter from './components/AreaCenter'
// import AreaBottom from './components/AreaBottom'
export default {
  name: 'Home',
  components: {
    AreaMeta,
    AreaTop,
    AreaCenter
    // AreaBottom
  },
  data() {
    return {
      areaTopData: {
        backlog: '-',
        tenantIncreasedThisMonth: '-',
        tenantAccountThisYear: '-',
        surveyIncreasedThisMonth: '-',
        surveyAccountThisYear: '-',
        contractIncreasedThisMonth: '-',
        contractAccountThisMonth: '-'
      }
    }
  },
  provide() {
    return {
      setAretTopData: this._setAretTopData
    }
  },
  activated() {
    this.$store.commit('refresh/REFRESH_HOME_PAGE')
  },
  methods: {
    // 子组件展示数据到顶部组件
    _setAretTopData(data) {
      if (!data) return
      Object.keys(data).map(item => {
        this.areaTopData[item] = data[item]
      })
    }
  }
}
</script>
<style lang="scss">
.home-page {
  padding: 0;
  background: #FFFFFF;
}

</style>
