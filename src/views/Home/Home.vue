<template>
  <div id="home">
    <el-header class="home-header">
      <div class="banner">
        <div class="logo-box">
          <i class="logo" />
          <div class="location">
            <i class="img" />
            <span>广州</span>
          </div>
        </div>
        <div class="banner-item">
          <div class="banner-left">
            <ul>
              <router-link
                custom
                to="/home"
                v-slot="{ navigate, isActive, isExactActive }"
              >
                <li
                  @click="navigate"
                  :class="[
                    isActive && 'router-link-active',
                    isExactActive && 'router-link-exact-active'
                  ]"
                >
                  <a href="/home">首页</a>
                </li>
              </router-link>
              <router-link
                custom
                to="/house"
                v-slot="{ navigate, isActive, isExactActive }"
              >
                <li
                  @click="navigate"
                  :class="[
                    !isActive && 'deactivate',
                    isActive && 'router-link-active',
                    isExactActive && 'router-link-exact-active'
                  ]"
                >
                  <a href="/house">立即找房</a>
                </li>
              </router-link>
              <router-link
                custom
                to="/send"
                v-slot="{ navigate, isActive, isExactActive }"
              >
                <li
                  @click="navigate"
                  :class="[
                    !isActive && 'deactivate',
                    isActive && 'router-link-active',
                    isExactActive && 'router-link-exact-active'
                  ]"
                >
                  <a href="/send">发布房源</a>
                </li>
              </router-link>
            </ul>
          </div>
          <div class="banner-right">
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
        </div>
      </div>
      <div class="search-box">
        <el-autocomplete
          v-model="search_txt"
          :fetch-suggestions="getSuggest"
          placeholder="请输入您想住的区域或小区"
          :trigger-on-focus="false"
          class="search-input"
        />
        <el-button
          type="warning"
          icon="el-icon-search"
          @click="handleBtnClick"
        />
      </div>
    </el-header>
    <el-main class="home-main">
      <home-main
        title="自在整租"
        subTitle="偌大的城市 自享一片天地"
        moreUrl="/house/?sug=整租"
        :list="entire"
      />
      <home-main
        title="优选合租"
        subTitle="实时更新 海量真实房源"
        moreUrl="/house/?sug=合租"
        :list="share"
      />
      <home-main
        title="精选房源"
        subTitle="纵览小区，恋上这座城"
        moreUrl="/house/?sug=公寓"
        :list="featured"
      />
    </el-main>
  </div>
</template>

<script>
import { search, condition } from "@/api/house";
import HomeMain from "./childComponents/HomeMain.vue";
import Profile from "@/components/content/Profile";
import { mapGetters } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      search_txt: "",
      entire: [],
      share: [],
      featured: []
    };
  },
  components: {
    HomeMain,
    Profile
  },
  computed: {
    ...mapGetters(["isLogin", "currentUser"])
  },
  created() {
    this.getEntire();
    this.getShare();
    this.getFeatured();
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
    // 获取整租数据
    getEntire() {
      condition({ limit: 3, keyword: "整租" })
        .then(res => {
          this.entire = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取合租数据
    getShare() {
      condition({ limit: 3, keyword: "合租" })
        .then(res => {
          this.share = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取精选数据
    getFeatured() {
      condition({ limit: 3, keyword: "5室" })
        .then(res => {
          this.featured = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 搜索
    handleBtnClick() {
      if (this.search_txt) {
        this.$router.push("/house/?sug=" + this.search_txt).catch(() => {});
      } else {
        window.location.reload();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.banner {
  min-width: 1065px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.home-header {
  position: relative;
  min-width: 1065px;
  height: 500px !important;
  background: url("http://imgapi.justinjsn.cn/bg_header%401x.jpg");
}

.banner .logo-box {
  display: flex;
  align-items: center;
  color: #fff;

  i {
    display: inline-block;
    width: 204px;
    height: 150px;
    background: url("http://imgapi.justinjsn.cn/sweet_home_logo%20%281%29.png");
    background-size: cover;
  }

  .location {
    display: flex;
    align-items: center;
  }

  .location .img {
    width: 20px;
    height: 20px;
    background: url("http://imgapi.justinjsn.cn/position.png")
      no-repeat;
    background-size: cover;
  }

  .location span {
    margin-left: 4px;
  }
}

.banner-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .banner-left {
    ul {
      list-style: none;
      display: flex;

      .deactivate {
        padding: 10px 20px;
        margin: 0 5px;
        position: relative;

        &:hover {
          &:after {
            min-width: 100%;
          }
        }

        &:after {
          content: "";
          position: absolute;
          min-width: 0;
          left: 0;
          bottom: 0;
          display: inline-block;
          border-bottom: 2px solid #86ee7e;
          transform-origin: center;
          transition: all 0.2s;
        }
      }
      .router-link-active,
      .router-link-exact-active {
        padding: 10px 20px;
        margin: 0 5px;
        position: relative;
        border-bottom: 2px solid #86ee7e;
      }
    }

    a {
      text-decoration: none;
      color: #fff;
    }
  }

  .banner-right {
    margin-left: 40px;
  }
}

.login {
  outline: none;
  background-color: transparent;
  border: none;
  color: white;
  font-size: 18px;
  padding: 6px 16px;
  cursor: pointer;
  transition: 0.2s;

  &:active {
    transform: scale(0.95);
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
.search-box {
  width: 760px;
  position: absolute;
  left: 50%;
  bottom: -40px;
  transform: translateX(-50%);
  display: flex;
  padding: 20px;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  border-radius: 4px;
  .search-input {
    width: 100%;
    margin-right: 4px;
  }
}
.home-main {
  width: 912px;
  margin: 40px auto 0;
}
.entire {
  margin-top: 40px;
}
.entire .header .subtitle {
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  a {
    text-decoration: none;
    color: #666;
  }
}

.entire-body {
  display: flex;
  justify-content: space-between;
  line-height: 1.5;
  figure {
    img {
      border-radius: 4px;
      cursor: pointer;
    }
    h4 {
      width: 98%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .price {
      span {
        color: red;
        font-weight: bold;
        font-size: 22px;
      }
    }
  }
}
</style>
