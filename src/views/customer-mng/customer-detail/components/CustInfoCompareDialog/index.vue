<template>
  <div>
    <el-dialog width="1100px" modal-append-to-body append-to-body title="新旧数据对比" :visible.sync="dialogVisible" @closed="handleDialogClosed">
      <el-tabs v-model="componentName">
        <el-tab-pane v-for="(item,index) in tabsList" :key="index" :label="item.tabsName" :name="item.compName" :lazy="true" />
      </el-tabs>
      <div style="flex: 1;overflow-y: auto;">
        <keep-alive include="OrgInfo">
          <component :is="componentName" v-bind="$attrs" />
        </keep-alive>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const TAB_LIST = [
  { tabsName: '机构信息', compName: 'OrgInfo' },
  { tabsName: '银行信息', compName: 'BankInfo' },
  { tabsName: '开票信息', compName: 'BillingInfo' },
  { tabsName: '股东信息', compName: 'StockholderInfo' },
  { tabsName: '关联关系', compName: 'AssociationInfo' }
]
export default {
  components: {
    OrgInfo: () => import('./components/OrgInfo.vue'),
    BankInfo: () => import('./components/BankInfo.vue'),
    BillingInfo: () => import('./components/BillingInfo.vue'),
    StockholderInfo: () => import('./components/StockholderInfo.vue'),
    AssociationInfo: () => import('./components/AssociationInfo.vue')
  },
  data() {
    return {
      dialogVisible: false,
      componentName: 'OrgInfo',
      tabsList: Object.freeze(TAB_LIST)
    }
  },
  mounted() {
    this.dialogVisible = true
  },
  methods: {
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    }
  }
}

</script>
<style lang="scss" scoped>
 div /deep/ .el-dialog {
   .el-dialog__body {
     display: flex;
     flex-direction: column;
     min-height: 500px;
     padding: 0 10px;
   }
   .dialog-body-container {
     display: flex;
     flex-direction: column;
     height: 100%;
     min-height: 500px;
   }
 }

</style>
