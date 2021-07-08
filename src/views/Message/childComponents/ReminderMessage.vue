<template>
  <div id="reminder">
    <el-button
      type="text"
      icon="el-icon-delete"
      @click="handleDeleteAll"
      style="margin: 0 0 15px 10px;"
    >一键清空</el-button
    >

    <div class="body">
      <el-card v-for="item of messageList" :key="item._id">
        <template slot="header">
          <div class="card-body-item">
            <div class="left">
              {{ item.title }}
              <span class="time">
                {{ item.create_time | formatDate }}
              </span>
            </div>
            <div class="right">
              <el-button type="text" @click="handleDeleteOne(item._id)"><i class="el-icon-delete"/></el-button>
            </div>
          </div>
        </template>
        <p class="message">
          {{ item.message }}
        </p>
      </el-card>
    </div>
  </div>
</template>
<script>
import {delMany, delOne, getInfoList, uploadRead} from "@/api/message";

export default {
  name: "ReminderMessage",
  data() {
    return {
      messageList: []
    }
  },
  created() {
    this.userInfo = JSON.parse(localStorage.getItem("SH_userInfo"));
    this.token = JSON.parse(localStorage.getItem("SH_token"));

    this.getMessageList();
  },
  methods: {
    // 获取信息
    getMessageList() {
      getInfoList(
        {
          user_id: this.userInfo._id,
          type: "prompt"
        },
        this.token
      )
        .then(res => {
          this.messageList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    read() {
      uploadRead(
        {
          user_id: this.userInfo._id,
          type: "prompt"
        },
        this.token
      )
        .then(res => res)
        .catch(err => {
          console.log(err);
        });
    },

    handleDeleteAll() {
      this.$confirm("是否清空所有信息，该操作确认后无法撤销", "清空所有信息", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        iconClass: "el-icon-delete"
      })
        .then(() => {
          delMany(
            {
              user_id: this.userInfo._id,
              type: "prompt"
            },
            this.token
          )
            .then(res => {
              switch (res.errno) {
                case 0:
                  this.$message({
                    message: "已全清空",
                    type: "success",
                    duration: 1000
                  });
                  this.getMessageList();
                  break;
                default:
                  this.$message({
                    message: "出错了",
                    type: "warning",
                    duration: 1000
                  });
                  break;
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },

    handleDeleteOne(id) {
      this.$confirm("是否删除信息，该操作确认后无法撤销", "删除信息", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        iconClass: "el-icon-delete"
      })
        .then(() => {
          delOne(
            {id},
            this.token
          )
            .then(res => {
              switch (res.errno) {
                case 0:
                  this.$message({
                    message: "消息已删除",
                    type: "success",
                    duration: 1000
                  });
                  this.getMessageList();
                  break;
                default:
                  this.$message({
                    message: "出错了",
                    type: "warning",
                    duration: 1000
                  });
                  break;
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
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
  }
};
</script>
<style lang="scss" scope>
#user-message {
  position: relative;
}

.body {
  padding-bottom: 20px;
}

.el-card {
  margin-bottom: 14px;
}

::v-deep .el-card__header {
  padding: 8px 20px;
}
.message {
  padding: 20px 0;
  font-size: 14px;
  color: #929292;
}

.time {
  font-size: 12px;
  color: #c2c2c2;
  margin-left: 10px;
}

.link {
  text-decoration: none;
  color: #1389bf;
  &:hover {
    color: lighten(#1389bf, 20%);
  }
}
.card-body-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>