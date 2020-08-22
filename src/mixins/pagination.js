export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      pageCount: 0
    }
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.currentPage = 1
      this.getTableData()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getTableData()
    }
  }
}
