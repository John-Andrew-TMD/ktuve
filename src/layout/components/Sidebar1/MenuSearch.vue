<template>
  <div class="sidebar-menu-search">
    <el-select
      v-model="keyword"
      size="mini"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="请输入关键字"
      @change="handleSearchChange"
    >
      <el-option v-for="item in searchResult" :key="item.item.path" :value="item.item.path" :label="item.item.title.join(' > ')" />
    </el-select>
  </div>
</template>

<script>
import Fuse from 'fuse.js'
import path from 'path'
export default {
  props: {
    routes: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      keyword: '',
      searchPool: [],
      searchResult: [],
      fuse: undefined
    }
  },
  mounted() {
    this.searchPool = this.generateRoutes(this.routes)
    this.initFuse(this.searchPool)
  },
  beforeDestroy() {
    this.fuse = null
  },
  methods: {
    querySearch(keyword) {
      if (keyword !== '') {
        this.searchResult = this.fuse.search(keyword)
      } else {
        this.searchResult = []
      }
    },
    generateRoutes(routes, basePath = '/', prefixTitle = []) {
      let res = []

      for (const router of routes) {
        // skip hidden router
        if (router.hidden) { continue }

        const data = {
          path: path.resolve(basePath, router.path),
          title: [...prefixTitle]
        }

        if (router.meta && router.meta.title) {
          data.title = [...data.title, router.meta.title]

          if (router.redirect !== 'noRedirect') {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data)
          }
        }

        // recursive child routes
        if (router.children) {
          const tempRoutes = this.generateRoutes(router.children, data.path, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    },
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [{
          name: 'title',
          weight: 0.7
        }, {
          name: 'path',
          weight: 0.3
        }]
      })
    },
    handleSearchChange(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang='scss' scoped>
  .sidebar-menu-search {
    padding: 5px 10px;
  }

</style>
