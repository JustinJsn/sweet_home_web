<template>
  <nav-bar>
    <template slot="left">
      <i class="logo" />
      <span class="brand">温馨租房</span>
    </template>
    <template slot="center">
      <el-autocomplete
        v-model="search_txt"
        :fetch-suggestions="getSuggest"
        :trigger-on-focus="false"
        class="search-input"
        clearable
        @clear="handleClear"
        placeholder="请输入您想住的区域或小区"
      >
        <i
          class="el-icon-search el-input__icon"
          style="cursor: pointer;"
          slot="suffix"
          @click="handleIconClick"
        >
        </i>
      </el-autocomplete>
    </template>
    <template slot="right">
      <ul class="right-item">
        <router-link custom to="/home" v-slot="{ navigate }">
          <li @click="navigate">
            <a href="/home">首页</a>
          </li>
        </router-link>
        <router-link custom to="/send" v-slot="{ navigate }">
          <li @click="navigate">
            <a href="/send">发布房源</a>
          </li>
        </router-link>
      </ul>
      <div id="profile">
        <router-link
          to="/login"
          class="register"
          custom
          v-slot="{ navigate }"
          v-if="!isLogin"
        >
          <button role="link" @click="navigate">
            登录
          </button>
        </router-link>
        <profile v-else />
      </div>
    </template>
  </nav-bar>
</template>

<script>
import NavBar from "@/components/common/NavBar";
import Profile from "@/components/content/Profile";
import { search } from "@/api/house";
import { mapGetters } from "vuex";

export default {
  name: "HouseNavBar",
  components: {
    NavBar,
    Profile
  },
  data() {
    return {
      search_txt: ""
    };
  },
  methods: {
    // 获取建议值
    getSuggest(queryString, cb) {
      if (queryString) {
        search({ keyword: queryString })
          .then(res => {
            const data = res.data.map(item => ({
              value: item.title,
              name: item._id
            }));
            cb(data);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 输入框搜索
    handleIconClick() {
      this.$emit("handleSearchClick", this.search_txt);
    },
    handleClear() {
      this.$emit("handleClear");
    }
  },
  computed: {
    ...mapGetters(["isLogin"])
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
