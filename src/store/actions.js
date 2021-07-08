export default {
  setUser: ({ commit }, user) => {
    commit("userStatus", user);
  },

  token_set: ({ commit }, token) => {
    commit("setToken", token);
  }
};
