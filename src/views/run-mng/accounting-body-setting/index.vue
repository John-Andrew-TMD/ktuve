<template>
  <div class="app-content accounting-body-setting-page">
    <div class="app-content-wrapper">
      <div class="left-area">
        <left-area ref="leftArea" :selected-id.sync="selectedId" />
      </div>
      <div class="right-area">
        <right-area :id="selectedId" />
      </div>
    </div>
  </div>
</template>
<script>
import LeftArea from './components/LeftArea.vue'
import RightArea from './components/RightArea.vue'
export default {
  components: {
    LeftArea,
    RightArea
  },
  // name: 'AccountingBodySetting',
  data() {
    return {
      selectedId: ''
    }
  },
  provide() {
    return {
      refreshAccounttingBodyTable: this.refreshAccounttingBodyTable
    }
  },
  methods: {
    refreshAccounttingBodyData() {
      this.$refs.leftArea.refreshTableData()
    }
  }
}

</script>
<style lang='scss'>
.accounting-body-setting-page {
  overflow-y: hidden;
  .app-content-wrapper {
    display: flex;
    justify-content: space-between;
    height: 100%;
    padding-top: 0;
    padding-right: 0;
  }
  .left-area {
    overflow-x: hidden;
    overflow-y: auto;
    flex-shrink: 0;
    width: 550px;
    margin-right: 10px;
    padding-top: 10px;
    padding-right: 10px;
    box-shadow: rgba(201,217,248,.5) 3px 0 5px;
  }

  .right-area {
    overflow: hidden;
    flex: 1;
    padding-top: 10px;
    background: #FFFFFF;

    &::-webkit-scrollbar-track-piece {
      background-color: #FFFFFF;
    }
  }
}

</style>
