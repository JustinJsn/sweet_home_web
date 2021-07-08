export default {
  userStatus: (state, user) => {
    if (user) {
      state.currentUser = user;
      state.isLogin = true;
    } else if (user === null) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("userInfo");
      state.currentUser = null;
      state.isLogin = false;
    }
  },

  setToken: (state, token) => {
    if (token) {
      state.token = token;
    }
  }
};
