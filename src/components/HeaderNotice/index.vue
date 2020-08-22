<template>
  <el-popover
    class="header-notice"
    width="400"
  >
    <div title="消息提醒" class="notice-icon" :class="{'has-new': hasNew}" slot="reference">
      <svg-icon icon-class="notice" />
    </div>
    <div class="notice-list-container">
      <h3>系统消息
        <span class="fr">4条未读消息</span>
      </h3>
      <ul class="notice-list">
        <li>
          <span title="风控部受理人**于2019-5-10 16:31:25审批通过了流程：项目名称：测试风控报告承租人分析长度。">风控部受理人**于2019-5-10 16:31:25审批通过了流程：项目名称：测试风控报告承租人分析长度。</span>
          <time>2019-05-10 16:31:25</time>
        </li>
        <li>
          <span title="公司主管业务负责人**于2019-5-10 16:31:03审批通过了流程：项目名称：测试风控报告承租人分析长度。">公司主管业务负责人**于2019-5-10 16:31:3审批通过了流程：项目名称：测试风控报告承租人分析长度。</span>
          <time>2019-05-10 16:31:03</time>
        </li>
        <li>
          <span title="业务部门主管系统管理员于2019-5-10 16:24:30审批通过了流程：项目名称：测试风控报告承租人分析长度。">业务部门主管系统管理员于2019-5-10 16:24:30审批通过了流程：项目名称：测试风控报告承租人分析长度。</span>
          <time>2019-05-10 16:24:30</time>
        </li>
      </ul>
      <p class="read-more">
        <a href="#">更多</a>
      </p>
    </div>
  </el-popover>
</template>

<script>
 export default {
   name: 'HeaderNotice',
   data () {
     return {
       hasNew: true
     }
   },
   components: {

   }
 }
</script>

<style lang="scss">
  .header-notice {
    .notice-icon {
      position: relative;
      font-size: 21px;
    }
    .has-new {
      &:after {
        content: '';
        position: absolute;
        top: 10px;
        right: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #f00;
        border: 2px solid #fff;
      }
    }
  }
  .notice-list-container {

      h3 {
        height: 30px;;
        line-height: 30px;
        font-size: 14px;

        span {
          font-weight: normal;
          color: #f00;
        }
      }

      .notice-list {
        margin-top: 5px;
        li {
          display: flex;
          justify-content: space-between;
          line-height: 28px;

          span {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
            transition: color .3s;

            &:hover {
              color: #5595ff;
            }
          }

          time {
            width: 140px;
            text-align: right;
          }
        }
      }

      .read-more {
        text-align: right;

        a {
          display: inline-block;
          padding: 5px 0 5px 5px;
          color: #5595ff;
        }
      }

    }
</style>

