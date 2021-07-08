<template>
  <el-dropdown placement="bottom" class="profile" @command="handleCommand">
    <el-badge :is-dot="isDot" class="item">
      <el-avatar
        style="cursor: pointer;"
        :size="50"
        :src="currentUser.user_avatar"
      />

      <span class="nickName">{{ currentUser.nickName }}</span>
    </el-badge>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="profile" icon="el-icon-user">
        个人中心
      </el-dropdown-item>

      <el-dropdown-item command="order" icon="el-icon-shopping-cart-full">
        订单中心
        <el-badge class="mark" :value="orderNum" />
      </el-dropdown-item>

      <el-dropdown-item command="message" icon="el-icon-message">
        消息
        <el-badge class="mark" :value="msgNum" />
      </el-dropdown-item>

      <el-dropdown-item command="logout" icon="el-icon-switch-button">
        退出
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters } from "vuex";
import { getMsg, uploadView } from "@/api/message";

import _ from "lodash";

export default {
  name: "Profile",

  computed: {
    ...mapGetters(["isLogin", "currentUser"])
  },

  data: () => ({
    token: "",
    userInfo: {},
    msgNum: null,
    orderNum: null,
    isDot: false,
    path: "ws://39.108.71.155:1992/",
  }),

  mounted() {
    this.token = JSON.parse(localStorage.getItem("SH_token"));
    this.userInfo = JSON.parse(localStorage.getItem("SH_userInfo"));

    if (!this.$cookies.get("socketId")) {
      let id = this.userInfo._id;
      this.$cookies.set("socketId", id);
    }
    this.initSocket();
  },

  methods: {
    handleCommand(command) {
      switch (command) {
        case "logout":
          localStorage.removeItem("SH_token");
          localStorage.removeItem("SH_userInfo");

          this.$store.dispatch("setUser", null);

          this.$cookies.remove("socketId");

          window.location.reload();
          break;

        case "profile":
          this.$router.push("/profile").catch(() => {});
          break;

        case "message":
          uploadView(this.token)
            .then(res => res)
            .catch(err => {
              console.log(err);
            });
          if (
            this.$route.path === "/userMessage" ||
            this.$route.path === "/systemMessage"
          ) {
            window.location.reload();
            return;
          }
          this.$router.push("/message").catch(() => {});
          console.log(this.$route.path);
          break;
        case "order":
          this.$router.push("/order").catch(() => {});
          break;
        default:
          break;
      }
    },

    initSocket() {
      if (!window.WebSocket) {
        this.$message({
          message: "浏览器不支持WebSocket!",
          type: "warning"
        });
      } else {
        this.socket = new WebSocket(this.path);

        this.socket.onopen = this.open;

        this.socket.onerror = this.error;

        this.socket.onmessage = this.getMessage;

        this.socket.onclose = this.close;
      }
    },

    open() {
      this.socket.send(
        JSON.stringify({
          type: "setSocketId",
          data: this.userInfo._id
        })
      );
      this.getMessageInfo();
    },

    error() {
      console.log("WebSocket 连接失败");
    },

    getMessage(response) {
      const res = JSON.parse(response.data);

      res.data.total === 0
        ? ([this.msgNum, this.isDot] = [null, false])
        : ([this.msgNum, this.isDot] = [res.data.total, true]);
    },

    close() {
      console.log("WebSocket 断开。。。重连中...");
      this.initSocket();
    },

    getMessageInfo() {
      const token = localStorage.getItem("SH_token");

      getMsg(JSON.parse(token))
        .then(res => {
          if (res.data.total) {
            res.data.total === 0
            ? ([this.msgNum, this.isDot] = [null, false])
            : ([this.msgNum, this.isDot] = [res.data.total, true]);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped lang="scss">
.profile {
  .nickName {
    display: inline-block;
    width: 70px;
    margin-left: 4px;
    text-overflow: ellipsis;
    font-weight: bold;
    overflow: hidden;
    color: #fb83a5;
  }
}

::v-deep .el-badge__content.is-fixed {
  left: -14px;
}
</style>
