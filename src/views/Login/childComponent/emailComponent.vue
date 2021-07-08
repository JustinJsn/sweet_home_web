<template>
  <div id="emailComponent">
    <el-form
      class="email-form"
      status-icon
      ref="email-form"
      :rules="rules"
      :model="ruleForm"
    >
      <el-form-item class="item" prop="email">
        <el-input
          v-model="ruleForm.email"
          placeholder="请输入绑定的邮箱"
          auto-complete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="next" :disabled="disabled"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { check_email } from "@/api/user";
export default {
  name: "emailComponent",
  methods: {
    next() {
      this.$emit("next");
    }
  },
  created() {
    const email = window.sessionStorage.getItem("email");
    if (email) {
      this.ruleForm.email = email;
    }
  },
  data() {
    let vlidateEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      const reg = new RegExp(
        "^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+.)+[A-Za-z]{2,6}$"
      );
      if (reg.test(value)) {
        check_email({ email: value })
          .then(res => {
            if (res.errno === 0) {
              callback(new Error("该邮箱尚未注册"));
            } else if (res.errno === 10200) {
              this.disabled = false;
              window.sessionStorage.setItem("email", value);
              callback();
            }
          })
          .catch(err => {
            callback(new Error(err));
          });
      } else {
        callback(new Error("请输入正确的邮箱地址"));
      }
    };
    return {
      rules: {
        email: [
          {
            validator: vlidateEmail,
            trigger: "blur"
          }
        ]
      },
      ruleForm: {
        email: ""
      },
      disabled: true
    };
  }
};
</script>
<style lang="scss" scope>
.email-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  .item {
    width: 80%;
  }
}
</style>
