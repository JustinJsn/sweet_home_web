<template>
  <div id="forgot-wrapper">
    <login-nav-bar />
    <div id="main">
      <el-breadcrumb
        style="margin-bottom: 40px"
        separator-class="el-icon-arrow-right"
      >
        <el-breadcrumb-item :to="{ path: '/login' }">登录</el-breadcrumb-item>
        <el-breadcrumb-item>忘记密码</el-breadcrumb-item>
      </el-breadcrumb>
      <div id="form">
        <el-steps
          :active="active"
          finish-status="success"
          process-status="finish"
        >
          <el-step title="邮箱验证" />
          <el-step title="手机号验证" />
          <el-step title="重置密码" />
        </el-steps>
        <transition name="fadeX" mode="out-in">
          <component style="margin-top: 40px;" @next="next" :is="view" />
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import LoginNavBar from "./childComponent/LoginNavBar";
import emailComponent from "./childComponent/emailComponent";
import phoneComponent from "./childComponent/phoneComponent";
import newPasswordComponent from "./childComponent/newPasswordComponent";
export default {
  name: "ForgotPwd",
  components: {
    LoginNavBar,
    emailComponent,
    phoneComponent,
    newPasswordComponent
  },
  computed: {
    view() {
      switch (this.active) {
        case 0:
          return "emailComponent";
        case 1:
          return "phoneComponent";
        case 2:
          return "newPasswordComponent";
        default:
          return "emailComponent";
      }
    }
  },
  data() {
    return {
      active: 0
    };
  },
  methods: {
    next() {
      if (this.active < 2) {
        this.active++;
      } else {
        return;
      }
    },
    pre() {
      if (this.active > 0) {
        this.active--;
      } else {
        return;
      }
    }
  }
};
</script>
<style lang="scss" scope>
#main {
  width: 1065px;
  margin: 40px auto;
}
#form {
  width: 580px;
  margin: 0 auto;
}
.fadeX-enter-active,
.fadeX-leave-active {
  transition: all 0.5s;
}
.fadeX-enter,
.fadeX-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
