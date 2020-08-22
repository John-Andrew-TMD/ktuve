<template>
  <el-row type="flex" justify="space-between" class="area-center">
    <el-col :span="11">
      <flow-list/>
    </el-col>
    <el-col :span="11">
      <message-list/>
    </el-col>
  </el-row>
</template>
<script>
import MessageList from './MessageList'
import FlowList from './FlowList'
export default {
  data() {
    return {}
  },
  components: {
    MessageList,
    FlowList
  }
}
</script>
<style lang="scss">
  .home-page {
    .area-center {
      .el-col-11 {
        width: 48.666666%;
      }
      .el-col {
        height: 430px;
        margin-bottom: 15px;
        box-shadow: 0 0 5px rgba(176, 205, 255, .8);
      }
    }

    @media screen and (max-width: 1460px) {
      .area-center {
        .el-col-11 {
          width: 49.333333%;
        }
      }
    }

    @media screen and (max-width: 1250px) {
      .area-center {
        .el-col-11 {
          width: 49%;
        }
      }
    }

    @media screen and (max-width: 900px) {
      .area-center {
        flex-wrap: wrap;
        .el-col-11 {
          width: 100%;
        }
      }
    }
  }


</style>


