import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import state from "@/store/state";
import getters from "@/store/getters";
import mutations from "@/store/mutations";
import actions from "@/store/actions";

const options = {
  state,
  getters,
  actions,
  mutations
};

export default new Vuex.Store(options);
