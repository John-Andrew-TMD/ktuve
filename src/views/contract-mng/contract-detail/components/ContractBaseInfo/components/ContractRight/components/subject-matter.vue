<!-- 标的物 -->
<template>
  <div class="contract-subject-matter">
    <h4>
      <span style="margin-right: auto">租赁物清单</span>
      <el-button v-if="canEdit && isHistory" class="syncBtn" icon="el-icon-refresh" size="mini" @click="handleSynchronizeProject()">获取项目信息</el-button>
    </h4>
    <subject-matter v-if="isVisible" ref="subjectDom" :route-params="routeParams" />
  </div>
</template>

<script>
import SubjectMatter from 'components/SubjectMatter'
import { isEmptyObj } from 'utils'
import { synchronizeProject } from 'api/project-module/api-project-subject-matter.js'
import ContractRightMixins from './mixins/ContractRightMixins'
export default {
  components: {
    SubjectMatter
  },
  mixins: [ContractRightMixins],
  props: {
    contractRowInfo: {
      type: Object,
      default: () => ({})
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      routeParams: {},
      isVisible: false
    }
  },
  watch: {
    contractRowInfo: {
      handler(obj) {
        // console.log('obj', obj)
        if (!isEmptyObj(obj)) {
          if (this.isHistory && this.canEdit) {
            this.routeParams.canEdit = true
          } else {
            this.routeParams.canEdit = false
          }
          this.routeParams.id = obj.id
          this.isVisible = false
          this.$nextTick(() => {
            this.isVisible = true
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    handleSynchronizeProject() {
      const data = {
        contractId: this.contractRowInfo.id,
        managerId: this.contractRowInfo.projectManagerId,
        type: '0'
      }
      synchronizeProject(data, { showLoading: true }).then(res => {
        this.$showToast('同步项目信息成功!', 'success')
        this.$refs.subjectDom.$refs.tableDom.resetTableData()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.contract-subject-matter {
  h4 {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
    color: #5B6377;
    .syncBtn {
      position: absolute;
      right: 0;
      bottom: -39px;
    }
  }
  .panel-subject-matter-info {
    padding: 0;
    .btn-group {
      border-top: none;
    }
  }
}

</style>
