import axios from "axios";
import store from "@/store/index";
import { Loading } from "element-ui";

let loadingInstance;

const serve = axios.create({
  baseURL: "http://api.justinjsn.cn/api/v1",
  timeout: 8000,
  withCredentials: true,
  validateStatus(status) {
    return status <= 500;
  }
});

// 请求拦截，如果需要向服务器发送头部信息可在此处添加
serve.interceptors.request.use(
  config => {
    if (config.url === "/auth/real") {
      loadingInstance = Loading.service({
        fullscreen: true,
        text: "认证中...",
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    }

    return config;
  },
  err => {
    console.error(err);
    return err;
  }
);

// 响应拦截，可以处理服务器发送过来的响应信息
serve.interceptors.response.use(
  res => {
    if (res.headers.authorization) {
      let preUserInfo = JSON.parse(localStorage.getItem("SH_userInfo"));
      preUserInfo.token = res.headers.authorization;
      localStorage.setItem("SH_userInfo", JSON.stringify(preUserInfo));
      localStorage.setItem(
        "SH_token",
        JSON.stringify(res.headers.authorization)
      );
    }

    if (res.status === 401) {
      window.localStorage.removeItem("SH_token");
      window.localStorage.removeItem("SH_userInfo");

      // store.commit("userStatus", null);
      // window.location.href = "/";
    }

    if (res.config.url === "/auth/real") {
      loadingInstance.close();
    }

    return res.data;
  },
  err => {
    console.log(err);
    return err;
  }
);

export default serve;
