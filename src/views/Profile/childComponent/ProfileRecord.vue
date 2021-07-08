<template>
  <div id="profile-record">
    <el-table :data="list" style="width: 100%">
      <el-table-column label="房源" width="340">
        <template slot-scope="scope">
          <router-link
            class="link"
            :to="'/house_detail/' + scope.row.house.detail_id"
          >
            <div class="house-box">
              <div class="left">
                <img :src="scope.row.house.img_src" alt="房源图片" />
              </div>
              <div class="right">
                <p class="title">{{ scope.row.house.title }}</p>
                <el-tag v-show="scope.row.house.tag_decoration" size="mini">{{
                    scope.row.house.tag_decoration
                  }}</el-tag>
              </div>
            </div>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="支付金额" width="180">
        <template slot-scope="scope">
          <span class="price">
            {{ Number(scope.row.price).toFixed(2) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="租期">
        <template slot-scope="scope">
          <div class="time">
            <span>
              {{ scope.row.payment_time | formatDate }}
            </span>
            -
            <span>
              {{ scope.row.expire_time | formatDate }}
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { deleteOrder, getLease } from "@/api/order";

export default {
  name: "ProfileRecord",
  data: () => ({
    list: [],
    select: []
  }),
  created() {
    this.token = JSON.parse(localStorage.getItem("SH_token"));
    this.userInfo = JSON.parse(localStorage.getItem("SH_userInfo"));

    this.getOrderList();
  },
  watch: {
    $route() {
      this.token = JSON.parse(localStorage.getItem("SH_token"));
      this.userInfo = JSON.parse(localStorage.getItem("SH_userInfo"));
    }
  },
  filters: {
    formatDate(date, str) {
      date = new Date(date);

      const Year = date.getFullYear();
      const Month =
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1;
      const Day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

      const Hours =
        date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
      const Minutes =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      const Seconds =
        date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

      switch (str) {
        case "YY-MM-DD hh:mm:ss":
          return `${Year}-${Month}-${Day} ${Hours}:${Minutes}:${Seconds}`;
        case "YY/MM/DD hh:mm:ss":
          return `${Year}/${Month}/${Day} ${Hours}:${Minutes}:${Seconds}`;
        case "YY-MM-DD":
          return `${Year}-${Month}-${Day}`;
        case "YY/MM/DD":
          return `${Year}/${Month}/${Day} ${Hours}:${Minutes}:${Seconds}`;
        case "hh:mm:ss":
          return `${Hours}:${Minutes}:${Seconds}`;
        default:
          return `${Year}年${Month}月${Day}日 ${Hours}:${Minutes}`;
      }
    }
  },
  methods: {
    getOrderList() {
      getLease(
        {
          user: this.userInfo._id,
          status: true
        },
        this.token
      )
        .then(res => {
          this.list = res.data.list;
        })
        .catch(err => {
          console.log(err);
        });
    },

    handleDel(val) {
      this.$confirm("确定删除订单吗？该操作确认后将无法撤销", "删除订单", {
        cancelButtonText: "取消",
        confirmButtonText: "确定"
      })
        .then(() => {
          deleteOrder({ id: val._id }, this.token).then(res => {
            switch (res.errno) {
              case 0:
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.getOrderList();
                break;
              default:
                this.$message({
                  message: "支付失败",
                  type: "error"
                });
                break;
            }
          });
        })
        .catch(() => {});
    },

    handleSelectionChange(val) {
      this.select = val;
    },

    handleDeleteMany() {
      if (this.select.length === 0) {
        this.$alert("请选择一个订单信息", "操作错误");
        return;
      }
      this.$confirm("确定删除订单吗？该操作确认后将无法撤销", "删除订单", {
        cancelButtonText: "取消",
        confirmButtonText: "确定"
      })
        .then(() => {
          for (let i = 0, len = this.select.length; i < len; i++) {
            deleteOrder({ id: this.select[i]._id }, this.token).then(res => {
              if (i === this.select.length - 1) {
                switch (res.errno) {
                  case 0:
                    this.$message({
                      message: "删除成功",
                      type: "success"
                    });
                    this.getOrderList();
                    break;
                  default:
                    this.$message({
                      message: "支付失败",
                      type: "error"
                    });
                    break;
                }
              }
            });
          }
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>

.house-box {
  display: flex;

  .left {
    img {
      width: 75px;
      height: 65px;
      border-radius: 4px;
    }
  }
  .right {
    line-height: 2;
    padding: 4px 0;
    margin-left: 12px;
  }
}

a {
  text-decoration: none;
  color: #62acc4;
}

.price {
  font-size: 18px;
  color: red;
}

.time {
  display: flex;
  flex-direction: column;
}
.right .title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 220px;
}

::v-deep .el-table__row {
  border-bottom: 1px solid #000;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
/* Track */
::-webkit-scrollbar-track {
  background: rgb(255, 255, 255);
  border-radius: 8px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #c9c9ca;
  border-radius: 8px;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(162, 162, 163);
}
</style>
