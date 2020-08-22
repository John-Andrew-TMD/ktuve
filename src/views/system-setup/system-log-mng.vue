<template>
  <div class="app-content log-mng-page">
    <div class="app-content-wrapper" style="overflow: hidden">
      <!-- <el-form ref="formDom" :inline="true" :model="formItems">
      <el-form-item label="日志类型">
        <el-select v-model="formItems.log_type" placeholder="请选择">
          <el-option
            v-for="item in logTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="handleSearchReset">重置</el-button>
      </el-form-item>
      </el-form>-->
      <table-create ref="tableDom" :options="tableOptions" style="margin: 0">
        <template #expand="{ scope }">
          <el-form label-position="left">
            <el-form-item label="日志类">
              <span>{{ scope.row.callerClass }}</span>
            </el-form-item>
            <el-form-item label="日志文件名">
              <span>{{ scope.row.callerFilename }}</span>
            </el-form-item>
            <el-form-item label="方法名">
              <span>{{ scope.row.callerMethod }}</span>
            </el-form-item>
            <el-form-item label="方法行">
              <span>{{ scope.row.callerLine }}</span>
            </el-form-item>
            <el-form-item label="日志类名">
              <span>{{ scope.row.loggerName }}</span>
            </el-form-item>
            <el-form-item label="线程名">
              <span>{{ scope.row.threadName }}</span>
            </el-form-item>
            <el-form-item label="日志详情">
              <span>{{ scope.row.formattedMessage }}</span>
            </el-form-item>
          </el-form>
        </template>
      </table-create>
    </div>
  </div>
</template>

<script>
import { logList } from "api/system-setup.js";
import TableCreate from "components/TableCreate";
export default {
  name: "ProperCaseName",
  components: {
    TableCreate
  },
  props: {},
  data() {
    return {
      // formItems: {
      //   log_type: 'ACTIVITY'
      // },
      // logTypeOptions: [
      //   {
      //     label: '行为日志',
      //     value: 'ACTIVITY'
      //   },
      //   {
      //     label: '系统日志',
      //     value: 'SYSTEM'
      //   }
      // ],
      tableOptions: {
        columns: [
          {
            attrs: {
              type: "expand",
              prop: "expand"
            },
            slot: true
          },
          {
            attrs: {
              label: "日志类型",
              prop: "arg1",
              formatter: row => {
                return (
                  {
                    ACTIVITY: "用户行为日志",
                    SYSTEM: "系统管理日志",
                    MAINTENANCE: "运维人员日志"
                  }[row.arg1] || row.arg1
                );
              }
            }
          },
          {
            attrs: {
              label: "日志等级",
              prop: "levelString"
            }
          },
          {
            attrs: {
              label: "用户名",
              prop: "userName"
            }
          },
          {
            attrs: {
              label: "生成日期",
              prop: "timestmp",
              formatter: row => {
                return Vue.filter("filterTimestamp")(row.timestmp);
              }
            }
          }
        ],
        requestParams: {
          url: logList,
          data: {}
        }
      }
    };
  },
  methods: {
    // handleSearch() {
    //   this.$refs.tableDom.searchTableData({
    //     arg1: this.formItems.log_type
    //   })
    // },
    // handleSearchReset() {
    //   this.$refs.formDom.resetFields()
    //   this.$refs.tableDom.resetTableData()
    // }
  }
};
</script>

<style lang='scss'>
.log-mng-page {
  .el-table__expanded-cell {
    text-align: left;
    .el-form-item {
      margin-bottom: 0;
      font-weight: normal;
    }
    .el-form-item__label {
      width: 90px;
      color: #99A9BF;
    }
  }
}

</style>
