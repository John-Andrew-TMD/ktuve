<template>
  <div class="app-content app-content--quote file-store-mng-page">
    <quote text="文件上传下载测试" icon="file-store" />
    <div class="app-content-wrapper">
      <upload :auto-upload="true" />
    </div>
  </div>
</template>

<script>
import Quote from 'components/Quote'
import Upload from 'components/Upload'
export default {
  components: {
    Quote,
    Upload
  },
  data() {
    return {
    }
  },
  methods: {

  }
}
</script>

<style lang='scss'>
.file-store-mng-page {
  .form-container {
    max-width: 600px;
    margin-top: 10px;
  }
  .form-btn {
    padding-left: 110px;
  }
}

</style>
