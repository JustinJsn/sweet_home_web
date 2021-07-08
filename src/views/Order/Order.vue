<template>
  <div id="order">
    <house-detail-nav-bar />

    <div class="main">
      <el-breadcrumb style="margin: 30px 20px" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单中心</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="body">
        <div class="left">
          <div class="banner">
            <ul>
              <router-link
                v-for="item of linkList"
                :key="item.text"
                :to="item.link"
                custom
                v-slot="{ navigate, isActive, isExactActive }"
              >
                <li
                  @click="navigate"
                  @mousedown="handlerRead"
                  :class="[
                  isActive && 'router-link-active',
                  isExactActive && 'router-link-exact-active'
                ]"
                  :data-handler="item.handler"
                >
                  <span :data-handler="item.handler">{{ item.text }}</span>
                  <el-badge :value="item.value" :data-handler="item.handler" />
                </li>
              </router-link>
            </ul>
          </div>
        </div>

        <router-view class="right" />
      </div>
    </div>
  </div>
</template>

<script>
import HouseDetailNavBar from "@/views/HouseDetail/childComponent/HouseDetailNavBar";

export default {
  name: "Order",
  components: {
    HouseDetailNavBar
  },
  data: () => ({
    linkList: [
      { link: "/order/pay", text: "未支付订单", value: null, handler: "payment" },
      {
        link: "/order/history",
        text: "历史订单",
        value: null,
        handler: "history"
      }
    ]
  }),
  methods: {
    handlerRead(e) {
      // console.log(e.target.dataset);
    }
  }
};
</script>

<style scoped lang="scss">
.main {
  width: 1065px;
  margin: 40px auto 0;
  padding-bottom: 80px;
}

.header {
  text-align: center;
}

.body {
  display: flex;

  .left {
    width: 20%;
    height: 470px;
    border-radius: 4px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  }

  .right {
    width: 80%;
    height: 550px;
    overflow: auto;
    padding: 20px 10px;
    margin-left: 20px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  }
}

.banner {
  margin-top: 20px;
  width: 100%;
  ul {
    list-style: none;
    .router-link-exact-active,
    .router-link-active {
      border-left: 4px solid rgb(152, 198, 252);
      background-color: rgba(152, 198, 252, 0.1);
    }
    li {
      height: 48px;
      display: flex;
      margin: 10px 0;
      cursor: pointer;
      text-align: left;
      user-select: none;
      align-items: center;
      transition: all 0.4s;
      border-left: 4px solid transparent;
      i {
        margin-right: 10px;
        margin-left: 60px;
      }
      a {
        text-decoration: none;
        color: #000;
      }
      &:hover {
        border-left: 4px solid rgb(152, 198, 252);
        background-color: rgba(152, 198, 252, 0.1);
      }
      span {
        padding-left: 40px;
      }
    }
  }
}
</style>
