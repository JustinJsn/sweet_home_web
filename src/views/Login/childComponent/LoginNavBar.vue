<template>
  <nav-bar>
    <template slot="left">
      <i class="logo" />
      <span class="brand">温馨租房</span>
    </template>
    <template slot="right">
      <ul class="right-item">
        <li>
          <a href="/home">首页</a>
        </li>
        <li>
          <a href="/home">发布房源</a>
        </li>
      </ul>
      <div id="profile">
        <router-link to="/login" class="register" custom v-slot="{ navigate }">
          <button role="link" @click="navigate">
            登录
          </button>
        </router-link>
      </div>
    </template>
  </nav-bar>
</template>

<script>
import NavBar from "@/components/common/NavBar";

export default {
  name: "HouseNavBar",
  components: {
    NavBar
  }
};
</script>

<style lang="scss" scoped>
// logo 图标
.logo {
  display: inline-block;
  width: 78px;
  height: 78px;
  background: url("../../../assets/images/logo.png") no-repeat;
  background-size: cover;
}

// 搜索框
.search-input {
  width: 380px;
  margin-right: 20px;
}

// 右侧用户头像
#profile {
  margin-left: 20px;
  img {
    width: 45px;
    height: 45px;
    margin-top: 4px;
    cursor: pointer;
    border-radius: 50%;
  }
}

// 右侧导航文字
.right-item {
  display: flex;
  list-style: none;

  li {
    width: 120px;
    height: 78px;
    cursor: pointer;
    line-height: 78px;
    text-align: center;
    a {
      text-decoration: none;
      color: #000;
    }
  }
}
.register {
  outline: none;
  background-color: #31c6a6;
  border: none;
  color: white;
  padding: 8px 26px;
  border-radius: 40px;
  cursor: pointer;
  transition: 0.2s;

  &:active {
    transform: scale(0.95);
  }
}
</style>
