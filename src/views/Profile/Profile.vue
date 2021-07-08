<template>
  <div id="profile">
    <house-detail-nav-bar />

    <div id="profile-main">
      <div class="profile-left">
        <div class="profile-info-container">
          <img :src="currentUser.user_avatar" alt="用户头像" />
          <p class="profile-nickName">{{ currentUser.nickName }}</p>
        </div>

        <div class="list-container">
          <ul>
            <router-link
              custom
              :to="item.link"
              :key="item.text"
              v-for="item of linkList"
              v-slot="{ navigate, isActive, isExactActive }"
            >
              <li
                @click="navigate"
                :class="[
                  isActive && 'router-link-active',
                  isExactActive && 'router-link-exact-active'
                ]"
              >
                <i :class="item.icon" />
                <span>{{ item.text }}</span>
              </li>
            </router-link>
          </ul>
        </div>
      </div>

      <router-view class="profile-center" />
    </div>
  </div>
</template>
<script>
import HouseDetailNavBar from "../HouseDetail/childComponent/HouseDetailNavBar.vue";
import { mapGetters } from "vuex";

export default {
  components: { HouseDetailNavBar },
  name: "Profile",
  data() {
    return {
      profile: {},
      linkList: [
        { text: "首页", icon: "el-icon-house", link: "/account/home" },
        { text: "我的信息", icon: "el-icon-user", link: "/account/setting" },
        {
          text: "租房记录",
          icon: "el-icon-chat-dot-square",
          link: "/account/record"
        },
        { text: "实名认证", icon: "el-icon-key", link: "/account/verified" },
        {
          text: "我的委托",
          icon: "el-icon-s-promotion",
          link: "/account/rental"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["currentUser"])
  }
};
</script>
<style lang="scss" scoped>
#profile-main {
  display: flex;
  width: 1065px;
  margin: 40px auto 0;
  padding-bottom: 40px;

  .profile-left {
    position: sticky;
    top: 20px;
    width: 20%;
    height: 470px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 4px;
    padding: 20px 0;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  }

  .profile-center {
    width: 80%;
    height: 550px;
    overflow: auto;
    padding: 20px 10px;
    margin-left: 20px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  }
  //.right {
  //  width: 80%;
  //  height: 550px;
  //  overflow: auto;
  //  padding: 20px 10px;
  //  margin-left: 20px;
  //  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  //}
}

.profile-info-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 75px;
    height: 75px;
    border-radius: 50%;
  }

  .profile-nickName {
    text-align: center;
    padding-top: 10px;
    color: #ff5777;
    width: 95px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
  }
}

.list-container {
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
    }
  }
}
</style>
