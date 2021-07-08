<template>
  <div id="message">
    <house-detail-nav-bar />

    <div class="body">
      <div class="left">
        <div class="banner">
          <ul>
            <router-link
              v-for="item of linkList"
              :key="item.text"
              :to="item.link"
              custom
              v-slot="{ navigate, isActive, isExactActive }"
            >
              <li
                @click="navigate"
                @mousedown="handlerRead"
                :class="[
                  isActive && 'router-link-active',
                  isExactActive && 'router-link-exact-active'
                ]"
                :data-handler="item.handler"
              >
                <span :data-handler="item.handler">{{ item.text }}</span>
                <el-badge :value="item.value" :data-handler="item.handler" />
              </li>
            </router-link>
          </ul>
        </div>
      </div>

      <router-view class="right" />
    </div>
  </div>
</template>

<script>
import HouseDetailNavBar from "../HouseDetail/childComponent/HouseDetailNavBar.vue"
import { getUnreadNum, uploadRead } from "@/api/message"

export default {
  name: "Message",
  components: {
    HouseDetailNavBar
  },
  data: () => ({
    linkList: [
      { link: "/userMessage", text: "用户消息", value: null, handler: "userRead" },
      {
        link: "/systemMessage",
        text: "系统消息",
        value: null,
        handler: "systemRead"
      },
      {
        link: "/contractMessage",
        text: "合同消息",
        value: null,
        handler: "contractRead"
      },
      {
        link: "/orderMessage",
        text: "订单消息",
        value: null,
        handler: "orderRead"
      },
      {
        link: "/reminderMessage",
        text: "租期提醒",
        value: null,
        handler: "reminderRead"
      }
    ]
  }),
  created () {
    this.token = JSON.parse(localStorage.getItem("SH_token"))
    this.userInfo = JSON.parse(localStorage.getItem("SH_userInfo"))

    // 用户信息
    this.unread('only', 0)
    // 系统信息
    this.unread('all', 1)
    // 合同信息
    this.unread('owner_contract', 2)
    // 订单信息
    this.unread('order', 3)
    // 到期提醒
    this.unread('prompt', 4)
  },
  watch: {
    $route () {
      this.token = JSON.parse(localStorage.getItem("SH_token"))
      this.userInfo = JSON.parse(localStorage.getItem("SH_userInfo"))

      // 用户信息
      this.unread('only', 0)
      // 系统信息
      this.unread('all', 1)
      // 合同信息
      this.unread('owner_contract', 2)
      // 订单信息
      this.unread('order', 3)
      // 到期提醒
      this.unread('prompt', 4)
    }
  },
  methods: {
    unread (type, index) {
      getUnreadNum(
        {
          user_id: this.userInfo._id,
          type
        },
        this.token
      )
        .then(res => {
          this.linkList[index].value = res.data.total > 0 ? res.data.total : null
        })
        .catch(err => {
          console.log(err)
        })
    },

    handlerRead (e) {
      const handler = e.target.dataset.handler

      switch (handler) {
        case "userRead":
          uploadRead(
            {
              user_id: this.userInfo._id,
              type: "only"
            },
            this.token
          )
            .then(res => {
              this.linkList[0].value = null
            })
            .catch(err => {
              console.log(err)
            })
          break
        case "systemRead":
          uploadRead(
            {
              user_id: this.userInfo._id,
              type: "all"
            },
            this.token
          )
            .then(res => {
              this.linkList[1].value = null
            })
            .catch(err => {
              console.log(err)
            })
          break
        case "contractRead":
          uploadRead(
            {
              user_id: this.userInfo._id,
              type: "owner_contract"
            },
            this.token
          )
            .then(res => {
              this.linkList[2].value = null
            })
            .catch(err => {
              console.log(err)
            })
          break
        case "orderRead":
          uploadRead(
            {
              user_id: this.userInfo._id,
              type: "order"
            },
            this.token
          )
            .then(res => {
              this.linkList[3].value = null
            })
            .catch(err => {
              console.log(err)
            })
          break
        case "reminderRead":
          uploadRead(
            {
              user_id: this.userInfo._id,
              type: "prompt"
            },
            this.token
          )
            .then(res => {
              this.linkList[3].value = null
            })
            .catch(err => {
              console.log(err)
            })
          break
        default:
          break
      }
    }
  }
};
</script>

<style scoped lang="scss">
.body {
  width: 1065px;
  margin: 40px auto 0;
}

::v-deep .el-badge__content.is-fixed {
  top: 8px;
}

.body {
  display: flex;

  .left {
    width: 20%;
    height: 470px;
    border-radius: 4px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  }

  .right {
    width: 80%;
    height: 550px;
    overflow: auto;
    padding: 20px 10px;
    margin-left: 20px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  }
}

.banner {
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
      span {
        padding-left: 40px;
      }
    }
  }
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
