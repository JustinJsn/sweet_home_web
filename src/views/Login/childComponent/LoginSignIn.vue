<template>
  <div class="login-main">
    <div class="login-head">
      <el-divider>
        <h1>登录</h1>
      </el-divider>
    </div>
    <div class="login-box">
      <div class="login-body">
        <el-form ref="userForm" :model="userForm" :rules="rules" status-icon>
          <el-form-item prop="emailOrPhone">
            <el-input
              v-model="userForm.emailOrPhone"
              autocomplete="off"
              placeholder="请输入用户邮箱/手机号"
              prefix-icon="el-icon-user"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="userForm.password"
              placeholder="请输入用户密码"
              prefix-icon="el-icon-lock"
              type="password"
            />
          </el-form-item>
          <el-form-item prop="imgCode">
            <div class="code-box">
              <el-input
                class="input-border"
                placeholder="验证码"
                v-model="userForm.imgCode"
              />
              <img
                :src="imgSrc"
                @click="handleChangeCode"
                alt="验证码"
                style="cursor: pointer"
              />
            </div>
          </el-form-item>
          <el-form-item>
            <div class="remember-box">
              <el-checkbox v-model="remember" @change="handleRemember">
                记住我
              </el-checkbox>
              <router-link v-slot="{ navigate }" custom to="/forgot_pwd">
                <a href="/forgot_pwd" @click="navigate">
                  忘记密码?
                </a>
              </router-link>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="btn-box">
              <el-button type="primary" @click="handleLogin('userForm')"
                >登录</el-button
              >
              <el-button @click="handleRegister">注册</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <span>
        登录即代表你同意
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
      </span>
    </div>
  </div>
</template>

<script>
import CryptoJS from "@/utils/tools";
import { cloneDeep } from "lodash";
import { validateEmailPhone, login, VerifyImgCode } from "@/api/user";

export default {
  name: "LoginSignIn",
  created() {
    const userForm = JSON.parse(localStorage.getItem("SH_remember_pwd&name"));
    this.remember = JSON.parse(localStorage.getItem("remember"));
    if (userForm) {
      this.userForm.emailOrPhone = userForm.emailOrPhone;
      this.userForm.password = CryptoJS.decrypt(userForm.password);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.remember) {
      const saveData = cloneDeep(this.userForm);
      saveData.password = CryptoJS.encrypt(this.userForm.password);
      window.localStorage.setItem(
        "SH_remember_pwd&name",
        JSON.stringify(saveData)
      );
    } else {
      window.localStorage.removeItem("SH_remember_pwd&name");
    }
    next();
  },
  watch: {
    $route(to, from) {
      const userForm = JSON.parse(localStorage.getItem("SH_remember_pwd&name"));
      this.remember = JSON.parse(localStorage.getItem("remember"));
      if (userForm) {
        this.userForm.emailOrPhone = userForm.emailOrPhone;
        this.userForm.password = CryptoJS.decrypt(userForm.password);
      }
    }
  },
  data() {
    const validateEmailOrPhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入你注册的邮箱或手机号"));
      } else {
        const emailReg = new RegExp(
          "^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+.)+[A-Za-z]{2,6}$"
        );
        const phoneReg = new RegExp("^1[3-9]\\d{9}$");
        if (
          emailReg.test(this.userForm.emailOrPhone) ||
          phoneReg.test(this.userForm.emailOrPhone)
        ) {
          validateEmailPhone({
            emailOrPhone: this.userForm.emailOrPhone
          })
            .then(res => {
              switch (res.errno) {
                case 0:
                  callback();
                  break;
                case 10200:
                  callback(new Error(res.message));
                  break;
                default:
                  callback();
              }
            })
            .catch(err => err);
        } else {
          callback(new Error("请输入正确的邮箱或手机号"));
        }
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空呀"));
      } else {
        if (value.length < 6) {
          callback(new Error("密码不能小于6个字符"));
        } else {
          callback();
        }
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
      userForm: {
        password: "",
        emailOrPhone: "",
        imgCode: ""
      },
      rules: {
        emailOrPhone: [{ validator: validateEmailOrPhone, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        imgCode: [{ validator: validateImgCode, trigger: "blur" }]
      },
      remember: false,
      imgSrc: `http://api.justinjsn.cn/api/v1/code/imgCode?time=${Date.now()}`
    };
  },
  methods: {
    handleRemember() {
      window.localStorage.setItem("remember", this.remember);
      if (this.remember) {
        const saveData = cloneDeep(this.userForm);
        saveData.password = CryptoJS.encrypt(this.userForm.password);
        window.localStorage.setItem(
          "SH_remember_pwd&name",
          JSON.stringify(saveData)
        );
      } else {
        window.localStorage.removeItem("SH_remember_pwd&name");
      }
    },
    handleRegister() {
      this.$router.push("/signUp").catch(() => {});
    },
    handleLogin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          login({
            emailOrPhone: this.userForm.emailOrPhone,
            password: this.userForm.password
          })
            .then(res => {
              let preRoute = "";
              switch (res.errno) {
                case 0:
                  localStorage.setItem("SH_userInfo", JSON.stringify(res.data));
                  localStorage.setItem(
                    "SH_token",
                    JSON.stringify(res.data.token)
                  );

                  this.$cookies.set('socketId', res.data._id);

                  this.$store.dispatch("setUser", res.data);

                  preRoute = localStorage.getItem("preRoute");
                  if (preRoute !== "") {
                    this.$router.push(preRoute).catch(() => {});
                  } else {
                    this.$router.push("/").catch(() => {});
                  }
                  break;
                case 10200:
                  this.$message({
                    message: "密码错误,请重新输入",
                    type: "error"
                  });
                  break;
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
.login-main {
  width: 1065px;
  margin: 80px auto;
}

.login-box {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  overflow: hidden;

  .login-body {
    width: 50%;
    padding-top: 30px;
  }
}

.el-form-item {
  margin-bottom: 32px;
}

.remember-box {
  display: flex;
  justify-content: space-between;
  align-items: center;

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

.btn-box {
  display: flex;
  justify-content: space-around;

  button {
    width: 33.3%;
  }
}

.footer {
  margin-top: 50px;
  display: flex;
  justify-content: center;

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
