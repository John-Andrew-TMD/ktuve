<template>
  <el-table-column v-bind="item.attrs">
    <template v-if="hasChildren(item)">
      <table-columns v-for="(col, index) in item.children" :key="index" :item="col" />
    </template>
    <template v-if="item.slot" #default="scope">
      <slot :name="item.attrs.prop" :scope="scope" />
    </template>
    <template v-if="item.slotHeader" #header="scope">
      <slot :name="item.slotHeader" :scope="scope" />
    </template>
    <template
      v-else-if="item.filter"
      v-slot="scope"
    >{{ scope.row[item.attrs.prop] | filterHandler(item.filter.name, item.filter.params) }}</template>
  </el-table-column>
</template>

<script>
const FILTER_NAMES = {
  dict: 'filterDictValue',
  date: 'filterDateSeparate',
  timestamp: 'filterTimestamp',
  org: 'filterOrgInfo',
  user: 'filterUserInfo',
  toThousand: 'filterToThousand',
  address: 'filterChinaAddress'
}
export default {
  name: 'TableColumns',
  filters: {
    filterHandler(data, filterName, filterParams = []) {
      if (FILTER_NAMES[filterName]) {
        if (Array.isArray(filterParams)) {
          return Vue.filter(FILTER_NAMES[filterName])(data, ...filterParams)
        } else {
          return Vue.filter(FILTER_NAMES[filterName])(data, filterParams)
        }
      } else if (filterName === 'number') {
        return (+data || 0).toFixed(2)
      } else if (filterName === 'digit') {
        return (+data * 100).toFixed(2)
      } else {
        return data
      }
    }
  },
  components: {},
  props: {
    item: {
      type: [Object, Array]
    },
    key: Number
  },
  data() {
    return {}
  },
  methods: {
    hasChildren(item) {
      return Array.isArray(item.children)
    }
  }
}
</script>

<style lang='scss'>
</style>
