<template>
  <div class="comp-process-chart">
    <div id="processChartContainer" />
  </div>
</template>

<script>
import ProcessImage from './processImage.js'
import { getFlowImageData, getFlowHotAreaData } from 'api/workflow-module/index.js'
export default {
  props: {
    routeParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
    }
  },
  created() {
    this.getFlowImageAndHotAreaData()
  },
  mounted() {},
  methods: {
    getFlowImageAndHotAreaData() {
      Promise.all([getFlowImageData({
        processInstanceId: this.routeParams.processInstanceId
      }, { showLoading: true }), getFlowHotAreaData({
        processInstanceId: this.routeParams.processInstanceId
      })]).then(res => {
        let [imageData, hotAreaData] = res
        imageData = imageData.resultData || {}
        hotAreaData = hotAreaData.resultData || []
        new ProcessImage('processChartContainer', 'processImage', imageData, hotAreaData).generateImage()
      })
    }
  }
}
</script>

<style lang='scss'>

</style>
