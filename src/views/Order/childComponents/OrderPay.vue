<template>
  <div id="pay">
    <el-button style="margin: 0 0 20px 10px;" @click="handleDeleteMany" size="medium">批量删除</el-button>

    <el-table :data="list" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" />

      <el-table-column label="房源" width="340" header-align="center">
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
                <p>{{ scope.row.house.title }}</p>
                <el-tag v-show="scope.row.house.tag_decoration" size="mini">{{
                  scope.row.house.tag_decoration
                }}</el-tag>
              </div>
            </div>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="支付金额" width="200">
        <template slot-scope="scope">
          <span class="price">
            {{ Number(scope.row.price).toFixed(2) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handlePay(scope.row)">
            支付
          </el-button>
          <el-button size="mini" type="danger" @click="handleDel(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getOrder, pay, deleteOrder } from "@/api/order";

export default {
  name: "OrderPay",
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
  methods: {
    getOrderList() {
      getOrder(
        {
          user: this.userInfo._id,
          status: false
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

    handlePay(val) {
      this.$confirm("您正在完成支付操作", "支付中...", {
        cancelButtonText: "取消",
        confirmButtonText: "确定"
      })
        .then(() => {
          pay({ id: val._id }, this.token).then(res => {
            switch (res.errno) {
              case 0:
                this.$message({
                  message: "支付成功",
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
        .catch(() => {
          this.$message({
            message: "取消支付",
            type: "warning"
          });
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
                  type: "success",
                });
                this.getOrderList();
                break;
              default:
                this.$message({
                  message: "支付失败",
                  type: "error",
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
                      type: "success",
                    });
                    this.getOrderList();
                    break;
                  default:
                    this.$message({
                      message: "支付失败",
                      type: "error",
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

<style scoped lang="scss">
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
