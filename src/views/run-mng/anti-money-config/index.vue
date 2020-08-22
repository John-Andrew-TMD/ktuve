<template>
    <div class="app-content anti-money-config">
        <div class="app-content-wrapper">
             <div class="btn-group">
                <el-button type="primary" size="mini" @click="handleAddClick">编辑</el-button>
                <el-button class="right" type="text" @click="handleConfig(item)">反洗钱风险等级配置</el-button>
            </div>
            <table-create
                ref="tableDom"
                :options="tableOptions"
                @row-click="handleRowClick"
                @current-change="handleCurrentChange"
                @selection-change="handleSelectionChange"
            />
            <component
                :is="componentName"
                v-if="dialogStatus"
                :dialog-status.sync="dialogStatus"
                @dialog-confirm="handleDialogConfirm"
            />
        </div>
    </div>
</template>
<script>
import IndexCtrl from './indexCtrl'
export default {
   mixins:[IndexCtrl] 
}
</script>
<style lang="scss" scoped>
    .btn-group .right.el-button{
        float:right;
    }
</style>