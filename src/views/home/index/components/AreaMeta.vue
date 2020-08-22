<template>
  <div class="area-meta">
    <div class="info">
      <p><i class="iconfont icon-logo-icon" /></p>
      <p style="margin-left: 15px">
        <b>hello! 小明</b>
        <span>业务经理</span>
      </p>
    </div>
    <div style="width: 300px">
      <p>• 所在部门：业务拓展一部</p>
      <br>
      <p>• 本次登录：{{ loginDate }} </p>
    </div>
    <div>
      <p>• 登录地区：广东省深圳市 (IP：183.14.135.1)</p>
      <br>
      <p>•  上次登录：2019-01-01 12:00:00 </p>
    </div>
  </div>
</template>
<script>
import { timestampFormat } from 'utils'
export default {
  data() {
    return {
      loginDate: timestampFormat(+new Date())
    }
  }
}
</script>
<style lang="scss">
  .home-page {
    .area-meta {
      display: flex;
      align-items: center;
      padding: 20px;
      color: #333;
      .iconfont {
        font-size: 70px;
        color: #6495ed;
      }
      .info {
        width: 300px;
        display: flex;
        align-items: center;
        b {
          display: block;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
        }
      }
    }
  }

</style>

