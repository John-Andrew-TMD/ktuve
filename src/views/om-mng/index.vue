<template>
  <div class="app-content">
    <iframe ref="iframe" :src="urlPath" class="iframe" />
  </div>
</template>

<script>
export default {
  name: 'ReportMng',
  data() {
    return {
    }
  },
  computed: {
    urlPath() {
      if (window.location.href.includes('nacos')) {
        return window.location.href + '/'
      }
      return window.location.href
    }
  },
  mounted() {
    this.iframeInit()
    window.addEventListener('resize', this.iframeInit())
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.iframeInit())
  },
  methods: {
    iframeInit() {
      const iframe = this.$refs.iframe
      const clientHeight = document.documentElement.clientHeight - 90
      iframe.style.height = `${clientHeight}px`
    }
  }
}
</script>

<style>
.iframe {
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 0;
}

</style>
