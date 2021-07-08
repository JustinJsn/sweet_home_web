import Vue from "vue";
import axios from "axios";
import VueRouter from "vue-router";
import NProgress from "nprogress";

import store from "@/store/index";

import "nprogress/nprogress.css";

import { Notification, MessageBox } from "element-ui";

Vue.use(VueRouter);

const Home = () => import("@/views/Home/Home");

const House = () => import("@/views/House/House");
const PerfectHouse = () => import("@/views/House/HousePerfect");

const Send = () => import("@/views/SendHouse/SendHouse");
const ForgotPwd = () => import("@/views/Login/ForgotPwd");
const HouseDetail = () => import("@/views/HouseDetail/HouseDetail");

const Profile = () => import("@/views/Profile/Profile");
const ProfileSetting = () =>
  import("@/views/Profile/childComponent/ProfileSetting");
const ProfileRecord = () =>
  import("@/views/Profile/childComponent/ProfileRecord");
const ProfileVerified = () =>
  import("@/views/Profile/childComponent/ProfileVerified");
const ProfileHome = () => import("@/views/Profile/childComponent/ProfileHome");
const ProfileRental = () =>
  import("@/views/Profile/childComponent/ProfileRental");

const Login = () => import("@/views/Login/Login");
const UserAgreement = () =>
  import("@/views/Login/childComponent/UserAgreement");
const PrivacyAgreement = () =>
  import("@/views/Login/childComponent/PrivacyAgreement");

const LoginSignIn = () => import("@/views/Login/childComponent/LoginSignIn");
const LoginSignUp = () => import("@/views/Login/childComponent/LoginSignUp");

const Message = () => import("@/views/Message/Message");
const UserMessage = () => import("@/views/Message/childComponents/UserMessage");
const SystemMessage = () =>
  import("@/views/Message/childComponents/SystemMessage");
const ContractMessage = () =>
  import("@/views/Message/childComponents/ContractMessage");
const OrderMessage = () =>
  import("@/views/Message/childComponents/OrderMessage");

const Contract = () => import("@/views/Contract/Contract");

const Order = () => import("@/views/Order/Order");
const OrderPay = () => import("@/views/Order/childComponents/OrderPay");
const OrderHistory = () => import("@/views/Order/childComponents/OrderHistory");

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    redirect: "/signIn",
    children: [
      {
        path: "/signIn",
        name: "Sign in",
        component: LoginSignIn
      },
      {
        path: "/signUp",
        name: "Sign up",
        component: LoginSignUp
      }
    ]
  },
  {
    path: "/home",
    name: "Home",
    component: Home
  },
  {
    path: "/house",
    name: "House",
    component: House
  },
  {
    path: "/house/?sug=:sug",
    name: "House_Sug",
    component: House
  },
  {
    path: "/house_detail/:id",
    name: "House Detail",
    component: HouseDetail
  },
  {
    path: "/send",
    name: "Send",
    component: Send,
    meta: {
      requiredAuth: true
    }
  },
  {
    path: "/forgot_pwd",
    name: "Forgot Password",
    component: ForgotPwd
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      requiredAuth: true
    },
    redirect: "/account/home",
    children: [
      {
        path: "/account/home",
        name: "Account Home",
        component: ProfileHome
      },
      {
        path: "/account/setting",
        name: "Account Setting",
        component: ProfileSetting
      },
      {
        path: "/account/record",
        name: "Account Record",
        component: ProfileRecord
      },
      {
        path: "/account/verified",
        name: "Account Verified",
        component: ProfileVerified
      },
      {
        path: "/account/rental",
        name: "Account Rental",
        component: ProfileRental
      }
    ]
  },
  {
    path: "/userAgreement",
    name: "User Agreement",
    component: UserAgreement
  },
  {
    path: "/privacyAgreement",
    name: "Privacy Agreement",
    component: PrivacyAgreement
  },
  {
    path: "/message",
    name: "Message",
    component: Message,
    redirect: "/userMessage",
    meta: {
      requiredAuth: true
    },
    children: [
      {
        path: "/userMessage",
        name: "User Message",
        component: UserMessage,
        meta: {
          requiredAuth: true
        }
      },
      {
        path: "/systemMessage",
        name: "System Message",
        component: SystemMessage,
        meta: {
          requiredAuth: true
        }
      },
      {
        path: "/contractMessage",
        name: "Contract Message",
        component: ContractMessage,
        meta: {
          requiredAuth: true
        }
      },
      {
        path: "/orderMessage",
        name: "Order Message",
        component: OrderMessage,
        meta: {
          requiredAuth: true
        }
      },
      {
        path: "/reminderMessage",
        name: "Reminder Message",
        component: () => import('../views/Message/childComponents/ReminderMessage.vue'),
        meta: {
          requiredAuth: true
        }
      }
    ]
  },
  {
    path: "/house/prefectInfo/:id",
    name: "Perfect House",
    component: PerfectHouse
  },
  {
    path: "/contract/:id",
    name: "Contract",
    component: Contract
  },
  {
    path: "/order",
    name: "Order",
    component: Order,
    redirect: "/order/pay",
    children: [
      {
        path: "/order/pay",
        name: "OrderPay",
        component: OrderPay
      },
      {
        path: "/order/history",
        name: "OrderHistory",
        component: OrderHistory
      }
    ]
  },
  {
    path: "*",
    name: "404",
    component: () => import("@/views/404/404")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  NProgress.start();

  const userInfo = JSON.parse(localStorage.getItem("SH_userInfo"));

  if (
    to.path === "/signIn" ||
    to.path === "/forgot_pwd" ||
    to.path === "/signUp"
  ) {
    if (userInfo) {
      if (to.path === "/forgot_pwd" || from.path === "/forgot_pwd") {
        next("/");
        return;
      }
      next("/");
    }
    localStorage.setItem("preRoute", router.currentRoute.fullPath);
    next();
    return;
  }
  if (userInfo) {
    // 若用户在后台被删除，删除本地缓存数据跳转到首页
    let url = "http://api.justinjsn.cn/api/v1/user/check";
    axios
      .get(url, {
        params: {
          _id: userInfo._id
        }
      })
      .then(res => {
        switch (res.data.errno) {
          case 0:
            next();
            break;
          case 10200:
            Notification({
              title: "失败",
              message: "该用户不存在，请重新登录",
              type: "error",
              duration: 1500
            });
            localStorage.removeItem("SH_userInfo");
            localStorage.removeItem("SH_token");
            store.dispatch("setUser", null);
            window.location.href = "/";
            break;
        }
      })
      .catch(err => {
        console.log(err);
      });

    next();
  } else {
    if (to.path === "/profile" || /^\/account/i.test(to.path)) {
      next("/");

      return;
    }
    if (to.meta.requiredAuth) {
      MessageBox.alert('请先前往登录', '用户未登录').then(() => {
        next({
          path: "/login"
        });
      }).catch(() => {
        next({ path: "/login" });
      });
      return;
    }
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
