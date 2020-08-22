<template>
  <div style="padding: 15px;">
    流程研发中..., 表急
  </div>
</template>

<script>
import { getFlowFormData } from 'api/workflow-module/index.js'
export default {
  data() {
    return {

    }
  },
  created() {
    // this.getFormData()
  },
  methods: {
    getFormData() {
      getFlowFormData({
        processInstanceId: 'e19b70c5-9dc5-11ea-9b8a-52521675c999'
      }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang='scss'>

</style>
