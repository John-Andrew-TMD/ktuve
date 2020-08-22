<template>
  <contract-common-detail ref="contractDetail" :route-params="routeParams" @set-tags-view-title="setTagsViewTitle" />
</template>
<script>
import { isEmptyObj  } from "utils";
import ContractCommonDetail from './components/ContractCommonDetail.vue'
export default {
  name: "ContractDetail",
  components: {
    ContractCommonDetail
  },
  provide() {
    return {
      getContractInfoField: this.getContractInfoField,
    }
  },
  data() {
    return {
      fullPath: "",
      routeParams: null
    };
  },
  watch: {
    $route: function(to, from) {
      if (to.name !== "ContractDetail" || this.fullPath === to.fullPath) return;
      this.$store.dispatch("tagsView/refreshCurrentTag", this);
    }
  },
  created() {
    this.initUI();
  },
  methods: {
    initUI() {
      this.routeParams = { ...this.$route.query }
      this.fullPath = this.$route.fullPath;
    },
    setTagsViewTitle(data) {
      if (isEmptyObj(data)) return;
      const route = Object.assign({}, this.$route, {
        title: data.projectName
      });
      this.$nextTick(() => {
        this.$store.dispatch("tagsView/updateVisitedView", route);
      });
    }
  }
};
</script>

