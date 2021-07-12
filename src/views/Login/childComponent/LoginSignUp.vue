<template>
  <div id="sign-up">
    <div class="register-head">
      <el-divider>
        <h1>注册</h1>
      </el-divider>
    </div>
    <div class="register-box">
      <div class="register-body">
        <el-form
          ref="registerForm"
          :model="registerForm"
          :rules="rules"
          status-icon
        >
          <el-form-item prop="email">
            <el-input
              placeholder="邮箱"
              v-model="registerForm.email"
              prefix-icon="el-icon-message"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="密码(6-16个字符组成，区分大小写)"
              v-model="registerForm.password"
              prefix-icon="el-icon-lock"
              type="password"
            />
          </el-form-item>
          <el-form-item prop="phone">
            <el-input
              v-model="registerForm.phone"
              placeholder="填写常用手机号"
              prefix-icon="el-icon-mobile-phone"
            />
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model="registerForm.code"
              placeholder="输入收到的验证码"
            >
              <el-button
                slot="append"
                :class="!code_disabled ? 'btn-primary' : 'btn-info'"
                @click="handleGetCode"
                :disabled="code_disabled"
                >{{ code_txt }}</el-button
              >
            </el-input>
          </el-form-item>
          <el-form-item prop="imgCode">
            <div class="code-box">
              <el-input
                class="input-border"
                placeholder="验证码"
                v-model="registerForm.imgCode"
              />
              <img
                :src="imgSrc"
                @click="handleChangeCode"
                alt="验证码"
                style="cursor: pointer"
              />
            </div>
          </el-form-item>
          <el-form-item class="agreement-box">
            <el-checkbox v-model="disabled">
              我已同意
              <router-link v-slot="{ navigate }" custom to="/userAgreement">
                <a href="/userAgreement" target="_blank" @click="navigate">
                  用户协议
                </a>
              </router-link>
              和
              <router-link v-slot="{ navigate }" custom to="/privacyAgreement">
                <a href="/privacyAgreement" target="_blank" @click="navigate">
                  隐私政策
                </a>
              </router-link>
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <div class="btn-register">
              <el-button
                @click="handleRegister('registerForm')"
                :disabled="!disabled"
                type="primary"
                >注册</el-button
              >
              <router-link to="/signIn">
                已有账号，直接登录>
              </router-link>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  register,
  check_email,
  check_phone,
  getVerifyCode,
  checkVerifyCode,
  VerifyImgCode
} from "@/api/user";
export default {
  name: "LoginSignUp",
  data() {
    const validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("输入你要注册的邮箱啊"));
      } else {
        const reg = new RegExp(
          "^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+.)+[A-Za-z]{2,6}$"
        );
        if (reg.test(value)) {
          check_email({
            email: value
          })
            .then(res => {
              switch (res.errno) {
                case 10200:
                  callback(new Error(res.message.text));
                  break;
                case 0:
                  callback();
                  break;
              }
            })
            .catch(err => err);
        } else {
          callback(new Error("邮箱格式不正确"));
        }
      }
    };
    const validatePwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("输入密码呀"));
      } else {
        value.length < 6
          ? callback(new Error("密码不能少于6个字符"))
          : value.length > 16
          ? callback(new Error("密码不能多于16个字符"))
          : callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号码"));
      } else {
        const reg = new RegExp("^1[3-9]\\d{9}$");
        if (reg.test(value)) {
          check_phone({
            phone: value
          })
            .then(res => {
              switch (res.errno) {
                case 0:
                  this.code_disabled = false;
                  callback();
                  break;
                case 10200:
                  this.code_disabled = true;
                  callback(new Error(res.message.text));
                  break;
              }
            })
            .catch(err => err);
        } else {
          callback(new Error("手机号码格式不正确"));
        }
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入接收到的验证码"));
      } else {
        checkVerifyCode({
          code: value,
          phone: this.registerForm.phone
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
          .catch(err => err);
      }
    };
    const validateImgCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("验证码不能为空"));
      } else {
        VerifyImgCode({
          code: value,
          time: this.imgSrc.split("?time=")[1]
        })
          .then(res => {
            switch (res.errno) {
              case 0:
                callback();
                break;
              case 10409:
                callback(new Error("验证码过期，请重新获取"));
                break;
              case 10400:
                callback(new Error("验证码错误，请重新输入"));
                break;
            }
          })
          .then(err => err);

      }
    };
    return {
      registerForm: {
        code: "",
        email: "",
        phone: "",
        imgCode: "",
        password: ""
      },
      rules: {
        email: [{ validator: validateEmail, trigger: "blur" }],
        password: [{ validator: validatePwd, trigger: "blur" }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }],
        imgCode: [{ validator: validateImgCode, trigger: "blur" }]
      },
      select: "",
      disabled: false,
      code_txt: "点击获取",
      code_disabled: false,
      timing: 120,
      imgSrc: `http://api.justinjsn.cn/api/v1/code/imgCode?time=${Date.now()}`
    };
  },
  methods: {
    handleGetCode() {
      getVerifyCode({
        phone: this.registerForm.phone
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
        .catch(err => err);
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
    handleRegister(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          register({
            email: this.registerForm.email,
            phone: this.registerForm.phone,
            password: this.registerForm.password
          })
            .then(res => {
              if (res.errno === 0) {
                this.$message({
                  type: "success",
                  message: "注册成功，请前往登录"
                });
              }
            })
            .catch(err => err);
        } else {
          return false;
        }
      });
    },
    handleChangeCode() {
      this.imgSrc = `http://api.justinjsn.cn/api/v1/code/imgCode?time=${Date.now()}`;
    }
  }
};
</script>

<style lang="scss" scoped>
#sign-up {
  width: 1065px;
  margin: 80px auto;
}

.register-box {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  overflow: hidden;

  .register-body {
    width: 50%;
    padding-top: 30px;
  }
}

.el-form-item {
  margin-bottom: 32px;
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
.btn-register {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  button {
    width: 80%;
  }
  a {
    margin-right: 10%;
    align-self: flex-end;
    justify-self: flex-end;
    text-decoration: none;
    color: #00a1d6;
    &:link,
    &:visited,
    &:hover,
    &:active {
      color: #00a1d6;
    }
  }
}
.agreement-box {
  a {
    text-decoration: none;
    color: #00a1d6;
    &:link,
    &:visited,
    &:hover,
    &:active {
      color: #00a1d6;
    }
  }
}
.code-box {
  display: flex;
  align-items: center;
}
</style>
