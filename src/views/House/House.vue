<!--suppress ALL -->
<template>
  <div id="house">
    <!-- 导航 -->
    <house-nav-bar
      @handleSearchClick="handleSearchClick"
      @handleClear="handleClear"
    />
    <!-- 条件筛选 -->
    <div id="house-body">
      <div id="condition-wrapper">
        <!-- 区域 -->
        <div class="address">
          <ul>
            <li :class="address_active === '' ? 'head' : ''">不限</li>
            <li
              v-for="item of address"
              :key="item"
              :class="address_active === item ? 'address-active' : ''"
              @click="handleClickAddress(item)"
            >
              <a href="javascript:">{{ item }}</a>
            </li>
          </ul>
        </div>
        <!-- 租赁方式 -->
        <div class="way">
          <ul>
            <li>方式</li>
            <li
              v-for="item of way"
              :key="item"
              :class="way_active === item ? 'address-active' : ''"
              @click="handleClickWay(item)"
            >
              <a href="javascript:">{{ item }}</a>
            </li>
          </ul>
        </div>
        <!-- 租金 -->
        <div class="rent">
          <ul>
            <li>租金</li>
            <li v-for="item of rent" :key="item">
              <el-checkbox-group
                v-model="rentList"
                @change="handleCheckboxRent"
              >
                <el-checkbox :label="item"></el-checkbox>
              </el-checkbox-group>
            </li>
          </ul>
        </div>
        <!-- 户型 -->
        <div class="type">
          <ul>
            <li>户型</li>
            <li v-for="item of type" :key="item">
              <el-checkbox-group
                v-model="typeList"
                @change="handleCheckboxType"
              >
                <el-checkbox :label="item"></el-checkbox>
              </el-checkbox-group>
            </li>
          </ul>
        </div>
        <!-- 朝向 -->
        <div class="towards">
          <ul>
            <li>朝向</li>
            <li v-for="item of towards" :key="item">
              <el-checkbox-group
                v-model="towardsList"
                @change="handleCheckboxTowards"
              >
                <el-checkbox :label="item"></el-checkbox>
              </el-checkbox-group>
            </li>
          </ul>
        </div>
      </div>
      <el-divider />
      <div class="house-info">
        <div class="house-head">
          <strong>
            已为您找到 <span>{{ pagination.total }}</span> 套房源
          </strong>
          <a href="javascript:" @click="handleClearAll">清空条件</a>
        </div>
        <div class="house-filter">
          <ul>
            <li
              :class="filter_active === 'default' ? 'filter_active' : ''"
              style="user-select: none"
              @click="handleSort('default')"
            >
              综合排序
            </li>
            <li
              :class="filter_active === 'price' ? 'filter_active' : ''"
              style="user-select: none"
              @click="handleSort('price')"
            >
              价格
              <i
                :class="sort === 1 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              ></i>
            </li>
          </ul>
        </div>
        <ul v-if="houseInfo[0]" class="list">
          <li v-for="item of houseInfo" :key="item._id" class="list-item">
            <div class="left">
              <a
                :href="'/house_detail/' + item.detail_id"
                target="_blank"
                style="text-decoration: none; color: #000;"
              >
                <img :src="item.img_src" alt="展示图" />
              </a>
            </div>
            <div class="center" style="width: 560px">
              <h3 style="cursor: pointer">
                <a
                  :href="'/house_detail/' + item.detail_id"
                  target="_blank"
                  style="text-decoration: none; color: #000;"
                >
                  {{ item.title }}
                </a>
              </h3>
              <p class="description">
                <span v-for="(des, index) of item.description" :key="des">
                  <span v-if="index === item.description.length - 1">
                    {{ des }}
                  </span>
                  <span v-else> {{ des }} / </span>
                </span>
              </p>
              <p style="height: 33px">
                <el-tag v-if="item.tag_decoration" type="info">
                  {{ item.tag_decoration }}
                </el-tag>
              </p>
              <p class="time">
                <i class="el-icon-time"></i>
                {{ item.brand_time }}
              </p>
            </div>
            <div class="right">
              <span class="price">{{ item.price }}</span>
              元/月
            </div>
          </li>
        </ul>
      </div>
      <div class="pagination">
        <el-pagination
          :current-page.sync="pagination.page"
          :page-size="30"
          :total="pagination.total"
          background
          layout="pager, next"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 房源列表 -->

    <el-backtop>
      <i class="el-icon-arrow-up" />
    </el-backtop>
  </div>
</template>

<script>
import HouseNavBar from "@/views/House/childComponent/HouseNavBar";
import {
  getHouseInfo,
  getHouseOfCondition,
  searchHouseInfo
} from "@/api/house";

export default {
  name: "House",
  data() {
    return {
      address: [
        "天河",
        "越秀",
        "荔湾",
        "海珠",
        "番禺",
        "白云",
        "黄埔",
        "从化",
        "增城",
        "花都",
        "南沙"
      ],
      way: ["不限", "整租", "合租"],
      rent: [
        "≤1000",
        "1000-1500",
        "1500-2000",
        "2000-2500",
        "2500-3000",
        "3000-5000",
        "≥5000"
      ],
      type: ["一居", "两居", "三居", "四居+"],
      towards: ["东", "西", "南", "北", "西北"],
      address_active: "",
      way_active: "不限",
      type_active: "",
      rent_active: "",
      towards_active: "",
      typeList: [],
      rentList: [],
      towardsList: [],
      // --------- 分页数据 ------------
      houseInfo: [],
      pagination: {
        page: 1,
        total: 0
      },
      // --- 房源排序过滤 ---
      filter_active: "default",
      sort: 1,
      search_txt: ""
    };
  },
  components: {
    HouseNavBar
  },
  created() {
    this.getHouse();
    if (this.$route.query.sug) {
      this.search_txt = this.$route.query.sug;
      this.handleSearchClick(this.$route.query.sug);
    }
  },
  watch: {
    $route(to, from) {
      if (this.$route.query.sug) {
        this.search_txt = this.$route.query.sug;
        this.handleSearchClick(this.$route.query.sug);
      }
    }
  },
  methods: {
    // 搜索功能
    handleSearchClick(search_txt) {
      this.pagination.page = 1;
      this.search_txt = search_txt;
      searchHouseInfo({
        page: this.pagination.page,
        keyword: search_txt
      })
        .then(res => {
          if (res.errno === 0) {
            this.houseInfo = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 清空搜索框
    handleClear() {
      this.pagination.page = 1;
      this.search_txt = "";
      this.getHouse();
    },
    // ******************* 条件过滤 -S- *******************
    handleClickAddress(item) {
      this.address_active = item;
      this.pagination.page = 1;
      this.filterHouse(res => {
        this.houseInfo = res.data.list;
        this.pagination.total = res.data.total;
      });
    },
    handleClickWay(item) {
      this.pagination.page = 1;
      this.way_active = item;
      this.filterHouse(res => {
        this.houseInfo = res.data.list;
        this.pagination.total = res.data.total;
      });
    },
    handleCheckboxRent(val) {
      this.pagination.page = 1;
      this.rent_active = val[val.length - 1] ? val[val.length - 1] : "";
      this.filterHouse(res => {
        this.houseInfo = res.data.list;
        this.pagination.total = res.data.total;
      });
    },
    handleCheckboxType(val) {
      this.pagination.page = 1;
      this.type_active = val[val.length - 1] ? val[val.length - 1] : "";
      this.filterHouse(res => {
        this.houseInfo = res.data.list;
        this.pagination.total = res.data.total;
      });
    },
    handleCheckboxTowards(val) {
      this.pagination.page = 1;
      this.towards_active = val[val.length - 1] ? val[val.length - 1] : "";
      this.filterHouse(res => {
        this.houseInfo = res.data.list;
        this.pagination.total = res.data.total;
      });
    },
    // ******************* 条件过滤 -E- *******************
    // 页码变化触发
    handleCurrentChange(val) {
      if (
        this.address_active !== "" ||
        this.way_active !== "不限" ||
        this.typeList.length > 0 ||
        this.rentList.length > 0 ||
        this.towardsList.length > 0
      ) {
        this.filterHouse(res => {
          this.houseInfo = res.data.list;
          this.pagination.total = res.data.total;
        });
      } else if (this.search_txt !== "") {
        this.pagination.page = val;
        searchHouseInfo({
          page: this.pagination.page,
          keyword: this.search_txt
        })
          .then(res => {
            if (res.errno === 0) {
              this.houseInfo = res.data.list;
              this.pagination.total = res.data.total;
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.pagination.page = val;
        this.getHouse(res => {
          this.houseInfo = res.data.list;
          this.pagination.total = res.data.total;
        });
      }
    },
    // 清空所有选中条件
    handleClearAll() {
      this.address_active = "";
      this.typeList = [];
      this.rentList = [];
      this.towardsList = [];
      this.way_active = "不限";
      this.pagination.page = 1;
      this.filter_active = "default";
      this.sort = 1;
      if (this.search_txt !== "") {
        window.location.href = "/house";
      }
      this.search_txt = "";
      this.getHouse();
    },
    // 链接到详情页
    handleLinkDetail(id) {
      this.$router.push(`/house_detail/${id}`);
    },
    getHouse() {
      getHouseInfo({ page: this.pagination.page })
        .then(res => {
          this.houseInfo = res.data.list;
          this.pagination.total = res.data.total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSort(item) {
      this.filter_active = item;
      if (item === "default") {
        this.filterHouse(res => {
          this.houseInfo = res.data.list;
          this.pagination.total = res.data.total;
        });
      } else {
        this.sort = this.sort === 1 ? -1 : 1;
        this.filterHouse(res => {
          this.houseInfo = res.data.list;
          this.pagination.total = res.data.total;
        }, this.sort);
      }
    },
    // ****************** 函数封装 *******************
    filterHouse(cb, sort) {
      const postData = sort
        ? {
            page: this.pagination.page,
            address: this.address_active,
            way: this.way_active,
            type: this.typeList,
            towards: this.towardsList,
            rent: this.rentList,
            sort: this.sort
          }
        : {
            page: this.pagination.page,
            address: this.address_active,
            way: this.way_active,
            type: this.typeList,
            towards: this.towardsList,
            rent: this.rentList
          };
      getHouseOfCondition(postData)
        .then(cb)
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#house {
  width: 100%;
}
#house-body {
  width: 1065px;
  margin: 40px auto 0;
  padding-bottom: 40px;
}

.address,
.rent,
.way,
.type,
.towards {
  ul {
    list-style: none;
    display: flex;
    margin-top: 18px;
    user-select: none;
  }

  li {
    margin-left: 24px;

    a {
      text-decoration: none;
      color: #000;

      &:link,
      &:visited {
        color: #000;
      }

      &:hover,
      &:active {
        color: #66aaf8;
      }
    }
  }
}

.head {
  color: #66aaf8;
}

.address-active {
  a {
    color: #66aaf8 !important;
  }
}

.house-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;

  a {
    color: #666;
  }

  span {
    font-size: 24px;
    color: blue;
  }
}

.list {
  list-style: none;
}

.list-item {
  display: flex;
  overflow: hidden;
  padding: 30px 18px;
  border-radius: 6px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 0 14px rgba(0, 0, 0, 0.3);
  }
}

.left {
  img {
    width: 160px;
    height: 122px;
    cursor: pointer;
    border-radius: 8px;
  }
}

.center {
  line-height: 33px;
  margin-left: 40px;

  .description {
    font-size: 14px;
    color: #666;
  }

  .time {
    color: #b7bbc3;
    font-size: 12px;
  }
}

.right {
  color: red;
  font-weight: bold;
}

.price {
  font-size: 24px;
  font-weight: bolder;
}

.pagination {
  display: flex;
  //justify-content: flex-end;
  margin-top: 20px;
}

.house-filter {
  margin-bottom: 20px;
  border-bottom: 1px solid #c2c2c2;

  ul {
    display: flex;
    list-style: none;

    li {
      padding: 10px 20px;
      cursor: pointer;
    }
  }
}

.filter_active {
  color: blue;
  border-bottom: 2px solid blue;
}
</style>
