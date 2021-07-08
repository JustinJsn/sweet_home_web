<template>
  <div id="rental">
    <div class="setting-header">
      <span class="point" />
      <span class="title">我的委托</span>

      <el-divider />
    </div>

    <div class="follow-main">
      <ul>
        <li v-for="item of ownerList" :key="item._id" class="follow-item">
          <div class="item-left">
            <router-link
              custom
              v-slot="{ navigate }"
              :to="'/house_detail/' + item.detail_id"
            >
              <img @click="navigate" :src="item.img_src" alt="房源展示图" />
            </router-link>
          </div>
          <div class="item-center">
            <router-link
              custom
              v-slot="{ navigate }"
              :to="'/house_detail/' + item.detail_id"
            >
              <h3 class="house-title" @click="navigate">
                <a href="javascript:">{{ item.title }}</a>
              </h3>
            </router-link>
            <p class="house-info">
              <span>
                {{ item.description.join("/") }}
              </span>
            </p>
            <p class="house-tag">
              <el-tag v-show="item.tag_decoration">{{
                item.tag_decoration
              }}</el-tag>
            </p>
          </div>
          <div class="item-right">
            <span>{{ item.price }}</span>
            元/月
          </div>
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
import { getRental, getOwnerHouse } from "@/api/entrusted_rental";

export default {
  name: "ProfileRental",
  data() {
    return {
      rentalList: [],
      pagination: {
        page: 1,
        limit: 4,
        total: 0
      },
      token: "",
      userInfo: {},
      ownerList: []
    };
  },
  created() {
    this.token = JSON.parse(localStorage.getItem("SH_token"));
    this.userInfo = JSON.parse(localStorage.getItem("SH_userInfo"));

    this.getRentalList();
    this.getOwnerList();
  },
  watch: {
    $route() {
      this.token = JSON.parse(localStorage.getItem("SH_token"));
      this.userInfo = JSON.parse(localStorage.getItem("SH_userInfo"));

      this.getOwnerList();
    }
  },
  methods: {
    getRentalList() {
      getRental(
        {
          page: this.pagination.page,
          limit: this.pagination.limit,
          user_id: this.userInfo._id
        },
        this.token
      )
        .then(res => {
          switch (res.errno) {
            case 0:
              this.pagination.total = res.data.total;
              this.rentalList = res.data.list;
              break;
            case 10200:
            case 10400:
            case 10409:
            case 10500:
              this.$message({
                message: res.message,
                type: "warning"
              });
              break;
            default:
              break;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    getOwnerList() {
      getOwnerHouse(
        {
          user_id: this.userInfo._id
        },
        this.token
      )
        .then(res => {
          switch (res.errno) {
            case 0:
              this.ownerList = res.data;
              break;
            default:
              this.$message({
                message: "出错了",
                type: "warning"
              });
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
.setting-header {
  padding-left: 10px;

  .point {
    float: left;
    width: 4px;
    height: 16px;
    border-radius: 4px;
    background-color: #00a1d6;
  }

  .title {
    padding-left: 8px;
    color: #00a1d6;
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
      border-bottom: 1px solid #c2c2c2  ;
    }
  }
  .item-left {
    img {
      width: 173px;
      height: 130px;
      cursor: pointer;
      border-radius: 4px;
    }
  }

  .house-info {
    font-size: 14px;
    color: #c2c2c2;
    line-height: 1.8;
    margin-bottom: 6px;
  }

  .item-center {
    margin-left: 24px;
    height: 130px;
    width: 60%;
    vertical-align: middle;
    .house-title {
      height: 30%;
      a {
        width: 280px;
        height: 22px;
        overflow: hidden;
        display: inline-block;
        text-overflow: ellipsis;
        color: #009de8;
        text-decoration: none;
        white-space: nowrap;
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
