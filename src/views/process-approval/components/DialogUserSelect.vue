<template>
  <el-dialog
    :visible.sync="dialogShow"
    title="请选择用户"
    width="600px"
    :modal-append-to-body="false"
    @closed="handleDialogClosed"
  >
    <div v-if="userList.length" class="user-select-content">
      <div v-for="(item, index) in userList" :key="index" class="select-item">
        <h4 v-if="item.title">{{ item.title }}</h4>
        <el-checkbox-group v-model="item.selection" :max="item.max">
          <el-checkbox
            v-for="(user,index) in item.data"
            :key="index"
            :label="user.userid"
          >{{ user.username }}({{ user.userid }})</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogShow=false">取 消</el-button>
      <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { deepAssign } from 'utils'
export default {
  props: ['userData'],
  data() {
    return {
      dialogShow: false,
      userList: []
      // userList: [
      //   {
      //     title: "风险部法律岗",
      //     data: [
      //       {
      //         userid: "1003001",
      //         username: "贾先泉"
      //       }
      //     ],
      //     least: 2,
      //     max: 3,
      //     selection: []
      //   }
      // ]
    }
  },
  created() {
    if (!this.userData) return
    const tempArr = [].concat(deepAssign({}, this.userData))
    tempArr.forEach(item => {
      item.selection = []
      item.max = item.count || 1
      item.min = item.least && '' || 1
    })
    this.userList = tempArr
  },
  mounted() {
    this.dialogShow = true
  },
  methods: {
    handleDialogConfirm() {
      if (!this._validateSelection()) return
      const ret = JSON.stringify(
        [].concat(
          ...this.userList.map(item => {
            return item.selection.map(uid => {
              return {
                userid: uid,
                ...(item.role && { role: item.role })
              }
            })
          })
        )
      )
      this.dialogShow = false
      this.$emit('dialogConfirm', ret)
    },
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    },
    _validateSelection() {
      if (!this.userList.length) { return this.$showToast('请选择流程下一步处理人!') }
      let flag = true
      for (let i = 0; i < this.userList.length; i++) {
        const item = this.userList[i]
        const { count = 0, least = 0, selection = [], title = '' } = item
        if (!selection.length) {
          this.$showToast(`请选择${title || '流程下一步'}处理人!`)
          flag = false
          break
        } else if (count > 0 && selection.length !== count) {
          this.$showToast(`请选择${count}个${title}处理人!`)
          flag = false
          break
        } else if (least > selection.length) {
          this.$showToast(`请至少选择${least}个${title}处理人!`)
          flag = false
          break
        }
      }
      return flag
    }
  }
}
</script>

<style lang='scss' scoped>
.user-select-content {
  h4 {
    font-size: 16px;
    font-weight: normal;
    line-height: 30px;
    color: #1890FF;
  }
  .select-item {
    margin-bottom: 10px;
  }
  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .el-checkbox-group label {
    line-height: 24px;
    width: 27%;
    margin: 0;
  }
}

</style>
