<template>
  <el-dialog
    title="密码修改"
    :visible.sync="showDialog"
    :append-to-body="true"
    @closed="handleDialogClosed"
    width="500px"
  >
    <el-form :model="formItems" :rules="formRules" ref="formDom" label-width="100px" size="medium" autocomplete="off">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input v-model.trim="formItems.oldPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input type="password" v-model.trim="formItems.password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="comfirmPassword">
        <el-input type="password" v-model.trim="formItems.comfirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      formItems: {
        oldPassword: "",
        password: "",
        comfirmPassword: ""
      },
      formRules: {
        oldPassword: [
          { required: true, trigger: "blur", message: "原密码不允许为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "新密码不允许为空" }
        ],
        comfirmPassword: [
          {
            required: true,
            validator: this.passwordRepeatCheck,
            trigger: "blur"
          }
        ]
      },
      showDialog: false
    };
  },
  mounted() {
    this.showDialog = true
  },
  methods: {
    handleDialogClosed() {
      this.$emit('update:dialogStatus', false)
    },
    handleConfirm() {
      this.$refs.formDom.validate(async valid => {
        if (valid) {
          this.$store
            .dispatch("user/passwordModify", this.formItems)
            .then(res => {
              if (res.status === 0) {
                this.$store.dispatch("user/logout");
              }
            })
            .catch(err => {})
        }
      });
    },
    passwordRepeatCheck(rule, value, callback) {
      if (!value.length) {
        callback(new Error("请再次输入密码！"));
      } else if (value !== this.formItems.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    }
  }
};
</script>
