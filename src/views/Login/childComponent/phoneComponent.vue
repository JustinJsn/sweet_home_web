<template>
  <div id="phoneComponent">
    <el-form
      ref="phone-form"
      :model="ruleForm"
      :rules="rules"
      class="phone-form"
      status-icon
    >
      <el-form-item class="item" prop="phone">
        <el-input
          v-model="ruleForm.phone"
          auto-complete="off"
          placeholder="请输入绑定的手机号"
        />
      </el-form-item>
      <el-form-item class="item" prop="code">
        <el-input
          v-model="ruleForm.code"
          placeholder="输入收到的验证码"
        >
          <el-button
            slot="append"
            :class="!code_disabled ? 'btn-primary' : 'btn-info'"
            :disabled="code_disabled"
            @click="handleGetCode"
          >{{ code_txt }}
          </el-button
          >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="disabled" type="primary" @click="next('phone-form')"
        >确定
        </el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {checkVerifyCode, getVerifyCode, reset_check_phone} from "@/api/user";

export default {
  name: "phoneComponent",
  methods: {
    next(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("next");
        } else {
          return false;
        }
      })
    },
    handleGetCode() {
      getVerifyCode({
        phone: this.ruleForm.phone
      })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              type: "success",
              title: "发送成功",
              message: "验证码已发送，5分钟内有效"
            });
          }
          switch (res.errno) {
            case 10400:
              this.$message({
                message: "发送失败",
                type: "error"
              });
              break;
          }
        })
        .catch(err => {
          console.log(err);
        });
      let timer = setInterval(() => {
        this.timing--;
        this.code_disabled = true;
        this.code_txt = `${this.timing}s后重试`;
        if (this.timing <= 0) {
          clearInterval(timer);
          this.code_disabled = false;
          this.timing = 120;
          this.code_txt = "重新获取";
        }
      }, 1000);
    },
  },
  created() {
    const phone = window.sessionStorage.getItem("phone");
    if (phone) {
      this.ruleForm.phone = phone;
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        this.code_disabled = true;
        callback(new Error("手机号不能为空"));
      }
      const reg = new RegExp("^1[3-9]\\d{9}$");
      if (reg.test(value)) {
        const email = window.sessionStorage.getItem("email");
        reset_check_phone({phone: value, email})
          .then(res => {
            if (res.errno === 0) {
              this.code_disabled = true;
              callback(new Error("该手机号尚未注册/与绑定的邮箱不匹配"));
            } else if (res.errno === 10200) {
              this.code_disabled = false;
              window.sessionStorage.setItem("phone", value);
              callback();
            }
          })
          .catch(err => {
            callback(new Error(err));
          });
      } else {
        callback(new Error("请输入正确的手机号码"));
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入接收到的验证码"));
      } else {
        checkVerifyCode({
          code: value,
          phone: this.ruleForm.phone
        })
          .then(res => {
            switch (res.errno) {
              case 0:
                this.disabled = false;
                callback();
                break;
              case 10400:
                this.disabled = true;
                callback(new Error(res.message));
                break;
              case 10409:
                this.disabled = true;
                callback(new Error(res.message));
                break;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    };
    return {
      rules: {
        phone: [{validator: validatePhone, trigger: "blur"}],
        code: [{validator: validateCode, trigger: "blur"}]
      },
      ruleForm: {
        phone: "",
        code: "",
      },
      disabled: true,
      code_txt: "点击获取",
      code_disabled: false,
      timing: 120
    };
  }
};
</script>
<style lang="scss" scoped>
.phone-form {
  display: flex;
  flex-direction: column;
  align-items: center;

  .item {
    width: 80%;
  }
}
.btn-primary {
  background-color: #00a1d6 !important;
  border: 1px solid #00a1d6 !important;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  color: #fff !important;
}
.btn-info {
  color: #00a1d6 !important;
}
</style>
