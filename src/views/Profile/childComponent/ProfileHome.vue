<template>
  <div id="profile-home">
    <div class="profile-home-user">
      <div class="profile-home-avatar">
        <img :src="currentUser.user_avatar" alt="用户头像" class="avatar" />
        <input
          accept="image/jpg, image/png, image/jpeg"
          ref="upload"
          type="file"
          name="avatar"
          id="upload"
        />
        <div class="btn-upload" @click="handleUpload">
          修改头像
        </div>
      </div>
      <div class="profile-home-center">
        <p class="user-nickName">{{ currentUser.nickName }}</p>
        <div class="tag-container">
          <p class="user-landlord">
            <el-tag type="info" size="small" v-if="!currentUser.landlord">
              普通用户
            </el-tag>
            <el-tag type="primary" size="small" v-else>房东认证</el-tag>
          </p>
          <p class="user-real">
            <el-tag type="info" size="small" v-if="!currentUser.is_auth">
              未实名
            </el-tag>
            <el-tag type="primary" size="small" v-else>已实名</el-tag>
          </p>
        </div>
      </div>
      <router-link to="/account/setting" custom v-slot="{ navigate }">
        <el-button type="primary" @click="navigate">修改资料</el-button>
      </router-link>
    </div>
    <el-divider />
    <div id="follow-container">
      <h2>
        共关注了
        <span style="color: blue;font-size: 28px;">{{ pagination.total }} </span
        >套房源
      </h2>
      <div class="follow-main">
        <ul>
          <li
            v-for="(item, index) of followList"
            :key="item._id"
            class="follow-item"
          >
            <div class="item-left">
              <router-link
                custom
                v-slot="{ navigate }"
                :to="'/house_detail/' + item.house_id.detail_id"
              >
                <img
                  @click="navigate"
                  :src="item.house_id.img_src"
                  alt="房源展示图"
                />
              </router-link>
            </div>
            <div class="item-center">
              <router-link
                custom
                v-slot="{ navigate }"
                :to="'/house_detail/' + item.house_id.detail_id"
              >
                <h3 class="house-title" @click="navigate">
                  <a href="javascript:">{{ item.house_id.title }}</a>
                </h3>
              </router-link>
              <p class="house-info">
                <span>{{ item.house_id.village }}</span>
                <span>{{ houseInfo.scale[index] }}</span>
                <span>{{ houseInfo.area[index] }}</span>
              </p>
              <p class="house-tag">
                <el-tag v-show="item.house_id.tag_decoration">{{
                  item.house_id.tag_decoration
                }}</el-tag>
              </p>
            </div>
            <div class="item-right">
              <span>{{ item.house_id.price }}</span>
              元/月
            </div>
            <div class="cancel-btn" @click="handleDelFollow(item._id)">
              取消关注
            </div>
          </li>
        </ul>
      </div>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="4"
      @current-change="handleCurrentChange"
      :current-page.sync="pagination.page"
      v-show="pagination.total > 4"
    />
  </div>
</template>
<script>
import axios from "axios";

import { mapGetters } from "vuex";

import { getToken } from "@/api/upload";
import { update_avatar, get_follow, del_follow } from "@/api/user";

export default {
  name: "ProfileHome",
  data() {
    return {
      domain: "https://upload-z2.qiniup.com",
      qiniuAddress: "imgapi.justinjsn.cn",
      pagination: {
        page: 1,
        total: 0
      },
      token: "",
      followList: [],
      houseInfo: {
        scale: [],
        area: []
      }
    };
  },
  computed: {
    ...mapGetters(["isLogin", "currentUser"])
  },
  created() {
    this.token = JSON.parse(window.localStorage.getItem("SH_token"));
    this.getFollowInfo();
  },
  watch: {
    $route(to, from) {
      this.token = JSON.parse(window.localStorage.getItem("SH_token"));
      this.getFollowInfo();
    }
  },
  methods: {
    // 头像上传更新
    handleUpload() {
      const uploadDOM = this.$refs.upload;
      uploadDOM.click();
      uploadDOM.addEventListener("change", async () => {
        let fileList = uploadDOM.files;
        if (fileList.length === 0) {
          // do nothing
        } else {
          const SH_token = JSON.parse(window.localStorage.getItem("SH_token"));
          const headers = {
            "Content-Type": "multipart/form-data"
          };
          const fileType = fileList[0].name.split(".")[1];
          const fileName = fileList[0].name.split(".")[0];
          // 上传图片的名字
          const uploadName = `web-imgList_${fileName}_${new Date().getTime()}.${fileType}`;
          try {
            // 获取上传凭证
            const tokenRet = await getToken(SH_token);
            // 上传数据
            const formData = new FormData();
            formData.append("file", fileList[0]);
            formData.append("token", tokenRet.data.QiniuToken);
            formData.append("key", uploadName);
            // 上传至七牛云
            const qiniuRes = await axios.post(this.domain, formData, headers);
            const img_src = `http://${this.qiniuAddress}/${qiniuRes.data.key}`;
            const res = await update_avatar(
              {
                _id: this.currentUser._id,
                avatar: img_src
              },
              SH_token
            );
            if (res.errno === 0) {
              window.localStorage.setItem(
                "SH_userInfo",
                JSON.stringify(res.data)
              );
              await this.$store.dispatch("setUser", res.data);
            }
          } catch (ex) {
            console.log(ex);
          }
        }
      });
    },

    getFollowInfo() {
      const userInfo = JSON.parse(localStorage.getItem("SH_userInfo"));
      get_follow(
        {
          user_id: userInfo._id,
          page: this.pagination.page
        },
        this.token
      )
        .then(res => {
          if (res.errno === 0) {
            this.followList = res.data.list;
            this.pagination.total = res.data.total;
            res.data.list.forEach(item => {
              item.house_id.description.forEach(subItem => {
                if (/.*室.*厅.*卫.*/.test(subItem)) {
                  this.houseInfo.scale.push(subItem);
                }
                if (/.*㎡/.test(subItem)) {
                  this.houseInfo.area.push(subItem);
                }
              });
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    handleCurrentChange(newPage) {
      this.pagination.page = newPage;
      this.getFollowInfo();
    },

    handleDelFollow(id) {
      del_follow({ id }, this.token)
        .then(res => {
          if (res.errno === 0) {
            window.location.reload();
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.profile-home-user {
  display: flex;
  align-items: center;
  width: 90%;
  margin: 20px auto 0;
  .avatar {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    cursor: pointer;
  }
  .profile-home-center {
    width: 60%;
    margin-left: 40px;
    .user-nickName {
      width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: bold;
    }
    .user-landlord,
    .user-real {
      margin-top: 12px;
    }
    .user-real {
      margin-left: 20px;
    }
  }
}
.tag-container {
  display: flex;
  align-items: center;
}
.profile-home-avatar {
  position: relative;
  #upload {
    position: absolute;
    visibility: hidden;
    left: 0;
    right: 0;
  }
  .btn-upload {
    position: absolute;
    width: 75px;
    height: 75px;
    line-height: 75px;
    text-align: center;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    user-select: none;
    font-size: 12px;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.5);
    transform: translate(-50%, -50%);
    color: #ff5777;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s;
  }
  &:hover {
    .btn-upload {
      opacity: 1;
    }
  }
}
.follow-main {
  ul {
    margin-bottom: 40px;
    list-style: none;
    li {
      display: flex;
      position: relative;
      align-items: center;
      padding: 30px 20px 10px 20px;
      &:hover {
        .cancel-btn {
          opacity: 1;
          transform: translateY(-10px);
        }
      }
    }
  }
  .cancel-btn {
    position: absolute;
    right: 0;
    top: 0;
    padding: 8px 14px;
    opacity: 0;
    transition: all 0.2s;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .item-left {
    img {
      width: 173px;
      height: 130px;
      cursor: pointer;
      border-radius: 4px;
    }
  }
  .item-center {
    margin-left: 60px;
    height: 130px;
    width: 60%;
    vertical-align: middle;
    .house-title {
      height: 33.3%;
      a {
        color: #009de8;
        text-decoration: none;
        height: 22px;
        overflow: hidden;
        display: inline-block;
        text-overflow: ellipsis;
        width: 280px;
        white-space: nowrap;
      }
    }
    .house-info {
      height: 33.3%;
      span {
        padding-right: 10px;
      }
    }
    .house-tag {
      height: 33.3%;
    }
  }
  .item-right {
    margin-left: 120px;
    width: 33.3%;
    span {
      font-size: 24px;
      font-weight: bold;
      color: red;
    }
  }
}
</style>
