import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BaiduMap from "vue-baidu-map";

import VueCookies from "vue-cookies";

import "@/assets/css/global.css";

import element from './components/element/index'
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;


Vue.use(BaiduMap, {
  ak: "BKEjpUmYa1kM6UPqWtfn583aoleWQXPr"
});

Vue.use(VueCookies);
Vue.use(element);
Vue.$cookies.config();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
