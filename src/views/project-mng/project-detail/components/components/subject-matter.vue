<!-- 标的物 -->
<template>
  <subject-matter :route-params="routeParams"></subject-matter>
</template>

<script>
import SubjectMatter from 'components/SubjectMatter'

export default {
  data() {
    return {}
  },
  props: ['routeParams'],
  components: {
    SubjectMatter
  }
}
</script>

<style lang='scss'>
.panel-subject-matter-info {
  padding: 0 15px;

  .btn-group {
    border-top: none;
  }
}
</style>
