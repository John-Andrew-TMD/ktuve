<template>
  <iframe ref="iframe" :src="urlPath" class="iframe" />
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
      const hostname = window.location.host
      let url = window.location.href
      url = url.replace(hostname + '/report-mng', hostname + '/external/report/index.html#')
      return url
    }
  },
  watch: {
    '$route': function(to, from) {
      this.$store.dispatch('tagsView/refreshCurrentTag', this)
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
