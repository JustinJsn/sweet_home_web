<template>
  <div id="house-detail">
    <house-detail-nav-bar />
    <div id="main">
      <div class="house-info">
        <div class="house-head">
          <div class="head-left">
            <h2>{{ detailInfo.title }}</h2>
            <el-tag type="warning" v-show="detailInfo.tags">
              {{detailInfo.tags}}
            </el-tag>
          </div>
          <div class="head-right">
            <div class="inactive" @click="handleFollow" v-if="!isFollow">
              <i class="iconfont icon-heart1"></i>
              <span class="text">关注房源</span>
            </div>
            <div class="active" @click="handleCancelFollow" v-else>
              <i class="iconfont icon-heart"></i>
              <span class="text">已关注</span>
            </div>
          </div>
        </div>
        <p class="number">
          房子编号：<span>{{ detailInfo._id }}</span>
        </p>
        <el-divider />
        <div class="house-main">
          <house-detail-carousel :slide="slide" />
          <div class="aside-info">
            <div class="aside-head">
              <div v-show="detailInfo.price" class="price container">
                <p>
                  <span>{{ detailInfo.price }}</span> 元/月
                </p>
                <p>月付租金</p>
              </div>
              <div v-show="type" class="type container">
                <p>
                  <span>{{ type }}</span>
                </p>
                <p>户型</p>
              </div>
              <div v-show="area" class="area container">
                <p>
                  <span>{{ area }}</span>
                </p>
                <p>建筑面积</p>
              </div>
            </div>
            <el-divider />
            <div class="aside-main">
              <ul>
                <li v-for="(key, val) of aside_info" :key="key">
                  <span style="color: #c2c2c2">{{ val }}: </span>{{ key }}
                </li>
              </ul>

              <el-divider />

              <div class="owner" v-if="detailInfo.owner">
                <div class="avatar">
                  <img :src="detailInfo.owner.user_avatar" alt="用户头像" />
                </div>

                <div class="info">
                  <p>
                    业主：
                    <span class="owner_name">{{ detailInfo.real.name }}</span>
                  </p>
                  <p>
                    联系电话：
                    <span class="owner_phone">{{
                      detailInfo.owner.phone
                    }}</span>
                  </p>
                </div>

                <div class="btn-buy">
                  <el-button
                    type="primary"
                    size="medium"
                    @click="handleAddOrder"
                  >
                    我要租
                  </el-button>
                </div>
              </div>

              <div class="owner" v-else>
                <div class="avatar">
                  平台特供
                </div>

                <div class="btn-buy">
                  <el-button
                    type="primary"
                    size="medium"
                    @click="handlePlatform"
                  >
                    我要租
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-banner">
        <ul>
          <li
            v-for="(key, val) in bannerList"
            :key="key"
            @click="handleClickBanner(key)"
          >
            <a
              :class="bannerActive === key ? 'item-active' : ''"
              :href="'#' + val"
              >{{ key }}</a
            >
          </li>
        </ul>
      </div>

      <div class="info-container">
        <div class="house-info-wrapper">
          <h2 id="info">房屋信息</h2>
          <div class="house-info-main">
            <div class="house-info-title">基本信息</div>
            <div class="house-info-body">
              <ul>
                <li v-for="item of detailInfo.base_info" :key="item">
                  {{ item }}
                </li>
                <el-divider />
              </ul>
            </div>
          </div>

          <div class="house-info-main">
            <div class="house-info-title">配备设施</div>
            <div class="house-equip-body">
              <ul>
                <li v-for="(val, key) of detailInfo.equipe_facility" :key="key">
                  <figure>
                    <img :src="val.icon" alt="设备" />
                    <figcaption :class="val.facility ? '' : 'lineThrough'">
                      {{ key }}
                    </figcaption>
                  </figure>
                </li>
              </ul>
            </div>
          </div>
          <el-divider />
        </div>
        <div class="house-desc-wrapper">
          <h2 id="desc">房源描述</h2>
          <blockquote v-show="detailInfo.description" style="padding: 8px 20px">
            <span v-html="detailInfo.description"></span>
          </blockquote>
          <div class="desc-img-container" v-show="detailInfo.detail_pic">
            <el-image
              v-for="item of detailInfo.detail_pic"
              :key="item"
              :src="item"
              style="width: 283px;height: 212px;margin: 10px"
              :preview-src-list="detailInfo.detail_pic"
            >
            </el-image>
          </div>
        </div>
        <div class="house-price-wrapper">
          <h2 id="detail">费用详情</h2>
          <table>
            <tr>
              <td>付款方式</td>
              <td>租金<span>(元/月)</span></td>
              <td>押金<span>(元)</span></td>
              <td>服务费<span>(元)</span></td>
              <td>中介费<span>(元)</span></td>
            </tr>
            <tr>
              <td>月付</td>
              <td>{{ detailInfo.price }}</td>
              <td>{{ detailInfo.deposit }}</td>
              <td>0</td>
              <td>0</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HouseDetailCarousel from "@/views/HouseDetail/childComponent/HouseDetailCarousel";
import HouseDetailNavBar from "./childComponent/HouseDetailNavBar";

import {
  getDetailInfo,
  getOwnFollow,
  createFollow,
  del_follow
} from "@/api/house_detail";

import { addOrder, pay } from "@/api/order";

export default {
  name: "HouseDetail",
  components: {
    HouseDetailNavBar,
    HouseDetailCarousel
  },
  data() {
    return {
      detail_id: "",
      detailInfo: {},
      slide: {
        top: [],
        thumbs: []
      },
      // 面积
      area: "",
      // 类型
      type: "",
      // 房源信息
      aside_info: {},
      bannerList: { info: "房屋信息", desc: "房源描述", detail: "费用详情" },
      bannerActive: "房屋信息",
      isFollow: false,
      follow_id: "",
      userInfo: {},
      token: ""
    };
  },
  created() {
    this.detail_id = this.$route.params.id;

    this.getHouseDetail(this.$route.params.id);

    this.userInfo = JSON.parse(localStorage.getItem("SH_userInfo"));
    this.token = JSON.parse(localStorage.getItem("SH_token"));

    if (this.userInfo && this.token) {
      this.getFollowInfo();
    }
  },
  watch: {
    $route(to, form) {
      if (/^\/house_detail.*/.test(to.path)) {
        this.detail_id = this.$route.params.id;

        this.getHouseDetail(this.$route.params.id);

        this.userInfo = JSON.parse(localStorage.getItem("SH_userInfo"));
        this.token = JSON.parse(localStorage.getItem("SH_token"));

        if (this.userInfo && this.token) {
          this.getFollowInfo();
        }
      }
    }
  },
  methods: {
    getHouseDetail(_id) {
      getDetailInfo({ _id })
        .then(res => {
          this.detailInfo = res.data;

          res.data.slide.slide_big.forEach(item => {
            if (item) {
              this.slide.top.push(item);
            }
          });

          res.data.slide.slide_small.forEach((item, index) => {
            if (item && res.data.slide.slide_big[index]) {
              this.slide.thumbs.push(item);
            }
          });

          res.data.base_info.forEach(item => {
            if (/面积/i.test(item)) {
              this.area = item.split("：")[1];
            }
          });

          res.data.aside_info.forEach(item => {
            let info = item.split("：");
            this.aside_info[info[0]] = info[1];
            if (/类型/i.test(item)) {
              this.type = item.split("：")[1].split(" ")[0];
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    getFollowInfo() {
      getOwnFollow(
        {
          user_id: this.userInfo._id,
          detail_id: this.detail_id
        },
        this.token
      )
        .then(res => {
          if (res.errno === 0) {
            this.isFollow = res.data.isExists;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    handleClickBanner(val) {
      this.bannerActive = val;
    },

    handleFollow() {
      if (this.userInfo && this.token) {
        createFollow(
          {
            user_id: this.userInfo._id,
            detail_id: this.detail_id
          },
          this.token
        )
          .then(res => {
            if (res.errno === 0) {
              this.isFollow = true;
              this.follow_id = res.data._id;
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$message({
          message: "请先前往登录再进行此操作",
          type: "warning"
        });
      }
    },

    handleCancelFollow() {
      const userInfo = JSON.parse(localStorage.getItem("SH_userInfo"));
      const token = JSON.parse(localStorage.getItem("SH_token"));
      del_follow(
        {
          user_id: userInfo._id,
          detail_id: this.detail_id
        },
        token
      )
        .then(res => {
          if (res.errno === 0) {
            this.isFollow = false;
            this.follow_id = "";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    handleAddOrder() {
      if (this.userInfo) {
        addOrder(
          {
            house: this.detail_id,
            user: this.userInfo._id,
            owner: this.detailInfo.owner._id,
            price:
              Number(this.detailInfo.price) + Number(this.detailInfo.deposit)
          },
          this.token
        )
          .then(res => {
            switch (res.errno) {
              case 0:
                this.$notify({
                  title: "订单创建成功",
                  message: "订单已创建，请前往订单中心完成支付",
                  type: "success",
                  duration: 1000
                });
                break;
              default:
                break;
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$alert(`请先前往登录`, "用户未登录")
          .then(() => {
            window.location.href = "/login";
          })
          .catch(() => {
            window.location.href = "/login";
          });
      }
    },

    handlePlatform() {
      if (this.userInfo) {
        addOrder(
          {
            house: this.detail_id,
            user: this.userInfo._id,
            price:
              Number(this.detailInfo.price) + Number(this.detailInfo.deposit)
          },
          this.token
        )
          .then(res => {
            switch (res.errno) {
              case 0:
                this.$notify({
                  title: "订单创建成功",
                  message: "订单已创建，请前往订单中心完成支付",
                  type: "success",
                  duration: 1000
                });
                break;
                case 10400:
                  this.$message({
                    message: res.message,
                    type: 'error',
                    duration: 1000
                  })
                  break
              default:
                break;
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$alert(`请先前往登录`, "用户未登录")
          .then(() => {
            window.location.href = "/login";
          })
          .catch(() => {
            window.location.href = "/login";
          });
      }
    }
  }
};
</script>

<style scoped lang="scss">
#main {
  width: 1064px;
  margin: 40px auto;
}
.house-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .head-left {
    display: flex;
  }
  .head-right {
    margin-right: 80px;
    .inactive,
    .active {
      display: flex;
      cursor: pointer;
    }
    .inactive > i {
      margin-right: 6px;
      font-weight: 700;
    }
    .active > i {
      margin-right: 6px;
      color: #fb7e7e;
    }
  }
  h2 {
    margin-right: 20px;
  }
}
.number {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}
.house-main {
  display: flex;
  height: 390px;
}
.aside-info {
  min-width: 478px;
  height: 100%;
  padding: 10px 0 10px 40px;
  //border: 1px solid #c2c2c2;
  margin-left: 20px;
}
.aside-head {
  display: flex;
  justify-content: space-between;
}
.container {
  width: 145px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  p {
    line-height: 1.5;
    &:first-child {
      color: red;
      span {
        font-size: 24px;
        font-weight: bold;
      }
    }
    &:last-child {
      margin-top: 6px;
      font-size: 14px;
      font-weight: bold;
      color: #c2c2c2;
    }
  }
}

.aside-main {
  ul {
    list-style: none;
    li {
      line-height: 1.8;
    }
  }
}

.detail-banner {
  margin-top: 20px;
  position: sticky;
  z-index: 9;
  top: 0;
  ul {
    padding-bottom: 10px;
    list-style: none;
    display: flex;
    border-radius: 4px;
    background-color: #f5f5f5;
    li {
      padding: 20px;
      a {
        padding-bottom: 8px;
        text-decoration: none;
        color: #000;
      }
    }
    .item-active {
      border-bottom: 2px solid blue;
    }
  }
}

.info-container {
  margin-top: 20px;
  padding-bottom: 20px;
}

.house-info-wrapper {
  padding-bottom: 20px;
}

.house-info-main {
  display: flex;
  margin-top: 20px;
  .house-info-title {
    width: 200px;
    font-size: 20px;
    color: #c2c2c2;
  }
  .house-info-body {
    width: 844px;
    ul {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      line-height: 1.8;
      li {
        width: 405px;
      }
    }
  }
}

.house-equip-body {
  width: 844px;
  margin-left: -65px;
  ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    li {
      width: 150px;
      margin-bottom: 20px;
    }
    figure {
      text-align: center;
      img {
        width: 32px;
        height: 32px;
        margin-bottom: 14px;
      }
    }
  }
}

.lineThrough {
  text-decoration: line-through;
  color: #c2c2c2;
}

.house-desc-wrapper {
  .desc-img-container {
    margin-top: 20px;
  }
  blockquote {
    margin-top: 10px;
    span {
      line-height: 1.5;
    }
  }
}

.house-price-wrapper {
  margin-top: 20px;
  table {
    margin-top: 20px;
    width: 100%;
    tr td {
      line-height: 1.8;
      span {
        color: #c2c2c2;
      }
    }
    tr:nth-child(2) td {
      &:nth-child(1) {
        color: #c2c2c2;
      }
      &:nth-child(2) {
        color: red;
      }
    }
  }
}

.owner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;

  .avatar img {
    width: 74px;
    height: 74px;
    border-radius: 50%;
  }
  .info {
    line-height: 1.8;
    .owner_name {
      font-size: 24px;
      font-weight: 600;
    }
    .owner_phone {
      font-size: 18px;
      font-weight: 600;
    }
  }
}
</style>
